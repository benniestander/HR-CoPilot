
// @ts-ignore
declare const Deno: any;

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenAI } from 'https://esm.sh/@google/genai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verify User (CRIT-2 Security: Key used only on server)
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    // 2. Initialize Gemini with Server-Side Key
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('Missing Gemini API Key');
    
    const ai = new GoogleGenAI({ apiKey });
    const { model, prompt, stream, config } = await req.json();

    const requestConfig = config || {};

    // 3. Call AI
    if (stream) {
      const response = await ai.models.generateContentStream({
        model: model || 'gemini-2.5-flash',
        contents: prompt,
        config: requestConfig
      });

      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              const text = chunk.text;
              // CRITICAL: Extract grounding metadata to pass to client
              const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
              
              if (text || groundingMetadata) {
                // Send raw chunks as JSON
                controller.enqueue(new TextEncoder().encode(JSON.stringify({ text, groundingMetadata }) + '\n'));
              }
            }
            controller.close();
          } catch (e) {
            controller.error(e);
          }
        },
      });

      return new Response(readable, {
        headers: { ...corsHeaders, 'Content-Type': 'application/x-ndjson' },
      });
    } else {
      const response = await ai.models.generateContent({
        model: model || 'gemini-2.5-flash',
        contents: prompt,
        config: requestConfig
      });
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
