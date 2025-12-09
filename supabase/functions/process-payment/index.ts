
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
      throw new Error("Server configuration error (Missing Secrets).");
    }

    const { token, amountInCents, currency, description, metadata } = await req.json()
    
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // CRIT-1 FIX: Server-Side Price Validation
    let finalAmount = amountInCents;
    
    if (metadata?.type === 'subscription') {
        const { data: setting } = await supabaseAdmin
            .from('app_settings')
            .select('value')
            .eq('key', 'pro_plan_yearly')
            .single();
            
        if (setting && setting.value) {
            // Check if coupon is applied
            if (!metadata.couponCode && amountInCents !== setting.value) {
                 // Sanity Check: Pro plan shouldn't be less than R100 without a coupon
                 if (amountInCents < 10000) {
                     throw new Error("Invalid subscription amount detected. Potential tampering.");
                 }
            }
        }
    }

    // 1. Charge the card via Yoco API
    const response = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Secret ${YOCO_SECRET_KEY}`
      },
      body: JSON.stringify({
        token,
        amountInCents: finalAmount,
        currency: currency || 'ZAR',
        metadata: metadata
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Yoco Error:', data);
      return new Response(
        JSON.stringify({ error: data.displayMessage || 'Payment Declined by Gateway' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (data.status === 'successful') {
      const userId = metadata?.userId;
      const type = metadata?.type; // 'subscription' | 'topup'
      const couponCode = metadata?.couponCode;
      
      let creditToAdd = finalAmount; 

      // Handle Coupons Server-Side Logic for credit calculation
      if (couponCode) {
          const { data: coupon } = await supabaseAdmin.from('coupons').select('*').eq('code', couponCode).single();
          if (coupon && coupon.active) {
              if (coupon.discount_type === 'fixed') {
                  creditToAdd = finalAmount + coupon.discount_value;
              } else if (coupon.discount_type === 'percentage') {
                  const factor = 1 - (coupon.discount_value / 100);
                  if (factor > 0) creditToAdd = Math.round(finalAmount / factor);
              }
              await supabaseAdmin.rpc('increment_coupon_uses', { coupon_code: couponCode });
          }
      }

      if (userId && type) {
         const txAmount = type === 'subscription' ? -finalAmount : creditToAdd;
         
         await supabaseAdmin.from('transactions').insert({
             user_id: userId,
             amount: txAmount,
             description: description || 'Payment',
             date: new Date().toISOString()
         });

         if (type === 'topup') {
             await supabaseAdmin.rpc('increment_balance', { user_id: userId, amount: creditToAdd });
         } else if (type === 'subscription') {
             await supabaseAdmin.from('profiles').update({ plan: 'pro' }).eq('id', userId);
         }
      }

      return new Response(
        JSON.stringify({ success: true, id: data.id }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Payment status not successful' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Edge Function Exception:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
