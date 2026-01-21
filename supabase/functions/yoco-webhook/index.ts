
// @ts-ignore
declare const Deno: any;

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * HELPER: Constant-time string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

const getBrandedHtml = (title: string, content: string, ctaLink?: string, ctaText?: string) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                <!-- Header -->
                <div style="background-color: #ffffff; padding: 32px 40px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                     <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="HR CoPilot" style="height: 48px; width: auto;" />
                </div>

                <!-- Main Content -->
                <div style="padding: 40px 40px 24px 40px;">
                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 24px 0; letter-spacing: -0.5px;">${title}</h1>
                    <div style="color: #334155; font-size: 16px; line-height: 1.6;">
                        ${content}
                    </div>

                    ${ctaLink ? `
                    <div style="margin-top: 32px; text-align: center;">
                        <a href="${ctaLink}" style="display: inline-block; background-color: #188693; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">
                            ${ctaText || 'Go to Dashboard'}
                        </a>
                    </div>
                    ` : ''}
                </div>

                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">HR CoPilot</p>
                    <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 12px;">South Africa's Smartest HR Assistant</p>
                    <p style="margin: 24px 0 0 0; color: #cbd5e1; font-size: 11px;">
                        &copy; ${new Date().getFullYear()} HR CoPilot. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
}

/**
 * YOCO WEBHOOK HANDLER
 * Secured version implementing official Yoco Signature Verification & Replay Protection.
 */
Deno.serve(async (req: any) => {
    // 1. Handle Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const YOCO_WEBHOOK_SECRET = Deno.env.get('YOCO_WEBHOOK_SECRET');

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Server configuration error: Missing Supabase keys.");
        }

        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // 2. Extract Webhook Headers
        const webhookId = req.headers.get('webhook-id');
        const webhookTimestamp = req.headers.get('webhook-timestamp');
        const webhookSignatureHeader = req.headers.get('webhook-signature'); // format: v1,base64_sig...
        const rawBody = await req.text();

        // 3. SECURE VERIFICATION (If secret is configured)
        if (YOCO_WEBHOOK_SECRET) {
            if (!webhookId || !webhookTimestamp || !webhookSignatureHeader) {
                console.error("Missing required webhook security headers.");
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
            }

            // A. Replay Attack Prevention (3 minute threshold)
            const now = Math.floor(Date.now() / 1000);
            const timestamp = parseInt(webhookTimestamp);
            if (Math.abs(now - timestamp) > 180) { // 180 seconds = 3 minutes
                console.error("Webhook timestamp outside 3-minute threshold.");
                return new Response(JSON.stringify({ error: "Request expired" }), { status: 401, headers: corsHeaders });
            }

            // B. Validate Signature
            // Signed Content = {id}.{timestamp}.{rawBody}
            const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;

            // Prepare Secret (strip whsec_ and base64 decode)
            const secretData = YOCO_WEBHOOK_SECRET.startsWith('whsec_') ? YOCO_WEBHOOK_SECRET.split('_')[1] : YOCO_WEBHOOK_SECRET;

            // Deno SubtleCrypto HMAC
            const encoder = new TextEncoder();
            const keyData = Uint8Array.from(atob(secretData), c => c.charCodeAt(0));

            const key = await crypto.subtle.importKey(
                "raw",
                keyData,
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            );

            const signatureBuffer = await crypto.subtle.sign(
                "HMAC",
                key,
                encoder.encode(signedContent)
            );

            // Convert to Base64
            const generatedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

            // Extract signature from header (taking the first one, removing 'v1,')
            const headerSig = webhookSignatureHeader.split(' ')[0].split(',')[1];

            if (!timingSafeEqual(generatedSignature, headerSig)) {
                console.error("Webhook signature mismatch.");
                return new Response(JSON.stringify({ error: "Invalid Signature" }), { status: 403, headers: corsHeaders });
            }

            console.log("Webhook signature verified successfully.");
        } else {
            console.warn("YOCO_WEBHOOK_SECRET not set. Proceeding without signature verification (INSECURE).");
        }

        // 4. Process the verified workload
        const payload = JSON.parse(rawBody);
        console.log(`[Webhook] Event: ${payload.type}`);

        if (payload.type === 'payment.succeeded') {
            const paymentData = payload.payload;
            const checkoutId = paymentData.checkoutId || paymentData.id;
            const metadata = paymentData.metadata;
            const amountInCents = paymentData.amount;

            const userId = metadata?.userId;
            const type = metadata?.type;
            const couponCode = metadata?.couponCode;
            const description = metadata?.description || 'Yoco Webhook Payment';

            if (!userId || !type) {
                console.warn("Incomplete metadata. Skipping update.");
                return new Response(JSON.stringify({ message: "Ignored" }), { status: 200, headers: corsHeaders });
            }

            // Idempotency: Don't credit twice
            const { data: existingTx } = await supabaseAdmin
                .from('transactions')
                .select('*')
                .eq('external_id', checkoutId)
                .maybeSingle();

            if (existingTx) {
                console.log(`Checkout ${checkoutId} already credited.`);
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
            }

            // 1. Get User Profile (Fail safe for email)
            const { data: profile } = await supabaseAdmin.from('profiles').select('email, full_name').eq('id', userId).single();

            // 2. Logic (Credits/Plan)
            let creditToAdd = amountInCents;
            if (couponCode) {
                const { data: coupon } = await supabaseAdmin.from('coupons').select('*').eq('code', couponCode).eq('active', true).maybeSingle();
                if (coupon) {
                    if (coupon.discount_type === 'fixed') creditToAdd += coupon.discount_value;
                    else if (coupon.discount_type === 'percentage') creditToAdd = Math.round(amountInCents / (1 - (coupon.discount_value / 100)));
                    await supabaseAdmin.rpc('increment_coupon_uses', { coupon_code: couponCode });
                }
            }

            const txAmount = type === 'subscription' ? -amountInCents : creditToAdd;

            // Atomic Updates
            await supabaseAdmin.from('transactions').insert({
                user_id: userId, amount: txAmount, description: description, external_id: checkoutId, date: new Date().toISOString()
            });

            if (type === 'topup') await supabaseAdmin.rpc('increment_balance', { user_id: userId, amount: creditToAdd });
            else if (type === 'subscription') await supabaseAdmin.from('profiles').update({ plan: 'pro' }).eq('id', userId);

            // 3. Email Notification
            if (profile) {
                const amountRands = (amountInCents / 100).toFixed(2);
                const content = `
                    <p>Hi ${profile.full_name || 'there'},</p>
                    <p>Great news! We have successfully processed your payment of <strong>R ${amountRands}</strong>.</p>
                    <div style="background-color: #ecfdf5; padding: 20px; border-radius: 12px; border: 1px solid #d1fae5; margin: 24px 0;">
                        <p style="margin: 0; color: #065f46;">Your HR CoPilot account has been updated and your new products or credits are now available in your dashboard.</p>
                    </div>
                    <p>Thank you for choosing HR CoPilot for your compliance needs.</p>
                `;
                await supabaseAdmin.functions.invoke('send-email', {
                    body: {
                        to: profile.email,
                        subject: `Payment Successful (R ${amountRands})`,
                        html: getBrandedHtml("Order Confirmation", content, "https://app.hrcopilot.co.za", "View Dashboard")
                    }
                });
            }

            console.log(`[Webhook Done] User ${userId} updated.`);
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        console.error("[Fatal Webhook Error]", err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
});
