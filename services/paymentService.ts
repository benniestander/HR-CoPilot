import { supabase } from './supabase';

// ==============================================================================
// GLOBAL TYPES
// ==============================================================================
declare global {
  interface Window {
    YocoSDK: any;
  }
}

// ==============================================================================
// CONFIGURATION
// ==============================================================================

// Robust safe access for env vars
const env = (import.meta as any).env || {};

// Use Test Key by default in development if not specified, to match standard Test Secret Keys
export const YOCO_PUBLIC_KEY = env.VITE_YOCO_PUBLIC_KEY || 'pk_test_ed6c5c66gO2y778f24a0'; 

/* 
   ==============================================================================
   CRITICAL: SUPABASE EDGE FUNCTION SETUP
   ==============================================================================
   You must deploy a Supabase Edge Function named 'process-payment' for this to work.
   Ensure you have set the 'YOCO_SECRET_KEY' in your Supabase Secrets to match
   the environment of your Public Key (Live vs Test).
*/

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

let sdkLoadingPromise: Promise<any> | null = null;

const loadYocoSdk = (retries = 3): Promise<any> => {
  // If already loaded globally (e.g. from index.html)
  if (typeof window.YocoSDK !== 'undefined') {
    return Promise.resolve(window.YocoSDK);
  }

  // If currently loading
  if (sdkLoadingPromise) {
    return sdkLoadingPromise;
  }

  sdkLoadingPromise = new Promise((resolve, reject) => {
    // Check if script tag exists but maybe not loaded yet
    const existingScript = document.querySelector('script[src="https://js.yoco.com/sdk/v1/yoco-sdk-web.js"]');

    if (existingScript) {
      let attempts = 0;
      const checkInterval = setInterval(() => {
          if (typeof window.YocoSDK !== 'undefined') {
              clearInterval(checkInterval);
              resolve(window.YocoSDK);
          } else {
              attempts++;
              if (attempts > 50) { 
                  clearInterval(checkInterval);
                  reject(new Error("Yoco SDK script present but failed to initialize."));
              }
          }
      }, 100);
      return;
    }

    // Inject if missing
    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    
    script.onload = () => {
      if (typeof window.YocoSDK !== 'undefined') resolve(window.YocoSDK);
      else reject(new Error("Yoco SDK loaded but window.YocoSDK is undefined"));
    };
    
    script.onerror = () => {
      sdkLoadingPromise = null; 
      if (retries > 0) {
          console.warn(`Yoco SDK load failed. Retrying... (${retries} left)`);
          setTimeout(() => {
              loadYocoSdk(retries - 1).then(resolve).catch(reject);
          }, 1000);
      } else {
          reject(new Error("Failed to load Yoco SDK after multiple attempts. Please check your connection."));
      }
    };
    
    document.head.appendChild(script);
  });

  return sdkLoadingPromise;
};

export const processPayment = async (details: PaymentDetails): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const YocoSDK = await loadYocoSdk();

    return new Promise((resolve) => {
        const yoco = new YocoSDK({
            publicKey: YOCO_PUBLIC_KEY,
        });

        yoco.showPopup({
            amountInCents: details.amountInCents,
            currency: details.currency || 'ZAR',
            name: details.name,
            description: details.description || 'HR CoPilot Purchase',
            // Correctly map app data to Yoco SDK expectations
            customer: {
                firstName: details.customer.name,
                lastName: details.customer.surname,
                email: details.customer.email,
                phone: details.customer.phone
            },
            callback: async (result: any) => {
                if (result.error) {
                    if (result.error.message === "User closed popup") {
                        resolve({ success: false, error: "User cancelled" }); 
                    } else {
                        resolve({ success: false, error: result.error.message });
                    }
                } else {
                    try {
                        const { data, error } = await supabase.functions.invoke('process-payment', {
                            body: { 
                                token: result.id, 
                                amountInCents: details.amountInCents,
                                currency: 'ZAR',
                                description: details.description,
                                metadata: details.metadata
                            }
                        });

                        if (error) {
                            console.error("Edge Function Invoke Error:", error);
                            // Detect Yoco "We are currently experiencing issues" generic error which often implies Auth/Key Mismatch
                            let msg = error.message || "Payment verification failed.";
                            
                            // Check if the backend returned our custom JSON error
                            try {
                                if (error.context && typeof error.context.json === 'function') {
                                    const jsonErr = await error.context.json();
                                    if (jsonErr && jsonErr.error) msg = jsonErr.error;
                                }
                            } catch (e) { /* ignore parse error */ }

                            resolve({ success: false, error: msg });
                            return;
                        }

                        // Handle Logic Errors returned by Function (e.g. Price mismatch)
                        if (data && data.error) {
                            console.error("Edge Function Logic Error:", data.error);
                            let errMsg = data.error;
                            
                            // Map the specific Yoco "issues" error to something actionable for the admin/developer
                            if (errMsg.includes("We are currently experiencing issues") || errMsg.includes("Payment Configuration Error")) {
                                errMsg = "Configuration Error: Please check that your Yoco Public and Secret keys match (Live vs Test).";
                            }
                            
                            resolve({ success: false, error: errMsg });
                            return;
                        }

                        if (data && data.success) {
                            console.log("Payment Verified & Charged:", data.id);
                            resolve({ success: true, id: data.id });
                        } else {
                            resolve({ success: false, error: "Unknown payment state from server." });
                        }

                    } catch (err: any) {
                        console.error("Payment Exception:", err);
                        resolve({ success: false, error: "Network error verifying payment. Please check your connection." });
                    }
                }
            },
        });
    });
  } catch (e: any) {
      console.error("SDK Load Error:", e);
      return { success: false, error: e.message || "Could not load payment gateway." };
  }
};