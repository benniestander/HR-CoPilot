import React from 'react';

interface EmailSentPageProps {
  email: string;
  flowType: 'signup' | 'login' | 'payg_signup';
  onShowPrivacyPolicy: () => void;
  onShowTerms: () => void;
}

const EmailSentPage: React.FC<EmailSentPageProps> = ({ email, flowType, onShowPrivacyPolicy, onShowTerms }) => {
  const title = "Account Created! Please Verify Your Email";
  const primaryText = "We've sent a verification link to";
  
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
            <h1 className="text-2xl font-bold text-secondary mb-2">{title}</h1>
            <p className="text-gray-600 mb-6">
              {primaryText} <strong className="text-secondary">{email}</strong>. Please click the link in the email to activate your account. You will be able to log in afterwards.
            </p>
            <div className="my-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 mt-4">
                Didn't receive an email? Check your spam folder or try signing up again.
            </p>
          </div>
        </div>
      </main>
       <footer className="bg-secondary text-white py-8">
            <div className="container mx-auto px-6 text-center">
                <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="Ingcweti Logo" className="h-10 mx-auto mb-4" />
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

export default EmailSentPage;