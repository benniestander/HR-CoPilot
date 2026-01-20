// @ts-ignore
declare const Deno: any;

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: any) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const authHeader = req.headers.get('Authorization')!;
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        const apiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_API_KEY');
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Server Configuration Error: Missing API_KEY' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Initialize Gemini 1.5 Pro
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        // Parse Multi-part Form Data
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const documentName = file.name;

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Fetch Law Context from Database
        const { data: lawModules } = await supabaseClient
            .from('law_modules')
            .select('title, category, content');

        const contextString = lawModules?.map(m => `--- ${m.title} (${m.category}) ---\n${m.content}`).join('\n\n') || '';

        // Convert file to Base64 for Gemini
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

        // System Persona and Instructions
        const systemPrompt = `
      You are an expert South African Labor Law Consultant (Senior SLC) with 20 years of experience in CCMA litigation and BCEA compliance.
      
      TASK: Audit the provided HR Policy/Contract against South African Labor Law (LRA, BCEA, POPIA).
      
      CORS CONTEXT:
      ${contextString}
      
      DIRECTIVES:
      1. Identify "Red Flags" (High Risk legal issues).
      2. Cite specific Act sections (e.g., 'Section 37 of the BCEA').
      3. Provide a "Correction" for each issue found.
      4. Rate the document's overall compliance score from 0 to 100.
      5. Include a Legal Disclaimer.
      6. POPIA COMPLIANCE: Scrub all Personally Identifiable Information (PII) like specific Names, ID numbers, or Contacts from the 'issue' and 'correction' fields. Use general placeholders like [EMPLOYEE_NAME] if necessary.

      OUTPUT FORMAT:
      You must return a valid JSON object with this structure:
      {
        "score": number,
        "summary": "overall summary string",
        "red_flags": [
          { "issue": "string", "law": "string", "impact": "High/Medium/Low", "correction": "string" }
        ],
        "disclaimer": "mandatory legal disclaimer"
      }
    `;

        // Call Gemini
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            },
            systemPrompt
        ]);

        const responseText = result.response.text();
        const auditResult = JSON.parse(responseText);

        // Save Result to Database
        const { data: report, error: dbError } = await supabaseClient
            .from('auditor_reports')
            .insert({
                user_id: user.id,
                document_name: documentName,
                audit_result: auditResult,
                overall_score: auditResult.score,
                status: 'completed'
            })
            .select()
            .single();

        if (dbError) throw dbError;

        return new Response(JSON.stringify(report), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("Auditor Error:", error);
        return new Response(JSON.stringify({
            error: error.message,
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
