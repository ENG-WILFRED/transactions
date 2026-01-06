"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { accountsApi } from "@/app/lib/api-client";
import { Wallet, TrendingUp, DollarSign, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface Account {
  id: string;
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
}

export default function CustomerPensionPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await accountsApi.getAll();
        
        if (response.success && response.accounts) {
          setAccounts(response.accounts);
          const total = response.accounts.reduce((sum: number, acc: Account) => sum + acc.totalBalance, 0);
          setTotalBalance(total);
          toast.success(`Loaded ${response.accounts.length} pension account(s)`);
        } else {
          console.warn('Failed to load accounts:', response.error);
          toast.warning('⚠️ Could not load accounts from API');
          setAccounts([]);
        }
      } catch (err) {
        console.error('Error loading accounts:', err);
        toast.error('Failed to load pension accounts');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      INACTIVE: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400',
      SUSPENDED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400 font-medium">Loading pension accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">My Pension Accounts</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage your pension accounts</p>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Wallet size={32} />
          <h2 className="text-xl font-bold">Total Pension Balance</h2>
        </div>
        <p className="text-4xl sm:text-5xl font-bold">KES {totalBalance.toLocaleString()}</p>
        <p className="text-indigo-100 dark:text-indigo-200 mt-2">Across {accounts.length} account(s)</p>
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-12 text-center transition-colors duration-300">
          <Wallet size={64} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Pension Accounts Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Contact your employer or administrator to set up your pension account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {accounts.map((account) => (
            <div 
              key={account.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{account.accountType.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{account.accountType.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(account.accountStatus)}`}>
                  {account.accountStatus}
                </span>
              </div>

              {/* Balance Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet size={20} className="text-blue-600 dark:text-blue-400" />
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Total Balance</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {account.totalBalance.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpCircle size={20} className="text-green-600 dark:text-green-400" />
                    <p className="text-xs font-semibold text-green-900 dark:text-green-300">Employee</p>
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {account.employeeBalance.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpCircle size={20} className="text-purple-600 dark:text-purple-400" />
                    <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">Employer</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {account.employerBalance.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-orange-600 dark:text-orange-400" />
                    <p className="text-xs font-semibold text-orange-900 dark:text-orange-300">Earnings</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {account.earningsBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Account Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {account.accountType.interestRate && (
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Interest Rate: <strong className="text-gray-900 dark:text-gray-100">{account.accountType.interestRate}%</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Opened: <strong className="text-gray-900 dark:text-gray-100">{new Date(account.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/dashboard/customer/contributions?account=${account.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-semibold"
                >
                  <ArrowUpCircle size={20} />
                  Make Contribution
                </button>
                <button
                  onClick={() => toast.info('Withdrawal feature coming soon')}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
                >
                  <ArrowDownCircle size={20} />
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}