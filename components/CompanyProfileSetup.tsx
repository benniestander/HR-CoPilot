
import React, { useState } from 'react';
import type { Policy, Form, CompanyProfile } from '../types';
import { INDUSTRIES } from '../constants';
import { InfoIcon, ShieldCheckIcon, CreditCardIcon, UserIcon, ComplianceIcon, ChevronRightIcon } from './Icons';

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

const DiagnosticSection: React.FC<{ title: string; icon: React.FC<{className?: string}>; children: React.ReactNode }> = ({ title, icon: Icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-4">
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center">
                    <Icon className="w-5 h-5 text-primary mr-3" />
                    <span className="font-semibold text-secondary">{title}</span>
                </div>
                <ChevronRightIcon className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && <div className="p-6 space-y-6 border-t border-gray-200 animate-fade-in">{children}</div>}
        </div>
    );
}

const CompanyProfileSetup: React.FC<CompanyProfileSetupProps> = ({ item, initialProfile, onProfileSubmit, onBack }) => {
  const [profileData, setProfileData] = useState<CompanyProfile>(initialProfile);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const isPolicy = item.kind === 'policy';
  const isContinueDisabled = !profileData.companyName || (isPolicy && !profileData.industry);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isContinueDisabled) return;
    onProfileSubmit(profileData);
  };

  return (
    <div className="max-w-3xl mx-auto">
       <button
        onClick={onBack}
        className="mb-6 text-primary font-semibold hover:underline flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
          <item.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-secondary">Generating: {item.title}</h2>
          <p className="text-gray-600 mt-2">
            Confirm your company details and operational settings.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={profileData.companyName || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., ABC (Pty) Ltd"
                        required
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>

                {isPolicy && (
                <div className="space-y-2">
                    <LabelWithTooltip
                        htmlFor="industry"
                        label="Industry"
                        tooltip="Selecting your industry allows the AI to add specific clauses relevant to your sector (e.g., safety rules for construction)."
                    />
                    <select
                        id="industry"
                        name="industry"
                        value={profileData.industry || ''}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    >
                        <option value="" disabled>Choose an industry...</option>
                        {INDUSTRIES.map((ind) => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>
                )}
            </div>
            
            {/* Structural Summary (Read Only/Edit in Profile) */}
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center"><ShieldCheckIcon className="w-4 h-4 mr-1"/> Company Structure (from Profile)</h4>
                <div className="grid grid-cols-2 gap-y-2">
                    <div><span className="text-blue-700">Council:</span> <span className="font-medium text-blue-900">{profileData.bargainingCouncil || 'None'}</span></div>
                    <div><span className="text-blue-700">Union:</span> <span className="font-medium text-blue-900">{profileData.unionized || 'None'}</span></div>
                    <div><span className="text-blue-700">Size:</span> <span className="font-medium text-blue-900">{profileData.companySize || 'N/A'}</span></div>
                    <div><span className="text-blue-700">Retirement:</span> <span className="font-medium text-blue-900">{profileData.retirementAge || 'N/A'}</span></div>
                </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
             <div className="flex justify-between items-center mb-4">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800">Policy Context</h3>
                    <p className="text-sm text-gray-500">Customize operational details for this specific document.</p>
                 </div>
                 <button 
                    type="button"
                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                    className="text-sm font-semibold text-primary hover:underline"
                 >
                    {showDiagnostics ? 'Hide Context' : 'Show Context'}
                 </button>
             </div>

             {showDiagnostics && (
                 <div className="animate-fade-in">
                     <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded mb-6 border border-amber-100">
                         <strong>Why answer these?</strong> These questions define your operational reality (e.g., remote work, overtime rules) so the AI can draft specific clauses correctly.
                     </p>

                     <DiagnosticSection title="Operational Reality" icon={ComplianceIcon}>
                        <div className="space-y-4">
                            <div>
                                <LabelWithTooltip htmlFor="annualShutdown" label="Annual Dec/Jan Shutdown?" tooltip="If yes, leave policy MUST mandate saving leave. Otherwise, you risk double payments." />
                                <select name="annualShutdown" value={profileData.annualShutdown || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                    <option value="">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div>
                                <LabelWithTooltip htmlFor="overtimePayment" label="Overtime Structure" tooltip="Define how overtime is handled. Staff over the threshold (approx R254k/yr) aren't automatically entitled to pay." />
                                <select name="overtimePayment" value={profileData.overtimePayment || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                    <option value="">Select...</option>
                                    <option value="Paid">Paid (1.5x)</option>
                                    <option value="Time Off">Time Off in Lieu</option>
                                    <option value="None/Above Threshold">None / Above Threshold</option>
                                </select>
                            </div>
                            <div>
                                <LabelWithTooltip htmlFor="workModel" label="Remote / Hybrid Work?" tooltip="Affects OHSA liability (home safety) and IT security policies." />
                                <select name="workModel" value={profileData.workModel || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                    <option value="">Select...</option>
                                    <option value="On-site">On-site Only</option>
                                    <option value="Remote">Fully Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>
                     </DiagnosticSection>

                     <DiagnosticSection title="Financial & Benefits" icon={CreditCardIcon}>
                        <div className="space-y-4">
                            <div>
                                <LabelWithTooltip htmlFor="salaryAdvances" label="Allow Salary Advances/Loans?" tooltip="Illegal to deduct from salary without specific written agreement (AOD). Policy must specify this." />
                                <select name="salaryAdvances" value={profileData.salaryAdvances || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                    <option value="">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div>
                                <LabelWithTooltip htmlFor="deductionLiability" label="Liability for Damages?" tooltip="Can you deduct for lost laptops/crashes? Only if policy sets procedure for proving negligence." />
                                <select name="deductionLiability" value={profileData.deductionLiability || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                    <option value="">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div>
                                <LabelWithTooltip htmlFor="paidMaternityTraining" label="Funded Maternity/Training?" tooltip="If yes, you need Work-Back Clauses to retain staff or recover costs upon resignation." />
                                <select name="paidMaternityTraining" value={profileData.paidMaternityTraining || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                    <option value="">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                     </DiagnosticSection>

                     <DiagnosticSection title="Discipline & Conduct" icon={UserIcon}>
                        <div className="space-y-4">
                            <div>
                                <LabelWithTooltip htmlFor="criticalOffenses" label="Critical 'Cardinal Sins'?" tooltip="What specific offenses warrant dismissal in YOUR business? (e.g. Dishonesty in Bank vs Safety in Factory)." />
                                <textarea name="criticalOffenses" rows={2} placeholder="e.g. Theft, Safety Violations, Intoxication" value={profileData.criticalOffenses || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1" />
                            </div>
                            <div>
                                <LabelWithTooltip htmlFor="probationPeriod" label="Probation Period" tooltip="Probation requires specific review meetings. Missing these makes dismissal difficult." />
                                <input type="text" name="probationPeriod" placeholder="e.g. 3 months" value={profileData.probationPeriod || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1" />
                            </div>
                            <div>
                                <LabelWithTooltip htmlFor="officeRomanceDisclosure" label="Office Romances?" tooltip="Require disclosure to prevent harassment claims." />
                                <select name="officeRomanceDisclosure" value={profileData.officeRomanceDisclosure || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                    <option value="">Select...</option>
                                    <option value="Yes">Disclosure Required</option>
                                    <option value="No">No Policy</option>
                                </select>
                            </div>
                        </div>
                     </DiagnosticSection>

                     <DiagnosticSection title="Tech & Privacy" icon={ShieldCheckIcon}>
                        <div className="space-y-4">
                            <div>
                                <LabelWithTooltip htmlFor="surveillanceMonitoring" label="Monitor Emails/Calls/Cams?" tooltip="RICA requires written consent. The IT Policy will serve as this consent." />
                                <select name="surveillanceMonitoring" value={profileData.surveillanceMonitoring || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                    <option value="">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div>
                                <LabelWithTooltip htmlFor="byodPolicy" label="BYOD (Personal Phones)?" tooltip="Crucial for claiming ownership of client data (IP) on personal devices." />
                                <select name="byodPolicy" value={profileData.byodPolicy || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                    <option value="">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <LabelWithTooltip htmlFor="socialMediaRestrictions" label="Social Media Links?" tooltip="Regulate conduct if staff link profile to company." />
                                    <select name="socialMediaRestrictions" value={profileData.socialMediaRestrictions || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                        <option value="">Select...</option>
                                        <option value="Yes">Restrict</option>
                                        <option value="No">Allow</option>
                                    </select>
                                </div>
                                <div>
                                    <LabelWithTooltip htmlFor="moonlightingAllowed" label="Moonlighting?" tooltip="Define 'conflict of interest' for second jobs." />
                                    <select name="moonlightingAllowed" value={profileData.moonlightingAllowed || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                                        <option value="">Select...</option>
                                        <option value="Yes">Allowed</option>
                                        <option value="No">Prohibited/Permission Req</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                     </DiagnosticSection>
                 </div>
             )}
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
