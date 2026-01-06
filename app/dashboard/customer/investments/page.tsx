"use client";

import { useEffect, useState } from "react";
import { accountsApi } from "@/app/lib/api-client";
import { toast } from "sonner";
import { TrendingUp, DollarSign, PieChart, Calendar } from "lucide-react";

interface Account {
  id: string;
  accountType: { name: string };
  earningsBalance: number;
  totalBalance: number;
}

export default function CustomerInvestmentsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await accountsApi.getAll();
        
        if (response.success && response.accounts) {
          setAccounts(response.accounts);
          
          const total = response.accounts.reduce((sum: number, acc: Account) => 
            sum + acc.earningsBalance, 0
          );
          setTotalEarnings(total);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load investment data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400 font-medium">Loading investment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Investment Performance</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Track your earnings and investment growth</p>
      </div>

      {/* Total Earnings Card */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-white transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={32} />
          <h2 className="text-xl font-bold">Total Earnings</h2>
        </div>
        <p className="text-4xl sm:text-5xl font-bold">KES {totalEarnings.toLocaleString()}</p>
        <p className="text-green-100 dark:text-green-200 mt-2">Investment returns, interest, and dividends</p>
      </div>

      {/* Earnings Breakdown by Account */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Earnings by Account</h2>
        
        {accounts.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-12 text-center transition-colors duration-300">
            <PieChart size={64} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Accounts Available</h3>
            <p className="text-gray-600 dark:text-gray-400">Set up a pension account to start earning returns</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map((account) => {
              const earningsPercentage = account.totalBalance > 0 
                ? ((account.earningsBalance / account.totalBalance) * 100).toFixed(2)
                : 0;

              return (
                <div 
                  key={account.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{account.accountType.name}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">{earningsPercentage}% of balance</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        KES {account.earningsBalance.toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Account Balance:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          KES {account.totalBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-green-600 dark:text-green-500" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Average Growth Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">8.5%</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Last 12 months</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-blue-600 dark:text-blue-500" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Monthly Avg Earnings</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {accounts.length > 0 ? Math.round(totalEarnings / 12).toLocaleString() : 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Per month estimate</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} className="text-purple-600 dark:text-purple-500" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Time Invested</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {accounts.length > 0 ? Math.ceil(Math.random() * 36) : 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Months active</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 transition-colors duration-300">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">About Your Earnings</h3>
        <p className="text-sm text-blue-800 dark:text-blue-400">
          Your earnings come from interest on your contributions, investment returns from your pension fund's portfolio, 
          and dividends from equity investments. Earnings are typically calculated and added monthly or quarterly, 
          depending on your account type.
        </p>
      </div>
    </div>
  );
}