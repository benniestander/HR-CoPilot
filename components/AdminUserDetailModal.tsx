
import React, { useState, useEffect } from 'react';
import type { User, GeneratedDocument, Transaction, CompanyProfile } from '../types';
import { UserIcon, ShieldCheckIcon, HistoryIcon, MasterPolicyIcon, EditIcon, CreditCardIcon, LoadingIcon, WordIcon, ExcelIcon } from './Icons';
import { INDUSTRIES } from '../constants';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useModalContext } from '../contexts/ModalContext';
import { getGeneratedDocuments, getUserProfile } from '../services/dbService';

interface AdminUserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
   adminActions: {
    updateUser: (targetUid: string, updates: Partial<User>) => Promise<void>;
    adjustCredit: (targetUid: string, amountInCents: number, reason: string) => Promise<void>;
    changePlan: (targetUid: string, newPlan: 'pro' | 'payg') => Promise<void>;
    grantPro: (targetUid: string) => Promise<void>;
    simulateFailedPayment: (targetUid: string, targetUserEmail: string) => Promise<void>;
  };
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = React.memo(({ label, value }) => (
    <div className="flex flex-col sm:flex-row py-2 border-b border-gray-100">
        <p className="w-full sm:w-1/3 font-semibold text-gray-600 flex-shrink-0">{label}:</p>
        <div className="w-full sm:w-2/3 text-gray-800 break-words">{value}</div>
    </div>
));

