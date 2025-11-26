
import { supabase } from './supabase';

/* 
   ==============================================================================
   CRITICAL: EMAIL EDGE FUNCTION SETUP (RESEND)
   ==============================================================================
   
   1. Create an account at https://resend.com and get an API Key.
   2. Verify your domain in Resend.
   3. Run: supabase functions new send-email
   4. Paste the code below into supabase/functions/send-email/index.ts
   5. Run: supabase secrets set RESEND_API_KEY=re_123...
   6. Run: supabase functions deploy send-email

   --- EDGE FUNCTION CODE START (Copy into index.ts) ---
   
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   
   const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
   
   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
   };
   
   interface EmailRequest {
     to: string;
     subject: string;
     html: string;
     from?: string;
   }
   
   serve(async (req) => {
     if (req.method === 'OPTIONS') {
       return new Response('ok', { headers: corsHeaders });
     }
   
     try {
       const { to, subject, html, from } = await req.json() as EmailRequest;
       
       if (!RESEND_API_KEY) {
         throw new Error("Missing RESEND_API_KEY");
       }
   
       const res = await fetch('https://api.resend.com/emails', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${RESEND_API_KEY}`,
         },
         body: JSON.stringify({
           from: from || 'HR CoPilot <system@hrcopilot.co.za>', // Replace with your verified domain
           to,
           subject,
           html,
         }),
       });
   
       const data = await res.json();
   
       if (!res.ok) {
         return new Response(JSON.stringify(data), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
       }
   
       return new Response(JSON.stringify(data), {
         status: 200,
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
       });
     } catch (error: any) {
       return new Response(JSON.stringify({ error: error.message }), {
         status: 500,
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
       });
     }
   });
   
   --- EDGE FUNCTION CODE END ---
*/

// --- Frontend Service ---

/**
 * Sends an email via the Supabase Edge Function.
 */
const sendEmail = async (to: string, subject: string, htmlBody: string) => {
    try {
        const { data, error } = await supabase.functions.invoke('send-email', {
            body: {
                to,
                subject,
                html: htmlBody
            }
        });

        if (error) {
            console.error("Failed to send email:", error);
            return { success: false, error };
        }
        return { success: true, data };
    } catch (err) {
        console.error("Email exception:", err);
        return { success: false, error: err };
    }
};

export const emailService = {
    /**
     * Sends a welcome email to a new user.
     */
    sendWelcomeEmail: async (email: string, name: string) => {
        const html = `
            <div style="font-family: sans-serif; color: #333;">
                <h1 style="color: #188693;">Welcome to HR CoPilot, ${name}!</h1>
                <p>We are thrilled to have you on board.</p>
                <p>You now have access to South Africa's smartest HR compliance tool. You can start generating compliant policies and forms immediately.</p>
                <br/>
                <a href="https://app.hrcopilot.co.za" style="background-color: #188693; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
                <br/><br/>
                <p>Regards,<br/>The HR CoPilot Team</p>
            </div>
        `;
        return sendEmail(email, "Welcome to HR CoPilot", html);
    },

    /**
     * Sends a receipt/confirmation for a Pro subscription.
     */
    sendSubscriptionReceipt: async (email: string, name: string, amountInCents: number) => {
        const amount = (amountInCents / 100).toFixed(2);
        const html = `
            <div style="font-family: sans-serif; color: #333;">
                <h2>Payment Receipt</h2>
                <p>Hi ${name},</p>
                <p>Thank you for upgrading to <strong>HR CoPilot Pro</strong>.</p>
                <p>We have received your payment of <strong>R${amount}</strong>.</p>
                <p>Your account has been upgraded and you now have unlimited access for 12 months.</p>
                <br/>
                <p>Regards,<br/>The HR CoPilot Team</p>
            </div>
        `;
        return sendEmail(email, "Payment Receipt - HR CoPilot Pro", html);
    },

    /**
     * Sends a receipt for a PAYG top-up.
     */
    sendTopUpReceipt: async (email: string, name: string, amountInCents: number) => {
        const amount = (amountInCents / 100).toFixed(2);
        const html = `
            <div style="font-family: sans-serif; color: #333;">
                <h2>Credit Top-Up Successful</h2>
                <p>Hi ${name},</p>
                <p>You have successfully added <strong>R${amount}</strong> to your HR CoPilot credit balance.</p>
                <p>You can now use these credits to generate documents.</p>
                <br/>
                <p>Regards,<br/>The HR CoPilot Team</p>
            </div>
        `;
        return sendEmail(email, "Credit Top-Up Receipt", html);
    }
};
