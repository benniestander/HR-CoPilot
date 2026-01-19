import { supabase } from './supabase';

/* 
   ==============================================================================
   CRITICAL: EMAIL EDGE FUNCTION SETUP (RESEND)
   ==============================================================================
   Ensure your 'send-email' Edge Function is deployed as per previous instructions.
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
     * Sends an Invoice Request confirmation with Banking Details.
     */
    sendInvoiceInstructions: async (email: string, name: string, amountInCents: number, reference: string, itemDescription: string) => {
        const amount = (amountInCents / 100).toFixed(2);
        const html = `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #188693;">Invoice Request Received</h2>
                <p>Hi ${name},</p>
                <p>Thank you for your request for: <strong>${itemDescription}</strong>.</p>
                <p>To activate your product/credits, please make an EFT payment of <strong>R${amount}</strong> to the account below.</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #143a67;">Banking Details</h3>
                    <p style="margin: 5px 0;"><strong>Bank:</strong> FNB (First National Bank)</p>
                    <p style="margin: 5px 0;"><strong>Account Name:</strong> HR CoPilot</p>
                    <p style="margin: 5px 0;"><strong>Account Number:</strong> 62123456789</p>
                    <p style="margin: 5px 0;"><strong>Branch Code:</strong> 250655</p>
                    <p style="margin: 5px 0; font-size: 1.1em; color: #188693;"><strong>Reference:</strong> ${reference}</p>
                </div>

                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Make the payment using the reference above.</li>
                    <li>Email your Proof of Payment to <a href="mailto:admin@hrcopilot.co.za">admin@hrcopilot.co.za</a>.</li>
                    <li>Your account will be activated/credited immediately upon receipt.</li>
                </ol>
                
                <p style="font-size: 0.9em; color: #666;">Note: Payments from FNB reflect immediately. Other banks may take up to 24 hours.</p>
                <br/>
                <p>Regards,<br/>The HR CoPilot Team</p>
            </div>
        `;
        return sendEmail(email, `Invoice Request: ${reference}`, html);
    },

    /**
     * Sends a confirmation when Admin manually activates an order.
     */
    sendActivationConfirmation: async (email: string, name: string, type: 'pro' | 'payg', amountInCents: number) => {
        const isPro = type === 'pro';
        const amount = (amountInCents / 100).toFixed(2);

        const html = `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #188693; text-align: center;">Payment Received & Order Activated!</h2>
                <p>Hi ${name},</p>
                <p>Great news! We have received your payment of <strong>R${amount}</strong>.</p>
                
                <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #d1fae5; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #065f46;">${isPro ? 'Pro Membership Active' : 'Credits Added'}</h3>
                    <p style="margin: 5px 0; color: #064e3b;">
                        ${isPro
                ? 'Your account has been upgraded to HR CoPilot Pro. You now have unlimited access for 12 months.'
                : `R${amount} credit has been added to your balance. You can now generate documents.`
            }
                    </p>
                </div>

                <p>You can login to your dashboard immediately to start using your new features.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://app.hrcopilot.co.za" style="background-color: #188693; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                </div>
                
                <p>Thank you for choosing HR CoPilot.</p>
                <p>Regards,<br/>The HR CoPilot Team</p>
            </div>
        `;
        return sendEmail(email, "Payment Confirmed - Order Activated", html);
    },

    /**
     * Sends a marketing nudge when a user tries to generate a document but has no credits.
     */
    sendInsufficientCreditNudge: async (email: string, name: string, documentTitle: string) => {
        const html = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="HR CoPilot" style="height: 48px;" />
                </div>
                <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; text-align: center; margin-bottom: 16px;">Don't let compliance slip through the cracks!</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #475569; text-align: center; margin-bottom: 32px;">
                    Hi ${name || 'there'}, we noticed you were trying to generate a <strong>${documentTitle}</strong>, but your credit balance was too low.
                </p>
                <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px dashed #cbd5e1;">
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Recommended Action</p>
                    <p style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 500;">
                        Top up your credits now to secure your business and stay compliant with South African labour laws.
                    </p>
                </div>
                <div style="text-align: center;">
                    <a href="https://app.hrcopilot.co.za" style="display: inline-block; background-color: #188693; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(24, 134, 147, 0.2);">Secure My Business Now</a>
                </div>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
                <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
                    You received this because you attempted to use a premium feature on HR CoPilot.<br/>
                    &copy; 2026 HR CoPilot - South Africa's Smartest HR Assistant.
                </p>
            </div>
        `;
        return sendEmail(email, "Quick fix for your HR Compliance", html);
    }
};