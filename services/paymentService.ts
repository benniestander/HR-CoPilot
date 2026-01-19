import { supabase } from './supabase';

interface ProcessPaymentParams {
    token: string;
    amountInCents: number;
    currency?: string;
    description: string;
    metadata?: any;
}

export const processYocoPayment = async (params: ProcessPaymentParams) => {
    const { data, error } = await supabase.functions.invoke('process-payment', {
        body: params,
    });

    if (error) {
        throw new Error(error.message || 'Payment processing failed');
    }

    if (data.error) {
        throw new Error(data.error);
    }

    return data;
};
