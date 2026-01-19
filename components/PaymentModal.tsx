import React, { useEffect, useRef, useState } from 'react';
import { LoadingIcon, LockIcon } from './Icons';

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
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const yocoContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if script is already loaded
        if (window.YocoSDK) {
            setSdkLoaded(true);
            return;
        }

        // Load Yoco SDK
        const script = document.createElement('script');
        script.src = "https://js.yoco.com/sdk/v1/yoco-sdk-web.js";
        script.async = true;
        script.onload = () => setSdkLoaded(true);
        script.onerror = () => onError("Failed to load payment gateway.");
        document.body.appendChild(script);

        return () => {
            // Cleanup if needed
        };
    }, [onError]);

    useEffect(() => {
        if (sdkLoaded && yocoContainerRef.current && !processing) {
            try {
                const yoco = new window.YocoSDK({
                    publicKey: publicKey,
                });

                yoco.showPopup({
                    amountInCents: amountInCents,
                    currency: currency,
                    name: 'HR CoPilot',
                    description: metadata?.description || 'Payment',
                    email: userEmail,
                    metadata: metadata,
                    callback: async (result: any) => {
                        if (result.error) {
                            onError(result.error.message);
                            // Don't close immediately on error, allow retry? 
                            // Yoco popup handles retries usually, but if callback fires with error it usually closes.
                            onCancel();
                        } else {
                            setProcessing(true);
                            // Token received, now verify on backend
                            onSuccess(result);
                        }
                    },
                });

                // Note: Yoco Inline is different from Popup. 
                // If we want Inline we target a Div. 
                // For Popup, the showPopup method handles UI. 
                // This component essentially just triggers the popup.

            } catch (err: any) {
                console.error("Yoco Init Error:", err);
                onError("Could not initialize payment system.");
            }
        }
    }, [sdkLoaded, publicKey, amountInCents, currency, userEmail, metadata, onSuccess, onError, onCancel, processing]);

    // Since Yoco Popup manages its own UI overlay, we might just want to show a backdrop 
    // or a "Waiting for payment" state if the popup is active.
    // However, calling showPopup usually creates an iframe/overlay.

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
                {processing ? (
                    <>
                        <LoadingIcon className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Processing Payment...</h3>
                        <p className="text-gray-500 mt-2">Please wait while we confirm your transaction securely.</p>
                    </>
                ) : (
                    <>
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LockIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Secure Payment</h3>
                        <p className="text-gray-500 mt-2 mb-6">Connecting to Yoco Secure Gateway...</p>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 text-sm font-medium underline"
                        >
                            Cancel Transaction
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
