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
export const YOCO_PUBLIC_KEY = env.VITE_YOCO_PUBLIC_KEY || 'pk_live_922ec78alWPdK17eeac4'; 

/* 
   ==============================================================================
   CRITICAL: SUPABASE EDGE FUNCTION SETUP
   ==============================================================================
   You must deploy a Supabase Edge Function named 'process-payment' for this to work.
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
  if (window.YocoSDK) {
    return Promise.resolve(window.YocoSDK);
  }

  if (sdkLoadingPromise) {
    return sdkLoadingPromise;
  }

  sdkLoadingPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://js.yoco.com/sdk/v1/yoco-sdk-web.js"]');

    if (existingScript) {
       if (typeof window.YocoSDK !== 'undefined') {
          resolve(window.YocoSDK);
          return;
      }
      let attempts = 0;
      const checkInterval = setInterval(() => {
          if (window.YocoSDK) {
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

    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    
    script.onload = () => {
      if (window.YocoSDK) resolve(window.YocoSDK);
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
            customer: details.customer,
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
                            const msg = error.message || "Payment verification failed (Server Error). Please contact support.";
                            resolve({ success: false, error: msg });
                            return;
                        }

                        if (data && data.error) {
                            console.error("Edge Function Logic Error:", data.error);
                            resolve({ success: false, error: data.error });
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