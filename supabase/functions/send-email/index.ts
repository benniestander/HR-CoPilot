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

        // --- SAFE REQUEST PARSING ---
        const bodyText = await req.text();
        if (!bodyText) {
            throw new Error("Empty request body");
        }

        let body;
        try {
            body = JSON.parse(bodyText);
        } catch (e) {
            throw new Error(`Invalid JSON in request: ${e.message}`);
        }

        const { to, subject, html } = body;

        if (!to || !subject || !html) {
            throw new Error("Missing required fields: to, subject, html");
        }

        // ZeptoMail API Endpoint
        const zeptoUrl = "https://api.zeptomail.com/v1.1/email";

        const payload = {
            "from": {
                "address": FROM_EMAIL,
                "name": FROM_NAME
            },
            "to": [
                {
                    "email_address": {
                        "address": to
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

        // --- SAFE RESPONSE PARSING ---
        const resText = await res.text();
        let data;
        try {
            data = resText ? JSON.parse(resText) : { message: "No response body from provider" };
        } catch (e) {
            console.error("ZeptoMail non-JSON response:", resText);
            throw new Error(`Provider returned malformed response: ${resText.substring(0, 100)}`);
        }

        if (!res.ok) {
            console.error("ZeptoMail API Error:", JSON.stringify(data));
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
