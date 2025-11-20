
import React, { useState } from 'react';
import { CheckIcon, GoogleIcon } from './Icons';

interface PlanSelectionPageProps {
  onStartAuthFlow: (flow: 'signup' | 'payg_signup', email: string, details: { password: string, name?: string, contactNumber?: string }) => void;
  onStartGoogleAuthFlow: (flow: 'signup' | 'payg_signup') => Promise<void>;
  onShowLogin: () => void;
  onShowPrivacyPolicy: () => void;
  onShowTerms: () => void;
}

const PlanSelectionPage: React.FC<PlanSelectionPageProps> = ({ onStartAuthFlow, onStartGoogleAuthFlow, onShowLogin, onShowPrivacyPolicy, onShowTerms }) => {
    const [selectedPlan, setSelectedPlan] = useState<'pro' | 'payg'>('pro');
    
    const [proData, setProData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [paygData, setPaygData] = useState({ name: '', email: '', contactNumber: '', password: '', confirmPassword: '' });
    
    const [proErrors, setProErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [paygErrors, setPaygErrors] = useState({ name: '', email: '', contactNumber: '', password: '', confirmPassword: '' });

    const [loading, setLoading] = useState<'none' | 'pro' | 'payg' | 'google_pro' | 'google_payg'>('none');
    
    const proFeatures = [
        'Unlimited HR Policy Generation',
        'Unlimited HR Form Generation',
        'AI-Powered Policy Updates & Analysis',
        'Custom Compliance Checklists',
        'Secure Document History',
        'Priority Support',
    ];
    
    const commonFeatures = [
        'Access to all document templates',
        'AI-powered document generation',
        'Secure cloud document storage',
        'Download as Word (.doc) or Excel',
    ];

    const validateField = (form: 'pro' | 'payg', name: keyof typeof proData | keyof typeof paygData, value: string) => {
        let error = '';
        const data = form === 'pro' ? proData : paygData;

        if (!value.trim()) {
            error = 'This field is required.';
        } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Please enter a valid email address.';
        } else if (name === 'contactNumber' && !/^\d{10}$/.test(value.replace(/\s/g, ''))) {
            error = 'Please enter a valid 10-digit phone number.';
        } else if (name === 'password' && value.length < 6) {
            error = 'Password must be at least 6 characters long.';
        } else if (name === 'confirmPassword' && value !== data.password) {
            error = 'Passwords do not match.';
        }

        if (form === 'pro') {
            setProErrors(prev => ({ ...prev, [name as keyof typeof proErrors]: error }));
        } else {
            setPaygErrors(prev => ({ ...prev, [name as keyof typeof paygErrors]: error }));
        }
        return !error;
    };

    const handleProSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isNameValid = validateField('pro', 'name', proData.name);
        const isEmailValid = validateField('pro', 'email', proData.email);
        const isPasswordValid = validateField('pro', 'password', proData.password);
        const isConfirmValid = validateField('pro', 'confirmPassword', proData.confirmPassword);
        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) return;
        
        setLoading('pro');
        onStartAuthFlow('signup', proData.email, { password: proData.password, name: proData.name });
    };

    const handlePaygSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isNameValid = validateField('payg', 'name', paygData.name);
        const isEmailValid = validateField('payg', 'email', paygData.email);
        const isContactValid = validateField('payg', 'contactNumber', paygData.contactNumber);
        const isPasswordValid = validateField('payg', 'password', paygData.password);
        const isConfirmValid = validateField('payg', 'confirmPassword', paygData.confirmPassword);
        
        if (!isNameValid || !isEmailValid || !isContactValid || !isPasswordValid || !isConfirmValid) return;
        
        setLoading('payg');
        onStartAuthFlow('payg_signup', paygData.email, { name: paygData.name, contactNumber: paygData.contactNumber, password: paygData.password });
    };
    
    const handleGoogleAuth = async (flow: 'signup' | 'payg_signup') => {
        const loaderType = flow === 'signup' ? 'google_pro' : 'google_payg';
        setLoading(loaderType);
        try {
            await onStartGoogleAuthFlow(flow);
        } catch (error) {
            console.error("Google Auth Failed", error);
            setLoading('none');
        }
    };
    
    const PlanSelectorCard: React.FC<{ plan: 'pro' | 'payg', title: string, price: string, badge?: string }> = ({ plan, title, price, badge }) => {
        const isSelected = selectedPlan === plan;
        return (
            <div
                onClick={() => setSelectedPlan(plan)}
                className={`relative border-2 rounded-lg p-5 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
            >
                <div className="flex justify-between items-start">
                    <div className="font-bold text-secondary text-lg">{title}</div>
                    <div className="w-6 h-6 flex-shrink-0">
                        {isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <CheckIcon className="w-4 h-4 text-white" />
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                        )}
                    </div>
                </div>
                <p className="text-gray-600">{price}</p>
                {badge && (
                    <div className="absolute top-4 right-12 text-xs font-bold text-pink-700 bg-pink-100 border border-pink-200 px-2.5 py-1 rounded-full">
                        {badge}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white text-secondary flex flex-col">
            <header className="py-6">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="HR CoPilot Logo" className="h-12" />
                    <div className="text-sm">
                        <span>Already have an account? </span>
                        <button onClick={onShowLogin} className="font-semibold text-primary hover:underline">Sign In</button>
                    </div>
                </div>
            </header>
            <main className="flex-grow container mx-auto flex flex-col items-center px-6 py-12">
                <div className="w-full max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        <PlanSelectorCard plan="pro" title="HR CoPilot Pro" price="R747 / year" badge="Recommended" />
                        <PlanSelectorCard plan="payg" title="Pay-As-You-Go" price="Pay per document" />
                    </div>

                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-secondary mb-4">What's included?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-lg mx-auto text-left">
                            {commonFeatures.map((feature) => (
                                <div key={feature} className="flex items-center"><CheckIcon className="w-5 h-5 text-green-500 mr-3" /><span>{feature}</span></div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                             <h3 className="text-lg font-bold text-primary mb-3">HR CoPilot Pro adds:</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-lg mx-auto text-left">
                                <div className="flex items-center"><CheckIcon className="w-5 h-5 text-green-500 mr-3" /><span>Unlimited document generation</span></div>
                                <div className="flex items-center"><CheckIcon className="w-5 h-5 text-green-500 mr-3" /><span>AI Compliance Checklist</span></div>
                                <div className="flex items-center"><CheckIcon className="w-5 h-5 text-green-500 mr-3" /><span>AI Policy Updater</span></div>
                                <div className="flex items-center"><CheckIcon className="w-5 h-5 text-green-500 mr-3" /><span>Priority Support</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-secondary text-center mb-6">Create your account</h2>
                        {selectedPlan === 'pro' && (
                            <div className="space-y-4">
                                <button 
                                    onClick={() => handleGoogleAuth('signup')} 
                                    disabled={loading !== 'none'} 
                                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-200"
                                >
                                    <GoogleIcon className="w-5 h-5 mr-2" /> {loading === 'google_pro' ? 'Redirecting...' : 'Sign Up with Google'}
                                </button>
                                <div className="my-4 flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span><div className="flex-grow border-t border-gray-300"></div></div>
                                <form onSubmit={handleProSubmit} className="space-y-4">
                                    <div>
                                        <input type="text" value={proData.name} onChange={e => { setProData({...proData, name: e.target.value}); validateField('pro', 'name', e.target.value); }} placeholder="Your Name" className={`w-full p-3 border rounded-md shadow-sm ${proErrors.name ? 'border-red-500' : 'border-gray-300'}`} />
                                        {proErrors.name && <p className="text-red-600 text-xs mt-1">{proErrors.name}</p>}
                                    </div>
                                    <div>
                                        <input type="email" value={proData.email} onChange={e => { setProData({...proData, email: e.target.value}); validateField('pro', 'email', e.target.value); }} placeholder="your-email@example.com" className={`w-full p-3 border rounded-md shadow-sm ${proErrors.email ? 'border-red-500' : 'border-gray-300'}`} />
                                        {proErrors.email && <p className="text-red-600 text-xs mt-1">{proErrors.email}</p>}
                                    </div>
                                    <div>
                                        <input type="password" value={proData.password} onChange={e => { setProData({...proData, password: e.target.value}); validateField('pro', 'password', e.target.value); }} placeholder="Password" className={`w-full p-3 border rounded-md shadow-sm ${proErrors.password ? 'border-red-500' : 'border-gray-300'}`} />
                                        {proErrors.password && <p className="text-red-600 text-xs mt-1">{proErrors.password}</p>}
                                    </div>
                                    <div>
                                        <input type="password" value={proData.confirmPassword} onChange={e => { setProData({...proData, confirmPassword: e.target.value}); validateField('pro', 'confirmPassword', e.target.value); }} placeholder="Confirm Password" className={`w-full p-3 border rounded-md shadow-sm ${proErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
                                        {proErrors.confirmPassword && <p className="text-red-600 text-xs mt-1">{proErrors.confirmPassword}</p>}
                                    </div>
                                    <button type="submit" disabled={loading !== 'none'} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
                                        {loading === 'pro' ? 'Creating Account...' : 'Sign Up for Pro'}
                                    </button>
                                </form>
                            </div>
                        )}
                        {selectedPlan === 'payg' && (
                             <div className="space-y-4">
                                <button 
                                    onClick={() => handleGoogleAuth('payg_signup')} 
                                    disabled={loading !== 'none'} 
                                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-200"
                                >
                                    <GoogleIcon className="w-5 h-5 mr-2" /> {loading === 'google_payg' ? 'Redirecting...' : 'Sign Up with Google'}
                                </button>
                                <div className="my-4 flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span><div className="flex-grow border-t border-gray-300"></div></div>
                                 <form onSubmit={handlePaygSubmit} className="space-y-4">
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
                                    <div>
                                        <input type="password" value={paygData.password} onChange={e => { setPaygData({...paygData, password: e.target.value}); validateField('payg', 'password', e.target.value);}} placeholder="Password" className={`w-full p-3 border rounded-md shadow-sm ${paygErrors.password ? 'border-red-500' : 'border-gray-300'}`} />
                                        {paygErrors.password && <p className="text-red-600 text-xs mt-1">{paygErrors.password}</p>}
                                    </div>
                                    <div>
                                        <input type="password" value={paygData.confirmPassword} onChange={e => { setPaygData({...paygData, confirmPassword: e.target.value}); validateField('payg', 'confirmPassword', e.target.value);}} placeholder="Confirm Password" className={`w-full p-3 border rounded-md shadow-sm ${paygErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
                                        {paygErrors.confirmPassword && <p className="text-red-600 text-xs mt-1">{paygErrors.confirmPassword}</p>}
                                    </div>
                                    <button type="submit" disabled={loading !== 'none'} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400">
                                        {loading === 'payg' ? 'Creating Account...' : 'Sign Up for PAYG'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <footer className="bg-secondary text-white py-8 mt-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex justify-center space-x-6 mb-4">
                        <button onClick={onShowPrivacyPolicy} className="text-sm text-gray-300 hover:text-white hover:underline">
                            Privacy Policy
                        </button>
                        <button onClick={onShowTerms} className="text-sm text-gray-300 hover:text-white hover:underline">
                            Terms of Use
                        </button>
                    </div>
                    <p className="text-sm text-gray-300">© {new Date().getFullYear()} HR CoPilot. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PlanSelectionPage;
