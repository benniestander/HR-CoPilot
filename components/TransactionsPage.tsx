
import React from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../contexts/AuthContext';
import { HistoryIcon, CreditCardIcon, LoadingIcon, WarningIcon, DownloadIcon, ShieldCheckIcon } from './Icons';
import EmptyState from './EmptyState';
import { invoiceService } from '../services/invoiceService';

interface TransactionsPageProps {
    onBack: () => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ onBack }) => {
    const { user, isLoading } = useAuthContext();

    const handleDownloadInvoice = (tx: any) => {
        if (!user) return;
        invoiceService.generateInvoicePDF(user, tx);
    };

    const formatCurrency = (cents: number) => {
        return (Number(cents) / 100).toLocaleString('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <LoadingIcon className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-gray-500 font-medium">Loading your transactions...</p>
            </div>
        );
    }

    if (!user) return null;

    const sortedTransactions = [...(user.transactions || [])].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-secondary flex items-center gap-3">
                        <HistoryIcon className="w-8 h-8 text-primary" />
                        Payment Transactions
                    </h1>
                    <p className="text-gray-500 mt-1">Review your payment history and balance adjustments.</p>
                </div>
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-white border border-gray-200 text-secondary font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                >
                    Back to Profile
                </button>
            </header>

            {/* Balance Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-6 rounded-3xl border border-secondary/10 shadow-sm"
                >
                    <p className="text-sm font-semibold text-secondary/60 uppercase tracking-wider mb-2">Current Balance</p>
                    <p className="text-4xl font-black text-secondary">{formatCurrency(user.creditBalance)}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-3xl border border-emerald-100 shadow-sm"
                >
                    <p className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider mb-2">Plan Status</p>
                    <p className="text-2xl font-black text-emerald-900">{user.plan === 'pro' ? 'HR CoPilot Pro' : 'Pay-As-You-Go'}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center"
                >
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Transactions</p>
                    <p className="text-3xl font-black text-secondary">{sortedTransactions.length}</p>
                </motion.div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-secondary">History Detail</h3>
                </div>

                {sortedTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/30 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-center">Invoicing</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sortedTransactions.map((tx, idx) => {
                                    const isDeposit = Number(tx.amount) > 0;
                                    return (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-secondary">{formatDate(tx.date)}</span>
                                                    <code className="text-[10px] text-gray-400 font-mono">
                                                        #{tx.id.slice(0, 8)}
                                                    </code>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-700">{tx.description}</span>
                                                    {isDeposit && (
                                                        <span className="text-[10px] inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase w-fit mt-1">
                                                            Credit Top-up
                                                        </span>
                                                    )}
                                                    {!isDeposit && (
                                                        <span className="text-[10px] inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold uppercase w-fit mt-1">
                                                            Utilization
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-sm font-black ${isDeposit ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {isDeposit ? '+' : ''}{formatCurrency(tx.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {isDeposit ? (
                                                    <button
                                                        onClick={() => handleDownloadInvoice(tx)}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/5 text-secondary text-xs font-bold rounded-lg hover:bg-secondary hover:text-white transition-all"
                                                        title="Download Tax Invoice"
                                                    >
                                                        <DownloadIcon className="w-4 h-4" />
                                                        Invoice
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-300 text-xs">—</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12">
                        <EmptyState
                            title="No transactions found"
                            description="When you top up your balance or generate documents, they will appear here."
                            icon={CreditCardIcon}
                        />
                    </div>
                )}
            </div>

            {/* Footer Notice */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex gap-4 items-start">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-800 leading-relaxed">
                    <p className="font-bold mb-1">Automated Tax Invoices</p>
                    <p>Electronic tax invoices are now generated automatically for all deposit transactions. You can download and print your official tax invoice directly from the history list above. For any billing queries, contact accounts@hr-copilot.co.za.</p>
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
