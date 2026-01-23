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
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'signup' | 'reset' | 'reset-sent'>('login');

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

    const onSignUp = async () => {
        if (!validateEmail(email) || !password || !name) return;

        setLoading(true);
        try {
            const success = await handleSignUp(email, password, { name, contactNumber });
            if (success) {
                // Success handled by AuthContext (email-sent view etc)
            }
        } catch (error: any) {
            setToastMessage(`Signup failed: ${error.message}`);
            setLoading(false);
        }
    };

    const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onLogin();
    };

    const handleSignUpClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onSignUp();
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
        <>
            <h1 className="text-2xl font-bold text-secondary mb-2">Sign In</h1>
            <p className="text-gray-600 mb-6">Welcome back! Sign in to your account.</p>

            <form className="space-y-4">
                <div>
                    <input
                        type="email" value={email} onChange={handleEmailChange} onBlur={(e) => validateEmail(e.target.value)}
                        placeholder="your-email@example.com" required
                        className={`w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                        aria-label="Email Address" aria-invalid={!!emailError} aria-describedby="email-error" />
                    {emailError && <p id="email-error" className="text-red-600 text-sm text-left mt-1">{emailError}</p>}
                </div>
                <div>
                    <input
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" required
                        className="w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary border-gray-300"
                        aria-label="Password" />
                    <div className="text-right mt-2 text-sm">
                        <button type="button" onClick={() => setView('reset')} className="font-semibold text-primary hover:underline focus:outline-none">Forgot Password?</button>
                    </div>
                </div>
                <button type="button" onClick={handleLoginClick} disabled={loading || !email || !!emailError || !password}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                    {loading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Signing In...</>) : ('Sign In')}
                </button>
            </form>
            <p className="text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <button onClick={() => setView('signup')} className="font-semibold text-primary hover:underline">Create Account</button>
            </p>
        </>
    );

    const renderSignUpView = () => (
        <>
            <h1 className="text-2xl font-bold text-secondary mb-2">Create Account</h1>
            <p className="text-gray-600 mb-6">Start generating your HR policies today.</p>

            <form className="space-y-4">
                <div>
                    <input
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name" required
                        className="w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary border-gray-300"
                        aria-label="Full Name" />
                </div>
                <div>
                    <input
                        type="email" value={email} onChange={handleEmailChange} onBlur={(e) => validateEmail(e.target.value)}
                        placeholder="your-email@example.com" required
                        className={`w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                        aria-label="Email Address" />
                </div>
                <div>
                    <input
                        type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Contact Number (Optional)"
                        className="w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary border-gray-300"
                        aria-label="Contact Number" />
                </div>
                <div>
                    <input
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" required
                        className="w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary border-gray-300"
                        aria-label="Password" />
                </div>
                <button type="button" onClick={handleSignUpClick} disabled={loading || !email || !!emailError || !password || !name}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                    {loading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creating Account...</>) : ('Create Account')}
                </button>
            </form>
            <p className="text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="font-semibold text-primary hover:underline">Sign In</button>
            </p>
        </>
    );

    const renderResetView = () => (
        <>
            <h1 className="text-2xl font-bold text-secondary mb-2">Reset Your Password</h1>
            <p className="text-gray-600 mb-6">Enter your email address to receive a password reset link.</p>
            <form className="space-y-4">
                <div>
                    <input type="email" value={email} onChange={handleEmailChange} onBlur={(e) => validateEmail(e.target.value)} placeholder="your-email@example.com" required
                        className={`w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                        aria-label="Email Address" aria-invalid={!!emailError} aria-describedby="email-error" />
                    {emailError && <p id="email-error" className="text-red-600 text-sm text-left mt-1">{emailError}</p>}
                </div>
                <button type="button" onClick={handleResetClick} disabled={loading || !email || !!emailError}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                    {loading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending...</>) : ('Send Reset Link')}
                </button>
            </form>
            <p className="text-sm text-gray-600 mt-6">
                Remember your password?{' '}
                <button onClick={() => { setView('login'); setEmailError(''); }} className="font-semibold text-primary hover:underline">Back to Sign In</button>
            </p>
        </>
    );

    const ConfirmationScreen: React.FC<{ title: string; message: string; onBack: () => void; }> = ({ title, message, onBack }) => (
        <>
            <h1 className="text-2xl font-bold text-secondary mb-2">{title}</h1>
            <div className="my-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <p className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: message }} />
            <button onClick={onBack} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90">Back to Sign In</button>
        </>
    );

    return (
        <div className="min-h-screen bg-light text-secondary flex flex-col">
            <header className="bg-white shadow-sm py-6">
                <div className="container mx-auto flex justify-center items-center">
                    <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="HR CoPilot Logo" className="h-12" />
                </div>
            </header>
            <main className="flex-grow container mx-auto flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
                        {view === 'login' && renderLoginView()}
                        {view === 'signup' && renderSignUpView()}
                        {view === 'reset' && renderResetView()}
                        {view === 'reset-sent' && <ConfirmationScreen title="Check Your Email" message={`If an account with the email <strong class="text-secondary">${email}</strong> exists, a password reset link has been sent. Please check your inbox (and spam folder).`} onBack={() => { setView('login'); setEmail(''); setPassword(''); }} />}
                    </div>
                </div>
            </main>
            <footer className="bg-secondary text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="HR CoPilot Logo" className="h-10 mx-auto mb-4" />
                    <div className="flex justify-center space-x-6 mb-4">
                        <button onClick={() => showLegalModal('Privacy Policy', PRIVACY_POLICY_CONTENT)} className="text-sm text-gray-300 hover:text-white hover:underline">Privacy Policy</button>
                        <button onClick={() => showLegalModal('Terms of Use', TERMS_OF_USE_CONTENT)} className="text-sm text-gray-300 hover:text-white hover:underline">Terms of Use</button>
                    </div>
                    <p className="text-sm text-gray-300">© {new Date().getFullYear()} HR CoPilot. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Login;
