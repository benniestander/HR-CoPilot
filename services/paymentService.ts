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

// 1. REPLACE WITH YOUR YOCO LIVE PUBLIC KEY FOR PRODUCTION
// Using Vite env var for secure configuration with safe access
const meta = import.meta as any;
export const YOCO_PUBLIC_KEY = meta.env?.VITE_YOCO_PUBLIC_KEY || 'pk_live_922ec78alWPdK17eeac4'; 

/* 
   ==============================================================================
   CRITICAL: SUPABASE EDGE FUNCTION SETUP
   ==============================================================================
   
   You must deploy a Supabase Edge Function named 'process-payment' for this to work.
   
   1. Run: supabase functions new process-payment
   2. Paste the code below into supabase/functions/process-payment/index.ts
   3. Run: supabase secrets set YOCO_SECRET_KEY=sk_live_...
   4. Run: supabase secrets set SUPABASE_URL=...
   5. Run: supabase secrets set SUPABASE_SERVICE_ROLE_KEY=... (Found in Project Settings -> API -> Service Role)
   6. Run: supabase functions deploy process-payment

   --- EDGE FUNCTION CODE START (Copy ONLY this block into index.ts) ---
   
   // ⚠️ IMPORTANT: Do NOT import '../services/supabase' or any local files here.
   
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
   }

   Deno.serve(async (req) => {
     if (req.method === 'OPTIONS') {
       return new Response('ok', { headers: corsHeaders })
     }

     try {
       const YOCO_SECRET_KEY = Deno.env.get('YOCO_SECRET_KEY');
       const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
       const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

       const { token, amountInCents, currency, description, metadata } = await req.json()
       
       if (!YOCO_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
         return new Response(
           JSON.stringify({ error: "Server configuration error (Missing Secrets)." }), 
           { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
         )
       }

       // 1. Charge the card via Yoco API (Server-Side Charge)
       const response = await fetch('https://online.yoco.com/v1/charges/', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Secret ${YOCO_SECRET_KEY}`
         },
         body: JSON.stringify({
           token, // Token received from frontend SDK popup
           amountInCents,
           currency: currency || 'ZAR',
           metadata: metadata
         })
       })

       const data = await response.json()

       if (!response.ok) {
         console.error('Yoco Error:', data);
         return new Response(
           JSON.stringify({ error: data.displayMessage || 'Payment Declined by Gateway' }), 
           { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
         )
       }

       if (data.status === 'successful') {
         // 2. PAYMENT SUCCESSFUL - UPDATE DATABASE VIA ADMIN CLIENT
         const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
         const userId = metadata?.userId;
         const type = metadata?.type; // 'subscription' | 'topup'
         const couponCode = metadata?.couponCode;
         
         // SECURE CALCULATION: Do not trust client metadata for credit value.
         // Calculate credit based on Amount Paid + Server-Verified Coupon.
         let creditToAdd = amountInCents; // Default: You get what you paid for.

         // Handle Coupons Server-Side
         if (couponCode) {
             const { data: coupon } = await supabaseAdmin.from('coupons').select('*').eq('code', couponCode).single();
             
             if (coupon && coupon.active) {
                 // Reverse calculate the value
                 if (coupon.discount_type === 'fixed') {
                     // If they paid X, and discount was Y, the Value is X + Y
                     creditToAdd = amountInCents + coupon.discount_value;
                 } else if (coupon.discount_type === 'percentage') {
                     // If they paid X, which is (100% - Discount%), then Value = X / (1 - Discount%)
                     const factor = 1 - (coupon.discount_value / 100);
                     if (factor > 0) {
                        creditToAdd = Math.round(amountInCents / factor);
                     }
                 }
                 // Track usage
                 await supabaseAdmin.rpc('increment_coupon_uses', { coupon_code: couponCode });
             } else {
                 console.warn(`Invalid or inactive coupon used: ${couponCode}. Crediting paid amount only.`);
             }
         }

         if (userId && type) {
            // For subscriptions, the cost is the "value", for topups, it's the calculated credit
            const txAmount = type === 'subscription' ? -amountInCents : creditToAdd;
            
            // Insert Transaction Record
            await supabaseAdmin.from('transactions').insert({
                user_id: userId,
                amount: txAmount,
                description: description || 'Payment',
                date: new Date().toISOString()
            });

            // Update User Profile
            if (type === 'topup') {
                // ATOMIC UPDATE
                await supabaseAdmin.rpc('increment_balance', { 
                    user_id: userId, 
                    amount: creditToAdd 
                });
            } else if (type === 'subscription') {
                await supabaseAdmin.from('profiles').update({ plan: 'pro' }).eq('id', userId);
            }
         }

         return new Response(
           JSON.stringify({ success: true, id: data.id }), 
           { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
         )
       } else {
         return new Response(
           JSON.stringify({ error: 'Payment status not successful' }), 
           { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
         )
       }
     } catch (error) {
       console.error("Edge Function Exception:", error);
       return new Response(
         JSON.stringify({ error: error.message }), 
         { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
       )
     }
   })

   --- EDGE FUNCTION CODE END ---
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

// Improved Loader with retry capability
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
      // If script exists but SDK isn't ready, verify if it failed or is still loading
      // We can't easily check 'error' state on existing script tag without custom tracking
      // Best bet: wait a bit, if not ready, inject new one? No, that causes conflicts.
      // Just wait for load event if attached, or poll.
      if (typeof window.YocoSDK !== 'undefined') {
          resolve(window.YocoSDK);
          return;
      }
    }

    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    
    script.onload = () => {
      if (window.YocoSDK) resolve(window.YocoSDK);
      else reject(new Error("Yoco SDK loaded but window.YocoSDK is undefined"));
    };
    
    script.onerror = () => {
      sdkLoadingPromise = null; // Clear so we can try again
      if (retries > 0) {
          console.warn(`Yoco SDK load failed. Retrying... (${retries} left)`);
          setTimeout(() => {
              loadYocoSdk(retries - 1).then(resolve).catch(reject);
          }, 1000);
      } else {
          reject(new Error("Failed to load Yoco SDK after multiple attempts."));
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
};```tsx
import React, { useState } from 'react';
import { CreditCardIcon, LoadingIcon, ShieldCheckIcon, CouponIcon } from './Icons';
import { useAuthContext } from '../contexts/AuthContext';
import { processPayment } from '../services/paymentService';
import { validateCoupon } from '../services/dbService';
import { useDataContext } from '../contexts/DataContext';

interface PaygPaymentPageProps {
  onTopUpSuccess: (amountInCents: number) => void;
  onCancel: () => void;
  onUpgrade: () => void;
}

const PaygPaymentPage: React.FC<PaygPaymentPageProps> = ({ onTopUpSuccess, onCancel, onUpgrade }) => {
  const { user } = useAuthContext();
  const { proPlanPrice } = useDataContext(); 
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10000); // Default to R100
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const [formData, setFormData] = useState({ 
    firstName: user?.name?.split(' ')[0] || '', 
    lastName: user?.name?.split(' ').slice(1).join(' ') || '', 
  });
  const [errors, setErrors] = useState({ firstName: '', lastName: '' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [discount, setDiscount] = useState(0); // In cents
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  const handleAmountSelect = (amount: number | 'custom') => {
    if (amount === 'custom') {
      setIsCustom(true);
      setSelectedAmount(null);
    } else {
      setIsCustom(false);
      setSelectedAmount(amount);
      setCustomAmount('');
    }
    // Reset coupon on amount change to force re-validation logic
    setDiscount(0);
    setAppliedCouponCode(null);
    setCouponMessage(null);
    setCouponCode('');
  };

  const baseAmount = isCustom ? (Number(customAmount) * 100) : selectedAmount;
  const finalAmount = baseAmount ? Math.max(0, baseAmount - discount) : 0;

  const validateField = (name: keyof typeof formData, value: string) => {
    let error = '';
    if (!value.trim()) {
        const fieldName = String(name).replace(/([A-Z])/g, ' $1').toLowerCase();
        error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof typeof formData; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleApplyCoupon = async () => {
      if (!couponCode.trim() || !baseAmount) return;
      setCouponMessage(null);
      try {
          const result = await validateCoupon(couponCode.trim(), 'payg');
          if (result.valid && result.coupon) {
              let calculatedDiscount = 0;
              if (result.coupon.discountType === 'fixed') {
                  calculatedDiscount = result.coupon.discountValue;
              } else {
                  calculatedDiscount = (baseAmount * result.coupon.discountValue) / 100;
              }
              
              // Cap discount at 100%
              if (calculatedDiscount > baseAmount) calculatedDiscount = baseAmount;

              setDiscount(calculatedDiscount);
              setAppliedCouponCode(result.coupon.code);
              setCouponMessage({ type: 'success', text: `Coupon applied! You save R${(calculatedDiscount / 100).toFixed(2)}` });
          } else {
              setDiscount(0);
              setAppliedCouponCode(null);
              setCouponMessage({ type: 'error', text: result.message || 'Invalid coupon.' });
          }
      } catch (error) {
          setCouponMessage({ type: 'error', text: 'Error validating coupon.' });
      }
  };

  const isUserDetailsValid = Object.values(formData).every(val => typeof val === 'string' && val.trim() !== '') && Object.values(errors).every(err => err === '');
  const isAmountValid = baseAmount !== null && baseAmount >= 5000; // Min R50
  
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const isFirstNameValid = validateField('firstName', formData.firstName);
    const isLastNameValid = validateField('lastName', formData.lastName);

    if (!isAmountValid || !isFirstNameValid || !isLastNameValid || !baseAmount || !user) return;

    setIsLoading(true);
    setApiError(null);

    // Trigger the payment portal (Yoco SDK Popup)
    const result = await processPayment({
        amountInCents: Math.round(finalAmount), // Amount to charge card
        name: `Credit Top-Up R${(finalAmount / 100).toFixed(2)}`,
        description: 'Credit for HR CoPilot',
        customer: {
            name: formData.firstName,
            surname: formData.lastName,
            email: user.email
        },
        metadata: {
            userId: user.uid,
            type: 'topup',
            couponCode: appliedCouponCode || undefined
        }
    });

    setIsLoading(false);

    if (result.success) {
        // Payment successful - update credit balance in UI
        onTopUpSuccess(baseAmount); 
    } else if (result.error && result.error !== "User cancelled") {
        setApiError(`Payment failed: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-light font-sans">
        <header className="py-4 px-6 container mx-auto flex justify-start items-center">
             <button onClick={onCancel} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Back to Dashboard
            </button>
        </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-3xl font-bold text-secondary mb-2 text-center">Top Up Your Credit</h1>
                <p className="text-gray-600 mb-6 text-center">Add funds to your account to generate documents.</p>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center mb-6">
                    <p className="text-sm text-green-800">Your current balance is</p>
                    <p className="text-4xl font-bold text-green-900">R{(Number(user?.creditBalance) / 100).toFixed(2)}</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-secondary mb-3">Choose an amount:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[10000, 20000, 50000].map(amount => (
                                <button type="button" key={amount} onClick={() => handleAmountSelect(amount)} className={`p-4 border-2 rounded-lg text-center font-bold transition-colors ${selectedAmount === amount ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'}`}>
                                    R{(amount/100)}
                                </button>
                            ))}
                            <button type="button" onClick={() => handleAmountSelect('custom')} className={`p-4 border-2 rounded-lg text-center font-bold transition-colors ${isCustom ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'}`}>
                                Custom
                            </button>
                        </div>
                        {isCustom && (
                            <div className="mt-4">
                                <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700">Custom Amount (R)</label>
                                <input type="number" id="customAmount" value={customAmount} onChange={e => setCustomAmount(e.target.value)} min="50" placeholder="e.g. 150" className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm border-gray-300" />
                                {Number(customAmount) > 0 && Number(customAmount) < 50 && <p className="text-red-600 text-xs mt-1">Minimum top-up is R50.</p>}
                            </div>
                        )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-secondary mb-3">Your Payment Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
                          {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
                          {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Coupon Section */}
                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Have a coupon?</label>
                        <div className="flex space-x-2">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CouponIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    value={couponCode} 
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                                    placeholder="Enter code" 
                                    className="block w-full pl-10 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                    disabled={!baseAmount}
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={handleApplyCoupon} 
                                disabled={!couponCode || !baseAmount}
                                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:bg-gray-400 transition-colors text-sm font-medium"
                            >
                                Apply
                            </button>
                        </div>
                        {couponMessage && (
                            <p className={`text-xs mt-1 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {couponMessage.text}
                            </p>
                        )}
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4 font-bold text-lg text-secondary">
                            <span>Total to Pay</span>
                            <span>R{(finalAmount / 100).toFixed(2)}</span>
                        </div>
                        <button type="submit" disabled={isLoading || !isAmountValid || !isUserDetailsValid} className="w-full bg-primary text-white font-bold py-4 px-4 rounded-lg text-lg hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex items-center justify-center">
                            {isLoading ? (
                                <><LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5" /> Opening Payment Portal...</>
                            ) : (
                                <>
                                <CreditCardIcon className="w-6 h-6 mr-3" />
                                Proceed to Pay
                                </>
                            )}
                        </button>
                        {apiError && <p className="text-xs text-red-600 text-center mt-3">{apiError}</p>}
                        <p className="text-xs text-gray-400 text-center mt-4">
                            You will be redirected to the secure Yoco payment gateway.
                        </p>
                    </div>
                </form>
            </div>

            <div className="mt-8 p-6 border-2 border-dashed border-accent rounded-lg bg-accent/10 text-center">
                 <h3 className="text-2xl font-bold text-accent-800">Go Unlimited!</h3>
                 <p className="text-accent-700 my-3 max-w-md mx-auto">Tired of topping up? Upgrade to HR CoPilot Pro for R{(proPlanPrice / 100).toFixed(0)} and get unlimited document generation for a full year, plus access to all premium features.</p>
                 <button onClick={onUpgrade} className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors inline-flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    Upgrade to Pro Now
                 </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default PaygPaymentPage;