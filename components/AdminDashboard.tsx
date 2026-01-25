import React, { useState, useMemo, useEffect } from 'react';
import type { User, GeneratedDocument, Transaction, AdminActionLog, AdminNotification, Coupon, InvoiceRequest } from '../types';
import { UserIcon, MasterPolicyIcon, FormsIcon, SearchIcon, CreditCardIcon, HistoryIcon, DownloadIcon, LoadingIcon, CouponIcon, CheckIcon, FileIcon, ShieldCheckIcon, AlertIcon, ChatBubbleLeftRightIcon, TrendingUpIcon } from './Icons';
import AdminUserDetailModal from './AdminUserDetailModal';
import { PageInfo, useDataContext } from '../contexts/DataContext';
import { POLICIES, FORMS } from '../constants';
import { getOpenInvoiceRequests, processManualOrder, getAppSetting, setAppSetting } from '../services/dbService';
import { useAuthContext } from '../contexts/AuthContext';
import { useUIContext } from '../contexts/UIContext';

// --- Interfaces ---
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
  onSearchUsers?: (query: string) => void;
  onRunRetention?: () => Promise<any>;
}

// --- Icons Wrapper (for sidebar) ---
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

// --- Styled Components ---

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const Badge = ({ type, text }: { type: 'success' | 'warning' | 'error' | 'info' | 'default'; text: string }) => {
  const colors = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[type]}`}>
      {text}
    </span>
  );
};

const StatWidget: React.FC<{ title: string; value: string | number; icon: React.FC<{ className?: string }>; color?: string; trend?: string }> = React.memo(({ title, value, icon: Icon, color = 'text-primary', trend }) => (
  <Card className="p-6 flex items-center transition-transform hover:-translate-y-1 duration-200">
    <div className={`p-4 rounded-2xl bg-opacity-10 mr-5 ${color.replace('text-', 'bg-')}`}>
      <Icon className={`w-8 h-8 ${color}`} />
    </div>
    <div>
      <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      {trend && <p className="text-xs text-green-500 mt-1 font-medium">{trend}</p>}
    </div>
  </Card>
));

const PaginationControls: React.FC<{ pageInfo: PageInfo; onNext: () => void; onPrev: () => void; isLoading: boolean }> = ({ pageInfo, onNext, onPrev, isLoading }) => (
  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
    <button onClick={onPrev} disabled={pageInfo.pageIndex === 0 || isLoading} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 text-sm font-medium transition-colors">Previous</button>
    <span className="text-sm font-medium text-gray-500">Page {pageInfo.pageIndex + 1} {isLoading && <span className="animate-pulse text-indigo-500 ml-2">Loading...</span>}</span>
    <button onClick={onNext} disabled={!pageInfo.hasNextPage || isLoading} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 text-sm font-medium transition-colors">Next</button>
  </div>
);

// --- Sub-Features ---

const UserList: React.FC<{
  users: User[]; pageInfo: PageInfo; onNext: () => void; onPrev: () => void; onViewUser: (user: User) => void; isLoading: boolean; onSearch?: (q: string) => void;
  onRunRetention?: () => Promise<any>;
}> = ({ users, pageInfo, onNext, onPrev, onViewUser, isLoading, onSearch, onRunRetention }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRunningRetention, setIsRunningRetention] = useState(false);

  const handleRetentionClick = async () => {
    if (!onRunRetention) return;
    if (!confirm("Run logic to email inactive users (older than 7 days, 0 documents)?")) return;
    setIsRunningRetention(true);
    try {
      const res = await onRunRetention();
      alert(`Retention Scan Complete.\nEmails Sent: ${res.sent}\nLogs: ${res.logs.length > 0 ? res.logs.join('\n') : 'None'}`);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsRunningRetention(false);
    }
  };

  useEffect(() => {
    // Only search if term exists OR we have no users at all (initial load)
    if (searchTerm === '' && users.length > 0) return;

    const delayDebounceFn = setTimeout(() => {
      if (onSearch) onSearch(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch, users.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          {onRunRetention && (
            <button
              onClick={handleRetentionClick}
              disabled={isRunningRetention}
              className="bg-orange-100 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg hover:bg-orange-200 disabled:opacity-50 text-sm font-semibold transition-colors flex items-center"
            >
              <AlertIcon className="w-4 h-4 mr-2" />
              {isRunningRetention ? 'Scanning...' : 'Retention Scan'}
            </button>
          )}
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow shadow-sm"
            />
            <SearchIcon className="w-4 h-4 absolute left-3.5 top-2.5 text-gray-400" />
          </div>
          <button onClick={() => exportToCsv('users.csv', users)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Export CSV">
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Profile</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user.uid} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3 text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{user.name || 'Anonymous User'}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.plan === 'agency' ? (
                      <Badge type="info" text="AGENCY TIER" />
                    ) : user.plan === 'consultant' ? (
                      <Badge type="warning" text="CONSULTANT" />
                    ) : user.plan === 'pro' ? (
                      <Badge type="success" text="PRO PLAN" />
                    ) : (
                      <Badge type="default" text="Pay-As-You-Go" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    R{(user.creditBalance / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onViewUser(user)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 pb-4">
          <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  );
};

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
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleActivate = async (request: InvoiceRequest) => {
    if (!confirm(`Activate order for ${request.userEmail}? This sends an immediate confirmation email.`)) return;
    setProcessingId(request.id);
    try {
      await processManualOrder(userEmail, request);
      setRequests(prev => prev.filter(r => r.id !== request.id));
      alert("Order Activated & Email Sent!");
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><LoadingIcon className="w-10 h-10 animate-spin text-indigo-500" /></div>;

  if (requests.length === 0) {
    return (
      <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckIcon className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
        <p className="text-gray-500 max-w-sm mb-6">There are no pending invoice requests requiring your attention right now.</p>
        <button onClick={loadRequests} className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors">
          Refresh List
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pending Orders ({requests.length})</h2>
        <button onClick={loadRequests} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Refresh</button>
      </div>
      <div className="grid gap-4">
        {requests.map(req => (
          <Card key={req.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center group hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${req.type === 'pro' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                <CreditCardIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900 text-lg">{req.userEmail}</h4>
                  <Badge type="info" text={new Date(req.date).toLocaleDateString()} />
                </div>
                <p className="text-gray-600 text-sm">{req.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">REF: {req.reference}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto pl-14 md:pl-0">
              <div className="text-right">
                <p className={`text-2xl font-bold ${req.amount > 50000 ? 'text-green-600' : 'text-gray-900'}`}>R{(req.amount / 100).toFixed(2)}</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total Value</p>
              </div>
              <button
                onClick={() => handleActivate(req)}
                disabled={!!processingId}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 min-w-[140px] flex justify-center"
              >
                {processingId === req.id ? <LoadingIcon className="w-5 h-5 animate-spin" /> : 'Activate Now'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Other Sections (Generic Tables) ---

const DocumentAnalytics: React.FC<{ documents: GeneratedDocument[]; pageInfo: PageInfo; onNext: () => void; onPrev: () => void; isLoading: boolean }> = ({ documents, pageInfo, onNext, onPrev, isLoading }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Document Analytics</h2>
      <Card className="overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Document</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Created By</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {documents.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{doc.kind.replace(/_/g, ' ')}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{doc.companyProfile?.companyName || 'Unknown Corp'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 pb-4">
          <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  )
}

const TransactionLog: React.FC<{ transactions: Transaction[]; usersPageInfo: PageInfo; onNext: () => void; onPrev: () => void; isLoading: boolean }> = ({ transactions, usersPageInfo, onNext, onPrev, isLoading }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Financial Log</h2>
      <Card className="overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actor</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">{tx.userEmail}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{tx.description}</td>
                <td className="px-6 py-4 text-sm text-gray-500 italic">
                  {tx.actorEmail ? (
                    <span title={`Action by consultant: ${tx.actorEmail}`}>
                      Consultant
                    </span>
                  ) : 'Self'}
                </td>
                <td className={`px-6 py-4 text-right text-sm font-bold font-mono ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.amount > 0 ? '+' : ''}R{(tx.amount / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 pb-4">
          <PaginationControls pageInfo={usersPageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  )
}

const PricingRow: React.FC<{ label: string; currentPrice: number; onUpdate: (price: string) => void; isUpdating: boolean }> = ({ label, currentPrice, onUpdate, isUpdating }) => {
  const [price, setPrice] = useState((currentPrice / 100).toString());
  const hasChanged = Math.round(Number(price) * 100) !== currentPrice;

  return (
    <div className="flex items-center justify-between bg-white p-3 border border-gray-100 rounded-xl hover:border-indigo-100 transition-colors">
      <span className="text-sm font-medium text-gray-700 truncate mr-4 flex-1" title={label}>{label}</span>
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="absolute left-2.5 top-1.5 text-xs text-gray-400">R</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-24 pl-6 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button
          onClick={() => onUpdate(price)}
          disabled={!hasChanged || isUpdating}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${hasChanged ? 'bg-indigo-600 text-white shadow-sm hover:shadow-md' : 'bg-gray-50 text-gray-300 pointer-events-none'}`}
        >
          {isUpdating ? '...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

const PricingManager: React.FC = () => {
  const { proPlanPrice, getDocPrice, adminActions } = useDataContext();
  const [proPrice, setProPrice] = useState((proPlanPrice / 100).toString());
  const [updating, setUpdating] = useState<string | null>(null);

  const policies = Object.values(POLICIES);
  const forms = Object.values(FORMS);

  const handleUpdatePro = async () => {
    setUpdating('pro');
    await adminActions.setProPrice(Math.round(Number(proPrice) * 100));
    setUpdating(null);
  };

  const handleUpdateDoc = async (docType: string, priceStr: string, category: 'policy' | 'form') => {
    setUpdating(docType);
    await adminActions.setDocPrice(docType, Math.round(Number(priceStr) * 100), category);
    setUpdating(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pricing Configuration</h2>
        <Badge type="info" text="ZAR Currency" />
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              Main Subscription
            </h3>
            <p className="text-sm text-gray-500">The base price for the 12-month Pro Access plan.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">R</span>
              <input
                type="number"
                value={proPrice}
                onChange={(e) => setProPrice(e.target.value)}
                className="w-32 pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold"
              />
            </div>
            <button
              onClick={handleUpdatePro}
              disabled={!!updating}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black font-bold disabled:opacity-50 transition-all shadow-sm"
            >
              {updating === 'pro' ? 'Saving...' : 'Update Plan'}
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-700 flex items-center uppercase tracking-wider text-xs">
              <MasterPolicyIcon className="w-4 h-4 mr-2" /> Policies
            </h4>
            <span className="text-xs text-gray-400 font-medium">{policies.length} items</span>
          </div>
          <Card className="p-4 space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
            {policies.map(p => (
              <PricingRow
                key={p.type}
                label={p.title}
                currentPrice={getDocPrice(p)}
                onUpdate={(price) => handleUpdateDoc(p.type, price, 'policy')}
                isUpdating={updating === p.type}
              />
            ))}
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-700 flex items-center uppercase tracking-wider text-xs">
              <FormsIcon className="w-4 h-4 mr-2" /> Forms
            </h4>
            <span className="text-xs text-gray-400 font-medium">{forms.length} items</span>
          </div>
          <Card className="p-4 space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
            {forms.map(f => (
              <PricingRow
                key={f.type}
                label={f.title}
                currentPrice={getDocPrice(f)}
                onUpdate={(price) => handleUpdateDoc(f.type, price, 'form')}
                isUpdating={updating === f.type}
              />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

const CouponManager: React.FC<{ coupons: Coupon[]; adminActions: any }> = ({ coupons, adminActions }) => {
  const [newCoupon, setNewCoupon] = useState({ code: '', discountType: 'fixed', discountValue: 0, maxUses: 0, applicableTo: 'all' });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!newCoupon.code) return;
    setLoading(true);
    try {
      await adminActions.createCoupon({
        ...newCoupon,
        discountValue: newCoupon.discountType === 'fixed' ? newCoupon.discountValue * 100 : newCoupon.discountValue
      });
      setNewCoupon({ code: '', discountType: 'fixed', discountValue: 0, maxUses: 0, applicableTo: 'all' });
      alert("Coupon created successfully!");
    } catch (e: any) {
      alert("Error creating coupon: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Coupon Management</h2>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{coupons.filter(c => c.active).length} Active Tokens</span>
        </div>
      </div>

      <Card className="p-8 bg-indigo-50 border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <CouponIcon className="w-32 h-32 text-indigo-900" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-indigo-900 mb-6">Create New Campaign</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider">Coupon Code</label>
              <input
                type="text"
                value={newCoupon.code}
                onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2.5 bg-white border border-indigo-100 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none uppercase text-gray-800"
                placeholder="SAVE50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider">Type</label>
              <select
                value={newCoupon.discountType}
                onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-gray-700"
              >
                <option value="fixed">Fixed (R)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider">Value</label>
              <input
                type="number"
                value={newCoupon.discountValue}
                onChange={e => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-white border border-indigo-100 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider">Applies To</label>
              <select
                value={newCoupon.applicableTo}
                onChange={e => setNewCoupon({ ...newCoupon, applicableTo: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-gray-700"
              >
                <option value="all">Everything</option>
                <option value="plan:pro">Pro Only</option>
                <option value="plan:payg">PAYG Only</option>
              </select>
            </div>
            <button
              onClick={handleCreate}
              disabled={loading || !newCoupon.code}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? '...' : 'Create Coupon'}
            </button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Active Code</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Discount</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Usage</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-lg font-mono font-bold text-gray-800 border border-gray-200">{coupon.code}</span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `R${(coupon.discountValue / 100).toFixed(0)} OFF`}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-600">{coupon.usedCount} <span className="text-gray-400">/ {coupon.maxUses || '∞'}</span></div>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all"
                      style={{ width: coupon.maxUses ? `${(coupon.usedCount / coupon.maxUses) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge type={coupon.active ? 'success' : 'default'} text={coupon.active ? 'LIVE' : 'EXPIRED'} />
                </td>
                <td className="px-6 py-4 text-right">
                  {coupon.active && (
                    <button
                      onClick={() => adminActions.deactivateCoupon(coupon.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Disable
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No coupons found. Create your first campaign above!</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// --- HELPER FOR CSV ---
const exportToCsv = (filename: string, rows: object[]) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
        cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// --- MAIN LAYOUT ---

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  paginatedUsers, onNextUsers, onPrevUsers, isFetchingUsers,
  paginatedDocuments, onNextDocs, onPrevDocs, isFetchingDocs,
  transactionsForUserPage,
  paginatedLogs, onNextLogs, onPrevLogs, isFetchingLogs,
  adminActions,
  adminNotifications,
  coupons,
  onSearchUsers,
  onRunRetention
}) => {
  type AdminTab = 'dashboard' | 'requests' | 'support' | 'users' | 'analytics' | 'transactions' | 'pricing' | 'coupons' | 'settings' | 'waitlist' | 'billing';
  const { user, handleLogout } = useAuthContext();
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
      proUsers,
      revenueTest: transactionsForUserPage.reduce((acc, curr) => acc + curr.amount, 0) // rough estimate from current page
    };
  }, [paginatedUsers, paginatedDocuments, transactionsForUserPage]);

  const handleViewUser = (user: User) => { setSelectedUser(user); };

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Overview', icon: HomeIcon },
    { id: 'requests', label: 'Order Requests', icon: FileIcon, badge: 0 },
    { id: 'billing', label: 'Billing Run', icon: TrendingUpIcon },
    { id: 'support', label: 'Support Desk', icon: ChatBubbleLeftRightIcon },
    { id: 'users', label: 'Users', icon: UserIcon },
    { id: 'waitlist', label: 'Waitlist Leads', icon: HistoryIcon },
    { id: 'analytics', label: 'Documents', icon: MasterPolicyIcon },
    { id: 'transactions', label: 'Finance', icon: CreditCardIcon },
    { id: 'pricing', label: 'Pricing', icon: ShieldCheckIcon },
    { id: 'coupons', label: 'Coupons', icon: CouponIcon },
  ];

  const BillingHub = () => {
    const [ledger, setLedger] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchData = async () => {
      setLoading(true);
      try {
        const { getAdminLedger, getAdminInvoices } = await import('../services/dbService');
        const [l, i] = await Promise.all([getAdminLedger(), getAdminInvoices()]);
        setLedger(l);
        setInvoices(i);
      } catch (e) {
        console.error("Fetch failed", e);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => { fetchData(); }, []);

    const handleGenerateInvoice = async (userId: string) => {
      if (!confirm("Generate draft invoice for this user? This will move all pending items to an invoice.")) return;
      setProcessing(userId);
      try {
        const { generateInvoiceForUser } = await import('../services/dbService');
        await generateInvoiceForUser(userId);
        alert("Invoice generated successfully!");
        await fetchData();
      } catch (e: any) {
        alert("Error: " + e.message);
      } finally {
        setProcessing(null);
      }
    };

    // Group ledger by user
    const usersWithPending = useMemo(() => {
      const groups: Record<string, { userId: string, email: string, name: string, total: number, items: any[] }> = {};
      ledger.forEach(item => {
        if (!groups[item.user_id]) {
          groups[item.user_id] = {
            userId: item.user_id,
            email: item.profile?.email || 'N/A',
            name: item.profile?.name || 'User',
            total: 0,
            items: []
          };
        }
        groups[item.user_id].total += item.amount;
        groups[item.user_id].items.push(item);
      });
      return Object.values(groups);
    }, [ledger]);

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Billing Management</h2>
          <button onClick={fetchData} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
            <TrendingUpIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-slate-700">Pending Ledger Items</h3>
            <Card className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Consultant</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Total</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {usersWithPending.map(u => (
                    <tr key={u.userId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-800">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-indigo-600">R{(u.total / 100).toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{u.items.length} items</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleGenerateInvoice(u.userId)}
                          disabled={processing === u.userId}
                          className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {processing === u.userId ? '...' : 'Generate Invoice'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {usersWithPending.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">No pending items found.</td></tr>
                  )}
                </tbody>
              </table>
            </Card>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-700">Recent Invoices</h3>
            <Card className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              {invoices.map(inv => (
                <div key={inv.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xs font-black text-slate-800">{inv.invoice_number}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{inv.profile?.name}</div>
                    </div>
                    <Badge type={inv.status === 'paid' ? 'success' : 'warning'} text={inv.status.toUpperCase()} />
                  </div>
                  <div className="text-lg font-black text-slate-900 mb-2">R{(inv.amount_due / 100).toFixed(2)}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mt-3">
                    <button onClick={() => inv.pdf_url && window.open(inv.pdf_url, '_blank')} className="text-indigo-600 hover:underline">View PDF</button>
                    {inv.status !== 'paid' && (
                      <button
                        onClick={async () => {
                          if (!confirm("Mark this invoice as paid?")) return;
                          const { markInvoicePaid } = await import('../services/dbService');
                          await markInvoicePaid(inv.id);
                          fetchData();
                        }}
                        className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {invoices.length === 0 && <p className="text-center text-slate-400 text-sm py-8 italic">No invoices issued yet.</p>}
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const WaitlistTable = () => {
    const { waitlistLeads } = useDataContext();
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Waitlist Management</h2>
        <Card className="overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Lead Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Source</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {waitlistLeads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{lead.source?.replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {waitlistLeads.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No waitlist entries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    );
  };

  const SupportTicketsDesk = () => {
    const { paginatedSupportTickets, handleNextSupport, handlePrevSupport, isFetchingSupport, handleUpdateSupportStatus } = useDataContext();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Support Desk</h2>
          <Badge type="info" text={`${paginatedSupportTickets.data.filter(t => t.status === 'open').length} Open Tickets`} />
        </div>
        <Card className="overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Message</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedSupportTickets.data.map((ticket: any) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{ticket.name}</div>
                    <div className="text-xs text-gray-500">{ticket.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-sm line-clamp-2" title={ticket.message}>{ticket.message}</p>
                    {ticket.attachments?.length > 0 && (
                      <span className="text-[10px] text-indigo-500 font-bold uppercase mt-1 block">📎 {ticket.attachments.length} Attachments</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      type={ticket.status === 'open' ? 'error' : ticket.status === 'in-progress' ? 'warning' : 'success'}
                      text={ticket.status.toUpperCase()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleUpdateSupportStatus(ticket.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded p-1"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
              {paginatedSupportTickets.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No support tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 pb-4">
            <PaginationControls pageInfo={paginatedSupportTickets.pageInfo} onNext={handleNextSupport} onPrev={handlePrevSupport} isLoading={isFetchingSupport} />
          </div>
        </Card>
      </div>
    );
  };

  /* 
    DASHBOARD OVERVIEW WIDGETS
    Shown when activeTab === 'dashboard'
  */
  const DashboardOverview = () => {
    const { navigateTo } = useUIContext();
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
          <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>

        {/* HIGH IMPACT PITCH CARD */}
        <Card className="p-1 px-8 py-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white relative overflow-hidden group border-none shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl -mr-32 -mt-32 group-hover:bg-indigo-500/30 transition-all duration-700" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block border border-indigo-500/30">
                Strategic Asset
              </span>
              <h3 className="text-4xl font-black tracking-tighter mb-2">Live Stakeholder Pitch</h3>
              <p className="text-indigo-200/60 max-w-md text-sm font-medium">
                Immersive, cinematic pitch visualization designed for Business Owners and Investors. Optimized for board-room presentations.
              </p>
            </div>

            <button
              onClick={() => navigateTo('pitch')}
              className="px-8 py-4 bg-white text-indigo-950 font-black rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-3 group/btn whitespace-nowrap"
            >
              <TrendingUpIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              Launch Pitch Visualizer
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatWidget title="Total Users" value={stats.totalUsers} icon={UserIcon} color="text-blue-600" trend="+12% this month" />
          <StatWidget title="Documents" value={stats.totalDocuments} icon={MasterPolicyIcon} color="text-purple-600" trend="+5 today" />
          <StatWidget title="Pro Members" value={stats.proUsers} icon={ShieldCheckIcon} color="text-green-600" />
          <StatWidget title="Pending Invoices" value="-" icon={FileIcon} color="text-orange-500" trend="Check Inbox" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 h-96 flex flex-col justify-center items-center text-gray-400">
            <p>User Growth Chart Placeholder</p>
          </Card>
          <Card className="p-6 h-96 flex flex-col justify-center items-center text-gray-400">
            <p>Revenue Activity Placeholder</p>
          </Card>
        </div>
      </div>
    );

    return (
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <ShieldCheckIcon className="w-8 h-8 text-indigo-500 mr-2" />
            <span className="font-bold text-xl tracking-tight">HR CoPilot</span>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">AD</div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              Sign Out
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50">
          {/* TOP BAR */}
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center text-gray-400 text-sm">
              <HomeIcon className="w-4 h-4 mr-2" />
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-800 capitalize">{activeTab}</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
            </div>
          </header>

          {/* SCROLLABLE CONTENT */}
          <main className="flex-1 overflow-y-auto p-8 relative">
            <div className="max-w-7xl mx-auto pb-12">
              {activeTab === 'dashboard' && <DashboardOverview />}
              {activeTab === 'requests' && <OrderRequestList userEmail={user?.email || ''} />}
              {activeTab === 'support' && <SupportTicketsDesk />}
              {activeTab === 'users' && (
                <UserList
                  users={paginatedUsers.data}
                  pageInfo={paginatedUsers.pageInfo}
                  onNext={onNextUsers}
                  onPrev={onPrevUsers}
                  onViewUser={handleViewUser}
                  isLoading={isFetchingUsers}
                  onSearch={onSearchUsers}
                  onRunRetention={onRunRetention}
                />
              )}
              {activeTab === 'waitlist' && <WaitlistTable />}
              {activeTab === 'analytics' && <DocumentAnalytics documents={paginatedDocuments.data} pageInfo={paginatedDocuments.pageInfo} onNext={onNextDocs} onPrev={onPrevDocs} isLoading={isFetchingDocs} />}
              {activeTab === 'transactions' && <TransactionLog transactions={transactionsForUserPage} usersPageInfo={paginatedUsers.pageInfo} onNext={onNextUsers} onPrev={onPrevUsers} isLoading={isFetchingUsers} />}
              {activeTab === 'pricing' && <PricingManager />}
              {/* For brevity, other components would be similar Card-based implementations */}
              {activeTab === 'coupons' && <CouponManager coupons={coupons} adminActions={adminActions} />}
              {activeTab === 'billing' && <BillingHub />}
            </div>
          </main>
        </div>

        {activeUser && <AdminUserDetailModal isOpen={!!activeUser} onClose={() => setSelectedUser(null)} user={activeUser} adminActions={adminActions} />}
      </div>
    );
  };

  export default AdminDashboard;