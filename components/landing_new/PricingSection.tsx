import { Button } from "@/components/ui/button";
import { Check, X, Zap } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const plans = [
  {
    name: "Starter",
    tagline: "Dip your toes in",
    price: "R299",
    period: "/month",
    description: "For small teams getting their HR house in order.",
    features: [
      { text: "5 documents per month", included: true },
      { text: "Employment contracts", included: true },
      { text: "Basic policy templates", included: true },
      { text: "Email support", included: true },
      { text: "Custom branding", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Professional",
    tagline: "The sweet spot",
    price: "R599",
    period: "/month",
    description: "Unlimited docs. Full compliance. No brainer.",
    features: [
      { text: "Unlimited documents", included: true },
      { text: "All template types", included: true },
      { text: "Full compliance suite", included: true },
      { text: "Custom branding", included: true },
      { text: "Priority support", included: true },
      { text: "Team collaboration", included: true },
    ],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Enterprise",
    tagline: "Go big",
    price: "Let's chat",
    period: "",
    description: "Custom solutions for larger organizations.",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom integrations", included: true },
      { text: "SLA guarantees", included: true },
      { text: "On-site training", included: true },
      { text: "API access", included: true },
    ],
    cta: "Contact Sales",
    featured: false,
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
            Pricing that makes sense
            <br />
            <span className="text-muted-foreground text-2xl md:text-3xl font-normal">
              (unlike most HR consultants)
            </span>
          </h2>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-3xl p-8 ${
                plan.featured
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

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className={`w-5 h-5 shrink-0 mt-0.5 ${plan.featured ? "text-primary" : "text-primary"}`} />
                    ) : (
                      <X className={`w-5 h-5 shrink-0 mt-0.5 ${plan.featured ? "text-secondary-foreground/40" : "text-muted-foreground/40"}`} />
                    )}
                    <span className={`text-sm ${
                      feature.included 
                        ? plan.featured ? "text-secondary-foreground" : "text-foreground"
                        : plan.featured ? "text-secondary-foreground/50" : "text-muted-foreground/50"
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "hero" : "outline"}
                size="lg"
                className="w-full"
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
          14-day free trial on all plans. No credit card required. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
