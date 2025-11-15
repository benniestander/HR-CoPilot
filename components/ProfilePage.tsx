import React, { useState, useEffect, useRef } from 'react';
import { UserIcon, ShieldCheckIcon, EditIcon, MasterPolicyIcon, FormsIcon, WordIcon, ExcelIcon, CheckIcon, CreditCardIcon, LoadingIcon, HistoryIcon, FileUploadIcon, FileIcon, TrashIcon } from './Icons';
import { CompanyProfile, GeneratedDocument, User, UserFile } from '../types';
import { INDUSTRIES } from '../constants';
import PaymentModal from './PaymentModal';


interface ProfilePageProps {
  user: User;
  isOnboarding: boolean;
  onUpdateProfile: (profile: CompanyProfile) => void;
  onSubscriptionSuccess: () => void;
  onTopUpSuccess: (amountInCents: number) => void;
  onLogout: () => void;
  onBack: () => void;
  generatedDocuments: GeneratedDocument[];
  userFiles: UserFile[];
  onFileUpload: (file: File, notes: string) => Promise<void>;
  onFileDownload: (storagePath: string) => void;
  onViewDocument: (doc: GeneratedDocument) => void;
  onProfilePhotoUpload: (file: File) => Promise<void>;
  onProfilePhotoDelete: () => Promise<void>;
}

