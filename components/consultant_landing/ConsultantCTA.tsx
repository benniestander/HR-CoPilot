import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

const ConsultantCTA = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { setAuthPage } = useAuthContext();

    return (
        <section className="py-24 md:py-48 relative overflow-hidden bg-foreground">
            {/* Full-bleed gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-foreground via-slate-900 to-foreground/95" />

            {/* Animated shapes */}
            <motion.div
                className="absolute top-20 left-[10%] w-32 h-32 rounded-full border-4 border-primary/20"
                animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-20 right-[15%] w-24 h-24 bg-primary/10 rounded-xl"
                animate={{ y: [0, 20, 0], rotate: [0, -90, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/2 right-[5%] w-64 h-64 bg-primary/5 rounded-full blur-[100px]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="container mx-auto px-4 relative z-10" ref={ref}>
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md rounded-full px-4 py-2 mb-10 border border-primary/20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">
                            Exclusive Institutional Access
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tighter">
                        Scale your practice <br />
                        <span className="text-gradient">without the legal overhead.</span>
                    </h2>

                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join the waiting list for our Institutional Partner Program. Empower your consultancy with the tech stack it deserves.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button
                            variant="hero"
                            size="xl"
                            className="group h-16 w-full sm:w-auto px-12 rounded-2xl shadow-2xl shadow-primary/20 bg-white text-foreground hover:bg-slate-100"
                            onClick={() => setAuthPage('signup')}
                        >
                            Apply for Platform Access
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
                        </Button>
                    </div>

                    <div className="mt-16 flex flex-wrap justify-center gap-10 opacity-40 grayscale">
                        <div className="flex items-center space-x-3">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">BCEA Compliant</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">POPIA Certified</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">LRA Native</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ConsultantCTA;
