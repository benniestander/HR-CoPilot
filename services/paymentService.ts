
import { supabase } from './supabase';

// ==============================================================================
// CONFIGURATION
// ==============================================================================

// 1. REPLACE WITH YOUR YOCO LIVE PUBLIC KEY FOR PRODUCTION
export const YOCO_PUBLIC_KEY = 'pk_live_922ec78alWPdK17eeac4'; 

/* 
   ==============================================================================
   CRITICAL: SUPABASE EDGE FUNCTION SETUP
   ==============================================================================
   
   You must deploy a Supabase Edge Function named 'process-payment' for this to work.
   
   1. Run: supabase functions new process-payment
   2. Paste the code below into supabase/functions/process-payment/index.ts
   3. Run: supabase secrets set YOCO_SECRET_KEY=sk_live_...
   4. Run: supabase secrets set SUPABASE_URL=...
   5. Run: supabase secrets set SUPABASE_SERVICE_ROLE_KEY=... (Found in Project Settings -> API -> Service Role)
   6. Run: supabase functions deploy process-payment

   --- EDGE FUNCTION CODE START (Copy ONLY this block into index.ts) ---
   
   // DO NOT IMPORT FROM LOCAL FILES (e.g. './supabase'). 
   // EDGE FUNCTIONS RUN IN DENO AND NEED URL IMPORTS.
   
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
   }

   const YOCO_SECRET_KEY = Deno.env.get('YOCO_SECRET_KEY');
   const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
   const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

   serve(async (req) => {
     if (req.method === 'OPTIONS') {
       return new Response('ok', { headers: corsHeaders })
     }

     try {
       const { token, amountInCents, currency, description, metadata } = await req.json()
       
       if (!YOCO_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
         throw new Error("Missing environment variables (YOCO_SECRET_KEY, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY).")
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
           amountInCents,
           currency: currency || 'ZAR'
         })
       })

       const data = await response.json()

       if (!response.ok) {
         console.error('Yoco Error:', data);
         return new Response(
           JSON.stringify({ error: data.displayMessage || 'Payment Declined' }), 
           { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
         )
       }

       if (data.status === 'successful') {
         // 2. PAYMENT SUCCESSFUL - UPDATE DATABASE VIA ADMIN CLIENT
         const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
         const userId = metadata?.userId;
         const type = metadata?.type; // 'subscription' | 'topup'

         if (userId && type) {
            // Determine transaction amount (Cost is negative, Credit is positive)
            // Note: In this system, Subscription is a COST (-74700) but we just log it as paid revenue.
            // TopUp is CREDIT (+50000).
            const txAmount = type === 'subscription' ? -amountInCents : amountInCents;
            
            // Insert Transaction Record
            await supabaseAdmin.from('transactions').insert({
                user_id: userId,
                amount: txAmount,
                description: description || 'Payment',
                date: new Date().toISOString()
            });

            // Update User Profile
            if (type === 'topup') {
                // Fetch current balance to increment it
                const { data: profile } = await supabaseAdmin.from('profiles').select('credit_balance').eq('id', userId).single();
                const newBalance = (Number(profile?.credit_balance) || 0) + amountInCents;
                await supabaseAdmin.from('profiles').update({ credit_balance: newBalance }).eq('id', userId);
            } else if (type === 'subscription') {
                // Enable Pro Plan
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
     } catch (error) {
       return new Response(
         JSON.stringify({ error: error.message }), 
         { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
       )
     }
   })

   --- EDGE FUNCTION CODE END ---
*/

interface PaymentDetails {
  amountInCents: number;
  currency?: 'ZAR';
  name: string;
  description?: string;
  customer: {
    name: string;
    surname: string;
    email: string;
    phone?: string;
  };
  metadata?: {
    userId?: string;
    type?: 'subscription' | 'topup';
  };
}

export const processPayment = async (details: PaymentDetails): Promise<{ success: boolean; id?: string; error?: string }> => {
  return new Promise((resolve) => {
    if (!window.YocoSDK) {
      resolve({ success: false, error: "Payment gateway not loaded. Please check your internet connection." });
      return;
    }

    const yoco = new window.YocoSDK({
      publicKey: YOCO_PUBLIC_KEY,
    });

    yoco.showPopup({
      amountInCents: details.amountInCents,
      currency: details.currency || 'ZAR',
      name: details.name,
      description: details.description || 'HR CoPilot Purchase',
      customer: details.customer,
      callback: async (result: any) => {
        if (result.error) {
          if (result.error.message === "User closed popup") {
             resolve({ success: false, error: "User cancelled" }); 
          } else {
             resolve({ success: false, error: result.error.message });
          }
        } else {
          // ============================================================
          // SECURE BACKEND VERIFICATION
          // ============================================================
          try {
            // We send the token + metadata to our backend. 
            const { data, error } = await supabase.functions.invoke('process-payment', {
                body: { 
                    token: result.id, 
                    amountInCents: details.amountInCents,
                    currency: 'ZAR',
                    description: details.description,
                    metadata: details.metadata
                }
            });

            if (error) {
                console.error("Edge Function Error:", error);
                // Often this error is a CORS issue if the function isn't set up right
                resolve({ success: false, error: "Payment verification failed (Server Error). Please contact support." });
                return;
            }

            if (data && data.error) {
                resolve({ success: false, error: data.error });
                return;
            }

            if (data && data.success) {
                console.log("Payment Verified & Charged:", data.id);
                resolve({ success: true, id: data.id });
            } else {
                resolve({ success: false, error: "Unknown payment state." });
            }

          } catch (err: any) {
             console.error("Payment Exception:", err);
             resolve({ success: false, error: "Network error verifying payment. Please check your connection." });
          }
        }
      },
    });
  });
};
