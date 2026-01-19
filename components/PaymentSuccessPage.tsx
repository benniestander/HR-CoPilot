
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, LoadingIcon, WarningIcon } from './Icons';
import { paymentService } from '../services/paymentService';
import { useAuthContext } from '../contexts/AuthContext';

interface PaymentSuccessPageProps {
    onVerified: () => void;
    onBack: () => void;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ onVerified, onBack }) => {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [error, setError] = useState<string | null>(null);
    const { refetchProfile } = useAuthContext();
    const hasStarted = React.useRef(false);

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        const verify = async () => {
            try {
                // Get checkoutId from URL hash/query or localStorage fallback
                const hash = window.location.hash;
                const search = window.location.search;
                const urlParams = new URLSearchParams(hash.split('?')[1] || search);

                // Try URL first, then localStorage
                let id = urlParams.get('id') || localStorage.getItem('pendingCheckoutId');

                if (!id) {
                    console.error("No ID found in URL or localStorage");
                    setStatus('error');
                    setError("No payment session ID found. Please refresh or contact support.");
                    return;
                }

                // Clear the temporary storage once we have the ID
                localStorage.removeItem('pendingCheckoutId');

                const result = await paymentService.verifyCheckout(id);
                if (result.success) {
                    // Force a refresh of user data so the new balance/plan is visible
                    await refetchProfile();

                    setStatus('success');
                    // Give it a moment for the user to see the success state
                    setTimeout(() => {
                        onVerified();
                    }, 2000);
                } else {
                    throw new Error(result.error || "Verification failed");
                }
            } catch (err: any) {
                console.error("Verification error:", err);
                setStatus('error');
                setError(err.message || "Failed to verify payment with the server.");
            }
        };

        verify();
    }, [onVerified, refetchProfile]);

    return (
        <div className="max-w-md mx-auto py-20 text-center">
            <AnimatePresence mode="wait">
                {status === 'verifying' && (
                    <motion.div
                        key="verifying"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
                    >
                        <div className="flex justify-center mb-6">
                            <LoadingIcon className="w-16 h-16 text-primary animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-secondary mb-2">Verifying Payment</h2>
                        <p className="text-gray-500">Please wait while we confirm your payment with Yoco...</p>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100"
                    >
                        <div className="flex justify-center mb-6">
                            <CheckCircleIcon className="w-16 h-16 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-secondary mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 mb-6">Your transaction was processed successfully. Redirecting you to your updated dashboard...</p>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2 }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-3xl shadow-xl border border-red-100"
                    >
                        <div className="flex justify-center mb-6">
                            <WarningIcon className="w-16 h-16 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-secondary mb-2">Oh no!</h2>
                        <p className="text-red-500 font-medium mb-4">{error}</p>
                        <p className="text-sm text-gray-500 mb-6">
                            If you have already paid, don't worry. Your session ID is safe. Please try refreshing or contact our support team.
                        </p>
                        <button
                            onClick={onBack}
                            className="w-full py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-lg"
                        >
                            Back to Dashboard
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PaymentSuccessPage;
