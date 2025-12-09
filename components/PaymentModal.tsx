
import React, { useState } from 'react';
import { LoadingIcon, FileIcon, CheckIcon } from './Icons';
import { submitInvoiceRequest } from '../services/dbService';
import { emailService } from '../services/emailService';
import { useAuthContext } from '../contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amountInCents: number;
  itemName: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, amountInCents, itemName }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isOpen) return null;
  
  const handleRequestInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setApiError(null);

    try {
        // 1. Create Admin Notification
        const reference = await submitInvoiceRequest(
            user.uid,
            user.email,
            'payg',
            amountInCents,
            itemName
        );

        // 2. Send Email
        await emailService.sendInvoiceInstructions(
            user.email,
            user.name || 'Customer',
            amountInCents,
            reference,
            itemName
        );

        setIsSuccess(true);
        // We do NOT call onSuccess() immediately because that triggers the "Document Generated" flow.
        // The user must wait for credits to be added manually.

    } catch (error: any) {
        console.error("Invoice request error:", error);
        setApiError("Failed to request invoice. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  if (isSuccess) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm flex flex-col p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-secondary mb-2">Request Sent</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Please check your email for the invoice and banking details. Your credits will be added once payment is received.
                </p>
                <button onClick={onClose} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90">
                    Close
                </button>
            </div>
        </div>
      );
  }

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
          <h2 id="payment-title" className="text-xl font-bold text-secondary">One-Time Purchase</h2>
          <p className="text-gray-600 mt-1 text-sm">Request an invoice to pay via EFT.</p>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto">
            <div className="text-center mb-6">
                <p className="text-sm text-gray-500">{itemName}</p>
                <p className="text-4xl font-bold text-secondary my-2">
                    R{(amountInCents / 100).toFixed(2)}
                </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md text-left text-sm text-gray-600 mb-4 border border-gray-200">
                <p><strong>Note:</strong> Since this is a manual EFT payment, your credits will not reflect immediately.</p>
            </div>

            {apiError && <p className="text-xs text-red-600 text-center mb-4">{apiError}</p>}

            <button
                onClick={handleRequestInvoice}
                disabled={isLoading}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex items-center justify-center"
            >
                {isLoading ? (
                <>
                    <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Sending Request...
                </>
                ) : (
                    <>
                        <FileIcon className="w-5 h-5 mr-2" />
                        Request Invoice
                    </>
                )}
            </button>
            <button onClick={onClose} className="mt-3 text-sm text-gray-500 hover:text-gray-800 w-full text-center">
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
