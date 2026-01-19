
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingIcon, WarningIcon } from './Icons';
import { paymentService } from '../services/paymentService';

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

export const PaymentModal: React.FC<PaymentModalProps> = ({
    amountInCents,
    currency = 'ZAR',
    metadata,
    onCancel,
    onError,
}) => {
    const [status, setStatus] = useState<'initializing' | 'error'>('initializing');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const startCheckout = async () => {
            try {
                // Construct success/cancel URLs based on current location
                const baseUrl = window.location.origin + window.location.pathname;
                // Yoco Checkout API will redirect to these URLs. 
                // We use standard query params for the initial redirect to avoid 400 errors from Yoco regarding '#' or '{ }' characters.
                const successUrl = `${baseUrl}?payment=success`;
                const cancelUrl = `${baseUrl}?payment=cancel`;

                console.log("Creating checkout session with URLs:", { successUrl, cancelUrl });
                const result = await paymentService.processPayment({
                    amountInCents,
                    currency,
                    metadata: {
                        userId: metadata?.userId, // Explicitly pass userId
                        type: metadata?.type,
                        description: metadata?.type === 'topup' ? `Credit Top-up: R${(amountInCents / 100).toFixed(2)}` : 'Pro Subscription'
                    },
                    successUrl,
                    cancelUrl
                });

                if (result.redirectUrl) {
                    console.log("Redirecting to Yoco Checkout:", result.redirectUrl);
                    // Store the ID locally so we can verify it on return (since Yoco hates { } in URLs)
                    if (result.checkoutId) {
                        localStorage.setItem('pendingCheckoutId', result.checkoutId);
                    }
                    // Small delay so user sees we are doing something
                    setTimeout(() => {
                        window.location.href = result.redirectUrl;
                    }, 800);
                } else {
                    throw new Error("No redirect URL received from Yoco.");
                }
            } catch (err: any) {
                console.error("Checkout Error:", err);
                setStatus('error');
                setErrorMessage(err.message || "Failed to start payment session. Please try again.");
                onError(err.message || "Checkout failed");
            }
        };

        startCheckout();
    }, [amountInCents, currency, metadata, onError]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm">
            <AnimatePresence mode="wait">
                {status === 'initializing' && (
                    <motion.div
                        key="init"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="bg-white p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center"
                    >
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <LoadingIcon className="w-16 h-16 text-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-white rounded-full" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-2">Preparing Payment</h3>
                        <p className="text-gray-500 mb-6">Securing your session with Yoco. You will be redirected to their payment page in a moment...</p>
                        <div className="flex items-center space-x-2 justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span>Secure Connection</span>
                        </div>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-red-100"
                    >
                        <div className="flex justify-center mb-6">
                            <WarningIcon className="w-16 h-16 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-2">Checkout Error</h3>
                        <p className="text-red-500 text-sm mb-6">{errorMessage}</p>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PaymentModal;
