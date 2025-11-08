import React from 'react';

interface EmailSentPageProps {
  email: string;
  flowType: 'signup' | 'login';
  onVerify: () => void;
}

const EmailSentPage: React.FC<EmailSentPageProps> = ({ email, flowType, onVerify }) => {
  const title = flowType === 'signup' ? 'Almost there! Check Your Inbox.' : 'Check Your Inbox';
  const primaryText = `We've sent a ${flowType === 'signup' ? 'sign-up' : 'sign-in'} link to`;
  const buttonText = `Simulate Clicking the ${flowType === 'signup' ? 'Sign-Up' : 'Sign-In'} Link`;
  
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
              {primaryText} <strong className="text-secondary">{email}</strong>. Please click the link in the email to continue.
            </p>
            <div className="my-6">
                <p className="text-sm text-gray-500">(For this demo, just click the button below.)</p>
            </div>
            <button
              onClick={onVerify}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors"
            >
              {buttonText}
            </button>
             <p className="text-xs text-gray-400 mt-4">
                Didn't receive an email? Check your spam folder or try signing up/in again.
            </p>
          </div>
        </div>
      </main>
       <footer className="bg-secondary text-white py-8">
            <div className="container mx-auto px-6 text-center">
                <img src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" alt="Ingcweti Logo" className="h-10 mx-auto mb-4" />
                <p className="text-sm text-gray-300">© {new Date().getFullYear()} Ingcweti. All rights reserved.</p>
            </div>
        </footer>
    </div>
  );
};

export default EmailSentPage;