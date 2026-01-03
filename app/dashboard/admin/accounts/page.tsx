// File: /app/dashboard/admin/accounts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { accountsApi } from "@/app/lib/api-client";
import { Wallet, Search, Eye, AlertCircle, CheckCircle, Plus } from "lucide-react";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface Account {
  id: string;
  userId: string;
  user?: User;
  accountType: { name: string };
  accountStatus: string;
  totalBalance: number;
  createdAt: string;
}

export default function AdminAccountsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{firstName?: string; lastName?: string} | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

        const response = await accountsApi.getAll();
        
        if (response.success && response.accounts) {
          setAccounts(response.accounts);
          setFilteredAccounts(response.accounts);
          toast.success(`Loaded ${response.accounts.length} accounts`);
        } else {
          toast.warning('No accounts found');
          setAccounts([]);
          setFilteredAccounts([]);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  useEffect(() => {
    let filtered = accounts;

    if (searchQuery) {
      filtered = filtered.filter(account => {
        const userName = `${account.user?.firstName || ''} ${account.user?.lastName || ''}`.toLowerCase();
        const email = account.user?.email.toLowerCase() || '';
        const accountType = account.accountType.name.toLowerCase();
        const query = searchQuery.toLowerCase();

        return userName.includes(query) || email.includes(query) || accountType.includes(query);
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(account => account.accountStatus === statusFilter);
    }

    setFilteredAccounts(filtered);
  }, [searchQuery, statusFilter, accounts]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const totalBalance = filteredAccounts.reduce((sum, acc) => sum + acc.totalBalance, 0);
  const activeAccounts = filteredAccounts.filter(acc => acc.accountStatus === 'ACTIVE').length;

  if (loading) {
    return (
      <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-gray-600 font-medium">Loading accounts...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Pension Accounts</h1>
            <p className="text-gray-600 mt-2">View and manage all user pension accounts</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/admin/accounts/create')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg"
          >
            <Plus size={20} />
            Create Account
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet size={24} className="text-indigo-600" />
              <span className="text-sm font-semibold text-gray-600">Total Accounts</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{filteredAccounts.length}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={24} className="text-green-600" />
              <span className="text-sm font-semibold text-gray-600">Active Accounts</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeAccounts}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet size={24} className="text-purple-600" />
              <span className="text-sm font-semibold text-gray-600">Total Balance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">KES {totalBalance.toLocaleString()}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or account type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm focus:outline-none w-full"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* Accounts Table */}
        {filteredAccounts.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-12 text-center">
            <Wallet size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Accounts Found</h3>
            <p className="text-gray-600 mb-6">No accounts match your search criteria</p>
            <button
              onClick={() => router.push('/dashboard/admin/accounts/create')}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
            >
              <Plus size={20} />
              Create First Account
            </button>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["User", "Account Type", "Status", "Balance", "Created", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {account.user?.firstName || ''} {account.user?.lastName || ''}
                          </p>
                          <p className="text-xs text-gray-600">{account.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                        {account.accountType.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(account.accountStatus)}`}>
                          {account.accountStatus}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">
                        KES {account.totalBalance.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {new Date(account.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <button
                          onClick={() => router.push(`/dashboard/admin/accounts/${account.id}`)}
                          className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}