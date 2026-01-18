import React, { useState } from 'react';
import { CheckIcon, GoogleIcon } from './Icons';
import { trackEvent } from './utils/analytics';
import { useEffect } from 'react';


interface PlanSelectionPageProps {
    onStartAuthFlow: (flow: 'signup' | 'payg_signup', email: string, details: { password: string, name?: string, contactNumber?: string }) => void;
    onStartGoogleAuthFlow: (flow: 'signup' | 'payg_signup') => void;
    onShowLogin: () => void;
    onShowPrivacyPolicy: () => void;
    onShowTerms: () => void;
}

const PlanSelectionPage: React.FC<PlanSelectionPageProps> = ({ onStartAuthFlow, onStartGoogleAuthFlow, onShowLogin, onShowPrivacyPolicy, onShowTerms }) => {
    const [selectedPlan, setSelectedPlan] = useState<'pro' | 'payg'>('pro');

    useEffect(() => {
        trackEvent('plan_comparison_view', { initial_plan: 'pro' });
    }, []);


    const [proData, setProData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [paygData, setPaygData] = useState({ name: '', email: '', contactNumber: '', password: '', confirmPassword: '' });

    const [proErrors, setProErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [paygErrors, setPaygErrors] = useState({ name: '', email: '', contactNumber: '', password: '', confirmPassword: '' });

    const [loading, setLoading] = useState<'none' | 'pro' | 'payg' | 'google_pro' | 'google_payg'>('none');

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
        trackEvent('auth_flow_start', { method: 'email', plan: 'pro' });
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
        trackEvent('auth_flow_start', { method: 'email', plan: 'payg' });
        onStartAuthFlow('payg_signup', paygData.email, { name: paygData.name, contactNumber: paygData.contactNumber, password: paygData.password });
    };

    return (
        <div className="min-h-screen bg-white text-secondary flex flex-col font-sans selection:bg-primary/20">
            {/* 1. Header */}
            <header className="py-6 sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="Ingcweti Logo" className="h-10 hover:opacity-80 transition-opacity cursor-pointer" />
                    <div className="flex items-center gap-6">
                        <span className="hidden sm:inline text-sm text-gray-400 font-medium">Already a member?</span>
                        <button onClick={onShowLogin} className="px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold hover:bg-primary/10 transition-all">
                            Sign In
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-6 py-16 md:py-24">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    {/* 2. Headline & Value Prop */}
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                        <h1 className="text-4xl md:text-6xl font-black text-secondary tracking-tight mb-6">
                            Secure Your Business, <br /><span className="text-primary italic">Automate Your HR.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Professional legal contracts and policies tailored for South African small businesses. No lawyers required.
                        </p>
                    </div>

                    {/* 3. Plan Toggle */}
                    <div className="bg-gray-100/80 p-1.5 rounded-full flex items-center gap-1 mb-12 shadow-inner ring-1 ring-gray-200 animate-in fade-in zoom-in-95 duration-500 delay-200">
                        <button
                            onClick={() => setSelectedPlan('pro')}
                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${selectedPlan === 'pro' ? 'bg-white text-secondary shadow-md ring-1 ring-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Ingcweti Pro
                            <span className="ml-2 py-0.5 px-1.5 bg-green-100 text-green-700 text-[10px] rounded uppercase tracking-wider">Most Value</span>
                        </button>
                        <button
                            onClick={() => setSelectedPlan('payg')}
                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${selectedPlan === 'payg' ? 'bg-white text-secondary shadow-md ring-1 ring-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Pay-As-You-Go
                        </button>
                    </div>

                    {/* 4. Split Layout: Features vs. Form */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Features Column */}
                        <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-secondary">What you get:</h2>
                                <div className="space-y-4">
                                    {commonFeatures.map((feature) => (
                                        <div key={feature} className="flex items-start group">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                                <CheckIcon className="w-3 h-3 text-emerald-600" />
                                            </div>
                                            <span className="text-gray-600 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedPlan === 'pro' && (
                                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                                        <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    </div>
                                    <h3 className="text-primary font-black uppercase text-xs tracking-widest mb-4">Pro Plan Benefits</h3>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center text-secondary font-bold">
                                            <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                                            Unlimited Document Generation
                                        </div>
                                        <div className="flex items-center text-secondary font-bold">
                                            <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                                            AI Compliance Roadmap
                                        </div>
                                        <div className="flex items-center text-secondary font-bold">
                                            <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                                            Legacy Policy Updater
                                        </div>
                                        <div className="flex items-center text-secondary font-bold">
                                            <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                                            24/7 Priority Support
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-500 italic">Save R2,400+ per year vs PAYG</span>
                                        <span className="text-2xl font-black text-secondary tracking-tighter">R747<span className="text-xs font-normal text-gray-400">/yr</span></span>
                                    </div>
                                </div>
                            )}

                            {selectedPlan === 'payg' && (
                                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                                    <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-4">Flexible Access</h3>
                                    <p className="text-secondary font-bold text-lg mb-6 leading-snug">Generate only what you need, exactly when you need it.</p>
                                    <ul className="space-y-3 text-sm text-gray-500 font-medium">
                                        <li>• Only pay for the documents you generate</li>
                                        <li>• Start from as little as R14.50</li>
                                        <li>• Credits never expire</li>
                                        <li>• Upgrade to Pro at any time</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Sign Up Form Column */}
                        <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                                <h3 className="text-2xl font-bold mb-2 text-secondary">Start Your Trial</h3>
                                <p className="text-gray-400 text-sm mb-8 font-medium">Join 500+ SA businesses using Ingcweti for HR safety.</p>

                                <button
                                    onClick={() => { setLoading(selectedPlan === 'pro' ? 'google_pro' : 'google_payg'); onStartGoogleAuthFlow(selectedPlan === 'pro' ? 'signup' : 'payg_signup'); }}
                                    disabled={loading !== 'none'}
                                    className="w-full flex justify-center items-center py-4 px-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-gray-700 disabled:opacity-50"
                                >
                                    <GoogleIcon className="w-5 h-5 mr-3" />
                                    {loading.includes('google') ? 'Authenticating...' : 'Continue with Google'}
                                </button>

                                <div className="my-8 flex items-center gap-4">
                                    <div className="flex-grow h-px bg-gray-100"></div>
                                    <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">or email sign up</span>
                                    <div className="flex-grow h-px bg-gray-100"></div>
                                </div>

                                <form onSubmit={selectedPlan === 'pro' ? handleProSubmit : handlePaygSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                value={selectedPlan === 'pro' ? proData.name : paygData.name}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (selectedPlan === 'pro') setProData({ ...proData, name: val });
                                                    else setPaygData({ ...paygData, name: val });
                                                    validateField(selectedPlan, 'name', val);
                                                }}
                                                placeholder="Full Name"
                                                className={`w-full p-4 bg-gray-50/50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all ${selectedPlan === 'pro' ? (proErrors.name ? 'border-red-200' : 'border-gray-200') : (paygErrors.name ? 'border-red-200' : 'border-gray-200')}`}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                type="email"
                                                value={selectedPlan === 'pro' ? proData.email : paygData.email}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (selectedPlan === 'pro') setProData({ ...proData, email: val });
                                                    else setPaygData({ ...paygData, email: val });
                                                    validateField(selectedPlan, 'email', val);
                                                }}
                                                placeholder="Business Email"
                                                className={`w-full p-4 bg-gray-50/50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all ${(selectedPlan === 'pro' ? proErrors.email : paygErrors.email) ? 'border-red-200' : 'border-gray-200'}`}
                                            />
                                        </div>
                                    </div>

                                    {selectedPlan === 'payg' && (
                                        <div className="space-y-1">
                                            <input
                                                type="tel"
                                                value={paygData.contactNumber}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setPaygData({ ...paygData, contactNumber: val });
                                                    validateField('payg', 'contactNumber', val);
                                                }}
                                                placeholder="WhatsApp / Contact Number"
                                                className={`w-full p-4 bg-gray-50/50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all ${paygErrors.contactNumber ? 'border-red-200' : 'border-gray-200'}`}
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <input
                                                type="password"
                                                value={selectedPlan === 'pro' ? proData.password : paygData.password}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (selectedPlan === 'pro') setProData({ ...proData, password: val });
                                                    else setPaygData({ ...paygData, password: val });
                                                    validateField(selectedPlan, 'password', val);
                                                }}
                                                placeholder="Create Password"
                                                className={`w-full p-4 bg-gray-50/50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all ${(selectedPlan === 'pro' ? proErrors.password : paygErrors.password) ? 'border-red-200' : 'border-gray-200'}`}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                type="password"
                                                value={selectedPlan === 'pro' ? proData.confirmPassword : paygData.confirmPassword}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (selectedPlan === 'pro') setProData({ ...proData, confirmPassword: val });
                                                    else setPaygData({ ...paygData, confirmPassword: val });
                                                    validateField(selectedPlan, 'confirmPassword', val);
                                                }}
                                                placeholder="Confirm Password"
                                                className={`w-full p-4 bg-gray-50/50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all ${(selectedPlan === 'pro' ? proErrors.confirmPassword : paygErrors.confirmPassword) ? 'border-red-200' : 'border-gray-200'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading !== 'none'}
                                            className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 disabled:opacity-50 ${selectedPlan === 'pro' ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20' : 'bg-secondary text-white hover:bg-secondary/90 shadow-secondary/20'}`}
                                        >
                                            {loading === 'pro' || loading === 'payg' ? 'Generating Keys...' : (selectedPlan === 'pro' ? 'Start Pro Subscription' : 'Create Free Account')}
                                        </button>
                                    </div>

                                    <p className="text-[10px] text-gray-400 text-center leading-relaxed mt-6">
                                        By signing up, you agree to our <button type="button" onClick={onShowTerms} className="underline hover:text-gray-500">Terms</button> and <button type="button" onClick={onShowPrivacyPolicy} className="underline hover:text-gray-500">Privacy Policy</button>. <br /> Secure 256-bit SSL Encrypted Connection.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 5. Modern Footer */}
            <footer className="border-t border-gray-100 py-12 bg-gray-50/30">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="Ingcweti Logo" className="h-8 grayscale opacity-50 mb-4" />
                        <p className="text-xs text-gray-400 font-medium">Protecting South African businesses with AI intelligence.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        <button onClick={onShowPrivacyPolicy} className="text-xs font-bold text-gray-400 hover:text-secondary uppercase tracking-widest transition-colors">Privacy</button>
                        <button onClick={onShowTerms} className="text-xs font-bold text-gray-400 hover:text-secondary uppercase tracking-widest transition-colors">Terms</button>
                    </div>
                    <div className="text-xs font-bold text-gray-300">© 2026 INGCWETI SOLUTIONS</div>
                </div>
            </footer>
        </div>
    );
};

export default PlanSelectionPage;