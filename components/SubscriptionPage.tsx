import React, { useState, useEffect } from 'react';
import { CheckIcon, CreditCardIcon, LoadingIcon } from './Icons';
import type { User, Coupon } from '../types';
import { useAuthContext } from '../contexts/AuthContext';
import { processPayment } from '../services/paymentService';

declare global {
  interface Window {
    YocoSDK: any;
  }
}

interface SubscriptionPageProps {
  onSuccess: (couponCode?: string) => void;
  onCancel: () => void;
  onValidateCoupon: (code: string) => Promise<{ valid: boolean; message: string; coupon?: Coupon }>;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onSuccess, onCancel, onValidateCoupon }) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({ 
    firstName: user?.name?.split(' ')[0] || '', 
    lastName: user?.name?.split(' ').slice(1).join(' ') || '', 
    email: user?.email || '' 
  });
  const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [validatedCoupon, setValidatedCoupon] = useState<Coupon | null>(null);
  
  const originalAmount = 74700;
  const [finalAmount, setFinalAmount] = useState(originalAmount);

  useEffect(() => {
    if (validatedCoupon) {
      let discount = 0;
      if (validatedCoupon.type === 'fixed') {
        discount = validatedCoupon.value;
      } else { // percentage
        discount = (originalAmount * validatedCoupon.value) / 100;
      }
      setFinalAmount(Math.max(0, originalAmount - discount));
    } else {
      setFinalAmount(originalAmount);
    }
  }, [validatedCoupon, originalAmount]);

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

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    const result = await onValidateCoupon(couponCode);
    if (result.valid && result.coupon) {
      setCouponStatus({ message: result.message, type: 'success' });
      setValidatedCoupon(result.coupon);
    } else {
      setCouponStatus({ message: result.message, type: 'error' });
      setValidatedCoupon(null);
    }
  };
  
  const isFormValid = Object.values(formData).every(val => typeof val === 'string' && val.trim() !== '') && Object.values(errors).every(err => err === '');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    setIsLoading(true);
    setApiError(null);

    const result = await processPayment({
        amountInCents: Math.round(finalAmount),
        name: 'HR CoPilot Pro (12 Months)',
        description: '12 months full access to the HR CoPilot platform.',
        customer: {
            name: formData.firstName,
            surname: formData.lastName,
            email: formData.email
        }
    });

    setIsLoading(false);

    if (result.success) {
        onSuccess(validatedCoupon?.code);
    } else if (result.error && result.error !== "User cancelled") {
        setApiError(`Payment failed: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-light font-sans">
        <header className="py-4 px-6 container mx-auto flex justify-between items-center">
             <button onClick={onCancel} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L6 9.586V7a1 1 0 00-2 0v4a1 1 0 001 1h4a1 1 0 100-2H7.414l3.293-3.293z" clipRule="evenodd" />
                </svg>
                Cancel
            </button>
            <a href="mailto:admin@hrcopilot.co.za" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                Questions? <span className="text-primary underline">Talk to us</span>
            </a>
        </header>

      <main className="container mx-auto p-4 md:p-8">
        <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
          
          <div className="lg:col-span-3 space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">Choose your plan</h2>
              <div className="border-2 border-primary rounded-lg p-6 bg-primary/5 relative flex items-center">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center mr-4">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-secondary">HR CoPilot Pro Membership</h3>
                    <p className="text-xl font-bold text-secondary mt-1">R747 <span className="text-base font-normal text-gray-600">/ 12 months</span></p>
                </div>
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">SAVE 20%</div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">Pay with</h2>
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
                <p className="text-xs text-gray-500 mb-4">By providing your details, you allow HR CoPilot to charge your card via our secure payment partner, Yoco.</p>
                 <button type="submit" disabled={isLoading || !isFormValid} className="w-full bg-primary text-white font-bold py-4 px-4 rounded-lg text-lg hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex items-center justify-center">
                    {isLoading ? (
                        <><LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5" /> Opening payment gateway...</>
                    ) : (
                        `Confirm & Subscribe - R${(finalAmount / 100).toFixed(2)}`
                    )}
                </button>
                {apiError && <p className="text-xs text-red-600 text-center mt-3">{apiError}</p>}
                <p className="text-xs text-gray-400 text-center mt-4">
                    You will be redirected to a secure payment page.
                </p>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-8">
              <h2 className="text-2xl font-bold text-secondary mb-6">Plan details</h2>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
               <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                 <div className="flex">
                    <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="flex-grow p-2 border rounded-l-md text-sm" />
                    <button type="button" onClick={handleApplyCoupon} className="bg-gray-200 text-gray-700 font-semibold px-4 rounded-r-md text-sm hover:bg-gray-300">Apply</button>
                 </div>
                 {couponStatus && <p className={`text-xs mt-1 ${couponStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{couponStatus.message}</p>}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-gray-600">
                    <span>12-Month Membership</span>
                    <span>R{(originalAmount / 100).toFixed(2)}</span>
                </div>
                 {validatedCoupon && (
                    <div className="flex justify-between items-center text-green-600">
                        <span>Discount ({validatedCoupon.code})</span>
                        <span>- R{((originalAmount - finalAmount) / 100).toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center font-bold text-xl mt-4">
                    <span>Total Due Today (ZAR)</span>
                    <span>R{(finalAmount / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SubscriptionPage;