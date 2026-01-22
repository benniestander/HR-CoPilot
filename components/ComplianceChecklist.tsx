import React, { useState, useMemo } from 'react';
import { getComplianceRoadmap, RoadmapItem } from '../utils/compliance';
import type { Policy, Form, CompanyProfile } from '../types';
import { ComplianceIcon, MasterPolicyIcon, FormsIcon, CheckIcon, ShieldCheckIcon, InfoIcon, BellIcon } from './Icons';
import { POLICIES, FORMS } from '../constants';
import { useDataContext } from '../contexts/DataContext';
import { useUIContext } from '../contexts/UIContext';
import { PolicyType, FormType } from '../types';

interface ComplianceChecklistProps {
    userProfile: CompanyProfile;
    onBack: () => void;
    onSelectDocument: (item: Policy | Form) => void;
}

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({ userProfile, onBack, onSelectDocument }) => {
    const { generatedDocuments } = useDataContext();
    const { setSelectedItem, setDocumentToView, navigateTo } = useUIContext();
    const [filter, setFilter] = useState<'all' | 'missing'>('all');

    const roadmap = useMemo(() => {
        return getComplianceRoadmap(userProfile, generatedDocuments);
    }, [userProfile, generatedDocuments]);

    const phase1Items = roadmap.filter(i => i.phase === 1 && (filter === 'all' || i.status === 'missing'));
    const phase2Items = roadmap.filter(i => i.phase === 2 && (filter === 'all' || i.status === 'missing'));
    const phase3Items = roadmap.filter(i => i.phase === 3 && (filter === 'all' || i.status === 'missing'));

    const completedCount = roadmap.filter(i => i.status === 'completed').length;

    const onSelectItem = (type: PolicyType | FormType, isPolicy: boolean) => {
        const item = isPolicy ? POLICIES[type as PolicyType] : FORMS[type as FormType];
        if (item) {
            onSelectDocument(item);
        }
    };

    const onViewDocument = (type: PolicyType | FormType) => {
        const doc = generatedDocuments.find(d => d.type === type);
        if (doc) {
            setDocumentToView(doc);
            const item = doc.kind === 'policy' ? POLICIES[doc.type as PolicyType] : FORMS[doc.type as FormType];
            setSelectedItem(item);
            navigateTo('generator');
        }
    };

    const renderRoadmapItem = (item: RoadmapItem) => {
        const isPolicy = item.type === 'policy';
        const isCompleted = item.status === 'completed';

        return (
            <div key={item.id} className={`flex flex-col sm:flex-row items-start justify-between p-4 border rounded-lg shadow-sm transition-colors ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-primary/50'}`}>
                <div className="flex-1 mb-4 sm:mb-0">
                    <div className="flex items-center mb-1">
                        {isPolicy ? <MasterPolicyIcon className="w-4 h-4 text-gray-400 mr-2" /> : <FormsIcon className="w-4 h-4 text-gray-400 mr-2" />}
                        <h4 className={`font-bold text-lg ${isCompleted ? 'text-green-800' : 'text-secondary'}`}>{item.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{item.reason}</p>
                </div>

                <div className="flex-shrink-0 sm:ml-4 self-start sm:self-center">
                    {isCompleted ? (
                        <button
                            onClick={() => onViewDocument(item.id)}
                            className="flex items-center px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 border border-green-200 rounded-md hover:bg-green-200 transition-colors"
                        >
                            <CheckIcon className="w-4 h-4 mr-1.5" />
                            Done
                        </button>
                    ) : (
                        <button
                            onClick={() => onSelectItem(item.id, isPolicy)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-opacity-90 shadow-sm whitespace-nowrap"
                        >
                            Generate Now
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Phase 3: Header Section */}
            <div className="flex justify-between items-end border-b border-secondary/5 pb-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/80">Compliance Intelligence</p>
                    <h1 className="text-4xl font-serif italic text-secondary leading-tight">
                        Optimized Audit Checklist
                    </h1>
                    <p className="text-secondary/40 text-sm max-w-xl">
                        Tailored registry for <strong className="text-secondary/60">{userProfile.companyName}</strong>. Your prioritized roadmap to full regulatory immunity.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-1.5 bg-secondary/5 px-3 py-1.5 rounded-full border border-secondary/5">
                        <span className="text-[10px] font-black text-secondary">{completedCount}</span>
                        <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-widest">/ {roadmap.length} Secured</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center bg-white/40 backdrop-blur-xl p-4 rounded-3xl border border-white/40 shadow-xl shadow-secondary/5">
                <div className="flex space-x-1 p-1 bg-secondary/5 rounded-2xl">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-secondary text-white shadow-lg' : 'text-secondary/40 hover:text-secondary'}`}
                    >
                        All Requirements
                    </button>
                    <button
                        onClick={() => setFilter('missing')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'missing' ? 'bg-red-500 text-white shadow-lg' : 'text-secondary/40 hover:text-secondary'}`}
                    >
                        Missing Only
                    </button>
                </div>
                <div className="flex items-center gap-3 pr-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary/30">Registry Sync: Active</span>
                </div>
            </div>

            <div className="space-y-16">
                {/* Phase 1 */}
                {phase1Items.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500 font-serif italic text-xl">1</div>
                            <div>
                                <h3 className="text-lg font-serif italic text-secondary">Statutory Fundamentals</h3>
                                <p className="text-[10px] uppercase font-black tracking-widest text-red-500/60">High Priority / Inspector Ready</p>
                            </div>
                        </div>
                        <div className="grid gap-4 ml-18 pl-2">
                            {phase1Items.map(item => (
                                <div key={item.id} className="group relative bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-secondary/5 shadow-premium hover:shadow-2xl hover:border-primary/20 transition-all">
                                    <div className="flex justify-between items-center gap-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-secondary text-lg leading-none">{item.title}</h4>
                                                {item.status === 'completed' && <CheckIcon className="w-4 h-4 text-emerald-500" />}
                                            </div>
                                            <p className="text-secondary/40 text-xs">{item.reason}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {item.status === 'completed' ? (
                                                <button
                                                    onClick={() => onViewDocument(item.id)}
                                                    className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-inner"
                                                >
                                                    View Entry
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onSelectItem(item.id, item.type === 'policy')}
                                                    className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all border border-primary/20 hover:-translate-y-0.5"
                                                >
                                                    Secure Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Phase 2 */}
                {phase2Items.length > 0 && (
                    <section className="space-y-6 border-t border-secondary/5 pt-16">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent font-serif italic text-xl">2</div>
                            <div>
                                <h3 className="text-lg font-serif italic text-secondary">Liability Defense</h3>
                                <p className="text-[10px] uppercase font-black tracking-widest text-accent/60">Risk Mitigation / CCMA Shield</p>
                            </div>
                        </div>
                        <div className="grid gap-4 ml-18 pl-2">
                            {phase2Items.map(item => (
                                <div key={item.id} className="group relative bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-secondary/5 shadow-premium hover:shadow-2xl hover:border-primary/20 transition-all">
                                    <div className="flex justify-between items-center gap-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-secondary text-lg leading-none">{item.title}</h4>
                                                {item.status === 'completed' && <CheckIcon className="w-4 h-4 text-emerald-500" />}
                                            </div>
                                            <p className="text-secondary/40 text-xs">{item.reason}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {item.status === 'completed' ? (
                                                <button
                                                    onClick={() => onViewDocument(item.id)}
                                                    className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-inner"
                                                >
                                                    View Entry
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onSelectItem(item.id, item.type === 'policy')}
                                                    className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all border border-primary/20 hover:-translate-y-0.5"
                                                >
                                                    Secure Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Phase 3 */}
                {phase3Items.length > 0 && (
                    <section className="space-y-6 border-t border-secondary/5 pt-16">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-serif italic text-xl">3</div>
                            <div>
                                <h3 className="text-lg font-serif italic text-secondary">Governance & Culture</h3>
                                <p className="text-[10px] uppercase font-black tracking-widest text-primary/60">Best Practice / Efficiency</p>
                            </div>
                        </div>
                        <div className="grid gap-4 ml-18 pl-2">
                            {phase3Items.map(item => (
                                <div key={item.id} className="group relative bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-secondary/5 shadow-premium hover:shadow-2xl hover:border-primary/20 transition-all">
                                    <div className="flex justify-between items-center gap-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-secondary text-lg leading-none">{item.title}</h4>
                                                {item.status === 'completed' && <CheckIcon className="w-4 h-4 text-emerald-500" />}
                                            </div>
                                            <p className="text-secondary/40 text-xs">{item.reason}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {item.status === 'completed' ? (
                                                <button
                                                    onClick={() => onViewDocument(item.id)}
                                                    className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-inner"
                                                >
                                                    View Entry
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onSelectItem(item.id, item.type === 'policy')}
                                                    className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all border border-primary/20 hover:-translate-y-0.5"
                                                >
                                                    Secure Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {phase1Items.length === 0 && phase2Items.length === 0 && phase3Items.length === 0 && (
                    <div className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-2xl">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheckIcon className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-serif italic text-secondary">Integrity Verified</h3>
                        <p className="text-secondary/40 text-sm mt-2 max-w-sm mx-auto">Your registry is fully secured. All statutory and risk items have been addressed.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplianceChecklist;