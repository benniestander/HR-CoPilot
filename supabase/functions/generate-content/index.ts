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

    const apiKey = Deno.env.get('API_KEY') || Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_API_KEY');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server Configuration Error: Missing API_KEY' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Initialize with safe ESM import
    const genAI = new GoogleGenerativeAI(apiKey);

    // Parse Request
    const { model, prompt, stream, config } = await req.json();

    // Prioritize the requested model, but fall back to a known stable one if it's missing
    // We will attempt to use EXACTLY what the client sends.
    const targetModel = model || 'gemini-1.5-flash';

    console.log(`Generating content using model: ${targetModel}`);

    const generativeModel = genAI.getGenerativeModel({
      model: targetModel,
      generationConfig: config
    });

    if (stream) {
      const result = await generativeModel.generateContentStream(prompt);
      const response = result.stream;

      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              const text = chunk.text();

              if (text) {
                controller.enqueue(new TextEncoder().encode(JSON.stringify({ text }) + '\n'));
              }
            }
            controller.close();
          } catch (e) {
            console.error("Stream Runtime Error:", e);
            const errorMsg = e instanceof Error ? e.message : 'Unknown stream error';
            try {
              controller.enqueue(new TextEncoder().encode(JSON.stringify({ error: errorMsg }) + '\n'));
            } catch { }
            controller.error(e);
          }
        },
      });

      return new Response(readable, {
        headers: { ...corsHeaders, 'Content-Type': 'application/x-ndjson' },
      });
    } else {
      const result = await generativeModel.generateContent(prompt);
      const output = result.response;
      return new Response(JSON.stringify(output), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error: any) {
    console.error("Generate Content Critical Error:", error);
    // CRITICAL: Return the actual error message so we can diagnose "Model not found" etc.
    return new Response(JSON.stringify({
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
