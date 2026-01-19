import React, { useState } from 'react';
import { CreditCardIcon, LoadingIcon, ShieldCheckIcon, CouponIcon, FileIcon, CheckIcon } from './Icons';
import { useAuthContext } from '../contexts/AuthContext';
import { submitInvoiceRequest, validateCoupon } from '../services/dbService';
import { emailService } from '../services/emailService';
import { processYocoPayment } from '../services/paymentService';
import { PaymentModal } from './PaymentModal';
import { useDataContext } from '../contexts/DataContext';

interface PaygPaymentPageProps {
    onTopUpSuccess: (amountInCents: number) => void;
    onCancel: () => void;
    onUpgrade: () => void;
}

const PaygPaymentPage: React.FC<PaygPaymentPageProps> = ({ onTopUpSuccess, onCancel, onUpgrade }) => {
    const { user } = useAuthContext();
    const { proPlanPrice } = useDataContext();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(10000);
    const [customAmount, setCustomAmount] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [discount, setDiscount] = useState(0);
    const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const YOCO_PUBLIC_KEY = (import.meta as any).env?.VITE_YOCO_PUBLIC_KEY || 'pk_test_53ac2c42lWPdK17b8ac4';

    const handleAmountSelect = (amount: number | 'custom') => {
        if (amount === 'custom') {
            setIsCustom(true);
            setSelectedAmount(null);
        } else {
            setIsCustom(false);
            setSelectedAmount(amount);
            setCustomAmount('');
        }
        setDiscount(0);
        setAppliedCouponCode(null);
        setCouponMessage(null);
        setCouponCode('');
    };

    const baseAmount = isCustom ? (Number(customAmount) * 100) : selectedAmount;
    const finalAmount = baseAmount ? Math.max(0, baseAmount - discount) : 0;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim() || !baseAmount) return;
        setCouponMessage(null);
        try {
            const result = await validateCoupon(couponCode.trim(), 'payg');
            if (result.valid && result.coupon) {
                let calculatedDiscount = 0;
                if (result.coupon.discountType === 'fixed') {
                    calculatedDiscount = result.coupon.discountValue;
                } else {
                    calculatedDiscount = (baseAmount * result.coupon.discountValue) / 100;
                }
                if (calculatedDiscount > baseAmount) calculatedDiscount = baseAmount;
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

    const isAmountValid = baseAmount !== null && baseAmount >= 5000;

    const handleRequestInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAmountValid || !baseAmount || !user) return;
        setIsLoading(true);
        setApiError(null);
        try {
            const description = `Credit Top-Up (PAYG)`;
            const reference = await submitInvoiceRequest(user.uid, user.email, 'payg', finalAmount, description);
            await emailService.sendInvoiceInstructions(user.email, user.name || 'Valued Customer', finalAmount, reference, description);
            setIsRequestSent(true);
        } catch (error: any) {
            console.error("Invoice request failed:", error);
            setApiError("Failed to submit request. Please check your internet connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = async (result: any) => {
        try {
            await processYocoPayment({
                token: result.id,
                amountInCents: finalAmount,
                description: `Credit Top-Up (PAYG)`,
                metadata: {
                    userId: user?.uid,
                    type: 'topup',
                    couponCode: appliedCouponCode,
                    description: `Credit Top-Up (PAYG)`
                }
            });
            setShowPaymentModal(false);
            onTopUpSuccess(finalAmount);
        } catch (err: any) {
            console.error("Payment Verification Failed", err);
            setPaymentError(err.message || "Payment verification failed.");
            alert(`Payment failed: ${err.message}`);
            setShowPaymentModal(false);
        }
    };

    if (isRequestSent) {
        return (
            <div className="min-h-screen bg-light font-sans flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center border border-gray-200">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <CheckIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary mb-2">Invoice Requested</h2>
                    <p className="text-gray-600 mb-6">
                        We have received your request for a top-up of <strong>R{(finalAmount / 100).toFixed(2)}</strong>.
                        <br /><br />
                        An email with banking details and your reference number has been sent to <strong>{user?.email}</strong>.
                    </p>
                    <p className="text-xs text-gray-500 mb-6">
                        Once we receive your proof of payment, your credits will be loaded automatically.
                    </p>
                    <button onClick={onCancel} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light font-sans">
            {showPaymentModal && user && (
                <PaymentModal
                    amountInCents={finalAmount}
                    userEmail={user.email}
                    publicKey={YOCO_PUBLIC_KEY}
                    metadata={{
                        userId: user.uid,
                        type: 'topup',
                        couponCode: appliedCouponCode
                    }}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPaymentModal(false)}
                    onError={(msg) => setPaymentError(msg)}
                />
            )}

            <header className="py-4 px-6 container mx-auto flex justify-start items-center">
                <button onClick={onCancel} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <h1 className="text-3xl font-bold text-secondary mb-2 text-center">Top Up Your Credit</h1>
                        <p className="text-gray-600 mb-6 text-center">Add funds instantly with card, or request an invoice for EFT.</p>

                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center mb-6">
                            <p className="text-sm text-green-800">Your current balance is</p>
                            <p className="text-4xl font-bold text-green-900">R{(Number(user?.creditBalance) / 100).toFixed(2)}</p>
                        </div>

                        <form onSubmit={handleRequestInvoice} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-secondary mb-3">Choose an amount:</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[10000, 20000, 50000].map(amount => (
                                        <button type="button" key={amount} onClick={() => handleAmountSelect(amount)} className={`p-4 border-2 rounded-lg text-center font-bold transition-colors ${selectedAmount === amount ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'}`}>
                                            R{(amount / 100)}
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
                                            disabled={!baseAmount}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        disabled={!couponCode || !baseAmount}
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

                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-4 font-bold text-lg text-secondary">
                                    <span>Total Due</span>
                                    <span>R{(finalAmount / 100).toFixed(2)}</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => { setPaymentError(null); setShowPaymentModal(true); }}
                                        disabled={!isAmountValid}
                                        className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg text-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center shadow-lg"
                                    >
                                        <CreditCardIcon className="w-6 h-6 mr-3" />
                                        Pay Now (Instant Credit)
                                    </button>

                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-gray-300"></div>
                                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or pay later</span>
                                        <div className="flex-grow border-t border-gray-300"></div>
                                    </div>

                                    <button type="submit" disabled={isLoading || !isAmountValid} className="w-full bg-white border-2 border-primary text-primary font-bold py-3 px-4 rounded-lg text-lg hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400 transition-colors flex items-center justify-center">
                                        {isLoading ? (
                                            <><LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5" /> Submitting Request...</>
                                        ) : (
                                            <>
                                                <FileIcon className="w-6 h-6 mr-3" />
                                                Request Invoice
                                            </>
                                        )}
                                    </button>
                                </div>

                                {apiError && <p className="text-xs text-red-600 text-center mt-3">{apiError}</p>}
                                {paymentError && <p className="text-xs text-red-600 text-center mt-3 font-bold">{paymentError}</p>}
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 p-6 border-2 border-dashed border-accent rounded-lg bg-accent/10 text-center">
                        <h3 className="text-2xl font-bold text-accent-800">Go Unlimited!</h3>
                        <p className="text-accent-700 my-3 max-w-md mx-auto">Tired of topping up? Upgrade to HR CoPilot Pro for R{(proPlanPrice / 100).toFixed(0)} and get unlimited document generation for a full year, plus access to all premium features.</p>
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
