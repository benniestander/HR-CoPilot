import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookIcon, ChevronRightIcon, MasterPolicyIcon, FormsIcon, UpdateIcon, ComplianceIcon, CreditCardIcon, UserIcon, ShieldCheckIcon } from './Icons';

interface Article {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  articles: Article[];
}

const KNOWLEDGE_BASE_DATA: Category[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: UserIcon,
    articles: [
      {
        id: 'account-setup',
        title: 'Setting Up Your Profile',
        content: (
          <div className="space-y-4">
            <p>Welcome to HR CoPilot! Setting up your profile correctly ensures that all your documents are automatically populated with the correct company details.</p>
            <h4 className="font-bold text-secondary">Step-by-Step Guide:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Navigate to your <strong>Profile Page</strong> by clicking your name or the user icon in the top right corner.</li>
              <li>Click the <strong>Edit Profile</strong> button.</li>
              <li>Enter your <strong>Company's Legal Name</strong>. This is crucial as it will appear on all legal contracts.</li>
              <li>Select your <strong>Industry</strong>. The Ingcweti AI uses this to tailor policies (e.g., adding specific safety clauses for Construction).</li>
              <li>Add optional details like Address and Website to make your documents look more professional.</li>
              <li>Click <strong>Save Changes</strong>.</li>
            </ol>
          </div>
        )
      },
      {
        id: 'plans',
        title: 'Understanding Plans (Pro vs PAYG)',
        content: (
          <div className="space-y-4">
            <p>HR CoPilot offers two ways to access documents tailored to your business needs.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">Pay-As-You-Go (PAYG)</h4>
                <p className="text-sm text-blue-700 mb-2">Best for occasional use.</p>
                <ul className="list-disc pl-4 text-sm text-blue-800">
                  <li>No monthly fees.</li>
                  <li>Purchase "Credits" via Yoco.</li>
                  <li>Pay per document generated.</li>
                  <li>Pay a small fee for AI Policy Updates.</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <h4 className="font-bold text-green-800 mb-2">Pro Membership</h4>
                <p className="text-sm text-green-700 mb-2">Best for growing businesses.</p>
                <ul className="list-disc pl-4 text-sm text-green-800">
                  <li>One-time annual fee.</li>
                  <li><strong>Unlimited</strong> document generation.</li>
                  <li><strong>Unlimited</strong> AI Policy Updates.</li>
                  <li>Priority support.</li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'bcea-survival-guide',
        title: 'BCEA Survival Guide for Founders',
        content: (
          <div className="space-y-6">
            <p className="text-lg leading-relaxed">Most South African business owners inadvertently break the Basic Conditions of Employment Act (BCEA) every single month. Ignorance isn't just risky—it's expensive.</p>

            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <h4 className="font-black text-red-800 uppercase tracking-widest text-xs mb-4">The Top 3 Silent Killers:</h4>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <p className="text-sm font-medium text-red-900"><strong>The 45-Hour trap:</strong> Expecting staff to work "standard" hours without realizing where BCEA mandatory overtime kicks in.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <p className="text-sm font-medium text-red-900"><strong>Verbal "Warnings":</strong> In South Africa, if it isn't documented on a compliant form, it never happened in the eyes of the CCMA.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <p className="text-sm font-medium text-red-900"><strong>Generic Contracts:</strong> Using a template from the internet that doesn't account for Sectoral Determinations or Bargaining Councils.</p>
                </li>
              </ul>
            </div>

            <h4 className="font-bold text-secondary text-xl">The Solution: Automatic Compliance</h4>
            <p>Your HR CoPilot is designed to be your shield. By generating your documents through our platform, you ensure that every contract, policy, and disciplinary form is built on a foundation of current South African law.</p>
          </div>
        )
      }
    ]
  },
  {
    id: 'generating',
    title: 'Generating Documents',
    icon: MasterPolicyIcon,
    articles: [
      {
        id: 'create-policy',
        title: 'How to Generate a Policy',
        content: (
          <div className="space-y-4">
            <p>Our Ingcweti AI drafts customized, legally compliant policies in minutes.</p>
            <ol className="list-decimal pl-5 space-y-3">
              <li>Go to the <strong>Generate Policy</strong> tab on the Dashboard.</li>
              <li>Browse the list or use the search bar to find the policy you need (e.g., "Disciplinary Code").</li>
              <li>Click on the policy card.</li>
              <li><strong>Confirm Details:</strong> Ensure your Company Name and Industry are correct.</li>
              <li><strong>Customize:</strong> Answer the guided questions. Select a "Company Voice" (Formal, Friendly, etc.) to match your culture.</li>
              <li><strong>Generate:</strong> Click "Generate My Document". The AI will draft your policy.</li>
              <li><strong>Review & Save:</strong> Read through the preview. You can edit text directly or click "Edit Details & Regenerate" to change your answers. When ready, click <strong>Save Document</strong>.</li>
            </ol>
          </div>
        )
      },
      {
        id: 'create-form',
        title: 'How to Generate a Form',
        content: (
          <div className="space-y-4">
            <p>Generate ready-to-use HR forms like contracts, warnings, and leave applications.</p>
            <ol className="list-decimal pl-5 space-y-3">
              <li>Go to the <strong>Generate Form</strong> tab.</li>
              <li>Select a form (look for the Word or Excel icon to see the output format).</li>
              <li>Answer any specific questions (e.g., for an Employment Contract, you may need to enter the employee's job title).</li>
              <li>Click <strong>Generate</strong>.</li>
              <li><strong>Download:</strong> Once satisfied, click the <strong>Download</strong> icon in the top right of the preview pane to save it as a Word (.docx) or Text file.</li>
            </ol>
          </div>
        )
      }
    ]
  },
  {
    id: 'updater',
    title: 'Policy Updater',
    icon: UpdateIcon,
    articles: [
      {
        id: 'updating-docs',
        title: 'Updating Existing Policies',
        content: (
          <div className="space-y-4">
            <p>The Policy Updater allows you to bring old documents (even those not created by HR CoPilot) up to date with the latest labour laws.</p>
            <h4 className="font-bold text-secondary">How to use it:</h4>
            <ol className="list-decimal pl-5 space-y-3">
              <li>Go to the <strong>Policy Updater</strong> tab.</li>
              <li><strong>Select Document:</strong> Choose a previously generated document from the dropdown OR click "Upload File" to upload an external PDF or Word doc.</li>
              <li><strong>Choose Method:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li><strong>AI Compliance Review:</strong> The AI scans for legal risks and non-compliance.</li>
                  <li><strong>Manual Instructions:</strong> Tell the AI what to change (e.g., "Change maternity leave to 4 months paid").</li>
                </ul>
              </li>
              <li><strong>Review Changes:</strong> You will see a list of suggestions. Toggle "APPROVED" or "IGNORED" for each change. You can view the full text comparison by clicking "View Full Document Preview".</li>
              <li><strong>Save:</strong> Click "Confirm & Save". This creates a new version of your document.</li>
            </ol>
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm">
              <strong>Note for PAYG Users:</strong> Running an AI update costs a reduced fee (typically R25.00). This is deducted from your credit balance before the analysis starts.
            </div>
          </div>
        )
      },
      {
        id: 'drafts',
        title: 'Saving Drafts',
        content: (
          <div className="space-y-4">
            <p>If you are in the middle of a policy update but aren't ready to finalize it, you can save your progress.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>On the Review screen, click the <strong>Save as Draft</strong> button.</li>
              <li>To resume later, go back to the Policy Updater main screen. You will see a section called "In Progress Updates".</li>
              <li>Clicking a draft restores your document, the AI's analysis, and your selected changes exactly where you left off.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: 'compliance',
    title: 'Compliance Roadmap',
    icon: ComplianceIcon,
    articles: [
      {
        id: 'roadmap',
        title: 'Using the Compliance Roadmap',
        content: (
          <div className="space-y-4">
            <p>The Compliance Roadmap is a personalized checklist based on your specific industry and company size.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Critical Items:</strong> These are statutory requirements (e.g., Employment Contracts, Health & Safety Policy). You <em>must</em> have these to avoid legal risk.</li>
              <li><strong>Recommended Items:</strong> Best practices that protect your business (e.g., Social Media Policy).</li>
            </ul>
            <p>Click "Generate Now" next to any missing item to jump straight to the generator for that specific document. The list updates automatically as you save documents.</p>
          </div>
        )
      }
    ]
  },
  {
    id: 'quality-assurance',
    title: 'Quality Assurance',
    icon: ShieldCheckIcon,
    articles: [
      {
        id: 'qa-process',
        title: 'Our Quality Control Process',
        content: (
          <div className="space-y-4">
            <p>At HR CoPilot, we prioritize accuracy and compliance. Our Ingcweti AI is powerful, but we back it up with rigorous human oversight to ensure you receive documents of the highest professional standard.</p>
            <h4 className="font-bold text-secondary">How we ensure quality:</h4>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Legal Foundation:</strong> Our templates and AI models are built upon the latest South African legislation, including the BCEA, LRA, EEA, and POPIA.</li>
              <li><strong>Expert Review:</strong> We conduct regular spot checks and comprehensive quality audits with qualified HR practitioners and labour lawyers. This ensures our base templates and AI prompts remain current and legally sound.</li>
              <li><strong>Real-time Legislative Updates:</strong> Any new legislation, new laws, or updated laws are updated by HR CoPilot and the Ingcweti AI in real-time, ensuring your documents always reflect the current legal landscape.</li>
              <li><strong>Continuous Improvement:</strong> Feedback from legal experts is fed back into the system to constantly refine the AI's output.</li>
            </ul>
            <div className="bg-green-50 p-4 rounded-md border border-green-200 text-sm mt-4">
              <p className="font-semibold text-green-800">Our Commitment</p>
              <p className="text-green-700">We strive to ensure every policy and form you generate is HR compliant, legally informed, and of real professional quality.</p>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Credits',
    icon: CreditCardIcon,
    articles: [
      {
        id: 'top-up',
        title: 'Managing Credits (PAYG)',
        content: (
          <div className="space-y-4">
            <p>If you are on the Pay-As-You-Go plan, you need credits to generate documents.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to your <strong>Profile Page</strong>.</li>
              <li>Click <strong>Top Up Credit</strong>.</li>
              <li>Select an amount (e.g., R100, R200) or enter a custom amount.</li>
              <li>Pay securely via Yoco.</li>
              <li>Your balance updates immediately.</li>
            </ol>
            <p>When you generate a document, the cost (e.g., R35.00) is deducted from this balance. If you don't have enough credit, you will be prompted to top up before the AI starts working.</p>
          </div>
        )
      }
    ]
  }
];

interface KnowledgeBaseProps {
  onBack: () => void;
  onUpgrade?: () => void;
  isPro?: boolean;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onBack, onUpgrade, isPro }) => {
  const [activeCategory, setActiveCategory] = useState<string>(KNOWLEDGE_BASE_DATA[0].id);
  const [activeArticle, setActiveArticle] = useState<string>(KNOWLEDGE_BASE_DATA[0].articles[0].id);

  const currentCategory = KNOWLEDGE_BASE_DATA.find(c => c.id === activeCategory);
  const currentArticle = currentCategory?.articles.find(a => a.id === activeArticle);

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <div className="p-6 bg-gray-50/50 border-b border-gray-100">
              <h2 className="font-black text-secondary flex items-center uppercase tracking-widest text-xs">
                <BookIcon className="w-4 h-4 mr-3 text-primary" />
                Help Centre
              </h2>
            </div>
            <div className="p-4 space-y-1">
              {KNOWLEDGE_BASE_DATA.map(category => (
                <div key={category.id}>
                  <button
                    onClick={() => {
                      setActiveCategory(category.id);
                      setActiveArticle(category.articles[0].id);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all ${activeCategory === category.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center">
                      <category.icon className={`w-4 h-4 mr-3 ${activeCategory === category.id ? 'text-white' : 'text-gray-400'}`} />
                      <span className="uppercase tracking-widest">{category.title}</span>
                    </div>
                    {activeCategory === category.id && (
                      <motion.div layoutId="active-arrow">
                        <ChevronRightIcon className="w-4 h-4" />
                      </motion.div>
                    )}
                  </button>

                  {/* Expanded Articles for Active Category */}
                  {activeCategory === category.id && (
                    <div className="ml-6 mt-3 mb-4 space-y-1 border-l-2 border-primary/20 pl-4">
                      {category.articles.map(article => (
                        <button
                          key={article.id}
                          onClick={() => setActiveArticle(article.id)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all ${activeArticle === article.id
                            ? 'text-primary font-black bg-primary/5'
                            : 'text-gray-400 hover:text-secondary font-bold'
                            }`}
                        >
                          {article.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 md:p-20 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 min-h-[700px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              {currentCategory?.icon && <currentCategory.icon className="w-64 h-64" />}
            </div>

            <AnimatePresence mode="wait">
              {currentArticle ? (
                <motion.div
                  key={currentArticle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <h1 className="text-4xl md:text-5xl font-black text-secondary mb-4 tracking-tight leading-tight">{currentArticle.title}</h1>
                  <div className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-12 border-b border-gray-100 pb-8">
                    <span className="text-primary/60">{currentCategory?.title}</span>
                    <ChevronRightIcon className="w-3 h-3 mx-4" />
                    <span>Resource Library</span>
                  </div>

                  <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed font-medium text-base">
                    {currentArticle.content}
                  </div>

                  {/* --- MARKETING CTA: For Non-Pro Users --- */}
                  {!isPro && currentArticle.id === 'bcea-survival-guide' && (
                    <div className="mt-16 p-1 bg-gradient-to-br from-primary via-secondary to-primary rounded-[3rem] shadow-2xl shadow-primary/20">
                      <div className="bg-white p-10 md:p-14 rounded-[2.8rem] flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                          <span className="inline-block bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">Pro Feature</span>
                          <h3 className="text-2xl font-black text-secondary mb-4 leading-tight">Unlock Ultimate Peace of Mind</h3>
                          <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            Upgrade to <strong>HR CoPilot Pro</strong> today for unlimited access to every policy, contract, and AI update. Secure your business for a full year with one simple subscription.
                          </p>
                        </div>
                        <div className="shrink-0">
                          <button
                            onClick={onUpgrade}
                            className="bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] px-10 py-6 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto text-center"
                          >
                            Secure My Business Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-[400px] text-gray-300"
                >
                  <BookIcon className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">Select a guide to begin</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
