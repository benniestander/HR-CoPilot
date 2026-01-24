import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Clock, Zap } from "lucide-react";

const ConsultantRevenueSimulator = () => {
    const [clients, setClients] = useState(10);
    const [rate, setRate] = useState(1200);

    const annualRevenue = clients * rate * 2 * 12; // Assuming 2 hours per client per month

    // New Agency Pricing Logic:
    // Standard: R500/mo + R750/client/year
    // Agency (6+ clients): R5,000/year (All-in)
    const standardCost = (500 * 12) + (clients * 750);
    const agencyCost = 5000;

    // Auto-apply Agency Tier if cheaper (which is always true for > 0 clients basically, but strictly modeled for scale)
    const copilotCost = (clients >= 6) ? agencyCost : standardCost;

    const profit = annualRevenue - copilotCost;

    return (
        <section className="py-24 bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                                The Economics of <br />
                                <span className="text-primary">Scale.</span>
                            </h2>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed mb-10">
                                Stop trading hours for pennies. Use HR CoPilot to automate the drafting and focus on high-value consulting.
                            </p>

                            <div className="space-y-8 p-8 bg-slate-800/50 rounded-[2rem] border border-slate-700/50 backdrop-blur-xl shadow-2xl">
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center">
                                            <Users className="w-4 h-4 mr-2 text-primary" /> Active Clients
                                        </label>
                                        <span className="text-xl font-black text-white">{clients}</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="100" value={clients}
                                        onChange={(e) => setClients(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-4">
                                        <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-2 text-primary" /> Hourly Consulting Rate (R)
                                        </label>
                                        <span className="text-xl font-black text-white">R{rate}</span>
                                    </div>
                                    <input
                                        type="range" min="500" max="5000" step="100" value={rate}
                                        onChange={(e) => setRate(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-br from-primary to-indigo-600 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Zap className="w-40 h-40 text-white" />
                                </div>

                                <div className="relative z-10 text-center text-white">
                                    <p className="text-sm font-black uppercase tracking-[0.2em] mb-4 opacity-80">Estimated Annual Margin</p>
                                    <motion.div
                                        key={profit}
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-6xl md:text-8xl font-black tracking-tighter mb-8"
                                    >
                                        R{profit.toLocaleString()}
                                    </motion.div>

                                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/20">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase opacity-60 mb-1">CoPilot Cost</p>
                                            <p className="text-lg font-black text-white/90">R{copilotCost.toLocaleString()}</p>
                                            {clients >= 6 && (
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">
                                                    Agency Tier Capped
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Time Saved</p>
                                            <p className="text-lg font-black text-white/90">{clients * 4}h / mo</p>
                                        </div>
                                    </div>

                                    <Button className="w-full mt-10 h-16 bg-white text-primary hover:bg-slate-50 font-black text-lg rounded-2xl shadow-xl">
                                        Lock In This Margin
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Annotation */}
                            <div className="absolute -bottom-6 -right-6 bg-slate-800 text-slate-300 p-4 rounded-2xl border border-slate-700 shadow-xl max-w-[200px]">
                                <p className="text-[10px] font-bold leading-relaxed">
                                    "Based on average consultant efficiency gains using auto-drafting."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConsultantRevenueSimulator;
