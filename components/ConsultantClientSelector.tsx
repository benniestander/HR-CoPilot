import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, LockIcon, CreditCardIcon } from './Icons';
import type { ClientProfile } from '../types';
import { useAuthContext } from '../contexts/AuthContext';

// Simple Icons inline if needed, or import.
// Checking Icons.tsx content might be good but let's assume SearchIcon exists or use generic
const BuildingIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

interface ConsultantClientSelectorProps {
    clients: ClientProfile[];
    onSelect: (client: ClientProfile) => void;
}

const ConsultantClientSelector: React.FC<ConsultantClientSelectorProps> = ({ clients, onSelect }) => {
    const { payClientAccessFee } = useAuthContext();
    const [search, setSearch] = useState('');
    const [loadingClient, setLoadingClient] = useState<string | null>(null);

    const handlePayClient = async (e: React.MouseEvent, clientId: string) => {
        e.stopPropagation();
        setLoadingClient(clientId);
        try {
            await payClientAccessFee(clientId);
            alert("Client access unlocked for 1 year!");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoadingClient(null);
        }
    };

    const isExpired = (client: ClientProfile) => {
        if (!client.paidUntil) return true;
        return new Date(client.paidUntil) < new Date();
    };

    const filtered = (clients || []).filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.companyName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Select a Client</h1>
                <p className="text-gray-500">Choose a client context to manage their HR profile.</p>
            </div>

            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search clients..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(client => (
                    <motion.div
                        key={client.id}
                        whileHover={!isExpired(client) ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!isExpired(client) ? { scale: 0.98 } : {}}
                        onClick={() => !isExpired(client) && onSelect(client)}
                        className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all group relative overflow-hidden ${isExpired(client) ? 'cursor-default grayscale-[0.5]' : 'cursor-pointer hover:shadow-lg hover:border-primary/20'
                            }`}
                    >
                        {isExpired(client) && (
                            <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 z-10 text-center">
                                <LockIcon className="w-8 h-8 text-slate-400 mb-2" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">ACCESS EXPIRED</p>
                                <button
                                    onClick={(e) => handlePayClient(e, client.id)}
                                    disabled={loadingClient === client.id}
                                    className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-lg shadow-lg hover:bg-black transition-all flex items-center gap-2"
                                >
                                    {loadingClient === client.id ? "..." : (
                                        <>
                                            <CreditCardIcon className="w-3 h-3" />
                                            PAY R750
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <BuildingIcon className="w-6 h-6" />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-gray-900 truncate">{client.companyName}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">{client.industry || 'No Industry'}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 border-t border-gray-50 pt-3 mt-1">
                            <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                            {client.name}
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                    className="bg-gray-50 border-2 border-dashed border-gray-200 p-6 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer min-h-[160px]"
                    onClick={() => alert("Add Client flow would go here via Settings.")} // Simple placeholder for now, user asked for it in Settings
                >
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 shadow-sm">
                        <span className="text-2xl font-light text-gray-300">+</span>
                    </div>
                    <span className="font-semibold text-sm">Add New Client</span>
                </motion.div>
            </div>

            {filtered.length === 0 && clients.length > 0 && (
                <p className="text-center text-gray-500 mt-12">No clients found matching "{search}".</p>
            )}

            {clients.length === 0 && (
                <div className="text-center mt-12">
                    <p className="text-gray-500 mb-4">You don't have any linked clients yet.</p>
                    <button className="text-primary font-bold hover:underline">Go to Settings to add clients</button>
                </div>
            )}
        </div>
    );
};

export default ConsultantClientSelector;
