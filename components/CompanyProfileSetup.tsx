import React, { useState } from 'react';
import type { Policy, Form, CompanyProfile } from '../types';
import { INDUSTRIES } from '../constants';
import { InfoIcon } from './Icons';

interface CompanyProfileSetupProps {
  item: Policy | Form;
  initialProfile: CompanyProfile;
  onProfileSubmit: (profile: CompanyProfile) => void;
  onBack: () => void;
}

const LabelWithTooltip: React.FC<{ htmlFor: string; label: string; tooltip: string; }> = ({ htmlFor, label, tooltip }) => (
    <div className="flex items-center">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative flex items-center group ml-2">
            <InfoIcon className="w-5 h-5 text-gray-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-3 text-xs text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible pointer-events-none z-10">
                {tooltip}
                <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
            </div>
        </div>
    </div>
);


const CompanyProfileSetup: React.FC<CompanyProfileSetupProps> = ({ item, initialProfile, onProfileSubmit, onBack }) => {
  const [companyName, setCompanyName] = useState(initialProfile.companyName || '');
  const [industry, setIndustry] = useState(initialProfile.industry || '');
  const [address, setAddress] = useState(initialProfile.address || '');
  const [companyUrl, setCompanyUrl] = useState(initialProfile.companyUrl || '');
  const [summary, setSummary] = useState(initialProfile.summary || '');
  const [companySize, setCompanySize] = useState(initialProfile.companySize || '');

  const isPolicy = item.kind === 'policy';
  const isContinueDisabled = !companyName || (isPolicy && !industry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isContinueDisabled) return;
    const newProfile: CompanyProfile = {
      ...initialProfile,
      companyName,
      industry,
      address,
      companyUrl,
      summary,
      companySize,
    };
    onProfileSubmit(newProfile);
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
        Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
          <item.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-secondary">Generating: {item.title}</h2>
          <p className="text-gray-600 mt-2">
            First, let's gather some basic company details.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
               <LabelWithTooltip
                    htmlFor="companyName"
                    label="Company's Legal Name"
                    tooltip="This is the most important field. Your company's legal name will appear on all official documents."
                />
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
                <LabelWithTooltip
                    htmlFor="industry"
                    label="Which industry best describes your business?"
                    tooltip="Selecting your industry allows the AI to add specific clauses relevant to your sector (e.g., safety rules for construction)."
                />
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
          </div>

          <div className="pt-6 border-t border-gray-200">
             <h3 className="text-lg font-semibold text-gray-800">Optional Details</h3>
             <p className="text-sm text-gray-500 mb-4">Providing more details helps the AI generate more personalized and context-aware documents.</p>
             <div className="space-y-6">
                <div className="space-y-2">
                    <LabelWithTooltip
                        htmlFor="address"
                        label="Company Address"
                        tooltip="Your official address will be included in the header or footer of your documents for a professional look."
                    />
                    <input
                    id="address"
                    name="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., 123 Tech Street, Cape Town, 8001"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="space-y-2">
                    <LabelWithTooltip
                        htmlFor="companyUrl"
                        label="Company Website"
                        tooltip="Your website can be added to document footers, reinforcing your company's brand and contact information."
                    />
                    <input
                    id="companyUrl"
                    name="companyUrl"
                    type="url"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    placeholder="e.g., https://www.yourcompany.co.za"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="space-y-2">
                    <LabelWithTooltip
                        htmlFor="summary"
                        label="Brief Company Summary"
                        tooltip="This summary helps the AI understand your business's mission and tone, which can be reflected in introductions or preambles."
                    />
                    <textarea
                    id="summary"
                    name="summary"
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="e.g., A leading provider of widgets in the manufacturing sector."
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="space-y-2">
                    <LabelWithTooltip
                        htmlFor="companySize"
                        label="Company Size (Number of Employees)"
                        tooltip="Some legal requirements (like Employment Equity) depend on your number of employees. This helps ensure compliance."
                    />
                    <select
                        id="companySize"
                        name="companySize"
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white"
                    >
                        <option value="">Select a size...</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                    </select>
                </div>
             </div>
          </div>

          <button
            type="submit"
            disabled={isContinueDisabled}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            Continue to Customize
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