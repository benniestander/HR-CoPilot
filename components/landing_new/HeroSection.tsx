import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-dashboard.png";

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
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[80vh]">
          {/* Text Content - Asymmetric positioning */}
          <motion.div 
            className="lg:col-span-6 lg:col-start-1"
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
              Stop stressing about BCEA, LRA, and POPIA compliance. 
              We generate legally-sound HR documents while you focus on 
              actually growing your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button variant="hero" size="xl" className="group">
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

          {/* Hero Visual - Offset positioning */}
          <motion.div 
            className="lg:col-span-7 lg:col-start-6 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Main dashboard image with tilt */}
            <div className="relative">
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.02, rotateY: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-2xl blur-2xl transform -rotate-3" />
                <img
                  src={heroImage}
                  alt="HR CoPilot Dashboard"
                  className="relative rounded-2xl shadow-strong w-full transform rotate-1 hover:rotate-0 transition-transform duration-500"
                />
              </motion.div>

              {/* Floating stat card - left */}
              <motion.div 
                className="absolute -left-8 top-1/4 glass rounded-xl p-4 shadow-medium z-20"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">99%</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Compliance Score</p>
                    <p className="text-muted-foreground text-xs">Real-time updates</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating stat card - bottom right */}
              <motion.div 
                className="absolute -right-4 bottom-8 glass rounded-xl p-4 shadow-medium z-20"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-3xl font-extrabold text-primary">R12k+</p>
                <p className="text-muted-foreground text-sm">saved monthly on legal fees</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
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
