
import React, { useState } from 'react';
import PolicySelector from './PolicySelector';
import FormSelector from './FormSelector';
import DocumentHistory from './DocumentHistory';
import ComplianceScore from './ComplianceScore';
import OnboardingWalkthrough from './OnboardingWalkthrough';
import { MasterPolicyIcon, FormsIcon, ComplianceIcon, UpdateIcon, FileIcon } from './Icons';
import { useUIContext } from '../contexts/UIContext';
import { useAuthContext } from '../contexts/AuthContext';
import { useDataContext } from '../contexts/DataContext';
import { POLICIES, FORMS } from '../constants';
import type { Policy, Form, GeneratedDocument, PolicyType, FormType } from '../types';

interface DashboardProps {
  onStartUpdate: () => void;
  onStartChecklist: () => void;
  showOnboardingWalkthrough: boolean;
  onCloseWalkthrough: () => void;
  onGoToProfileSetup: () => void;
  onSelectDocument: (item: Policy | Form) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  onStartUpdate,
  onStartChecklist,
  showOnboardingWalkthrough,
  onCloseWalkthrough,
  onSelectDocument
}) => {
  const [activeTab, setActiveTab] = useState<'policies' | 'forms' | 'documents'>('policies');
  const { setSelectedItem, navigateTo, setDocumentToView, setToastMessage, setIsPrePaid } = useUIContext();
  const { user } = useAuthContext();
  const { generatedDocuments } = useDataContext();

  const handleViewDocument = (doc: GeneratedDocument) => {
      let item: Policy | Form | undefined;
      
      if (doc.kind === 'policy') {
          item = POLICIES[doc.type as PolicyType];
      } else {
          item = FORMS[doc.type as FormType];
      }

      if (item) {
          setSelectedItem(item);
          setDocumentToView(doc);
          setIsPrePaid(false); // Viewing existing doc, no payment needed
          navigateTo('generator'); 
      } else {
          console.error(`Definition not found for document type: ${doc.type}`);
          setToastMessage("Error: Could not load document definition.");
      }
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="mb-8" id="tour-welcome">
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-secondary">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'HR Hero'}!
            </h1>
            {user?.plan === 'payg' && user.creditBalance < 7500 && (
                <p className="text-sm text-gray-500 mt-1">
                    <span className="text-amber-600 font-semibold mr-2">Low Balance:</span>
                    Credit Balance: <span className="font-bold text-green-600">R{(Number(user.creditBalance || 0)/100).toFixed(2)}</span>
                </p>
            )}
            {user?.plan === 'payg' && user.creditBalance >= 7500 && (
                <p className="text-sm text-gray-500 mt-1">
                    Credit Balance: <span className="font-bold text-green-600">R{(Number(user.creditBalance || 0)/100).toFixed(2)}</span>
                </p>
            )}
        </div>

        {user?.profile && (
            <div id="tour-compliance">
                <ComplianceScore 
                    profile={user.profile} 
                    documents={generatedDocuments} 
                    onGenerateSuggestion={onSelectDocument} 
                />
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div
            id="tour-roadmap"
            onClick={onStartChecklist}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all flex items-center group"
          >
              <div className="bg-blue-50 p-4 rounded-full mr-5 group-hover:bg-blue-100 transition-colors">
                  <ComplianceIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                  <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">View Compliance Roadmap</h3>
                  <p className="text-sm text-gray-600">See exactly what documents your business needs.</p>
              </div>
          </div>

          <div
            id="tour-updater"
            onClick={onStartUpdate}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all flex items-center group"
          >
              <div className="bg-amber-50 p-4 rounded-full mr-5 group-hover:bg-amber-100 transition-colors">
                  <UpdateIcon className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                  <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">Policy Updater</h3>
                  <p className="text-sm text-gray-600">Upload existing policies to check for compliance.</p>
              </div>
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto" id="tour-generator">
          <button
            onClick={() => setActiveTab('policies')}
            className={`flex-1 py-4 px-6 text-center font-semibold text-base sm:text-lg flex items-center justify-center transition-colors whitespace-nowrap ${
              activeTab === 'policies'
                ? 'bg-white text-primary border-b-2 border-primary'
                : 'bg-gray-50 text-gray-500 hover:text-gray-700'
            }`}
          >
            <MasterPolicyIcon className="w-5 h-5 mr-2" />
            Generate Policy
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`flex-1 py-4 px-6 text-center font-semibold text-base sm:text-lg flex items-center justify-center transition-colors whitespace-nowrap ${
              activeTab === 'forms'
                ? 'bg-white text-primary border-b-2 border-primary'
                : 'bg-gray-50 text-gray-500 hover:text-gray-700'
            }`}
          >
            <FormsIcon className="w-5 h-5 mr-2" />
            Generate Form
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-4 px-6 text-center font-semibold text-base sm:text-lg flex items-center justify-center transition-colors whitespace-nowrap ${
              activeTab === 'documents'
                ? 'bg-white text-primary border-b-2 border-primary'
                : 'bg-gray-50 text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileIcon className="w-5 h-5 mr-2" />
            My Documents
          </button>
        </div>

        <div className="p-6 md:p-10 bg-gray-50/30 min-h-[400px]">
          {activeTab === 'policies' && (
            <div className="animate-fade-in">
                <PolicySelector onSelect={onSelectDocument} />
            </div>
          )}
          {activeTab === 'forms' && (
            <div className="animate-fade-in">
                <FormSelector onSelectForm={onSelectDocument} />
            </div>
          )}
          {activeTab === 'documents' && (
            <div className="animate-fade-in">
                <DocumentHistory 
                    documents={generatedDocuments} 
                    onViewDocument={handleViewDocument}
                    onNavigateToGenerator={() => setActiveTab('policies')}
                />
            </div>
          )}
        </div>
      </div>

      {showOnboardingWalkthrough && (
        <OnboardingWalkthrough onClose={onCloseWalkthrough} />
      )}
    </div>
  );
};

export default Dashboard;
