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

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Server configuration error: Missing Supabase secrets.");
    }

    const event = await req.json();
    
    // Log event type
    console.log(`Received Yoco Webhook: ${event.type}`);

    if (event.type === 'payment.succeeded') {
        const payment = event.payload;
        const metadata = payment.metadata;
        const amountInCents = payment.amount;

        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const userId = metadata?.userId;
        const type = metadata?.type; // 'subscription' | 'topup'
        const couponCode = metadata?.couponCode;
        
        let creditToAdd = amountInCents;

        // Handle Coupons Logic (Server-Side Calculation)
        if (couponCode) {
            const { data: coupon } = await supabaseAdmin.from('coupons').select('*').eq('code', couponCode).single();
            if (coupon) {
                await supabaseAdmin.rpc('increment_coupon_uses', { coupon_code: couponCode });
            }
        }

        if (userId && type) {
            const txAmount = type === 'subscription' ? -amountInCents : creditToAdd;
            const description = type === 'subscription' ? 'Pro Subscription Payment' : 'Credit Top-Up';

            await supabaseAdmin.from('transactions').insert({
                user_id: userId,
                amount: txAmount,
                description: description,
                date: new Date().toISOString()
            });

            if (type === 'topup') {
                await supabaseAdmin.rpc('increment_balance', { user_id: userId, amount: creditToAdd });
            } else if (type === 'subscription') {
                await supabaseAdmin.from('profiles').update({ plan: 'pro' }).eq('id', userId);
            }
            
            console.log(`Successfully processed ${type} for user ${userId}`);
        }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})