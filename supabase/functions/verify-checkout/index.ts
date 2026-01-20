
// @ts-ignore
declare const Deno: any;

// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

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

        // Valid Keys configured in Supabase Secrets
        const YOCO_TEST_KEY = Deno.env.get('YOCO_SECRET_KEY_TEST');
        const YOCO_LIVE_KEY = Deno.env.get('YOCO_SECRET_KEY_LIVE');

        console.log("Verifying secrets...");
        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            console.error("Missing Supabase configuration");
            throw new Error("Server configuration error (Supabase)");
        }

        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // 0. Determine Mode (Live vs Test)
        console.log("Fetching payment mode...");
        const { data: modeSetting, error: modeError } = await supabaseAdmin
            .from('app_settings')
            .select('value')
            .eq('key', 'payment_mode')
            .maybeSingle();

        if (modeError) {
            console.warn("Error fetching mode setting, defaulting to test.");
        }

        const isLive = modeSetting?.value === 'live';
        const YOCO_SECRET_KEY = isLive ? YOCO_LIVE_KEY : YOCO_TEST_KEY;

        console.log(`Verification Mode: ${isLive ? 'LIVE' : 'TEST'}`);

        if (!YOCO_SECRET_KEY) {
            console.error(`Missing Yoco Key for ${isLive ? 'LIVE' : 'TEST'} mode`);
            throw new Error(`Payment verification error: ${isLive ? 'Live' : 'Test'} key not found in server secrets.`);
        }

        const body = await req.json();
        const { checkoutId } = body;

        if (!checkoutId) {
            throw new Error("Missing checkoutId in request body");
        }

        console.log(`Checking Yoco for checkoutId: ${checkoutId}`);

        // 1. Verify Checkout via Yoco API
        const response = await fetch(`https://payments.yoco.com/api/checkouts/${checkoutId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${YOCO_SECRET_KEY}`
            }
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Yoco API Error:', data);
            return new Response(
                JSON.stringify({ error: data.message || 'Yoco verification failed' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        console.log(`Yoco checkout status: ${data.status}`);

        // Check if checkout is successful
        if (data.status === 'successful') {
            const metadata = data.metadata;
            const amountInCents = data.amount;
            const userId = metadata?.userId;
            const type = metadata?.type; // 'subscription' | 'topup'
            const couponCode = metadata?.couponCode;
            const description = metadata?.description || 'Yoco Payment';

            console.log(`Processing successful payment for User ${userId}, Type: ${type}`);

            if (!userId || !type) {
                console.error("Missing critical metadata in Yoco checkout object:", metadata);
                throw new Error("Invalid payment metadata: userId and type are required.");
            }

            // Pre-fetch Profile for Email (Fail early logic) - Not blocking payment but vital for logging
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('email, full_name')
                .eq('id', userId)
                .single();

            // Idempotency: Check if this checkout was already processed
            const { data: existingTx, error: txCheckError } = await supabaseAdmin
                .from('transactions')
                .select('*')
                .eq('external_id', checkoutId)
                .maybeSingle();

            if (txCheckError) {
                console.error("Error checking idempotency:", txCheckError);
            }

            if (existingTx) {
                console.log("Checkout already processed, skipping duplicate updates.");
                return new Response(
                    JSON.stringify({ success: true, message: 'Already processed', id: data.id }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
                );
            }

            let creditToAdd = amountInCents;

            // Handle Coupons Server-Side Logic for credit calculation
            // CRITICAL: Fail if coupon logic is requested but fails. Do not silently charge wrong amount.
            if (couponCode) {
                console.log(`Applying coupon logic for: ${couponCode}`);
                const { data: coupon, error: couponError } = await supabaseAdmin
                    .from('coupons')
                    .select('*')
                    .eq('code', couponCode)
                    .eq('active', true)
                    .maybeSingle();

                if (couponError) {
                    // DB Error - UNSAFE to proceed
                    console.error("Critical Error fetching coupon:", couponError);
                    throw new Error("Coupon validation failed due to system error. Transaction aborted for safety.");
                }

                if (coupon) {
                    if (coupon.discount_type === 'fixed') {
                        creditToAdd = amountInCents + coupon.discount_value;
                    } else if (coupon.discount_type === 'percentage') {
                        const factor = 1 - (coupon.discount_value / 100);
                        if (factor > 0) creditToAdd = Math.round(amountInCents / factor);
                    }
                    // Increment coupon usage
                    await supabaseAdmin.rpc('increment_coupon_uses', { coupon_code: couponCode });
                    console.log(`Coupon applied. Base: ${amountInCents}, Credited: ${creditToAdd}`);
                } else {
                    // Coupon not found or inactive, but user tried to use it. 
                    // Decision: Allow payment as "standard" but log warning, OR fail. 
                    // For high-integrity systems, we proceed with standard amount but log it.
                    console.warn(`Invalid or inactive coupon code used: ${couponCode}. Proceeding with standard top-up.`);
                }
            }

            const txAmount = type === 'subscription' ? -amountInCents : creditToAdd;

            // RECORD TRANSACTION
            const { error: insertError } = await supabaseAdmin.from('transactions').insert({
                user_id: userId,
                amount: txAmount,
                description: description,
                external_id: checkoutId,
                date: new Date().toISOString()
            });

            if (insertError) {
                console.error("Failed to record transaction:", insertError);
                throw new Error("Database error (transactions)");
            }

            // UPDATE BALANCE OR PLAN
            if (type === 'topup') {
                console.log(`Incrementing balance by ${creditToAdd} for user ${userId}`);
                const { error: balanceError } = await supabaseAdmin.rpc('increment_balance', { user_id: userId, amount: creditToAdd });
                if (balanceError) throw balanceError;
            } else if (type === 'subscription') {
                console.log(`Upgrading user ${userId} to Pro plan`);
                const { error: planError } = await supabaseAdmin.from('profiles').update({ plan: 'pro' }).eq('id', userId);
                if (planError) throw planError;
            }

            console.log("Transaction successfully processed.");

            // 3. AUTOMATED ELECTRONIC INVOICE (EMAIL)
            // Profile is already pre-fetched.
            try {
                if (profile) {
                    console.log(`Sending automated invoice email to ${profile.email}`);
                    const amountRands = (amountInCents / 100).toFixed(2);
                    const invoiceNumber = `INV-${checkoutId.substring(0, 8).toUpperCase()}`;

                    const html = `
                        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #188693;">Official Tax Invoice</h2>
                            <p>Hi ${profile.full_name || 'Customer'},</p>
                            <p>Thank you for your payment. This email serves as your automated electronic invoice for your records.</p>
                            
                            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #188693; margin: 20px 0;">
                                <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoiceNumber}</p>
                                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-ZA')}</p>
                                <p style="margin: 5px 0;"><strong>Description:</strong> ${description}</p>
                                <p style="margin: 5px 0; font-size: 1.2em; color: #111827;"><strong>Total: R ${amountRands}</strong></p>
                            </div>

                            <p>You can download a PDF version of this invoice for printing from your <a href="https://app.hrcopilot.co.za">HR CoPilot Dashboard</a> under <strong>Payment Transactions</strong>.</p>
                            
                            <p style="font-size: 0.9em; color: #666;">
                                Regards,<br/>
                                The HR CoPilot Team
                            </p>
                        </div>
                    `;

                    await supabaseAdmin.functions.invoke('send-email', {
                        body: {
                            to: profile.email,
                            subject: `Tax Invoice: ${invoiceNumber}`,
                            html: html
                        }
                    });
                }
            } catch (emailErr) {
                console.error("Failed to send automated invoice email:", emailErr);
                // We don't throw here because the payment was actually successful
            }

            return new Response(
                JSON.stringify({ success: true, id: data.id }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        } else {
            console.warn(`Attempted to verify a non-successful checkout: ${data.status}`);
            return new Response(
                JSON.stringify({ error: `Payment status is ${data.status}` }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }
    } catch (error: any) {
        console.error("Edge Function Exception:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
