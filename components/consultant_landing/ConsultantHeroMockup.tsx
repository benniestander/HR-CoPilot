import { motion } from "framer-motion";
import { Check, Shield, FileText, Users, Bell, BarChart, Lock, Globe, Briefcase } from "lucide-react";

export const ConsultantHeroMockup = () => {
    return (
        <div className="relative w-full max-w-4xl h-[500px] perspective-1000">
            {/* Main Portal Mockup */}
            <motion.div
                className="absolute left-0 top-10 w-[85%] bg-background border border-border/50 rounded-2xl shadow-strong overflow-hidden z-20"
                initial={{ rotateY: 10, x: -20 }}
                animate={{ rotateY: 0, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Header Mockup */}
                <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-card/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs font-bold text-foreground">Consultant Workspace</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Acme HR Consulting</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            8 ADVANCED CLIENTS
                        </div>
                        <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center">
                            <Bell className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Body Content Mockup */}
                <div className="p-6 space-y-6">
                    {/* Client Selector Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { name: "Atlas Tech", docs: 12, status: "Compliant" },
                            { name: "Cape Logistics", docs: 8, status: "Updating..." },
                            { name: "Sky Retail", docs: 15, status: "Compliant" }
                        ].map((client, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-border bg-card group hover:border-primary/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-8 h-8 rounded bg-muted/30 flex items-center justify-center text-[10px] font-bold">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${client.status === "Compliant" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
                                        {client.status}
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-foreground mb-1">{client.name}</p>
                                <p className="text-[9px] text-muted-foreground">{client.docs} Documents</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats & Tools */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <BarChart className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">Revenue Estimate</p>
                                <p className="text-lg font-extrabold text-foreground">R14,500 <span className="text-[10px] font-normal text-muted-foreground">/mo</span></p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">White-Label</p>
                                <p className="text-lg font-extrabold text-foreground">Active</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Generation Bar */}
                    <div className="h-12 w-full rounded-xl bg-primary flex items-center justify-between px-6 text-primary-foreground">
                        <span className="font-bold text-xs uppercase tracking-widest">Generate Branded Document</span>
                        <div className="flex items-center gap-2">
                            <div className="h-6 px-3 rounded bg-white/20 flex items-center justify-center text-[10px] font-bold">PDF</div>
                            <div className="h-6 px-3 rounded bg-white/20 flex items-center justify-center text-[10px] font-bold">WORD</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Brand Badge */}
            <motion.div
                className="absolute right-0 top-0 w-[40%] h-[350px] z-30"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <div className="absolute top-10 right-0 w-full bg-white rounded-2xl shadow-2xl border border-border/20 p-6 space-y-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                    <div className="flex justify-between items-center pb-2 border-b border-border/10">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-primary" />
                            <p className="text-[8px] font-bold text-secondary uppercase">Your Brand Here</p>
                        </div>
                        <Lock className="w-3 h-3 text-primary/50" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-1.5 w-full bg-muted/30 rounded" />
                        <div className="h-1.5 w-[90%] bg-muted/30 rounded" />
                        <div className="h-1.5 w-[85%] bg-muted/30 rounded" />
                    </div>
                    <div className="pt-2">
                        <p className="text-[6px] text-muted-foreground mb-1 uppercase tracking-tighter">Branded for your clients</p>
                        <div className="h-20 w-full bg-gradient-to-br from-primary/5 to-accent/10 rounded-lg flex items-center justify-center overflow-hidden">
                            <div className="text-[10px] font-black opacity-10 uppercase -rotate-12 scale-150">YOUR LOGO</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Scale Badge */}
            <motion.div
                className="absolute -bottom-4 right-20 bg-accent text-accent-foreground p-3 rounded-2xl shadow-strong z-40 border-2 border-background flex items-center gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-bold leading-none uppercase tracking-wide">Multi-Tenant</p>
                    <p className="text-[10px] opacity-80 leading-tight">Scale to 100+ clients easily</p>
                </div>
            </motion.div>
        </div>
    );
};
