// @ts-ignore
declare const Deno: any;

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: any) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    try {
        const authHeader = req.headers.get('Authorization')!;
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user } } = await supabaseClient.auth.getUser();
        const apiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_API_KEY');

        if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");

        // --- 1. PREPARE FILE ---
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) throw new Error("No file uploaded.");

        const arrayBuffer = await file.arrayBuffer();
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

        // --- 2. FETCH RAG CONTEXT ---
        const { data: lawModules } = await supabaseClient.from('law_modules').select('content');
        const context = lawModules?.map(m => m.content).join('\n') || '';

        // --- 3. CALL GEMINI (Direct REST - Fixed Snake_Case) ---
        console.log("Calling Gemini v1 REST API (Fixed)...");

        const payload = {
            contents: [{
                parts: [
                    { inline_data: { mime_type: file.type || "application/pdf", data: base64Data } },
                    { text: `System: You are an HR Auditor. Cross-reference this document with SA Law: ${context}. Return valid JSON with: score, summary, red_flags: [{issue, law, impact, correction}], disclaimer.` }
                ]
            }],
            generation_config: {
                response_mime_type: "application/json",
                temperature: 0.1
            }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        const result = await response.json();

        if (result.error) {
            console.error("Gemini API Error Detail:", JSON.stringify(result.error, null, 2));
            throw new Error(`Google API Error: ${result.error.message}`);
        }

        // --- 4. PARSE & PROTECT ---
        let responseText = result.candidates[0].content.parts[0].text;

        // Safety: Sometimes AI still adds markdown blocks even with mimeType set
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const auditResult = JSON.parse(cleanJson);

        // --- 5. SAVE ---
        const { data: report, error: dbError } = await supabaseClient
            .from('auditor_reports')
            .insert({
                user_id: user?.id,
                document_name: file.name,
                audit_result: auditResult,
                overall_score: auditResult.score || 0,
                status: 'completed'
            })
            .select()
            .single();

        if (dbError) throw dbError;

        return new Response(JSON.stringify(report), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("Critical Failure:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
