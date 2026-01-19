import React, { useState } from 'react';
import { CheckIcon, LoadingIcon, CouponIcon, FileIcon, ShieldCheckIcon, CreditCardIcon } from './Icons';
import { useAuthContext } from '../contexts/AuthContext';
import { submitInvoiceRequest, validateCoupon } from '../services/dbService';
import { emailService } from '../services/emailService';
import { PaymentModal } from './PaymentModal';
import { useDataContext } from '../contexts/DataContext';

interface SubscriptionPageProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onSuccess, onCancel }) => {
    const { user } = useAuthContext();
    const { proPlanPrice } = useDataContext();
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

    const originalAmount = proPlanPrice;
    const finalAmount = Math.max(0, originalAmount - discount);

    const features = [
        'Unlimited HR Policy Generation',
        'Unlimited HR Form Generation',
        'Ingcweti AI-Powered Policy Updates & Analysis',
        'Custom Ingcweti AI Compliance Checklists',
        'Secure Document History',
        'Priority Support',
    ];

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

    const handleRequestInvoice = async () => {
        if (!user) return;
        setIsLoading(true);
        setApiError(null);
        try {
            const description = `Pro Subscription (12 Months)`;
            const reference = await submitInvoiceRequest(user.uid, user.email, 'pro', finalAmount, description);
            await emailService.sendInvoiceInstructions(user.email, user.name || 'Valued Customer', finalAmount, reference, description);
            setIsRequestSent(true);
        } catch (error: any) {
            console.error("Invoice request failed:", error);
            setApiError("Failed to submit request. Please check your internet connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = (result: any) => {
        setShowPaymentModal(false);
        onSuccess();
    };

    if (isRequestSent) {
        return (
            <div className="min-h-screen bg-light font-sans flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center border border-gray-200">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <CheckIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary mb-2">Request Received</h2>
                    <p className="text-gray-600 mb-6">
                        We have received your request for <strong>HR CoPilot Pro</strong>.
                        <br /><br />
                        An invoice for <strong>R{(finalAmount / 100).toFixed(2)}</strong> has been sent to <strong>{user?.email}</strong>.
                    </p>
                    <p className="text-xs text-gray-500 mb-6">
                        Your account will be upgraded immediately once proof of payment is verified.
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
                        type: 'subscription',
                        couponCode: appliedCouponCode
                    }}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPaymentModal(false)}
                    onError={(msg) => setPaymentError(msg)}
                />
            )}

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
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">

                    <div className="lg:col-span-3 space-y-10">
                        <div>
                            <h2 className="text-3xl font-bold text-secondary mb-6">Upgrade to Pro</h2>
                            <div className="border-2 border-primary rounded-lg p-6 bg-primary/5 relative flex items-center">
                                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center mr-4">
                                    <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-secondary">HR CoPilot Pro Membership</h3>
                                    <p className="text-xl font-bold text-secondary mt-1">R{(originalAmount / 100).toFixed(0)} <span className="text-base font-normal text-gray-600">/ 12 months</span></p>
                                </div>
                                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">SAVE 20%</div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5">
                            <div className="flex items-center text-secondary">
                                <ShieldCheckIcon className="w-6 h-6 mr-3 text-primary" />
                                <div>
                                    <h3 className="font-bold">Secure Payment</h3>
                                    <p className="text-sm text-gray-500">Pay instantly with card via Yoco, or request an invoice for EFT.</p>
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

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                type="button"
                                onClick={() => { setPaymentError(null); setShowPaymentModal(true); }}
                                className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg text-lg hover:bg-green-700 transition-colors flex items-center justify-center shadow-lg"
                            >
                                <CreditCardIcon className="w-6 h-6 mr-3" />
                                Pay Now - R{(finalAmount / 100).toFixed(2)}
                            </button>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or pay later</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            <button onClick={handleRequestInvoice} disabled={isLoading} className="w-full bg-white border-2 border-primary text-primary font-bold py-3 px-4 rounded-lg text-lg hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400 transition-colors flex items-center justify-center">
                                {isLoading ? (
                                    <><LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5" /> Sending Request...</>
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
                                    <span>Total Due</span>
                                    <span>R{(finalAmount / 100).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubscriptionPage;
