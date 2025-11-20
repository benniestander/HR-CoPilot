import React, { useState } from 'react';
import { INDUSTRIES } from '../constants';
import type { CompanyProfile } from '../types';
import { useUIContext } from '../contexts/UIContext';
import { LoadingIcon } from './Icons';

interface InitialProfileSetupProps {
  onProfileSubmit: (profileData: CompanyProfile) => Promise<void>;
  userEmail: string;
  onSkip: () => void;
}

const InitialProfileSetup: React.FC<InitialProfileSetupProps> = ({ onProfileSubmit, userEmail, onSkip }) => {
    const { setToastMessage } = useUIContext();
    const [formData, setFormData] = useState<CompanyProfile>({
        companyName: '',
        industry: '',
        companySize: '',
        address: '',
        companyUrl: '',
        summary: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof CompanyProfile, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof CompanyProfile, boolean>>>({});
    const [isSaving, setIsSaving] = useState(false);

    const validateField = (name: keyof CompanyProfile, value: string) => {
        let error = '';
        if (name === 'companyName' && !value.trim()) error = 'Company name is required.';
        if (name === 'industry' && !value) error = 'Please select an industry.';
        if (name === 'companyUrl' && value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
            error = 'Please enter a valid URL.';
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof CompanyProfile;
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        validateField(fieldName, value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof CompanyProfile;
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        if (touched[fieldName]) {
            validateField(fieldName, value);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key as keyof CompanyProfile] = true;
            return acc;
        }, {} as Partial<Record<keyof CompanyProfile, boolean>>);
        setTouched(allTouched);

        const isFormValid = (Object.keys(formData) as Array<keyof CompanyProfile>).every(key =>
            validateField(key, formData[key] || '')
        );
        
        if (isFormValid) {
            setIsSaving(true);
            try {
                await onProfileSubmit(formData);
            } catch (error: any) {
                console.error("Error saving profile:", error);
                setToastMessage("Failed to save profile. Please try again.");
            } finally {
                setIsSaving(false);
            }
        }
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
                <div className="w-full max-w-2xl">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-secondary mb-2">Welcome to HR CoPilot!</h1>
                            <p className="text-gray-600 mb-6">Let's complete your company profile to get started. This helps us tailor documents for you.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                           <div>
                             <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company's Legal Name</label>
                             <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g., ABC (Pty) Ltd" required className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyName && touched.companyName ? 'border-red-500' : 'border-gray-300'}`} />
                             {errors.companyName && touched.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                                    <select id="industry" name="industry" value={formData.industry} onChange={handleInputChange} onBlur={handleBlur} required className={`mt-1 w-full p-3 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary ${errors.industry && touched.industry ? 'border-red-500' : 'border-gray-300'}`}>
                                        <option value="" disabled>Choose an industry...</option>
                                        {INDUSTRIES.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
                                    </select>
                                    {errors.industry && touched.industry && <p className="text-red-600 text-sm mt-1">{errors.industry}</p>}
                               </div>
                               <div>
                                    <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">Company Size</label>
                                    <select id="companySize" name="companySize" value={formData.companySize} onChange={handleInputChange} onBlur={handleBlur} className={`mt-1 w-full p-3 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary border-gray-300`}>
                                        <option value="">Select a size...</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="500+">500+ employees</option>
                                    </select>
                               </div>
                           </div>
                           <div>
                             <label htmlFor="address" className="block text-sm font-medium text-gray-700">Company Address</label>
                             <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g., 123 Tech Street, Cape Town, 8001" className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary border-gray-300`} />
                           </div>
                           <div>
                             <label htmlFor="companyUrl" className="block text-sm font-medium text-gray-700">Company Website</label>
                             <input type="url" id="companyUrl" name="companyUrl" value={formData.companyUrl} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g., https://www.yourcompany.co.za" className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyUrl && touched.companyUrl ? 'border-red-500' : 'border-gray-300'}`} />
                             {errors.companyUrl && touched.companyUrl && <p className="text-red-600 text-sm mt-1">{errors.companyUrl}</p>}
                           </div>
                           <div>
                             <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Brief Company Summary</label>
                             <textarea id="summary" name="summary" rows={3} value={formData.summary} onChange={handleInputChange} onBlur={handleBlur} placeholder="e.g., A leading provider of widgets in the manufacturing sector, committed to quality and innovation." className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary border-gray-300`}></textarea>
                           </div>

                            <button type="submit" disabled={isSaving} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                                {isSaving ? <><LoadingIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /> Saving...</> : 'Save & Continue'}
                            </button>
                             <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={onSkip}
                                    disabled={isSaving}
                                    className="text-sm font-semibold text-gray-600 hover:text-primary hover:underline disabled:opacity-50"
                                >
                                    Complete profile later
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