import { supabase } from './supabase';

/* 
   ==============================================================================
   CRITICAL: EMAIL EDGE FUNCTION SETUP (ZEPTOMAIL / ZOHO)
   ==============================================================================
   The 'send-email' Edge Function uses ZeptoMail API via the verified domain.
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

/**
 * Enhanced Branded HTML Wrapper
 * Wraps content in a consistent, premium HR CoPilot design.
 */
export const getBrandedHtml = (title: string, content: string, ctaLink?: string, ctaText?: string) => {
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
                    <div style="margin-top: 16px;">
                        <a href="https://app.hrcopilot.co.za" style="color: #cbd5e1; text-decoration: none; font-size: 12px; margin: 0 8px;">Website</a>
                        <span style="color: #e2e8f0;">|</span>
                        <a href="mailto:admin@hrcopilot.co.za" style="color: #cbd5e1; text-decoration: none; font-size: 12px; margin: 0 8px;">Support</a>
                    </div>
                    <p style="margin: 24px 0 0 0; color: #cbd5e1; font-size: 11px;">
                        &copy; ${new Date().getFullYear()} HR CoPilot. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
}

export const emailService = {
    sendWelcomeEmail: async (email: string, name: string) => {
        const content = `
            <p>Hi ${name},</p>
            <p>We are thrilled to have you on board!</p>
            <p>You now have access to South Africa's smartest HR compliance tool. You can start generating compliant policies and forms immediately.</p>
            <p>If you need any help getting started, our support team is just an email away.</p>
        `;
        return sendEmail(email, "Welcome to HR CoPilot", getBrandedHtml("Welcome Aboard!", content, "https://app.hrcopilot.co.za", "Start Generating"));
    },

    sendInvoiceInstructions: async (email: string, name: string, amountInCents: number, reference: string, itemDescription: string) => {
        const amount = (amountInCents / 100).toFixed(2);
        const content = `
            <p>Hi ${name},</p>
            <p>Thank you for your request for: <strong>${itemDescription}</strong>.</p>
            <p>To activate your product, please make an EFT payment of <strong>R${amount}</strong> to the account below.</p>
            
            <div style="background-color: #f1f5f9; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 16px 0; color: #334155; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Banking Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 4px 0; color: #64748b; width: 140px;">Bank</td><td style="color: #0f172a; font-weight: 500;">FNB (First National Bank)</td></tr>
                    <tr><td style="padding: 4px 0; color: #64748b;">Account Name</td><td style="color: #0f172a; font-weight: 500;">HR CoPilot</td></tr>
                    <tr><td style="padding: 4px 0; color: #64748b;">Account Number</td><td style="color: #0f172a; font-weight: 500;">62123456789</td></tr>
                     <tr><td style="padding: 4px 0; color: #64748b;">Branch Code</td><td style="color: #0f172a; font-weight: 500;">250655</td></tr>
                    <tr><td style="padding: 12px 0 0 0; color: #188693; font-weight: 600;">Reference</td><td style="padding: 12px 0 0 0; color: #188693; font-weight: bold; font-size: 18px;">${reference}</td></tr>
                </table>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ol style="margin-bottom: 0;">
                <li>Make the payment using the reference above.</li>
                <li>Email your Proof of Payment to <a href="mailto:admin@hrcopilot.co.za" style="color: #188693;">admin@hrcopilot.co.za</a>.</li>
                <li>Your account will be activated immediately upon receipt.</li>
            </ol>
        `;
        return sendEmail(email, `Invoice Request: ${reference}`, getBrandedHtml("Invoice Details", content));
    },

    sendActivationConfirmation: async (email: string, name: string, type: 'pro' | 'payg', amountInCents: number) => {
        const isPro = type === 'pro';
        const amount = (amountInCents / 100).toFixed(2);
        const content = `
            <p>Hi ${name},</p>
            <p>Great news! We have received your payment of <strong>R${amount}</strong>.</p>
            
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 12px; border: 1px solid #d1fae5; margin: 24px 0;">
                <h3 style="margin: 0 0 8px 0; color: #065f46; font-size: 16px;">${isPro ? 'Pro Membership Active' : 'Credits Added'}</h3>
                <p style="margin: 0; color: #064e3b; font-size: 15px;">
                    ${isPro
                ? 'Your account has been upgraded to HR CoPilot Pro. You now have unlimited access for 12 months.'
                : `R${amount} credit has been added to your balance. You can now generate documents.`
            }
                </p>
            </div>
            <p>You can login to your dashboard immediately to start using your new features.</p>
        `;
        return sendEmail(email, "Payment Confirmed", getBrandedHtml("Order Activated!", content, "https://app.hrcopilot.co.za", "Go to Dashboard"));
    },

    sendInsufficientCreditNudge: async (email: string, name: string, documentTitle: string) => {
        const content = `
            <p>Hi ${name || 'there'},</p> 
            <p>We noticed you were trying to generate a <strong>${documentTitle}</strong>, but your credit balance was too low.</p>
            <div style="background-color: #fff7ed; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #ffedd5;">
                <p style="margin: 0; font-size: 13px; font-weight: 700; color: #c2410c; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Recommended Action</p>
                <p style="margin: 0; font-size: 15px; color: #9a3412;">
                    Top up your credits now to secure your business and stay compliant with South African labour laws.
                </p>
            </div>
        `;
        return sendEmail(email, "Quick fix for your HR Compliance", getBrandedHtml("Don't let compliance slip!", content, "https://app.hrcopilot.co.za", "Secure My Business Now"));
    },

    sendSupportAutoReply: async (email: string, name: string, ticketId?: string) => {
        const content = `
            <p>Hi ${name},</p>
            <p>Thanks for reaching out to HR CoPilot. This is an automated reply to confirm we've received your inquiry.</p>
            <p>Our team is reviewing your message and will get back to you shortly (usually within 24 hours).</p>
            ${ticketId ? `<p style="color: #64748b; font-size: 14px; margin-top: 24px;">Ticket Reference: <strong>${ticketId}</strong></p>` : ''}
        `;
        return sendEmail(email, "Message Received", getBrandedHtml("We're on it", content));
    },

    sendRetentionNudge: async (email: string, name: string) => {
        const content = `
            <p>Hi ${name || 'there'},</p>
            <p>We noticed you signed up for HR CoPilot but haven't generated any documents yet.</p>
            <p>Is there anything we can help you with? Our system is designed to make HR compliance effortless for South African businesses.</p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0;">
                <p style="margin: 0; font-weight: 700; color: #188693;">Did you know?</p>
                <p style="margin: 4px 0 0 0;">You can generate a tailored Employment Contract or Leave Policy in under 5 minutes.</p>
            </div>
            <p>Reply to this email if you need assistance!</p>
        `;
        return sendEmail(email, "We miss you at HR CoPilot!", getBrandedHtml("Still there?", content, "https://app.hrcopilot.co.za", "Get Started Now"));
    },

    sendWaitlistWelcome: async (email: string, name: string) => {
        const content = `
            <p>Welcome to the inner circle of <strong>HR CoPilot</strong>.</p>
            <p>You’re now officially on the priority list for South Africa’s first AI-powered HR platform built specifically for the LRA and BCEA landscape.</p>
            
            <p><strong>Why this matters:</strong></p>
            <p>Most SA founders spend R3,500+ an hour on labour consultants or use "Google Templates" that actually put their business at risk. We're ending that.</p>
            
            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a;">Your "Compliance First Steps" Roadmap:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #334155;">
                    <li style="margin-bottom: 12px;"><strong>Audit your Contracts:</strong> Ensure "Notice Period" clauses match BCEA minimums (1 week for 6 months, 2 weeks for 1 year, etc).</li>
                    <li style="margin-bottom: 12px;"><strong>POPIA Check:</strong> Are you storing employee ID numbers in an encrypted environment?</li>
                    <li><strong>Disciplinary Code:</strong> Without one, you’re unprotected at the CCMA.</li>
                </ul>
            </div>
            
            <p>We’ll be reaching out soon with a private link to audit your existing policies for free using our AI.</p>
            <p>Stay compliant,</p>
            <p><strong>The HR CoPilot Team</strong></p>
        `;
        return sendEmail(email, "🇿🇦 You’re on the list! (And your exclusive HR roadmap)", getBrandedHtml("Welcome Aboard!", content));
    }
};