
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

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
      setIsPrePaid(false);
      navigateTo('generator');
    } else {
      console.error(`Definition not found for document type: ${doc.type}`);
      setToastMessage("Error: Could not load document definition.");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* 1. Dashboard Header: Welcome & Stats Quick-look */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6" id="tour-welcome">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary tracking-tight">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'HR Hero'}!
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic opacity-80">"Efficiency is doing things right; effectiveness is doing the right things." — Peter Drucker</p>
        </div>

        <div className="flex items-center gap-3">
          {[
            { label: 'Balance', value: user?.plan === 'payg' ? `R${(Number(user.creditBalance || 0) / 100).toFixed(0)}` : 'Pro', color: 'text-green-600' },
            { label: 'Protection', value: `Lv. ${generatedDocuments.length > 5 ? 'High' : (generatedDocuments.length > 2 ? 'Mid' : 'Low')}`, color: 'text-primary' },
            { label: 'Documents', value: generatedDocuments.length, color: 'text-secondary' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2, scale: 1.05 }}
              className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[100px]"
            >
              <span className="text-[10px] uppercase font-bold text-gray-400">{stat.label}</span>
              <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 2. Core Compliance Engine: Bento Grid Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {user?.profile && (
            <div id="tour-compliance" className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100/50">
              <ComplianceScore
                profile={user.profile}
                documents={generatedDocuments}
                onGenerateSuggestion={onSelectDocument}
              />
            </div>
          )}

          {/* Action Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              id="tour-roadmap"
              onClick={onStartChecklist}
              whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100/50 cursor-pointer transition-all flex flex-col"
            >
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ComplianceIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Compliance Roadmap</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">Detailed gap analysis of your current HR infrastructure and legal requirements.</p>
              <div className="mt-auto flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                Run Checkup <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </motion.div>

            <motion.div
              id="tour-updater"
              onClick={onStartUpdate}
              whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100/50 cursor-pointer transition-all flex flex-col"
            >
              <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <UpdateIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Policy Updater</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">Audit your legacy documents against the <span>latest 2026 SA Labour Law</span> amendments.</p>
              <div className="mt-auto flex items-center text-sm font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                Start Audit <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Sidebar / Quick Tips */}
        <motion.div variants={itemVariants} className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-secondary rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <MasterPolicyIcon className="w-24 h-24" />
            </div>
            <h4 className="text-amber-400 font-bold uppercase text-[10px] tracking-widest mb-3">Expert Insight</h4>
            <h3 className="text-lg font-bold mb-4 leading-tight">Avoid the CCMA with "BCEA Regularity"</h3>
            <p className="text-sm text-gray-300 mb-6">Did you know: 72% of employers lose at the CCMA simply because their disciplinary code wasn't signed by the employee?</p>
            <button onClick={() => navigateTo('knowledge-base')} className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-sm font-bold transition-colors">Learn More</button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mr-3">
                <FileIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase">Recent Activity</div>
                <div className="font-bold text-secondary">{generatedDocuments.length > 0 ? 'Document Ready' : 'Ready to Start'}</div>
              </div>
            </div>
            <button onClick={() => setActiveTab('documents')} className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* 3. Document Generation Tabs */}
      <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden" id="tour-generator">
        <div className="flex bg-gray-50/50 p-2 border-b border-gray-100">
          {[
            { id: 'policies', name: 'Policies', icon: MasterPolicyIcon },
            { id: 'forms', name: 'Forms', icon: FormsIcon },
            { id: 'documents', name: 'History', icon: FileIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center font-bold text-sm transition-all relative ${activeTab === tab.id
                ? 'text-secondary'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white shadow-sm ring-1 ring-gray-100 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center">
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6 md:p-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'policies' && <PolicySelector onSelect={onSelectDocument} />}
              {activeTab === 'forms' && <FormSelector onSelectForm={onSelectDocument} />}
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
