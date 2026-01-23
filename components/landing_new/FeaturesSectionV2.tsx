import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Clock, Shield, TrendingDown, Users } from "lucide-react";

interface Feature {
    icon: any;
    iconColor: string;
    headline: string;
    body: string;
    benefits: string[];
    mockupType: "generator" | "monitor" | "savings" | "partner";
    imageAlt: string;
}

const features: Feature[] = [
    {
        icon: Clock,
        iconColor: "text-primary",
        headline: "Generate compliant contracts in 3 minutes",
        body: "Stop waiting weeks for your lawyer to respond. Our automated tool creates employment contracts, policies, and HR documents while your coffee's still hot. Specifically for SA businesses with <50 employees.",
        benefits: [
            "30-second document generation",
            "Download in Word & PDF formats",
            "BCEA, LRA & POPIA compliant",
            "Plain English (no legal jargon)",
        ],
        mockupType: "generator",
        imageAlt: "HR CoPilot document generator interface showing 30-second generation time",
    },
    {
        icon: Shield,
        iconColor: "text-green-600",
        headline: "Stay compliant with BCEA, LRA & POPIA automatically",
        body: "We monitor SA labour law changes 24/7. When legislation updates, we notify you and update your templates. No more CCMA surprises or R50,000 legal fees.",
        benefits: [
            "Real-time compliance monitoring",
            "Automatic template updates",
            "CCMA risk reduction",
            "Local South African support",
        ],
        mockupType: "monitor",
        imageAlt: "Compliance dashboard showing 100% BCEA, LRA, and POPIA compliance status",
    },
    {
        icon: TrendingDown,
        iconColor: "text-blue-600",
        headline: "Save over R170,000 every year",
        body: "Traditional HR consultants charge R15,000+ per month. With HR CoPilot, you get unlimited document generation for one simple annual fee of R747. That's 95% savings for your bottom line.",
        benefits: [
            "R747 billed once per year",
            "Unlimited document generation",
            "No per-document hidden fees",
            "Full compliance suite included",
        ],
        mockupType: "savings",
        imageAlt: "Cost comparison showing R170,000+ annual savings vs traditional HR consultants",
    },
    {
        icon: Users,
        iconColor: "text-purple-600",
        headline: "Are you a Consultant? Partner with us.",
        body: "Manage all your clients through our dedicated Partner Portal. Use our automation to scale your practice while we handle the document legwork. scale from 1 to 100 clients effortlessly.",
        benefits: [
            "Multi-client management dashboard",
            "Dedicated portal for consultants",
            "Bulk client management tools",
            "White-label export options",
        ],
        mockupType: "partner",
        imageAlt: "Partner Portal dashboard showing multi-client management interface",
    },
];

const FeaturesSectionV2 = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="features" className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10" ref={ref}>
                {/* Section Header */}
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
                        How 500+ SA SMEs Generate HR Docs in{" "}
                        <span className="text-gradient">3 Minutes</span>
                        <br />
                        <span className="text-2xl md:text-3xl font-normal text-muted-foreground">
                            (Not 3 Weeks)
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Stop paying R15,000/month for HR consultants. Get legally-compliant documents instantly.
                    </p>
                </motion.div>

                {/* Features - Zig-Zag Layout */}
                <div className="space-y-24 md:space-y-32">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const isReversed = index % 2 !== 0;

                        return (
                            <motion.div
                                key={feature.headline}
                                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center`}
                                initial={{ opacity: 0, y: 60 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                {/* Text Content */}
                                <div className={`${isReversed ? "lg:order-2" : "order-2 lg:order-1"}`}>
                                    {/* Icon Badge */}
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/30 mb-6">
                                        <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                                        {feature.headline}
                                    </h3>

                                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                        {feature.body}
                                    </p>

                                    {/* Benefits List */}
                                    <ul className="space-y-3">
                                        {feature.benefits.map((benefit) => (
                                            <li key={benefit} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                <span className="text-foreground">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Screenshot/Visual */}
                                <div className={`${isReversed ? "lg:order-1" : "order-1 lg:order-2"}`}>
                                    <motion.div
                                        className="relative rounded-2xl overflow-hidden shadow-strong bg-card border border-border/50 group"
                                        whileHover={{ scale: 1.02, y: -8 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {/* Real product screenshot */}
                                        {/* Code-based Mockup Placeholder */}
                                        <div className="relative bg-muted/20 p-4 md:p-8 flex items-center justify-center min-h-[300px]">
                                            <div className="w-full max-w-sm bg-background border border-border/50 rounded-xl shadow-medium overflow-hidden">
                                                <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    {feature.mockupType === "savings" ? (
                                                        <div className="space-y-4">
                                                            <div className="pb-4 border-b border-border/30">
                                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Annual Cost Comparison</p>
                                                                <div className="flex items-end justify-between mt-2">
                                                                    <span className="text-sm">Traditional</span>
                                                                    <span className="text-xl font-bold text-destructive">R180,000</span>
                                                                </div>
                                                                <div className="flex items-end justify-between mt-1">
                                                                    <span className="text-sm font-bold">HR CoPilot</span>
                                                                    <span className="text-2xl font-black text-primary">R747</span>
                                                                </div>
                                                            </div>
                                                            <div className="p-3 bg-primary/10 rounded-lg text-center">
                                                                <p className="text-xs font-bold text-primary">✓ R179,253 Saved Yearly</p>
                                                            </div>
                                                        </div>
                                                    ) : feature.mockupType === "partner" ? (
                                                        <div className="space-y-4">
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Partner Dashboard</p>
                                                            <div className="space-y-2">
                                                                {["Client A (Active)", "Client B (Active)", "Client C (Pending)"].map(c => (
                                                                    <div key={c} className="h-8 w-full bg-muted/40 rounded flex items-center px-3 text-[10px] border border-border/20">
                                                                        {c}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="h-8 w-full bg-primary rounded flex items-center justify-center text-[10px] text-white font-bold">
                                                                Add New Client
                                                            </div>
                                                        </div>
                                                    ) : feature.mockupType === "monitor" ? (
                                                        <div className="space-y-4">
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Compliance Monitor</p>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                                                                <div>
                                                                    <p className="text-xs font-bold">Checking BCEA Status...</p>
                                                                    <p className="text-[10px] text-green-600 font-bold">✓ 100% Up to Date</p>
                                                                </div>
                                                            </div>
                                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                                <div className="h-full w-[90%] bg-primary" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Document Generator</p>
                                                            <div className="h-4 w-3/4 bg-muted rounded" />
                                                            <div className="h-3 w-1/2 bg-muted/60 rounded" />
                                                            <div className="pt-4 space-y-2">
                                                                <div className="h-2 w-full bg-muted/40 rounded" />
                                                                <div className="h-2 w-full bg-muted/40 rounded" />
                                                            </div>
                                                            <div className="pt-4">
                                                                <div className="h-10 w-full bg-primary rounded-lg flex items-center justify-center text-xs text-white font-bold">
                                                                    Generate Document
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Annotation badge (example) */}
                                        {feature.mockupType === "generator" && (
                                            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                                ⚡ 30 seconds
                                            </div>
                                        )}
                                        {feature.mockupType === "monitor" && (
                                            <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                                ✓ 100% Compliant
                                            </div>
                                        )}
                                        {feature.mockupType === "savings" && (
                                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                                💰 95% Savings
                                            </div>
                                        )}
                                        {feature.mockupType === "partner" && (
                                            <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                                🤝 Consultant Ready
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSectionV2;
