import React, { useState } from 'react';
import type { Policy, Form, CompanyProfile } from '../types';
import { INDUSTRIES } from '../constants';

interface CompanyProfileSetupProps {
  item: Policy | Form;
  onProfileSubmit: (profile: CompanyProfile) => void;
  onBack: () => void;
}

const CompanyProfileSetup: React.FC<CompanyProfileSetupProps> = ({ item, onProfileSubmit, onBack }) => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');

  const isPolicy = item.kind === 'policy';
  const isContinueDisabled = !companyName || (isPolicy && !industry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isContinueDisabled) return;
    onProfileSubmit({ companyName, industry });
  };

  return (
    <div className="max-w-2xl mx-auto">
       <button
        onClick={onBack}
        className="mb-6 text-primary font-semibold hover:underline flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Selection
      </button>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
          <item.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-secondary">You've selected the {item.title}</h2>
          <p className="text-gray-600 mt-2">
            Let's start by gathering some basic company details.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              What is your Company's Name?
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., ABC (Pty) Ltd"
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>

          {isPolicy && (
            <div className="space-y-2">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Which industry best describes your business?
              </label>
              <select
                id="industry"
                name="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="" disabled>Choose an industry...</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
               <p className="text-xs text-gray-500 mt-1">This helps tailor the policy to your specific sector.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isContinueDisabled}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            Continue to Questions
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfileSetup;
