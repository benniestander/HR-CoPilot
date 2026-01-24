import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";

const ConsultantHero = () => {
    const { setAuthPage } = useAuthContext();

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-900 pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <div className="container mx-auto px-6 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6"
                        >
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80">Institutional Partner Programme</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-6">
                            Scalable HR. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
                                Zero legal bloat.
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-8 sm:mb-10 max-w-xl font-medium">
                            The purpose-built operating system for South African HR Consultants. Scale from 5 to 50+ clients with automated compliance, branded client workspaces, and institutional-grade legal documents.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                variant="hero"
                                size="xl"
                                className="w-full sm:w-auto h-16 px-10 rounded-2xl shadow-2xl shadow-primary/20"
                                onClick={() => setAuthPage('signup')}
                            >
                                Apply for Access <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                variant="heroOutline"
                                size="xl"
                                className="w-full sm:w-auto h-16 px-10 rounded-2xl border-slate-700 text-white hover:bg-slate-800"
                            >
                                View Demo
                            </Button>
                        </div>

                        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-800">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-slate-800 rounded-lg">
                                    <Zap className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-slate-300">60s Generation</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-slate-800 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                </div>
                                <span className="text-sm font-bold text-slate-300">Uncapped Margin</span>
                            </div>
                            <div className="flex items-center space-x-3 hidden sm:flex">
                                <div className="p-2 bg-slate-800 rounded-lg">
                                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                                </div>
                                <span className="text-sm font-bold text-slate-300">Legally Vetted</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative lg:block"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        {/* Abstract Portal Visual */}
                        <div className="relative z-10 bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-2 rounded-[2.5rem] shadow-2xl overflow-hidden group">
                            <div className="bg-slate-900 rounded-[2rem] overflow-hidden aspect-[4/3] flex flex-col">
                                {/* Chrome-like header */}
                                <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="bg-slate-900/50 px-4 py-1 rounded text-[10px] text-slate-500 font-mono">
                                        portal.your-agency.co.za
                                    </div>
                                    <div className="w-4 h-4" />
                                </div>
                                {/* Dashboard Mockup */}
                                <div className="p-8 flex-grow">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-slate-800 rounded-full" />
                                            <div className="h-2 w-20 bg-slate-800/50 rounded-full" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-24 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4">
                                            <div className="h-2 w-12 bg-slate-700 rounded-full mb-3" />
                                            <div className="h-6 w-16 bg-slate-600 rounded-full" />
                                        </div>
                                        <div className="h-24 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4">
                                            <div className="h-2 w-12 bg-slate-700 rounded-full mb-3" />
                                            <div className="h-6 w-16 bg-slate-600 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-col space-y-3">
                                        <div className="h-10 bg-slate-800/20 border border-slate-700/30 rounded-xl flex items-center px-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3" />
                                            <div className="h-2 w-48 bg-slate-700/50 rounded-full" />
                                        </div>
                                        <div className="h-10 bg-slate-800/20 border border-slate-700/30 rounded-xl flex items-center px-4">
                                            <div className="w-2 h-2 rounded-full bg-primary mr-3" />
                                            <div className="h-2 w-[80%] bg-slate-700/50 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 z-20 bg-emerald-500 text-white p-4 rounded-2xl shadow-xl font-bold text-sm flex items-center"
                        >
                            <Zap className="w-4 h-4 mr-2" /> 100% Margin
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-4 -left-8 z-20 bg-indigo-600 text-white p-4 rounded-2xl shadow-xl font-bold text-sm flex items-center border border-indigo-400"
                        >
                            <ShieldCheck className="w-4 h-4 mr-2" /> White-Label Ready
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ConsultantHero;
