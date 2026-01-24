import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useUIContext } from '../contexts/UIContext';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2, Building2 } from 'lucide-react';
import logo from '../assets/hr-copilot-logo.png';
import { Button } from './ui/button';

const ConsultantSignUp: React.FC = () => {
    const { handleSignUp, setAuthPage } = useAuthContext();
    const { setToastMessage } = useUIContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [loading, setLoading] = useState(false);

    const onSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !name || !agencyName) {
            setToastMessage("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            // We pass 'consultant' as the plan and include agencyName in metadata
            const success = await handleSignUp(email, password, {
                name,
                agencyName,
                plan: 'consultant',
                isConsultant: true
            });
            if (success) {
                // Success view handled by AuthContext (email-sent)
            }
        } catch (error: any) {
            setToastMessage(`Onboarding failed: ${error.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Side: Brand & Value Prop */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-950 p-16 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-primary/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <img src={logo} alt="HR CoPilot" className="h-12 brightness-0 invert mb-12" />

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-8">
                            Empowering the next generation of <br />
                            <span className="text-primary text-6xl">HR Leaders.</span>
                        </h2>

                        <div className="space-y-6">
                            {[
                                "Institutional-grade document automation",
                                "Zero-config multi-client management",
                                "100% white-labeled agency portals",
                                "BCEA, LRA & POPIA native compliance"
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="flex items-center space-x-4"
                                >
                                    <div className="bg-primary/20 p-1 rounded-full border border-primary/30">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-slate-300 font-bold text-lg">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem]">
                    <p className="text-slate-400 italic font-medium text-lg leading-relaxed">
                        "HR CoPilot transformed my solo practice into a tech-enabled agency. I produced more in one month than I did in the entire previous quarter."
                    </p>
                    <div className="mt-6 flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800" />
                        <div>
                            <p className="font-bold text-white">Sarah Mvuyana</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Independent Consultant</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="flex-grow flex items-center justify-center p-8 lg:p-16 relative">
                <div className="absolute inset-0 bg-primary/5 lg:hidden" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg bg-slate-800/50 backdrop-blur-2xl p-10 lg:p-12 rounded-[3rem] border border-slate-700/50 shadow-2xl relative z-10"
                >
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-6">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Partner Onboarding</span>
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2">Apply for Access</h1>
                        <p className="text-slate-400 font-medium">Join the Institutional Partner Programme</p>
                    </div>

                    <form onSubmit={onSignUp} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text" value={name} onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. John Doe" required
                                className="w-full h-14 bg-slate-900 border border-slate-700 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@your-agency.co.za" required
                                className="w-full h-14 bg-slate-900 border border-slate-700 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Agency / Practice Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                <input
                                    type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)}
                                    placeholder="e.g. Elite HR Solutions" required
                                    className="w-full h-14 bg-slate-900 border border-slate-700 rounded-2xl pl-14 pr-6 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Platform Password</label>
                            <input
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" required
                                className="w-full h-14 bg-slate-900 border border-slate-700 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex items-start space-x-3 ml-1 mb-2">
                            <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary" />
                            <p className="text-[10px] text-slate-500 font-medium leading-tight">
                                I consent to HR CoPilot processing my personal and agency data in accordance with the
                                <button type="button" className="text-primary hover:underline ml-1">Privacy Policy</button> (POPIA Compliant).
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            variant="hero"
                            size="xl"
                            className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 mt-4"
                        >
                            {loading ? "Processing..." : "Submit Application"}
                            {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                        </Button>
                    </form>

                    <p className="text-center text-slate-500 text-sm mt-8">
                        Already have access?{' '}
                        <button onClick={() => setAuthPage('login')} className="text-primary font-bold hover:underline">Sign In Here</button>
                    </p>
                </motion.div>

                {/* Visual Accent */}
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            </div>
        </div>
    );
};

export default ConsultantSignUp;
