
import React, { useState } from 'react';
import { INDUSTRIES } from '../constants';
import type { CompanyProfile } from '../types';

interface InitialProfileSetupProps {
  onProfileSubmit: (profileData: CompanyProfile) => void;
  userEmail: string;
}

const InitialProfileSetup: React.FC<InitialProfileSetupProps> = ({ onProfileSubmit, userEmail }) => {
    const [formData, setFormData] = useState<CompanyProfile>({
        companyName: '',
        industry: '',
        companySize: '',
        address: '',
        companyUrl: '',
        summary: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof CompanyProfile, string>>>({});

    const validate = () => {
        const newErrors: Partial<Record<keyof CompanyProfile, string>> = {};
        let isValid = true;
        
        if (!formData.companyName.trim()) { newErrors.companyName = 'Company name is required.'; isValid = false; }
        if (!formData.industry) { newErrors.industry = 'Please select an industry.'; isValid = false; }
        if (!formData.companySize) { newErrors.companySize = 'Please select your company size.'; isValid = false; }
        if (!formData.address.trim()) { newErrors.address = 'Company address is required.'; isValid = false; }
        if (!formData.companyUrl.trim()) { newErrors.companyUrl = 'Company website is required.'; isValid = false; }
        else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.companyUrl)) {
            newErrors.companyUrl = 'Please enter a valid URL.';
            isValid = false;
        }
        if (!formData.summary.trim()) { newErrors.summary = 'A brief summary is required.'; isValid = false; }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onProfileSubmit(formData);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof CompanyProfile]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    const isFormInvalid = !formData.companyName.trim() || !formData.industry || !formData.companySize || !formData.address.trim() || !formData.companyUrl.trim() || !formData.summary.trim() || Object.values(errors).some(e => e);


    return (
        <div className="min-h-screen bg-light text-secondary flex flex-col">
            <header className="bg-white shadow-sm py-6">
                <div className="container mx-auto flex justify-center items-center">
                    <img
                        src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png"
                        alt="Ingcweti Logo"
                        className="h-12"
                    />
                </div>
            </header>
            <main className="flex-grow container mx-auto flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-2xl">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-secondary mb-2">Welcome to Ingcweti!</h1>
                            <p className="text-gray-600 mb-6">Let's complete your company profile to get started. This helps us tailor documents for you.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                           <div>
                             <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company's Legal Name</label>
                             <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="e.g., ABC (Pty) Ltd" required className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`} />
                             {errors.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                                    <select id="industry" name="industry" value={formData.industry} onChange={handleInputChange} required className={`mt-1 w-full p-3 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}>
                                        <option value="" disabled>Choose an industry...</option>
                                        {INDUSTRIES.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
                                    </select>
                                    {errors.industry && <p className="text-red-600 text-sm mt-1">{errors.industry}</p>}
                               </div>
                               <div>
                                    <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">Company Size</label>
                                    <select id="companySize" name="companySize" value={formData.companySize} onChange={handleInputChange} required className={`mt-1 w-full p-3 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary ${errors.companySize ? 'border-red-500' : 'border-gray-300'}`}>
                                        <option value="" disabled>Select a size...</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="500+">500+ employees</option>
                                    </select>
                                    {errors.companySize && <p className="text-red-600 text-sm mt-1">{errors.companySize}</p>}
                               </div>
                           </div>
                           <div>
                             <label htmlFor="address" className="block text-sm font-medium text-gray-700">Company Address</label>
                             <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="e.g., 123 Tech Street, Cape Town, 8001" required className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.address ? 'border-red-500' : 'border-gray-300'}`} />
                             {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                           </div>
                           <div>
                             <label htmlFor="companyUrl" className="block text-sm font-medium text-gray-700">Company Website</label>
                             <input type="url" id="companyUrl" name="companyUrl" value={formData.companyUrl} onChange={handleInputChange} placeholder="e.g., https://www.yourcompany.co.za" required className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyUrl ? 'border-red-500' : 'border-gray-300'}`} />
                             {errors.companyUrl && <p className="text-red-600 text-sm mt-1">{errors.companyUrl}</p>}
                           </div>
                           <div>
                             <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Brief Company Summary</label>
                             <textarea id="summary" name="summary" rows={3} value={formData.summary} onChange={handleInputChange} placeholder="e.g., A leading provider of widgets in the manufacturing sector, committed to quality and innovation." required className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.summary ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                             {errors.summary && <p className="text-red-600 text-sm mt-1">{errors.summary}</p>}
                           </div>

                            <button type="submit" disabled={isFormInvalid} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                                Save & Continue
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <footer className="bg-secondary text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm text-gray-300">© {new Date().getFullYear()} Ingcweti. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default InitialProfileSetup;
