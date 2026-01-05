///app/dashboard/admin/accounts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { accountsApi } from "@/app/lib/api-client";
import { Wallet, Search, Eye, AlertCircle, CheckCircle, Plus, Settings, Filter } from "lucide-react";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface AccountType {
  id: string;
  name: string;
  description?: string;
}

interface Account {
  id: string;
  accountNumber?: string;
  userId: string;
  user?: User;
  accountType: AccountType;
  accountStatus: string;
  totalBalance: number;
  employeeBalance?: number;
  employerBalance?: number;
  earningsBalance?: number;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminAccountsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{firstName?: string; lastName?: string} | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);

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
          
          const uniqueTypesMap = new Map<string, AccountType>();
          response.accounts.forEach((acc: Account) => {
            if (acc.accountType && acc.accountType.id) {
              uniqueTypesMap.set(acc.accountType.id, acc.accountType);
            }
          });
          const types: AccountType[] = Array.from(uniqueTypesMap.values());
          setAccountTypes(types);
          
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
        const accountType = account.accountType?.name?.toLowerCase() || '';
        const accountNumber = account.accountNumber?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        return userName.includes(query) || 
               email.includes(query) || 
               accountType.includes(query) ||
               accountNumber.includes(query);
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(account => account.accountStatus === statusFilter);
    }

    if (accountTypeFilter !== 'all') {
      filtered = filtered.filter(account => account.accountType?.id === accountTypeFilter);
    }

    setFilteredAccounts(filtered);
  }, [searchQuery, statusFilter, accountTypeFilter, accounts]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      INACTIVE: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
      SUSPENDED: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  };

  const totalBalance = filteredAccounts.reduce((sum, acc) => sum + acc.totalBalance, 0);
  const activeAccounts = filteredAccounts.filter(acc => acc.accountStatus === 'ACTIVE').length;
  const suspendedAccounts = filteredAccounts.filter(acc => acc.accountStatus === 'SUSPENDED').length;

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setAccountTypeFilter("all");
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || accountTypeFilter !== 'all';

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Manage Pension Accounts</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">View and manage all user pension accounts</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/dashboard/admin/manage')}
            className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-700 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-semibold shadow-lg"
          >
            <Plus size={20} />
            Create Account
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2">
            <Wallet size={24} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Accounts</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{filteredAccounts.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
            {accounts.length !== filteredAccounts.length && `of ${accounts.length} total`}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Active Accounts</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{activeAccounts}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
            {((activeAccounts / filteredAccounts.length) * 100 || 0).toFixed(0)}% of total
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Suspended</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{suspendedAccounts}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Require attention</p>
        </div>

        <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2">
            <Wallet size={24} className="text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Balance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">KES {totalBalance.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Combined value</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 mb-6 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-300"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 transition-colors duration-300">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, account type, or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm focus:outline-none w-full text-gray-900 dark:text-white transition-colors duration-300"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <select
            value={accountTypeFilter}
            onChange={(e) => setAccountTypeFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            <option value="all">All Account Types</option>
            {accountTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAccounts.length}</span> of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{accounts.length}</span> accounts
            </p>
          </div>
        )}
      </div>

      {/* Accounts Table */}
      {filteredAccounts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-12 text-center transition-colors duration-300">
          <Wallet size={64} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            {hasActiveFilters ? 'No Matching Accounts' : 'No Accounts Found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
            {hasActiveFilters 
              ? 'Try adjusting your filters to see more results'
              : 'Create your first account to get started'
            }
          </p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-gray-600 dark:bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-600 transition font-semibold"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => router.push('/dashboard/admin/manage')}
              className="inline-flex items-center gap-2 bg-indigo-600 dark:bg-indigo-700 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-semibold"
            >
              <Plus size={20} />
              Create First Account
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <tr>
                  {[
                    "Account #",
                    "User", 
                    "Account Type", 
                    "Status", 
                    "Balance", 
                    "Created", 
                    "Actions"
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
                        {account.accountNumber || account.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                          {account.user?.firstName || ''} {account.user?.lastName || ''}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">{account.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                          {account.accountType?.name || 'N/A'}
                        </p>
                        {account.accountType?.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs transition-colors duration-300">
                            {account.accountType.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${getStatusColor(account.accountStatus)}`}>
                        {account.accountStatus}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300">
                          KES {account.totalBalance.toLocaleString()}
                        </p>
                        {(account.employeeBalance !== undefined || 
                          account.employerBalance !== undefined || 
                          account.earningsBalance !== undefined) && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            E: {account.employeeBalance?.toLocaleString() || 0} | 
                            ER: {account.employerBalance?.toLocaleString() || 0} | 
                            I: {account.earningsBalance?.toLocaleString() || 0}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      <div>
                        <p>{new Date(account.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          {new Date(account.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/admin/accounts/${account.id}/view`)}
                          className="flex items-center gap-1 text-sm bg-blue-600 dark:bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition font-medium"
                          title="View account details"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/admin/accounts/${account.id}`)}
                          className="flex items-center gap-1 text-sm bg-indigo-600 dark:bg-indigo-700 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-medium"
                          title="Manage account"
                        >
                          <Settings size={16} />
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Showing{" "}
                <span className="font-semibold">{filteredAccounts.length}</span>
                {" "}account{filteredAccounts.length !== 1 ? 's' : ''}
                {accounts.length !== filteredAccounts.length && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {" "}(filtered from {accounts.length} total)
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Total Value:{" "}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  KES {totalBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}