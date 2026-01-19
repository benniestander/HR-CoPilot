
import React, { useState, useEffect, useRef } from 'react';
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
    UpdateIcon
} from './Icons';
import type { CompanyProfile, GeneratedDocument, UserFile, Policy, Form, PolicyType, FormType } from '../types';
import { INDUSTRIES, POLICIES, FORMS } from '../constants';
import { useAuthContext } from '../contexts/AuthContext';
import { useDataContext } from '../contexts/DataContext';
import { useUIContext } from '../contexts/UIContext';
import EmptyState from './EmptyState';

interface ProfilePageProps {
    onBack: () => void;
    onUpgrade: () => void;
    onGoToTopUp: () => void;
    onRedoOnboarding: () => void;
}

const COMPANY_VOICES = [
    'Formal & Corporate',
    'Modern & Friendly',
    'Direct & No-Nonsense',
];

const ProfilePage: React.FC<ProfilePageProps> = ({
    onBack,
    onUpgrade,
    onGoToTopUp,
    onRedoOnboarding
}) => {
    const { user, handleLogout: onLogout } = useAuthContext();
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

    const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'vault'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [profileData, setProfileData] = useState<CompanyProfile>(user?.profile || { companyName: '', industry: '' });
    const [userData, setUserData] = useState({ name: user?.name || '', contactNumber: user?.contactNumber || '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileNotes, setFileNotes] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isPhotoUploading, setIsPhotoUploading] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);

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

    const handlePhotoUpload = async () => {
        if (!photoFile) return;
        setIsPhotoUploading(true);
        await onProfilePhotoUpload(photoFile);
        setIsPhotoUploading(false);
        setPhotoFile(null);
    };

    const handleUploadClick = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        await onFileUpload(selectedFile, fileNotes);
        setSelectedFile(null);
        setFileNotes('');
        setIsUploading(false);
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
                    {/* Mobile: Horizontal Scroll, Desktop: Vertical List */}
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
                                    onClick={() => setActiveTab(item.id)}
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
                                        <input type="file" ref={photoInputRef} onChange={(e) => { if (e.target.files?.[0]) setPhotoFile(e.target.files[0]) }} className="hidden" />
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
                                        <input type="file" onChange={(e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]) }} className="w-full text-xs mb-4" />
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                                    <React.Suspense fallback={<div className="h-40 bg-gray-50 rounded-xl animate-pulse"></div>}>
                                        <DocumentHistorySection title="Policies" documents={generatedPolicies} icon={MasterPolicyIcon} isLoading={isLoadingUserDocs} type="policy" />
                                        <DocumentHistorySection title="Forms" documents={generatedForms} icon={FormsIcon} isLoading={isLoadingUserDocs} type="form" />
                                    </React.Suspense>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Lazy load for performance
export default React.memo(ProfilePage);
