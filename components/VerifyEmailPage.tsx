import React, { useState, useEffect } from 'react';
import { sendEmailVerification, type User as FirebaseUser } from 'firebase/auth';
import { useAuthContext } from '../contexts/AuthContext';

interface VerifyEmailPageProps {
  user: FirebaseUser;
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ user }) => {
  const { handleLogout } = useAuthContext();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleResend = async () => {
    setIsSending(true);
    setMessage('');
    try {
      await sendEmailVerification(user);
      setMessage('A new verification email has been sent successfully.');
    } catch (error: any) {
      setMessage(`Error sending email: ${error.message}`);
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
              A verification link was sent to <strong className="text-secondary">{user.email}</strong> when you signed up.
            </p>
            <p className="text-gray-600 mb-6">
                Please click the link in the email to activate your account. If you can't find it, please check your spam folder.
            </p>

            {message && (
                <p className={`text-sm p-3 rounded-md my-4 ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message}
                </p>
            )}

            <button
              onClick={handleResend}
              disabled={isSending}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
            >
              {isSending ? 'Sending...' : 'Resend Verification Email'}
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