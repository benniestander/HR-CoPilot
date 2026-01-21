// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Logic: Users created > 30 days ago, with NO generated documents, and NO transaction in last 30 days.
// This runs on request (e.g., automated logic).

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

Deno.serve(async (req: any) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Fetch users created > 7 days ago (limit for safety)
        const { data: users, error: userError } = await supabase
            .from('profiles')
            .select('id, email, full_name, created_at')
            .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .limit(100);

        if (userError) throw userError;

        let sentCount = 0;
        const logs = [];

        for (const user of users) {
            // Check if they have ANY documents
            const { count, error: docError } = await supabase
                .from('generated_documents')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            if (docError) {
                console.error(`Error checking docs for ${user.id}`, docError);
                continue;
            }

            if (count === 0) {
                // Don't spam monthly
                const { data: existingLog } = await supabase
                    .from('admin_action_logs')
                    .select('*')
                    .eq('action', 'Automated Retention Email')
                    .eq('target_user_id', user.id)
                    .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
                    .maybeSingle();

                if (!existingLog) {
                    const content = `
                        <p>Hi ${user.full_name || 'there'},</p>
                        <p>We noticed you signed up for HR CoPilot but haven't generated any documents yet.</p>
                        <p>Is there anything we can help you with? Our system is designed to make HR compliance effortless for South African businesses.</p>
                        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0;">
                            <p style="margin: 0; font-weight: 700; color: #188693;">Did you know?</p>
                            <p style="margin: 4px 0 0 0;">You can generate a tailored Employment Contract or Leave Policy in under 5 minutes.</p>
                        </div>
                        <p>Reply to this email if you need assistance!</p>
                    `;

                    const emailRes = await supabase.functions.invoke('send-email', {
                        body: {
                            to: user.email,
                            subject: "We miss you at HR CoPilot!",
                            html: getBrandedHtml("Still there?", content, "https://app.hrcopilot.co.za", "Get Started Now")
                        }
                    });

                    if (emailRes.error) {
                        logs.push(`Failed to email ${user.email}: ${emailRes.error}`);
                    } else {
                        sentCount++;
                        logs.push(`Emailed ${user.email}`);
                        await supabase.from('admin_action_logs').insert({
                            action: 'Automated Retention Email',
                            target_user_id: user.id,
                            target_user_email: user.email,
                            details: { reason: 'No documents generated > 7 days' }
                        });
                    }
                }
            }
        }

        return new Response(
            JSON.stringify({ success: true, sent: sentCount, logs }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
