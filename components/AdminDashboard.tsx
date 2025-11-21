
import React, { useState, useMemo } from 'react';
import type { User, GeneratedDocument, Transaction, AdminActionLog, AdminNotification } from '../types';
import { UserIcon, MasterPolicyIcon, FormsIcon, SearchIcon, CreditCardIcon, HistoryIcon, DownloadIcon } from './Icons';
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
  
  adminNotifications: AdminNotification[];
  adminActions: {
    updateUser: (targetUid: string, updates: Partial<User>) => Promise<void>;
    adjustCredit: (targetUid: string, amountInCents: number, reason: string) => Promise<void>;
    changePlan: (targetUid: string, newPlan: 'pro' | 'payg') => Promise<void>;
    simulateFailedPayment: (targetUid: string, targetUserEmail: string) => Promise<void>;
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
  adminActions,
  adminNotifications
}) => {
  type AdminTab = 'users' | 'analytics' | 'transactions' | 'logs';
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Ensure activeUser reflects the latest data from the paginated list
  const activeUser = useMemo(() => {
    if (!selectedUser) return null;
    return paginatedUsers.data.find(u => u.uid === selectedUser.uid) || selectedUser;
  }, [selectedUser, paginatedUsers.data]);

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
    { id: 'analytics', name: 'Document Analytics', icon: FormsIcon },
    { id: 'transactions', name: 'Transaction Log', icon: CreditCardIcon },
    { id: 'logs', name: 'Admin Activity', icon: HistoryIcon },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'users': return <UserList users={paginatedUsers.data} pageInfo={paginatedUsers.pageInfo} onNext={onNextUsers} onPrev={onPrevUsers} onViewUser={handleViewUser} />;
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
