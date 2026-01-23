import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Clock, Shield, TrendingDown } from "lucide-react";

const features = [
    {
        icon: Clock,
        iconColor: "text-primary",
        headline: "Generate compliant contracts in 3 minutes",
        body: "Stop waiting weeks for your lawyer to respond. Our AI creates employment contracts, policies, and HR documents while your coffee's still hot. Download in Word or PDF, ready to sign.",
        benefits: [
            "30-second document generation",
            "Download in Word & PDF formats",
            "No legal jargon - plain English",
            "Customizable templates for your business",
        ],
        imagePlaceholder: "document-generator-screenshot",
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
            "POPIA data protection built-in",
        ],
        imagePlaceholder: "compliance-dashboard-screenshot",
        imageAlt: "Compliance dashboard showing 100% BCEA, LRA, and POPIA compliance status",
    },
    {
        icon: TrendingDown,
        iconColor: "text-blue-600",
        headline: "Save R180,000/year on HR consultants",
        body: "One employment contract from a lawyer costs R3,000+. With HR CoPilot, generate unlimited documents for R62/month. That's 95% savings without compromising on legal quality.",
        benefits: [
            "R62/month for unlimited documents",
            "No per-document fees",
            "No hourly billing surprises",
            "Cancel anytime - no lock-in",
        ],
        imagePlaceholder: "savings-calculator-screenshot",
        imageAlt: "Cost comparison showing R180,000 annual savings vs traditional HR consultants",
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
                                        {/* Placeholder for screenshot - will be replaced with actual images */}
                                        <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                                            {/* Glow effect on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Placeholder content */}
                                            <div className="relative z-10 text-center p-8">
                                                <Icon className={`w-24 h-24 ${feature.iconColor} mx-auto mb-4 opacity-20`} />
                                                <p className="text-muted-foreground text-sm">
                                                    Screenshot: {feature.imagePlaceholder}
                                                </p>
                                                <p className="text-xs text-muted-foreground/60 mt-2">
                                                    {feature.imageAlt}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Annotation badge (example) */}
                                        {index === 0 && (
                                            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                                ⚡ 30 seconds
                                            </div>
                                        )}
                                        {index === 1 && (
                                            <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                                ✓ 100% Compliant
                                            </div>
                                        )}
                                        {index === 2 && (
                                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                                💰 95% Savings
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
