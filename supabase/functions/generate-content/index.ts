// @ts-ignore
declare const Deno: any;

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenAI } from 'npm:@google/genai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verify User (Security: Key used only on server)
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

    // 2. Initialize Gemini with Server-Side Key
    const apiKey = Deno.env.get('API_KEY') || Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_API_KEY');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server Configuration Error: Missing API_KEY' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Initialize the new Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Parse request body
    const { model, prompt, stream, config } = await req.json();

    // Default to a safe model if none provided, but frontend sends 'gemini-3.5-flash' now
    const targetModel = model || 'gemini-1.5-flash';

    // 3. Call AI
    if (stream) {
      const response = await ai.models.generateContentStream({
        model: targetModel,
        contents: prompt,
        config: config
      });

      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              let text = '';

              // -------- CRITICAL FIX: SDK TEXT EXTRACTION --------
              // The new SDK can return text as a function OR a property depending on the version/response type.
              if (typeof chunk.text === 'function') {
                text = chunk.text();
              } else if (typeof chunk.text === 'string') {
                text = chunk.text;
              } else if (chunk.candidates?.[0]?.content?.parts?.[0]?.text) {
                text = chunk.candidates[0].content.parts[0].text;
              }
              // ----------------------------------------------------

              const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;

              if (text || groundingMetadata) {
                // Send raw chunks as JSON
                controller.enqueue(new TextEncoder().encode(JSON.stringify({ text, groundingMetadata }) + '\n'));
              }
            }
            controller.close();
          } catch (e) {
            console.error("Stream Error", e);
            const errorMsg = e instanceof Error ? e.message : 'Unknown stream error';
            try { controller.enqueue(new TextEncoder().encode(JSON.stringify({ error: errorMsg }) + '\n')); } catch { }
            controller.error(e);
          }
        },
      });

      return new Response(readable, {
        headers: { ...corsHeaders, 'Content-Type': 'application/x-ndjson' },
      });
    } else {
      // Non-streaming fallback
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: prompt,
        config: config
      });
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error: any) {
    console.error("Generate Content Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
