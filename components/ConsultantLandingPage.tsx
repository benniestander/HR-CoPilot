import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    Users,
    Zap,
    Globe,
    Briefcase,
    CheckCircle2,
    ArrowRight,
    Palette,
    LayoutDashboard
} from "lucide-react";
import Navbar from "./landing_new/Navbar";
import Footer from "./landing_new/Footer";

const ConsultantLandingPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-slate-50 overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full border border-indigo-100">
                                Institutional Grade Platform
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
                                Empower Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Practice</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
                                The all-in-one operating system for HR Consultants in South Africa. Manage clients, generate pre-vetted legal documents, and brand everything as your own.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="hero" className="w-full sm:w-auto px-8 h-14 text-lg font-bold shadow-xl shadow-indigo-200">
                                    Apply for Access <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="hero" className="w-full sm:w-auto px-8 h-14 text-lg font-bold border-2">
                                    Watch Demo
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Built for Professionals</h2>
                        <p className="text-slate-500 font-medium">Everything you need to scale your consultancy from 5 clients to 500.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Palette className="w-8 h-8 text-indigo-600" />,
                                title: "White-Label Branding",
                                desc: "Your logo. Your colors. Your brand. Clients interact with your portal, not ours."
                            },
                            {
                                icon: <LayoutDashboard className="w-8 h-8 text-blue-600" />,
                                title: "Multi-Client Dashboard",
                                desc: "Switch between client contexts with a single click. No more document confusion."
                            },
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
                                title: "Institutional Grade Docs",
                                desc: "Pre-vetted templates designed to survive any CCMA dispute or legal audit."
                            },
                            {
                                icon: <Zap className="w-8 h-8 text-amber-600" />,
                                title: "Rapid Generation",
                                desc: "Produce complex employment contracts and policies in under 60 seconds."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-purple-600" />,
                                title: "Client Self-Service",
                                desc: "Give clients direct access to their historical documents while you manage the compliance."
                            },
                            {
                                icon: <Globe className="w-8 h-8 text-rose-600" />,
                                title: "SA Law Focused",
                                desc: "Native compliance with BCEA, LRA, POPIA, and Employment Equity Act."
                            }
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-indigo-50 transition-all group"
                            >
                                <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing / Revenue Section */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto space-y-16">
                        <div className="text-center">
                            <h2 className="text-3xl md:text-5xl font-black mb-6">Scale with Confidence</h2>
                            <p className="text-slate-400 text-lg font-medium">Our consultant pricing model is designed to grow with your client list.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-10 rounded-[2.5rem] bg-white text-slate-900 shadow-2xl">
                                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mb-6 inline-block">The Platform</span>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-5xl font-black">R500</span>
                                    <span className="text-slate-400 font-bold">/mo</span>
                                </div>
                                <p className="text-slate-600 font-medium mb-8">Access to the full consultant portal, white-label settings, and document auditing tools.</p>
                                <ul className="space-y-4 mb-10">
                                    {["Unlimited Staffing Docs", "Custom Branding", "Legal Support Desk", "Dedicated Success Manager"].map(li => (
                                        <li key={li} className="flex items-center text-sm font-bold text-slate-700">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3" /> {li}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full h-14 text-lg font-bold rounded-2xl bg-slate-900">Start Platform Access</Button>
                            </div>

                            <div className="p-10 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden border border-indigo-400/30">
                                <div className="absolute top-0 right-0 p-6 opacity-20 transform rotate-12 scale-150">
                                    <Briefcase className="w-24 h-24" />
                                </div>
                                <span className="text-xs font-black text-white uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-6 inline-block">The Client Fee</span>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-5xl font-black">R750</span>
                                    <span className="text-white/60 font-bold">/yr</span>
                                </div>
                                <p className="text-white/80 font-medium mb-8">Annual per-client access fee. Unlock full 365-day document history for any single entity.</p>
                                <div className="p-6 bg-white/10 rounded-2xl border border-white/20 mb-8">
                                    <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60 italic">Profit Simulation</p>
                                    <p className="text-sm font-bold">Pass this fee to your client and maintain 100% margin on your drafting and consulting hours.</p>
                                </div>
                                <Button className="w-full h-14 text-lg font-bold rounded-2xl bg-white text-indigo-600 hover:bg-slate-50 transition-colors">Register Client</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial / Trust */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <div className="mb-12">
                        {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-amber-400 text-2xl">★</span>)}
                    </div>
                    <blockquote className="text-2xl md:text-3xl font-bold text-slate-900 italic mb-8">
                        "HR CoPilot transformed my solo practice into a tech-enabled agency. I produced more in one month than I did in the entire previous quarter, with zero legal anxiety."
                    </blockquote>
                    <div>
                        <p className="font-black text-slate-900">Sarah Mvuyana</p>
                        <p className="text-slate-500 font-medium uppercase text-sm tracking-widest mt-1">Independent HR Consultant, Cape Town</p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ConsultantLandingPage;
