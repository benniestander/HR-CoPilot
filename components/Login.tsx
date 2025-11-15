
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onShowLanding: () => void;
  onShowPrivacyPolicy: () => void;
  onShowTerms: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onShowLanding, onShowPrivacyPolicy, onShowTerms }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

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
        validateEmail(e.target.value);
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email) || !password) return;

        setLoading(true);
        onLogin(email, password);
    };

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
                <div className="w-full max-w-md">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
                        <h1 className="text-2xl font-bold text-secondary mb-2">Sign in to Ingcweti</h1>
                        <p className="text-gray-600 mb-6">Enter your email and password to sign in.</p>
                        
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                           <div>
                             <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="your-email@example.com"
                                required
                                className={`w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                                aria-label="Email Address"
                                aria-invalid={!!emailError}
                                aria-describedby="email-error"
                            />
                            {emailError && <p id="email-error" className="text-red-600 text-sm text-left mt-1">{emailError}</p>}
                           </div>
                           <div>
                             <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary border-gray-300"
                                aria-label="Password"
                            />
                           </div>
                            <button
                                type="submit"
                                disabled={loading || !email || !!emailError || !password}
                                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {loading ? (
                                    <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg> Signing In...</>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>
                        <p className="text-sm text-gray-600 mt-6">
                            Don't have an account?{' '}
                            <button onClick={onShowLanding} className="font-semibold text-primary hover:underline">
                                Choose a Plan
                            </button>
                        </p>
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

export default Login;