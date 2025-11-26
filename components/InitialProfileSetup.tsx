
import React, { useState } from 'react';
import { INDUSTRIES } from '../constants';
import type { CompanyProfile } from '../types';
import { useUIContext } from '../contexts/UIContext';
import { LoadingIcon, CheckIcon } from './Icons';

interface InitialProfileSetupProps {
  onProfileSubmit: (profileData: CompanyProfile, name: string) => Promise<void>;
  userEmail: string;
  userName?: string;
  onSkip: () => void;
}

const InitialProfileSetup: React.FC<InitialProfileSetupProps> = ({ onProfileSubmit, userEmail, userName, onSkip }) => {
    const { setToastMessage } = useUIContext();
    const [name, setName] = useState(userName || '');
    const [formData, setFormData] = useState<CompanyProfile>({
        companyName: '',
        industry: '',
        // Initialize other fields as empty strings to satisfy type, 
        // but we won't ask for them here (Progressive Profiling)
        companySize: '',
        address: '',
        companyUrl: '',
        summary: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);

    const validateField = (fieldName: string, value: string) => {
        let error = '';
        if (fieldName === 'name' && !value.trim()) error = 'Your name is required.';
        if (fieldName === 'companyName' && !value.trim()) error = 'Company name is required.';
        if (fieldName === 'industry' && !value) error = 'Please select an industry.';
        
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
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const allTouched: Record<string, boolean> = { name: true, companyName: true, industry: true };
        setTouched(allTouched);

        let isFormValid = validateField('name', name);
        isFormValid = validateField('companyName', formData.companyName) && isFormValid;
        isFormValid = validateField('industry', formData.industry) && isFormValid;
        
        if (isFormValid) {
            setIsSaving(true);
            try {
                await onProfileSubmit(formData, name);
            } catch (error: any) {
                console.error("Error saving profile:", error);
                setToastMessage("Failed to save profile. Please try again.");
            } finally {
                setIsSaving(false);
            }
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
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-secondary mb-2">Welcome to HR CoPilot!</h1>
                            <p className="text-gray-600 mb-6">Let's get the basics to set up your dashboard. We'll ask for more details only when you need them.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                           <div>
                             <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                             <ValidatedInputWrapper error={errors.name} touched={touched.name} value={name}>
                                <input type="text" id="name" name="name" value={name} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g., John Doe" required className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                             </ValidatedInputWrapper>
                             {errors.name && touched.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                           </div>

                           <div>
                             <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company's Legal Name</label>
                             <ValidatedInputWrapper error={errors.companyName} touched={touched.companyName} value={formData.companyName}>
                                <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g., ABC (Pty) Ltd" required className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyName && touched.companyName ? 'border-red-500' : 'border-gray-300'}`} />
                             </ValidatedInputWrapper>
                             {errors.companyName && touched.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
                           </div>
                           
                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                                <ValidatedInputWrapper error={errors.industry} touched={touched.industry} value={formData.industry}>
                                    <select id="industry" name="industry" value={formData.industry} onChange={handleInputChange} onBlur={handleBlur} required className={`mt-1 w-full p-3 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary ${errors.industry && touched.industry ? 'border-red-500' : 'border-gray-300'}`}>
                                        <option value="" disabled>Choose an industry...</option>
                                        {INDUSTRIES.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
                                    </select>
                                </ValidatedInputWrapper>
                                {errors.industry && touched.industry && <p className="text-red-600 text-sm mt-1">{errors.industry}</p>}
                            </div>

                            <button type="submit" disabled={isSaving} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                                {isSaving ? <><LoadingIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /> Setting up...</> : 'Get Started'}
                            </button>
                             <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={onSkip}
                                    disabled={isSaving}
                                    className="text-sm font-semibold text-gray-600 hover:text-primary hover:underline disabled:opacity-50"
                                >
                                    Skip setup for now
                                </button>
                            </div>
                        </form>
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
