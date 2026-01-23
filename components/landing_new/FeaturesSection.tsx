import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Documents in minutes, not days",
    description: "Stop paying attorneys R3,000 per contract. Our AI generates legally-compliant employment documents while your coffee's still hot.",
    visual: "⚡",
    accent: "from-primary to-primary/60",
  },
  {
    title: "BCEA, LRA, POPIA — sorted",
    description: "We've done the homework so you don't have to. Every document is checked against current SA labour legislation. Sleep easy.",
    visual: "🛡️",
    accent: "from-secondary to-secondary/60",
  },
  {
    title: "Built for SMEs, not corporates",
    description: "Enterprise HR tools cost enterprise money. We built something that actually makes sense for businesses with 5-200 employees.",
    visual: "🚀",
    accent: "from-primary to-secondary",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 md:py-32 bg-card relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Section intro - left aligned, not centered */}
        <motion.div 
          className="max-w-2xl mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
            Why SA businesses are{" "}
            <span className="text-gradient">ditching the old way</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            HR compliance shouldn't require a law degree or a second mortgage.
          </p>
        </motion.div>

        {/* Features - alternating layout, not grid */}
        <div className="space-y-16 md:space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-8 md:gap-16 items-center`}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Visual */}
              <div className="md:w-1/2">
                <div 
                  className={`aspect-square max-w-md mx-auto bg-gradient-to-br ${feature.accent} rounded-3xl flex items-center justify-center relative overflow-hidden group`}
                >
                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-4 left-4 w-20 h-20 border-4 border-white/20 rounded-full" />
                    <div className="absolute bottom-8 right-8 w-32 h-32 border-4 border-white/10 rounded-lg rotate-12" />
                    <div className="absolute top-1/2 left-1/2 w-40 h-1 bg-white/20 -rotate-45" />
                  </div>
                  
                  <span className="text-8xl md:text-9xl group-hover:scale-110 transition-transform duration-500">
                    {feature.visual}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
