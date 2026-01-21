
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataContext } from '../contexts/DataContext';
import { CheckIcon, StarIcon, ShieldCheckIcon, UserIcon, MasterPolicyIcon, ComplianceIcon, BookIcon } from './Icons';

interface WaitlistLandingProps {
    onSignup: (name: string, email: string) => Promise<void>;
    onShowLogin: () => void;
}

const WaitlistLanding: React.FC<WaitlistLandingProps> = ({ onSignup, onShowLogin }) => {
    const { logMarketingEvent } = useDataContext();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        logMarketingEvent('waitlist_page_view', { source: 'organic' });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            setError("Please fill in both fields.");
            return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
            await onSignup(formData.name, formData.email);
            setIsSuccess(true);
            logMarketingEvent('waitlist_lead_captured', { email: formData.email });
        } catch (err: any) {
            setError(err.message || "Failed to join. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const statItems = [
        { label: "Compliance Risk", value: "98%", sub: "Reduction", icon: ShieldCheckIcon },
        { label: "Document Speed", value: "60s", sub: "Generation", icon: MasterPolicyIcon },
        { label: "Legal Fees", value: "R0", sub: "Zero Hourly Rate", icon: ComplianceIcon },
    ];

    return (
        <div className="min-h-screen bg-[#f9fafb] text-[#143a67] selection:bg-primary/20 relative overflow-hidden flex flex-col">
            {/* Soft Brand Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]"></div>

            {/* Header */}
            <header className="relative z-50 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-2"
                >
                    <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="HR CoPilot" className="h-12" />
                </motion.div>
                <div className="flex items-center space-x-8">
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onShowLogin}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60 hover:text-secondary transition-colors"
                    >
                        Partner Login
                    </motion.button>
                </div>
            </header>

            {/* Main Hero Section */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 py-12 md:py-20 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Copy */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="inline-flex items-center px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-8 shadow-sm">
                                <span className="mr-2">🇿🇦</span> South Africa's Smartest Compliance AI
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-10 text-secondary">
                                The End of <br />
                                <span className="inline-block relative">
                                    <span className="relative z-10 text-primary">Legal Anxiety.</span>
                                    <motion.span
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ delay: 0.8, duration: 1 }}
                                        className="absolute bottom-4 left-0 h-4 bg-accent/20 -z-1"
                                    ></motion.span>
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-secondary/70 leading-relaxed max-w-xl font-medium">
                                No more expensive consultants or outdated templates. <br />
                                <span className="text-secondary">Generate BCEA & LRA compliant documents in seconds.</span>
                            </p>
                        </motion.div>

                        {/* Interactive Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-4"
                        >
                            {statItems.map((stat, i) => (
                                <div key={i} className="bg-white/60 p-5 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-secondary">{stat.value}</div>
                                        <div className="text-[10px] uppercase tracking-wider text-secondary/40 font-bold">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: The Gloss Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="relative w-full max-w-md">
                            {/* Visual Glow behind form */}
                            <div className="absolute inset-0 bg-primary/10 blur-[80px] -z-10 transform translate-x-8 translate-y-8"></div>

                            <div className="bg-white/80 backdrop-blur-[30px] border border-white p-10 md:p-14 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(20,58,103,0.1)]">
                                <AnimatePresence mode="wait">
                                    {!isSuccess ? (
                                        <motion.div
                                            key="form"
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <h3 className="text-3xl font-black mb-2 tracking-tighter text-secondary">Join The Waitlist</h3>
                                            <p className="text-sm text-secondary/50 mb-10 font-medium">Securing early access for SA startups.</p>

                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 ml-4">Business Owner Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="John Smit"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-light border border-secondary/5 rounded-[1.8rem] px-8 py-5 text-secondary placeholder:text-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 ml-4">Work Email</label>
                                                    <input
                                                        type="email"
                                                        placeholder="john@company.co.za"
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full bg-light border border-secondary/5 rounded-[1.8rem] px-8 py-5 text-secondary placeholder:text-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                                    />
                                                </div>

                                                {error && <p className="text-red-500 text-xs text-center font-bold tracking-tight">{error}</p>}

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full bg-primary text-white font-black text-sm uppercase tracking-[0.2em] py-6 rounded-[1.8rem] shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 h-18 flex items-center justify-center group"
                                                >
                                                    {isSubmitting ? (
                                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    ) : (
                                                        <span className="flex items-center">
                                                            Join Priority List
                                                            <StarIcon className="w-4 h-4 ml-3 group-hover:rotate-12 transition-transform" />
                                                        </span>
                                                    )}
                                                </button>

                                                <p className="text-center text-[9px] text-secondary/20 font-black uppercase tracking-[0.3em] mt-8 flex items-center justify-center">
                                                    <ShieldCheckIcon className="w-3 h-3 mr-2 text-primary" /> POPIA COMPLIANT & SECURE
                                                </p>
                                            </form>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className="text-center py-10"
                                        >
                                            <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                                <CheckIcon className="w-10 h-10 text-primary" />
                                            </div>
                                            <h3 className="text-4xl font-black mb-4 tracking-tighter text-secondary">You're on the list!</h3>
                                            <p className="text-secondary/60 font-medium leading-relaxed">
                                                Welcome, <strong>{formData.name.split(' ')[0]}</strong>. <br />
                                                We've reserved your spot. Watch your inbox for our special launch roadmap.
                                            </p>
                                            <button
                                                onClick={() => setIsSuccess(false)}
                                                className="mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 hover:text-secondary transition-colors"
                                            >
                                                Add Another Entry
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Localized Footer */}
            <footer className="relative z-10 p-10 border-t border-secondary/5 bg-white/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-40">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">BCEA Compliant</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">LRA Ready</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">POPIA Registered</div>
                    </div>
                    <div className="text-[10px] text-secondary/30 font-bold uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} HR CoPilot. Proudly South African 🇿🇦
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WaitlistLanding;
