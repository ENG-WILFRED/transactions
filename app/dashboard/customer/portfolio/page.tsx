"use client";

import { useEffect, useState } from "react";
import { accountsApi } from "@/app/lib/api-client";
import { toast } from "sonner";
import { PieChart, TrendingUp, Wallet, Target, AlertCircle } from "lucide-react";

interface Account {
  id: string;
  accountType: { name: string };
  totalBalance: number;
  employeeBalance: number;
  employerBalance: number;
  earningsBalance: number;
}

export default function CustomerPortfolioPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await accountsApi.getAll();
        
        if (response.success && response.accounts) {
          setAccounts(response.accounts);
          
          const total = response.accounts.reduce((sum: number, acc: Account) => 
            sum + acc.totalBalance, 0
          );
          setTotalBalance(total);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load portfolio data');
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
          <p className="ml-4 text-gray-600 dark:text-gray-400 font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  const totalEmployee = accounts.reduce((sum, acc) => sum + acc.employeeBalance, 0);
  const totalEmployer = accounts.reduce((sum, acc) => sum + acc.employerBalance, 0);
  const totalEarnings = accounts.reduce((sum, acc) => sum + acc.earningsBalance, 0);

  const employeePercent = totalBalance > 0 ? ((totalEmployee / totalBalance) * 100).toFixed(1) : 0;
  const employerPercent = totalBalance > 0 ? ((totalEmployer / totalBalance) * 100).toFixed(1) : 0;
  const earningsPercent = totalBalance > 0 ? ((totalEarnings / totalBalance) * 100).toFixed(1) : 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Portfolio Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Complete view of your pension portfolio</p>
      </div>

      {/* Total Portfolio Value */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-white transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <Wallet size={32} />
          <h2 className="text-xl font-bold">Total Portfolio Value</h2>
        </div>
        <p className="text-4xl sm:text-5xl font-bold">KES {totalBalance.toLocaleString()}</p>
        <p className="text-purple-100 dark:text-purple-200 mt-2">Across {accounts.length} pension account(s)</p>
      </div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <PieChart size={24} />
            Asset Allocation
          </h2>

          {totalBalance === 0 ? (
            <div className="text-center py-12">
              <PieChart size={64} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No portfolio data available yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Employee Contributions */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Employee Contributions</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{employeePercent}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 h-3 rounded-full transition-all"
                    style={{width: `${employeePercent}%`}}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">KES {totalEmployee.toLocaleString()}</p>
              </div>

              {/* Employer Contributions */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Employer Contributions</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{employerPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 h-3 rounded-full transition-all"
                    style={{width: `${employerPercent}%`}}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">KES {totalEmployer.toLocaleString()}</p>
              </div>

              {/* Earnings */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Investment Earnings</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{earningsPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 h-3 rounded-full transition-all"
                    style={{width: `${earningsPercent}%`}}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">KES {totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-green-600 dark:text-green-500" />
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Growth Rate</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">+12.5%</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Last 12 months</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Target size={20} className="text-indigo-600 dark:text-indigo-500" />
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Retirement Goal</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">68%</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">On track to meet target</p>
          </div>
        </div>
      </div>

      {/* Account Breakdown */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Account Breakdown</h2>
        
        {accounts.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-12 text-center transition-colors duration-300">
            <Wallet size={64} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Accounts Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Set up a pension account to start building your portfolio</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => {
              const accountPercent = totalBalance > 0 
                ? ((account.totalBalance / totalBalance) * 100).toFixed(1)
                : 0;

              return (
                <div 
                  key={account.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{account.accountType.name}</h3>
                  
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      KES {account.totalBalance.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{accountPercent}% of total portfolio</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Employee:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {account.employeeBalance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Employer:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {account.employerBalance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Earnings:</span>
                      <span className="font-semibold text-green-600 dark:text-green-500">
                        {account.earningsBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 transition-colors duration-300">
        <div className="flex items-start gap-3">
          <AlertCircle size={24} className="text-blue-600 dark:text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">Portfolio Insights</h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
              <li>✓ Your portfolio is well-balanced with a good mix of contributions and earnings</li>
              <li>✓ Investment returns are performing above the industry average of 8%</li>
              <li>✓ Consider increasing monthly contributions to reach retirement goals faster</li>
              <li>✓ Diversification across multiple account types helps reduce risk</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}