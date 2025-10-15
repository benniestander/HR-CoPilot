import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { sendSignInLinkToEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { LoadingIcon, GoogleIcon } from './Icons';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const actionCodeSettings = {
            url: window.location.origin, // URL to redirect back to. Must be in authorized domains.
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            setEmailSent(true);
        } catch (err: any) {
            setError("Failed to send link. Please check the email and try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // onAuthStateChanged in App.tsx will handle the rest
        } catch (error: any) {
            // Don't show an error if the user closes the popup
            if (error.code !== 'auth/popup-closed-by-user') {
                setError("Failed to sign in with Google. Please try again.");
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-light text-secondary flex flex-col">
            <header className="bg-white shadow-sm py-6">
                <div className="container mx-auto flex justify-center items-center">
                    <img
                        src="https://i.postimg.cc/DyvJchrf/edited-image-11.png"
                        alt="Ingcweti Logo"
                        className="h-12"
                    />
                </div>
            </header>
            <main className="flex-grow container mx-auto flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
                        <h1 className="text-2xl font-bold text-secondary mb-2">Sign in to Ingcweti</h1>
                        

                        {!emailSent ? (
                            <>
                                <p className="text-gray-600 mb-6">Enter your email for a password-free sign-in link, or sign in with Google.</p>
                                <form onSubmit={handleEmailLogin} className="space-y-4">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your-email@example.com"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                        aria-label="Email Address"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !email}
                                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <><LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /> Sending...</>
                                        ) : (
                                            'Send Magic Link'
                                        )}
                                    </button>
                                </form>
                                <div className="relative flex py-5 items-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink mx-4 text-gray-500 text-sm font-semibold">OR</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>
                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full bg-white text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm"
                                >
                                    <GoogleIcon className="w-5 h-5 mr-3" />
                                    Sign in with Google
                                </button>
                            </>
                        ) : (
                            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md">
                                <h3 className="font-bold">Check your inbox!</h3>
                                <p>A sign-in link has been sent to <span className="font-semibold">{email}</span>. Click the link to complete sign-in.</p>
                            </div>
                        )}

                        {error && (
                            <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
                        )}
                    </div>
                </div>
            </main>
            <footer className="bg-secondary text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <img
                      src="https://i.postimg.cc/DyvJchrf/edited-image-11.png"
                      alt="Ingcweti Logo"
                      className="h-10 mx-auto mb-4"
                    />
                    <p className="text-sm text-gray-300">© {new Date().getFullYear()} Ingcweti. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Login;