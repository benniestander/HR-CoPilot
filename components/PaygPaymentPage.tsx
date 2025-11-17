import React, { useState, useEffect } from 'react';
import { CreditCardIcon, LoadingIcon, ShieldCheckIcon } from './Icons';
import type { User, Coupon } from '../types';

declare global {
  interface Window {
    YocoSDK: any;
  }
}

interface PaygPaymentPageProps {
  user: User;
  onTopUpSuccess: (amountInCents: number, couponCode?: string) => void;
  onCancel: () => void;
  onUpgrade: () => void;
  onValidateCoupon: (code: string) => Promise<{ valid: boolean; message: string; coupon?: Coupon }>;
}

const PaygPaymentPage: React.FC<PaygPaymentPageProps> = ({ user, onTopUpSuccess, onCancel, onUpgrade, onValidateCoupon }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10000); // Default to R100
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const [formData, setFormData] = useState({ 
    firstName: user.name?.split(' ')[0] || '', 
    lastName: user.name?.split(' ').slice(1).join(' ') || '', 
  });
  const [errors, setErrors] = useState({ firstName: '', lastName: '' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [validatedCoupon, setValidatedCoupon] = useState<Coupon | null>(null);
  
  const handleAmountSelect = (amount: number | 'custom') => {
    if (amount === 'custom') {
      setIsCustom(true);
      setSelectedAmount(null);
    } else {
      setIsCustom(false);
      setSelectedAmount(amount);
      setCustomAmount('');
    }
  };

  const finalAmount = isCustom ? (Number(customAmount) * 100) : selectedAmount;

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
  
  const validateField = (name: keyof typeof formData, value: string) => {
    let error = '';
    if (!value.trim()) {
        const fieldName = String(name).replace(/([A-Z])/g, ' $1').toLowerCase();
        error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof typeof formData; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // FIX: Add type guard to ensure 'val' is a string before calling trim().
  const isUserDetailsValid = Object.values(formData).every(val => typeof val === 'string' && val.trim() !== '') && Object.values(errors).every(err => err === '');
  const isAmountValid = finalAmount !== null && finalAmount >= 5000;
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    const isFirstNameValid = validateField('firstName', formData.firstName);
    const isLastNameValid = validateField('lastName', formData.lastName);

    if (!isAmountValid || !isFirstNameValid || !isLastNameValid || !finalAmount) return;

    setIsLoading(true);
    setApiError(null);

    const yoco = new (window as any).YocoSDK({
      publicKey: 'pk_test_53ac2c421WPdK17b8ac4',
    });

    yoco.showPopup({
      amountInCents: Math.round(finalAmount),
      currency: 'ZAR',
      name: `Credit Top-Up R${(finalAmount / 100).toFixed(2)}`,
      description: 'Credit for Ingcweti',
      customer: {
        name: formData.firstName,
        surname: formData.lastName,
        email: user.email,
      },
      callback: (result: any) => {
        setIsLoading(false);
        if (result.error) {
          if (result.error.message !== "User closed popup") {
            setApiError(`Payment failed: ${result.error.message}`);
          }
        } else {
          onTopUpSuccess(finalAmount, validatedCoupon?.code);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-light font-sans">
        <header className="py-4 px-6 container mx-auto flex justify-start items-center">
             <button onClick={onCancel} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Back to Dashboard
            </button>
        </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-3xl font-bold text-secondary mb-2 text-center">Top Up Your Credit</h1>
                <p className="text-gray-600 mb-6 text-center">Add funds to your account to generate documents.</p>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center mb-6">
                    <p className="text-sm text-green-800">Your current balance is</p>
                    <p className="text-4xl font-bold text-green-900">R{(user.creditBalance / 100).toFixed(2)}</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-secondary mb-3">Choose an amount:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[10000, 20000, 50000].map(amount => (
                                <button type="button" key={amount} onClick={() => handleAmountSelect(amount)} className={`p-4 border-2 rounded-lg text-center font-bold transition-colors ${selectedAmount === amount ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'}`}>
                                    R{(amount/100)}
                                </button>
                            ))}
                            <button type="button" onClick={() => handleAmountSelect('custom')} className={`p-4 border-2 rounded-lg text-center font-bold transition-colors ${isCustom ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'}`}>
                                Custom
                            </button>
                        </div>
                        {isCustom && (
                            <div className="mt-4">
                                <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700">Custom Amount (R)</label>
                                <input type="number" id="customAmount" value={customAmount} onChange={e => setCustomAmount(e.target.value)} min="50" placeholder="e.g. 150" className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm border-gray-300" />
                                {Number(customAmount) > 0 && Number(customAmount) < 50 && <p className="text-red-600 text-xs mt-1">Minimum top-up is R50.</p>}
                            </div>
                        )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-secondary mb-3">Your Payment Details</h3>
                      <div className="space-y-4">
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
                      </div>
                    </div>


                    <div>
                        <h3 className="text-lg font-semibold text-secondary mb-3">Have a coupon?</h3>
                         <div className="flex">
                            <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter coupon for bonus" className="flex-grow p-2 border rounded-l-md text-sm" />
                            <button type="button" onClick={handleApplyCoupon} className="bg-gray-200 text-gray-700 font-semibold px-4 rounded-r-md text-sm hover:bg-gray-300">Apply</button>
                        </div>
                        {couponStatus && <p className={`text-xs mt-1 ${couponStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{couponStatus.message}</p>}
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <button type="submit" disabled={isLoading || !isAmountValid || !isUserDetailsValid} className="w-full bg-primary text-white font-bold py-4 px-4 rounded-lg text-lg hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex items-center justify-center">
                            {isLoading ? (
                                <><LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5" /> Opening payment...</>
                            ) : (
                                <>
                                <CreditCardIcon className="w-6 h-6 mr-3" />
                                {`Proceed to Pay R${finalAmount ? (finalAmount / 100).toFixed(2) : '0.00'}`}
                                </>
                            )}
                        </button>
                        {apiError && <p className="text-xs text-red-600 text-center mt-3">{apiError}</p>}
                        <p className="text-xs text-gray-400 text-center mt-4">
                            Secure payments processed by Yoco.
                        </p>
                    </div>
                </form>
            </div>

            <div className="mt-8 p-6 border-2 border-dashed border-accent rounded-lg bg-accent/10 text-center">
                 <h3 className="text-2xl font-bold text-accent-800">Go Unlimited!</h3>
                 <p className="text-accent-700 my-3 max-w-md mx-auto">Tired of topping up? Upgrade to Ingcweti Pro for R747 and get unlimited document generation for a full year, plus access to all premium features.</p>
                 <button onClick={onUpgrade} className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors inline-flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    Upgrade to Pro Now
                 </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default PaygPaymentPage;