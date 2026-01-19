// ... (Existing Imports)
import React, { useState, useMemo, useEffect } from 'react';
import type { User, GeneratedDocument, Transaction, AdminActionLog, AdminNotification, Coupon, InvoiceRequest } from '../types';
import { UserIcon, MasterPolicyIcon, FormsIcon, SearchIcon, CreditCardIcon, HistoryIcon, DownloadIcon, LoadingIcon, CouponIcon, CheckIcon, FileIcon } from './Icons';
import AdminUserDetailModal from './AdminUserDetailModal';
import { PageInfo, useDataContext } from '../contexts/DataContext';
import { POLICIES, FORMS } from '../constants';
import { getOpenInvoiceRequests, processManualOrder, getAppSetting, setAppSetting } from '../services/dbService';
import { useAuthContext } from '../contexts/AuthContext';
import { ShieldCheckIcon } from './Icons';

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

const StatCard: React.FC<{ title: string; value: string | number; icon: React.FC<{ className?: string }> }> = React.memo(({ title, value, icon: Icon }) => (
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

const PaginationControls: React.FC<{ pageInfo: PageInfo; onNext: () => void; onPrev: () => void; isLoading: boolean }> = ({ pageInfo, onNext, onPrev, isLoading }) => (
  <div className="flex justify-between items-center mt-4">
    <button onClick={onPrev} disabled={pageInfo.pageIndex === 0 || isLoading} className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 text-sm">Previous</button>
    <span className="text-sm text-gray-500">Page {pageInfo.pageIndex + 1} {isLoading && '(Loading...)'}</span>
    <button onClick={onNext} disabled={!pageInfo.hasNextPage || isLoading} className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 text-sm">Next</button>
  </div>
);

const UserList: React.FC<{ users: User[]; pageInfo: PageInfo; onNext: () => void; onPrev: () => void; onViewUser: (user: User) => void; isLoading: boolean }> = ({ users, pageInfo, onNext, onPrev, onViewUser, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 pr-4 py-2 border rounded-md text-sm" />
          <SearchIcon className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
        </div>
        <button onClick={() => exportToCsv('users.csv', users)} className="text-primary text-sm flex items-center hover:underline"><DownloadIcon className="w-4 h-4 mr-1" /> Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.uid} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.plan === 'pro' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.plan === 'pro' ? 'Pro' : 'PAYG'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R{(user.creditBalance / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onViewUser(user)} className="text-indigo-600 hover:text-indigo-900">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
    </div>
  );
};

const DocumentAnalytics: React.FC<{ documents: GeneratedDocument[]; pageInfo: PageInfo; onNext: () => void; onPrev: () => void; isLoading: boolean }> = ({ documents, pageInfo, onNext, onPrev, isLoading }) => {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => exportToCsv('documents.csv', documents)} className="text-primary text-sm flex items-center hover:underline"><DownloadIcon className="w-4 h-4 mr-1" /> Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.kind}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.companyProfile?.companyName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
    </div>
  );
};

