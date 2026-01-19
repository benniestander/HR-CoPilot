import React, { useEffect, useState, useCallback } from 'react';
import { LoadingIcon } from './Icons';

interface PaymentModalProps {
    amountInCents: number;
    currency?: string;
    metadata?: any;
    userEmail: string;
    publicKey: string;
    onSuccess: (result: any) => void;
    onCancel: () => void;
    onError: (error: string) => void;
}

declare global {
    interface Window {
        YocoSDK: any;
    }
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    amountInCents,
    currency = 'ZAR',
    metadata,
    userEmail,
    publicKey,
    onSuccess,
    onCancel,
    onError,
}) => {
    const [status, setStatus] = useState<'loading' | 'ready' | 'processing' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const initializePayment = useCallback(() => {
        if (!window.YocoSDK) {
            console.error("Yoco SDK not available");
            setStatus('error');
            setErrorMessage("Payment system failed to load. Please refresh and try again.");
            return;
        }

        try {
            console.log("Initializing Yoco with key:", publicKey.substring(0, 15) + "...");

            const yoco = new window.YocoSDK({
                publicKey: publicKey,
            });

            setStatus('processing');

            yoco.showPopup({
                amountInCents: amountInCents,
                currency: currency,
                name: 'HR CoPilot',
                description: 'Credit Top-Up',
                metadata: metadata || {},
                callback: function (result: any) {
                    if (result.error) {
                        console.error("Yoco Error:", result.error);
                        setErrorMessage(result.error.message || "Payment was declined.");
                        setStatus('error');
                        onError(result.error.message);
                    } else {
                        console.log("Yoco Success, token:", result.id);
                        onSuccess(result);
                    }
                }
            });

        } catch (err: any) {
            console.error("Yoco Init Error:", err);
            setErrorMessage("Could not initialize payment: " + err.message);
            setStatus('error');
            onError(err.message);
        }
    }, [amountInCents, currency, metadata, publicKey, onSuccess, onError]);

    useEffect(() => {
        // Load SDK or use existing
        const loadAndInit = () => {
            if (window.YocoSDK) {
                console.log("Yoco SDK already loaded");
                setStatus('ready');
                // Small delay to ensure React has rendered
                setTimeout(() => initializePayment(), 100);
                return;
            }

            // Check if script is already in DOM
            const existingScript = document.querySelector('script[src*="yoco-sdk"]');
            if (existingScript) {
                // Script exists, wait for it to load
                existingScript.addEventListener('load', () => {
                    setStatus('ready');
                    setTimeout(() => initializePayment(), 100);
                });
                return;
            }

            // Load fresh
            const script = document.createElement('script');
            script.src = "https://js.yoco.com/sdk/v1/yoco-sdk-web.js";
            script.async = true;
            script.onload = () => {
                console.log("Yoco SDK loaded");
                setStatus('ready');
                setTimeout(() => initializePayment(), 100);
            };
            script.onerror = () => {
                console.error("Failed to load Yoco SDK");
                setErrorMessage("Failed to load payment gateway. Please try again.");
                setStatus('error');
                onError("Failed to load payment gateway.");
            };
            document.head.appendChild(script);
        };

        loadAndInit();
    }, [initializePayment, onError]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8 text-center">
                {status === 'loading' && (
                    <>
                        <LoadingIcon className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-secondary mb-2">Loading Payment Gateway</h3>
                        <p className="text-gray-500 text-sm">Please wait...</p>
                    </>
                )}

                {status === 'ready' && (
                    <>
                        <LoadingIcon className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-secondary mb-2">Initializing...</h3>
                        <p className="text-gray-500 text-sm">Starting secure payment...</p>
                    </>
                )}

                {status === 'processing' && (
                    <>
                        <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-2">Secure Payment</h3>
                        <p className="text-gray-500 text-sm mb-2">Amount: <span className="font-bold text-secondary">R{(amountInCents / 100).toFixed(2)}</span></p>
                        <p className="text-gray-400 text-xs">Complete your payment in the Yoco popup window.</p>
                        <p className="text-gray-400 text-xs mt-1">Don't see the popup? Check if it was blocked by your browser.</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-red-600 mb-2">Payment Error</h3>
                        <p className="text-gray-600 text-sm mb-4">{errorMessage}</p>
                        <button
                            onClick={() => {
                                setStatus('loading');
                                setErrorMessage(null);
                                setTimeout(() => initializePayment(), 500);
                            }}
                            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 mr-2"
                        >
                            Try Again
                        </button>
                    </>
                )}

                <div className="mt-6 pt-4 border-t">
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                    >
                        Cancel Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};
