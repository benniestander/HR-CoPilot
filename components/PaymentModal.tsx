import React, { useState } from 'react';
import { LoadingIcon, CreditCardIcon } from './Icons';

// Extend the Window interface to include the YocoSDK, preventing TypeScript errors.
declare global {
  interface Window {
    YocoSDK: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (couponCode?: string) => void;
  amountInCents: number;
  itemName: string;
  couponCode?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, amountInCents, itemName, couponCode }) => {
  const [formData, setFormData] = useState({ name: '', surname: '', email: '' });
  const [errors, setErrors] = useState({ name: '', surname: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isOpen) return null;
  
  const validateField = (name: keyof typeof formData, value: string) => {
    let error = '';
    switch (name) {
        case 'name':
            if (!value.trim()) error = 'First name is required.';
            break;
        case 'surname':
            if (!value.trim()) error = 'Last name is required.';
            break;
        case 'email':
            if (!value.trim()) {
                error = 'Email is required.';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                error = 'Please enter a valid email address.';
            }
            break;
        default:
            break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof typeof formData; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNameValid = validateField('name', formData.name);
    const isSurnameValid = validateField('surname', formData.surname);
    const isEmailValid = validateField('email', formData.email);
    
    if (!isNameValid || !isSurnameValid || !isEmailValid) {
        return;
    }

    setIsLoading(true);
    setApiError(null);

    // This assumes the YocoSDK script has been loaded in index.html
    const yoco = new (window as any).YocoSDK({
      // IMPORTANT: Replace this with your actual Yoco public key
      publicKey: 'pk_test_53ac2c421WPdK17b8ac4',
    });

    yoco.showPopup({
      amountInCents: amountInCents,
      currency: 'ZAR',
      name: itemName,
      description: 'Service from HR Co-Pilot',
      customer: {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
      },
      callback: async (result: any) => {
        setIsLoading(false);

        if (result.error) {
          if (result.error.message !== "User closed popup") {
            setApiError(`Payment failed: ${result.error.message}`);
          } else {
             onClose();
          }
        } else {
          console.log("Received Yoco token:", result.id);
          console.log("Simulating successful backend payment processing...");
          onSuccess(couponCode);
        }
      },
    });
  };
  
  const isFormValid = Object.values(formData).every(val => typeof val === 'string' && val.trim() !== '') && Object.values(errors).every(err => err === '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-sm flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
      >
        <div className="p-6 border-b border-gray-200 text-center flex-shrink-0">
          <h2 id="payment-title" className="text-xl font-bold text-secondary">Complete Your Purchase</h2>
          <p className="text-gray-600 mt-1">Fill in your details to proceed.</p>
        </div>
        
        <form onSubmit={handlePayment} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 md:p-8 overflow-y-auto">
                <h3 className="text-lg font-semibold text-secondary mb-4 text-left">Your Details</h3>
                <div className="space-y-5 text-left">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`block w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                required
                                className={`block w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.surname ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.surname && <p className="text-red-600 text-xs mt-1">{errors.surname}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="mt-1">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`block w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">{itemName}</p>
                    <p className="text-4xl sm:text-5xl font-bold text-secondary my-2">
                        R{(amountInCents / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Billed once for 12 months access.</p>
                </div>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex items-center justify-center"
            >
                {isLoading ? (
                <>
                    <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Processing...
                </>
                ) : (
                    <>
                        <CreditCardIcon className="w-5 h-5 mr-2" />
                        Pay Now with Yoco
                    </>
                )}
            </button>
            {apiError && <p className="text-xs text-red-600 text-center mt-3">{apiError}</p>}
            <p className="text-xs text-gray-400 text-center mt-4">
                Secure payments are processed by Yoco.
            </p>
            </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;