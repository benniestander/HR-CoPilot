
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

interface VerifyEmailPageProps {
  user: any;
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ user }) => {
  const { handleLogout } = useAuthContext();

  // In Supabase, verification happens via email link. 
  // The page will reload when the user clicks the link and auth state changes.

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
              A verification link was sent to your email address.
            </p>
            <p className="text-gray-600 mb-6">
                Please click the link in the email to activate your account.
                <br/><span className="font-bold text-primary">Check your Spam or Junk folder if you don't see it.</span>
            </p>

            <p className="text-xs text-gray-400 mt-4">
                Once verified, you will be automatically logged in or redirected.
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