// @ts-ignore
declare const Deno: any;

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'
import mammoth from 'https://esm.sh/mammoth'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: any) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const authHeader = req.headers.get('Authorization')!;
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user } } = await supabaseClient.auth.getUser()
        const apiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('API_KEY') || Deno.env.get('GOOGLE_API_KEY');

        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) throw new Error("No file uploaded");

        const fileType = file.type;
        const arrayBuffer = await file.arrayBuffer();

        // 1. Fetch Legal Context
        const { data: lawModules } = await supabaseClient.from('law_modules').select('content');
        const context = lawModules?.map(m => m.content).join('\n') || '';

        // 2. Prepare Tooling
        const genAI = new GoogleGenerativeAI(apiKey!);
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.1
            }
        });

        // 3. IMPROVED PROMPT (SLC LOGIC + POSITIVE FINDINGS)
        const systemPrompt = `
        SYSTEM: You are a Senior Labour Consultant (SLC) in South Africa.
        TASK: Audit the provided document for compliance with SA Labour Law.
        Retrieved Legal Context: 
        ${context}

        AUDIT RULES:
        1. BE FAIR: If a policy is technically compliant (e.g., "15 working days leave"), do NOT flag it as an error.
        2. IMPACT LEVELS: 'High' (Illegal), 'Medium' (Risk), 'Low' (Improvement).
        3. OUTPUT: Return valid JSON with:
        {
          "score": number (0-100),
          "summary": "Brief executive summary",
          "red_flags": [{"issue": "...", "law": "...", "impact": "High/Medium/Low", "correction": "..."}],
          "positive_findings": [{"finding": "...", "law": "...", "benefit": "..."}],
          "disclaimer": "Standard SLC legal disclaimer"
        }
        `;

        let parts: any[] = [];

        // 4. HANDLE DIFFERENT FILE TYPES (Correct Binary vs Text)
        if (fileType === "application/pdf") {
            const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            parts = [
                { inlineData: { data: base64Data, mimeType: "application/pdf" } },
                { text: systemPrompt }
            ];
        } else if (fileType.includes("word") || fileType.includes("officedocument")) {
            const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            parts = [
                { text: `DOCUMENT CONTENT:\n${result.value}\n\n${systemPrompt}` }
            ];
        } else {
            const text = new TextDecoder().decode(arrayBuffer);
            parts = [
                { text: `DOCUMENT CONTENT:\n${text}\n\n${systemPrompt}` }
            ];
        }

        console.log(`[DISPATCH] Auditing ${file.name} (${fileType})...`);
        const aiResult = await model.generateContent(parts);
        const responseText = aiResult.response.text();
        const auditResult = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());

        // 5. Save
        const { data: report, error: dbError } = await supabaseClient
            .from('auditor_reports')
            .insert({
                user_id: user?.id,
                document_name: file.name,
                audit_result: auditResult,
                overall_score: auditResult.score || 0,
                status: 'completed'
            })
            .select().single();

        if (dbError) throw dbError;

        return new Response(JSON.stringify(report), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error("Critical Failure:", error.message);
        return new Response(JSON.stringify({
            error: error.message,
            hint: "Check logs for detail."
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
