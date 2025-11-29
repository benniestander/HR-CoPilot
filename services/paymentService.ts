
import { supabase } from './supabase';

// ==============================================================================
// GLOBAL TYPES
// ==============================================================================
declare global {
  interface Window {
    YocoSDK: any;
  }
}

// ==============================================================================
// CONFIGURATION
// ==============================================================================

// 1. REPLACE WITH YOUR YOCO LIVE PUBLIC KEY FOR PRODUCTION
// Using Vite env var for secure configuration
export const YOCO_PUBLIC_KEY = (import.meta as any).env?.VITE_YOCO_PUBLIC_KEY || 'pk_live_922ec78alWPdK17eeac4'; 

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
   
   // ⚠️ IMPORTANT: Do NOT import '../services/supabase' or any local files here.
   
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
   }

   Deno.serve(async (req) => {
     if (req.method === 'OPTIONS') {
       return new Response('ok', { headers: corsHeaders })
     }

     try {
       const YOCO_SECRET_KEY = Deno.env.get('YOCO_SECRET_KEY');
       const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
       const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

       const { token, amountInCents, currency, description, metadata } = await req.json()
       
       if (!YOCO_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
         return new Response(
           JSON.stringify({ error: "Server configuration error (Missing Secrets)." }), 
           { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
         )
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
         // 2. PAYMENT SUCCESSFUL - UPDATE DATABASE VIA ADMIN CLIENT
         const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
         const userId = metadata?.userId;
         const type = metadata?.type; // 'subscription' | 'topup'
         const couponCode = metadata?.couponCode;
         
         // SECURE CALCULATION: Do not trust client metadata for credit value.
         // Calculate credit based on Amount Paid + Server-Verified Coupon.
         let creditToAdd = amountInCents; // Default: You get what you paid for.

         // Handle Coupons Server-Side
         if (couponCode) {
             const { data: coupon } = await supabaseAdmin.from('coupons').select('*').eq('code', couponCode).single();
             
             if (coupon && coupon.active) {
                 // Reverse calculate the value
                 if (coupon.discount_type === 'fixed') {
                     // If they paid X, and discount was Y, the Value is X + Y
                     creditToAdd = amountInCents + coupon.discount_value;
                 } else if (coupon.discount_type === 'percentage') {
                     // If they paid X, which is (100% - Discount%), then Value = X / (1 - Discount%)
                     const factor = 1 - (coupon.discount_value / 100);
                     if (factor > 0) {
                        creditToAdd = Math.round(amountInCents / factor);
                     }
                 }
                 // Track usage
                 await supabaseAdmin.rpc('increment_coupon_uses', { coupon_code: couponCode });
             } else {
                 console.warn(`Invalid or inactive coupon used: ${couponCode}. Crediting paid amount only.`);
             }
         }

         if (userId && type) {
            // For subscriptions, the cost is the "value", for topups, it's the calculated credit
            const txAmount = type === 'subscription' ? -amountInCents : creditToAdd;
            
            // Insert Transaction Record
            await supabaseAdmin.from('transactions').insert({
                user_id: userId,
                amount: txAmount,
                description: description || 'Payment',
                date: new Date().toISOString()
            });

            // Update User Profile
            if (type === 'topup') {
                // ATOMIC UPDATE
                await supabaseAdmin.rpc('increment_balance', { 
                    user_id: userId, 
                    amount: creditToAdd 
                });
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
     } catch (error) {
       console.error("Edge Function Exception:", error);
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
    couponCode?: string;
    // Removed creditAmount - logic moved to server for security
  };
}

let sdkLoadingPromise: Promise<any> | null = null;

// Robust Loader to prevent race conditions and redundant injections
const loadYocoSdk = (): Promise<any> => {
  if (window.YocoSDK) {
    return Promise.resolve(window.YocoSDK);
  }

  if (sdkLoadingPromise) {
    return sdkLoadingPromise;
  }

  sdkLoadingPromise = new Promise((resolve, reject) => {
    // Check if script is already present but not loaded (e.g. in HTML head)
    const existingScript = document.querySelector('script[src="https://js.yoco.com/sdk/v1/yoco-sdk-web.js"]');

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.YocoSDK) resolve(window.YocoSDK);
        else reject(new Error("Yoco SDK script loaded but window.YocoSDK is undefined"));
      });
      existingScript.addEventListener('error', () => reject(new Error("Yoco SDK script failed to load")));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    script.onload = () => {
      if (window.YocoSDK) resolve(window.YocoSDK);
      else reject(new Error("Yoco SDK script loaded but window.YocoSDK is undefined"));
    };
    script.onerror = () => {
      sdkLoadingPromise = null; // Reset so retry is possible
      reject(new Error("Failed to load Yoco SDK. Please check your internet connection or ad blockers."));
    };
    document.head.appendChild(script);
  });

  return sdkLoadingPromise;
};

export const processPayment = async (details: PaymentDetails): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const YocoSDK = await loadYocoSdk();

    return new Promise((resolve) => {
        const yoco = new YocoSDK({
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
                    console.error("Edge Function Invoke Error:", error);
                    const msg = error.message || "Payment verification failed (Server Error). Please contact support.";
                    resolve({ success: false, error: msg });
                    return;
                }

                if (data && data.error) {
                    console.error("Edge Function Logic Error:", data.error);
                    resolve({ success: false, error: data.error });
                    return;
                }

                if (data && data.success) {
                    console.log("Payment Verified & Charged:", data.id);
                    resolve({ success: true, id: data.id });
                } else {
                    resolve({ success: false, error: "Unknown payment state from server." });
                }

            } catch (err: any) {
                console.error("Payment Exception:", err);
                resolve({ success: false, error: "Network error verifying payment. Please check your connection." });
            }
            }
        },
        });
    });
  } catch (e: any) {
      console.error("SDK Load Error:", e);
      return { success: false, error: e.message || "Could not load payment gateway." };
  }
};
