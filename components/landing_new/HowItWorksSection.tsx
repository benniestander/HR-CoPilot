import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Pick your document",
    description: "Employment contract? Leave policy? Disciplinary procedure? We've got the template.",
  },
  {
    number: "02",
    title: "Answer a few questions",
    description: "No legal jargon. Just plain English (and Afrikaans) questions about your business.",
  },
  {
    number: "03",
    title: "AI does the heavy lifting",
    description: "Our compliance engine checks everything against BCEA, LRA, and POPIA. Automatically.",
  },
  {
    number: "04",
    title: "Download & relax",
    description: "Professional, branded, legally-sound. Ready to use in minutes.",
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Diagonal accent */}
      <div 
        className="absolute top-0 left-0 w-full h-32 bg-card"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 100%)" }}
      />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Header - right aligned for variety */}
        <motion.div 
          className="max-w-2xl ml-auto text-right mb-20"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
            Four steps.
            <br />
            <span className="text-gradient">Zero headaches.</span>
          </h2>
        </motion.div>

        {/* Steps - horizontal scroll on mobile, staggered on desktop */}
        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary/20" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Step card */}
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-medium transition-shadow h-full">
                  {/* Number badge */}
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-6 relative z-10">
                    {step.number}
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow connector - mobile only */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center py-4">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
