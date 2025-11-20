
import React, { useState } from 'react';
import { FORM_CATEGORIES } from '../constants';
import type { Form } from '../types';
import { SearchIcon, WordIcon, ExcelIcon } from './Icons';
import { useAuthContext } from '../contexts/AuthContext';

interface FormSelectorProps {
  onSelectForm: (form: Form) => void;
}

const FormCard: React.FC<{ form: Form; onSelect: () => void; showPrice: boolean }> = ({ form, onSelect, showPrice }) => {
  const isExcel = form.outputFormat === 'excel';
  
  return (
    <div
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      role="button"
      tabIndex={0}
      className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-200 flex flex-col focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={`Select form: ${form.title}`}
    >
      {form.outputFormat && (
        <div
          className={`absolute top-3 right-3 p-1.5 rounded-full ${
            isExcel ? 'bg-green-100' : 'bg-blue-100'
          }`}
          title={`Recommended format: ${isExcel ? 'Excel' : 'Word'}`}
        >
          {isExcel 
            ? <ExcelIcon className="w-5 h-5 text-green-800" /> 
            : <WordIcon className="w-5 h-5 text-blue-800" />
          }
        </div>
      )}
      <div className="flex-shrink-0">
        <form.icon className="w-10 h-10 text-primary mb-4" />
        <h3 className="text-xl font-bold text-secondary mb-2 pr-8">{form.title}</h3>
      </div>
      <p className="text-gray-600 flex-grow">{form.description}</p>
       {showPrice && (
         <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-lg font-bold text-primary">R{(form.price / 100).toFixed(2)}</p>
          </div>
       )}
    </div>
  );
};


const FormSelector: React.FC<FormSelectorProps> = ({ onSelectForm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthContext();
  const showPrice = user?.plan !== 'pro';

  const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);

  const categorizedAndFiltered = FORM_CATEGORIES.map(category => {
    const filteredItems = category.items.filter(form => {
        const formText = `${form.title.toLowerCase()} ${form.description.toLowerCase()}`;
        return searchWords.every(word => formText.includes(word));
    });
    return { ...category, items: filteredItems };
  }).filter(category => category.items.length > 0);

  const hasResults = categorizedAndFiltered.length > 0;

  return (
    <div>
      <div className="relative mb-12 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search for a form (e.g., 'leave', 'application')"
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
                {category.items.map((form) => (
                  <FormCard
                    key={form.type}
                    form={form}
                    onSelect={() => onSelectForm(form)}
                    showPrice={showPrice}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
         <p className="text-gray-600 mt-8 text-center">No forms found for your search term.</p>
      )}
    </div>
  );
};

export default FormSelector;
