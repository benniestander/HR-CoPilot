
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
                await supabaseAdmin.functions.invoke('send-email', {
                    body: {
                        to: profile.email,
                        subject: `Payment Successful (R ${amountRands})`,
                        html: `<p>Your HR CoPilot account has been updated following a successful payment of R ${amountRands}.</p>`
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
