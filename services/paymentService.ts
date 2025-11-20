import { supabase } from './supabase';

// ==============================================================================
// CONFIGURATION
// ==============================================================================

// 1. REPLACE WITH YOUR YOCO LIVE PUBLIC KEY FOR PRODUCTION
export const YOCO_PUBLIC_KEY = 'pk_live_922ec78alWPdK17eeac4'; 

// 2. DEPLOY SUPABASE EDGE FUNCTION
// To make payments 100% secure, you must verify them on the backend.
// Create a Supabase Edge Function named 'process-payment'.

/* 
   --- EDGE FUNCTION CODE (functions/process-payment/index.ts) ---
   
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

   const YOCO_SECRET_KEY = "sk_live_..."; // REPLACE WITH YOUR LIVE SECRET KEY

   serve(async (req) => {
     const { token, amountInCents, currency } = await req.json();

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
     });

     const data = await response.json();

     if (!response.ok) {
       return new Response(JSON.stringify({ error: data.displayMessage || 'Payment Failed' }), { status: 400 });
     }

     if (data.status === 'successful') {
       return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200 });
     } else {
       return new Response(JSON.stringify({ error: 'Payment not successful' }), { status: 400 });
     }
   });
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
}

export const processPayment = async (details: PaymentDetails): Promise<{ success: boolean; id?: string; error?: string }> => {
  return new Promise((resolve) => {
    if (!window.YocoSDK) {
      resolve({ success: false, error: "Payment gateway not loaded. Check internet connection." });
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
             // User cancelled, not an error state we need to alert on, just stop.
             resolve({ success: false, error: "User cancelled" }); 
          } else {
             resolve({ success: false, error: result.error.message });
          }
        } else {
          // ============================================================
          // SECURE BACKEND VERIFICATION
          // ============================================================
          try {
            // UNCOMMENT THIS BLOCK WHEN YOU HAVE DEPLOYED THE EDGE FUNCTION
            /*
            const { data, error } = await supabase.functions.invoke('process-payment', {
                body: { 
                    token: result.id, 
                    amountInCents: details.amountInCents 
                }
            });

            if (error || (data && data.error)) {
                resolve({ success: false, error: error?.message || data?.error || 'Payment verification failed' });
                return;
            }
            */

            // FOR NOW (Testing): We assume success if Yoco frontend token is received
            console.log("Yoco Token Received:", result.id);
            resolve({ success: true, id: result.id });

          } catch (err: any) {
             resolve({ success: false, error: err.message });
          }
        }
      },
    });
  });
};
