

import React, { useState } from 'react';
import PolicySelector from './PolicySelector';
import FormSelector from './FormSelector';
import type { Policy, Form, GeneratedDocument } from '../types';
import { MasterPolicyIcon, FormsIcon, HelpIcon, UpdateIcon, ComplianceIcon, WordIcon, ExcelIcon } from './Icons';
import HowToUseModal from './HowToUseModal';

interface DashboardProps {
  onSelectItem: (item: Policy | Form) => void;
  onStartUpdate: () => void;
  onStartChecklist: () => void;
  generatedDocuments: GeneratedDocument[];
  onViewDocument: (doc: GeneratedDocument) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectItem, onStartUpdate, onStartChecklist, generatedDocuments, onViewDocument }) => {
  const [activeTab, setActiveTab] = useState<'policies' | 'forms'>('policies');
  const [isHowToUseModalOpen, setIsHowToUseModalOpen] = useState(false);

  const DocumentHistory: React.FC = () => {
    if (generatedDocuments.length === 0) {
      return null;
    }

    return (
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-secondary mb-4">Recently Generated Documents</h2>
        <ul className="space-y-3">
          {generatedDocuments.map(doc => (
            <li key={doc.id} className="flex justify-between items-center p-3 bg-light rounded-md border border-gray-200 hover:bg-gray-200 transition-colors">
              <div className="flex items-center">
                {doc.outputFormat === 'excel' ? <ExcelIcon className="w-6 h-6 text-green-600 mr-3" /> : <WordIcon className="w-6 h-6 text-blue-600 mr-3" />}
                <div>
                  <p className="font-semibold text-secondary">{doc.title}</p>
                  <p className="text-xs text-gray-500">
                    Generated on {new Date(doc.createdAt).toLocaleDateString()} for {doc.companyProfile.companyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onViewDocument(doc)}
                className="px-3 py-1.5 text-sm font-semibold text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                View / Re-download
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };


  return (
    <div>
        <div className="text-center">
            <h2 className="text-4xl font-bold text-secondary mb-3 leading-tight">
                HR Co-Pilot Dashboard
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                Welcome back! Manage your HR documents or generate a new one below.
            </p>
             <button
                onClick={() => setIsHowToUseModalOpen(true)}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-12"
              >
                <HelpIcon className="w-5 h-5 mr-2 -ml-1" />
                How to Use This Tool
              </button>
        </div>
        
        <DocumentHistory />

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
            Generate HR Policy
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
            Generate HR Form
            </button>
        </div>

        <div>
            {activeTab === 'policies' ? (
            <PolicySelector onSelectPolicy={onSelectItem} />
            ) : (
            <FormSelector onSelectForm={onSelectItem} />
            )}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="py-12 bg-white border rounded-lg shadow-md">
                <div className="text-center max-w-md mx-auto px-4">
                    <ComplianceIcon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-secondary">Compliance Checklist</h3>
                    <p className="text-gray-600 mt-2 mb-6">
                        Not sure where to start? Describe your business for a personalized checklist.
                    </p>
                    <button
                    onClick={onStartChecklist}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-opacity-90"
                    >
                    Get My Checklist
                    </button>
                </div>
            </div>

            <div className="py-12 bg-white border rounded-lg shadow-md">
                <div className="text-center max-w-md mx-auto px-4">
                    <UpdateIcon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-secondary">Update Existing Policy</h3>
                    <p className="text-gray-600 mt-2 mb-6">
                        Scan your policies for compliance with the latest South African labour laws.
                    </p>
                    <button
                    onClick={onStartUpdate}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-opacity-90"
                    >
                    Update My Policy
                    </button>
                </div>
            </div>
        </div>


        <HowToUseModal
            isOpen={isHowToUseModalOpen}
            onClose={() => setIsHowToUseModalOpen(false)}
        />
    </div>
  );
};

export default Dashboard;