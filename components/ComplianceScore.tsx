
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
    setStats(calculateComplianceScore(profile, documents));
  }, [profile, documents]);

  useEffect(() => {
    // Simple animation for the score number
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

  if (!profile.companyName) return null; // Don't show if profile isn't set up

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8 relative overflow-hidden">
        {/* Background Decoration */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-10 -mt-10 ${getBgColor(stats.score).replace('100', '500')}`}></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            
            {/* Score Section */}
            <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-gray-200"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className={`${getColor(animateScore).split(' ')[0]} transition-all duration-1000 ease-out`}
                            strokeDasharray={`${animateScore}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className={`text-xl font-bold ${getColor(animateScore).split(' ')[0]}`}>{animateScore}%</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-secondary flex items-center">
                        Compliance Score
                        {stats.score === 100 && <ShieldCheckIcon className="w-5 h-5 text-green-600 ml-2" />}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {stats.score < 40 ? "Your business is at risk." : 
                         stats.score < 80 ? "Good progress, but gaps remain." : 
                         "Excellent! You are well protected."}
                    </p>
                </div>
            </div>

            {/* Recommendation Section */}
            <div className="flex-1 w-full md:w-auto bg-gray-50 rounded-md p-4 border border-gray-200">
                {stats.nextRecommendation ? (
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Recommended Next Step</p>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <p className="font-semibold text-secondary text-sm">{stats.nextRecommendation.title}</p>
                                <p className="text-xs text-gray-500">{stats.nextRecommendation.reason}</p>
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
                                className="text-xs font-bold text-white bg-primary px-3 py-2 rounded-md hover:bg-opacity-90 whitespace-nowrap shadow-sm"
                            >
                                Generate Now (+{Math.round(100 / stats.totalMandatory)}%)
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center text-green-700">
                        <CheckIcon className="w-5 h-5 mr-2" />
                        <div>
                            <p className="font-semibold text-sm">All mandatory documents generated!</p>
                            <p className="text-xs text-green-600">Keep checking back for updates.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ComplianceScore;
