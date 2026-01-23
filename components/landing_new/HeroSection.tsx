import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { HeroMockup } from "./HeroMockup";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Diagonal background slice */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[60%] h-full bg-primary/5"
          style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-accent/30"
          style={{ clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 100%)" }}
        />
      </div>

      {/* Floating shapes */}
      <motion.div
        className="absolute top-32 right-[15%] w-24 h-24 rounded-full border-4 border-primary/20"
        animate={{ y: [0, -20, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 left-[10%] w-16 h-16 bg-primary/10 rounded-lg"
        animate={{ y: [0, 15, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[60%] right-[8%] w-8 h-8 bg-accent rounded-full"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Text Content - Left side */}
          <motion.div
            className="order-1"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Eyebrow with personality */}
            <motion.div
              className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Jou nuwe HR bestuurder is hier
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.1] mb-6">
              HR paperwork?
              <br />
              <span className="text-gradient">Nee dankie.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
              The automated HR compliance tool for South African businesses with
              <span className="font-semibold text-foreground"> less than 50 employees</span>.
              Generate legally-sound policies in minutes—no expensive consultants required.
              <br /><br />
              <span className="text-sm border-l-2 border-primary pl-3 italic">
                Are you an HR Consultant? Manage all your clients through our
                <span className="font-bold text-primary"> Partner Portal</span>.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                Generate Your First Policy
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </div>

            {/* Social proof - not generic */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground"
                  >
                    {["JB", "SM", "TN", "KP"][i - 1]}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-foreground">500+</span>
                <span className="text-muted-foreground"> SA businesses trust us</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual - Right side */}
          <motion.div
            className="order-2 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.02, rotateY: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-2xl blur-3xl transform -rotate-3" />
                <HeroMockup />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Logo Strip / Social Proof */}
        <motion.div
          className="mt-20 pt-10 border-t border-border/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-8">
            Trusted by modern SA businesses in
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">TECH</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">RETAIL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">LOGISTICS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">FINANCE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">MANUFACTURING</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-card"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
