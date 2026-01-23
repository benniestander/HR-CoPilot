import { Button } from "@/components/ui/button";
import { Check, X, Zap } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const plans = [
  {
    name: "Pay-As-You-Go",
    tagline: "Perfect for occasional needs",
    price: "R35",
    period: "/policy",
    description: "Only pay for what you use. No monthly commitments.",
    benefits: [
      "R35 per policy or document",
      "All document types available",
      "BCEA, LRA & POPIA compliance built-in",
      "Download in Word & PDF formats",
      "Email support within 48 hours",
    ],
    limitations: [
      "Priority support",
      "Custom branding",
      "Bulk discounts",
    ],
    cta: "Get Started",
    ctaAction: "signup",
    featured: false,
  },
  {
    name: "Pro Plan",
    tagline: "Best value for growing teams",
    price: "R757",
    period: "/year",
    description: "Unlimited documents. Full compliance. One simple price.",
    benefits: [
      "Unlimited document generation",
      "All template types included",
      "Complete compliance suite (BCEA, LRA, POPIA)",
      "Custom branding on all documents",
      "Priority support (24-hour response)",
      "Download in Word & PDF formats",
      "Policy update notifications",
      "Team collaboration tools",
    ],
    limitations: [],
    cta: "Start Free Trial",
    ctaAction: "signup",
    featured: true,
  },
];

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 md:py-32 bg-card relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
            Simple pricing.
            <br />
            <span className="text-muted-foreground text-2xl md:text-3xl font-normal">
              Pay per policy or go unlimited.
            </span>
          </h2>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-3xl p-8 ${plan.featured
                ? "bg-secondary text-secondary-foreground scale-105 shadow-strong z-10"
                : "bg-background border border-border/50 shadow-soft"
                }`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full">
                  <Zap className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <p className={`text-sm font-medium mb-2 ${plan.featured ? "text-primary" : "text-primary"}`}>
                  {plan.tagline}
                </p>
                <h3 className={`text-2xl font-bold mb-2 ${plan.featured ? "text-secondary-foreground" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <div className="mb-3">
                  <span className={`text-4xl font-extrabold ${plan.featured ? "text-secondary-foreground" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  <span className={plan.featured ? "text-secondary-foreground/70" : "text-muted-foreground"}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.featured ? "text-secondary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              {/* Benefits Section */}
              <div className="mb-8">
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${plan.featured ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>
                  What's Included
                </h4>
                <ul className="space-y-3">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 mt-0.5 ${plan.featured ? "text-primary" : "text-primary"}`} />
                      <span className={`text-sm ${plan.featured ? "text-secondary-foreground" : "text-foreground"}`}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Limitations (what's NOT included) */}
                {plan.limitations.length > 0 && (
                  <ul className="space-y-2 mt-4 pt-4 border-t border-border/30">
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-3">
                        <X className={`w-5 h-5 shrink-0 mt-0.5 ${plan.featured ? "text-secondary-foreground/40" : "text-muted-foreground/40"}`} />
                        <span className={`text-sm ${plan.featured ? "text-secondary-foreground/50" : "text-muted-foreground/50"}`}>
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Button
                variant={plan.featured ? "hero" : "outline"}
                size="lg"
                className="w-full"
                onClick={() => {
                  if (plan.ctaAction === "signup") {
                    // Scroll to top and trigger signup
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Trigger the Get Started button in navbar
                    setTimeout(() => {
                      const getStartedBtn = document.querySelector('[data-action="get-started"]') as HTMLElement;
                      if (getStartedBtn) getStartedBtn.click();
                    }, 500);
                  } else if (plan.ctaAction === "contact") {
                    window.location.href = "mailto:hello@hrcopilot.co.za?subject=Enterprise Plan Inquiry";
                  }
                }}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          className="text-center text-muted-foreground mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Start with Pay-As-You-Go or try Pro free for 14 days. No credit card required.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
