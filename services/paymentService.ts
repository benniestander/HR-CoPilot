
// This file is deprecated as the application has switched to a manual invoice request workflow.
// See services/dbService.ts (submitInvoiceRequest) and services/emailService.ts.

export const processPayment = async (details: any): Promise<{ success: boolean; id?: string; error?: string }> => {
    console.warn("processPayment called but payment gateway is disabled.");
    return { success: false, error: "Online payments are currently disabled. Please request an invoice." };
};
