
import React, { useState, useMemo } from 'react';
import { POLICY_CATEGORIES, FORMS, POLICIES } from '../constants';
import type { Policy, Form, PolicyType, FormType } from '../types';
import { SearchIcon, TipIcon } from './Icons';
import { useAuthContext } from '../contexts/AuthContext';

interface PolicySelectorProps {
  onSelect: (item: Policy | Form) => void;
}

// Mapping keywords to Document Types (Policies and Forms)
const SCENARIO_MAP: Record<string, (PolicyType | FormType)[]> = {
    'theft': ['disciplinary', 'suspension-notice', 'disciplinary-hearing-notice', 'incident-report'],
    'steal': ['disciplinary', 'suspension-notice', 'disciplinary-hearing-notice'],
    'fraud': ['disciplinary', 'suspension-notice', 'disciplinary-hearing-notice', 'whistleblower'],
    'dishonest': ['disciplinary', 'code-of-ethics'],
    
    'late': ['attendance-punctuality', 'verbal-warning', 'written-warning', 'disciplinary'],
    'absent': ['attendance-punctuality', 'leave'],
    'punctual': ['attendance-punctuality'],
    
    'sick': ['leave', 'incapacity-inquiry-ill-health-notice', 'medical-report-template'],
    'ill': ['leave', 'incapacity-inquiry-ill-health-notice'],
    'injury': ['health-and-safety', 'coida', 'incident-report', 'incident-investigation-report'],
    'accident': ['health-and-safety', 'coida', 'incident-report'],

    'performance': ['performance-management', 'poor-performance-inquiry-notice', 'poor-performance-meeting-minutes', 'performance-review'],
    'lazy': ['performance-management', 'poor-performance-inquiry-notice', 'disciplinary'],
    'target': ['performance-management', 'performance-review'],
    
    'fire': ['termination-of-employment', 'disciplinary-hearing-notice', 'termination-letter', 'certificate-of-service'],
    'dismiss': ['termination-of-employment', 'disciplinary-hearing-notice', 'termination-letter'],
    'retrench': ['retrenchment', 'retrenchment-notice', 'consultation-meeting-notice', 'voluntary-retrenchment-application'],
    'layoff': ['retrenchment', 'retrenchment-notice'],
    
    'resign': ['resignation', 'resignation-acceptance-letter', 'exit-interview', 'certificate-of-service'],
    'quit': ['resignation', 'resignation-acceptance-letter', 'exit-interview'],
    
    'hiring': ['recruitment-selection', 'employment-contract', 'job-application', 'interview-guide', 'onboarding-checklist'],
    'new employee': ['onboarding-checklist', 'employment-contract', 'employee-details', 'employee-handbook'],
    'recruit': ['recruitment-selection', 'job-advertisement'],
    
    'remote': ['remote-hybrid-work', 'byod', 'it-cybersecurity'],
    'wfh': ['remote-hybrid-work'],
    
    'harassment': ['anti-harassment-discrimination', 'sexual-harassment', 'grievance', 'grievance-form'],
    'bully': ['anti-bullying', 'grievance', 'grievance-form'],
    'discrimination': ['anti-harassment-discrimination', 'eeo-diversity', 'employment-equity'],
};

