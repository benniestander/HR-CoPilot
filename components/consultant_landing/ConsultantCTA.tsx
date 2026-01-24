import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

const ConsultantCTA = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { setAuthPage } = useAuthContext();

    return (
        <section className="py-32 relative overflow-hidden bg-slate-900">
            {/* Full-bleed gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />

            {/* Animated shapes */}
            <motion.div
                className="absolute top-20 left-[5%] w-64 h-64 rounded-full bg-primary/10 blur-[100px]"
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-20 right-[5%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 mb-10 border border-white/10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">
                            Exclusive Institutional Access
                        </span>
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                        Scale your practice <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">without the legal overhead.</span>
                    </h2>

                    <p className="text-lg sm:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                        Join the waiting list for our Institutional Partner Program. Empower your consultancy with the tech stack it deserves.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button
                            variant="hero"
                            size="xl"
                            className="group h-16 w-full sm:w-auto px-12 rounded-2xl shadow-2xl shadow-primary/20"
                            onClick={() => setAuthPage('signup')}
                        >
                            Apply for Platform Access
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
                        </Button>
                        <Button
                            variant="heroOutline"
                            size="xl"
                            className="h-16 w-full sm:w-auto px-12 rounded-2xl border-white/20 text-white hover:bg-white/5"
                        >
                            Speak to an Advisor
                        </Button>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50 grayscale">
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">BCEA Compliant</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">POPIA Certified</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">LRA Native</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ConsultantCTA;
