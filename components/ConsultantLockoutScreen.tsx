import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CreditCard, AlertTriangle, LogOut, Lock } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { Button } from './ui/button';

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
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-red-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-slate-800/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] max-w-xl w-full p-10 md:p-14 text-center relative z-10 border border-slate-100"
            >
                <div className="relative mb-10">
                    <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto relative z-10">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-red-500 rounded-full blur-2xl -z-0"
                    />
                </div>

                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full mb-6">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Platform Access Denied</span>
                </div>

                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-[1.1]">
                    COMMAND CENTRE <br />
                    <span className="text-red-600">LOCKED.</span>
                </h1>

                <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed">
                    Account access restricted due to an overdue Platform Fee. To restore your agency's portal, client data, and history, please renew your subscription.
                </p>

                <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100 text-left">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="text-sm font-bold text-slate-600">Annual Platform Fee</span>
                        </div>
                        <span className="text-xl font-black text-slate-900">R500.00</span>
                    </div>

                    <div className="h-px bg-slate-200 mb-6" />

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Agency Balance</p>
                            <span className="text-lg font-black text-slate-900">R{((user?.creditBalance || 0) / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <CreditCard className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Yoco Protected</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100"
                    >
                        {error}
                        {(user?.creditBalance || 0) < 50000 && (
                            <p className="mt-2 text-[10px] opacity-80">Please top-up your balance to continue.</p>
                        )}
                    </motion.div>
                )}

                <div className="flex flex-col gap-4">
                    <Button
                        onClick={handlePay}
                        disabled={isPaying}
                        size="xl"
                        className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black hover:bg-black shadow-2xl shadow-slate-200"
                    >
                        {isPaying ? "Unlocking Command Centre..." : (
                            <>
                                <CreditCard className="w-5 h-5 mr-3" />
                                RENEW ACCESS (R500.00)
                            </>
                        )}
                    </Button>

                    <button
                        onClick={() => handleLogout()}
                        className="inline-flex items-center justify-center space-x-2 w-full py-4 text-slate-400 font-bold hover:text-red-500 transition-colors duration-300"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-widest">Exit Secure Portal</span>
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-50">
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">
                        HR CoPilot Institutional v2.4.0
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ConsultantLockoutScreen;
