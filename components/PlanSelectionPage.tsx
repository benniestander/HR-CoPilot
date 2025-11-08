import React, { useState } from 'react';
import { CheckIcon } from './Icons';

interface PlanSelectionPageProps {
  onStartAuthFlow: (flow: 'signup' | 'trial_signup', email: string, details?: { name: string, contactNumber: string }) => void;
  onShowLogin: () => void;
}

const PlanSelectionPage: React.FC<PlanSelectionPageProps> = ({ onStartAuthFlow, onShowLogin }) => {
    const [proEmail, setProEmail] = useState('');
    const [trialData, setTrialData] = useState({ name: '', email: '', contactNumber: '' });
    
    const [proEmailError, setProEmailError] = useState('');
    const [trialErrors, setTrialErrors] = useState({ name: '', email: '', contactNumber: '' });

    const [loading, setLoading] = useState<'none' | 'pro' | 'trial'>('none');

    const features = [
        'Unlimited HR Policy Generation',
        'Unlimited HR Form Generation',
        'AI-Powered Policy Updates & Analysis',
        'Custom Compliance Checklists',
        'Secure Document History',
        'Priority Support',
    ];

    const validateField = (form: 'pro' | 'trial', name: string, value: string) => {
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
            setTrialErrors(prev => ({ ...prev, [name]: error }));
        }
        return !error;
    };


    const handleProSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateField('pro', 'email', proEmail)) return;
        setLoading('pro');
        setTimeout(() => onStartAuthFlow('signup', proEmail), 500);
    };

    const handleTrialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isNameValid = validateField('trial', 'name', trialData.name);
        const isEmailValid = validateField('trial', 'email', trialData.email);
        const isContactValid = validateField('trial', 'contactNumber', trialData.contactNumber);
        
        if (!isNameValid || !isEmailValid || !isContactValid) return;
        
        setLoading('trial');
        setTimeout(() => onStartAuthFlow('trial_signup', trialData.email, { name: trialData.name, contactNumber: trialData.contactNumber }), 500);
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
                        {/* Trial Plan */}
                        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex flex-col">
                            <h2 className="text-2xl font-bold text-secondary">Free Trial</h2>
                            <p className="text-gray-600 mb-6">Generate one policy to see how it works.</p>
                            <ul className="space-y-3 flex-grow text-gray-700">
                                <li className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" /><span>Generate 1 Free Policy</span></li>
                                <li className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" /><span>Access to All Policy Types</span></li>
                                <li className="flex items-start"><CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" /><span>No credit card required</span></li>
                            </ul>
                            <form onSubmit={handleTrialSubmit} className="space-y-4 mt-6">
                                <div>
                                    <input type="text" value={trialData.name} onChange={e => { setTrialData({...trialData, name: e.target.value}); validateField('trial', 'name', e.target.value);}} placeholder="Your Name" className={`w-full p-3 border rounded-md shadow-sm ${trialErrors.name ? 'border-red-500' : 'border-gray-300'}`} />
                                    {trialErrors.name && <p className="text-red-600 text-xs mt-1">{trialErrors.name}</p>}
                                </div>
                                <div>
                                    <input type="email" value={trialData.email} onChange={e => { setTrialData({...trialData, email: e.target.value}); validateField('trial', 'email', e.target.value);}} placeholder="Your Email Address" className={`w-full p-3 border rounded-md shadow-sm ${trialErrors.email ? 'border-red-500' : 'border-gray-300'}`} />
                                    {trialErrors.email && <p className="text-red-600 text-xs mt-1">{trialErrors.email}</p>}
                                </div>
                                <div>
                                    <input type="tel" value={trialData.contactNumber} onChange={e => { setTrialData({...trialData, contactNumber: e.target.value}); validateField('trial', 'contactNumber', e.target.value);}} placeholder="Contact Number (e.g. 0821234567)" className={`w-full p-3 border rounded-md shadow-sm ${trialErrors.contactNumber ? 'border-red-500' : 'border-gray-300'}`} />
                                    {trialErrors.contactNumber && <p className="text-red-600 text-xs mt-1">{trialErrors.contactNumber}</p>}
                                </div>
                                <button type="submit" disabled={loading === 'trial'} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400">
                                    {loading === 'trial' ? 'Sending Link...' : 'Start Free Trial'}
                                </button>
                            </form>
                        </div>
                        
                        {/* Pro Plan */}
                        <div className="bg-white p-8 rounded-lg shadow-md border-b-4 border-primary flex flex-col">
                            <h2 className="text-2xl font-bold text-secondary">Ingcweti Pro</h2>
                            <p className="text-4xl font-bold text-secondary my-2">R500</p>
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
                    <p className="text-sm text-gray-300">© {new Date().getFullYear()} Ingcweti. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PlanSelectionPage;