

import React, { useState } from 'react';
import { CheckIcon, CreditCardIcon, LoadingIcon } from './Icons';

// Yoco SDK type
declare global {
  interface Window {
    YocoSDK: any;
  }
}

interface SubscriptionPageProps {
  onSuccess: () => void;
  onLogout: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onSuccess, onLogout }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const amountInCents = 50000;
  const itemName = "Ingcweti Pro (12 Months)";

  const features = [
    'Unlimited HR Policy Generation',
    'Unlimited HR Form Generation',
    'AI-Powered Policy Updates & Analysis',
    'Custom Compliance Checklists',
    'Secure Document History',
    'Priority Support',
  ];

  const validateField = (name: keyof typeof formData, value: string) => {
    let error = '';
    if (!value.trim()) {
        // FIX: Cast `name` to string to ensure .replace() is available.
        const fieldName = String(name).replace(/([A-Z])/g, ' $1').toLowerCase();
        error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        error = 'Please enter a valid email address.';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof typeof formData; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
  
  // FIX: Add a `typeof` check to ensure `val` is a string before calling .trim().
  const isFormValid = Object.values(formData).every(val => typeof val === 'string' && val.trim() !== '') && Object.values(errors).every(err => err === '');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isFirstNameValid = validateField('firstName', formData.firstName);
    const isLastNameValid = validateField('lastName', formData.lastName);
    const isEmailValid = validateField('email', formData.email);
    
    if (!isFirstNameValid || !isLastNameValid || !isEmailValid) return;

    setIsLoading(true);
    setApiError(null);

    const yoco = new (window as any).YocoSDK({
      publicKey: 'pk_test_53ac2c421WPdK17b8ac4',
    });

    yoco.showPopup({
      amountInCents,
      currency: 'ZAR',
      name: itemName,
      description: '12 months full access to the HR Co-Pilot platform.',
      customer: {
        name: formData.firstName,
        surname: formData.lastName,
        email: formData.email,
      },
      callback: (result: any) => {
        setIsLoading(false);
        if (result.error) {
          if (result.error.message !== "User closed popup") {
            setApiError(`Payment failed: ${result.error.message}`);
          }
        } else {
          onSuccess();
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-light text-secondary flex flex-col">
      <header className="py-6 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <img 
            src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png" 
            alt="Ingcweti Logo" 
            className="h-12"
          />
          <button onClick={onLogout} className="text-sm font-semibold text-gray-600 hover:text-primary">
            Logout
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side */}
          <div className="lg:col-span-3 space-y-8">
            {/* Plan Selection */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Choose your plan</h2>
              <div className="border-2 border-primary rounded-lg p-4 bg-primary/5 relative">
                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Selected</div>
                <h3 className="text-lg font-bold text-secondary">12-Month Membership</h3>
                <p className="text-2xl font-bold text-secondary mt-1">R500 <span className="text-base font-normal text-gray-600">/ for 12 months</span></p>
              </div>
            </div>

            {/* Your Details Form */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Details</h2>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
            
            <div className="pt-4">
                 <button type="submit" disabled={isLoading || !isFormValid} className="w-full bg-primary text-white font-bold py-4 px-4 rounded-lg text-lg hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex items-center justify-center">
                    {isLoading ? (
                        <><LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5" /> Opening payment gateway...</>
                    ) : (
                        <>
                            <CreditCardIcon className="w-6 h-6 mr-3" />
                            Confirm & Pay with Yoco
                        </>
                    )}
                </button>
                {apiError && <p className="text-xs text-red-600 text-center mt-3">{apiError}</p>}
                <p className="text-xs text-gray-400 text-center mt-4">
                    Secure payments are processed by Yoco. You will be redirected to a secure payment page.
                </p>
            </div>
          </div>
          
          {/* Right Side - Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-8">
              <h2 className="text-2xl font-bold mb-4">Plan details</h2>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-gray-600">
                    <span>12-Month Membership</span>
                    <span>R500.00</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg mt-4">
                    <span>Total Due Today</span>
                    <span>R500.00</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
      <footer className="py-6 text-center mt-8">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Ingcweti. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SubscriptionPage;