import { motion } from "framer-motion";
import { Check, Shield, FileText, Users, Bell, Download, Lock } from "lucide-react";

export const HeroMockup = () => {
    return (
        <div className="relative w-full max-w-4xl h-[500px] perspective-1000">
            {/* Dashboard Mockup (The Base) */}
            <motion.div
                className="absolute left-0 top-10 w-[85%] bg-background border border-border/50 rounded-2xl shadow-strong overflow-hidden z-20"
                initial={{ rotateY: 10, x: -20 }}
                animate={{ rotateY: 0, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Sidebar Mockup */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-muted/30 border-r border-border/50 hidden md:flex flex-col items-center py-6 gap-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-primary">
                        <FileText className="w-5 h-5" />
                    </div>
                </div>

                {/* Header Mockup */}
                <div className="md:pl-16 px-4 py-4 border-b border-border/50 flex items-center justify-between bg-card/50">
                    <div className="flex flex-col">
                        <p className="text-xs font-bold text-foreground">Compliance Dashboard</p>
                        <p className="text-[10px] text-muted-foreground">South Africa • BCEA & LRA</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center">
                            <Bell className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                            R1,499 ACTIVE
                        </div>
                    </div>
                </div>

                {/* Body Content Mockup */}
                <div className="md:pl-16 p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Protection Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <p className="text-lg font-extrabold text-foreground">Fully Insured</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Last Update</p>
                            <p className="text-lg font-extrabold text-primary">12 Oct 2024</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Ready for Download</p>
                        {[
                            "Employment Contract v4.2",
                            "NDA & IP Agreement",
                            "Disciplinary Code 2024"
                        ].map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/10 border border-border/20 text-xs">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-3 h-3 text-primary" />
                                    <span>{doc}</span>
                                </div>
                                <Download className="w-3 h-3 text-muted-foreground" />
                            </div>
                        ))}
                    </div>

                    <div className="h-10 w-full rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                        Generate Unlimited Documents
                    </div>
                </div>
            </motion.div>

            {/* Realistic PDF Document Stack (The Floating Evidence) */}
            <motion.div
                className="absolute right-0 top-0 w-[45%] h-[400px] z-30"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                {/* Document 1: Top Most (Highest Fidelity) */}
                <div className="absolute top-10 right-0 w-full bg-white rounded shadow-2xl border border-border/20 p-6 space-y-4 transform rotate-6 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                    <div className="flex justify-between items-center pb-2 border-b border-border/10">
                        <p className="text-[8px] font-bold text-secondary uppercase">Employment Contract</p>
                        <Lock className="w-3 h-3 text-primary/50" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-muted/30 rounded" />
                        <div className="h-2 w-[90%] bg-muted/30 rounded" />
                        <div className="h-2 w-[85%] bg-muted/30 rounded" />
                        <div className="h-2 w-full bg-muted/30 rounded" />
                    </div>
                    <div className="pt-4 border-t border-border/10">
                        <p className="text-[6px] text-muted-foreground mb-2">SIGNED ELECTRONICALLY BY:</p>
                        <div className="flex justify-between">
                            <div className="h-6 w-20 bg-muted/10 rounded flex items-center justify-center italic text-[8px] text-primary/70">Employer Signature</div>
                            <div className="h-6 w-20 bg-muted/10 rounded flex items-center justify-center italic text-[8px] text-primary/70">Employee Signature</div>
                        </div>
                    </div>
                </div>

                {/* Document 2: Behind */}
                <div className="absolute top-20 right-4 w-full bg-white rounded shadow-xl border border-border/20 p-6 space-y-4 transform rotate-3 z-[-1]">
                    <div className="h-2 w-1/2 bg-muted/20 rounded" />
                    <div className="space-y-2">
                        <div className="h-1 w-full bg-muted/10 rounded" />
                        <div className="h-1 w-full bg-muted/10 rounded" />
                    </div>
                </div>

                {/* Document 3: Deepest */}
                <div className="absolute top-28 right-8 w-full bg-white rounded shadow-lg border border-border/20 p-6 transform rotate-1 z-[-2]">
                    <div className="h-2 w-1/3 bg-muted/10 rounded" />
                </div>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div
                className="absolute -bottom-4 right-20 bg-primary text-white p-3 rounded-2xl shadow-strong z-40 border-2 border-background flex items-center gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-bold leading-none">100% Legal Coverage</p>
                    <p className="text-[10px] opacity-80 leading-tight">Verified for 2024 SA Regulations</p>
                </div>
            </motion.div>
        </div>
    );
};
