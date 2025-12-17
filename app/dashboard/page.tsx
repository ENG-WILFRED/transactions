"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dashboardApi, authApi } from "@/app/lib/api-client";
import {
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  Clock,
  LogOut,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  description?: string | null;
  createdAt: any;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Verify token
        const verifyRes: any = await authApi.verify();
        if (!verifyRes.success) {
          router.push("/login");
          return;
        }

        // Get user data
        const userRes: any = await dashboardApi.getUser();
        if (!userRes.success) {
          router.push("/login");
          return;
        }

        // Get transactions
        const transRes: any = await dashboardApi.getTransactions();
        const transactions = transRes.success ? (transRes.transactions || []) : [];

        // Get stats
        const statsRes: any = await dashboardApi.getStats();
        const balance = statsRes.success ? (statsRes.balance || 0) : 0;

        setUser(userRes.user);
        setTransactions(transactions);
        setBalance(balance);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('auth_token');
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-700 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 relative overflow-hidden">

      {/* Floating shapes */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-300/30 blur-3xl rounded-full animate-floating-slow" />
      <div className="absolute bottom-16 right-10 w-52 h-52 bg-purple-300/20 blur-3xl rounded-full animate-floating-slower" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              Welcome, {user?.firstName || user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white shadow hover:bg-red-700 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* BALANCE CARD */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <p className="text-indigo-200 text-sm">Available Balance</p>
          <h2 className="text-5xl font-extrabold mt-1 drop-shadow-sm">
            KES {balance.toFixed(2)}
          </h2>

          <p className="mt-3 text-indigo-100 text-sm flex items-center gap-2">
            <Clock size={16} /> Updated just now
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid sm:grid-cols-2 gap-6">

          <Link
            href="/payment"
            className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col items-start hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <div className="p-3 rounded-xl bg-green-500 text-white mb-4 shadow">
              <CreditCard size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Pension Plans</h3>
            <p className="text-gray-600 mt-1">
              View and invest in curated pension plans.
            </p>
          </Link>

          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col items-start">
            <div className="p-3 rounded-xl bg-purple-500 text-white mb-4 shadow">
              <Wallet size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Transactions</h3>
            <p className="text-gray-600 mt-1">
              View and analyze your financial activity.
            </p>
          </div>
        </div>

        {/* TRANSACTIONS LIST */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-white/60">
            <h3 className="text-xl font-bold text-gray-900">
              Recent Transactions
            </h3>
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No transactions yet. Try making your first payment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50 backdrop-blur-sm">
                  <tr>
                    {["Date", "Description", "Type", "Amount", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white/60 backdrop-blur-xl">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {tx.description || "-"}
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            tx.type === "credit"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tx.type === "credit" ? (
                            <ArrowUpRight size={14} />
                          ) : (
                            <ArrowDownRight size={14} />
                          )}
                          {tx.type}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {tx.type === "credit" ? "+" : "-"}KES{" "}
                        {tx.amount.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ANIMATIONS */}
      <style jsx>{`
        .animate-floating-slow {
          animation: float 9s ease-in-out infinite;
        }
        .animate-floating-slower {
          animation: float 14s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-18px) scale(1.04);
          }
        }
      `}</style>
    </div>
  );
}
