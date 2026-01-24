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

        // 1. CONTENT HASHING (Prevent wording drift & expensive re-audits)
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const contentHash = Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        // 2. CACHE CHECK: Check for existing report with this hash for this user
        const { data: existingReport } = await supabaseClient
            .from('auditor_reports')
            .select('*')
            .eq('user_id', user?.id)
            .eq('content_hash', contentHash)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (existingReport) {
            console.log(`[CACHE] Found existing consistent report for ${file.name} (Hash: ${contentHash.substring(0, 8)})`);
            return new Response(JSON.stringify(existingReport), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // 3. Fetch Legal Context
        const { data: lawModules } = await supabaseClient.from('law_modules').select('content');
        const context = lawModules?.map(m => m.content).join('\n') || '';

        // 4. Prepare Tooling
        const genAI = new GoogleGenerativeAI(apiKey!);
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.0 // DETERMINISTIC: Fixes hallucinated wording drift
            }
        });

        // 3. STRICT COMPLIANCE RUBRIC (SLC LOGIC + BINARY VALIDATION)
        const systemPrompt = `
        SYSTEM: You are a Lead Forensic Labour Auditor in South Africa.
        TASK: Perform a high-precision compliance audit on the provided document using the Law context below.
        
        RELEVANT LEGAL CONTEXT:
        ${context}

        SOVEREIGN RULES (NON-NEGOTIABLE):
        1. NO-REWRITE MANDATE: If a clause is legally compliant with the BCEA, LRA, and EEA, you are STRICTLY FORBIDDEN from suggesting wording changes or stylistic improvements. Change ONLY what is illegal or a critical risk.
        2. BINARY COMPLIANCE: Evaluate against legal requirements. A finding is either PASS or FAIL.
        3. SOUTH AFRICAN SOVEREIGNTY: Do not apply US or UK standards. Only apply South African law.
        
        MANDATORY ANALYSIS POINTS (2024-2025):
        - BCEA Threshold: R254,371.67 p/a.
        - Parental Leave (Van Wyk Judgment): Shared 4 months + 10 days for all parents. Siloing into 'Maternity' is now a RISK.
        - Notice Periods: BCEA Section 37 (1 wk < 6mo, 2 wks 6mo-1yr, 4 wks > 1yr).
        - Direct Marketing (POPIA 2025): No voice-call marketing without opt-in.
        
        OUTPUT FORMAT (STRICT JSON):
        {
          "score": number (0-100),
          "summary": "One sentence executive summary",
          "red_flags": [
            {
              "issue": "Specific legal violation found",
              "law": "Specific Act and Section violated",
              "impact": "High (Illegal) | Medium (Risk)",
              "correction": "The EXACT legal wording required to fix the violation. DO NOT suggest multiple options."
            }
          ],
          "positive_findings": [
            {
              "finding": "Specific compliant section found",
              "law": "The Act it complies with",
              "benefit": "Legal protection provided"
            }
          ],
          "disclaimer": "Standard SLC legal disclaimer"
        }
        
        INSTRUCTIONS: If the document is 100% compliant, red_flags must be an empty array [].
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

        // 5. Save with Hash
        const { data: report, error: dbError } = await supabaseClient
            .from('auditor_reports')
            .insert({
                user_id: user?.id,
                document_name: file.name,
                audit_result: auditResult,
                overall_score: auditResult.score || 0,
                content_hash: contentHash,
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
