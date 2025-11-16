


import React, { useState, useMemo } from 'react';
import type { User, GeneratedDocument, Transaction, AdminActionLog, Coupon } from '../types';
import { UserIcon, MasterPolicyIcon, FormsIcon, SearchIcon, CreditCardIcon, HistoryIcon, DownloadIcon, CouponIcon } from './Icons';
import AdminUserDetailModal from './AdminUserDetailModal';

interface AdminDashboardProps {
  allUsers: User[];
  allDocuments: GeneratedDocument[];
  allTransactions: Transaction[];
  allCoupons: Coupon[];
  adminActionLogs: AdminActionLog[];
  adminActions: {
    updateUser: (targetUid: string, updates: Partial<User>) => Promise<void>;
    adjustCredit: (targetUid: string, amountInCents: number, reason: string) => Promise<void>;
    changePlan: (targetUid: string, newPlan: 'pro' | 'payg') => Promise<void>;
    simulateFailedPayment: (targetUid: string, targetUserEmail: string) => Promise<void>;
    createCoupon: (couponData: Omit<Coupon, 'id' | 'createdAt' | 'uses' | 'isActive'>) => Promise<void>;
    deactivateCoupon: (couponId: string) => Promise<void>;
  };
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.FC<{className?: string}> }> = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center">
    <div className="bg-primary/10 p-3 rounded-full mr-4">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-3xl font-bold text-secondary">{value}</p>
    </div>
  </div>
);

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


