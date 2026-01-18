
import React, { useState, useEffect } from 'react';
import { INDUSTRIES } from '../constants';
import type { CompanyProfile } from '../types';
import { useUIContext } from '../contexts/UIContext';
import { LoadingIcon, CheckIcon, InfoIcon } from './Icons';

interface InitialProfileSetupProps {
  onProfileSubmit: (profileData: CompanyProfile, name: string) => Promise<void>;
  userEmail: string;
  userName?: string;
  onSkip: () => void;
  initialProfile?: CompanyProfile; // Added to support re-onboarding with existing data
}

const COMPANY_VOICES = [
  'Formal & Corporate',
  'Modern & Friendly',
  'Direct & No-Nonsense',
];

const InitialProfileSetup: React.FC<InitialProfileSetupProps> = ({ onProfileSubmit, userEmail, userName, onSkip, initialProfile }) => {
    const { setToastMessage } = useUIContext();
    const [step, setStep] = useState<1 | 2>(1);
    const [name, setName] = useState(userName || '');
    const [formData, setFormData] = useState<CompanyProfile>({
        companyName: initialProfile?.companyName || '',
        industry: initialProfile?.industry || '',
        companySize: initialProfile?.companySize || '',
        address: initialProfile?.address || '',
        companyUrl: initialProfile?.companyUrl || '',
        summary: initialProfile?.summary || '',
        companyVoice: initialProfile?.companyVoice || '',
        // Structural Defaults
        bargainingCouncil: initialProfile?.bargainingCouncil || '',
        unionized: initialProfile?.unionized || '',
        retirementAge: initialProfile?.retirementAge || '',
        disciplinaryAuthority: initialProfile?.disciplinaryAuthority || '',
        familyEmployment: initialProfile?.familyEmployment || ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);

    const validateField = (fieldName: string, value: string) => {
        let error = '';
        if (fieldName === 'name' && !value.trim()) error = 'Your name is required.';
        if (fieldName === 'companyName' && !value.trim()) error = 'Company name is required.';
        if (fieldName === 'industry' && !value) error = 'Please select an industry.';
        if (fieldName === 'companyVoice' && !value) error = 'Please select a company voice.';
        
        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return !error;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setName(value);
        } else {
            const fieldName = name as keyof CompanyProfile;
            setFormData(prev => ({ ...prev, [fieldName]: value }));
        }
        
        if (touched[name]) {
            validateField(name, value);
        }
    };
    
    const handleNext = () => {
        const allTouched: Record<string, boolean> = { name: true, companyName: true, industry: true, companyVoice: true };
        setTouched(allTouched);

        let isFormValid = validateField('name', name);
        isFormValid = validateField('companyName', formData.companyName) && isFormValid;
        isFormValid = validateField('industry', formData.industry) && isFormValid;
        isFormValid = validateField('companyVoice', formData.companyVoice || '') && isFormValid;

        if (isFormValid) {
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onProfileSubmit(formData, name);
        } catch (error: any) {
            console.error("Error saving profile:", error);
            setToastMessage("Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const ValidatedInputWrapper: React.FC<{ error?: string; value?: string; touched?: boolean; children: React.ReactNode }> = ({ error, value, touched, children }) => {
        const isValid = touched && !error && value && value.length > 0;
        return (
            <div className="relative">
                {children}
                {isValid && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                    </div>
                )}
            </div>
        );
    };

    const LabelWithTooltip: React.FC<{ htmlFor: string; label: string; tooltip: string }> = ({ htmlFor, label, tooltip }) => (
        <div className="flex items-center mb-1">
            <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative flex items-center group ml-2">
                <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                    {tooltip}
                    <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-light text-secondary flex flex-col">
            <header className="bg-white shadow-sm py-6">
                <div className="container mx-auto flex justify-center items-center">
                    <img
                        src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png"
                        alt="HR CoPilot Logo"
                        className="h-12"
                    />
                </div>
            </header>
            <main className="flex-grow container mx-auto flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-xl">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        
                        {step === 1 && (
                            <>
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-secondary mb-2">{initialProfile ? 'Update Company Setup' : 'Welcome to HR CoPilot!'}</h1>
                                    <p className="text-gray-600 mb-6">{initialProfile ? 'Update your core structural details.' : "Let's get the basics to set up your dashboard."}</p>
                                </div>
                                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
                                    <div>
                                        <LabelWithTooltip htmlFor="name" label="Your Name" tooltip="Used for account administration and audit logs as the primary user." />
                                        <ValidatedInputWrapper error={errors.name} touched={touched.name} value={name}>
                                            <input type="text" id="name" name="name" value={name} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g., John Doe" required className={`w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                                        </ValidatedInputWrapper>
                                        {errors.name && touched.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <LabelWithTooltip htmlFor="companyName" label="Company's Legal Name" tooltip="Crucial for legal validity. This name will appear on all contracts and policies as the 'Employer' defined in the BCEA and LRA." />
                                        <ValidatedInputWrapper error={errors.companyName} touched={touched.companyName} value={formData.companyName}>
                                            <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g., ABC (Pty) Ltd" required className={`w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyName && touched.companyName ? 'border-red-500' : 'border-gray-300'}`} />
                                        </ValidatedInputWrapper>
                                        {errors.companyName && touched.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
                                    </div>
                                    
                                    <div>
                                        <LabelWithTooltip htmlFor="industry" label="Industry" tooltip="Determines if specific Sectoral Determinations or Bargaining Council agreements might apply to your business." />
                                        <ValidatedInputWrapper error={errors.industry} touched={touched.industry} value={formData.industry}>
                                            <select id="industry" name="industry" value={formData.industry} onChange={handleInputChange} onBlur={handleBlur} required className={`w-full p-3 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary ${errors.industry && touched.industry ? 'border-red-500' : 'border-gray-300'}`}>
                                                <option value="" disabled>Choose an industry...</option>
                                                {INDUSTRIES.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
                                            </select>
                                        </ValidatedInputWrapper>
                                        {errors.industry && touched.industry && <p className="text-red-600 text-sm mt-1">{errors.industry}</p>}
                                    </div>

                                    <div>
                                        <LabelWithTooltip htmlFor="companyVoice" label="Company Voice (Policy Tone)" tooltip="Sets the tone of your policies. While laws are fixed, how you communicate them impacts company culture (King IV Report)." />
                                        <ValidatedInputWrapper error={errors.companyVoice} touched={touched.companyVoice} value={formData.companyVoice}>
                                            <select id="companyVoice" name="companyVoice" value={formData.companyVoice || ''} onChange={handleInputChange} onBlur={handleBlur} required className={`w-full p-3 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary ${errors.companyVoice && touched.companyVoice ? 'border-red-500' : 'border-gray-300'}`}>
                                                <option value="" disabled>Choose a tone...</option>
                                                {COMPANY_VOICES.map((v) => (<option key={v} value={v}>{v}</option>))}
                                            </select>
                                        </ValidatedInputWrapper>
                                        {errors.companyVoice && touched.companyVoice && <p className="text-red-600 text-sm mt-1">{errors.companyVoice}</p>}
                                    </div>

                                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center">
                                        Next
                                    </button>
                                    <div className="text-center mt-4">
                                        <button type="button" onClick={onSkip} className="text-sm font-semibold text-gray-600 hover:text-primary hover:underline">
                                            {initialProfile ? 'Cancel' : 'Skip setup for now'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="text-center mb-6">
                                    <h1 className="text-xl font-bold text-secondary mb-2">Structural Details</h1>
                                    <p className="text-sm text-gray-600">These details define your company's legal framework. Accurate answers here ensure your policies are valid.</p>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5">
                                        <div>
                                            <LabelWithTooltip htmlFor="bargainingCouncil" label="Bargaining Council / Sectoral Determination?" tooltip="If you fall under a Council (e.g. MEIBC), their agreements override the BCEA." />
                                            <input type="text" id="bargainingCouncil" name="bargainingCouncil" placeholder="e.g. MIBCO, or 'No'" value={formData.bargainingCouncil || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <LabelWithTooltip htmlFor="unionized" label="Union Recognition?" tooltip="Recognized unions require consultation for policy changes (LRA s189/s197)." />
                                                <select id="unionized" name="unionized" value={formData.unionized || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                                                    <option value="">Select...</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </div>
                                            <div>
                                                <LabelWithTooltip htmlFor="companySize" label="Headcount" tooltip="50+ employees designates you for Employment Equity Act (EEA) compliance." />
                                                <select id="companySize" name="companySize" value={formData.companySize || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                                                    <option value="">Select...</option>
                                                    <option value="1-10">1-10</option>
                                                    <option value="11-50">11-50</option>
                                                    <option value="51-200">51-200 (Designated)</option>
                                                    <option value="201-500">201-500 (Designated)</option>
                                                    <option value="500+">500+ (Designated)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <LabelWithTooltip htmlFor="retirementAge" label="Retirement Age" tooltip="Forced retirement is Unfair Dismissal (LRA s187) unless an age is agreed in policy." />
                                                <input type="text" id="retirementAge" name="retirementAge" placeholder="e.g. 65" value={formData.retirementAge || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                                            </div>
                                            <div>
                                                <LabelWithTooltip htmlFor="familyEmployment" label="Family Employed?" tooltip="Helps prevent 'Inconsistent Discipline' claims (LRA Schedule 8)." />
                                                <select id="familyEmployment" name="familyEmployment" value={formData.familyEmployment || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                                                    <option value="">Select...</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <LabelWithTooltip htmlFor="disciplinaryAuthority" label="Who handles Discipline?" tooltip="If Line Managers, policies must be simplified to avoid procedural errors." />
                                            <select id="disciplinaryAuthority" name="disciplinaryAuthority" value={formData.disciplinaryAuthority || ''} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                                                <option value="">Select...</option>
                                                <option value="HR">HR Dept</option>
                                                <option value="Line Managers">Line Managers</option>
                                                <option value="Owner">Owner/Director</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-md hover:bg-gray-300 transition-colors">
                                            Back
                                        </button>
                                        <button type="submit" disabled={isSaving} className="w-2/3 bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex items-center justify-center">
                                            {isSaving ? <><LoadingIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /> Saving...</> : (initialProfile ? 'Update Profile' : 'Finish Setup')}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <footer className="bg-secondary text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm text-gray-300">© {new Date().getFullYear()} HR CoPilot. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default InitialProfileSetup;
