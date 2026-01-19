import { supabase } from './supabase';

export const paymentService = {
    async processPayment(params: {
        amountInCents: number;
        currency?: string;
        description?: string;
        metadata?: any;
        successUrl: string;
        cancelUrl: string;
    }) {
        const { data, error } = await supabase.functions.invoke('process-payment', {
            body: params,
        });

        // Supabase-js returns a generic error for non-2xx. 
        // We try to get the specific reason from the data body if available.
        if (error) {
            const context = data?.error || error.message;
            throw new Error(context);
        }
        return data;
    },

    async verifyCheckout(checkoutId: string) {
        const { data, error } = await supabase.functions.invoke('verify-checkout', {
            body: { checkoutId },
        });

        if (error) {
            const context = data?.error || error.message;
            throw new Error(context);
        }
        return data; // { success: true, id: string }
    }
};
