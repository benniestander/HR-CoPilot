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
    const [error, setError] = useState<string | null>(null);
    const inlineContainerRef = useRef<HTMLDivElement>(null);
    const yocoInstanceRef = useRef<any>(null);
    const inlineCardRef = useRef<any>(null);

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
        script.onload = () => {
            console.log("Yoco SDK loaded successfully");
            setSdkLoaded(true);
        };
        script.onerror = () => {
            console.error("Failed to load Yoco SDK");
            setError("Failed to load payment gateway. Please try again later.");
            onError("Failed to load payment gateway.");
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup inline card if it exists
            if (inlineCardRef.current) {
                try {
                    inlineCardRef.current.unmount();
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
        };
    }, [onError]);

    useEffect(() => {
        if (sdkLoaded && inlineContainerRef.current && !yocoInstanceRef.current) {
            try {
                console.log("Initializing Yoco SDK with key:", publicKey.substring(0, 10) + "...");

                const yoco = new window.YocoSDK({
                    publicKey: publicKey,
                });

                yocoInstanceRef.current = yoco;

                // Mount inline card form
                const inline = yoco.inline({
                    layout: 'field',
                    amountInCents: amountInCents,
                    currency: currency,
                });

                inlineCardRef.current = inline;
                inline.mount('#yoco-card-frame');

                console.log("Yoco inline card mounted");

            } catch (err: any) {
                console.error("Yoco Init Error:", err);
                setError("Could not initialize payment system: " + err.message);
                onError("Could not initialize payment system.");
            }
        }
    }, [sdkLoaded, publicKey, amountInCents, currency]);

    const handleSubmitPayment = async () => {
        if (!yocoInstanceRef.current || !inlineCardRef.current) {
            setError("Payment system not ready. Please try again.");
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const result = await inlineCardRef.current.createToken();

            if (result.error) {
                console.error("Token creation failed:", result.error);
                setError(result.error.message || "Card validation failed. Please check your details.");
                setProcessing(false);
                return;
            }

            console.log("Token created successfully:", result.id);
            onSuccess(result);

        } catch (err: any) {
            console.error("Payment error:", err);
            setError(err.message || "Payment failed. Please try again.");
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                    <div className="flex items-center">
                        <div className="bg-white/20 p-3 rounded-full mr-4">
                            <LockIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Secure Payment</h3>
                            <p className="text-white/80 text-sm">Powered by Yoco</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {!sdkLoaded ? (
                        <div className="text-center py-8">
                            <LoadingIcon className="w-10 h-10 text-primary mx-auto animate-spin mb-4" />
                            <p className="text-gray-600">Loading secure payment form...</p>
                        </div>
                    ) : (
                        <>
                            {/* Amount Display */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center border">
                                <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
                                <p className="text-3xl font-bold text-secondary">R{(amountInCents / 100).toFixed(2)}</p>
                            </div>

                            {/* Yoco Inline Card Form */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                                <div
                                    id="yoco-card-frame"
                                    ref={inlineContainerRef}
                                    className="border border-gray-300 rounded-lg p-4 min-h-[50px] bg-white"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Pay Button */}
                            <button
                                onClick={handleSubmitPayment}
                                disabled={processing}
                                className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg text-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center shadow-lg"
                            >
                                {processing ? (
                                    <>
                                        <LoadingIcon className="w-5 h-5 animate-spin mr-3" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>Pay R{(amountInCents / 100).toFixed(2)}</>
                                )}
                            </button>

                            {/* Security Note */}
                            <p className="text-xs text-gray-400 text-center mt-4">
                                🔒 Your payment is secured with 256-bit SSL encryption
                            </p>
                        </>
                    )}
                </div>

                {/* Footer - Cancel */}
                <div className="border-t p-4 bg-gray-50">
                    <button
                        onClick={onCancel}
                        disabled={processing}
                        className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2 disabled:opacity-50"
                    >
                        Cancel Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};
