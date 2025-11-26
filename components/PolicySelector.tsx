
import React, { useState, useMemo } from 'react';
import { POLICY_CATEGORIES, INDUSTRIES, FORMS, POLICIES } from '../constants';
import type { Policy, Form, PolicyType, FormType } from '../types';
import { SearchIcon, HelpIcon, MasterPolicyIcon, FormsIcon, WordIcon, ExcelIcon } from './Icons';
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
    'absent': ['attendance-punctuality', 'leave', 'abscondment-policy' as any], // Handle potential missing types gracefully
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
      className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-200 flex flex-col focus:outline-none focus:ring-2 focus:ring-primary relative overflow-hidden ${isForm ? 'border-l-4 border-l-accent' : ''}`}
      aria-label={`Select ${item.kind}: ${item.title}`}
    >
      {isForm && (
          <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-2 py-1 rounded-bl-md uppercase tracking-wide">
              Form
          </div>
      )}
      <div className="flex-shrink-0">
        <item.icon className={`w-10 h-10 mb-4 ${isForm ? 'text-accent' : 'text-primary'}`} />
        <h3 className="text-xl font-bold text-secondary mb-2">{item.title}</h3>
      </div>
      <p className="text-gray-600 flex-grow text-sm">{item.description}</p>
      {showPrice && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-lg font-bold text-primary">R{(item.price / 100).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};


const PolicySelector: React.FC<PolicySelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scenarioInput, setScenarioInput] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const { user } = useAuthContext();
  const showPrice = user?.plan !== 'pro';

  // Scenario Matching Logic
  const scenarioResults = useMemo(() => {
      if (!scenarioInput.trim()) return [];
      
      const inputLower = scenarioInput.toLowerCase();
      const matchedTypes = new Set<string>();

      // Check input against keywords map
      Object.entries(SCENARIO_MAP).forEach(([keyword, types]) => {
          if (inputLower.includes(keyword)) {
              types.forEach(t => matchedTypes.add(t));
          }
      });

      // Fetch the actual Policy/Form objects
      const results: (Policy | Form)[] = [];
      matchedTypes.forEach(typeId => {
          if (POLICIES[typeId as PolicyType]) results.push(POLICIES[typeId as PolicyType]);
          else if (FORMS[typeId as FormType]) results.push(FORMS[typeId as FormType]);
      });

      return results;
  }, [scenarioInput]);

  // Standard Search Logic
  const categorizedAndFiltered = useMemo(() => {
    if (scenarioInput.trim()) return []; // If using scenario search, hide standard lists

    return POLICY_CATEGORIES.map(category => {
        const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
        const filteredItems = category.items.filter(policy => {
        const policyText = `${policy.title.toLowerCase()} ${policy.description.toLowerCase()}`;
        const searchMatch = searchWords.every(word => policyText.includes(word));

        const industryMatch =
            selectedIndustry === 'All' ||
            !policy.industries || // Universal policies (no industry array) are always included
            policy.industries.includes(selectedIndustry);

        return searchMatch && industryMatch;
        });
        return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);
  }, [searchTerm, selectedIndustry, scenarioInput]);

  const hasStandardResults = categorizedAndFiltered.length > 0;

  return (
    <div>
        {/* Scenario / Problem Solver Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-10 shadow-sm">
            <div className="flex items-start space-x-4">
                <div className="bg-white p-2 rounded-full shadow-sm flex-shrink-0">
                    <HelpIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-secondary mb-1">Not sure what you need?</h3>
                    <p className="text-gray-600 text-sm mb-4">Describe your situation, and we'll recommend the right documents.</p>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="e.g., 'Employee stole money', 'Someone is always late', 'Hiring a new manager'..."
                            value={scenarioInput}
                            onChange={(e) => setScenarioInput(e.target.value)}
                            className="w-full p-3 pl-4 pr-12 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                        />
                        {scenarioInput && (
                            <button 
                                onClick={() => setScenarioInput('')}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Scenario Results */}
            {scenarioInput.trim() && (
                <div className="mt-6 animate-fade-in">
                    <h4 className="font-semibold text-secondary mb-4 flex items-center">
                        Recommended Documents
                        <span className="ml-2 text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                            {scenarioResults.length} found
                        </span>
                    </h4>
                    {scenarioResults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <p className="text-sm text-gray-500 italic">
                            No specific recommendations found for this phrasing. Try using simpler keywords like "theft", "sick", or "hiring".
                        </p>
                    )}
                </div>
            )}
        </div>

        {!scenarioInput.trim() && (
            <>
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm font-semibold text-gray-600">Filter by Industry:</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedIndustry('All')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                        selectedIndustry === 'All'
                            ? 'bg-primary text-white shadow'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        All Policies
                    </button>
                    {INDUSTRIES.map((industry) => (
                        <button
                        key={industry}
                        onClick={() => setSelectedIndustry(industry)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                            selectedIndustry === industry
                            ? 'bg-primary text-white shadow'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                        >
                        {industry}
                        </button>
                    ))}
                    </div>
                </div>

                <div className="relative mb-12 max-w-lg mx-auto">
                    <input
                    type="text"
                    placeholder="Or search by policy name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-primary focus:border-primary"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {hasStandardResults ? (
                    <div className="space-y-12">
                    {categorizedAndFiltered.map((category) => (
                        <div key={category.title}>
                        <h2 className="text-2xl font-bold text-secondary mb-6 border-b-2 border-primary pb-2">{category.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <p className="text-gray-600 mt-8 text-center">No policies found for your selected criteria.</p>
                )}
            </>
        )}
    </div>
  );
};

export default PolicySelector;