const PolicyCard: React.FC<{ item: Policy | Form; onSelect: () => void; showPrice: boolean }> = ({ item, onSelect, showPrice }) => {
  const isForm = item.kind === 'form';
  return (
    <div
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      role="button"
      tabIndex={0}
      className={`bg-white p-5 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-200 flex flex-col focus:outline-none focus:ring-2 focus:ring-primary h-full group ${isForm ? 'border-l-4 border-l-accent' : ''}`}
      aria-label={`Select ${item.kind}: ${item.title}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${isForm ? 'bg-accent/10' : 'bg-primary/10'} group-hover:scale-110 transition-transform duration-300`}>
            <item.icon className={`w-8 h-8 ${isForm ? 'text-accent' : 'text-primary'}`} />
        </div>
        {isForm && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-1 rounded-full">
                Form
            </div>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-secondary mb-2 leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
      <p className="text-gray-500 flex-grow text-sm line-clamp-3 mb-4">{item.description}</p>
      
      {showPrice && (
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-400 font-medium">Pay-As-You-Go</span>
          <p className="text-base font-bold text-primary">R{(item.price / 100).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};


const PolicySelector: React.FC<PolicySelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scenarioInput, setScenarioInput] = useState('');
  const { user } = useAuthContext();
  const showPrice = user?.plan !== 'pro';

  // Scenario Matching Logic
  const scenarioResults = useMemo(() => {
      if (!scenarioInput.trim()) return [];
      
      const inputLower = scenarioInput.toLowerCase();
      const matchedTypes = new Set<string>();

      Object.entries(SCENARIO_MAP).forEach(([keyword, types]) => {
          if (inputLower.includes(keyword)) {
              types.forEach(t => matchedTypes.add(t));
          }
      });

      const results: (Policy | Form)[] = [];
      matchedTypes.forEach(typeId => {
          if (POLICIES[typeId as PolicyType]) results.push(POLICIES[typeId as PolicyType]);
          else if (FORMS[typeId as FormType]) results.push(FORMS[typeId as FormType]);
      });

      return results;
  }, [scenarioInput]);

  // Standard Search Logic
  const categorizedAndFiltered = useMemo(() => {
    if (scenarioInput.trim()) return [];

    return POLICY_CATEGORIES.map(category => {
        const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
        const filteredItems = category.items.filter(policy => {
            const policyText = `${policy.title.toLowerCase()} ${policy.description.toLowerCase()}`;
            const searchMatch = searchWords.every(word => policyText.includes(word));
            return searchMatch;
        });
        return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);
  }, [searchTerm, scenarioInput]);

  const hasStandardResults = categorizedAndFiltered.length > 0;

  return (
    <div className="space-y-8">
        
        {/* --- SECTION 1: AI ASSISTANT (HERO) --- */}
        <div className="bg-gradient-to-r from-secondary to-[#1a4b85] rounded-2xl p-8 text-center text-white shadow-md relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary opacity-10 rounded-full -ml-10 -mb-10"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-2 flex items-center justify-center">
                    <TipIcon className="w-6 h-6 mr-2 text-accent" />
                    Not sure what you need?
                </h3>
                <p className="text-blue-100 mb-6 text-sm sm:text-base">
                    Describe your HR situation (e.g. "Employee stole money", "Maternity leave"), and our AI will recommend the right documents.
                </p>
                
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Describe your issue..."
                        value={scenarioInput}
                        onChange={(e) => setScenarioInput(e.target.value)}
                        className="w-full p-4 pl-6 pr-12 text-gray-800 rounded-full shadow-lg border-2 border-transparent focus:border-accent focus:ring-0 transition-all placeholder-gray-400"
                    />
                    {scenarioInput ? (
                        <button 
                            onClick={() => setScenarioInput('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                            <span className="text-xs font-bold uppercase">Clear</span>
                        </button>
                    ) : (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-full">
                            <SearchIcon className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Results for AI Search */}
        {scenarioInput.trim() && (
            <div className="animate-fade-in bg-blue-50 border border-blue-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-secondary flex items-center">
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-md mr-2">AI Recommended</span>
                        Results for "{scenarioInput}"
                    </h4>
                    <span className="text-xs text-gray-500">{scenarioResults.length} documents found</span>
                </div>
                
                {scenarioResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scenarioResults.map((item) => (
                            <PolicyCard 
                                key={item.type} 
                                item={item} 
                                onSelect={() => onSelect(item)} 
                                showPrice={showPrice} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 italic">No specific recommendations found. Try simpler keywords like "hiring", "leave", or "safety".</p>
                    </div>
                )}
            </div>
        )}

        {/* --- SECTION 2: LIBRARY (BROWSE) --- */}
        {!scenarioInput.trim() && (
            <div className="animate-fade-in">
                {/* Simple Search Input */}
                <div className="max-w-lg mx-auto relative mb-12">
                    <input
                        type="text"
                        placeholder="Or search by document name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-700"
                    />
                    <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Library Grid */}
                {hasStandardResults ? (
                    <div className="space-y-12">
                    {categorizedAndFiltered.map((category) => (
                        <div key={category.title}>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                {category.title}
                                <span className="ml-3 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{category.items.length}</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {category.items.map((policy) => (
                                <PolicyCard
                                    key={policy.type}
                                    item={policy}
                                    onSelect={() => onSelect(policy)}
                                    showPrice={showPrice}
                                />
                                ))}
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No documents found.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-4 text-primary text-sm hover:underline">Clear search</button>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default PolicySelector;
