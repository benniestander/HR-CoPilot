import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, LayoutDashboard, Palette, Shield, Zap, Globe, BarChart3 } from "lucide-react";

interface Feature {
    icon: any;
    iconColor: string;
    headline: string;
    body: string;
    benefits: string[];
    mockupType: "branding" | "multi-tenant" | "contracts" | "profit";
}

const features: Feature[] = [
    {
        icon: Palette,
        iconColor: "text-indigo-500",
        headline: "Every client touchpoint is YOUR brand",
        body: "Enable full white-labeling in 60 seconds. Your logo, your colors, and your agency's domain. Your clients interact with your institutionalized portal, reinforcing your value every single day.",
        benefits: [
            "Custom CSS & Branding Overrides",
            "White-labeled PDF Metadata",
            "Your-brand Email Notifications",
            "Custom Dashboard Themes",
        ],
        mockupType: "branding",
    },
    {
        icon: LayoutDashboard,
        iconColor: "text-blue-500",
        headline: "Manage 50 clients as easily as 5",
        body: "Stop switching between folders. Our multi-tenant dashboard allows you to jump between client contexts with one click. Auditing a client's compliance status has never been faster.",
        benefits: [
            "One-click Client Context Switching",
            "Bulk Compliance Auditing",
            "Centralized Client Reporting",
            "Unlimited Policy History",
        ],
        mockupType: "multi-tenant",
    },
    {
        icon: Shield,
        iconColor: "text-emerald-500",
        headline: "Institutional-Grade Document Templates",
        body: "Every document is pre-vetted by elite South African labour legal experts. From Disciplinary Codes to complex Employment Equity policies, produce CCMA-ready documents in under 60 seconds.",
        benefits: [
            "BCEA, LRA & POPIA native compliance",
            "Regular legal review cycles",
            "Smart-field automation",
            "Electronic Signature ready",
        ],
        mockupType: "contracts",
    },
    {
        icon: BarChart3,
        iconColor: "text-amber-500",
        headline: "100% Margin. Uncapped Growth.",
        body: "We provide the plumbing; you provide the consulting. Charge your clients your premium hourly rates while HR CoPilot handles the drafting. Turn document generation into a high-margin recurring revenue stream.",
        benefits: [
            "Professional Platform Fee (R500/mo)",
            "Low Per-Client Annual Fee",
            "Retain 100% of your consulting hours",
            "Direct Billing Integration",
        ],
        mockupType: "profit",
    },
];

const ConsultantFeatures = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="features" className="py-24 md:py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                {/* Section Header */}
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-24"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">
                        The Infrastructure for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Elite HR Agencies</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                        Scale your consultancy with tools previously reserved for multinational firms. High-speed, high-accuracy, zero risk.
                    </p>
                </motion.div>

                {/* Features - Zig-Zag Layout */}
                <div className="space-y-32 md:space-y-48">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const isReversed = index % 2 !== 0;

                        return (
                            <motion.div
                                key={feature.headline}
                                className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center`}
                                initial={{ opacity: 0, y: 60 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                            >
                                {/* Text Content */}
                                <div className={`${isReversed ? "lg:order-2" : "order-2 lg:order-1"}`}>
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 mb-8 shadow-sm">
                                        <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                                    </div>

                                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                                        {feature.headline}
                                    </h3>

                                    <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                                        {feature.body}
                                    </p>

                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                        {feature.benefits.map((benefit) => (
                                            <li key={benefit} className="flex items-start gap-3">
                                                <div className="mt-1 bg-emerald-50 rounded-full p-0.5 border border-emerald-100">
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                </div>
                                                <span className="text-slate-700 font-bold text-sm tracking-tight">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Mockup Visual */}
                                <div className={`${isReversed ? "lg:order-1 shadow-indigo-100/50" : "order-1 lg:order-2 shadow-blue-100/50"} relative group`}>
                                    <motion.div
                                        className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-100 p-3"
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="rounded-[2rem] overflow-hidden bg-slate-50 aspect-[16/10] flex flex-col border border-slate-100">
                                            {/* Top bar mockup */}
                                            <div className="h-10 bg-white border-b border-slate-100 flex items-center px-4 justify-between">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                                </div>
                                                <div className="h-3 w-32 bg-slate-50 rounded-full" />
                                                <div className="w-6 h-6 rounded-full bg-slate-100" />
                                            </div>

                                            {/* Inner View Mockup */}
                                            <div className="p-8 flex-grow">
                                                {feature.mockupType === "branding" && (
                                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                                        <Palette className="w-16 h-16 text-indigo-500 mb-6 opacity-20" />
                                                        <div className="p-6 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center">
                                                            <div className="w-32 h-8 bg-indigo-500 rounded-lg mb-4 flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-widest">Your Logo</div>
                                                            <div className="grid grid-cols-3 gap-2 mt-4">
                                                                <div className="w-8 h-8 rounded-full bg-indigo-600" />
                                                                <div className="w-8 h-8 rounded-full bg-indigo-400" />
                                                                <div className="w-8 h-8 rounded-full bg-slate-800" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {feature.mockupType === "multi-tenant" && (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center space-x-3 mb-6">
                                                            <div className="w-8 h-8 bg-blue-500 rounded-lg" />
                                                            <div className="h-4 w-32 bg-slate-200 rounded-full" />
                                                        </div>
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-4 h-4 bg-slate-200 rounded" />
                                                                    <div className="h-2 w-24 bg-slate-200 rounded-full" />
                                                                </div>
                                                                <div className="px-3 py-1 bg-blue-50 text-[8px] font-bold text-blue-600 rounded-full border border-blue-100 uppercase">Manage</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {feature.mockupType === "contracts" && (
                                                    <div className="h-full flex flex-col">
                                                        <div className="flex justify-between items-center mb-6">
                                                            <div className="h-6 w-48 bg-slate-200 rounded-lg" />
                                                            <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                                                <Check className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow space-y-3">
                                                            <div className="h-2 w-full bg-slate-200/50 rounded-full" />
                                                            <div className="h-2 w-[90%] bg-slate-200/50 rounded-full" />
                                                            <div className="h-2 w-full bg-slate-200/50 rounded-full" />
                                                            <div className="h-24 bg-white rounded-2xl border border-indigo-100 shadow-sm p-4 mt-6">
                                                                <div className="h-2 w-16 bg-slate-300 rounded-full mb-4" />
                                                                <div className="h-8 w-24 bg-indigo-600 rounded flex items-center justify-center text-[10px] text-white font-bold">Sign Policy</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {feature.mockupType === "profit" && (
                                                    <div className="h-full flex flex-col justify-center">
                                                        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 text-center shadow-sm">
                                                            <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Est. Annual Margin</div>
                                                            <div className="text-4xl font-black text-slate-800 mb-2">R450,000</div>
                                                            <div className="text-[10px] font-bold text-slate-500 italic">Based on 25 clients @ R1.5k/hr</div>
                                                        </div>
                                                        <div className="mt-6 flex justify-center">
                                                            <div className="h-2 w-32 bg-slate-200 rounded-full" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Decorative elements */}
                                    <div className={`absolute -z-10 w-64 h-64 blur-3xl rounded-full opacity-20 ${index % 2 === 0 ? "bg-indigo-500 -top-10 -right-10" : "bg-blue-500 -bottom-10 -left-10"}`} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ConsultantFeatures;