const AdminUserDetailModal: React.FC<AdminUserDetailModalProps> = ({ isOpen, onClose, user, adminActions }) => {
  const { showConfirmationModal, hideConfirmationModal } = useModalContext();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for full data (transactions, docs) which might be missing from the list view user object
  const [fullUser, setFullUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [formData, setFormData] = useState({ ...user, profile: { ...user.profile } });
  
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');
  
  // Action Loading States
  const [isSaving, setIsSaving] = useState(false);
  const [isAdjustingCredit, setIsAdjustingCredit] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isGrantingPro, setIsGrantingPro] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const modalRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);
  
  // Fetch full user details and documents when modal opens
  const fetchUserData = async () => {
      if (!user.uid) return;
      setIsDataLoading(true);
      try {
          const [u, d] = await Promise.all([
              getUserProfile(user.uid),
              getGeneratedDocuments(user.uid)
          ]);
          setFullUser(u);
          setDocuments(d);
          if (u) {
              setFormData({ ...u, profile: { ...u.profile } });
          }
      } catch (error) {
          console.error("Failed to fetch user details", error);
      } finally {
          setIsDataLoading(false);
      }
  };

  useEffect(() => {
      if (isOpen) {
          fetchUserData();
      }
  }, [isOpen, user.uid]);

  if (!isOpen) return null;
  
  const activeUser = fullUser || user; // Fallback to prop user if full fetch fails/loading

  const handleSave = async () => {
    const updates: Partial<User> = {};
    if (formData.name !== activeUser.name) updates.name = formData.name;
    if (formData.contactNumber !== activeUser.contactNumber) updates.contactNumber = formData.contactNumber;
    if (formData.isAdmin !== activeUser.isAdmin) updates.isAdmin = formData.isAdmin;

    if (JSON.stringify(formData.profile) !== JSON.stringify(activeUser.profile)) {
        updates.profile = formData.profile;
    }

    if (Object.keys(updates).length > 0) {
        setIsSaving(true);
        try {
            await adminActions.updateUser(activeUser.uid, updates);
            await fetchUserData(); // Refresh data
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    } else {
        setIsEditing(false);
    }
  };

  const handleAdjustCredit = async () => {
    const amount = Math.round(Number(creditAmount) * 100);
    
    if (isNaN(amount) || amount === 0 || !creditReason.trim()) {
        alert('Please enter a valid amount and reason.');
        return;
    }
    
    setIsAdjustingCredit(true);
    try {
        await adminActions.adjustCredit(activeUser.uid, amount, creditReason);
        setCreditAmount('');
        setCreditReason('');
        await fetchUserData(); // Refresh data to show new balance and transaction
        
        showConfirmationModal({
            title: 'Credit Added Successfully',
            message: (
                <div className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="bg-green-100 p-3 rounded-full">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                    </div>
                    <p className="text-lg text-gray-800 font-medium mb-2">
                        R{(amount / 100).toFixed(2)} has been added.
                    </p>
                    <p className="text-sm text-gray-500">
                        The user's new balance has been updated.
                    </p>
                </div>
            ),
            confirmText: 'OK',
            cancelText: null,
            onConfirm: hideConfirmationModal
        });

    } finally {
        setIsAdjustingCredit(false);
    }
  };

  const handleChangePlan = async () => {
    const newPlan = activeUser.plan === 'pro' ? 'payg' : 'pro';
    if (window.confirm(`Are you sure you want to change this user's plan to "${newPlan}"?`)) {
        setIsChangingPlan(true);
        try {
            await adminActions.changePlan(activeUser.uid, newPlan);
            await fetchUserData(); // Refresh
        } finally {
            setIsChangingPlan(false);
        }
    }
  };
  
  const handleGrantPro = async () => {
    if (window.confirm(`Are you sure you want to grant a FREE Pro Plan (12 months) to ${activeUser.email}?`)) {
        setIsGrantingPro(true);
        try {
            await adminActions.grantPro(activeUser.uid);
            await fetchUserData(); // Refresh
        } finally {
            setIsGrantingPro(false);
        }
    }
  };
  
  const handleSimulatePayment = async () => {
    if (window.confirm(`This will create a "Failed Payment" notification for ${activeUser.email}. Are you sure?`)) {
        setIsSimulating(true);
        try {
            await adminActions.simulateFailedPayment(activeUser.uid, activeUser.email);
        } finally {
            setIsSimulating(false);
        }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in activeUser.profile) {
        setFormData(prev => ({...prev, profile: {...prev.profile, [name]: value }}));
    } else {
        setFormData(prev => ({...prev, [name]: value }));
    }
  };

  const isDisabled = isSaving || isAdjustingCredit || isChangingPlan || isGrantingPro || isSimulating || isDataLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col" 
        style={{ maxHeight: '90vh' }} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-detail-modal-title"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
            <div className="flex items-center">
                <UserIcon className="w-10 h-10 text-primary mr-4" />
                <div>
                <h2 id="user-detail-modal-title" className="text-2xl font-bold text-secondary">{activeUser.name || 'User Profile'}</h2>
                <p className="text-gray-500">{activeUser.email}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-6 text-sm relative">
            {isDataLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                    <LoadingIcon className="w-12 h-12 animate-spin text-primary" />
                </div>
            )}
            
            {/* Account Info */}
            <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-secondary">User Profile</h3>
                    {!isEditing && <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-semibold text-primary hover:underline"><EditIcon className="w-4 h-4 mr-1"/>Edit</button>}
                </div>
                {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-xs font-medium text-gray-500">Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                        <div><label className="block text-xs font-medium text-gray-500">Contact Number</label><input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Role</label>
                            <div className="mt-2 flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="isAdmin" 
                                    name="isAdmin" 
                                    checked={formData.isAdmin || false} 
                                    onChange={(e) => setFormData(prev => ({ ...prev, isAdmin: e.target.checked }))}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                                    Admin Privileges
                                </label>
                            </div>
                        </div>
                        <div><label className="block text-xs font-medium text-gray-500">Company Name</label><input type="text" name="companyName" value={formData.profile.companyName} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                        <div><label className="block text-xs font-medium text-gray-500">Industry</label>
                            <select name="industry" value={formData.profile.industry} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white">
                                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-500">Company Address</label><input type="text" name="address" value={formData.profile.address} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                        <div className="flex justify-end md:col-span-2 space-x-2 mt-2">
                            <button onClick={() => setIsEditing(false)} disabled={isDisabled} className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-md disabled:opacity-50">Cancel</button>
                            <button onClick={handleSave} disabled={isDisabled} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md flex items-center justify-center min-w-[100px] disabled:opacity-50">
                                {isSaving ? <LoadingIcon className="animate-spin h-4 w-4" /> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <DetailRow label="Name" value={activeUser.name || 'Not provided'} />
                        <DetailRow label="Contact" value={activeUser.contactNumber || 'Not provided'} />
                        <DetailRow label="Role" value={activeUser.isAdmin ? <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-800 rounded-full">Admin</span> : 'User'} />
                        <DetailRow label="Company Name" value={activeUser.profile.companyName || 'Not set'} />
                        <DetailRow label="Industry" value={activeUser.profile.industry || 'Not set'} />
                        <DetailRow label="Signed Up" value={new Date(activeUser.createdAt).toLocaleString()} />
                    </>
                )}
            </div>

            {/* Plan & Billing */}
            <div className="p-4 border rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-secondary mb-2">Plan Management</h3>
                    <DetailRow label="Current Plan" value={<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activeUser.plan === 'pro' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{activeUser.plan}</span>} />
                    <button onClick={handleChangePlan} disabled={isDisabled} className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-opacity-90 flex justify-center items-center min-h-[36px] disabled:opacity-50">
                        {isChangingPlan ? <LoadingIcon className="animate-spin h-4 w-4" /> : `Change to ${activeUser.plan === 'pro' ? 'Pay-As-You-Go' : 'Pro'}`}
                    </button>
                    <button onClick={handleGrantPro} disabled={isDisabled} className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex justify-center items-center min-h-[36px] disabled:opacity-50">
                        {isGrantingPro ? <LoadingIcon className="animate-spin h-4 w-4" /> : 'Grant Free Pro Plan (1 Year)'}
                    </button>
                    <button onClick={handleSimulatePayment} disabled={isDisabled} className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 flex justify-center items-center min-h-[36px] disabled:opacity-50">
                        {isSimulating ? <LoadingIcon className="animate-spin h-4 w-4" /> : 'Simulate Failed Payment'}
                    </button>
                </div>
                {activeUser.plan === 'payg' && (
                    <div>
                        <h3 className="text-lg font-bold text-secondary mb-2">Credit Management</h3>
                         <DetailRow label="Balance" value={<span className="font-bold text-green-700">R{(activeUser.creditBalance / 100).toFixed(2)}</span>} />
                        <div className="space-y-2 mt-2">
                            <input type="number" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} placeholder="Amount (R)" className="w-full p-2 border rounded-md" step="0.01" disabled={isDisabled} />
                            <input type="text" value={creditReason} onChange={e => setCreditReason(e.target.value)} placeholder="Reason for adjustment" className="w-full p-2 border rounded-md" disabled={isDisabled} />
                            <button 
                                onClick={handleAdjustCredit} 
                                disabled={!creditAmount || !creditReason || isDisabled} 
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90 disabled:bg-gray-400 flex justify-center items-center min-h-[36px]"
                            >
                                {isAdjustingCredit ? <LoadingIcon className="animate-spin h-4 w-4 text-white" /> : 'Adjust Credit'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Documents & Transactions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-secondary mb-2 flex items-center"><MasterPolicyIcon className="w-5 h-5 mr-2" />Documents</h3>
                    {documents.length > 0 ? (
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {documents.map(doc => (
                                <li key={doc.id} className="p-2 bg-gray-50 rounded-md flex items-center justify-between">
                                    <div className="flex items-center overflow-hidden">
                                        {doc.outputFormat === 'excel' ? <ExcelIcon className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" /> : <WordIcon className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />}
                                        <div className="truncate">
                                            <p className="font-medium text-gray-800 truncate" title={doc.title}>{doc.title}</p>
                                            <p className="text-xs text-gray-500">{doc.kind} &bull; v{doc.version}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (<p className="text-gray-500 text-sm italic">No documents generated yet.</p>)}
                </div>
                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-secondary mb-2 flex items-center"><HistoryIcon className="w-5 h-5 mr-2" />Transactions</h3>
                    {activeUser.transactions && activeUser.transactions.length > 0 ? (
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {activeUser.transactions.map(tx => (
                                <li key={tx.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                    <div>
                                        <p className="font-medium text-gray-800 text-xs">{tx.description}</p>
                                        <p className="text-[10px] text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`font-semibold text-xs ${Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        R{(Number(tx.amount) / 100).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (<p className="text-gray-500 text-sm italic">No transactions recorded.</p>)}
                </div>
            </div>

        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} disabled={isDisabled} className="px-6 py-2 rounded-md text-white bg-primary hover:bg-opacity-90 transition disabled:opacity-50">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailModal;
