import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, ArrowRight, Shield, Download, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUIContext } from '@/contexts/UIContext';
import { POLICIES, FORMS } from '@/constants';
import { useSEO } from '@/hooks/useSEO';

const PolicyLibrary: React.FC = () => {
    const { navigateTo } = useUIContext();
    const [searchTerm, setSearchTerm] = React.useState('');

    useSEO({
        title: "HR Policy Library | 50+ Vetted SA Templates",
        description: "Browse our comprehensive library of South African HR templates. BCEA, LRA, and POPIA compliant policies and contracts for small businesses.",
        canonical: "https://hrcopilot.co.za/#/library"
    });

    const allTemplates = [...Object.values(POLICIES), ...Object.values(FORMS)];

    const filteredTemplates = allTemplates.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header */}
            <section className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            Institutional HR <br />
                            <span className="text-indigo-400">Template Library.</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                            Access over 50+ legally-vetted South African HR documents.
                            Fully compliant with BCEA, LRA, and POPIA benchmarks.
                        </p>

                        <div className="relative max-w-xl group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by policy (e.g. Leave, Disciplinary)..."
                                className="w-full h-16 pl-16 pr-6 bg-slate-800 border-slate-700 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Abstract background shapes */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] -translate-y-1/2" />
                </div>
            </section>

            {/* Grid */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">
                            Available Templates ({filteredTemplates.length})
                        </h2>
                        <div className="flex gap-2">
                            <div className="w-10 h-1 text-indigo-200 bg-indigo-200 rounded-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTemplates.map((template, idx) => {
                            const slug = `${template.type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-template-south-africa`;
                            const Icon = template.icon || FileText;

                            return (
                                <motion.div
                                    key={template.type}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(idx * 0.05, 1) }}
                                >
                                    <button
                                        onClick={() => window.location.hash = `#/templates/${slug}`}
                                        className="w-full group bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-indigo-400 hover:shadow-2xl transition-all text-left flex flex-col h-full"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-indigo-50 transition-colors">
                                            <Icon className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors flex-grow">
                                            {template.title}
                                        </h3>

                                        <p className="text-sm text-slate-500 mb-8 line-clamp-2">
                                            {template.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                            <div className="flex items-center text-xs font-black text-indigo-600 uppercase tracking-widest">
                                                Overview <ArrowRight className="ml-2 w-4 h-4" />
                                            </div>
                                            <div className="text-sm font-black text-slate-300 group-hover:text-slate-900 transition-colors">
                                                R35 / doc
                                            </div>
                                        </div>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-24">
                            <p className="text-xl text-slate-400 italic">No templates match your search...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-indigo-600 py-24">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
                        Need more than one document?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
                        Join our Pro membership for unlimited document generation and AI-powered compliance auditing.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button variant="hero" size="xl" onClick={() => navigateTo('upgrade')} className="bg-white text-indigo-600 hover:bg-slate-100">
                            See Pro Pricing
                        </Button>
                        <Button variant="heroOutline" size="xl" onClick={() => window.location.hash = '#/'} className="border-white text-white hover:bg-indigo-500">
                            Back to Home
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PolicyLibrary;
