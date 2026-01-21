// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Logic: Users created > 30 days ago, with NO generated documents, and NO transaction in last 30 days.
// This runs on request (e.g., automated logic).

Deno.serve(async (req: any) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // 1. Find inactive users
        // Definition: Created > 14 days ago. Plan = 'payg'. Balance = 0. OR Users who haven't generated a doc in 30 days.
        // For simplicity: Find users with 0 documents generated.

        // Fetch all users (limit 1000 for safety)
        const { data: users, error: userError } = await supabase
            .from('profiles')
            .select('id, email, full_name, created_at')
            .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Older than 7 days
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

            // If NO documents, they are inactive/stuck. Send nudge.
            if (count === 0) {
                // Check if we already emailed them recently to avoid spam (check admin logs)
                const { data: existingLog } = await supabase
                    .from('admin_action_logs')
                    .select('*')
                    .eq('action', 'Automated Retention Email')
                    .eq('target_user_id', user.id)
                    .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Don't spam monthly
                    .maybeSingle();

                if (!existingLog) {
                    // Send Email via our own function
                    const emailRes = await supabase.functions.invoke('send-email', {
                        body: {
                            to: user.email,
                            subject: "We miss you at HR CoPilot!",
                            html: `
                            <div style="font-family: sans-serif; color: #333;">
                                <h2>Hi ${user.full_name || 'there'},</h2>
                                <p>We noticed you signed up for HR CoPilot but haven't generated any documents yet.</p>
                                <p>Is there anything we can help you with? Our system is designed to make HR compliance effortless.</p>
                                <p><strong>Did you know?</strong> You can generate a tailored Employment Contract in under 5 minutes.</p>
                                <br/>
                                <a href="https://app.hrcopilot.co.za" style="background-color: #188693; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started Now</a>
                                <br/><br/>
                                <p>Reply to this email if you need assistance!</p>
                            </div>
                        `
                        }
                    });

                    if (emailRes.error) {
                        logs.push(`Failed to email ${user.email}: ${emailRes.error}`);
                    } else {
                        sentCount++;
                        logs.push(`Emailed ${user.email}`);
                        // Log action
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
