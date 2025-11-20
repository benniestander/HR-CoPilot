
import React, { useState } from 'react';
import { POLICY_CATEGORIES, INDUSTRIES } from '../constants';
import type { Policy } from '../types';
import { SearchIcon } from './Icons';
import { useAuthContext } from '../contexts/AuthContext';

interface PolicySelectorProps {
  onSelectPolicy: (policy: Policy) => void;
}

const PolicyCard: React.FC<{ policy: Policy; onSelect: () => void; showPrice: boolean }> = ({ policy, onSelect, showPrice }) => (
  <div
    onClick={onSelect}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    role="button"
    tabIndex={0}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-200 flex flex-col focus:outline-none focus:ring-2 focus:ring-primary"
    aria-label={`Select policy: ${policy.title}`}
  >
    <div className="flex-shrink-0">
      <policy.icon className="w-10 h-10 text-primary mb-4" />
      <h3 className="text-xl font-bold text-secondary mb-2">{policy.title}</h3>
    </div>
    <p className="text-gray-600 flex-grow">{policy.description}</p>
    {showPrice && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-lg font-bold text-primary">R{(policy.price / 100).toFixed(2)}</p>
      </div>
    )}
  </div>
);


const PolicySelector: React.FC<PolicySelectorProps> = ({ onSelectPolicy }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const { user } = useAuthContext();
  const showPrice = user?.plan !== 'pro';

  const categorizedAndFiltered = POLICY_CATEGORIES.map(category => {
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

  const hasResults = categorizedAndFiltered.length > 0;

  return (
    <div>
        <div className="mb-8">
            <p className="text-sm font-semibold text-gray-600 mb-3 text-center">Filter by Industry:</p>
            <div className="flex justify-center items-center gap-2 flex-wrap">
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
            placeholder="Search for a policy (e.g., 'leave', 'safety')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-primary focus:border-primary"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
        </div>

      {hasResults ? (
        <div className="space-y-12">
          {categorizedAndFiltered.map((category) => (
            <div key={category.title}>
              <h2 className="text-2xl font-bold text-secondary mb-6 border-b-2 border-primary pb-2">{category.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((policy) => (
                  <PolicyCard
                    key={policy.type}
                    policy={policy}
                    onSelect={() => onSelectPolicy(policy)}
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
    </div>
  );
};

export default PolicySelector;
