
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserIcon,
    ShieldCheckIcon,
    EditIcon,
    MasterPolicyIcon,
    FormsIcon,
    CheckIcon,
    CreditCardIcon,
    HistoryIcon,
    FileUploadIcon,
    FileIcon,
    TrashIcon,
    ComplianceIcon,
    UpdateIcon,
    RegisterIcon,
    LockIcon
} from './Icons';
import type { CompanyProfile, GeneratedDocument, UserFile, Policy, Form, PolicyType, FormType, ClientProfile } from '../types';
import { INDUSTRIES, POLICIES, FORMS } from '../constants';
import { useAuthContext } from '../contexts/AuthContext';
import { useDataContext } from '../contexts/DataContext';
import { useUIContext } from '../contexts/UIContext';
import { updateConsultantClients, retractUser, retractClient } from '../services/dbService';
import EmptyState from './EmptyState';

interface ProfilePageProps {
    onBack: () => void;
    onUpgrade: () => void;
    onGoToTopUp: () => void;
    onRedoOnboarding: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
    onBack,
    onUpgrade,
    onGoToTopUp,
    onRedoOnboarding
}) => {
    const { user, handleLogout: onLogout, setUser, payClientAccessFee, updateBranding, markConsultantWelcomeAsSeen } = useAuthContext();
    const {
        generatedDocuments,
        userFiles,
        isLoadingUserDocs,
        isLoadingUserFiles,
        handleUpdateProfile: onUpdateProfile,
        handleFileUpload: onFileUpload,
        handleFileDownload: onFileDownload,
        handleDeleteUserFile: onFileDelete,
        handleProfilePhotoUpload: onProfilePhotoUpload,
        handleProfilePhotoDelete: onProfilePhotoDelete,
    } = useDataContext();
    const { setToastMessage, setDocumentToView, setSelectedItem, navigateTo } = useUIContext();

    const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);
    const [isWelcomeOpen, setIsWelcomeOpen] = useState(user?.isConsultant && !user?.hasSeenConsultantWelcome);

    const isClientExpired = (client: ClientProfile) => {
        if (!client.paidUntil) return true;
        return new Date(client.paidUntil) < new Date();
    };

    const handlePayClient = async (clientId: string) => {
        setIsProcessingPayment(clientId);
        try {
            await payClientAccessFee(clientId);
            setToastMessage("Client access renewed!");
        } catch (err: any) {
            setToastMessage(err.message);
        } finally {
            setIsProcessingPayment(null);
        }
    };

    const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'vault' | 'clients' | 'security'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [profileData, setProfileData] = useState<CompanyProfile>(user?.profile || { companyName: '', industry: '' });
    const [userData, setUserData] = useState({ name: user?.name || '', contactNumber: user?.contactNumber || '' });
    const [brandingData, setBrandingData] = useState(user?.branding || { primaryColor: '#2563eb', accentColor: '#1e40af', logoUrl: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileNotes, setFileNotes] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isPhotoUploading, setIsPhotoUploading] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Client Management States
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<ClientProfile | null>(null);
    const [clientForm, setClientForm] = useState<Partial<ClientProfile>>({});

    const generatedPolicies = generatedDocuments.filter(doc => doc.kind === 'policy');
    const generatedForms = generatedDocuments.filter(doc => doc.kind === 'form');

    useEffect(() => {
        if (user && !isEditing) {
            setProfileData(user.profile || { companyName: '', industry: '' });
            setUserData({ name: user.name || '', contactNumber: user.contactNumber || '' });
        }
    }, [user, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'name' || name === 'contactNumber') {
            setUserData(prev => ({ ...prev, [name]: value }));
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onUpdateProfile({
                profile: profileData,
                name: userData.name,
                contactNumber: userData.contactNumber
            });
            setIsEditing(false);
        } catch (error: any) {
            setToastMessage(`Failed to save: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        if (file.size > 5 * 1024 * 1024) {
            alert("The file is too large. Please upload an image smaller than 5MB.");
            e.target.value = '';
            setPhotoFile(null);
            return;
        }
        setPhotoFile(file);
    };

    const handlePhotoUpload = async () => {
        if (!photoFile) return;
        setIsPhotoUploading(true);
        await onProfilePhotoUpload(photoFile);
        setIsPhotoUploading(false);
        setPhotoFile(null);
    };

    const handleSaveBranding = async () => {
        setIsSaving(true);
        try {
            await updateBranding(brandingData);
            setToastMessage("Branding updated successfully!");
        } catch (err: any) {
            setToastMessage("Failed to update branding.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseWelcome = async () => {
        setIsWelcomeOpen(false);
        await markConsultantWelcomeAsSeen();
    };

    const handleUploadClick = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        await onFileUpload(selectedFile, fileNotes);
        setSelectedFile(null);
        setFileNotes('');
        setIsUploading(false);
    };

    // Client Management Functions
    const handleOpenClientModal = (client?: ClientProfile) => {
        if (!client && user && (user.clients?.length || 0) >= (user.consultantClientLimit || 10)) {
            setToastMessage("You've reached your client limit. Please upgrade for more slots.");
            return;
        }
        if (client) {
            setEditingClient(client);
            setClientForm(client);
        } else {
            setEditingClient(null);
            setClientForm({ name: '', email: '', companyName: '', industry: '' });
        }
        setIsClientModalOpen(true);
    };

    const handleSaveClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !clientForm.name || !clientForm.companyName) return;

        try {
            // Enterprise: Rate Limiting (Prevent scripted abuse)
            const recentAdds = JSON.parse(sessionStorage.getItem('recent_client_adds') || '[]');
            const now = Date.now();
            const validAdds = recentAdds.filter((t: number) => now - t < 3600000); // last 1 hour

            if (!editingClient && validAdds.length >= 5) {
                setToastMessage("Security Alert: Rate limit exceeded for client additions. Please try again in an hour.");
                return;
            }

            const currentClients = user.clients || [];
            let updatedClients;

            if (editingClient) {
                updatedClients = currentClients.map(c => c.id === editingClient.id ? { ...c, ...clientForm } as ClientProfile : c);
            } else {
                const newClient: ClientProfile = {
                    id: crypto.randomUUID(),
                    name: clientForm.name!,
                    email: clientForm.email || '',
                    companyName: clientForm.companyName!,
                    industry: clientForm.industry
                };
                updatedClients = [...currentClients, newClient];
            }

            await updateConsultantClients(user.uid, updatedClients);
            setUser({ ...user, clients: updatedClients });

            if (!editingClient) {
                const recentAdds = JSON.parse(sessionStorage.getItem('recent_client_adds') || '[]');
                sessionStorage.setItem('recent_client_adds', JSON.stringify([...recentAdds, Date.now()]));
            }

            setIsClientModalOpen(false);
            setToastMessage("Client list updated successfully.");
        } catch (err: any) {
            setToastMessage(`Failed to save client: ${err.message}`);
        }
    };

    const handleDeleteClient = async (clientId: string) => {
        const confirmed = window.confirm("POPIA COMPLIANCE: Are you sure you want to retract this client profile? Their document associations will be soft-deleted in accordance with the Right to be Forgotten. This action can be reversed by Support within 30 days.");
        if (!confirmed || !user) return;

        try {
            await retractClient(user.uid, clientId);
            const updatedClients = (user.clients || []).filter(c => c.id !== clientId);
            setUser({ ...user, clients: updatedClients });
            setToastMessage("Client retracted successfully.");
        } catch (err: any) {
            setToastMessage(`Failed to retract client: ${err.message}`);
        }
    };

    const handleCloseAccount = async () => {
        const confirmed = window.confirm("CRITICAL: Are you sure you want to close your HR CoPilot account? All your generated documents and PII will be soft-deleted immediately and permanently purged after 30 days. This action cannot be undone by you.");
        if (!confirmed || !user) return;

        try {
            await retractUser(user.uid);
            await onLogout();
        } catch (err: any) {
            setToastMessage(`Failed to close account: ${err.message}`);
        }
    };


    const getExpiryDate = () => {
        if (!user?.transactions) return 'N/A';
        const subTx = user.transactions.find(tx =>
            tx.description.toLowerCase().includes('subscription') ||
            tx.description.toLowerCase().includes('pro plan')
        );
        if (!subTx) return 'N/A';
        const date = new Date(subTx.date);
        date.setFullYear(date.getFullYear() + 1);
        return date.toLocaleString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const DocumentHistorySection = React.lazy(() => import('./DocumentHistorySection'));

    if (!user) return null;

    const NAV_ITEMS = [
        { id: 'profile', label: 'Company Profile', icon: UserIcon },
        { id: 'billing', label: 'Credits & Billing', icon: CreditCardIcon },
        { id: 'vault', label: 'The Vault', icon: ShieldCheckIcon },
        ...(user.isConsultant ? [{ id: 'clients', label: 'Client Management', icon: RegisterIcon }] : []),
        { id: 'security', label: 'Security & Privacy', icon: LockIcon }
    ] as const;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
                <button onClick={onLogout} className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all">Logout</button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 lg:sticky lg:top-8 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2" role="tablist" aria-label="Profile Sections">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={`${item.id}-panel`}
                                    id={`${item.id}-tab`}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${isActive ? 'bg-secondary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <main className="flex-1">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden">
                        {activeTab === 'profile' && (
                            <div id="profile-panel" role="tabpanel" aria-labelledby="profile-tab" className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <header className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-12 border-b border-gray-50">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 border-4 border-white shadow-xl">
                                            {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-8 text-gray-300" />}
                                        </div>
                                        <button aria-label="Edit Profile Photo" onClick={() => photoInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-2 bg-white text-secondary rounded-xl shadow-lg border border-gray-100"><EditIcon className="w-4 h-4" /></button>
                                        <input type="file" ref={photoInputRef} onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 5 * 1024 * 1024) {
                                                    alert('Image too large. Max 5MB allowed.');
                                                    e.target.value = '';
                                                    setPhotoFile(null);
                                                } else {
                                                    setPhotoFile(file);
                                                }
                                            }
                                        }} className="hidden" />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h2 className="text-3xl font-black text-secondary">{user.name || 'Your Name'}</h2>
                                        <p className="text-gray-400 font-bold mb-4">{user.email}</p>
                                        {photoFile && <button onClick={handlePhotoUpload} className="px-4 py-2 bg-primary text-white text-xs font-black rounded-lg">Apply Photo</button>}
                                    </div>
                                </header>
                                <section>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-secondary">Company Details</h3>
                                        {!isEditing && <button onClick={() => setIsEditing(true)} className="text-primary font-bold hover:underline">Edit Profile</button>}
                                    </div>
                                    {isEditing ? (
                                        <form onSubmit={handleSave} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="name-input" className="sr-only">Your Name</label>
                                                    <input id="name-input" name="name" value={userData.name} onChange={handleInputChange} placeholder="Name" className="w-full p-3 border rounded-xl font-bold" />
                                                </div>
                                                <div>
                                                    <label htmlFor="phone-input" className="sr-only">Contact Number</label>
                                                    <input id="phone-input" name="contactNumber" value={userData.contactNumber} onChange={handleInputChange} placeholder="Phone" className="w-full p-3 border rounded-xl font-bold" />
                                                </div>
                                                <div>
                                                    <label htmlFor="company-input" className="sr-only">Company Name</label>
                                                    <input id="company-input" name="companyName" value={profileData.companyName} onChange={handleInputChange} placeholder="Company" className="w-full p-3 border rounded-xl font-bold" />
                                                </div>
                                                <div>
                                                    <label htmlFor="industry-select" className="sr-only">Industry</label>
                                                    <select id="industry-select" name="industry" value={profileData.industry} onChange={handleInputChange} className="w-full p-3 border rounded-xl font-bold">
                                                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 font-bold text-gray-400">Cancel</button>
                                                <button type="submit" className="px-6 py-2 bg-secondary text-white font-black rounded-xl shadow-lg">Save</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                            <div><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Company</span><p className="font-black text-secondary">{user.profile.companyName || 'Not set'}</p></div>
                                            <div><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Industry</span><p className="font-black text-secondary">{user.profile.industry || 'Not set'}</p></div>
                                        </div>
                                    )}
                                    {user.isConsultant && (
                                        <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h3 className="text-xl font-black text-secondary">White-label Branding</h3>
                                                    <p className="text-sm text-gray-500">Your logo and colors will be applied to your client sessions.</p>
                                                </div>
                                                <button onClick={handleSaveBranding} disabled={isSaving} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-black transition-all">
                                                    {isSaving ? '...' : 'Update Branding'}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Logo URL</label>
                                                    <input
                                                        className="w-full p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs"
                                                        placeholder="https://..."
                                                        value={brandingData.logoUrl || ''}
                                                        onChange={e => setBrandingData({ ...brandingData, logoUrl: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Color</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            className="h-10 w-10 p-1 bg-white border border-gray-100 rounded-lg cursor-pointer"
                                                            value={brandingData.primaryColor || '#2563eb'}
                                                            onChange={e => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                                                        />
                                                        <input
                                                            className="flex-1 p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs uppercase"
                                                            value={brandingData.primaryColor || '#2563eb'}
                                                            onChange={e => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Accent Color</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            className="h-10 w-10 p-1 bg-white border border-gray-100 rounded-lg cursor-pointer"
                                                            value={brandingData.accentColor || '#1e40af'}
                                                            onChange={e => setBrandingData({ ...brandingData, accentColor: e.target.value })}
                                                        />
                                                        <input
                                                            className="flex-1 p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs uppercase"
                                                            value={brandingData.accentColor || '#1e40af'}
                                                            onChange={e => setBrandingData({ ...brandingData, accentColor: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="p-4 md:p-8 animate-in fade-in slide-in-from-right-2 duration-300">
                                <h2 className="text-3xl font-black text-secondary mb-8">Billing & Plan</h2>
                                {user.plan === 'pro' ? (
                                    <div className="p-6 md:p-8 bg-secondary/5 border border-secondary/10 rounded-3xl mb-8">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-secondary text-white rounded-full text-[10px] font-black uppercase w-fit mb-4">Pro Active</div>
                                        <h3 className="text-4xl font-black text-secondary mb-2">Unlimited Access</h3>
                                        <p className="text-gray-400 font-bold">Valid until {getExpiryDate()}</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <div className="p-8 bg-green-50 rounded-3xl text-center">
                                            <p className="text-[10px] font-black text-green-700 uppercase mb-4">Balance</p>
                                            <p className="text-5xl font-black text-green-900 mb-6">R{(Number(user.creditBalance) / 100).toFixed(2)}</p>
                                            <button onClick={onGoToTopUp} className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl shadow-green-600/20">Top Up</button>
                                        </div>
                                        <div className="p-8 bg-primary/5 rounded-3xl text-center">
                                            <p className="text-[10px] font-black text-primary uppercase mb-4">Upgrade</p>
                                            <p className="text-2xl font-black text-secondary mb-6">Unlimited Pro</p>
                                            <button onClick={onUpgrade} className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20">Unlock Now</button>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                                    <header className="p-4 bg-gray-50 flex items-center justify-between border-b"><h3 className="text-xs font-black uppercase tracking-widest text-secondary">Recent Activity</h3><button onClick={() => navigateTo('transactions')} className="text-[10px] font-black text-primary uppercase">View All</button></header>
                                    <div className="divide-y divide-gray-50">
                                        {user.transactions?.slice(0, 5).map(tx => (
                                            <div key={tx.id} className="flex justify-between items-center p-4">
                                                <div><p className="text-sm font-bold text-secondary">{tx.description}</p><p className="text-[10px] text-gray-400 font-bold">{new Date(tx.date).toLocaleDateString()}</p></div>
                                                <span className={`text-sm font-black ${Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-500'}`}>R{(Math.abs(Number(tx.amount)) / 100)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'vault' && (
                            <div className="p-4 md:p-8 animate-in fade-in slide-in-from-left-2 duration-300">
                                <h2 className="text-3xl font-black text-secondary mb-8">The Vault</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                    <div className="p-6 bg-gray-50 rounded-3xl">
                                        <h4 className="text-xs font-black uppercase text-secondary mb-4">Quick Upload</h4>
                                        <input type="file" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 5 * 1024 * 1024) {
                                                    alert('File too large. Max 5MB allowed.');
                                                    e.target.value = '';
                                                    setSelectedFile(null);
                                                } else {
                                                    setSelectedFile(file);
                                                }
                                            }
                                        }} className="w-full text-xs mb-4" />
                                        <button onClick={handleUploadClick} disabled={!selectedFile || isUploading} className="w-full py-3 bg-secondary text-white text-xs font-black rounded-xl">Store File</button>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h4 className="text-xs font-black uppercase text-gray-400 mb-4">Secure Storage</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {userFiles.map(file => (
                                                <div key={file.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4">
                                                    <FileIcon className="w-8 h-8 text-primary" />
                                                    <div className="flex-1 overflow-hidden"><p className="text-xs font-black text-secondary truncate">{file.name}</p><div className="flex gap-2"><button onClick={() => onFileDownload(file.storagePath)} className="text-[10px] font-bold text-primary underline">Get</button><button onClick={() => onFileDelete(file.id, file.storagePath)} className="text-[10px] font-bold text-red-400">Del</button></div></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'clients' && (
                            <div id="clients-panel" role="tabpanel" className="p-4 md:p-8 animate-in fade-in slide-in-from-right-2 duration-300">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-secondary">My Clients</h2>
                                        <p className="text-gray-400 mt-2">Manage the client profiles you consult for.</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Slots Used</p>
                                            <p className="text-lg font-black text-secondary">
                                                {user.clients?.length || 0} / {user.consultantClientLimit || 10}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleOpenClientModal()}
                                            className={`px-6 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-105 transition-transform ${(user.clients?.length || 0) >= (user.consultantClientLimit || 10) ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            + Add Client
                                        </button>
                                    </div>
                                </div>

                                {(!user.clients || user.clients.length === 0) ? (
                                    <EmptyState
                                        title="No Clients Yet"
                                        description="Add your first client to start generating documents for them."
                                        icon={RegisterIcon}
                                        actionLabel="Add Client"
                                        onAction={() => handleOpenClientModal()}
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.clients.map(client => (
                                            <div key={client.id} className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-secondary">{client.companyName}</h3>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{client.industry || 'No Industry Set'}</p>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenClientModal(client)} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg">
                                                            <EditIcon className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteClient(client.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-black text-sm border border-slate-100">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-gray-700">{client.name}</p>
                                                        <p className="text-xs text-gray-400">{client.email}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        {isClientExpired(client) ? (
                                                            <div className="flex flex-col items-end gap-2">
                                                                <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-black rounded uppercase tracking-widest border border-red-100 flex items-center gap-1">
                                                                    <LockIcon className="w-3 h-3" /> Expired
                                                                </span>
                                                                <button
                                                                    onClick={() => handlePayClient(client.id)}
                                                                    disabled={isProcessingPayment === client.id}
                                                                    className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-lg shadow hover:bg-black transition-all flex items-center gap-1"
                                                                >
                                                                    <CreditCardIcon className="w-3 h-3" />
                                                                    {isProcessingPayment === client.id ? "..." : "PAY R750"}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded uppercase tracking-widest border border-emerald-100">
                                                                    Active
                                                                </span>
                                                                <p className="text-[9px] font-bold text-gray-400">Until {new Date(client.paidUntil!).toLocaleDateString()}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div id="security-panel" role="tabpanel" className="p-4 md:p-8 animate-in fade-in slide-in-from-right-2 duration-300">
                                <h2 className="text-3xl font-black text-secondary mb-8">Security & Privacy</h2>
                                <div className="space-y-8">
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                                            <ShieldCheckIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-secondary mb-1">POPIA Compliance</h3>
                                            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                                                HR CoPilot adheres strictly to the Protection of Personal Information Act. You have the right to be forgotten. Closing your account or retracting a client will trigger our automated PII scrubber.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-8 border-2 border-dashed border-red-100 rounded-[2.5rem]">
                                        <h3 className="text-xl font-black text-red-500 mb-2">Danger Zone</h3>
                                        <p className="text-sm text-slate-400 mb-8">Once you close your account, there is no going back. All documents, logs, and client associations will be retired.</p>
                                        <button
                                            onClick={handleCloseAccount}
                                            className="px-8 py-4 bg-red-50 text-red-500 font-black rounded-2xl border border-red-200 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            Terminate Account Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Client Modal */}
            {isClientModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <header className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-secondary">{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
                            <button onClick={() => setIsClientModalOpen(false)} className="text-gray-400 hover:text-secondary font-bold text-xl">&times;</button>
                        </header>
                        <form onSubmit={handleSaveClient} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Company Name</label>
                                <input
                                    required
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    placeholder="e.g. Acme Inc."
                                    value={clientForm.companyName || ''}
                                    onChange={e => setClientForm({ ...clientForm, companyName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Industry</label>
                                <select
                                    required
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    value={clientForm.industry || ''}
                                    onChange={e => setClientForm({ ...clientForm, industry: e.target.value })}
                                >
                                    <option value="" disabled>Select Industry</option>
                                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contact Person</label>
                                    <input
                                        required
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        placeholder="e.g. John Doe"
                                        value={clientForm.name || ''}
                                        onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        placeholder="Optional"
                                        value={clientForm.email || ''}
                                        onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsClientModalOpen(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                                <button type="submit" className="px-6 py-3 bg-secondary text-white font-black rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">Save Client</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Welcome Nudge */}
            {isWelcomeOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6">
                            <button onClick={handleCloseWelcome} className="text-gray-400 hover:text-secondary text-2xl font-light">&times;</button>
                        </div>
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <CheckIcon className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-secondary mb-4 leading-tight">Welcome to Consultant Mode</h2>
                        <p className="text-slate-500 mb-8 font-medium">Elevate your consulting business with white-labeled document generation and secure client management.</p>
                        <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary font-black">1</div>
                                <p className="text-sm font-black text-slate-700">Add your first client to get started.</p>
                            </div>
                            <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary font-black">2</div>
                                <p className="text-sm font-black text-slate-700">Configure your branding in the Profile tab.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCloseWelcome}
                            className="w-full py-4 bg-secondary text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:translate-y-[-2px] transition-all"
                        >
                            Get Started
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default React.memo(ProfilePage);
