
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    ShieldCheck,
    Zap,
    Target,
    Rocket,
    Maximize2,
    Minimize2,
    ArrowRight,
    ArrowLeft,
    X,
    Briefcase,
    AlertTriangle,
    TrendingUp,
    Users,
    DollarSign,
    Clock,
    Award,
    Building2,
    Sparkles,
    LineChart,
    CheckCircle2,
    Globe
} from 'lucide-react';
import { useUIContext } from '../contexts/UIContext';

type PresentationMode = 'investors' | 'businesses' | 'consultants';

interface SlideContent {
    title: string;
    subtitle: string;
    content: React.ReactNode;
}

const PitchVisualizer: React.FC = () => {
    const { navigateTo } = useUIContext();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [presentationMode, setPresentationMode] = useState<PresentationMode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const nextSlide = () => {
        if (currentSlide < 2) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const resetPresentation = () => {
        setPresentationMode(null);
        setCurrentSlide(0);
    };

    // INVESTORS/BUYERS PRESENTATION
    const investorSlides: SlideContent[] = [
        {
            title: "The Opportunity",
            subtitle: "Untapped $500M South African HR Compliance Market",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-red-500/20 transition-all duration-700" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-red-500/20 rounded-2xl">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Market Pain</h3>
                        </div>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>2.4M SMEs relying on outdated Google templates with major compliance risks.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>HR consultants spending 40+ hours per client on manual document drafting.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>Zero scalable solutions for BCEA/LRA/POPIA compliance automation.</span>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-emerald-500/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl">
                                <Rocket className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">HR CoPilot Solution</h3>
                        </div>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Instant AI-powered generation with CCMA-compliant logic engine.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Multi-tenant B2B2C model: Agencies manage 50+ clients each.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Recurring revenue + transaction fees = 70% gross margins.</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            )
        },
        {
            title: "The Numbers",
            subtitle: "Path to R32M Valuation in 12 Months",
            content: (
                <div className="space-y-12 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: DollarSign, label: "Target ARR", value: "R3.2M", sub: "Month 12" },
                            { icon: TrendingUp, label: "Valuation Multiple", value: "7-10x", sub: "Strategic Exit" },
                            { icon: Award, label: "Exit Valuation", value: "R22-32M", sub: "Payroll/Insurance Acquirer" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center"
                            >
                                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                <div className="text-xs text-primary/60 mt-2 font-medium">{stat.sub}</div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
                        <div className="relative z-10 text-center">
                            <span className="px-4 py-1 bg-primary/20 text-primary text-xs font-black rounded-full uppercase tracking-tighter mb-4 inline-block">Revenue Breakdown</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div>
                                    <div className="text-4xl font-black text-white mb-2">R1.5M</div>
                                    <div className="text-sm text-gray-400">SME Subscriptions</div>
                                    <div className="text-xs text-primary/60 mt-1">1,000 @ R1,499/yr</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-white mb-2">R500K</div>
                                    <div className="text-sm text-gray-400">Agency Portal Fees</div>
                                    <div className="text-xs text-primary/60 mt-1">100 @ R5,000/yr</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-white mb-2">R1.2M</div>
                                    <div className="text-sm text-gray-400">Transaction Fees</div>
                                    <div className="text-xs text-primary/60 mt-1">2,000 managed clients</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )
        },
        {
            title: "The Moat",
            subtitle: "Why We Win: Network Effects + Legal IP",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
                    {[
                        { step: "01", title: "Legal Barrier", desc: "50+ vetted policies updated quarterly. Competitors need 6+ months + R500k to replicate.", color: "from-blue-500 to-cyan-400" },
                        { step: "02", title: "Network Lock-In", desc: "Each agency brings 20+ clients. By Month 6, we become the infrastructure 100+ consultants depend on.", color: "from-indigo-500 to-purple-500" },
                        { step: "03", title: "Data Flywheel", desc: "Every document generated improves AI accuracy. 10,000+ documents = unbeatable compliance engine.", color: "from-emerald-500 to-teal-400" }
                    ].map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 transition-all duration-500"
                        >
                            <div className="bg-[#0a0a0b] p-8 rounded-[2.4rem] h-full flex flex-col">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center font-black text-white text-xl mb-6 shadow-lg shadow-indigo-500/20`}>
                                    {step.step}
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-3">{step.title}</h4>
                                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )
        }
    ];

    // BUSINESSES PRESENTATION
    const businessSlides: SlideContent[] = [
        {
            title: "Your HR Compliance Problem",
            subtitle: "Stop Risking CCMA Disputes with Outdated Templates",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-red-500/20 transition-all duration-700" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-red-500/20 rounded-2xl">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">What You're Doing Now</h3>
                        </div>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>Downloading free templates from Google that are 5+ years out of date.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>Paying R15,000+ for a consultant to draft basic employment contracts.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>Hoping your policies are BCEA/LRA compliant (they probably aren't).</span>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-emerald-500/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">The HR CoPilot Way</h3>
                        </div>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Generate any policy in 60 seconds with 2026-compliant AI.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Pay R1,499/year for unlimited documents (vs R15k per consultant visit).</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Sleep easy knowing every document is CCMA-ready.</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            )
        },
        {
            title: "What You Get",
            subtitle: "Your Complete HR Compliance Toolkit for R1,499/Year",
            content: (
                <div className="space-y-8 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: Building2, title: "50+ Policy Templates", desc: "From Code of Conduct to POPIA compliance, all vetted by SA labour law experts." },
                            { icon: Briefcase, title: "60+ Employment Forms", desc: "Contracts, warnings, leave applications - everything you need to run HR properly." },
                            { icon: Zap, title: "Instant Generation", desc: "Fill in your company details once, generate any document in under 60 seconds." },
                            { icon: Clock, title: "Free Updates for 7 Days", desc: "Made a mistake? Regenerate and refine any document within a week at no extra cost." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all group"
                            >
                                <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-primary/10 to-indigo-500/10 backdrop-blur-3xl border border-primary/20 rounded-3xl p-10 text-center"
                    >
                        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-3xl font-black text-white mb-3">Special Launch Pricing</h3>
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400 mb-2">R1,499</div>
                        <p className="text-gray-400 mb-6">Per year. Unlimited documents. Cancel anytime.</p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-sm text-gray-300">
                            <Clock className="w-4 h-4" />
                            <span>That's R125/month - less than one consultant phone call</span>
                        </div>
                    </motion.div>
                </div>
            )
        },
        {
            title: "How It Works",
            subtitle: "From Signup to Compliant Documents in 3 Simple Steps",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
                    {[
                        { step: "01", title: "Sign Up in 2 Minutes", desc: "Create your account, enter your company details once, and you're ready to go.", color: "from-blue-500 to-cyan-400", icon: Users },
                        { step: "02", title: "Choose Your Document", desc: "Browse 50+ policies and 60+ forms. Click the one you need - employment contract, leave policy, anything.", color: "from-indigo-500 to-purple-500", icon: Briefcase },
                        { step: "03", title: "Download & Use", desc: "AI generates your custom, compliant document in 60 seconds. Download as Word or PDF. Done.", color: "from-emerald-500 to-teal-400", icon: CheckCircle2 }
                    ].map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 transition-all duration-500"
                        >
                            <div className="bg-[#0a0a0b] p-8 rounded-[2.4rem] h-full flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center font-black text-white text-2xl mb-6 shadow-lg shadow-indigo-500/20`}>
                                    {step.step}
                                </div>
                                <step.icon className="w-12 h-12 text-white/60 mb-4" />
                                <h4 className="text-2xl font-bold text-white mb-3">{step.title}</h4>
                                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )
        }
    ];

    // CONSULTANTS PRESENTATION
    const consultantSlides: SlideContent[] = [
        {
            title: "Scale Your Practice",
            subtitle: "Manage 50+ Clients Without Hiring More Staff",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-red-500/20 transition-all duration-700" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-red-500/20 rounded-2xl">
                                <Clock className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Your Current Bottleneck</h3>
                        </div>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>Spending 40+ hours per client drafting the same policies from scratch.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>Can't scale beyond 10-15 clients because document creation is manual.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>Leaving money on the table - turning away new clients due to capacity limits.</span>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-emerald-500/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl">
                                <Rocket className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">The Agency Portal</h3>
                        </div>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Generate client documents in 60 seconds with your branding.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Manage 50+ clients from one dashboard - no capacity ceiling.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Earn recurring revenue: R500/client/year in transaction fees.</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            )
        },
        {
            title: "Your New Revenue Model",
            subtitle: "Turn Document Generation Into Recurring Income",
            content: (
                <div className="space-y-12 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Users, label: "Client Capacity", value: "50+", sub: "Managed Clients" },
                            { icon: DollarSign, label: "Transaction Fees", value: "R500", sub: "Per Client/Year" },
                            { icon: LineChart, label: "Your ARR", value: "R25,000", sub: "From 50 Clients" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center"
                            >
                                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                <div className="text-xs text-primary/60 mt-2 font-medium">{stat.sub}</div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-3xl border border-white/10 rounded-3xl p-10"
                    >
                        <div className="text-center mb-8">
                            <span className="px-4 py-1 bg-primary/20 text-primary text-xs font-black rounded-full uppercase tracking-tighter mb-4 inline-block">Example: 50-Client Practice</span>
                            <h3 className="text-4xl font-black text-white mb-4">Your Annual Breakdown</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/5 rounded-2xl p-6">
                                <div className="text-sm text-gray-400 mb-2">Agency Portal Fee</div>
                                <div className="text-3xl font-black text-white mb-1">R5,000</div>
                                <div className="text-xs text-gray-500">One-time annual fee</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6">
                                <div className="text-sm text-gray-400 mb-2">Client Transaction Fees</div>
                                <div className="text-3xl font-black text-emerald-400 mb-1">R25,000</div>
                                <div className="text-xs text-gray-500">50 clients × R500/year</div>
                            </div>
                        </div>
                        <div className="mt-6 p-6 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-2xl border border-primary/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-300 mb-1">Total Platform Revenue</div>
                                    <div className="text-5xl font-black text-white">R30,000</div>
                                </div>
                                <Award className="w-16 h-16 text-primary/40" />
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Plus your existing consulting fees - this is pure margin expansion</p>
                        </div>
                    </motion.div>
                </div>
            )
        },
        {
            title: "White-Label Your Practice",
            subtitle: "Your Brand, Your Clients, Our Infrastructure",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
                    {[
                        { step: "01", title: "Custom Branding", desc: "Upload your logo, set your colors. Every document your clients see carries YOUR brand, not ours.", color: "from-blue-500 to-cyan-400", icon: Sparkles },
                        { step: "02", title: "Client Dashboard", desc: "Give each client their own login. They see your branding, you control access, we handle the tech.", color: "from-indigo-500 to-purple-500", icon: Users },
                        { step: "03", title: "Automated Billing", desc: "We handle payments, compliance, updates. You focus on advisory work and growing your practice.", color: "from-emerald-500 to-teal-400", icon: DollarSign }
                    ].map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 transition-all duration-500"
                        >
                            <div className="bg-[#0a0a0b] p-8 rounded-[2.4rem] h-full flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20`}>
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-sm font-black text-primary mb-3">{step.step}</div>
                                <h4 className="text-2xl font-bold text-white mb-3">{step.title}</h4>
                                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )
        }
    ];

    const getCurrentSlides = (): SlideContent[] => {
        switch (presentationMode) {
            case 'investors':
                return investorSlides;
            case 'businesses':
                return businessSlides;
            case 'consultants':
                return consultantSlides;
            default:
                return [];
        }
    };

    const slides = getCurrentSlides();

    // MODE SELECTION SCREEN
    if (!presentationMode) {
        return (
            <div className="min-h-screen bg-[#020203] text-white flex items-center justify-center p-4 md:p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-6xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="Logo" className="h-12 mx-auto mb-6" />
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Choose Your Audience</h1>
                        <p className="text-xl text-gray-400">Select the presentation tailored to your stakeholders</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                mode: 'investors' as PresentationMode,
                                icon: TrendingUp,
                                title: 'Investors & Buyers',
                                desc: 'Valuation, market opportunity, and exit strategy',
                                color: 'from-blue-500 to-indigo-600'
                            },
                            {
                                mode: 'businesses' as PresentationMode,
                                icon: Building2,
                                title: 'Business Owners',
                                desc: 'Solve HR compliance, save time and money',
                                color: 'from-emerald-500 to-teal-600'
                            },
                            {
                                mode: 'consultants' as PresentationMode,
                                icon: Briefcase,
                                title: 'HR Consultants',
                                desc: 'Scale your practice with white-label tools',
                                color: 'from-purple-500 to-pink-600'
                            }
                        ].map((option, i) => (
                            <motion.button
                                key={option.mode}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setPresentationMode(option.mode)}
                                className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 transition-all duration-500"
                            >
                                <div className="bg-[#0a0a0b] p-8 rounded-[1.4rem] h-full flex flex-col items-center text-center">
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <option.icon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{option.title}</h3>
                                    <p className="text-gray-400 leading-relaxed mb-6">{option.desc}</p>
                                    <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                                        <span>Launch Presentation</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => navigateTo('dashboard')}
                        className="mt-12 mx-auto flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </motion.button>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                    :root {
                        --primary: #188693;
                    }
                    .bg-primary { background-color: var(--primary); }
                    .text-primary { color: var(--primary); }
                ` }} />
            </div>
        );
    }

    // PRESENTATION VIEW
    return (
        <div
            ref={containerRef}
            className={`min-h-screen bg-[#020203] text-white selection:bg-primary selection:text-white transition-all duration-500 relative flex flex-col ${isFullscreen ? 'p-0' : 'p-4 md:p-8'}`}
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
            </div>

            {!isFullscreen && (
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative z-20 flex justify-between items-center mb-12"
                >
                    <div className="flex items-center gap-3">
                        <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="Logo" className="h-10" />
                        <div className="h-6 w-px bg-white/10" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                            {presentationMode === 'investors' ? 'Investor Deck' : presentationMode === 'businesses' ? 'Business Pitch' : 'Consultant Pitch'} 2026
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={resetPresentation}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-gray-400 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                        >
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                        </button>
                        <button
                            onClick={() => navigateTo('dashboard')}
                            className="p-3 bg-white/5 hover:bg-red-500/20 hover:border-red-500/20 border border-white/10 rounded-2xl transition-all text-gray-400 hover:text-red-500 group"
                        >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>
                </motion.header>
            )}

            <main className="relative z-10 flex-grow flex flex-col items-center justify-center max-w-6xl mx-auto w-full px-4 overflow-y-auto custom-scrollbar pt-20 pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full"
                    >
                        <div className="text-center mb-16">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-primary font-black uppercase tracking-widest text-xs mb-4 inline-block"
                            >
                                {presentationMode === 'investors' ? 'Investment Opportunity' : presentationMode === 'businesses' ? 'For Your Business' : 'For Consultants'} • Slide 0{currentSlide + 1}
                            </motion.span>
                            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                                {slides[currentSlide].title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-400 font-medium">
                                {slides[currentSlide].subtitle}
                            </p>
                        </div>

                        {slides[currentSlide].content}
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 p-6 md:p-12 z-50 pointer-events-none">
                <div className="max-w-6xl mx-auto flex justify-between items-center pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-2"
                    >
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-primary' : 'w-4 bg-white/10'}`}
                            />
                        ))}
                    </motion.div>

                    <div className="flex gap-4">
                        <button
                            onClick={prevSlide}
                            disabled={currentSlide === 0}
                            className={`p-4 rounded-3xl border transition-all flex items-center gap-2 font-bold ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        {currentSlide < 2 ? (
                            <button
                                onClick={nextSlide}
                                className="p-4 px-8 rounded-3xl bg-primary hover:bg-primary-hover border border-primary/20 transition-all flex items-center gap-2 font-black shadow-lg shadow-primary/20 text-white group"
                            >
                                <span>Next Insight</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={resetPresentation}
                                className="p-4 px-8 rounded-3xl bg-white text-[#020203] hover:bg-gray-200 transition-all flex items-center gap-2 font-black shadow-lg shadow-white/10 group"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Choose Another</span>
                            </button>
                        )}
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px;
                }
                
                :root {
                    --primary: #188693;
                    --primary-hover: #14737d;
                }
                
                .bg-primary { background-color: var(--primary); }
                .text-primary { color: var(--primary); }
                .border-primary { border-color: var(--primary); }
                .bg-primary-hover { background-color: var(--primary-hover); }
                
                :fullscreen header {
                    display: none;
                }
                
                :fullscreen main {
                    padding-top: 0;
                }
            ` }} />
        </div>
    );
};

export default PitchVisualizer;
