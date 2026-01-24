import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Zap } from "lucide-react";

const ConsultantRevenueSimulator = () => {
    const [clients, setClients] = useState(10);
    const [rate, setRate] = useState(1200);

    const annualRevenue = clients * rate * 2 * 12; // Assuming 2 hours per client per month

    // New Agency Pricing Logic:
    // Standard: R500/mo + R750/client/year
    // Agency (6+ clients): R5,000/year (All-in)
    const standardCost = (500 * 12) + (clients * 750);
    const agencyCost = 5000;

    // Auto-apply Agency Tier if cheaper
    const copilotCost = (clients >= 6) ? agencyCost : standardCost;
    const profit = annualRevenue - copilotCost;

    return (
        <section className="py-24 md:py-32 bg-background overflow-hidden relative border-t border-border/30">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute bottom-0 right-0 w-[50%] h-[70%] bg-primary/5"
                    style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tighter">
                                The Economics <br />
                                of <span className="text-gradient">Scale.</span>
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
                                Stop trading hours for pennies. Use HR CoPilot to automate the drafting and focus on high-value consulting.
                            </p>

                            <div className="space-y-10 p-8 md:p-12 bg-card border border-border/50 rounded-[2.5rem] shadow-strong">
                                <div>
                                    <div className="flex justify-between mb-6">
                                        <label className="text-sm font-bold text-foreground uppercase tracking-[0.2em] flex items-center">
                                            <Users className="w-4 h-4 mr-3 text-primary" /> Active Clients
                                        </label>
                                        <span className="text-3xl font-black text-foreground">{clients}</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="100" value={clients}
                                        onChange={(e) => setClients(parseInt(e.target.value))}
                                        className="hrcopilot-slider w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-6">
                                        <label className="text-sm font-bold text-foreground uppercase tracking-[0.2em] flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-3 text-primary" /> Hourly Rate (R)
                                        </label>
                                        <span className="text-3xl font-black text-foreground">R{rate}</span>
                                    </div>
                                    <input
                                        type="range" min="500" max="5000" step="100" value={rate}
                                        onChange={(e) => setRate(parseInt(e.target.value))}
                                        className="hrcopilot-slider w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="bg-foreground p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group border border-white/5"
                            >
                                {/* Animated flare */}
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                                <div className="relative z-10 text-center text-background">
                                    <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-50">Estimated Annual Margin</p>
                                    <motion.div
                                        key={profit}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-10 text-white"
                                    >
                                        R{profit.toLocaleString()}
                                    </motion.div>

                                    <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/10 text-left">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase opacity-40 mb-2 tracking-widest">CoPilot Cost</p>
                                            <p className="text-xl md:text-2xl font-black text-white">R{copilotCost.toLocaleString()}</p>
                                            {clients >= 6 && (
                                                <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary-foreground text-[10px] font-bold rounded-full border border-primary/20">
                                                    Agency Tier Capped
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase opacity-40 mb-2 tracking-widest">Time Saved</p>
                                            <p className="text-xl md:text-2xl font-black text-white">{clients * 4}h / mo</p>
                                        </div>
                                    </div>

                                    <Button size="xl" variant="hero" className="w-full mt-12 h-16 shadow-2xl shadow-primary/30">
                                        Lock In This Margin
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Annotation */}
                            <motion.div
                                className="mt-8 lg:mt-0 lg:absolute lg:-bottom-6 lg:-right-6 bg-card text-muted-foreground p-5 rounded-2xl border border-border/50 shadow-strong max-w-xs z-20"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <p className="text-xs font-semibold italic leading-relaxed">
                                    "Based on 2 hours of billable document drafting per client per month using HR CoPilot's automated generation engine."
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConsultantRevenueSimulator;
