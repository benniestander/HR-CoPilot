import React, { useState, useEffect } from 'react';
import { sendEmailVerification, type User as FirebaseUser } from 'firebase/auth';
import { useAuthContext } from '../contexts/AuthContext';

interface VerifyEmailPageProps {
  user: FirebaseUser;
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ user }) => {
  const { handleLogout } = useAuthContext();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Periodically check verification status
  useEffect(() => {
    const interval = setInterval(async () => {
      // The user object is the unverified FirebaseUser instance
      await user.reload();
      // The onIdTokenChanged listener in useAuth will automatically detect
      // the change in emailVerified status and update the application state,
      // transitioning the user to the main app without a page reload.
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    
    setIsSending(true);
    setMessage(null);
    try {
      await sendEmailVerification(user);
      setMessage({ type: 'success', text: 'A new verification email has been sent. Please check your inbox and spam folder.' });
      setCooldown(60); // Start 60s cooldown
    } catch (error: any) {
      // Firebase throws specific errors for rate limiting
      if (error.code === 'auth/too-many-requests') {
         setMessage({ type: 'error', text: 'Too many requests. Please wait a few minutes before trying again.' });
         setCooldown(60);
      } else {
         setMessage({ type: 'error', text: `Error sending email: ${error.message}` });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-light text-secondary flex flex-col">
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto flex justify-between items-center px-6">
          <img
            src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png"
            alt="HR CoPilot Logo"
            className="h-12"
          />
           <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </header>
      <main className="flex-grow container mx-auto flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
            <h1 className="text-2xl font-bold text-secondary mb-2">Please Verify Your Email</h1>
            <p className="text-gray-600 mb-4">
              A verification link was sent to <strong className="text-secondary">{user.email}</strong>.
            </p>
            <p className="text-gray-600 mb-6">
                Please click the link in the email to activate your account.
                <br/><span className="font-bold text-primary">Check your Spam or Junk folder if you don't see it.</span>
            </p>

            {message && (
                <p className={`text-sm p-3 rounded-md my-4 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message.text}
                </p>
            )}

            <button
              onClick={handleResend}
              disabled={isSending || cooldown > 0}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend Verification Email'}
            </button>
            <p className="text-xs text-gray-400 mt-4">
                This page will automatically update once you've verified your email.
            </p>
          </div>
        </div>
      </main>
       <footer className="bg-secondary text-white py-8">
            <div className="container mx-auto px-6 text-center">
                <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="HR CoPilot Logo" className="h-10 mx-auto mb-4" />
                <p className="text-sm text-gray-300">© {new Date().getFullYear()} HR CoPilot. All rights reserved.</p>
            </div>
        </footer>
    </div>
  );
};

export default VerifyEmailPage;