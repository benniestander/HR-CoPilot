import { supabase } from './supabase';

// ==============================================================================
// CONFIGURATION
// ==============================================================================

interface PaymentDetails {
  amountInCents: number;
  currency?: 'ZAR';
  name: string;
  description?: string;
  customer: {
    name: string;
    surname: string;
    email: string;
    phone?: string;
  };
  metadata?: {
    userId?: string;
    type?: 'subscription' | 'topup';
    couponCode?: string;
  };
}

export const processPayment = async (details: PaymentDetails): Promise<{ success: boolean; redirectUrl?: string; error?: string }> => {
  try {
    const returnUrl = window.location.origin + '/#/'; // Base URL for returns

    const { data, error } = await supabase.functions.invoke('process-payment', {
        body: { 
            amountInCents: details.amountInCents,
            currency: 'ZAR',
            name: details.name,
            description: details.description,
            metadata: details.metadata,
            returnUrl: returnUrl // Pass the base URL for success/cancel redirects
        }
    });

    if (error) {
        console.error("Edge Function Invoke Error:", error);
        let msg = error.message || "Payment initiation failed.";
        return { success: false, error: msg };
    }

    if (data && data.redirectUrl) {
        // Redirect the user to Yoco's secure checkout page
        window.location.href = data.redirectUrl;
        // Return success: true to indicate the process started, though the page will unload
        return { success: true, redirectUrl: data.redirectUrl };
    } else if (data && data.error) {
        return { success: false, error: data.error };
    } else {
        return { success: false, error: "Invalid response from payment server." };
    }

  } catch (err: any) {
      console.error("Payment Exception:", err);
      return { success: false, error: "Network error initiating payment. Please check your connection." };
  }
};