type PaymentModalState = {
    isOpen: boolean;
    amountInCents: number;
    itemName: string;
    itemDescription: string;
    type: 'pro' | 'topup';
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
    user, 
    isOnboarding, 
    onUpdateProfile, 
    onSubscriptionSuccess,
    onTopUpSuccess,
    onLogout, 
    onBack, 
    generatedDocuments,
    userFiles,
    onFileUpload,
    onFileDownload,
    onViewDocument,
    onProfilePhotoUpload,
    onProfilePhotoDelete,
}) => {
  const [isEditing, setIsEditing] = useState(isOnboarding && user.plan === 'pro');
  const [formData, setFormData] = useState<CompanyProfile>(user.profile);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyProfile, string>>>({});
  const [paymentModalState, setPaymentModalState] = useState<PaymentModalState | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customAmountError, setCustomAmountError] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileNotes, setFileNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const generatedPolicies = generatedDocuments.filter(doc => doc.kind === 'policy');
  const generatedForms = generatedDocuments.filter(doc => doc.kind === 'form');

  const isProfileComplete = formData.companyName && formData.industry;

  useEffect(() => {
    setFormData(user.profile);
    setErrors({});
  }, [user.profile, isEditing]);
  
  const validateField = (name: keyof CompanyProfile, value: string) => {
    let error = '';
    switch (name) {
        case 'companyName':
            if (!value.trim()) error = 'Company name is required.';
            break;
        case 'industry':
            if (!value.trim()) error = 'Industry is required.';
            break;
        case 'companyUrl':
            if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
                error = 'Please enter a valid URL (e.g., https://example.com).';
            }
            break;
        default:
            break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof CompanyProfile;
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    validateField(fieldName, value);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isFormValid = (Object.keys(formData) as Array<keyof CompanyProfile>).every(key =>
      validateField(key, formData[key] || '')
    );
    
    if (!isFormValid || Object.values(errors).some(e => e)) return;
    
    onUpdateProfile(formData);
    if (!isOnboarding) {
        setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(user.profile);
    setIsEditing(false);
  };
  
  const handleOpenPaymentModal = (amount: number, type: 'pro' | 'topup') => {
    if(!isProfileComplete && type === 'pro') {
        alert('Please complete your company profile before subscribing.');
        return;
    }
    setPaymentModalState({
        isOpen: true,
        amountInCents: amount,
        itemName: type === 'pro' ? 'Ingcweti Pro Subscription' : `Credit Top-Up R${amount / 100}`,
        itemDescription: type === 'pro' ? '12 months full access.' : 'Add funds to your account.',
        type: type,
    });
  };

  const handlePaymentSuccess = () => {
    if(!paymentModalState) return;
    if (paymentModalState.type === 'pro') {
        onSubscriptionSuccess();
    } else {
        onTopUpSuccess(paymentModalState.amountInCents);
    }
    setPaymentModalState(null);
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);

    const numValue = Number(value);
    if (!value) {
        setCustomAmountError('');
    } else if (isNaN(numValue) || numValue < 50) {
        setCustomAmountError('Please enter an amount of at least R50.');
    } else {
        setCustomAmountError('');
    }
  };

  const handleCustomDeposit = () => {
      const amountInRands = Number(customAmount);
      if (!isNaN(amountInRands) && amountInRands >= 50) {
          handleOpenPaymentModal(amountInRands * 100, 'topup');
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    setIsUploading(true);
    await onFileUpload(selectedFile, fileNotes);
    setSelectedFile(null);
    setFileNotes('');
    setIsUploading(false);
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          alert("File is too large. Please select an image under 2MB.");
          return;
      }
      if (!file.type.startsWith('image/')) {
          alert("Please select an image file (JPEG, PNG, etc.).");
          return;
      }
      setPhotoFile(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setIsPhotoUploading(true);
    await onProfilePhotoUpload(photoFile);
    setIsPhotoUploading(false);
    setPhotoFile(null);
  };

  const handleDeletePhoto = async () => {
    setIsPhotoUploading(true);
    await onProfilePhotoDelete();
    setIsPhotoUploading(false);
  };


  const getExpiryDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const DocumentHistorySection: React.FC<{ title: string; documents: GeneratedDocument[]; icon: React.FC<{className?: string;}> }> = ({ title, documents, icon: Icon }) => (
    <div className="p-6 border border-gray-200 rounded-lg">
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 text-primary mr-3" />
        <h3 className="text-xl font-semibold text-secondary">{title}</h3>
      </div>
      {documents.length > 0 ? (
        <ul className="space-y-3">
          {documents.map(doc => (
            <li key={doc.id} className="p-3 bg-light rounded-md border border-gray-200 hover:bg-gray-200/60 transition-colors flex flex-col sm:flex-row justify-between sm:items-center">
              <div className="flex items-center mb-2 sm:mb-0">
                 {doc.outputFormat === 'excel' ? <ExcelIcon className="w-6 h-6 text-green-700 mr-3 flex-shrink-0" /> : <WordIcon className="w-6 h-6 text-blue-700 mr-3 flex-shrink-0" />}
                <div>
                  <p className="font-semibold text-secondary">{doc.title}</p>
                  <p className="text-xs text-gray-500">
                    Version {doc.version} &bull; Generated on {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button onClick={() => onViewDocument(doc)} className="w-full sm:w-auto px-3 py-1.5 text-sm font-semibold text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                View / Regenerate
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">No {title.toLowerCase()} have been generated yet.</p>
      )}
    </div>
  );

  if (isOnboarding && user.plan === 'payg') {
    return (
        <div className="max-w-4xl mx-auto">
             <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-3xl font-bold text-secondary text-center">Welcome to Ingcweti!</h2>
                <p className="text-gray-600 mt-2 mb-8 text-center">Let's get your account started. First, complete your profile, then make your first deposit.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Step 1: Profile */}
                    <div className={`p-6 border rounded-lg ${isProfileComplete ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                        <div className="flex items-center mb-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold ${isProfileComplete ? 'bg-green-500' : 'bg-primary'}`}>1</div>
                            <h3 className="text-xl font-semibold text-secondary">Set Up Your Company Profile</h3>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input type="text" name="companyName" value={formData.companyName || ''} onChange={handleInputChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.companyName && <p className="text-red-600 text-xs mt-1">{errors.companyName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Industry</label>
                                <select name="industry" value={formData.industry || ''} onChange={handleInputChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}>
                                    <option value="" disabled>Select an industry...</option>
                                    {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                                </select>
                                {errors.industry && <p className="text-red-600 text-xs mt-1">{errors.industry}</p>}
                            </div>
                            <button type="submit" className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90 disabled:bg-gray-400 flex items-center justify-center">
                                <CheckIcon className="w-5 h-5 mr-2" /> Save Profile
                            </button>
                        </form>
                    </div>

                    {/* Step 2: Deposit */}
                    <div className="p-6 border border-gray-200 rounded-lg">
                         <div className="flex items-center mb-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold ${!isProfileComplete ? 'bg-gray-400' : 'bg-primary'}`}>2</div>
                            <h3 className="text-xl font-semibold text-secondary">Make Your First Deposit</h3>
                        </div>
                        <div className={`transition-opacity space-y-3 ${!isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''}`}>
                             <p className="text-sm text-gray-600">Choose an amount to add to your account. You can use this credit to generate any document.</p>
                            <button onClick={() => handleOpenPaymentModal(10000, 'topup')} disabled={!isProfileComplete} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">Deposit R100.00</button>
                            <button onClick={() => handleOpenPaymentModal(20000, 'topup')} disabled={!isProfileComplete} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">Deposit R200.00</button>
                             <button onClick={() => handleOpenPaymentModal(50000, 'topup')} disabled={!isProfileComplete} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">Deposit R500.00</button>
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink mx-4 text-sm text-gray-500">OR</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                    
                            <div>
                                <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                    Select own amount (Min R50)
                                </label>
                                <div className="flex items-start gap-2">
                                    <div className="flex-grow">
                                        <input
                                            id="customAmount"
                                            type="number"
                                            value={customAmount}
                                            onChange={handleCustomAmountChange}
                                            placeholder="e.g., 150"
                                            min="50"
                                            className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${customAmountError ? 'border-red-500' : 'border-gray-300'}`}
                                            disabled={!isProfileComplete}
                                        />
                                        {customAmountError && <p className="text-red-600 text-xs mt-1">{customAmountError}</p>}
                                    </div>
                                    <button
                                        onClick={handleCustomDeposit}
                                        disabled={!isProfileComplete || !customAmount || !!customAmountError}
                                        className="bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400"
                                    >
                                        Deposit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             {paymentModalState?.isOpen && (
                <PaymentModal 
                    isOpen={paymentModalState.isOpen}
                    onClose={() => setPaymentModalState(null)}
                    onSuccess={handlePaymentSuccess}
                    amountInCents={paymentModalState.amountInCents}
                    itemName={paymentModalState.itemName}
                />
            )}
        </div>
    );
  }

  if (isOnboarding && user.plan === 'pro') {
     return (
        <div className="max-w-4xl mx-auto">
             <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-3xl font-bold text-secondary text-center">Complete Your Profile & Subscribe</h2>
                <p className="text-gray-600 mt-2 mb-8 text-center">Just two quick steps to unlock your HR Co-Pilot.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Step 1: Profile */}
                    <div className={`p-6 border rounded-lg ${isProfileComplete ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                        <div className="flex items-center mb-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold ${isProfileComplete ? 'bg-green-500' : 'bg-primary'}`}>1</div>
                            <h3 className="text-xl font-semibold text-secondary">Set Up Your Company Profile</h3>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input type="text" name="companyName" value={formData.companyName || ''} onChange={handleInputChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.companyName && <p className="text-red-600 text-xs mt-1">{errors.companyName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Industry</label>
                                <select name="industry" value={formData.industry || ''} onChange={handleInputChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}>
                                    <option value="" disabled>Select an industry...</option>
                                    {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                                </select>
                                {errors.industry && <p className="text-red-600 text-xs mt-1">{errors.industry}</p>}
                            </div>
                            <button type="submit" className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90 disabled:bg-gray-400 flex items-center justify-center">
                                <CheckIcon className="w-5 h-5 mr-2" /> Save Profile
                            </button>
                        </form>
                    </div>

                    {/* Step 2: Payment */}
                    <div className="p-6 border border-gray-200 rounded-lg">
                         <div className="flex items-center mb-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold ${!isProfileComplete ? 'bg-gray-400' : 'bg-primary'}`}>2</div>
                            <h3 className="text-xl font-semibold text-secondary">Subscribe to Ingcweti Pro</h3>
                        </div>
                        <div className={`transition-opacity ${!isProfileComplete ? 'opacity-50' : ''}`}>
                            <div className="text-center py-4">
                                <p className="text-lg text-gray-600">12-Month Membership</p>
                                <p className="text-4xl font-bold text-secondary my-2">R747.00</p>
                                <p className="text-xs text-gray-500">One-time payment for a full year of access.</p>
                            </div>
                            <button onClick={() => handleOpenPaymentModal(74700, 'pro')} disabled={!isProfileComplete} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex items-center justify-center">
                                <CreditCardIcon className="w-5 h-5 mr-2" /> Pay with Yoco
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             {paymentModalState?.isOpen && (
                <PaymentModal 
                    isOpen={paymentModalState.isOpen}
                    onClose={() => setPaymentModalState(null)}
                    onSuccess={handlePaymentSuccess}
                    amountInCents={paymentModalState.amountInCents}
                    itemName={paymentModalState.itemName}
                />
            )}
        </div>
     )
  }

  // Standard Profile Page for subscribed users
  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center pb-8 border-b border-gray-200 mb-8">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                        <UserIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
                {isPhotoUploading && (
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center sm:items-start">
                <h2 className="text-2xl font-bold text-secondary">{user.name || user.email}</h2>
                <p className="text-gray-500 mb-4">Manage your profile picture.</p>
                <div className="flex items-center space-x-2">
                    <input type="file" ref={photoInputRef} onChange={handlePhotoFileChange} accept="image/*" className="hidden" />
                    <button onClick={() => photoInputRef.current?.click()} disabled={isPhotoUploading} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
                        {user.photoURL ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    {user.photoURL && (
                        <button onClick={handleDeletePhoto} disabled={isPhotoUploading} className="p-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 disabled:bg-gray-200" title="Delete Photo">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {photoFile && !isPhotoUploading && (
                    <div className="mt-3 flex items-center space-x-2 p-2 bg-gray-100 rounded-md">
                        <span className="text-sm text-gray-600 truncate max-w-[150px]">{photoFile.name}</span>
                        <button onClick={handlePhotoUpload} className="px-3 py-1 text-xs font-bold text-white bg-green-600 rounded-md hover:bg-green-700">Confirm</button>
                    </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Max 2MB. JPG, PNG.</p>
            </div>
        </div>
        
        <div className="space-y-6">
             <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold text-secondary mb-4">Account Details</h3>
                <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-32">Email Address:</span>
                    <span className="font-medium text-secondary">{user.email}</span>
                </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-secondary">Company Profile</h3>
                    {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-semibold text-primary hover:underline">
                        <EditIcon className="w-4 h-4 mr-1" />
                        Edit Profile
                    </button>
                    )}
                </div>
                {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input type="text" name="companyName" value={formData.companyName || ''} onChange={handleInputChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.companyName && <p className="text-red-600 text-xs mt-1">{errors.companyName}</p>}
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Industry</label>
                            <select name="industry" value={formData.industry || ''} onChange={handleInputChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="" disabled>Select an industry...</option>
                                {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                            </select>
                            {errors.industry && <p className="text-red-600 text-xs mt-1">{errors.industry}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Size</label>
                            <select name="companySize" value={formData.companySize || ''} onChange={handleInputChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary border-gray-300`}>
                                <option value="">Select a size...</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="500+">500+ employees</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Address</label>
                            <input type="text" name="address" placeholder="e.g., 123 Main St, Johannesburg, 2000" value={formData.address || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Website</label>
                            <input type="url" name="companyUrl" placeholder="https://www.example.com" value={formData.companyUrl || ''} onChange={handleInputChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.companyUrl ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.companyUrl && <p className="text-red-600 text-xs mt-1">{errors.companyUrl}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Summary</label>
                            <textarea name="summary" value={formData.summary || ''} onChange={handleInputChange} rows={3} placeholder="Briefly describe what your company does." className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                            <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                            <button type="submit" disabled={Object.values(errors).some(e => e)} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed">Save Changes</button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start"><span className="text-gray-500 w-32 flex-shrink-0">Company Name:</span><span className="font-medium text-secondary">{user.profile.companyName || 'Not set'}</span></div>
                        <div className="flex items-start"><span className="text-gray-500 w-32 flex-shrink-0">Industry:</span><span className="font-medium text-secondary">{user.profile.industry || 'Not set'}</span></div>
                        <div className="flex items-start"><span className="text-gray-500 w-32 flex-shrink-0">Company Size:</span><span className="font-medium text-secondary">{user.profile.companySize ? `${user.profile.companySize} employees` : 'Not set'}</span></div>
                        <div className="flex items-start"><span className="text-gray-500 w-32 flex-shrink-0">Address:</span><span className="font-medium text-secondary">{user.profile.address || 'Not set'}</span></div>
                        <div className="flex items-start"><span className="text-gray-500 w-32 flex-shrink-0">Website:</span>{user.profile.companyUrl ? <a href={user.profile.companyUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline break-all">{user.profile.companyUrl}</a> : <span className="font-medium text-secondary">Not set</span>}</div>
                        <div className="flex items-start"><span className="text-gray-500 w-32 flex-shrink-0">Summary:</span><span className="font-medium text-secondary">{user.profile.summary || 'Not set'}</span></div>
                    </div>
                )}
            </div>
            
            {user.plan === 'pro' ? (
                <div className="p-6 border border-gray-200 rounded-lg bg-light">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-secondary mb-2">Subscription</h3>
                            <div className="flex items-center text-green-600 font-bold">
                                <ShieldCheckIcon className="w-6 h-6 mr-2" />
                                <span>Ingcweti Pro</span>
                            </div>
                        </div>
                        <button disabled className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-200 rounded-md cursor-not-allowed" title="Feature coming soon">
                            Manage Subscription
                        </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-300">
                        <div className="flex items-center text-sm"><span className="text-gray-500 w-24">Plan:</span><span className="font-medium text-secondary">12 Months Access</span></div>
                        <div className="flex items-center text-sm mt-2"><span className="text-gray-500 w-24">Valid Until:</span><span className="font-medium text-secondary">{getExpiryDate()}</span></div>
                        <p className="text-xs text-gray-500 mt-3">You will receive an email reminder before your subscription expires.</p>
                    </div>
                </div>
            ) : (
                <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-secondary mb-4">Manage Your Credit</h3>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center mb-4">
                        <p className="text-sm text-green-800">Your current balance is</p>
                        <p className="text-4xl font-bold text-green-900">R{(user.creditBalance / 100).toFixed(2)}</p>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Top Up Your Account:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                             <button onClick={() => handleOpenPaymentModal(10000, 'topup')} className="w-full bg-primary text-white font-bold py-2 px-3 rounded-md hover:bg-opacity-90">Top Up R100</button>
                             <button onClick={() => handleOpenPaymentModal(20000, 'topup')} className="w-full bg-primary text-white font-bold py-2 px-3 rounded-md hover:bg-opacity-90">Top Up R200</button>
                             <button onClick={() => handleOpenPaymentModal(50000, 'topup')} className="w-full bg-primary text-white font-bold py-2 px-3 rounded-md hover:bg-opacity-90">Top Up R500</button>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200 bg-accent/20 p-4 rounded-lg text-center">
                         <h4 className="font-bold text-accent-800">Go Unlimited!</h4>
                         <p className="text-sm text-accent-700 my-2">Upgrade to Ingcweti Pro for R747 and get unlimited document generation for a full year.</p>
                         <button onClick={() => handleOpenPaymentModal(74700, 'pro')} className="bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-accent-dark">Upgrade to Pro</button>
                    </div>
                </div>
            )}

            {user.plan === 'payg' && (
                <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center"><HistoryIcon className="w-6 h-6 mr-2" />Transaction History</h3>
                    {user.transactions && user.transactions.length > 0 ? (
                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                            {user.transactions.map(tx => (
                                <li key={tx.id} className="flex justify-between items-center text-sm p-2 bg-light rounded-md">
                                    <div>
                                        <p className="font-medium text-gray-800">{tx.description}</p>
                                        <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleString()}</p>
                                    </div>
                                    <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.amount > 0 ? '+' : ''}R{(tx.amount / 100).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No transactions yet.</p>
                    )}
                </div>
            )}

            <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center"><FileUploadIcon className="w-6 h-6 mr-2" />My Files</h3>
                <div className="p-4 bg-light rounded-lg border border-gray-200 space-y-4">
                    <h4 className="font-semibold text-gray-800">Upload a new file</h4>
                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">File</label>
                        <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                    </div>
                     <div>
                        <label htmlFor="file-notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                        <textarea id="file-notes" name="file-notes" rows={2} value={fileNotes} onChange={(e) => setFileNotes(e.target.value)} placeholder="e.g., Employment contract for John Doe" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                    <button onClick={handleUploadClick} disabled={!selectedFile || isUploading} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 flex items-center justify-center">
                        {isUploading ? <><LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5" /> Uploading...</> : <><FileUploadIcon className="w-5 h-5 mr-2"/> Upload File</>}
                    </button>
                </div>
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Uploaded Files</h4>
                    {userFiles.length > 0 ? (
                        <ul className="space-y-2 max-h-60 overflow-y-auto p-1">
                            {userFiles.map(file => (
                                <li key={file.id} className="flex justify-between items-center text-sm p-3 bg-light rounded-md border border-gray-200">
                                    <div className="flex items-center flex-1 overflow-hidden">
                                        <FileIcon className="w-6 h-6 text-primary mr-3 flex-shrink-0" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-medium text-gray-800 truncate" title={file.name}>{file.name}</p>
                                            <p className="text-xs text-gray-500 truncate" title={file.notes}>{file.notes || 'No notes'}</p>
                                            <p className="text-xs text-gray-500">{new Date(file.createdAt).toLocaleString()} &bull; {(file.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                    <button onClick={() => onFileDownload(file.storagePath)} className="ml-4 flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors">Download</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No files uploaded yet.</p>
                    )}
                </div>
            </div>

            <DocumentHistorySection title="Policies Generated" documents={generatedPolicies} icon={MasterPolicyIcon} />
            <DocumentHistorySection title="Forms Generated" documents={generatedForms} icon={FormsIcon} />
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <button onClick={onLogout} className="w-full max-w-xs mx-auto bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center">
            Logout
          </button>
        </div>
      </div>
      {paymentModalState?.isOpen && (
        <PaymentModal 
            isOpen={paymentModalState.isOpen}
            onClose={() => setPaymentModalState(null)}
            onSuccess={handlePaymentSuccess}
            amountInCents={paymentModalState.amountInCents}
            itemName={paymentModalState.itemName}
        />
    )}
    </div>
  );
};

export default ProfilePage;