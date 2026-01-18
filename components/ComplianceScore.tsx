
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
        const newStats = calculateComplianceScore(profile, documents);
        setStats(newStats);
    }, [profile, documents]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimateScore(stats.score);
        }, 100);
        return () => clearTimeout(timeout);
    }, [stats.score]);

    const getColor = (score: number) => {
        if (score < 40) return 'text-rose-600 stroke-rose-600';
        if (score < 80) return 'text-amber-500 stroke-amber-500 transition-colors';
        return 'text-emerald-600 stroke-emerald-600';
    };

    if (!profile.companyName) return null;

    return (
        <div className="bg-white rounded-3xl p-6 mb-2 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle
                                className="text-gray-100"
                                cx="18" cy="18" r="15.9155"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.5"
                            />
                            <circle
                                className={`${getColor(animateScore).split(' ')[1]} transition-all duration-1000 ease-out`}
                                cx="18" cy="18" r="15.9155"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeDasharray={`${animateScore}, 100`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className={`text-2xl font-black tracking-tight ${getColor(animateScore).split(' ')[0]}`}>{animateScore}%</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-secondary flex items-center mb-1">
                            Compliance Health
                            {stats.score === 100 && <ShieldCheckIcon className="w-5 h-5 text-emerald-600 ml-2" />}
                        </h3>
                        <p className="text-sm text-gray-400 font-medium">
                            {stats.score < 40 ? "Critical legal gaps detected." :
                                stats.score < 80 ? "Building legal resilience..." :
                                    "Your business is legally fortified."}
                        </p>
                    </div>
                </div>

                <div className="flex-1 w-full bg-gray-50/80 rounded-2xl p-5 border border-gray-100/50">
                    {stats.nextRecommendation ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority Recommendation</p>
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Recommended</span>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="max-w-md">
                                    <p className="font-bold text-secondary text-base leading-tight mb-1">{stats.nextRecommendation.title}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{stats.nextRecommendation.reason}</p>
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
                                    className="group w-full sm:w-auto text-xs font-bold text-white bg-primary px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 whitespace-nowrap"
                                >
                                    Secure Now <span className="opacity-70 font-normal">+{Math.round(100 / stats.totalMandatory)}%</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 py-2">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0 animate-pulse">
                                <ShieldCheckIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-secondary text-base uppercase tracking-tight">Full Compliance Achieved</p>
                                <p className="text-xs text-gray-500">Your core human resources infrastructure is fully compliant with 2026 regulations.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplianceScore;
