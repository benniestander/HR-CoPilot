
// @ts-ignore
declare const Deno: any;

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Valid Keys configured in Supabase Dashboard Secrets
    const YOCO_TEST_KEY = Deno.env.get('YOCO_SECRET_KEY_TEST');
    const YOCO_LIVE_KEY = Deno.env.get('YOCO_SECRET_KEY_LIVE');

    console.log("Checking secrets...");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase configuration");
      throw new Error("Server configuration error (Supabase)");
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 0. Determine Mode (Live vs Test)
    console.log("Fetching payment mode...");
    const { data: modeSetting, error: modeError } = await supabaseAdmin
      .from('app_settings')
      .select('value')
      .eq('key', 'payment_mode')
      .maybeSingle();

    if (modeError) {
      console.warn("Error fetching payment_mode, defaulting to test:", modeError);
    }

    const isLive = modeSetting?.value === 'live';
    const rawKey = isLive ? YOCO_LIVE_KEY : YOCO_TEST_KEY;
    const YOCO_SECRET_KEY = rawKey?.trim(); // Remove accidental spaces

    console.log(`Payment Mode: ${isLive ? 'LIVE' : 'TEST'}`);

    if (!YOCO_SECRET_KEY) {
      console.error(`Missing Yoco Key for ${isLive ? 'LIVE' : 'TEST'} mode`);
      throw new Error(`Technical Error: ${isLive ? 'Live' : 'Test'} Secret Key not found in Supabase Vault.`);
    }

    const body = await req.json();
    const { amountInCents, currency, metadata, successUrl, cancelUrl } = body;

    if (!amountInCents || !successUrl || !cancelUrl) {
      throw new Error("Invalid request: Missing amount, successUrl, or cancelUrl.");
    }

    // Ensure metadata values are strictly strings
    const sanitizedMetadata: Record<string, string> = {};
    if (metadata && typeof metadata === 'object') {
      Object.entries(metadata).forEach(([key, value]) => {
        sanitizedMetadata[key] = String(value);
      });
    }

    console.log(`Payload Check: ${amountInCents} cents, Success: ${successUrl}`);

    // 1. Create Checkout Session via Yoco Checkout API
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOCO_SECRET_KEY}`
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: currency || 'ZAR',
        successUrl: successUrl,
        cancelUrl: cancelUrl,
        metadata: sanitizedMetadata
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Yoco API Rejection:', JSON.stringify(data));
      // Yoco Error formats vary; capture any descriptive text
      const yocoError = data.errorMessage || data.message || (data.errors ? JSON.stringify(data.errors) : 'Invalid Request');

      return new Response(
        JSON.stringify({ error: `Yoco says: ${yocoError}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkoutId: data.id,
        redirectUrl: data.redirectUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    console.error("Edge Function Exception:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
