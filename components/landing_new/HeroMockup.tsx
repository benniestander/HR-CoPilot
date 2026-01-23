import { motion } from "framer-motion";
import { Check, Shield, FileText, Users, Bell } from "lucide-react";

export const HeroMockup = () => {
    return (
        <div className="relative w-full max-w-2xl bg-background border border-border/50 rounded-2xl shadow-strong overflow-hidden">
            {/* Sidebar Mockup */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20 bg-muted/30 border-r border-border/50 hidden sm:flex flex-col items-center py-6 gap-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground/50">
                    <FileText className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground/50">
                    <Users className="w-5 h-5" />
                </div>
            </div>

            {/* Header Mockup */}
            <div className="sm:pl-20 px-4 py-4 md:py-6 border-b border-border/50 flex items-center justify-between bg-card/50">
                <div className="flex flex-col">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 w-20 bg-muted/60 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="w-24 h-8 rounded-lg bg-primary/10 border border-primary/20" />
                </div>
            </div>

            {/* Body Content Mockup */}
            <div className="sm:pl-20 p-6 md:p-8 space-y-6">
                {/* Compliance Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Labour Law Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-xl font-extrabold text-foreground">100% Compliant</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-card">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Annual Savings</p>
                        <p className="text-xl font-extrabold text-primary">R179k+</p>
                    </div>
                </div>

                {/* Feature List */}
                <div className="space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Recent Documents Generated</p>
                    <div className="space-y-3">
                        {[
                            { name: "Employment Contract (Full-time)", status: "Active", date: "Jan 23, 2026" },
                            { name: "POPIA Privacy Policy", status: "Active", date: "Jan 22, 2026" },
                            { name: "Disciplinary Code", status: "Active", date: "Jan 20, 2026" },
                        ].map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-background flex items-center justify-center border border-border">
                                        <FileText className="w-4 h-4 text-primary/60" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{doc.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-600/20 text-[9px] font-bold uppercase">
                                    <Check className="w-2.5 h-2.5" />
                                    {doc.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                    <div className="h-10 w-full rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-medium">
                        Generate New Policy
                    </div>
                </div>
            </div>

            {/* Floating Indicator */}
            <motion.div
                className="absolute bottom-6 right-6 p-4 rounded-2xl glass shadow-strong border border-primary/20 z-10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-foreground">SME Focus</p>
                        <p className="text-[10px] text-muted-foreground">&lt; 50 Employees</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
