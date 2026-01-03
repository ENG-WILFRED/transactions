///home/hp/JERE/AutoNest/app/dashboard/admin/accounts/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { accountsApi } from "@/app/lib/api-client";
import { 
  Wallet, TrendingUp, DollarSign, CreditCard, Calendar, 
  AlertCircle, Save, ArrowLeft 
} from "lucide-react";

interface Account {
  id: string;
  userId: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
  accountType: {
    id: string;
    name: string;
    description: string;
    interestRate?: number;
  };
  accountStatus: string;
  totalBalance: number;
  employeeBalance: number;
  employerBalance: number;
  earningsBalance: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminAccountDetailPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params?.id as string;

  const [user, setUser] = useState<{firstName?: string; lastName?: string} | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [contributionForm, setContributionForm] = useState({
    employeeAmount: "",
    employerAmount: "",
    description: "",
  });

  const [earningsForm, setEarningsForm] = useState({
    type: "interest" as "interest" | "investment" | "dividend",
    amount: "",
    description: "",
  });

  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);

          if (userData.role !== 'admin') {
            toast.error('Access denied: Admin only');
            router.push('/dashboard/customer');
            return;
          }
        }

        if (!accountId) {
          toast.error('Account ID missing');
          router.push('/dashboard/admin/accounts');
          return;
        }

        const response = await accountsApi.getById(accountId);
        
        if (response.success && response.account) {
          setAccount(response.account);
          setNewStatus(response.account.accountStatus);
        } else {
          toast.error('Account not found');
          router.push('/dashboard/admin/accounts');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load account');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accountId, router]);

  const handleAddContribution = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) return;
    if (!contributionForm.employeeAmount && !contributionForm.employerAmount) {
      toast.error('Enter at least one contribution amount');
      return;
    }

    setUpdating(true);

    try {
      const response = await accountsApi.addContribution(account.id, {
        employeeAmount: parseFloat(contributionForm.employeeAmount) || 0,
        employerAmount: parseFloat(contributionForm.employerAmount) || 0,
        description: contributionForm.description || 'Admin-added contribution',
      });

      if (response.success) {
        toast.success('Contribution added successfully!');
        setContributionForm({ employeeAmount: "", employerAmount: "", description: "" });
        
        // Refresh account
        const refreshResponse = await accountsApi.getById(account.id);
        if (refreshResponse.success) {
          setAccount(refreshResponse.account);
        }
      } else {
        toast.error(response.error || 'Failed to add contribution');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add contribution');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddEarnings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) return;
    if (!earningsForm.amount) {
      toast.error('Enter earnings amount');
      return;
    }

    setUpdating(true);

    try {
      const response = await accountsApi.addEarnings(account.id, {
        type: earningsForm.type,
        amount: parseFloat(earningsForm.amount),
        description: earningsForm.description || `${earningsForm.type} earnings`,
      });

      if (response.success) {
        toast.success('Earnings added successfully!');
        setEarningsForm({ type: "interest", amount: "", description: "" });
        
        // Refresh account
        const refreshResponse = await accountsApi.getById(account.id);
        if (refreshResponse.success) {
          setAccount(refreshResponse.account);
        }
      } else {
        toast.error(response.error || 'Failed to add earnings');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add earnings');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!account || !newStatus) return;

    if (newStatus === account.accountStatus) {
      toast.info('Status unchanged');
      return;
    }

    setUpdating(true);

    try {
      const response = await accountsApi.updateStatus(account.id, {
        accountStatus: newStatus as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
      });

      if (response.success) {
        toast.success('Account status updated!');
        
        // Refresh account
        const refreshResponse = await accountsApi.getById(account.id);
        if (refreshResponse.success) {
          setAccount(refreshResponse.account);
        }
      } else {
        toast.error(response.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-gray-600 font-medium">Loading account details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Account not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/admin/accounts')}
            className="flex items-center gap-2 text-indigo-600 hover:underline mb-4"
          >
            <ArrowLeft size={20} />
            Back to Accounts
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Details</h1>
          <p className="text-gray-600 mt-2">
            {account.user?.firstName} {account.user?.lastName} - {account.accountType.name}
          </p>
        </div>

        {/* Account Summary */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wallet size={32} />
              <h2 className="text-xl font-bold">Total Balance</h2>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(account.accountStatus)} text-gray-900`}>
              {account.accountStatus}
            </span>
          </div>
          <p className="text-4xl sm:text-5xl font-bold">KES {account.totalBalance.toLocaleString()}</p>
          <p className="text-red-100 mt-2">{account.user?.email}</p>
        </div>

        {/* Balance Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={20} className="text-green-600" />
              <span className="text-sm font-semibold text-gray-600">Employee</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {account.employeeBalance.toLocaleString()}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} className="text-blue-600" />
              <span className="text-sm font-semibold text-gray-600">Employer</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {account.employerBalance.toLocaleString()}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-purple-600" />
              <span className="text-sm font-semibold text-gray-600">Earnings</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {account.earningsBalance.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Contribution */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              Add Contribution
            </h3>

            <form onSubmit={handleAddContribution} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee Amount (KES)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={contributionForm.employeeAmount}
                  onChange={(e) => setContributionForm({...contributionForm, employeeAmount: e.target.value})}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employer Amount (KES)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={contributionForm.employerAmount}
                  onChange={(e) => setContributionForm({...contributionForm, employerAmount: e.target.value})}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={contributionForm.description}
                  onChange={(e) => setContributionForm({...contributionForm, description: e.target.value})}
                  placeholder="Optional"
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition font-semibold"
              >
                {updating ? 'Adding...' : 'Add Contribution'}
              </button>
            </form>
          </div>

          {/* Add Earnings */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Add Earnings
            </h3>

            <form onSubmit={handleAddEarnings} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Earnings Type
                </label>
                <select
                  value={earningsForm.type}
                  onChange={(e) => setEarningsForm({...earningsForm, type: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg p-3"
                >
                  <option value="interest">Interest</option>
                  <option value="investment">Investment Returns</option>
                  <option value="dividend">Dividends</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (KES)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={earningsForm.amount}
                  onChange={(e) => setEarningsForm({...earningsForm, amount: e.target.value})}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={earningsForm.description}
                  onChange={(e) => setEarningsForm({...earningsForm, description: e.target.value})}
                  placeholder="Optional"
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-semibold"
              >
                {updating ? 'Adding...' : 'Add Earnings'}
              </button>
            </form>
          </div>
        </div>

        {/* Update Status */}
        <div className="mt-6 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Save size={20} />
            Update Account Status
          </h3>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={updating || newStatus === account.accountStatus}
              className="bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition font-semibold whitespace-nowrap"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}