const TransactionLog: React.FC<{ transactions: Transaction[]; usersPageInfo: PageInfo; onNext: () => void; onPrev: () => void; isLoading: boolean }> = ({ transactions, usersPageInfo, onNext, onPrev, isLoading }) => {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => exportToCsv('transactions.csv', transactions)} className="text-primary text-sm flex items-center hover:underline"><DownloadIcon className="w-4 h-4 mr-1" /> Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.userEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.description}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R{(tx.amount / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls pageInfo={usersPageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
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
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-secondary mb-4">Subscription Pricing</h3>
        <div className="flex items-center max-w-md">
          <label className="w-32 text-sm font-medium text-gray-700">Pro Plan (Yearly)</label>
          <div className="flex-1 flex items-center">
            <span className="text-gray-500 mr-2">R</span>
            <input
              type="number"
              value={proPrice}
              onChange={(e) => setProPrice(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            onClick={handleUpdatePro}
            disabled={!!updating}
            className="ml-4 px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-opacity-90 disabled:opacity-50"
          >
            {updating === 'pro' ? 'Saving...' : 'Update'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-secondary mb-4">Document Pricing (Pay-As-You-Go)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-600 mb-3">Policies</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {policies.map(p => (
                <PricingRow
                  key={p.type}
                  label={p.title}
                  currentPrice={getDocPrice(p)}
                  onUpdate={(price) => handleUpdateDoc(p.type, price, 'policy')}
                  isUpdating={updating === p.type}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-600 mb-3">Forms</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {forms.map(f => (
                <PricingRow
                  key={f.type}
                  label={f.title}
                  currentPrice={getDocPrice(f)}
                  onUpdate={(price) => handleUpdateDoc(f.type, price, 'form')}
                  isUpdating={updating === f.type}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentSettings: React.FC = () => {
  const [paymentMode, setPaymentMode] = useState<'live' | 'test'>('test');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const mode = await getAppSetting('payment_mode');
        setPaymentMode(mode === 'live' ? 'live' : 'test');
      } catch (e) {
        console.error('Failed to load payment mode', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSetting();
  }, []);

  const handleToggle = async (mode: 'live' | 'test') => {
    if (mode === paymentMode) return;

    if (mode === 'live') {
      if (!confirm('⚠️ WARNING: You are about to switch to LIVE mode. Real payments will be processed. Are you sure?')) {
        return;
      }
    }

    setIsSaving(true);
    setMessage(null);
    try {
      await setAppSetting('payment_mode', mode);
      setPaymentMode(mode);
      setMessage({ type: 'success', text: `Payment mode switched to ${mode.toUpperCase()}.` });
    } catch (e: any) {
      setMessage({ type: 'error', text: `Failed to update: ${e.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <LoadingIcon className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-6">
          <ShieldCheckIcon className="w-8 h-8 text-primary mr-3" />
          <div>
            <h3 className="text-xl font-bold text-secondary">Payment Gateway Mode</h3>
            <p className="text-sm text-gray-500">Control whether the Yoco payment gateway processes real or test transactions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <button
            onClick={() => handleToggle('test')}
            disabled={isSaving}
            className={`p-6 border-2 rounded-lg text-left transition-all ${paymentMode === 'test' ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-500' : 'border-gray-300 hover:border-yellow-400'}`}
          >
            <div className="flex items-center mb-2">
              <span className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMode === 'test' ? 'border-yellow-500' : 'border-gray-400'}`}>
                {paymentMode === 'test' && <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>}
              </span>
              <span className="font-bold text-lg text-yellow-700">🧪 Sandbox Mode</span>
            </div>
            <p className="text-sm text-gray-600 ml-7">
              Use test cards for development and QA. No real money is charged.
            </p>
          </button>

          <button
            onClick={() => handleToggle('live')}
            disabled={isSaving}
            className={`p-6 border-2 rounded-lg text-left transition-all ${paymentMode === 'live' ? 'border-green-500 bg-green-50 ring-2 ring-green-500' : 'border-gray-300 hover:border-green-400'}`}
          >
            <div className="flex items-center mb-2">
              <span className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMode === 'live' ? 'border-green-500' : 'border-gray-400'}`}>
                {paymentMode === 'live' && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
              </span>
              <span className="font-bold text-lg text-green-700">✅ Live Mode</span>
            </div>
            <p className="text-sm text-gray-600 ml-7">
              Process real transactions with actual customer credit cards.
            </p>
          </button>
        </div>

        {message && (
          <p className={`mt-4 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">Test Card Numbers</h4>
          <p className="text-sm text-blue-700">
            In Sandbox mode, use card number <code className="bg-blue-100 px-1 rounded">4000 0000 0000 0077</code> with any future expiry and any CVC.
          </p>
        </div>
      </div>
    </div>
  );
};

const PricingRow: React.FC<{ label: string; currentPrice: number; onUpdate: (price: string) => void; isUpdating: boolean }> = ({ label, currentPrice, onUpdate, isUpdating }) => {
  const [price, setPrice] = useState((currentPrice / 100).toString());
  const hasChanged = Math.round(Number(price) * 100) !== currentPrice;

  return (
    <div className="flex items-center justify-between bg-white p-2 border rounded-md shadow-sm">
      <span className="text-sm text-gray-700 truncate mr-2 flex-1" title={label}>{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-gray-500 text-xs">R</span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-20 p-1 text-sm border rounded"
        />
        <button
          onClick={() => onUpdate(price)}
          disabled={!hasChanged || isUpdating}
          className={`px-2 py-1 text-xs rounded ${hasChanged ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
        >
          {isUpdating ? '...' : 'Save'}
        </button>
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-bold text-secondary mb-4">Create New Coupon</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-700">Code</label>
            <input type="text" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} className="w-full p-2 border rounded-md" placeholder="SAVE20" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Type</label>
            <select value={newCoupon.discountType} onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })} className="w-full p-2 border rounded-md">
              <option value="fixed">Fixed Amount (R)</option>
              <option value="percentage">Percentage (%)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Value</label>
            <input type="number" value={newCoupon.discountValue} onChange={e => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Target</label>
            <select value={newCoupon.applicableTo} onChange={e => setNewCoupon({ ...newCoupon, applicableTo: e.target.value })} className="w-full p-2 border rounded-md">
              <option value="all">All Plans</option>
              <option value="plan:pro">Pro Plan Only</option>
              <option value="plan:payg">PAYG Only</option>
            </select>
          </div>
          <button onClick={handleCreate} disabled={loading} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-800">{coupon.code}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `R${(coupon.discountValue / 100).toFixed(0)}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {coupon.usedCount} / {coupon.maxUses || '∞'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {coupon.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {coupon.active && (
                    <button onClick={() => adminActions.deactivateCoupon(coupon.id)} className="text-red-600 hover:underline text-sm">Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ActivityLog: React.FC<{ logs: AdminActionLog[]; pageInfo: PageInfo; onNext: () => void; onPrev: () => void; isLoading: boolean }> = ({ logs, pageInfo, onNext, onPrev, isLoading }) => {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => exportToCsv('admin_logs.csv', logs)} className="text-primary text-sm flex items-center hover:underline"><DownloadIcon className="w-4 h-4 mr-1" /> Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.adminEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.targetUserEmail}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{JSON.stringify(log.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls pageInfo={pageInfo} onNext={onNext} onPrev={onPrev} isLoading={isLoading} />
    </div>
  );
};

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
        <button onClick={loadRequests} className="text-sm text-primary hover:underline flex items-center"><HistoryIcon className="w-4 h-4 mr-1" /> Refresh</button>
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
  type AdminTab = 'requests' | 'users' | 'analytics' | 'transactions' | 'logs' | 'coupons' | 'pricing' | 'payments';
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

  const tabs: { id: AdminTab, name: string, icon: React.FC<{ className?: string }> }[] = [
    { id: 'requests', name: 'Order Requests', icon: FileIcon },
    { id: 'users', name: 'User Management', icon: UserIcon },
    { id: 'analytics', name: 'Document Analytics', icon: FormsIcon },
    { id: 'transactions', name: 'Transaction Log', icon: CreditCardIcon },
    { id: 'pricing', name: 'Pricing', icon: CreditCardIcon },
    { id: 'coupons', name: 'Coupons', icon: CouponIcon },
    { id: 'payments', name: 'Payments', icon: ShieldCheckIcon },
    { id: 'logs', name: 'Admin Activity', icon: HistoryIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'requests': return <OrderRequestList userEmail={user?.email || ''} />;
      case 'users': return <UserList users={paginatedUsers.data} pageInfo={paginatedUsers.pageInfo} onNext={onNextUsers} onPrev={onPrevUsers} onViewUser={handleViewUser} isLoading={isFetchingUsers} />;
      case 'analytics': return <DocumentAnalytics documents={paginatedDocuments.data} pageInfo={paginatedDocuments.pageInfo} onNext={onNextDocs} onPrev={onPrevDocs} isLoading={isFetchingDocs} />;
      case 'transactions': return <TransactionLog transactions={transactionsForUserPage} usersPageInfo={paginatedUsers.pageInfo} onNext={onNextUsers} onPrev={onPrevUsers} isLoading={isFetchingUsers} />;
      case 'pricing': return <PricingManager />;
      case 'coupons': return <CouponManager coupons={coupons} adminActions={adminActions} />;
      case 'payments': return <PaymentSettings />;
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