
import React, { useState, useMemo } from 'react';
import type { User, GeneratedDocument, Transaction, AdminActionLog, Coupon, AdminNotification } from '../types';
import { UserIcon, MasterPolicyIcon, FormsIcon, SearchIcon, CreditCardIcon, HistoryIcon, DownloadIcon, CouponIcon } from './Icons';
import AdminUserDetailModal from './AdminUserDetailModal';
import { PageInfo } from '../contexts/DataContext';

interface AdminDashboardProps {
  paginatedUsers: { data: User[]; pageInfo: PageInfo };
  onNextUsers: () => void;
  onPrevUsers: () => void;

  paginatedDocuments: { data: GeneratedDocument[]; pageInfo: PageInfo };
  onNextDocs: () => void;
  onPrevDocs: () => void;
  
  transactionsForUserPage: Transaction[];

  paginatedLogs: { data: AdminActionLog[]; pageInfo: PageInfo };
  onNextLogs: () => void;
  onPrevLogs: () => void;
  
  allCoupons: Coupon[];
  adminNotifications: AdminNotification[];
  adminActions: {
    updateUser: (targetUid: string, updates: Partial<User>) => Promise<void>;
    adjustCredit: (targetUid: string, amountInCents: number, reason: string) => Promise<void>;
    changePlan: (targetUid: string, newPlan: 'pro' | 'payg') => Promise<void>;
    simulateFailedPayment: (targetUid: string, targetUserEmail: string) => Promise<void>;
    createCoupon: (couponData: Omit<Coupon, 'id' | 'createdAt' | 'uses' | 'isActive'>) => Promise<void>;
    deactivateCoupon: (couponId: string) => Promise<void>;
  };
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

// Helper for CSV Export
const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || rows.length === 0) {
        return;
    }
    const header = Object.keys(rows[0]).join(',');
    const csv = rows.map(row => 
        Object.values(row).map(value => 
            `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
    ).join('\n');
    
    const blob = new Blob([header + '\n' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const PaginationControls: React.FC<{ pageInfo: PageInfo; onNext: () => void; onPrev: () => void; }> = ({ pageInfo, onNext, onPrev }) => {
    const { pageIndex, pageSize, hasNextPage, dataLength, total } = pageInfo;
    const startItem = pageIndex * pageSize + 1;
    const endItem = startItem + dataLength - 1;

    return (
        <div className="flex items-center justify-between mt-4 text-sm">
            <p className="text-gray-600">
                Showing {startItem} to {endItem}{total ? ` of ${total}` : ''}
            </p>
            <div className="space-x-2">
                <button onClick={onPrev} disabled={pageIndex === 0} className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button>
                <button onClick={onNext} disabled={!hasNextPage} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
            </div>
        </div>
    );
};

const UserList: React.FC<{ users: User[], pageInfo: PageInfo, onNext: () => void, onPrev: () => void, onViewUser: (user: User) => void }> = ({ users, pageInfo, onNext, onPrev, onViewUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = useMemo(() => {
        return users.filter(user => 
        !user.isAdmin &&
        (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [users, searchTerm]);

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
            <div className="overflow-x-auto">
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
            <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} />
        </div>
    );
};

const CouponManager: React.FC<{ coupons: Coupon[], onCreateCoupon: (data: Omit<Coupon, 'id' | 'createdAt' | 'uses' | 'isActive'>) => Promise<void>, onDeactivateCoupon: (id: string) => void }> = ({ coupons, onCreateCoupon, onDeactivateCoupon }) => {
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percentage' as 'percentage' | 'fixed', value: '10', maxUses: '100' });
  const [targetAudience, setTargetAudience] = useState<'all' | 'pro' | 'payg'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!newCoupon.code || !newCoupon.value) {
      alert("Code and value are required.");
      return;
    }
    
    setIsLoading(true);
    
    // Calculate final value: Fixed is cents, Percentage is raw number
    const finalValue = newCoupon.type === 'fixed' 
        ? Math.round(Number(newCoupon.value) * 100) // Convert Rands to Cents
        : Number(newCoupon.value);

    let applicableTo: 'all' | string[] = 'all';
    if (targetAudience === 'pro') applicableTo = ['plan:pro'];
    if (targetAudience === 'payg') applicableTo = ['plan:payg'];

    const couponData = {
      ...newCoupon,
      code: newCoupon.code.toUpperCase(),
      value: finalValue,
      maxUses: newCoupon.maxUses ? Number(newCoupon.maxUses) : undefined,
      applicableTo
    };
    
    try {
        await onCreateCoupon(couponData);
        setNewCoupon({ code: '', type: 'percentage', value: '10', maxUses: '100' });
        setTargetAudience('all');
    } catch (e) {
        // Error handled in DataContext
        console.error("Failed to create coupon in UI", e);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end p-4 border rounded-lg bg-gray-50 mb-6">
        <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Code</label>
            <input value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })} placeholder="e.g. PROMO2024" className="w-full p-2 border rounded" />
        </div>
        <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
            <select value={newCoupon.type} onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value as any })} className="w-full p-2 border rounded bg-white">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (R)</option>
            </select>
        </div>
        <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Value ({newCoupon.type === 'percentage' ? '%' : 'Rand'})</label>
            <input type="number" value={newCoupon.value} onChange={e => setNewCoupon({ ...newCoupon, value: e.target.value })} placeholder={newCoupon.type === 'percentage' ? '10' : '50'} className="w-full p-2 border rounded" />
        </div>
        <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Max Uses</label>
            <input type="number" value={newCoupon.maxUses} onChange={e => setNewCoupon({ ...newCoupon, maxUses: e.target.value })} placeholder="Optional" className="w-full p-2 border rounded" />
        </div>
        <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Applicable To</label>
            <select value={targetAudience} onChange={e => setTargetAudience(e.target.value as any)} className="w-full p-2 border rounded bg-white">
            <option value="all">All Users</option>
            <option value="pro">Pro Users Only</option>
            <option value="payg">PAYG Users Only</option>
            </select>
        </div>
        <div className="md:col-span-1">
            <button onClick={handleCreate} disabled={isLoading} className="w-full bg-primary text-white p-2 rounded disabled:bg-gray-400 font-semibold">
                {isLoading ? 'Creating...' : 'Create'}
            </button>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Existing Coupons</h2>
      <div className="space-y-2">
        {coupons.map(coupon => {
            const applicableToArray = coupon.applicableTo === 'all' ? [] : (Array.isArray(coupon.applicableTo) ? coupon.applicableTo : []);
            let audienceLabel = 'All Users';
            if (applicableToArray.includes('plan:pro')) audienceLabel = 'Pro Only';
            if (applicableToArray.includes('plan:payg')) audienceLabel = 'PAYG Only';

            return (
            <div key={coupon.id} className="p-3 border rounded-md flex justify-between items-center bg-white">
                <div>
                <p className="font-bold text-lg">{coupon.code}</p>
                <p className="text-sm text-gray-600">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `R${(coupon.value / 100).toFixed(2)} OFF`} 
                    <span className="mx-2 text-gray-300">|</span> 
                    Used: {coupon.uses} {coupon.maxUses ? `/ ${coupon.maxUses}` : ''}
                    <span className="mx-2 text-gray-300">|</span> 
                    <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-600">{audienceLabel}</span>
                </p>
                </div>
                <button onClick={() => onDeactivateCoupon(coupon.id)} disabled={!coupon.isActive} className={`px-3 py-1 rounded text-sm font-medium ${coupon.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-gray-100 text-gray-500'}`}>
                {coupon.isActive ? 'Deactivate' : 'Inactive'}
                </button>
            </div>
            );
        })}
      </div>
    </div>
  );
};

