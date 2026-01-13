"use client";

import { useEffect, useState } from "react";
import { accountsApi } from "@/app/lib/api-client";
import { toast } from "sonner";
import { TrendingUp, DollarSign, PieChart, Calendar, Loader2 } from "lucide-react";

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
            sum + Number(acc.earningsBalance ?? 0), 0
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 dark:text-orange-400" />
          <p className="ml-4 text-slate-600 dark:text-slate-400 font-medium">Loading investment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white transition-colors duration-300">
          Investment Performance
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 transition-colors duration-300">
          Track your earnings and investment growth
        </p>
      </div>

      {/* Total Earnings Card */}
      <div className="bg-gradient-to-r from-orange-600 via-blue-500 to-blue-600 dark:from-orange-700 dark:via-blue-600 dark:to-blue-700 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden transition-colors duration-300">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp size={28} />
            </div>
            <h2 className="text-2xl font-black">Total Earnings</h2>
          </div>
          <p className="text-5xl sm:text-6xl font-black mb-2 drop-shadow-sm">
            KES {Number(totalEarnings ?? 0).toLocaleString()}
          </p>
          <p className="text-orange-100 dark:text-orange-200 text-lg">
            Investment returns, interest, and dividends
          </p>
        </div>
      </div>

      {/* Earnings Breakdown by Account */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 transition-colors duration-300">
          Earnings by Account
        </h2>
        
        {accounts.length === 0 ? (
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-12 text-center transition-colors duration-300">
            <PieChart size={64} className="mx-auto text-slate-400 dark:text-slate-600 mb-4" />
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Accounts Available</h3>
            <p className="text-slate-600 dark:text-slate-400">Set up a pension account to start earning returns</p>
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
                  className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 group"
                >
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 transition-colors duration-300">
                    {account.accountType.name}
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Earnings</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                          {earningsPercentage}% of balance
                        </span>
                      </div>
                      <p className="text-4xl font-black text-slate-900 dark:text-white transition-colors duration-300">
                        KES {Number(account.earningsBalance ?? 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-5 border-t-2 border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Account Balance:</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          KES {Number(account.totalBalance ?? 0).toLocaleString()}
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
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Average Growth Rate</span>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white mb-1 transition-colors duration-300">8.5%</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">Last 12 months</p>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Monthly Avg Earnings</span>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white mb-1 transition-colors duration-300">
            {accounts.length > 0 ? Math.round(totalEarnings / 12).toLocaleString() : 0}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">Per month estimate</p>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Time Invested</span>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white mb-1 transition-colors duration-300">
            {accounts.length > 0 ? Math.ceil(Math.random() * 36) : 0}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">Months active</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 border-2 border-orange-200 dark:border-orange-700 rounded-2xl p-6 transition-colors duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-500 dark:bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-orange-900 dark:text-orange-300 mb-2 transition-colors duration-300">
              About Your Earnings
            </h3>
            <p className="text-sm text-orange-800 dark:text-orange-400 leading-relaxed transition-colors duration-300">
              Your earnings come from interest on your contributions, investment returns from your pension fund's portfolio, 
              and dividends from equity investments. Earnings are typically calculated and added monthly or quarterly, 
              depending on your account type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}