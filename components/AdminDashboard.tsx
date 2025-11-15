import React, { useState, useMemo } from 'react';
import type { User, GeneratedDocument, Transaction, AdminActionLog } from '../types';
import { UserIcon, MasterPolicyIcon, FormsIcon, SearchIcon, CreditCardIcon, HistoryIcon, DownloadIcon } from './Icons';
import AdminUserDetailModal from './AdminUserDetailModal';

interface AdminDashboardProps {
  allUsers: User[];
  allDocuments: GeneratedDocument[];
  allTransactions: Transaction[];
  adminActionLogs: AdminActionLog[];
  adminActions: {
    updateUser: (targetUid: string, updates: Partial<User>) => Promise<void>;
    adjustCredit: (targetUid: string, amountInCents: number, reason: string) => Promise<void>;
    changePlan: (targetUid: string, newPlan: 'pro' | 'payg') => Promise<void>;
    simulateFailedPayment: (targetUid: string, targetUserEmail: string) => Promise<void>;
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


const AdminDashboard: React.FC<AdminDashboardProps> = ({ allUsers, allDocuments, allTransactions, adminActionLogs, adminActions }) => {
  type AdminTab = 'users' | 'analytics' | 'transactions' | 'logs';
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const stats = useMemo(() => {
    const proUsers = allUsers.filter(u => u.plan === 'pro' && u.email !== 'admin@hrcopilot.co.za').length;
    const paygUsers = allUsers.filter(u => u.plan === 'payg').length;
    // FIX: Ensure tx.amount is treated as a number in the addition to prevent string concatenation.
    const totalRevenue = allTransactions.reduce((acc, tx) => (Number(tx.amount) > 0 ? acc + Number(tx.amount) : acc), 0);
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
        name: u.name, email: u.email, plan: u.plan, credit_balance: (u.creditBalance / 100).toFixed(2), signup_date: u.createdAt
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
    // FIX: Add Number() cast to ensure t.amount is treated as a number before division.
    const handleExport = () => exportToCsv('transactions.csv', transactions.map(t => ({
        date: t.date, user_email: t.userEmail, description: t.description, 
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
                        {/* FIX: Add Number() cast to ensure tx.amount is treated as a number for comparison and calculation. */}
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