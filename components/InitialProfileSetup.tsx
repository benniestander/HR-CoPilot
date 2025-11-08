import React, { useState } from 'react';
import { INDUSTRIES } from '../constants';

interface InitialProfileSetupProps {
  onProfileSubmit: (profileData: { companyName: string; industry: string; }) => void;
  userEmail: string;
}

const InitialProfileSetup: React.FC<InitialProfileSetupProps> = ({ onProfileSubmit, userEmail }) => {
    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');
    const [errors, setErrors] = useState({ companyName: '', industry: '' });

    const validate = () => {
        const newErrors = { companyName: '', industry: '' };
        let isValid = true;
        if (!companyName.trim()) {
            newErrors.companyName = 'Company name is required.';
            isValid = false;
        }
        if (!industry) {
            newErrors.industry = 'Please select an industry.';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onProfileSubmit({ companyName, industry });
        }
    };
    
    const isFormInvalid = !companyName.trim() || !industry;

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
                <div className="w-full max-w-lg">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-secondary mb-2">Welcome, {userEmail}!</h1>
                            <p className="text-gray-600 mb-6">Let's set up your company profile to get started.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                           <div>
                             <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                             <input
                                type="text"
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="e.g., ABC (Pty) Ltd"
                                required
                                className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.companyName && <p className="text-red-600 text-sm text-left mt-1">{errors.companyName}</p>}
                           </div>

                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                                <select
                                    id="industry"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    required
                                    className={`mt-1 w-full p-3 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="" disabled>Choose an industry...</option>
                                    {INDUSTRIES.map((ind) => (
                                      <option key={ind} value={ind}>{ind}</option>
                                    ))}
                                </select>
                                {errors.industry && <p className="text-red-600 text-sm text-left mt-1">{errors.industry}</p>}
                           </div>

                            <button
                                type="submit"
                                disabled={isFormInvalid}
                                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                Continue to Subscription
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <footer className="bg-secondary text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <img
                      src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png"
                      alt="Ingcweti Logo"
                      className="h-10 mx-auto mb-4"
                    />
                    <p className="text-sm text-gray-300">© {new Date().getFullYear()} Ingcweti. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default InitialProfileSetup;