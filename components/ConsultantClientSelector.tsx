import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Lock,
    CreditCard,
    Building2,
    User,
    Plus,
    TrendingUp,
    ShieldCheck,
    ChevronRight,
    SearchX,
    LayoutDashboard,
    Briefcase,
    Users
} from 'lucide-react';
import type { ClientProfile } from '../types';
import { useAuthContext } from '../contexts/AuthContext';
import { useUIContext } from '../contexts/UIContext';
import { Button } from './ui/button';

import BulkImportModal from './BulkImportModal';

interface ConsultantClientSelectorProps {
    clients: ClientProfile[];
    onSelect: (client: ClientProfile) => void;
}

const ConsultantClientSelector: React.FC<ConsultantClientSelectorProps> = ({ clients, onSelect }) => {
    const { payClientAccessFee, user } = useAuthContext();
    const { navigateTo } = useUIContext();
    const [search, setSearch] = useState('');
    const [loadingClient, setLoadingClient] = useState<string | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const handlePayClient = async (e: React.MouseEvent, clientId: string) => {
        e.stopPropagation();
        setLoadingClient(clientId);
        try {
            await payClientAccessFee(clientId);
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

    const activeClientsCount = clients.filter(c => !isExpired(c)).length;
    const expiredClientsCount = clients.length - activeClientsCount;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-12">
            {/* Header / Stats Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-4"
                    >
                        <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Consultant Command Centre</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                        Client Portfolio
                    </h1>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-w-[140px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-black text-slate-900">{activeClientsCount}</span>
                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-w-[140px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Locked</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-black text-slate-900">{expiredClientsCount}</span>
                            <div className="p-1.5 bg-red-50 rounded-lg">
                                <Lock className="w-4 h-4 text-red-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-w-[140px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Index</span>
                        <div className="flex items-end justify-between">
                            <span className={`text-2xl font-black ${(clients.length > 0 && (activeClientsCount / clients.length) < 0.5) ? 'text-red-500' : 'text-primary'
                                }`}>
                                {clients.length > 0 ? Math.round((activeClientsCount / clients.length) * 100) : 0}%
                            </span>
                            <div className={`p-1.5 rounded-lg ${(clients.length > 0 && (activeClientsCount / clients.length) < 0.5) ? 'bg-red-50' : 'bg-primary/5'
                                }`}>
                                <TrendingUp className={`w-4 h-4 ${(clients.length > 0 && (activeClientsCount / clients.length) < 0.5) ? 'text-red-500' : 'text-primary'
                                    }`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategy Guardrail: Pro-Agency Upsell */}
            {user?.plan === 'consultant' && activeClientsCount >= 5 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary rounded-xl">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="text-white font-black text-sm uppercase tracking-tight">Scale to "Agency" & Save</h4>
                            <p className="text-slate-400 text-xs">Unlock unlimited clients for R5,000/year and stop paying individual access fees.</p>
                        </div>
                    </div>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10">
                        Upgrade Tier
                    </Button>
                </motion.div>
            )}

            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by company or primary contact..."
                        className="w-full h-16 pl-14 pr-6 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => setIsImportModalOpen(true)}
                        className="h-16 px-6 rounded-2xl flex-grow sm:flex-initial font-bold text-xs uppercase tracking-widest border-slate-200 hover:border-primary/30 hover:text-primary transition-colors"
                    >
                        Bulk Import
                    </Button>
                    <Button
                        className="h-16 px-8 rounded-2xl flex-grow sm:flex-initial font-black text-sm uppercase tracking-widest"
                        onClick={() => {
                            // Navigate to profile page and mention that we want clients tab
                            (window as any).nextProfileTab = 'clients';
                            navigateTo('profile');
                        }}
                    >
                        <Plus className="w-5 h-5 mr-2" /> Add Client
                    </Button>
                </div>
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filtered.map((client, idx) => (
                        <motion.div
                            key={client.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={!isExpired(client) ? { y: -5 } : {}}
                            onClick={() => !isExpired(client) && onSelect(client)}
                            className={`group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all overflow-hidden ${isExpired(client) ? 'cursor-default' : 'cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20'
                                }`}
                        >
                            {/* Card Decoration */}
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${isExpired(client) ? 'bg-red-500' : 'bg-primary'
                                }`} />

                            {/* Client Identification */}
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-4 rounded-2xl transition-colors ${isExpired(client) ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                                        }`}>
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-xl font-black text-slate-900 truncate leading-tight">{client.companyName}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Briefcase className="w-3 h-3 text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                                {client.industry || 'General Business'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center space-x-3 text-slate-600 font-medium text-sm">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span>{client.name}</span>
                                </div>
                            </div>

                            {/* Status & Action */}
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                {isExpired(client) ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Access Expired</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Access</span>
                                    </div>
                                )}

                                {!isExpired(client) && (
                                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            {/* Lock Overlay for Expired Clients */}
                            {isExpired(client) && (
                                <div className="absolute inset-x-0 bottom-0 top-[20%] bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-end pb-8 px-8 text-center">
                                    <div className="mb-auto mt-4 p-4 bg-white rounded-full shadow-lg">
                                        <Lock className="w-6 h-6 text-red-400" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 mb-4 px-4 line-clamp-2">
                                        Annual compliance access for this client has expired.
                                    </p>
                                    <Button
                                        onClick={(e) => handlePayClient(e, client.id)}
                                        disabled={loadingClient === client.id}
                                        variant="default"
                                        className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
                                    >
                                        {loadingClient === client.id ? "Processing..." : (
                                            <>
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                Renew - R750.00
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty States */}
            {filtered.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-24 text-center"
                >
                    <div className="inline-flex p-6 bg-slate-50 rounded-full mb-6">
                        <SearchX className="w-12 h-12 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No matching results</h3>
                    <p className="text-slate-500 font-medium">We couldn't find any clients matching "{search}".</p>
                </motion.div>
            )}

            {clients.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200"
                >
                    <div className="inline-flex p-6 bg-white rounded-full mb-6 shadow-sm">
                        <Users className="w-12 h-12 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Portfolio Empty</h3>
                    <p className="text-slate-500 font-medium mb-8">You haven't added any clients to your institutional portal yet.</p>
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsImportModalOpen(true)}
                            className="rounded-2xl px-8 h-14 font-bold text-xs uppercase tracking-widest border-slate-200"
                        >
                            Bulk Import
                        </Button>
                        <Button
                            size="lg"
                            className="rounded-2xl px-10 h-14 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20"
                            onClick={() => {
                                (window as any).nextProfileTab = 'clients';
                                navigateTo('profile');
                            }}
                        >
                            Onboard First Client
                        </Button>
                    </div>
                </motion.div>
            )}

            <BulkImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={() => window.location.reload()} // Force refresh to show new clients
            />
        </div>
    );
};

export default ConsultantClientSelector;
