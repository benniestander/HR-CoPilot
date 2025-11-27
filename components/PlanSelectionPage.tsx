
import React, { useState, useEffect } from 'react';
import { CheckIcon, EyeIcon, EyeOffIcon, ShieldCheckIcon, StarIcon } from './Icons';

interface PlanSelectionPageProps {
  onStartAuthFlow: (flow: 'signup' | 'payg_signup', email: string, details: { password: string, name?: string, contactNumber?: string }) => void;
  onShowLogin: () => void;
  onShowPrivacyPolicy: () => void;
  onShowTerms: () => void;
}

const PlanSelectionPage: React.FC<PlanSelectionPageProps> = ({ 
    onStartAuthFlow, 
    onShowLogin, 
    onShowPrivacyPolicy, 
    onShowTerms 
}) => {
    const [selectedPlan, setSelectedPlan] = useState<'pro' | 'payg'>('pro');
    const [isMobile, setIsMobile] = useState(false);
    
    // Unified Form State - Removed Confirm Password
    const [formData, setFormData] = useState({ name: '', email: '', password: '', contactNumber: '' });
    const [errors, setErrors] = useState({ name: '', email: '', password: '', contactNumber: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState<'none' | 'email'>('none');
    
    // Mobile Specific State
    const [showFeatures, setShowFeatures] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const proFeatures = [
        'Generate unlimited policies & contracts',
        'Unlimited HR Form Generation',
        'Automated policy updates when laws change',
        'Personalized Compliance Roadmap',
        'Secure digital document vault',
        'Priority support for critical issues',
    ];
    
    const paygFeatures = [
        'No monthly fees - pay only when you need a document',
        'Instant access to our full library of compliant templates',
        'Download editable Word/Excel files instantly',
        'Basic AI customization for your business',
    ];

    const validateField = (name: string, value: string) => {
        let error = '';
        if (!value.trim()) {
            error = 'Required';
        } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Invalid email';
        } else if (name === 'password' && value.length < 6) {
            error = 'Min 6 chars';
        } else if (name === 'contactNumber' && selectedPlan === 'payg' && !/^\d{10}$/.test(value.replace(/\s/g, ''))) {
            error = 'Invalid phone number';
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            validateField(name, value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let isValid = true;
        isValid = validateField('name', formData.name) && isValid;
        isValid = validateField('email', formData.email) && isValid;
        isValid = validateField('password', formData.password) && isValid;
        if (selectedPlan === 'payg') {
            isValid = validateField('contactNumber', formData.contactNumber) && isValid;
        }

        if (!isValid) return;

        setLoading('email');
        const flow = selectedPlan === 'pro' ? 'signup' : 'payg_signup';
        try {
            await onStartAuthFlow(flow, formData.email, { 
                password: formData.password, 
                name: formData.name, 
                contactNumber: selectedPlan === 'payg' ? formData.contactNumber : undefined 
            });
        } catch (error) {
            setLoading('none');
        }
    };

    // --- Sub-Components ---

    const InputField = ({ name, type, placeholder, icon }: any) => (
        <div className="relative">
            <input
                type={type}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleInputChange}
                onBlur={(e) => validateField(name, e.target.value)}
                placeholder={placeholder}
                className={`w-full p-4 pl-4 ${icon ? 'pr-12' : ''} bg-white border rounded-lg text-base transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors[name as keyof typeof errors] 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-primary'
                }`}
            />
            {icon && <div className="absolute right-3 top-4 text-gray-400">{icon}</div>}
            {errors[name as keyof typeof errors] && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors[name as keyof typeof errors]}</p>
            )}
        </div>
    );

    const FeaturesList = () => (
        <div className="space-y-3">
            {(selectedPlan === 'pro' ? proFeatures : paygFeatures).map((feature, idx) => (
                <div key={idx} className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                        <CheckIcon className="w-3 h-3 text-green-700" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                </div>
            ))}
        </div>
    );

    // --- Mobile Layout ---
    if (isMobile) {
        return (
            <div className="min-h-screen bg-gray-50 pb-24">
                {/* Sticky Header */}
                <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex justify-between items-center">
                    <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="HR CoPilot" className="h-8" />
                    <button onClick={onShowLogin} className="text-sm font-semibold text-primary">Sign In</button>
                </div>

                <div className="pt-20 px-4">
                    <h1 className="text-2xl font-bold text-secondary text-center mb-6">Create your account</h1>

                    {/* Plan Toggle */}
                    <div className="bg-gray-200 p-1 rounded-full flex relative mb-6">
                        <div 
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${selectedPlan === 'pro' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                        />
                        <button 
                            onClick={() => setSelectedPlan('payg')}
                            className={`flex-1 py-2.5 text-sm font-medium z-10 text-center transition-colors ${selectedPlan === 'payg' ? 'text-secondary' : 'text-gray-500'}`}
                        >
                            Pay-As-You-Go
                        </button>
                        <button 
                            onClick={() => setSelectedPlan('pro')}
                            className={`flex-1 py-2.5 text-sm font-medium z-10 text-center transition-colors ${selectedPlan === 'pro' ? 'text-primary' : 'text-gray-500'}`}
                        >
                            Pro (Best Value)
                        </button>
                    </div>

                    {/* Price Hero */}
                    <div className="text-center mb-4">
                        {selectedPlan === 'pro' ? (
                            <div className="inline-flex items-baseline">
                                <span className="text-4xl font-bold text-secondary">R747</span>
                                <span className="text-gray-500 ml-1">/ year</span>
                            </div>
                        ) : (
                            <div className="inline-flex items-baseline">
                                <span className="text-2xl font-bold text-secondary">From R35-00</span>
                                <span className="text-gray-500 ml-1">/ document</span>
                            </div>
                        )}
                        {selectedPlan === 'pro' && (
                            <p className="text-green-600 text-xs font-bold mt-1 bg-green-100 inline-block px-2 py-0.5 rounded-full">
                                SAVE 20%
                            </p>
                        )}
                    </div>

                    {/* Collapsible Features */}
                    <div className="mb-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <button 
                            onClick={() => setShowFeatures(!showFeatures)}
                            className="w-full px-4 py-3 flex justify-between items-center text-sm font-medium text-gray-600 bg-gray-50"
                        >
                            <span>What's included?</span>
                            <span className={`transform transition-transform ${showFeatures ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {showFeatures && (
                            <div className="p-4 border-t border-gray-200 animate-fade-in">
                                <FeaturesList />
                            </div>
                        )}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-20">
                        <InputField name="name" type="text" placeholder="Full Name" />
                        <InputField name="email" type="email" placeholder="Email Address" />
                        {selectedPlan === 'payg' && (
                            <InputField name="contactNumber" type="tel" placeholder="Mobile Number" />
                        )}
                        <InputField 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Create Password"
                            icon={
                                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            }
                        />
                        
                        <div className="text-center mt-2">
                            <p className="text-xs text-gray-400 flex justify-center items-center">
                                <ShieldCheckIcon className="w-3 h-3 mr-1" /> Encrypted & Secure
                            </p>
                        </div>

                        {/* Sticky CTA */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
                            <button 
                                type="submit"
                                disabled={loading !== 'none'}
                                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-transform flex justify-center items-center"
                            >
                                {loading === 'email' ? 'Creating Account...' : 'Sign Up Now'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="text-center text-xs text-gray-400 pb-8">
                        <button onClick={onShowPrivacyPolicy} className="underline mr-4">Privacy</button>
                        <button onClick={onShowTerms} className="underline">Terms</button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Desktop Layout ---
    return (
        <div className="min-h-screen flex flex-row bg-white">
            {/* Left Side - Value & Trust */}
            <div className="w-5/12 bg-secondary text-white relative flex flex-col justify-between overflow-hidden p-12">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full filter blur-[120px] opacity-20 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full filter blur-[120px] opacity-10 -ml-20 -mb-20"></div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="HR CoPilot" className="h-10 mb-12 brightness-0 invert" />
                        
                        <h1 className="text-5xl font-bold leading-tight mb-6">
                            Expert HR Compliance, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">Automated.</span>
                        </h1>
                        <p className="text-lg text-blue-100 leading-relaxed mb-10">
                            Join over 500 South African small businesses using Ingcweti AI to generate compliant contracts, policies, and forms in minutes.
                        </p>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg max-w-md">
                            <div className="flex text-accent mb-3">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5" />)}
                            </div>
                            <p className="text-blue-50 italic mb-4">"I used to pay consultants thousands for these documents. HR CoPilot saved me time and money instantly."</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-tr from-accent to-yellow-600 rounded-full flex items-center justify-center font-bold text-secondary mr-3 shadow-md">
                                    JS
                                </div>
                                <div>
                                    <p className="text-sm font-bold">John Smit</p>
                                    <p className="text-xs text-blue-200">Owner, Smit Construction</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-blue-300 flex justify-between items-end mt-10">
                        <p>© 2025 HR CoPilot</p>
                        <div className="space-x-6">
                            <button onClick={onShowPrivacyPolicy} className="hover:text-white transition-colors">Privacy Policy</button>
                            <button onClick={onShowTerms} className="hover:text-white transition-colors">Terms of Use</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Action */}
            <div className="w-7/12 bg-white overflow-y-auto flex flex-col">
                <div className="flex justify-end p-8">
                    <span className="text-gray-500 text-sm mr-2">Already have an account?</span>
                    <button onClick={onShowLogin} className="text-primary font-bold text-sm hover:underline">Sign In</button>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full px-8 pb-12">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-secondary mb-2">Select your plan</h2>
                        <p className="text-gray-500">Choose the best way to handle your HR compliance.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {/* Pro Card */}
                        <div 
                            onClick={() => setSelectedPlan('pro')}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 relative flex flex-col justify-between h-full ${
                                selectedPlan === 'pro' 
                                ? 'border-primary bg-white shadow-xl scale-[1.02] z-10' 
                                : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-primary/30'
                            }`}
                        >
                            {selectedPlan === 'pro' && (
                                <div className="absolute -top-3 right-4 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm tracking-wide">
                                    RECOMMENDED
                                </div>
                            )}
                            <div>
                                <h3 className={`font-bold ${selectedPlan === 'pro' ? 'text-secondary' : 'text-gray-500'}`}>HR CoPilot Pro</h3>
                                <div className="mt-2">
                                    <span className="text-2xl font-bold text-secondary">R747</span>
                                    <span className="text-xs text-gray-500"> / year</span>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs text-green-600 font-bold">Unlimited Access</p>
                            </div>
                        </div>

                        {/* PAYG Card */}
                        <div 
                            onClick={() => setSelectedPlan('payg')}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 relative flex flex-col justify-between h-full ${
                                selectedPlan === 'payg' 
                                ? 'border-secondary bg-white shadow-xl scale-[1.02] z-10' 
                                : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                            }`}
                        >
                            <div>
                                <h3 className={`font-bold ${selectedPlan === 'payg' ? 'text-secondary' : 'text-gray-500'}`}>Pay-As-You-Go</h3>
                                <div className="mt-2">
                                    <span className="text-xl font-bold text-secondary">From R35-00</span>
                                    <span className="text-xs text-gray-500"> / document</span>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-500 font-medium">Single Purchase</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
                        <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4">
                            Included with {selectedPlan === 'pro' ? 'Pro Membership' : 'Pay-As-You-Go'}
                        </h4>
                        <FeaturesList />
                    </div>

                    <div className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Create your account</span></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputField name="name" type="text" placeholder="Full Name" />
                                {selectedPlan === 'payg' && (
                                    <InputField name="contactNumber" type="tel" placeholder="Mobile Number" />
                                )}
                            </div>
                            <InputField name="email" type="email" placeholder="Email Address" />
                            <InputField 
                                name="password" 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Create Password"
                                icon={
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none hover:text-secondary">
                                        {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                }
                            />

                            <button 
                                type="submit"
                                disabled={loading !== 'none'}
                                className="w-full bg-primary text-white font-bold py-4 rounded-lg shadow-lg hover:bg-secondary hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:bg-gray-300 disabled:shadow-none disabled:transform-none mt-4"
                            >
                                {loading === 'email' ? 'Creating Account...' : 'Sign Up Now'}
                            </button>
                        </form>

                        <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
                            <div className="flex items-center"><ShieldCheckIcon className="w-3 h-3 mr-1 text-green-500" /> Secure 256-bit Encryption</div>
                            <div className="flex items-center"><ShieldCheckIcon className="w-3 h-3 mr-1 text-green-500" /> POPIA Compliant</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanSelectionPage;
