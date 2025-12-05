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

    // Combine strict metadata with customer info for better tracking in Yoco & Webhooks
    const metadata = {
        ...details.metadata,
        customerName: `${details.customer.name} ${details.customer.surname}`,
        customerEmail: details.customer.email
    };

    const { data, error } = await supabase.functions.invoke('process-payment', {
        body: { 
            amountInCents: details.amountInCents,
            currency: 'ZAR',
            name: details.name,
            description: details.description,
            metadata: metadata,
            returnUrl: returnUrl 
        }
    });

    if (error) {
        console.error("Payment API Error Raw:", error);
        
        let displayMessage = "Payment initiation failed. Please try again.";

        // The 'error' object from supabase.functions.invoke often contains the HTTP Response object 
        // in a property called 'context' if it's a non-2xx error.
        if (error instanceof Error && 'context' in error) {
            const httpError = error as any;
            if (httpError.context && typeof httpError.context.json === 'function') {
                try {
                    // Parse the JSON body sent by our Edge Function (e.g. { "error": "Missing API Key" })
                    const errorBody = await httpError.context.json();
                    if (errorBody && errorBody.error) {
                        displayMessage = errorBody.error;
                    }
                } catch (parseError) {
                    console.warn("Could not parse error response JSON:", parseError);
                }
            }
        } else if (error.message) {
             // Handle generic messages
             if (error.message.includes("non-2xx")) {
                 displayMessage = "The payment server is currently unavailable (Configuration Error).";
             } else {
                 displayMessage = error.message;
             }
        }

        return { success: false, error: displayMessage };
    }

    if (data && data.redirectUrl) {
        // Redirect the user to Yoco's secure checkout page
        window.location.href = data.redirectUrl;
        return { success: true, redirectUrl: data.redirectUrl };
    } else if (data && data.error) {
        console.error("Payment Logic Error:", data);
        return { success: false, error: data.error };
    } else {
        return { success: false, error: "Invalid response from payment server." };
    }

  } catch (err: any) {
      console.error("Payment Exception:", err);
      return { success: false, error: "Network connection issue. Please check your internet." };
  }
};