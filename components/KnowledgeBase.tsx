
import React, { useState } from 'react';
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
    id: 'compliance-education',
    title: 'Compliance Education',
    icon: ShieldCheckIcon,
    articles: [
      {
        id: 'bcea-survival-guide',
        title: '2026 SA HR Survival Guide',
        content: (
          <div className="space-y-6">
            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 mb-8">
              <h4 className="text-rose-900 font-black text-xl mb-2 italic">Is Your Small Business a Lawsuit Waiting to Happen?</h4>
              <p className="text-rose-700 font-medium">Losing a single "unfair dismissal" case can cost you months of revenue. Most owners get sued not for being "bad bosses," but for having <span className="underline decoration-2">outdated paperwork</span>.</p>
            </div>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-secondary">1. The "Contract" Trap</h3>
              <p className="text-gray-600 leading-relaxed">Most owners download random templates from the internet. In South Africa, if your contract doesn't explicitly mention things like the <strong className="text-secondary">BCEA minimum leave cycles</strong> or <strong className="text-secondary">notice periods</strong>, you are legally naked.</p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm font-medium italic">
                The Fix: Every employee must have a signed contract compliant with the latest 2026 amendments.
              </div>
            </section>

            <section className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-secondary">2. The 45-Hour Myth</h3>
              <p className="text-gray-600 leading-relaxed">The BCEA is strict: 45 hours per week max, and 9 hours a day (for 5-day workers). Overtime <strong className="text-secondary">must be agreed upon in writing</strong>. Without a written overtime policy, an employee can refuse to work late—and there's nothing you can do about it.</p>
            </section>

            <section className="space-y-4 pt-4 text-center py-8">
              <p className="text-lg font-bold text-secondary">Stop Gambling With Your Business.</p>
              <button className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                Generate Compliant Documents Now
              </button>
            </section>
          </div>
        )
      }
    ]
  },
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
            <p className="text-gray-600 lead">Welcome to HR CoPilot! Setting up your profile correctly ensures that all your documents are automatically populated with the correct company details.</p>
            <h4 className="font-bold text-secondary mt-6">Step-by-Step Guide:</h4>
            <ol className="list-decimal pl-5 space-y-3 text-gray-600">
              <li>Navigate to your <strong>Profile Page</strong> by clicking your name in the top right.</li>
              <li>Click the <strong>Edit Profile</strong> button.</li>
              <li>Enter your <strong>Company's Legal Name</strong>. This appears on all legal contracts.</li>
              <li>Select your <strong>Industry</strong>. The AI uses this to tailor safety and sectoral clauses.</li>
              <li>Click <strong>Save Changes</strong>.</li>
            </ol>
          </div>
        )
      },
      {
        id: 'plans',
        title: 'Understanding Plans',
        content: (
          <div className="space-y-6">
            <p className="text-gray-600">HR CoPilot offers two flexible ways to protect your business.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="font-black text-secondary text-lg mb-2">Pay-As-You-Go</h4>
                <p className="text-sm text-gray-400 mb-4 font-medium uppercase tracking-tight">Occasional Use</p>
                <ul className="space-y-2 text-sm text-gray-600 font-medium">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span> No monthly fees</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span> Top up as you go</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span> Pay per document</li>
                </ul>
              </div>
              <div className="p-6 bg-primary text-white rounded-3xl shadow-xl shadow-primary/10">
                <h4 className="font-black text-lg mb-2">Ingcweti Pro</h4>
                <p className="text-sm text-white/60 mb-4 font-medium uppercase tracking-tight">Growth & Protection</p>
                <ul className="space-y-2 text-sm text-white/90 font-medium">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-white mr-2"></span> Annual Subscription</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-white mr-2"></span> <strong>Unlimited</strong> Generation</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-white mr-2"></span> Priority Support</li>
                </ul>
              </div>
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
            <p className="text-gray-600 leading-relaxed">If you are on the Pay-As-You-Go plan, you need credits to generate documents.</p>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm"><CreditCardIcon className="w-6 h-6 text-primary" /></div>
              <div>
                <h4 className="font-bold text-secondary mb-1">To top up your balance:</h4>
                <p className="text-sm text-gray-500">Go to Profile → Top Up Credit → Choose amount → Pay via Yoco.</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">Credits never expire and can be used for any document or AI update.</p>
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
    <div className="max-w-7xl mx-auto min-h-screen px-4 py-8 animate-in fade-in duration-700">
      <button
        onClick={onBack}
        className="mb-8 p-3 rounded-full bg-white border border-gray-100 shadow-sm text-secondary font-bold hover:shadow-md hover:-translate-x-1 transition-all flex items-center group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="pr-4">Dashboard</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-50">
              <h2 className="font-black text-secondary flex items-center text-lg tracking-tight uppercase">
                <BookIcon className="w-5 h-5 mr-3 text-primary" />
                Knowledge Base
              </h2>
            </div>
            <div className="p-4 space-y-2">
              {KNOWLEDGE_BASE_DATA.map(category => (
                <div key={category.id} className="space-y-1">
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-2xl transition-all ${activeCategory === category.id
                      ? 'bg-secondary text-white shadow-lg shadow-secondary/10'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-secondary'
                      }`}
                  >
                    <div className="flex items-center">
                      <category.icon className={`w-4 h-4 mr-3 ${activeCategory === category.id ? 'text-white' : 'text-gray-400'}`} />
                      {category.title}
                    </div>
                  </button>

                  {/* Expanded Articles for Active Category */}
                  {activeCategory === category.id && (
                    <div className="ml-4 mt-2 mb-4 space-y-1 border-l-2 border-primary/20 pl-4 animate-in slide-in-from-left-2 duration-300">
                      {category.articles.map(article => (
                        <button
                          key={article.id}
                          onClick={() => setActiveArticle(article.id)}
                          className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all ${activeArticle === article.id
                            ? 'text-primary bg-primary/5'
                            : 'text-gray-400 hover:text-secondary hover:bg-gray-50'
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
        <div className="flex-grow">
          <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-gray-50 min-h-[600px] relative overflow-hidden">
            {/* Subtle Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

            {currentArticle ? (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center text-[10px] font-black tracking-widest text-primary uppercase mb-4 bg-primary/5 w-fit px-3 py-1 rounded-full">
                  {currentCategory?.title}
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-secondary tracking-tighter mb-10 leading-none">{currentArticle.title}</h1>

                <div className="prose prose-blue max-w-none text-gray-700 font-medium leading-relaxed">
                  {currentArticle.content}
                </div>

                {/* --- MARKETING CTA: For Non-Pro Users --- */}
                {!isPro && currentArticle.id === 'bcea-survival-guide' && (
                  <div className="mt-16 p-1 bg-gradient-to-br from-primary via-secondary to-primary rounded-[3rem] shadow-2xl shadow-primary/20">
                    <div className="bg-white p-10 md:p-14 rounded-[2.8rem] flex flex-col md:flex-row items-center gap-10">
                      <div className="flex-grow space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-3xl md:text-4xl font-black text-secondary tracking-tighter leading-tight">
                            Stop Playing <span className="text-primary italic">"HR Roulette"</span> With Your Business.
                          </h3>
                          <p className="text-gray-500 text-lg font-medium leading-snug">
                            One legal mistake can cost you more than 10 years of this subscription. Why risk your legacy on a template?
                          </p>
                        </div>

                        <ul className="space-y-4 font-bold text-secondary">
                          <li className="flex items-center gap-3">
                            <div className="p-1 bg-green-100 rounded-full"><ShieldCheckIcon className="w-5 h-5 text-green-600" /></div>
                            Unlimited 2026 Compliant Document Generation
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="p-1 bg-green-100 rounded-full"><UpdateIcon className="w-5 h-5 text-green-600" /></div>
                            Instant Updates as SA Labor Law Evolves
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="p-1 bg-green-100 rounded-full"><ComplianceIcon className="w-5 h-5 text-green-600" /></div>
                            Total Peace of Mind (Priceless)
                          </li>
                        </ul>
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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <BookIcon className="w-20 h-20 mb-6 opacity-20" />
                <p className="font-black tracking-widest uppercase text-xs">Awaiting Selection</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
