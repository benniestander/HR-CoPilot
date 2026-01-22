
import React, { useEffect, useState } from 'react';
import { calculateComplianceScore } from '../utils/compliance';
import type { CompanyProfile, GeneratedDocument, Policy, Form } from '../types';
import { ShieldCheckIcon, CheckIcon, LoadingIcon } from './Icons';
import { POLICIES, FORMS } from '../constants';

interface ComplianceScoreProps {
    profile: CompanyProfile;
    documents: GeneratedDocument[];
    onGenerateSuggestion: (item: Policy | Form) => void;
}

const ComplianceScore: React.FC<ComplianceScoreProps> = ({ profile, documents, onGenerateSuggestion }) => {
    const [stats, setStats] = useState(calculateComplianceScore(profile, documents));
    const [animateScore, setAnimateScore] = useState(0);

    useEffect(() => {
        // Re-calculate whenever documents array changes (including length or content updates)
        const newStats = calculateComplianceScore(profile, documents);
        setStats(newStats);
    }, [profile, documents]); // Documents is now a reactive dependency

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimateScore(stats.score);
        }, 100);
        return () => clearTimeout(timeout);
    }, [stats.score]);

    const getColor = (score: number) => {
        if (score < 40) return 'text-red-600 bg-red-600';
        if (score < 80) return 'text-orange-500 bg-orange-500';
        return 'text-green-600 bg-green-600';
    };

    const getBgColor = (score: number) => {
        if (score < 40) return 'bg-red-100';
        if (score < 80) return 'bg-orange-100';
        return 'bg-green-100';
    };

    if (!profile.companyName) return null;

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-secondary/5 rounded-[3rem] shadow-sm p-8 mb-12 relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.03] blur-[60px] -mr-16 -mt-16 transition-colors duration-1000 ${getBgColor(stats.score).replace('100', '500')}`}></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-secondary/5"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            />
                            <path
                                className={`${getColor(animateScore).split(' ')[0]} transition-all duration-1000 ease-out`}
                                strokeDasharray={`${animateScore}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className={`text-2xl font-medium font-serif italic ${getColor(animateScore).split(' ')[0]}`}>{animateScore}%</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-medium text-secondary flex items-center font-serif italic group-hover:text-primary transition-colors">
                            Registry Health
                            {stats.score === 100 && <ShieldCheckIcon className="w-6 h-6 text-emerald-600 ml-2" />}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 mt-1">
                            {stats.score < 40 ? "Action Required: Critical Gaps" :
                                stats.score < 80 ? "Ongoing: Standard Vigilance" :
                                    "SECURE: Enterprise Compliance"}
                        </p>
                    </div>
                </div>

                <div className="flex-1 w-full md:w-auto bg-secondary/[0.02] rounded-[2rem] p-6 border border-secondary/5 backdrop-blur-sm">
                    {stats.nextRecommendation ? (
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em]">Prioritized Requirement</p>
                                <p className="font-medium text-secondary text-sm font-serif italic">{stats.nextRecommendation.title}</p>
                                <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-tight">{stats.nextRecommendation.reason}</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (stats.nextRecommendation) {
                                        const item = stats.nextRecommendation.isForm
                                            ? FORMS[stats.nextRecommendation.type as any]
                                            : POLICIES[stats.nextRecommendation.type as any];
                                        if (item) onGenerateSuggestion(item);
                                    }
                                }}
                                className="text-[10px] font-black text-white bg-primary px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all uppercase tracking-[0.2em] whitespace-nowrap active:scale-95"
                            >
                                Fulfill now (+{Math.round(100 / stats.totalMandatory)}%)
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center text-emerald-700">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mr-4">
                                <CheckIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-medium text-sm font-serif italic">Enterprise Protection Complete</p>
                                <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em]">All mandatory filings verified.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplianceScore;
