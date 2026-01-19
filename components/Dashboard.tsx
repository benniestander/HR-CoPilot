
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PolicySelector from './PolicySelector';
import FormSelector from './FormSelector';
import DocumentHistory from './DocumentHistory';
import ComplianceScore from './ComplianceScore';
import OnboardingWalkthrough from './OnboardingWalkthrough';
import { MasterPolicyIcon, FormsIcon, ComplianceIcon, UpdateIcon, FileIcon, UserIcon } from './Icons';
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto relative px-4 sm:px-0 pb-20"
    >
      {/* --- HEADER SECTION --- */}
      <motion.div variants={itemVariants} className="mb-12" id="tour-welcome">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/10">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Business Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-secondary tracking-tight leading-tight">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'HR Hero'}!
            </h1>
            <div className="flex items-center gap-5 mt-6">
              {user?.plan === 'payg' && (
                <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Balance</span>
                  <span className="text-sm font-black text-emerald-600">R{(Number(user.creditBalance || 0) / 100).toFixed(2)}</span>
                </div>
              )}
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] bg-gray-50/50 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-gray-100/50 italic">
                Protecting {user?.profile?.companyName || 'your enterprise'}
              </span>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="hidden lg:block w-80"
          >
            <div className="bg-gradient-to-br from-secondary via-secondary to-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-secondary/20 relative overflow-hidden group border border-white/5">
              <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <ComplianceIcon className="w-32 h-32" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Live Status</p>
              <p className="text-2xl font-black mb-6 tracking-tight">Fully Compliant</p>
              <button
                onClick={() => navigateTo('knowledge-base')}
                className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all backdrop-blur-md border border-white/10"
              >
                Access Library
              </button>
            </div>
          </motion.div>
        </div>

        {user?.profile && (
          <motion.div variants={itemVariants} id="tour-compliance" className="mt-12">
            <ComplianceScore
              profile={user.profile}
              documents={generatedDocuments}
              onGenerateSuggestion={onSelectDocument}
            />
          </motion.div>
        )}
      </motion.div>

      {/* --- BENTO ACTION GRID --- */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div
          id="tour-roadmap"
          whileHover={{ y: -8, boxShadow: '0 40px 80px -15px rgba(59, 130, 246, 0.15)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onStartChecklist}
          className="bg-white p-10 rounded-[3rem] border border-gray-100 cursor-pointer transition-all flex items-center group shadow-sm relative overflow-hidden active:bg-gray-50"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 blur-[80px] group-hover:bg-blue-400/10 transition-colors" />

          <div className="bg-blue-50 p-6 rounded-[2rem] mr-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
            <ComplianceIcon className="w-10 h-10 text-blue-600 group-hover:text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-secondary group-hover:text-primary transition-colors tracking-tight mb-1">Compliance Roadmap</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Discover every statutory document your company needs.</p>
          </div>
          <div className="text-gray-200 group-hover:text-primary transition-all group-hover:translate-x-1 pl-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
          </div>
        </motion.div>

        <motion.div
          id="tour-updater"
          whileHover={{ y: -8, boxShadow: '0 40px 80px -15px rgba(245, 158, 11, 0.15)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onStartUpdate}
          className="bg-white p-10 rounded-[3rem] border border-gray-100 cursor-pointer transition-all flex items-center group shadow-sm relative overflow-hidden active:bg-gray-50"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 blur-[80px] group-hover:bg-amber-400/10 transition-colors" />

          <div className="bg-amber-50 p-6 rounded-[2rem] mr-8 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-inner">
            <UpdateIcon className="w-10 h-10 text-amber-600 group-hover:text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-secondary group-hover:text-primary transition-colors tracking-tight mb-1">Intelligent Auditor</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Analyze existing policies against latest SA Labour Law.</p>
          </div>
          <div className="text-gray-200 group-hover:text-primary transition-all group-hover:translate-x-1 pl-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
          </div>
        </motion.div>
      </motion.div>

      {/* --- MAIN GENERATOR TABS --- */}
      <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-2xl rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-white/40 overflow-hidden mb-20 transform-gpu">
        <div className="flex border-b border-gray-100 p-3 bg-gray-50/30 sticky top-0 md:relative z-10" id="tour-generator">
          <button
            onClick={() => setActiveTab('policies')}
            className={`flex-1 py-6 px-8 rounded-[2rem] text-center font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center transition-all ${activeTab === 'policies'
              ? 'bg-white text-primary shadow-xl shadow-gray-200/50 border border-gray-100/50'
              : 'text-gray-400 hover:text-secondary'
              }`}
          >
            <MasterPolicyIcon className="w-5 h-5 mr-3" />
            Policies
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`flex-1 py-6 px-8 rounded-[2rem] text-center font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center transition-all ${activeTab === 'forms'
              ? 'bg-white text-primary shadow-xl shadow-gray-200/50 border border-gray-100/50'
              : 'text-gray-400 hover:text-secondary'
              }`}
          >
            <FormsIcon className="w-5 h-5 mr-3" />
            Forms
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-6 px-8 rounded-[2rem] text-center font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center transition-all ${activeTab === 'documents'
              ? 'bg-white text-primary shadow-xl shadow-gray-200/50 border border-gray-100/50'
              : 'text-gray-400 hover:text-secondary'
              }`}
          >
            <FileIcon className="w-5 h-5 mr-3" />
            Vault
          </button>
        </div>

        <div className="p-10 md:p-20 min-h-[600px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 1
              }}
              className="w-full"
            >
              {activeTab === 'policies' && (
                <PolicySelector onSelect={onSelectDocument} />
              )}
              {activeTab === 'forms' && (
                <FormSelector onSelectForm={onSelectDocument} />
              )}
              {activeTab === 'documents' && (
                <DocumentHistory
                  documents={generatedDocuments}
                  onViewDocument={handleViewDocument}
                  onNavigateToGenerator={() => setActiveTab('policies')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {showOnboardingWalkthrough && (
        <OnboardingWalkthrough onClose={onCloseWalkthrough} />
      )}
    </motion.div>
  );
};

export default Dashboard;
