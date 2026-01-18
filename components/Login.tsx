import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useModalContext } from '../contexts/ModalContext';
import { useUIContext } from '../contexts/UIContext';
import { PRIVACY_POLICY_CONTENT, TERMS_OF_USE_CONTENT } from '../legalContent';

const Login: React.FC = () => {
    const { handleLogin, handleForgotPassword, setAuthPage } = useAuthContext();
    const { showLegalModal } = useModalContext();
    const { setToastMessage } = useUIContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'reset' | 'reset-sent'>('login');

    const validateEmail = (value: string) => {
        if (!value) {
            setEmailError('Email address is required.');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(value)) {
            setEmailError('Please enter a valid email address.');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) {
            validateEmail(e.target.value);
        }
    };

    const onLogin = async () => {
        if (!validateEmail(email) || !password) return;

        setLoading(true);
        try {
            await handleLogin(email, password);
        } catch (error: any) {
            setToastMessage(`Login failed: ${error.message}`);
            setLoading(false);
        }
    };

    const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onLogin();
    };

    const onReset = async () => {
        if (!validateEmail(email)) return;

        setLoading(true);
        try {
            await handleForgotPassword(email);
            setView('reset-sent');
        } catch (error: any) {
            setToastMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleResetClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onReset();
    };

    const renderLoginView = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-black text-secondary tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-400 font-medium mb-8">Secure access to your HR command center.</p>

            <form className="space-y-4">
                <div className="space-y-1">
                    <input
                        type="email" value={email} onChange={handleEmailChange} onBlur={(e) => validateEmail(e.target.value)}
                        placeholder="name@company.com" required
                        className={`w-full p-4 bg-gray-50/50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all ${emailError ? 'border-red-200' : 'border-gray-200'}`}
                        aria-label="Email Address" aria-invalid={!!emailError} />
                    {emailError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider text-left pl-2">{emailError}</p>}
                </div>
                <div className="space-y-1 relative">
                    <input
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password" required
                        className="w-full p-4 bg-gray-50/50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary border-gray-200 transition-all font-mono"
                        aria-label="Password" />
                    <div className="text-right mt-2 pr-2">
                        <button type="button" onClick={() => setView('reset')} className="text-xs font-bold text-primary hover:text-primary/70 transition-colors uppercase tracking-widest">Forgot Password?</button>
                    </div>
                </div>
                <button type="button" onClick={handleLoginClick} disabled={loading || !email || !!emailError || !password}
                    className="w-full bg-secondary text-white font-black py-4 px-4 rounded-2xl shadow-xl shadow-secondary/10 hover:shadow-secondary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 mt-2 flex items-center justify-center">
                    {loading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Verifying Identity...</>) : ('Sign In')}
                </button>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500">
                    New to AI Corpilot?
                    <button onClick={() => setAuthPage('landing')} className="ml-2 text-primary font-bold hover:underline">Get Protected Now</button>
                </p>
            </div>
        </div>
    );

    const renderResetView = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-2xl font-black text-secondary tracking-tight mb-2 uppercase">Recover Account</h1>
            <p className="text-gray-400 font-medium mb-8">We'll send a secure reset link to your email.</p>
            <form className="space-y-4 text-left">
                <div className="space-y-1">
                    <input type="email" value={email} onChange={handleEmailChange} onBlur={(e) => validateEmail(e.target.value)} placeholder="your-email@example.com" required
                        className={`w-full p-4 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all ${emailError ? 'border-red-200' : 'border-gray-200'}`}
                        aria-label="Email Address" />
                    {emailError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1 ml-2">{emailError}</p>}
                </div>
                <button type="button" onClick={handleResetClick} disabled={loading || !email || !!emailError}
                    className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center mt-2">
                    {loading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending Link...</>) : ('Send Recovery Link')}
                </button>
            </form>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mt-8">
                <button onClick={() => { setView('login'); setEmailError(''); }} className="hover:text-primary transition-colors inline-flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Sign In
                </button>
            </p>
        </div>
    );

    const ConfirmationScreen: React.FC<{ title: string; message: string; onBack: () => void; }> = ({ title, message, onBack }) => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h1 className="text-2xl font-black text-secondary tracking-tight mb-4">{title}</h1>
            <p className="text-gray-500 font-medium leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: message }} />
            <button onClick={onBack} className="w-full bg-secondary text-white font-black py-4 rounded-2xl hover:shadow-xl transition-all">Keep Moving</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-secondary flex flex-col selection:bg-primary/20">
            <header className="py-8 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto flex justify-center items-center">
                    <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="HR CoPilot Logo" className="h-10 cursor-pointer hover:opacity-80 transition-all active:scale-95" />
                </div>
            </header>
            <main className="flex-grow container mx-auto flex items-center justify-center px-6 py-12 md:py-20">
                <div className="w-full max-w-lg">
                    <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100 text-center relative overflow-hidden backdrop-blur-xl">
                        {view === 'login' && renderLoginView()}
                        {view === 'reset' && renderResetView()}
                        {view === 'reset-sent' && <ConfirmationScreen title="Inbox Secured" message={`We've dispatched a recovery link to <strong class="text-secondary underline font-bold">${email}</strong>. Check your inbox to regain command.`} onBack={() => { setView('login'); setEmail(''); setPassword(''); }} />}
                    </div>
                </div>
            </main>
            <footer className="py-12 bg-gray-50/50 border-t border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex justify-center space-x-10 mb-8 items-center">
                        <button onClick={() => showLegalModal('Privacy Policy', PRIVACY_POLICY_CONTENT)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors">Privacy Infrastructure</button>
                        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                        <button onClick={() => showLegalModal('Terms of Use', TERMS_OF_USE_CONTENT)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors">Service Terms</button>
                    </div>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">© 2026 HR COPILOT • INTELLIGENT COMPLIANCE ENGINE</p>
                </div>
            </footer>
        </div>
    );
};

export default Login;
