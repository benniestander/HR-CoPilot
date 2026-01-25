import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, LayoutDashboard, Palette, Shield, Zap, BarChart3 } from "lucide-react";

import imgBranding from "@/assets/hr_white_label_preview.png";
import imgMultiTenant from "@/assets/hr_multi_tenant_preview.jpg";
import imgContracts from "@/assets/hr_automation_preview.jpg";

const RevenueMockup = () => (
    <div className="w-full h-full bg-slate-950 p-8 flex flex-col justify-center items-start space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 w-full">
            <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">Practice Economics</h4>
            <h3 className="text-white text-3xl font-black leading-tight mb-8">
                Exponential <br />
                Revenue Growth
            </h3>

            <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">New Clients</p>
                    <p className="text-white text-2xl font-black">150+</p>
                    <div className="flex items-center text-emerald-400 text-[10px] font-black mt-2">
                        <Zap size={10} className="mr-1" /> +28% MOY
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Total Billing</p>
                    <p className="text-white text-2xl font-black">R2.5M+</p>
                    <div className="flex items-center text-primary text-[10px] font-black mt-2">
                        BCEA AUDITS ACTIVE
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-primary to-teal-500 h-1.5 w-full rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-white/40"
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>
        </div>
    </div>
);

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
        body: "Configure your branding in 60 seconds. Your logo, your colors, and your agency's domain. Your clients interact with your branded portal, reinforcing your value every single day.",
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
            "Low Per-Client Monthly Fee",
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
        <section id="features" className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10" ref={ref}>
                {/* Section Header */}
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-20 md:mb-32"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tighter">
                        The Infrastructure for <br />
                        <span className="text-gradient">Elite HR Agencies</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Scale your consultancy with tools previously reserved for multinational firms. High-speed, high-accuracy, zero risk.
                    </p>
                </motion.div>

                {/* Features - Zig-Zag Layout */}
                <div className="space-y-24 md:space-y-48">
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
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/30 mb-8 border border-primary/10">
                                        <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                                    </div>

                                    <h3 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight tracking-tighter">
                                        {feature.headline}
                                    </h3>

                                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                        {feature.body}
                                    </p>

                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                        {feature.benefits.map((benefit) => (
                                            <li key={benefit} className="flex items-start gap-3 group">
                                                <div className="mt-1 bg-emerald-50 rounded-full p-0.5 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                </div>
                                                <span className="text-foreground/80 font-semibold text-sm tracking-tight">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Mockup Visual */}
                                <div className={`${isReversed ? "lg:order-1" : "order-1 lg:order-2"} relative`}>
                                    <motion.div
                                        className="relative rounded-[2.5rem] overflow-hidden shadow-strong bg-white border border-border/50 p-3"
                                        whileHover={{ scale: 1.02, y: -8 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="rounded-[2rem] overflow-hidden bg-slate-50 aspect-[16/10] flex flex-col border border-border/30">
                                            {/* Top bar mockup */}
                                            <div className="h-10 bg-white border-b border-border/50 flex items-center px-4 justify-between">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                                </div>
                                                <div className="h-3 w-32 bg-slate-50 rounded-full" />
                                                <div className="w-6 h-6 rounded-full bg-primary/10" />
                                            </div>

                                            {/* Inner View Mockup - Replaced with High Quality Imports */}
                                            <div className="flex-grow relative h-full">
                                                {feature.mockupType === "branding" && (
                                                    <img
                                                        src={imgBranding}
                                                        alt="White Labeling Interface"
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                {feature.mockupType === "multi-tenant" && (
                                                    <img
                                                        src={imgMultiTenant}
                                                        alt="Multi-tenant Dashboard"
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                {feature.mockupType === "contracts" && (
                                                    <img
                                                        src={imgContracts}
                                                        alt="Automated Document Drafting"
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                {feature.mockupType === "profit" && (
                                                    <RevenueMockup />
                                                )}
                                                {/* Overlay gradient for depth */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
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
