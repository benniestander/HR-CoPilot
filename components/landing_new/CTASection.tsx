import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Full-bleed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-secondary/90" />

      {/* Animated shapes */}
      <motion.div
        className="absolute top-20 left-[10%] w-32 h-32 rounded-full border-4 border-primary/30"
        animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-[15%] w-24 h-24 bg-primary/20 rounded-lg"
        animate={{ y: [0, 20, 0], rotate: [0, -90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-[5%] w-16 h-16 bg-primary/30 rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              Ready to simplify your HR?
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-secondary-foreground mb-6 leading-tight">
            Stop wrestling with
            <br />
            <span className="text-primary">HR compliance.</span>
          </h2>

          <p className="text-xl text-secondary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join 500+ SA businesses who've ditched the spreadsheets,
            fired the expensive consultants, and actually started enjoying HR admin.
            <br />
            <span className="text-secondary-foreground/60 text-lg">(Okay, maybe "enjoying" is a stretch. But it's definitely less painful.)</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="xl"
              className="group"
              onClick={() => {
                const pricingSection = document.getElementById('pricing');
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Get Compliant Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </div>

          <p className="mt-6 text-secondary-foreground/60 text-sm italic">
            Trusted by 500+ South African businesses. Instant document generation. No long-term contracts.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