const DocumentAnalytics: React.FC<{ documents: GeneratedDocument[], pageInfo: PageInfo, onNext: () => void, onPrev: () => void }> = ({ documents, pageInfo, onNext, onPrev }) => {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => exportToCsv('documents.csv', documents.map(d => ({ id: d.id, title: d.title, kind: d.kind, type: d.type, company: d.companyProfile.companyName, createdAt: d.createdAt, version: d.version })))} className="flex items-center text-sm font-semibold text-primary hover:underline">
          <DownloadIcon className="w-4 h-4 mr-1" /> Export as CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map(doc => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap">{doc.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doc.companyProfile.companyName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(doc.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

const TransactionLog: React.FC<{ transactions: Transaction[], usersPageInfo: PageInfo, onNext: () => void, onPrev: () => void }> = ({ transactions, usersPageInfo, onNext, onPrev }) => {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Displaying transactions for the current page of users.</p>
       <div className="flex justify-end mb-4">
        <button onClick={() => exportToCsv('transactions.csv', transactions.map(t => ({ id: t.id, date: t.date, description: t.description, amount: Number(t.amount) / 100, userEmail: t.userEmail })))} className="flex items-center text-sm font-semibold text-primary hover:underline">
          <DownloadIcon className="w-4 h-4 mr-1" /> Export as CSV
        </button>
      </div>
      <div className="overflow-x-auto">
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
            {transactions.map((tx, index) => (
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
      <PaginationControls pageInfo={usersPageInfo} onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

const ActivityLog: React.FC<{ logs: AdminActionLog[], pageInfo: PageInfo, onNext: () => void, onPrev: () => void }> = ({ logs, pageInfo, onNext, onPrev }) => {
  return (
    <div>
      <div className="overflow-x-auto">
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
            {logs.map(log => (
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
      <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} />
    </div>
  );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  paginatedUsers, onNextUsers, onPrevUsers,
  paginatedDocuments, onNextDocs, onPrevDocs,
  transactionsForUserPage,
  paginatedLogs, onNextLogs, onPrevLogs,
  allCoupons, 
  adminActions,
  adminNotifications
}) => {
  type AdminTab = 'users' | 'analytics' | 'transactions' | 'logs' | 'coupons';
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Ensure activeUser reflects the latest data from the paginated list
  // This fixes the issue where the modal would show stale data (e.g., old credit balance)
  // after an update action.
  const activeUser = useMemo(() => {
    if (!selectedUser) return null;
    return paginatedUsers.data.find(u => u.uid === selectedUser.uid) || selectedUser;
  }, [selectedUser, paginatedUsers.data]);

  // Note: These stats are now based on the first page of users/transactions for performance.
  // A more advanced implementation would use separate Firestore aggregation queries.
  const stats = useMemo(() => {
    const proUsers = paginatedUsers.data.filter(u => u.plan === 'pro' && !u.isAdmin).length;
    const paygUsers = paginatedUsers.data.filter(u => u.plan === 'payg').length;
    
    return {
      totalUsers: paginatedUsers.pageInfo.total ?? (proUsers + paygUsers), // Use total if available
      totalDocuments: paginatedDocuments.pageInfo.total ?? paginatedDocuments.data.length,
    };
  }, [paginatedUsers, paginatedDocuments]);
  
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
  };

  const tabs: { id: AdminTab, name: string, icon: React.FC<{className?:string}> }[] = [
    { id: 'users', name: 'User Management', icon: UserIcon },
    { id: 'coupons', name: 'Coupons', icon: CouponIcon },
    { id: 'analytics', name: 'Document Analytics', icon: FormsIcon },
    { id: 'transactions', name: 'Transaction Log', icon: CreditCardIcon },
    { id: 'logs', name: 'Admin Activity', icon: HistoryIcon },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'users': return <UserList users={paginatedUsers.data} pageInfo={paginatedUsers.pageInfo} onNext={onNextUsers} onPrev={onPrevUsers} onViewUser={handleViewUser} />;
      case 'coupons': return <CouponManager coupons={allCoupons} onCreateCoupon={adminActions.createCoupon} onDeactivateCoupon={adminActions.deactivateCoupon} />;
      case 'analytics': return <DocumentAnalytics documents={paginatedDocuments.data} pageInfo={paginatedDocuments.pageInfo} onNext={onNextDocs} onPrev={onPrevDocs} />;
      case 'transactions': return <TransactionLog transactions={transactionsForUserPage} usersPageInfo={paginatedUsers.pageInfo} onNext={onNextUsers} onPrev={onPrevUsers} />;
      case 'logs': return <ActivityLog logs={paginatedLogs.data} pageInfo={paginatedLogs.pageInfo} onNext={onNextLogs} onPrev={onPrevLogs} />;
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
            <nav className="flex space-x-2" role="tablist" aria-label="Admin Sections">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        id={`tab-${tab.id}`}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`tabpanel-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === tab.id
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <tab.icon className="w-5 h-5 mr-2" />
                        {tab.name}
                    </button>
                ))}
            </nav>

            <div className="p-4" id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
                {renderTabContent()}
            </div>
        </div>

        {activeUser && (
            <AdminUserDetailModal
                isOpen={!!activeUser}
                onClose={() => setSelectedUser(null)}
                user={activeUser}
                userDocuments={paginatedDocuments.data.filter(doc => doc.companyProfile.companyName === activeUser.profile.companyName)}
                adminActions={adminActions}
            />
        )}
    </div>
  );
};

export default AdminDashboard;
