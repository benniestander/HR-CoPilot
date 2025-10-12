import React, { useState } from 'react';
import PolicySelector from './PolicySelector';
import FormSelector from './FormSelector';
import type { Policy, Form } from '../types';
import { MasterPolicyIcon, FormsIcon, HelpIcon } from './Icons';
import HowToUseModal from './HowToUseModal';

interface HomePageProps {
  onSelectItem: (item: Policy | Form) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectItem }) => {
  const [activeTab, setActiveTab] = useState<'policies' | 'forms'>('policies');
  const [isHowToUseModalOpen, setIsHowToUseModalOpen] = useState(false);

  return (
    <div>
        <div className="text-center">
            <h2 className="text-4xl font-bold text-secondary mb-3 leading-tight">
                Instantly Generate Compliant HR Documents
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                Your expert AI assistant for South African small businesses. Select a document type below to start in seconds.
            </p>
             <button
                onClick={() => setIsHowToUseModalOpen(true)}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-12"
              >
                <HelpIcon className="w-5 h-5 mr-2 -ml-1" />
                How to Use This Tool
              </button>
        </div>

      <div className="flex justify-center border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center px-6 py-3 text-lg font-semibold border-b-2 transition-colors ${
            activeTab === 'policies'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MasterPolicyIcon className="w-6 h-6 mr-2" />
          HR Policies
        </button>
        <button
          onClick={() => setActiveTab('forms')}
          className={`flex items-center px-6 py-3 text-lg font-semibold border-b-2 transition-colors ${
            activeTab === 'forms'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
            <FormsIcon className="w-6 h-6 mr-2" />
          HR Forms
        </button>
      </div>

      <div>
        {activeTab === 'policies' ? (
          <PolicySelector onSelectPolicy={onSelectItem} />
        ) : (
          <FormSelector onSelectForm={onSelectItem} />
        )}
      </div>

       <HowToUseModal
        isOpen={isHowToUseModalOpen}
        onClose={() => setIsHowToUseModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;