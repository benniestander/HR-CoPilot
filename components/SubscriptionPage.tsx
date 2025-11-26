
import React, { useState } from 'react';
import { CheckIcon, CreditCardIcon, LoadingIcon, CouponIcon } from './Icons';
import type { User } from '../types';
import { useAuthContext } from '../contexts/AuthContext';
import { processPayment } from '../services/paymentService';
import { validateCoupon } from '../services/dbService';

declare global {
  interface Window {
    YocoSDK: any;
  }
}

interface SubscriptionPageProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({ 
    firstName: user?.name?.split(' ')[0] || '', 
    lastName: user?.name?.split(' ').slice(1).join(' ') || '', 
    email: user?.email || '' 
  });
  const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [discount, setDiscount] = useState(0); // In cents
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  const originalAmount = 74700;
  const finalAmount = Math.max(0, originalAmount - discount);

  const features = [
    'Unlimited HR Policy Generation',
    'Unlimited HR Form Generation',
    'Ingcweti AI-Powered Policy Updates & Analysis',
    'Custom Ingcweti AI Compliance Checklists',
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
      if (!couponCode.trim()) return;
      setCouponMessage(null);
      try {
          const result = await validateCoupon(couponCode.trim(), 'pro');
          if (result.valid && result.coupon) {
              let calculatedDiscount = 0;
              if (result.coupon.discountType === 'fixed') {
                  calculatedDiscount = result.coupon.discountValue;
              } else {
                  calculatedDiscount = (originalAmount * result.coupon.discountValue) / 100;
              }
              setDiscount(calculatedDiscount);
              setAppliedCouponCode(result.coupon.code);
              setCouponMessage({ type: 'success', text: `Coupon applied! You save R${(calculatedDiscount / 100).toFixed(2)}` });
          } else {
              setDiscount(0);
              setAppliedCouponCode(null);
              setCouponMessage({ type: 'error', text: result.message || 'Invalid coupon.' });
          }
      } catch (error) {
          setCouponMessage({ type: 'error', text: 'Error validating coupon.' });
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
        },
        metadata: {
            userId: user?.uid,
            type: 'subscription',
            couponCode: appliedCouponCode || undefined
        }
    });

    setIsLoading(false);

    if (result.success) {
        onSuccess();
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

             {/* Coupon Section */}
             <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Have a coupon?</label>
                <div className="flex space-x-2">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CouponIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                            type="text" 
                            value={couponCode} 
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                            placeholder="Enter code" 
                            className="block w-full pl-10 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    <button 
                        type="button" 
                        onClick={handleApplyCoupon} 
                        disabled={!couponCode}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:bg-gray-400 transition-colors text-sm font-medium"
                    >
                        Apply
                    </button>
                </div>
                {couponMessage && (
                    <p className={`text-xs mt-1 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {couponMessage.text}
                    </p>
                )}
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

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-gray-600">
                    <span>12-Month Membership</span>
                    <span>R{(originalAmount / 100).toFixed(2)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between items-center text-green-600 mt-2">
                        <span>Discount</span>
                        <span>-R{(discount / 100).toFixed(2)}</span>
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