const AdminDashboard: React.FC<AdminDashboardProps> = ({ allUsers, allDocuments, allTransactions, allCoupons, adminActionLogs, adminActions }) => {
  type AdminTab = 'users' | 'analytics' | 'transactions' | 'logs' | 'coupons';
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const stats = useMemo(() => {
    const proUsers = allUsers.filter(u => u.plan === 'pro' && u.email !== 'admin@hrcopilot.co.za').length;
    const paygUsers = allUsers.filter(u => u.plan === 'payg').length;
    
    // Revenue should only count actual user payments (subscriptions, top-ups), not admin-granted credits.
    // FIX: Added Number() casts to ensure arithmetic operations are safe even if values are strings.
    const totalRevenue = allTransactions
      .filter(tx => !tx.description.startsWith('Admin adjustment:'))
      .reduce((acc, tx) => (Number(tx.amount) > 0 ? Number(acc) + Number(tx.amount) : Number(acc)), 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30Days = allUsers.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;

    return {
      totalUsers: proUsers + paygUsers,
      totalDocuments: allDocuments.length,
      totalRevenue: `R${(totalRevenue / 100).toFixed(2)}`,
      newUsers: newUsersLast30Days
    };
  }, [allUsers, allDocuments, allTransactions]);
  
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

  return (
    <div>
        <h1 className="text-4xl font-bold text-secondary mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.totalUsers} icon={UserIcon} />
            <StatCard title="Total Revenue" value={stats.totalRevenue} icon={CreditCardIcon} />
            <StatCard title="Documents Generated" value={stats.totalDocuments} icon={MasterPolicyIcon} />
            <StatCard title="New Users (30d)" value={stats.newUsers} icon={UserIcon} />
        </div>

        <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
            <nav className="flex space-x-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
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

            <div className="p-4">
                {activeTab === 'users' && <UserList users={allUsers} onViewUser={handleViewUser} />}
                {activeTab === 'coupons' && <CouponManager coupons={allCoupons} onCreateCoupon={adminActions.createCoupon} onDeactivateCoupon={adminActions.deactivateCoupon} />}
                {activeTab === 'analytics' && <DocumentAnalytics documents={allDocuments} />}
                {activeTab === 'transactions' && <TransactionLog transactions={allTransactions} />}
                {activeTab === 'logs' && <ActivityLog logs={adminActionLogs} />}
            </div>
        </div>

        {selectedUser && (
            <AdminUserDetailModal
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                user={selectedUser}
                userDocuments={allDocuments.filter(doc => allUsers.find(u => u.uid === selectedUser.uid)?.profile.companyName === doc.companyProfile.companyName)}
                adminActions={adminActions}
            />
        )}
    </div>
  );
};


// --- Tab Components ---

const UserList: React.FC<{ users: User[], onViewUser: (user: User) => void }> = ({ users, onViewUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = useMemo(() => {
        return users.filter(user => 
        user.email !== 'admin@hrcopilot.co.za' &&
        (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [users, searchTerm]);

    const handleExport = () => exportToCsv('users.csv', filteredUsers.map(u => ({
        name: u.name, email: u.email, plan: u.plan, 
        // FIX: Cast creditBalance to Number to prevent type errors.
        credit_balance: (Number(u.creditBalance) / 100).toFixed(2), signup_date: u.createdAt
    })));

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                    <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-gray-400" /></div>
                </div>
                <button onClick={handleExport} className="flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20"><DownloadIcon className="w-5 h-5 mr-2" />Export CSV</button>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50">{/* ... Table Head ... */}
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sign Up Date</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                </tr>
                </thead><tbody className="bg-white divide-y divide-gray-200">{/* ... Table Body ... */}
                {filteredUsers.map(user => (
                    <tr key={user.uid}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.plan === 'pro' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.plan}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => onViewUser(user)} className="text-primary hover:text-primary/80">Manage User</button></td>
                    </tr>
                ))}
                </tbody></table>
            </div>
        </div>
    );
};

const CouponManager: React.FC<{ coupons: Coupon[], onCreateCoupon: (data: any) => void, onDeactivateCoupon: (id: string) => void }> = ({ coupons, onCreateCoupon, onDeactivateCoupon }) => {
    const [formData, setFormData] = useState({ code: '', type: 'percentage' as 'percentage' | 'fixed', value: '', expiresAt: '', maxUses: '', applicableTo: 'all', userIds: '' });
    
    const handleCreate = () => {
        const applicableTo = formData.applicableTo === 'all' ? 'all' : formData.userIds.split(',').map(id => id.trim()).filter(id => id);
        onCreateCoupon({
            code: formData.code.toUpperCase(),
            type: formData.type,
            value: formData.type === 'fixed' ? Number(formData.value) * 100 : Number(formData.value),
            expiresAt: formData.expiresAt || undefined,
            maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
            applicableTo,
        });
        setFormData({ code: '', type: 'percentage', value: '', expiresAt: '', maxUses: '', applicableTo: 'all', userIds: '' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-bold text-secondary mb-4">Create New Coupon</h3>
                <div className="space-y-3">
                    <input type="text" placeholder="Coupon Code (e.g., WELCOME10)" value={formData.code} onChange={e => setFormData(p => ({...p, code: e.target.value}))} className="w-full p-2 border rounded"/>
                    <select value={formData.type} onChange={e => setFormData(p => ({...p, type: e.target.value as any}))} className="w-full p-2 border rounded bg-white">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (R)</option>
                    </select>
                    <input type="number" placeholder="Value" value={formData.value} onChange={e => setFormData(p => ({...p, value: e.target.value}))} className="w-full p-2 border rounded"/>
                    <input type="date" placeholder="Expiry Date (Optional)" value={formData.expiresAt} onChange={e => setFormData(p => ({...p, expiresAt: e.target.value}))} className="w-full p-2 border rounded"/>
                    <input type="number" placeholder="Max Uses (Optional)" value={formData.maxUses} onChange={e => setFormData(p => ({...p, maxUses: e.target.value}))} className="w-full p-2 border rounded"/>
                    <select value={formData.applicableTo} onChange={e => setFormData(p => ({...p, applicableTo: e.target.value as any}))} className="w-full p-2 border rounded bg-white">
                        <option value="all">All Users</option>
                        <option value="specific">Specific Users</option>
                    </select>
                    {formData.applicableTo === 'specific' && <textarea placeholder="Comma-separated user UIDs" value={formData.userIds} onChange={e => setFormData(p => ({...p, userIds: e.target.value}))} className="w-full p-2 border rounded"/>}
                    <button onClick={handleCreate} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md">Create Coupon</button>
                </div>
            </div>
            <div className="lg:col-span-2 overflow-x-auto border rounded-lg">
                 <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50">{/* ... */}
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                </thead><tbody className="bg-white divide-y divide-gray-200">{/* ... */}
                {coupons.map(c => (
                    <tr key={c.id}>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-sm font-semibold">{c.code}</td>
                        {/* FIX: Cast c.value to Number to ensure arithmetic operation is valid. */}
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{c.type === 'percentage' ? `${c.value}%` : `R${(Number(c.value) / 100).toFixed(2)}`}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{c.uses} / {c.maxUses || '∞'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm"><button onClick={() => onDeactivateCoupon(c.id)} disabled={!c.isActive} className="text-red-600 hover:text-red-900 disabled:text-gray-400">Deactivate</button></td>
                    </tr>
                ))}
                </tbody></table>
            </div>
        </div>
    );
};

const DocumentAnalytics: React.FC<{ documents: GeneratedDocument[] }> = ({ documents }) => {
    const analytics = useMemo(() => {
        const counts = documents.reduce((acc, doc) => {
            acc[doc.title] = (acc[doc.title] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [documents]);
    
    const handleExport = () => exportToCsv('document_analytics.csv', analytics);

    return (
        <div>
            <div className="flex justify-end items-center mb-4">
                 <button onClick={handleExport} className="flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20"><DownloadIcon className="w-5 h-5 mr-2" />Export CSV</button>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50">{/* ... */}
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Times Generated</th>
                </tr>
                </thead><tbody className="bg-white divide-y divide-gray-200">{/* ... */}
                {analytics.map(item => (
                    <tr key={item.name}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                    </tr>
                ))}
                </tbody></table>
            </div>
        </div>
    );
};

const TransactionLog: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const handleExport = () => exportToCsv('transactions.csv', transactions.map(t => ({
        date: t.date, user_email: t.userEmail, description: t.description, 
        // FIX: Ensure t.amount is treated as a number for arithmetic operations.
        amount: (Number(t.amount) / 100).toFixed(2)
    })));

    return (
        <div>
            <div className="flex justify-end items-center mb-4">
                 <button onClick={handleExport} className="flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20"><DownloadIcon className="w-5 h-5 mr-2" />Export CSV</button>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50">{/* ... */}
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
                </thead><tbody className="bg-white divide-y divide-gray-200">{/* ... */}
                {transactions.map(tx => (
                    <tr key={tx.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.date).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.userEmail}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.description}</td>
                        {/* FIX: Ensure tx.amount is treated as a number for arithmetic and comparison. */}
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-600'}`}>R{(Number(tx.amount) / 100).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody></table>
            </div>
        </div>
    );
};

const ActivityLog: React.FC<{ logs: AdminActionLog[] }> = ({ logs }) => {
     const handleExport = () => exportToCsv('admin_logs.csv', logs.map(l => ({
        timestamp: l.timestamp, admin: l.adminEmail, action: l.action, target_user: l.targetUserEmail, details: JSON.stringify(l.details)
    })));

    return (
        <div>
            <div className="flex justify-end items-center mb-4">
                 <button onClick={handleExport} className="flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20"><DownloadIcon className="w-5 h-5 mr-2" />Export CSV</button>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50">{/* ... */}
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                </tr>
                </thead><tbody className="bg-white divide-y divide-gray-200">{/* ... */}
                {logs.map(log => (
                    <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.adminEmail}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.targetUserEmail}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><pre className="text-xs bg-gray-100 p-1 rounded font-mono">{JSON.stringify(log.details, null, 2)}</pre></td>
                    </tr>
                ))}
                </tbody></table>
            </div>
        </div>
    );
};

export default AdminDashboard;