// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ZeptoMail Configuration
const ZEPTO_API_KEY = Deno.env.get('ZEPTO_API_KEY'); // "Send Mail Token" from ZeptoMail
const FROM_EMAIL = "noreply@mail.hrcopilot.co.za";
const FROM_NAME = "HR CoPilot";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        if (!ZEPTO_API_KEY) {
            console.error("Missing ZEPTO_API_KEY");
            throw new Error("Server configuration error: Missing Email Provider Key");
        }

        const { to, subject, html } = await req.json();

        if (!to || !subject || !html) {
            throw new Error("Missing required fields: to, subject, html");
        }

        // ZeptoMail API Endpoint (Batch sending is standard for transactional)
        const zeptoUrl = "https://api.zeptomail.com/v1.1/email";

        const payload = {
            "from": {
                "address": FROM_EMAIL,
                "name": FROM_NAME
            },
            "to": [
                {
                    "email_address": {
                        "address": to,
                        // "name": "Client Name" // Optional if we passed name in future
                    }
                }
            ],
            "subject": subject,
            "htmlbody": html,
        };

        const res = await fetch(zeptoUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Zoho-enczapikey ${ZEPTO_API_KEY}`
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("ZeptoMail API Error:", JSON.stringify(data));
            // Zepto error messages are usually in data.message or data.error
            throw new Error(data.message || JSON.stringify(data.error) || "Failed to send email");
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        console.error("Email Function Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
