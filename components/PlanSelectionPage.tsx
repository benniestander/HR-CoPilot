
import React, { useState } from 'react';
import { CheckIcon } from './Icons';

interface PlanSelectionPageProps {
  onStartAuthFlow: (flow: 'signup' | 'payg_signup', email: string, details?: { name: string, contactNumber: string }) => void;
  onShowLogin: () => void;
  onShowPrivacyPolicy: () => void;
  onShowTerms: () => void;
}

const PlanSelectionPage: React.FC<PlanSelectionPageProps> = ({ onStartAuthFlow, onShowLogin, onShowPrivacyPolicy, onShowTerms }) => {
    const [proEmail, setProEmail] = useState('');
    const [paygData, setPaygData] = useState({ name: '', email: '', contactNumber: '' });
    
    const [proEmailError, setProEmailError] = useState('');
    const [paygErrors, setPaygErrors] = useState({ name: '', email: '', contactNumber: '' });

    const [loading, setLoading] = useState<'none' | 'pro' | 'payg'>('none');

    const features = [
        'Unlimited HR Policy Generation',
        'Unlimited HR Form Generation',
        'AI-Powered Policy Updates & Analysis',
        'Custom Compliance Checklists',
        'Secure Document History',
        'Priority Support',
    ];

    const validateField = (form: 'pro' | 'payg', name: string, value: string) => {
        let error = '';
        if (!value.trim()) {
            error = 'This field is required.';
        } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Please enter a valid email address.';
        } else if (name === 'contactNumber' && !/^\d{10}$/.test(value.replace(/\s/g, ''))) {
            error = 'Please enter a valid 10-digit phone number.';
        }

        if (form === 'pro') {
            setProEmailError(error);
        } else {
            setPaygErrors(prev => ({ ...prev, [name]: error }));
        }
        return !error;
    };


    const handleProSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateField('pro', 'email', proEmail)) return;
        setLoading('pro');
        setTimeout(() => onStartAuthFlow('signup', proEmail), 500);
    };

    const handlePaygSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isNameValid = validateField('payg', 'name', paygData.name);
        const isEmailValid = validateField('payg', 'email', paygData.email);
        const isContactValid = validateField('payg', 'contactNumber', paygData.contactNumber);
        
        if (!isNameValid || !isEmailValid || !isContactValid) return;
        
        setLoading('payg');
        setTimeout(() => onStartAuthFlow('payg_signup', paygData.email, { name: paygData.name, contactNumber: paygData.contactNumber }), 500);
    };

    return (
        <div className="min-h-screen bg-light text-secondary flex flex-col">
            <header className="bg-white shadow-sm py-6">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="Ingcweti Logo" className="h-12" />
                    <div className="text-sm">
                        <span>Already have an account? </span>
                        <button onClick={onShowLogin} className="font-semibold text-primary hover:underline">Sign In</button>
                    </div>
                </div>
            </header>
            <main className="flex-grow container mx-auto flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-5xl">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-secondary mb-3">The Right Plan For Your Business</h1>
                        <p className="text-lg text-gray-600">Start generating compliant HR documents in minutes.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* PAYG Plan */}
                        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex flex-col">
                            <h2 className="text-2xl font-bold text-secondary">Pay-As-You-Go</h2>
                            <p className="text-gray-600 mb-6">Only pay for the documents you need, when you need them.</p>
                            <ul className="space-y-3 flex-grow text-gray-700">
                                <li className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" /><span>No subscription required</span></li>
                                <li className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" /><span>Access to all document types</span></li>
                                <li className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" /><span>Top up your credit anytime</span></li>
                            </ul>
                            <form onSubmit={handlePaygSubmit} className="space-y-4 mt-6">
                                <div>
                                    <input type="text" value={paygData.name} onChange={e => { setPaygData({...paygData, name: e.target.value}); validateField('payg', 'name', e.target.value);}} placeholder="Your Name" className={`w-full p-3 border rounded-md shadow-sm ${paygErrors.name ? 'border-red-500' : 'border-gray-300'}`} />
                                    {paygErrors.name && <p className="text-red-600 text-xs mt-1">{paygErrors.name}</p>}
                                </div>
                                <div>
                                    <input type="email" value={paygData.email} onChange={e => { setPaygData({...paygData, email: e.target.value}); validateField('payg', 'email', e.target.value);}} placeholder="Your Email Address" className={`w-full p-3 border rounded-md shadow-sm ${paygErrors.email ? 'border-red-500' : 'border-gray-300'}`} />
                                    {paygErrors.email && <p className="text-red-600 text-xs mt-1">{paygErrors.email}</p>}
                                </div>
                                <div>
                                    <input type="tel" value={paygData.contactNumber} onChange={e => { setPaygData({...paygData, contactNumber: e.target.value}); validateField('payg', 'contactNumber', e.target.value);}} placeholder="Contact Number (e.g. 0821234567)" className={`w-full p-3 border rounded-md shadow-sm ${paygErrors.contactNumber ? 'border-red-500' : 'border-gray-300'}`} />
                                    {paygErrors.contactNumber && <p className="text-red-600 text-xs mt-1">{paygErrors.contactNumber}</p>}
                                </div>
                                <button type="submit" disabled={loading === 'payg'} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400">
                                    {loading === 'payg' ? 'Sending Link...' : 'Sign Up for PAYG'}
                                </button>
                            </form>
                        </div>
                        
                        {/* Pro Plan */}
                        <div className="bg-white p-8 rounded-lg shadow-md border-b-4 border-primary flex flex-col">
                            <h2 className="text-2xl font-bold text-secondary">Ingcweti Pro</h2>
                            <p className="text-4xl font-bold text-secondary my-2">R747</p>
                            <p className="text-gray-600 mb-6">One-time payment for 12 months of full access.</p>
                            <ul className="space-y-3 flex-grow text-gray-700">
                                {features.map((feature, index) => (
                                <li key={index} className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" /><span>{feature}</span></li>
                                ))}
                            </ul>
                            <form onSubmit={handleProSubmit} className="space-y-4 mt-6">
                                <div>
                                    <input type="email" value={proEmail} onChange={e => { setProEmail(e.target.value); validateField('pro', 'email', e.target.value); }} placeholder="your-email@example.com" className={`w-full p-3 border rounded-md shadow-sm ${proEmailError ? 'border-red-500' : 'border-gray-300'}`} />
                                    {proEmailError && <p className="text-red-600 text-xs mt-1">{proEmailError}</p>}
                                </div>
                                <button type="submit" disabled={loading === 'pro'} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
                                    {loading === 'pro' ? 'Sending Link...' : 'Sign Up for Pro'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="bg-secondary text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="Ingcweti Logo" className="h-10 mx-auto mb-4" />
                    <div className="flex justify-center space-x-6 mb-4">
                        <button onClick={onShowPrivacyPolicy} className="text-sm text-gray-300 hover:text-white hover:underline">
                            Privacy Policy
                        </button>
                        <button onClick={onShowTerms} className="text-sm text-gray-300 hover:text-white hover:underline">
                            Terms of Use
                        </button>
                    </div>
                    <p className="text-sm text-gray-300">© {new Date().getFullYear()} Ingcweti. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PlanSelectionPage;
