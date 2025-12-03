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
    const YOCO_SECRET_KEY = Deno.env.get('YOCO_SECRET_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!YOCO_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Server configuration error: Missing YOCO_SECRET_KEY or Supabase secrets.");
    }

    const { amountInCents, currency, description, metadata, returnUrl } = await req.json()
    
    // Ensure amount is an integer
    const finalAmount = Math.round(amountInCents);
    
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Server-Side Price Validation
    if (metadata?.type === 'subscription') {
        const { data: setting } = await supabaseAdmin
            .from('app_settings')
            .select('value')
            .eq('key', 'pro_plan_yearly')
            .single();
            
        if (setting && setting.value) {
            // Check if coupon is applied (if not, amount must match setting)
            if (!metadata.couponCode && finalAmount !== setting.value) {
                 if (finalAmount < 10000) {
                     return new Response(
                        JSON.stringify({ error: "Invalid subscription amount detected." }), 
                        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
                     );
                 }
            }
        }
    }

    // Sanitize Metadata (Yoco requires string values)
    const safeMetadata: Record<string, string> = {};
    if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                safeMetadata[key] = String(value);
            }
        });
    }

    // Call Yoco Checkout API
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Secret ${YOCO_SECRET_KEY}`
      },
      body: JSON.stringify({
        amount: finalAmount,
        currency: currency || 'ZAR',
        successUrl: `${returnUrl}payment-success`, // Redirects to: https://app.com/#/payment-success
        cancelUrl: `${returnUrl}payment-cancel`,   // Redirects to: https://app.com/#/payment-cancel
        metadata: safeMetadata
      })
    })

    const data = await response.json();

    if (!response.ok) {
      console.error('Yoco Checkout API Error:', data);
      return new Response(
        JSON.stringify({ 
            error: data.message || 'Failed to create checkout session.', 
            details: data 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Return the redirect URL to the frontend
    return new Response(
      JSON.stringify({ redirectUrl: data.redirectUrl, id: data.id }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    console.error("Edge Function Exception:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
