// ... (Existing Imports)
import React, { useState, useMemo, useEffect } from 'react';
import type { User, GeneratedDocument, Transaction, AdminActionLog, AdminNotification, Coupon, InvoiceRequest } from '../types';
import { UserIcon, MasterPolicyIcon, FormsIcon, SearchIcon, CreditCardIcon, HistoryIcon, DownloadIcon, LoadingIcon, CouponIcon, CheckIcon, FileIcon } from './Icons';
import AdminUserDetailModal from './AdminUserDetailModal';
import { PageInfo, useDataContext } from '../contexts/DataContext';
import { POLICIES, FORMS } from '../constants';
import { getOpenInvoiceRequests, processManualOrder } from '../services/dbService';
import { useAuthContext } from '../contexts/AuthContext';

// ... (Existing Interfaces & Helper Components StatCard, exportToCsv, PaginationControls, UserList, DocumentAnalytics, TransactionLog, ActivityLog, CouponManager, PricingManager)

// Ensure AdminDashboardProps is fully defined
interface AdminDashboardProps {
  paginatedUsers: { data: User[]; pageInfo: PageInfo };
  onNextUsers: () => void;
  onPrevUsers: () => void;
  isFetchingUsers: boolean;
  paginatedDocuments: { data: GeneratedDocument[]; pageInfo: PageInfo };
  onNextDocs: () => void;
  onPrevDocs: () => void;
  isFetchingDocs: boolean;
  transactionsForUserPage: Transaction[];
  paginatedLogs: { data: AdminActionLog[]; pageInfo: PageInfo };
  onNextLogs: () => void;
  onPrevLogs: () => void;
  isFetchingLogs: boolean;
  adminNotifications: AdminNotification[];
  coupons: Coupon[];
  adminActions: any;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.FC<{className?: string}> }> = React.memo(({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center">
    <div className="bg-primary/10 p-3 rounded-full mr-4">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-3xl font-bold text-secondary">{value}</p>
    </div>
  </div>
));

// ... (Insert previously defined sub-components: exportToCsv, PaginationControls, UserList, DocumentAnalytics, TransactionLog, ActivityLog, CouponManager, PricingManager)
// NOTE: I am not repeating the full code of unchanged sub-components to save space, but they should be retained in the file.
// Assuming the user keeps the existing implementations I provided previously for these components.

const OrderRequestList: React.FC<{ userEmail: string }> = ({ userEmail }) => {
    const [requests, setRequests] = useState<InvoiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const loadRequests = async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const data = await getOpenInvoiceRequests();
            setRequests(data);
        } catch (e: any) {
            console.error("Failed to load requests", e);
            setFetchError(e.message || "Unknown database error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleActivate = async (request: InvoiceRequest) => {
        if (!confirm(`Are you sure you want to activate this order for ${request.userEmail}? This will grant access/credits immediately.`)) return;
        
        setProcessingId(request.id);
        try {
            await processManualOrder(userEmail, request);
            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== request.id));
            alert("Order activated and user notified via email.");
        } catch (error: any) {
            alert(`Failed to activate: ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><LoadingIcon className="w-8 h-8 animate-spin text-primary" /></div>;

    if (fetchError) {
        return (
            <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
                <CreditCardIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-700">Error Loading Requests</h3>
                <p className="text-red-600 mb-4">{fetchError}</p>
                <button onClick={loadRequests} className="text-primary text-sm hover:underline font-semibold">Try Again</button>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
                <CheckIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700">All caught up!</h3>
                <p className="text-gray-500">No pending invoice requests found.</p>
                <button onClick={loadRequests} className="mt-4 text-primary text-sm hover:underline">Refresh</button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-secondary">Pending Invoices ({requests.length})</h3>
                <button onClick={loadRequests} className="text-sm text-primary hover:underline flex items-center"><HistoryIcon className="w-4 h-4 mr-1"/> Refresh</button>
            </div>
            <div className="grid gap-4">
                {requests.map(req => (
                    <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center mb-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold mr-2 ${req.type === 'pro' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {req.type === 'pro' ? 'PRO PLAN' : 'CREDITS'}
                                </span>
                                <span className="text-sm text-gray-500">{new Date(req.date).toLocaleString()}</span>
                            </div>
                            <h4 className="font-bold text-gray-800">{req.userEmail}</h4>
                            <p className="text-sm text-gray-600">{req.description}</p>
                            <p className="text-xs text-gray-400 mt-1">Ref: {req.reference}</p>
                        </div>
                        <div className="flex items-center space-x-4 w-full md:w-auto">
                            <div className="text-right mr-4 hidden md:block">
                                <p className="text-xl font-bold text-gray-800">R{(req.amount / 100).toFixed(2)}</p>
                                <p className="text-xs text-gray-500">Amount Due</p>
                            </div>
                            <button 
                                onClick={() => handleActivate(req)}
                                disabled={!!processingId}
                                className="flex-1 md:flex-none bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                            >
                                {processingId === req.id ? <LoadingIcon className="w-5 h-5 animate-spin text-white" /> : 'Activate'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  paginatedUsers, onNextUsers, onPrevUsers, isFetchingUsers,
  paginatedDocuments, onNextDocs, onPrevDocs, isFetchingDocs,
  transactionsForUserPage,
  paginatedLogs, onNextLogs, onPrevLogs, isFetchingLogs,
  adminActions,
  adminNotifications,
  coupons
}) => {
  type AdminTab = 'requests' | 'users' | 'analytics' | 'transactions' | 'logs' | 'coupons' | 'pricing';
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<AdminTab>('requests'); 
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const activeUser = useMemo(() => {
    if (!selectedUser) return null;
    return paginatedUsers.data.find(u => u.uid === selectedUser.uid) || selectedUser;
  }, [selectedUser, paginatedUsers.data]);

  const stats = useMemo(() => {
    const proUsers = paginatedUsers.data.filter(u => u.plan === 'pro' && !u.isAdmin).length;
    const paygUsers = paginatedUsers.data.filter(u => u.plan === 'payg').length;
    return {
      totalUsers: paginatedUsers.pageInfo.total ?? (proUsers + paygUsers), 
      totalDocuments: paginatedDocuments.pageInfo.total ?? paginatedDocuments.data.length,
    };
  }, [paginatedUsers, paginatedDocuments]);
  
  const handleViewUser = (user: User) => { setSelectedUser(user); };

  const tabs: { id: AdminTab, name: string, icon: React.FC<{className?:string}> }[] = [
    { id: 'requests', name: 'Order Requests', icon: FileIcon },
    { id: 'users', name: 'User Management', icon: UserIcon },
    { id: 'analytics', name: 'Document Analytics', icon: FormsIcon },
    { id: 'transactions', name: 'Transaction Log', icon: CreditCardIcon },
    { id: 'pricing', name: 'Pricing', icon: CreditCardIcon },
    { id: 'coupons', name: 'Coupons', icon: CouponIcon },
    { id: 'logs', name: 'Admin Activity', icon: HistoryIcon },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'requests': return <OrderRequestList userEmail={user?.email || ''} />;
      case 'users': return <UserList users={paginatedUsers.data} pageInfo={paginatedUsers.pageInfo} onNext={onNextUsers} onPrev={onPrevUsers} onViewUser={handleViewUser} isLoading={isFetchingUsers} />;
      case 'analytics': return <DocumentAnalytics documents={paginatedDocuments.data} pageInfo={paginatedDocuments.pageInfo} onNext={onNextDocs} onPrev={onPrevDocs} isLoading={isFetchingDocs} />;
      case 'transactions': return <TransactionLog transactions={transactionsForUserPage} usersPageInfo={paginatedUsers.pageInfo} onNext={onNextUsers} onPrev={onPrevUsers} isLoading={isFetchingUsers} />;
      case 'pricing': return <PricingManager />;
      case 'coupons': return <CouponManager coupons={coupons} adminActions={adminActions} />;
      case 'logs': return <ActivityLog logs={paginatedLogs.data} pageInfo={paginatedLogs.pageInfo} onNext={onNextLogs} onPrev={onPrevLogs} isLoading={isFetchingLogs} />;
      default: return null;
    }
  }

  return (
    <div>
        <h1 className="text-4xl font-bold text-secondary mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.totalUsers} icon={UserIcon} />
            <StatCard title="Documents Generated" value={stats.totalDocuments} icon={MasterPolicyIcon} />
        </div>
        <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
            <nav className="flex space-x-2 overflow-x-auto" role="tablist" aria-label="Admin Sections">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <tab.icon className="w-5 h-5 mr-2" />
                        {tab.name}
                    </button>
                ))}
            </nav>
            <div className="p-4">{renderTabContent()}</div>
        </div>
        {activeUser && <AdminUserDetailModal isOpen={!!activeUser} onClose={() => setSelectedUser(null)} user={activeUser} adminActions={adminActions} />}
    </div>
  );
};

export default AdminDashboard;