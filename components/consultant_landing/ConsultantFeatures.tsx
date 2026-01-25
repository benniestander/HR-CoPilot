import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, LayoutDashboard, Palette, Shield, Zap, BarChart3 } from "lucide-react";

import imgBranding from "@/assets/hr_white_label_preview.png";
import imgMultiTenant from "@/assets/hr_multi_tenant_preview.jpg";
import imgContracts from "@/assets/hr_automation_preview.jpg";
import imgProfit from "@/assets/hr_revenue_preview.jpg";

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
                                                    <img
                                                        src={imgProfit}
                                                        alt="Consultancy Revenue Growth"
                                                        className="w-full h-full object-cover"
                                                    />
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
