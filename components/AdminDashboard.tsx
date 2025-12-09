import React, { useState, useMemo, useEffect } from 'react';
import type { User, GeneratedDocument, Transaction, AdminActionLog, AdminNotification, Coupon, InvoiceRequest } from '../types';
import { UserIcon, MasterPolicyIcon, FormsIcon, SearchIcon, CreditCardIcon, HistoryIcon, DownloadIcon, LoadingIcon, CouponIcon, CheckIcon, FileIcon } from './Icons';
import AdminUserDetailModal from './AdminUserDetailModal';
import { PageInfo, useDataContext } from '../contexts/DataContext';
import { POLICIES, FORMS } from '../constants';
import { getOpenInvoiceRequests, processManualOrder } from '../services/dbService';
import { useAuthContext } from '../contexts/AuthContext';

interface AdminDashboardProps {
  // ... (Existing Props)
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
  adminActions: any; // Using context actions
}

// ... (StatCard, exportToCsv, PaginationControls, UserList, DocumentAnalytics, TransactionLog, ActivityLog components unchanged)
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

const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
        console.warn("No data available to export");
        return;
    }
    const header = Object.keys(rows[0]).join(',');
    const csv = rows.map(row => 
        Object.values(row).map(value => {
            const val = value === null || value === undefined ? '' : String(value);
            return `"${val.replace(/"/g, '""')}"`;
        }).join(',')
    ).join('\n');
    
    const blob = new Blob([header + '\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const PaginationControls: React.FC<{ pageInfo: PageInfo; onNext: () => void; onPrev: () => void; isLoading: boolean }> = ({ pageInfo, onNext, onPrev, isLoading }) => {
    const { pageIndex, pageSize, hasNextPage, dataLength, total } = pageInfo;
    const startItem = pageIndex * pageSize + 1;
    const endItem = startItem + dataLength - 1;

    return (
        <div className="flex items-center justify-between mt-4 text-sm">
            <p className="text-gray-600">
                Showing {dataLength > 0 ? startItem : 0} to {endItem}{total ? ` of ${total}` : ''}
            </p>
            <div className="space-x-2">
                <button onClick={onPrev} disabled={pageIndex === 0 || isLoading} className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button>
                <button onClick={onNext} disabled={!hasNextPage || isLoading} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
            </div>
        </div>
    );
};

const UserList: React.FC<{ users: User[], pageInfo: PageInfo, onNext: () => void, onPrev: () => void, onViewUser: (user: User) => void, isLoading: boolean }> = ({ users, pageInfo, onNext, onPrev, onViewUser, isLoading }) => {
    // ... (UserList Implementation unchanged)
    const [searchTerm, setSearchTerm] = useState('');
    const safeUsers = users || []; 
    const filteredUsers = useMemo(() => {
        return safeUsers.filter(user => 
        !user.isAdmin &&
        (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [safeUsers, searchTerm]);

    return (
        <div>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-10 border rounded-md"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>
            {isLoading ? (
                <div className="p-12 flex justify-center">
                    <LoadingIcon className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : (
            <>
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                            <tr key={user.uid}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.plan === 'pro' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {user.plan}
                                </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onViewUser(user)} className="text-primary hover:text-primary-dark">View Details</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="md:hidden space-y-4">
                    {filteredUsers.map(user => (
                        <div key={user.uid} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-secondary">{user.name || 'N/A'}</h3>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.plan === 'pro' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {user.plan}
                                </span>
                            </div>
                            <div className="flex justify-end mt-3 border-t pt-2">
                                <button onClick={() => onViewUser(user)} className="text-sm font-medium text-primary">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            </>
            )}
            <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
        </div>
    );
};

// ... (Other sub-components like DocumentAnalytics, TransactionLog etc. stay here)
// Simplified here for brevity but assuming they exist as per your provided file.

// --- NEW COMPONENT: OrderRequestList ---
const OrderRequestList: React.FC<{ userEmail: string }> = ({ userEmail }) => {
    const [requests, setRequests] = useState<InvoiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await getOpenInvoiceRequests();
            setRequests(data);
        } catch (e) {
            console.error("Failed to load requests", e);
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

// ... (PricingManager, CouponManager, etc. assumed to be here or imported)
// Re-declaring components if they were inline in the provided file to ensure compilation.
const DocumentAnalytics: React.FC<{ documents: GeneratedDocument[], pageInfo: PageInfo, onNext: () => void, onPrev: () => void, isLoading: boolean }> = ({ documents, pageInfo, onNext, onPrev, isLoading }) => {
  // ... (Same as provided file)
  const safeDocs = documents || [];
  const handleExport = () => {
      const exportData = safeDocs.map(d => ({
          id: d.id,
          title: d.title,
          kind: d.kind,
          type: d.type,
          companyName: d.companyProfile?.companyName || 'Unknown',
          createdAt: d.createdAt,
          version: d.version
      }));
      exportToCsv('documents.csv', exportData);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={handleExport} disabled={safeDocs.length === 0} className="flex items-center text-sm font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
          <DownloadIcon className="w-4 h-4 mr-1" /> Export as CSV
        </button>
      </div>
      {isLoading ? (<div className="p-12 flex justify-center"><LoadingIcon className="w-10 h-10 animate-spin text-primary" /></div>) : safeDocs.length === 0 ? (<div className="p-12 text-center text-gray-500 italic">No documents found.</div>) : (
      <>
        <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {safeDocs.map(doc => (
                <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.companyProfile?.companyName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(doc.createdAt).toLocaleDateString()}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="md:hidden space-y-4">
            {safeDocs.map(doc => (
                <div key={doc.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <h3 className="font-bold text-secondary mb-1">{doc.title}</h3>
                    <div className="text-sm text-gray-600 mb-1"><span className="font-medium">Company:</span> {doc.companyProfile?.companyName || 'N/A'}</div>
                    <div className="text-xs text-gray-500">Generated on {new Date(doc.createdAt).toLocaleDateString()}</div>
                </div>
            ))}
        </div>
      </>
      )}
      <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
    </div>
  );
};

const TransactionLog: React.FC<{ transactions: Transaction[], usersPageInfo: PageInfo, onNext: () => void, onPrev: () => void, isLoading: boolean }> = ({ transactions, usersPageInfo, onNext, onPrev, isLoading }) => {
  // ... (Same as provided file)
  const safeTransactions = transactions || [];
  const handleExport = () => {
      const exportData = safeTransactions.map(t => ({
          id: t.id,
          date: t.date,
          description: t.description,
          amount: Number(t.amount) / 100,
          userEmail: t.userEmail
      }));
      exportToCsv('transactions.csv', exportData);
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Displaying transactions for the current page of users.</p>
       <div className="flex justify-end mb-4">
        <button onClick={handleExport} disabled={safeTransactions.length === 0} className="flex items-center text-sm font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
          <DownloadIcon className="w-4 h-4 mr-1" /> Export as CSV
        </button>
      </div>
      {isLoading ? (<div className="p-12 flex justify-center"><LoadingIcon className="w-10 h-10 animate-spin text-primary" /></div>) : safeTransactions.length === 0 ? (<div className="p-12 text-center text-gray-500 italic">No transactions found for this page.</div>) : (
      <>
        <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {safeTransactions.map((tx, index) => (
                <tr key={tx.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.date).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{tx.userEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{tx.description}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-600'}`}>R{(Number(tx.amount) / 100).toFixed(2)}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="md:hidden space-y-4">
            {safeTransactions.map((tx, index) => (
                <div key={tx.id || index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm">{tx.description}</p>
                            <p className="text-xs text-gray-500">{tx.userEmail}</p>
                        </div>
                        <span className={`font-semibold text-sm ${Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            R{(Number(tx.amount) / 100).toFixed(2)}
                        </span>
                    </div>
                    <div className="text-xs text-gray-400 text-right">{new Date(tx.date).toLocaleString()}</div>
                </div>
            ))}
        </div>
      </>
      )}
      <PaginationControls pageInfo={usersPageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
    </div>
  );
};

const ActivityLog: React.FC<{ logs: AdminActionLog[], pageInfo: PageInfo, onNext: () => void, onPrev: () => void, isLoading: boolean }> = ({ logs, pageInfo, onNext, onPrev, isLoading }) => {
  // ... (Same as provided file)
  const safeLogs = logs || [];
  return (
    <div>
      {isLoading ? (<div className="p-12 flex justify-center"><LoadingIcon className="w-10 h-10 animate-spin text-primary" /></div>) : safeLogs.length === 0 ? (<div className="p-12 text-center text-gray-500 italic">No activity logs found.</div>) : (
      <>
        <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target User</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {safeLogs.map(log => (
                <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.adminEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.targetUserEmail}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="md:hidden space-y-4">
            {safeLogs.map(log => (
                <div key={log.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="mb-2"><span className="font-bold text-secondary block">{log.action}</span><span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span></div>
                    <div className="text-sm text-gray-700"><span className="font-semibold">By:</span> {log.adminEmail}</div>
                    <div className="text-sm text-gray-700"><span className="font-semibold">To:</span> {log.targetUserEmail}</div>
                </div>
            ))}
        </div>
      </>
      )}
      <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
    </div>
  );
};

const CouponManager: React.FC<{ coupons: Coupon[], adminActions: any }> = ({ coupons, adminActions }) => {
    // ... (Same as provided file)
    const [newCoupon, setNewCoupon] = React.useState({ code: '', discountType: 'fixed', discountValue: '', maxUses: '', applicableTo: 'plan:pro' });
    const [isCreating, setIsCreating] = React.useState(false);
    const safeCoupons = coupons || [];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            let value = Number(newCoupon.discountValue);
            if (newCoupon.discountType === 'fixed') {
                value = Math.round(value * 100); 
            }
            await adminActions.createCoupon({ ...newCoupon, discountValue: value, maxUses: newCoupon.maxUses ? Number(newCoupon.maxUses) : null, applicableTo: newCoupon.applicableTo });
            setNewCoupon({ code: '', discountType: 'fixed', discountValue: '', maxUses: '', applicableTo: 'plan:pro' });
        } catch (error) { console.error(error); } finally { setIsCreating(false); }
    };

    const handleDeactivate = async (id: string) => {
        if (window.confirm('Are you sure you want to deactivate this coupon?')) { await adminActions.deactivateCoupon(id); }
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-secondary mb-4">Create New Coupon</h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">1. Who is this coupon for?</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${newCoupon.applicableTo === 'plan:pro' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                                <input type="radio" name="applicableTo" value="plan:pro" checked={newCoupon.applicableTo === 'plan:pro'} onChange={e => setNewCoupon({...newCoupon, applicableTo: e.target.value})} className="sr-only"/>
                                <span className="font-bold text-secondary block">Pro Membership</span>
                                <span className="text-xs text-gray-500">Applies to the R747 yearly subscription fee.</span>
                            </label>
                            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${newCoupon.applicableTo === 'plan:payg' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                                <input type="radio" name="applicableTo" value="plan:payg" checked={newCoupon.applicableTo === 'plan:payg'} onChange={e => setNewCoupon({...newCoupon, applicableTo: e.target.value})} className="sr-only"/>
                                <span className="font-bold text-secondary block">PAYG Credit Top-Up</span>
                                <span className="text-xs text-gray-500">Applies to credit purchases (e.g. Pay R50 get R100).</span>
                            </label>
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">2. Coupon Code</label><input required type="text" placeholder="e.g. SAVE20" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="w-full p-3 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">3. Max Uses (Optional)</label><input type="number" placeholder="Unlimited" value={newCoupon.maxUses} onChange={e => setNewCoupon({...newCoupon, maxUses: e.target.value})} className="w-full p-3 border rounded-md" /></div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">4. Discount Type</label><select value={newCoupon.discountType} onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value})} className="w-full p-3 border rounded-md bg-white"><option value="fixed">Fixed Amount (Rand)</option><option value="percentage">Percentage (%)</option></select></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">5. Value</label><input required type="number" placeholder={newCoupon.discountType === 'fixed' ? '50 (Rand off)' : '10 (% off)'} value={newCoupon.discountValue} onChange={e => setNewCoupon({...newCoupon, discountValue: e.target.value})} className="w-full p-3 border rounded-md" /></div>
                    </div>
                    <div className="md:col-span-2"><button disabled={isCreating} type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:opacity-50">{isCreating ? 'Creating...' : 'Create Coupon'}</button></div>
                </form>
            </div>
            <div>
                <h3 className="text-lg font-bold text-secondary mb-4">Active Coupons</h3>
                <div className="hidden md:block overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{safeCoupons.map(c => (<tr key={c.id}><td className="px-6 py-4 font-bold text-primary">{c.code}</td><td className="px-6 py-4">{c.discountType === 'fixed' ? `R${(c.discountValue / 100).toFixed(2)}` : `${c.discountValue}%`}</td><td className="px-6 py-4">{c.usedCount} {c.maxUses ? `/ ${c.maxUses}` : ''}</td><td className="px-6 py-4 text-xs">{c.applicableTo === 'plan:pro' ? <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Pro Only</span> : c.applicableTo === 'plan:payg' ? <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">PAYG Only</span> : <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">All</span>}</td><td className="px-6 py-4">{c.active ? <span className="text-green-600 font-semibold">Active</span> : <span className="text-red-600">Inactive</span>}</td><td className="px-6 py-4 text-right">{c.active && (<button onClick={() => handleDeactivate(c.id)} className="text-red-600 hover:underline text-sm">Deactivate</button>)}</td></tr>))}</tbody></table></div>
                <div className="md:hidden space-y-4">{safeCoupons.map(c => (<div key={c.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 relative"><div className="flex justify-between items-center mb-2"><span className="font-bold text-lg text-primary">{c.code}</span><span className={`text-sm font-semibold ${c.active ? 'text-green-600' : 'text-red-600'}`}>{c.active ? 'Active' : 'Inactive'}</span></div><div className="grid grid-cols-2 gap-2 text-sm mb-3"><div><p className="text-gray-500 text-xs">Discount</p><p>{c.discountType === 'fixed' ? `R${(c.discountValue / 100).toFixed(2)}` : `${c.discountValue}%`}</p></div><div><p className="text-gray-500 text-xs">Target</p><p className="capitalize">{c.applicableTo.replace('plan:', '')}</p></div><div><p className="text-gray-500 text-xs">Usage</p><p>{c.usedCount} {c.maxUses ? `/ ${c.maxUses}` : ''}</p></div></div>{c.active && (<div className="text-right border-t pt-2"><button onClick={() => handleDeactivate(c.id)} className="text-red-600 text-sm font-medium hover:underline">Deactivate</button></div>)}</div>))}</div>
            </div>
        </div>
    );
};

const PricingManager: React.FC = () => {
    // ... (Same as provided file)
    const { proPlanPrice, adminActions, getDocPrice } = useDataContext();
    const [proPriceInput, setProPriceInput] = useState((proPlanPrice / 100).toString());
    const [isUpdatingPro, setIsUpdatingPro] = useState(false);
    
    const allDocs = useMemo(() => [
        ...Object.values(POLICIES).map(p => ({ ...p, category: 'policy' })),
        ...Object.values(FORMS).map(f => ({ ...f, category: 'form' }))
    ], []);

    const [searchTerm, setSearchTerm] = useState('');
    const [editingDoc, setEditingDoc] = useState<string | null>(null); // Doc Type ID
    const [editPriceInput, setEditPriceInput] = useState('');

    const handleUpdateProPrice = async () => {
        setIsUpdatingPro(true);
        try {
            const cents = Math.round(Number(proPriceInput) * 100);
            await adminActions.setProPrice(cents);
        } finally {
            setIsUpdatingPro(false);
        }
    };

    const handleEditDoc = (doc: any) => {
        setEditingDoc(doc.type);
        setEditPriceInput((getDocPrice(doc) / 100).toString());
    };

    const handleSaveDocPrice = async (doc: any) => {
        const cents = Math.round(Number(editPriceInput) * 100);
        await adminActions.setDocPrice(doc.type, cents, doc.category);
        setEditingDoc(null);
    };

    const filteredDocs = allDocs.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-secondary mb-4">Subscription Pricing</h3>
                <div className="flex items-end gap-4 max-w-md">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Annual Pro Plan Price (R)</label>
                        <input 
                            type="number" 
                            value={proPriceInput} 
                            onChange={e => setProPriceInput(e.target.value)} 
                            className="w-full p-3 border rounded-md font-bold text-lg"
                        />
                    </div>
                    <button 
                        onClick={handleUpdateProPrice} 
                        disabled={isUpdatingPro}
                        className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 disabled:opacity-50"
                    >
                        {isUpdatingPro ? 'Updating...' : 'Update Price'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-secondary">Document Pricing (PAYG)</h3>
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-9 border rounded-md text-sm"
                        />
                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price (R)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDocs.map((doc: any) => (
                                <tr key={doc.type}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-secondary">{doc.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${doc.category === 'policy' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {doc.category === 'policy' ? 'Policy' : 'Form'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingDoc === doc.type ? (
                                            <input 
                                                type="number" 
                                                value={editPriceInput} 
                                                onChange={e => setEditPriceInput(e.target.value)}
                                                className="w-24 p-1 border rounded"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="font-bold text-gray-700">R{(getDocPrice(doc) / 100).toFixed(2)}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingDoc === doc.type ? (
                                            <div className="space-x-2">
                                                <button onClick={() => handleSaveDocPrice(doc)} className="text-green-600 hover:underline font-bold text-sm">Save</button>
                                                <button onClick={() => setEditingDoc(null)} className="text-gray-500 hover:underline text-sm">Cancel</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleEditDoc(doc)} className="text-primary hover:underline text-sm font-medium">Edit Price</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
  const [activeTab, setActiveTab] = useState<AdminTab>('requests'); // Default to requests
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