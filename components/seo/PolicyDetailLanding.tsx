import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, ArrowRight, Download, FileText, Lock, HelpCircle, ChevronRight, Share2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUIContext } from '@/contexts/UIContext';
import { PolicySEOData, CORE_POLICY_SEO, generateGenericSEOData } from '@/utils/policySeoData';
import { POLICIES, FORMS } from '@/constants';
import { useSEO } from '@/hooks/useSEO';
import Navbar from '../landing_new/Navbar';
import Footer from '../landing_new/Footer';

interface PolicyDetailLandingProps {
    slug: string;
}

const PolicyDetailLanding: React.FC<PolicyDetailLandingProps> = ({ slug }) => {
    const { setAuthPage } = useAuthContext();
    const { navigateTo } = useUIContext();

    // Find the policy/form by matching slug
    const docData = useMemo(() => {
        // Find in core first
        const coreMatch = Object.values(CORE_POLICY_SEO).find(s => s.slug === slug);
        if (coreMatch) return coreMatch;

        // Otherwise generate generic from POLICIES or FORMS
        const allDocs = { ...POLICIES, ...FORMS };
        const match = Object.values(allDocs).find(d => {
            const baseSlug = d.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return `${baseSlug}-template-south-africa` === slug;
        });

        if (match) {
            return generateGenericSEOData(match.type, match.title, match.description);
        }
        return null;
    }, [slug]);

    if (!docData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Template Not Found</h1>
                    <Button onClick={() => navigateTo('library')}>Back to Library</Button>
                </div>
            </div>
        );
    }

    useSEO({
        title: docData.title,
        description: docData.metaDescription,
        canonical: `https://hrcopilot.co.za/templates/${slug}`
    });

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            {/* Header / Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center text-xs font-medium text-slate-400 space-x-2">
                        <button onClick={() => navigateTo('dashboard')} className="hover:text-primary transition-colors">Home</button>
                        <ChevronRight className="w-3 h-3" />
                        <button onClick={() => navigateTo('library')} className="hover:text-primary transition-colors">Templates</button>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-600 truncate">{docData.h1}</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="pt-12 pb-24 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider">
                                South African Template
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                                {docData.h1}
                            </h1>
                            <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-xl">
                                {docData.summary} Vetted for current 2026 SA labour regulations and easy to customize for your specific business.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <Button
                                    size="xl"
                                    className="h-16 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                                    onClick={() => setAuthPage('login')}
                                >
                                    Generate This Now <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="xl"
                                    className="h-16 px-10 rounded-2xl text-lg font-bold bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                >
                                    View Sample
                                </Button>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">BCEA & LRA Vetted</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">Editable Word/PDF</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {/* Document Mockup */}
                            <Card className="bg-white p-8 rounded-[2rem] shadow-strong border-slate-100 relative z-10 overflow-hidden min-h-[500px]">
                                <div className="flex justify-between items-center pb-6 border-b border-slate-100 mb-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{docData.h1}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">South Africa • 2026</p>
                                        </div>
                                    </div>
                                    <Lock className="w-4 h-4 text-slate-200" />
                                </div>

                                <div className="space-y-6">
                                    <div className="h-4 w-3/4 bg-slate-50 rounded" />
                                    <div className="h-3 w-full bg-slate-50/50 rounded" />
                                    <div className="h-3 w-full bg-slate-50/50 rounded" />
                                    <div className="h-3 w-[90%] bg-slate-50/50 rounded" />

                                    <div className="py-8">
                                        <div className="flex items-center mb-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                                            <div className="h-3 w-2/3 bg-primary/10 rounded" />
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                                            <div className="h-3 w-1/2 bg-primary/10 rounded" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <div className="h-2 w-full bg-slate-50/30 rounded" />
                                        <div className="h-2 w-full bg-slate-50/30 rounded" />
                                        <div className="h-2 w-full bg-slate-50/30 rounded" />
                                    </div>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                                    <Badge className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl">
                                        PREVIEW CONTENT HIDDEN
                                    </Badge>
                                </div>
                            </Card>

                            {/* Decorative Blobs */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl z-0" />
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl z-0" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Meat of the content */}
            <section className="py-24 bg-white border-t border-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-8 space-y-16">
                            {/* Overview */}
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center">
                                    <div className="w-1.5 h-8 bg-primary rounded-full mr-4" />
                                    Why this document is essential
                                </h2>
                                <p className="text-xl text-slate-600 leading-relaxed">
                                    {docData.whyItMatters}
                                </p>
                            </div>

                            {/* Key Clauses */}
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-8">What's included in the template</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {docData.keyClauses.map((clause, idx) => (
                                        <div key={idx} className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1 mr-4">
                                                <Check className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <p className="text-slate-700 font-bold leading-tight">{clause}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Legal Context */}
                            <Card className="p-10 bg-secondary text-white rounded-[2.5rem] border-none shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <Shield className="w-12 h-12 text-secondary/60 mb-6" />
                                    <h2 className="text-3xl font-black mb-4">Legal Benchmark & Context</h2>
                                    <p className="text-xl text-primary/70 leading-relaxed mb-8">
                                        {docData.legalContext}
                                    </p>
                                    <div className="h-1 w-24 bg-secondary/60 rounded-full" />
                                </div>
                                <div className="absolute top-0 right-0 p-12 opacity-10">
                                    <Lock className="w-48 h-48" />
                                </div>
                            </Card>

                            {/* FAQ Section */}
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center">
                                    <HelpCircle className="w-8 h-8 text-primary mr-4" />
                                    Frequently Asked Questions
                                </h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {docData.faqs.map((faq, idx) => (
                                        <AccordionItem key={idx} value={`item-${idx}`} className="border-none">
                                            <AccordionTrigger className="text-lg font-bold text-slate-800 hover:text-primary hover:no-underline bg-slate-50 px-8 py-6 rounded-2xl group transition-all">
                                                {faq.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-lg text-slate-600 leading-relaxed px-8 py-6">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>

                                {/* Schema.org FAQ Injection */}
                                <script type="application/ld+json">
                                    {JSON.stringify({
                                        "@context": "https://schema.org",
                                        "@type": "FAQPage",
                                        "mainEntity": docData.faqs.map(f => ({
                                            "@type": "Question",
                                            "name": f.q,
                                            "acceptedAnswer": { "@type": "Answer", "text": f.a }
                                        }))
                                    })}
                                </script>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
                            <Card className="p-8 border-primary/10 bg-white rounded-3xl shadow-soft">
                                <div className="text-center mb-8">
                                    <p className="text-xs font-black text-slate-400 uppercase mb-2">Price for instant access</p>
                                    <div className="flex items-center justify-center">
                                        <span className="text-2xl font-bold text-slate-400 mr-2">R</span>
                                        <span className="text-6xl font-black text-slate-900 tracking-tighter">35</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">No subscription required.</p>
                                </div>

                                <Button
                                    className="w-full h-16 rounded-2xl text-lg font-black shadow-lg mb-6"
                                    onClick={() => setAuthPage('login')}
                                >
                                    Get This Template
                                </Button>

                                <div className="space-y-4">
                                    {[
                                        "Automatic Legal Updates",
                                        "One-Click Word Download",
                                        "BCEA Compliant",
                                        "Secure Cloud Storage"
                                    ].map(f => (
                                        <div key={f} className="flex items-center text-xs font-bold text-slate-500">
                                            <Check className="w-4 h-4 text-emerald-500 mr-3 shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <div className="p-8 bg-slate-900 rounded-3xl text-white">
                                <h4 className="text-lg font-black mb-4">Unlimited Access?</h4>
                                <p className="text-sm text-slate-400 mb-6">Gain access to every template (50+) plus the AI Compliance Audit for one simple year price.</p>
                                <Button variant="hero" className="w-full bg-white text-slate-900 hover:bg-slate-100" onClick={() => navigateTo('upgrade')}>
                                    View Pro Plan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Documents (Innerlinking Power) */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-black text-slate-900 mb-12">Related SA HR Documents</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {docData.relatedSlugs.map((rSlug) => {
                            const related = Object.values(CORE_POLICY_SEO).find(s => s.slug === rSlug) ||
                                Object.values(POLICIES).find(p => `${p.type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-template-south-africa` === rSlug);

                            const title = related?.title || rSlug.replace(/-/g, ' ').replace('template south africa', '').trim();

                            return (
                                <button
                                    key={rSlug}
                                    onClick={() => {
                                        window.scrollTo(0, 0);
                                        navigateTo('templates' as any, { slug: rSlug });
                                    }}
                                    className="p-6 bg-white rounded-[2rem] border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all text-left group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
                                        <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-3 capitalize line-clamp-2">
                                        {title}
                                    </h4>
                                    <div className="flex items-center text-xs font-black text-indigo-600 uppercase tracking-widest">
                                        View Template <ArrowRight className="ml-2 w-3.5 h-3.5" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default PolicyDetailLanding;
