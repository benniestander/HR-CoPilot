
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlertIcon, CreditCardIcon, AlertIcon } from './Icons';
import { useAuthContext } from '../contexts/AuthContext';

const ConsultantLockoutScreen: React.FC = () => {
    const { user, payConsultantPlatformFee, handleLogout } = useAuthContext();
    const [isPaying, setIsPaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePay = async () => {
        setIsPaying(true);
        setError(null);
        try {
            await payConsultantPlatformFee();
        } catch (err: any) {
            setError(err.message || "Payment failed. Please top up your balance.");
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-6 overflow-y-auto">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent_70%)]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] shadow-2xl max-w-xl w-full p-8 md:p-12 text-center relative z-10 border border-white/20"
            >
                <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <ShieldAlertIcon className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                    ACCOUNT LOCKED
                </h1>

                <p className="text-lg text-slate-600 font-bold mb-8">
                    Your Consultant Platform Fee is overdue. Access to all client data, documents, and history has been restricted.
                </p>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 text-left">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertIcon className="w-5 h-5 text-red-600" />
                        <span className="font-black text-red-600 uppercase tracking-widest text-xs">Payment Required</span>
                    </div>
                    <p className="text-sm font-bold text-red-900 mb-4">
                        "Pay your fee or lose your work." Consistent access requires a R500.00 monthly platform fee.
                    </p>
                    <div className="flex justify-between items-center py-3 border-t border-red-200">
                        <span className="text-sm font-bold text-red-700">Monthly Platform Fee</span>
                        <span className="text-xl font-black text-red-900">R500.00</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t border-red-200">
                        <span className="text-sm font-bold text-red-700">Current Balance</span>
                        <span className="text-sm font-bold text-slate-900">R{((user?.creditBalance || 0) / 100).toFixed(2)}</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-bold">
                        {error}
                        {(user?.creditBalance || 0) < 50000 && (
                            <p className="mt-2 text-xs">Please contact support or use the top-up link to add credits.</p>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handlePay}
                        disabled={isPaying}
                        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isPaying ? "Processing..." : (
                            <>
                                <CreditCardIcon className="w-5 h-5" />
                                UNLOCK ACCOUNT (R500)
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => handleLogout()}
                        className="w-full py-4 text-slate-400 font-black hover:text-slate-600 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    HR COPILOT FOR CONSULTANTS v2.0
                </p>
            </motion.div>
        </div>
    );
};

export default ConsultantLockoutScreen;
