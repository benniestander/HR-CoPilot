import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";

const ConsultantHero = () => {
    const { setAuthPage } = useAuthContext();

    return (
        <section className="relative min-h-screen overflow-hidden bg-background pt-20">
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

            <div className="container mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
                    {/* Text Content - Left side */}
                    <motion.div
                        className="order-1"
                        initial={{ opacity: 0, x: -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Eyebrow */}
                        <motion.div
                            className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                                Partnership Programme for HR Consultants
                            </span>
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.1] mb-6 tracking-tighter">
                            Scalable HR. <br />
                            <span className="text-gradient">Zero legal bloat.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
                            The purpose-built OS for <span className="text-foreground font-semibold">South African HR Consultants</span>. Scale from 5 to 50+ clients with automated compliance and branded workspaces.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Button
                                variant="hero"
                                size="xl"
                                className="group"
                                onClick={() => setAuthPage('signup')}
                            >
                                Apply for Access
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </Button>
                            <Button
                                variant="outline"
                                size="xl"
                                className="bg-background/50 backdrop-blur-sm border-border hover:bg-accent transition-colors"
                            >
                                View Demo
                            </Button>
                        </div>

                        {/* Partnership Perks */}
                        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 border-t border-border/30">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
                                    <Zap className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground">60s Generation</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <Sparkles className="w-5 h-5 text-emerald-500" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground">Uncapped Margin</span>
                            </div>
                            <div className="flex items-center space-x-3 hidden sm:flex">
                                <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <ShieldCheck className="w-5 h-5 text-indigo-500" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground">Legally Vetted</span>
                            </div>
                        </div>
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

                                {/* Premium Image Frame */}
                                <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-border/50 p-2 rounded-[2.5rem] shadow-strong overflow-hidden">
                                    <div className="rounded-[2rem] overflow-hidden aspect-[4/3] flex flex-col border border-border/30 relative">
                                        <img
                                            src="/assets/hr_consultant_preview.png"
                                            alt="HR Consultant Management Platform"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Overlay gradient for depth */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Stats Card */}
                            <motion.div
                                className="absolute -bottom-6 -left-6 z-20 bg-background/90 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl flex items-center gap-4"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Protection</p>
                                    <p className="text-sm font-black text-foreground">100% Compliant</p>
                                </div>
                            </motion.div>

                            {/* Floating Margin Badge */}
                            <motion.div
                                className="absolute -top-6 -right-6 z-20 bg-primary text-white px-6 py-3 rounded-full shadow-2xl font-black text-sm flex items-center gap-2 border-2 border-background"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <Zap className="w-4 h-4" /> 100% Margin
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ConsultantHero;
