
import React, { useState } from 'react';
import PolicySelector from './PolicySelector';
import FormSelector from './FormSelector';
import type { Policy, Form } from '../types';
import { MasterPolicyIcon, FormsIcon, HelpIcon, UpdateIcon, ComplianceIcon, WordIcon, ExcelIcon, InfoIcon, LoadingIcon } from './Icons';
import HowToUseModal from './HowToUseModal';
import OnboardingWalkthrough from './OnboardingWalkthrough';
import ConfirmationModal from './ConfirmationModal';
import { useAuthContext } from '../contexts/AuthContext';
import { useDataContext } from '../contexts/DataContext';
import { useUIContext } from '../contexts/UIContext';
import { POLICIES, FORMS } from '../constants';
import { PolicyType, FormType } from '../types';

interface DashboardProps {
  onStartUpdate: () => void;
  onStartChecklist: () => void;
  showOnboardingWalkthrough?: boolean;
  onCloseWalkthrough?: () => void;
  onGoToProfileSetup: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartUpdate, onStartChecklist, showOnboardingWalkthrough, onCloseWalkthrough, onGoToProfileSetup }) => {
  const { user } = useAuthContext();
  const { generatedDocuments, isLoadingUserDocs } = useDataContext();
  const { navigateTo, setSelectedItem, setDocumentToView } = useUIContext();

  const [activeTab, setActiveTab] = useState<'policies' | 'forms'>('policies');
  const [isHowToUseModalOpen, setIsHowToUseModalOpen] = useState(false);
  
  // Profile Incomplete Modal
  const [profileIncompleteModalOpen, setProfileIncompleteModalOpen] = useState(false);

  // PAYG Confirmation State
  const [paygModalState, setPaygModalState] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'insufficient';
    item: Policy | Form | null;
  }>({ isOpen: false, type: 'confirm', item: null });

  const proceedToGenerator = (item: Policy | Form) => {
    setSelectedItem(item);
    setDocumentToView(null);
    navigateTo('generator');
  };

  const onSelectItem = (item: Policy | Form) => {
    // Logic for Pro users
    if (user?.plan === 'pro') {
        // Check if profile is complete
        if (!user.profile.companyName || !user.profile.industry) {
            setProfileIncompleteModalOpen(true);
            return;
        }
        proceedToGenerator(item);
        return;
    }

    // Logic for PAYG users
    if (user?.plan === 'payg') {
        const price = Number(item.price);
        const balance = Number(user.creditBalance || 0);

        if (balance < price) {
            setPaygModalState({
                isOpen: true,
                type: 'insufficient',
                item: item
            });
        } else {
            setPaygModalState({
                isOpen: true,
                type: 'confirm',
                item: item
            });
        }
        return;
    }

    // Fallback (e.g. admin or undefined plan)
    proceedToGenerator(item);
  };

  const handlePaygConfirm = () => {
    if (paygModalState.item) {
        proceedToGenerator(paygModalState.item);
    }
    setPaygModalState({ isOpen: false, type: 'confirm', item: null });
  };

  const handleTopUpRedirect = () => {
    setPaygModalState({ isOpen: false, type: 'confirm', item: null });
    navigateTo('topup');
  };

  const onViewDocument = (doc: any) => {
    setDocumentToView(doc);
    const item = doc.kind === 'policy' ? POLICIES[doc.type as PolicyType] : FORMS[doc.type as FormType];
    setSelectedItem(item);
    navigateTo('generator');
  };

  const OnboardingReminderBanner: React.FC = () => {
    if (!user || (user.profile.companyName && user.profile.industry)) {
        return null;
    }

    return (
        <div className="mb-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
                <InfoIcon className="w-6 h-6 mr-3 text-yellow-600 flex-shrink-0" />
                <div>
                    <h3 className="font-bold">Your profile is incomplete!</h3>
                    <p className="text-sm">Complete your company profile to get the most out of HR CoPilot and enable tailored document generation.</p>
                </div>
            </div>
            <button 
                onClick={() => navigateTo('profile')} 
                className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex-shrink-0 self-start sm:self-center"
            >
                Complete Profile Now
            </button>
        </div>
    );
  };

  const PaygBanner: React.FC = () => {
    if (user?.plan !== 'payg') return null;

    return (
      <div className="mb-8 p-4 bg-accent/20 border-l-4 border-accent text-accent-800 rounded-r-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
            <InfoIcon className="w-6 h-6 mr-3 text-accent-700 flex-shrink-0" />
            <div>
              <h3 className="font-bold">You are on the Pay-As-You-Go plan.</h3>
              <p className="text-sm">Your current balance is <strong>R{(Number(user.creditBalance) / 100).toFixed(2)}</strong>.</p>
            </div>
        </div>
        <button 
            onClick={() => navigateTo('topup')} 
            className="bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors flex-shrink-0 self-start sm:self-center"
        >
          Top Up Credit
        </button>
      </div>
    );
  };

  const DocumentHistory: React.FC = () => {
    if (isLoadingUserDocs) {
      return (
        <div className="mb-12 bg-white p-6 rounded-lg shadow-md border border-gray-200 flex justify-center items-center min-h-[150px]">
            <LoadingIcon className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

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
        {showOnboardingWalkthrough && onCloseWalkthrough && <OnboardingWalkthrough onClose={onCloseWalkthrough} />}
        <div className="text-center">
            <h2 className="text-4xl font-bold text-secondary mb-3 leading-tight">
                HR CoPilot Dashboard
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                Welcome back, {user?.name || 'User'}! Manage your HR documents or generate a new one below.
            </p>
             <button
                onClick={() => setIsHowToUseModalOpen(true)}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-12"
              >
                <HelpIcon className="w-5 h-5 mr-2 -ml-1" />
                How to Use This Tool
              </button>
        </div>
        
        <OnboardingReminderBanner />
        <PaygBanner />
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
                    Update Policy
                    </button>
                </div>
            </div>
        </div>

        <HowToUseModal
            isOpen={isHowToUseModalOpen}
            onClose={() => setIsHowToUseModalOpen(false)}
        />
        
        {/* Profile Incomplete Confirmation Modal */}
        <ConfirmationModal
            isOpen={profileIncompleteModalOpen}
            title="Incomplete Profile"
            message="As a Pro user, please complete your Company Profile (Company Name and Industry) before generating documents. This ensures all your documents are automatically personalized and legally compliant."
            confirmText="Go to Profile"
            cancelText="Cancel"
            onConfirm={() => { setProfileIncompleteModalOpen(false); navigateTo('profile'); }}
            onCancel={() => setProfileIncompleteModalOpen(false)}
        />

        {/* PAYG Confirmation Modal - Sufficient Funds */}
        {paygModalState.type === 'confirm' && (
            <ConfirmationModal
                isOpen={paygModalState.isOpen}
                title="Confirm Deduction"
                confirmText="Confirm & Generate"
                message={
                    <div className="text-center">
                        <p className="mb-4">
                            The <strong>{paygModalState.item?.title}</strong> costs <strong className="text-secondary">R{((paygModalState.item?.price || 0) / 100).toFixed(2)}</strong>.
                        </p>
                        <p className="text-sm text-gray-600">
                            This amount will be deducted from your credit balance of <strong>R{((user?.creditBalance || 0) / 100).toFixed(2)}</strong> upon successful generation.
                        </p>
                    </div>
                }
                onConfirm={handlePaygConfirm}
                onCancel={() => setPaygModalState({ isOpen: false, type: 'confirm', item: null })}
            />
        )}

        {/* PAYG Confirmation Modal - Insufficient Funds */}
        {paygModalState.type === 'insufficient' && (
            <ConfirmationModal
                isOpen={paygModalState.isOpen}
                title="Insufficient Credit"
                confirmText="Top Up Now"
                message={
                    <div className="text-center">
                        <p className="text-red-600 font-semibold mb-2">You do not have enough credit.</p>
                        <p className="mb-4">
                            The <strong>{paygModalState.item?.title}</strong> costs <strong className="text-secondary">R{((paygModalState.item?.price || 0) / 100).toFixed(2)}</strong>, but you only have <strong>R{((user?.creditBalance || 0) / 100).toFixed(2)}</strong> available.
                        </p>
                        <p className="text-sm text-gray-600">
                            Please top up your account to continue.
                        </p>
                    </div>
                }
                onConfirm={handleTopUpRedirect}
                onCancel={() => setPaygModalState({ isOpen: false, type: 'confirm', item: null })}
            />
        )}
    </div>
  );
};

export default Dashboard;
