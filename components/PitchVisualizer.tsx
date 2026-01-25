
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
    Plus,
    Minus,
    Briefcase,
    AlertTriangle,
    ChevronRight,
    TrendingUp,
    Users
} from 'lucide-react';
import { useUIContext } from '../contexts/UIContext';

const PitchVisualizer: React.FC = () => {
    const { navigateTo } = useUIContext();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalSlides = 3;

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
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const slides = [
        // Slide 1: The Hook (Problem vs Solution)
        {
            title: "The HR Crisis",
            subtitle: "Manual Chaos vs. Intelligent Standards",
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
                            <h3 className="text-2xl font-bold text-white">Current Reality</h3>
                        </div>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>Outdated templates found on Google, posing major compliance risks.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>Manual drafting takes 40+ hours per client engagement.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <span>Zero consistency across staff contracts and internal policies.</span>
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
                            <h3 className="text-2xl font-bold text-white">HR CoPilot Standard</h3>
                        </div>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <Zap className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Instant AI generation with CCMA-compliant logic.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Zap className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Reduction in turnaround time from days to seconds.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Zap className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-white">Centralized dashboard for all legal assets.</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            )
        },
        // Slide 2: The Moat (ROI Projection)
        {
            title: "Technological Moat",
            subtitle: "The Math Behind $10M ARR",
            content: (
                <div className="space-y-12 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Users, label: "Market Size", value: "2.4M+", sub: "SMEs in SA" },
                            { icon: TrendingUp, label: "Velocity", value: "10x", sub: "Faster Generation" },
                            { icon: ShieldCheck, label: "Risk Mitigation", value: "100%", sub: "Legal Coverage" }
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
                        className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
                        <div className="relative z-10">
                            <span className="px-4 py-1 bg-primary/20 text-primary text-xs font-black rounded-full uppercase tracking-tighter mb-4 inline-block">Projections Phase 3</span>
                            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                                Target <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">$10M ARR</span>
                            </h3>
                            <p className="text-gray-400 max-w-xl mx-auto text-lg">
                                By digitizing the highly fragmented South African HR legal market, we build a platform that scales without headcount.
                            </p>

                            <div className="mt-8 flex items-baseline gap-2">
                                <div className="h-12 w-3 bg-primary rounded-t-full" />
                                <div className="h-20 w-3 bg-primary/80 rounded-t-full" />
                                <div className="h-32 w-3 bg-primary/60 rounded-t-full" />
                                <div className="h-44 w-3 bg-indigo-500 rounded-t-full" />
                                <div className="h-60 w-3 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-full animate-pulse" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )
        },
        // Slide 3: The Opportunity (3-Step Path)
        {
            title: "The Path Ahead",
            subtitle: "Strategic Execution Roadmap",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
                    {[
                        { step: "01", title: "Market Sweep", desc: "Aggressive acquisition of the 200k+ high-growth tech and retail SMEs.", color: "from-blue-500 to-cyan-400" },
                        { step: "02", title: "API Ecosystem", desc: "Integrate with Xero, Sage, and PaySpace to become the HR backbone.", color: "from-indigo-500 to-purple-500" },
                        { step: "03", title: "HR Dominance", desc: "Expand to global emerging markets with a 'Legal-as-a-Service' engine.", color: "from-emerald-500 to-teal-400" }
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

    return (
        <div
            ref={containerRef}
            className={`min-h-screen bg-[#020203] text-white selection:bg-primary selection:text-white transition-all duration-500 relative flex flex-col ${isFullscreen ? 'p-0' : 'p-4 md:p-8'}`}
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Mesh Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
            </div>

            {/* Header */}
            {!isFullscreen && (
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative z-20 flex justify-between items-center mb-12"
                >
                    <div className="flex items-center gap-3">
                        <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="Logo" className="h-10" />
                        <div className="h-6 w-px bg-white/10" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Investor Deck 2026</span>
                    </div>
                    <div className="flex items-center gap-4">
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

            {/* Main Content */}
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
                                Strategy Slide 0{currentSlide + 1}
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

            {/* Navigation Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-6 md:p-12 z-50 pointer-events-none">
                <div className="max-w-6xl mx-auto flex justify-between items-center pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-2"
                    >
                        {Array.from({ length: totalSlides }).map((_, i) => (
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

                        {currentSlide < totalSlides - 1 ? (
                            <button
                                onClick={nextSlide}
                                className="p-4 px-8 rounded-3xl bg-primary hover:bg-primary-hover border border-primary/20 transition-all flex items-center gap-2 font-black shadow-lg shadow-primary/20 text-white group"
                            >
                                <span>Next Insight</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigateTo('dashboard')}
                                className="p-4 px-8 rounded-3xl bg-white text-[#020203] hover:bg-gray-200 transition-all flex items-center gap-2 font-black shadow-lg shadow-white/10 group"
                            >
                                <Rocket className="w-5 h-5" />
                                <span>Launch Dashboard</span>
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
                
                /* Hide header when in fullscreen if we want truly immersive */
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
