
import React, { useState } from 'react';
import { FORMS } from '../constants';
import type { Form } from '../types';
import { SearchIcon, WordIcon, ExcelIcon } from './Icons';

interface FormSelectorProps {
  onSelectForm: (form: Form) => void;
}

const FormCard: React.FC<{ form: Form; onSelect: () => void; }> = ({ form, onSelect }) => {
  const isExcel = form.outputFormat === 'excel';
  
  return (
    <div
      onClick={onSelect}
      className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-200 flex flex-col"
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
    </div>
  );
};


const FormSelector: React.FC<FormSelectorProps> = ({ onSelectForm }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredForms = Object.values(FORMS).filter(form => 
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {filteredForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredForms.map((form) => (
            <FormCard
              key={form.type}
              form={form}
              onSelect={() => onSelectForm(form)}
            />
          ))}
        </div>
      ) : (
         <p className="text-gray-600 mt-8 text-center">No forms found for your search term.</p>
      )}
    </div>
  );
};

export default FormSelector;
