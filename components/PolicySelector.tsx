
import React, { useState, useMemo } from 'react';
import { POLICY_CATEGORIES } from '../constants';
import type { Policy, Form } from '../types';
import { SearchIcon } from './Icons';
import { useAuthContext } from '../contexts/AuthContext';
import { useDataContext } from '../contexts/DataContext';

interface PolicySelectorProps {
  onSelect: (item: Policy | Form) => void;
}

const PolicyCard: React.FC<{ item: Policy | Form; onSelect: () => void; showPrice: boolean; price: number }> = ({ item, onSelect, showPrice, price }) => {
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
          <p className="text-base font-bold text-primary">R{(price / 100).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};


const PolicySelector: React.FC<PolicySelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthContext();
  const { getDocPrice } = useDataContext(); // Use pricing helper
  const showPrice = user?.plan !== 'pro';

  // Standard Search Logic
  const categorizedAndFiltered = useMemo(() => {
    return POLICY_CATEGORIES.map(category => {
        const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
        const filteredItems = category.items.filter(policy => {
            const policyText = `${policy.title.toLowerCase()} ${policy.description.toLowerCase()}`;
            const searchMatch = searchWords.every(word => policyText.includes(word));
            return searchMatch;
        });
        return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);
  }, [searchTerm]);

  const hasResults = categorizedAndFiltered.length > 0;

  return (
    <div className="space-y-8">
        <div className="animate-fade-in">
            {/* Simple Search Input */}
            <div className="max-w-lg mx-auto relative mb-12">
                <input
                    type="text"
                    placeholder="Search by document name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-700"
                />
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Library Grid */}
            {hasResults ? (
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
                                price={getDocPrice(policy)}
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
    </div>
  );
};

export default PolicySelector;
