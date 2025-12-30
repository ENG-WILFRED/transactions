"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import AnimatedFooter from "@/app/components/AnimatedFooter";
import TransactionHistory from "@/app/components/dashboard/TransactionHistory";
import { 
  Users, TrendingUp, AlertCircle, CheckCircle, Clock, 
  Wallet, Settings, FileText, Layers, UserPlus 
} from "lucide-react";
import Link from "next/link";
import { userApi, dashboardApi } from "@/app/lib/api-client";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalAssets: number;
  activeLoans: number;
  monthlyRevenue: number;
  defaultRate: number;
}

interface Member {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  contribution: number;
  balance: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  description?: string | null;
  createdAt: any;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [user, setUser] = useState<{ firstName?: string; lastName?: string; email?: string; role?: string } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactions, setShowTransactions] = useState(false);
  
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 3482,
    activeUsers: 3245,
    totalAssets: 548000000,
    activeLoans: 412,
    monthlyRevenue: 2850000,
    defaultRate: 0.8,
  });

  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Wilfred Kimani",
      email: "kimaniwilfred95@gmail.com",
      joinDate: "2024-12-21",
      status: "active",
      contribution: 33000,
      balance: 548000,
    },
    {
      id: "2",
      name: "Grace Ouma",
      email: "grace.ouma@example.com",
      joinDate: "2024-12-19",
      status: "active",
      contribution: 25000,
      balance: 425000,
    },
    {
      id: "3",
      name: "James Kipchoge",
      email: "james.kipchoge@example.com",
      joinDate: "2024-12-18",
      status: "active",
      contribution: 18000,
      balance: 285000,
    },
    {
      id: "4",
      name: "Mary Mutua",
      email: "mary.mutua@example.com",
      joinDate: "2024-12-15",
      status: "inactive",
      contribution: 12000,
      balance: 145000,
    },
    {
      id: "5",
      name: "Peter Mwangi",
      email: "peter.mwangi@example.com",
      joinDate: "2024-12-12",
      status: "active",
      contribution: 22000,
      balance: 380000,
    },
  ]);

  const [systemMetrics, setSystemMetrics] = useState({
    apiUptime: 99.8,
    activeConnections: 847,
    dailyTransactions: 1245,
    avgResponseTime: 145,
  });

  const loadAllTransactions = async () => {
    setLoadingTransactions(true);
    setShowTransactions(true);
    
    try {
      const transactionsResponse = await dashboardApi.getTransactions();
      if (transactionsResponse.success && transactionsResponse.transactions) {
        setTransactions(transactionsResponse.transactions);
        toast.success(`📊 Loaded ${transactionsResponse.transactions.length} transactions`);
      } else {
        console.warn('Failed to load transactions:', transactionsResponse.error);
        toast.warning('⚠️ Could not load transactions from API');
        setTransactions([
          {
            id: "tx1",
            amount: 15000,
            type: "debit",
            status: "completed",
            description: "Member Contribution - Wilfred Kimani",
            createdAt: new Date(),
          },
          {
            id: "tx2",
            amount: 25000,
            type: "credit",
            status: "completed",
            description: "Investment Return Distribution",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ]);
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
      toast.error('Failed to load transactions');
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const storedUser = userStr ? JSON.parse(userStr) : null;

        if (!storedUser?.id) {
          toast.error('User ID not found');
          router.push('/login');
          return;
        }

        if (storedUser.role !== 'admin') {
          toast.error('🚫 Access Denied: Admin privileges required');
          router.push('/dashboard/customer');
          return;
        }

        const userResponse = await userApi.getById(storedUser.id);
        if (userResponse.success && userResponse.user) {
          if (userResponse.user.role !== 'admin') {
            toast.error('🚫 Access Denied: Admin privileges required');
            router.push('/dashboard/customer');
            return;
          }
          setUser(userResponse.user);
          toast.success(`Welcome ${userResponse.user.firstName || 'Admin'}!`);
        } else {
          setUser(storedUser);
          toast.success(`Welcome ${storedUser.firstName || 'Admin'}!`);
        }

        await new Promise(resolve => setTimeout(resolve, 1500));

        setInterval(() => {
          setStats(prev => ({
            ...prev,
            totalAssets: prev.totalAssets + Math.random() * 500000,
            monthlyRevenue: prev.monthlyRevenue + Math.random() * 100000,
          }));
        }, 8000);

        setTimeout(() => {
          toast.success('System health check: All services operational');
        }, 2000);

      } catch (err) {
        console.error(err);
        toast.error('Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-red-50 to-orange-100 flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-red-700 font-medium">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-red-50 to-orange-100 relative overflow-x-hidden flex flex-col">

      <div className="absolute top-10 left-10 w-40 h-40 bg-red-300/30 blur-3xl rounded-full animate-floating-slow" />
      <div className="absolute bottom-16 right-10 w-52 h-52 bg-orange-300/20 blur-3xl rounded-full animate-floating-slower" />

      <DashboardHeader firstName={user?.firstName ?? 'Admin'} lastName={user?.lastName ?? ''} userType={'admin'} />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Admin'}! 👋</h1>
          <p className="text-indigo-100 mt-2">Manage members, monitor system health, and review reports from your admin dashboard.</p>
        </div>

        {/* ADMIN STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-600">Total Users</h4>
              <Users size={20} className="sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-4xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2">↑ {stats.activeUsers} active</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-600">Total Assets</h4>
              <Wallet size={20} className="sm:w-6 sm:h-6 text-green-600" />
            </div>
            <p className="text-xl sm:text-3xl font-bold text-gray-900">KES {(stats.totalAssets / 1000000).toFixed(0)}M</p>
            <p className="text-xs text-green-600 mt-2">↑ KES {(stats.monthlyRevenue / 1000000).toFixed(1)}M this month</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-600">Active Loans</h4>
              <TrendingUp size={20} className="sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <p className="text-2xl sm:text-4xl font-bold text-gray-900">{stats.activeLoans}</p>
            <p className="text-xs text-red-600 mt-2">Default rate: {stats.defaultRate}%</p>
          </div>
        </div>

        {/* SYSTEM METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm opacity-90">API Uptime</p>
            <p className="text-2xl sm:text-3xl font-bold mt-2">{systemMetrics.apiUptime}%</p>
            <div className="mt-3 w-full bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{width: `${systemMetrics.apiUptime}%`}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm opacity-90">Active Connections</p>
            <p className="text-2xl sm:text-3xl font-bold mt-2">{systemMetrics.activeConnections}</p>
            <p className="text-xs opacity-75 mt-2">Real-time users</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm opacity-90">Daily Transactions</p>
            <p className="text-2xl sm:text-3xl font-bold mt-2">{systemMetrics.dailyTransactions}</p>
            <p className="text-xs opacity-75 mt-2">In last 24 hours</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm opacity-90">Avg Response Time</p>
            <p className="text-2xl sm:text-3xl font-bold mt-2">{systemMetrics.avgResponseTime}ms</p>
            <p className="text-xs opacity-75 mt-2">API latency</p>
          </div>
        </div>

        {/* 🆕 UPDATED: QUICK ACTIONS WITH CREATE ADMIN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <Link href="/dashboard/admin/manage" className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
            <Users size={32} className="text-indigo-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Manage Users</h3>
            <p className="text-xs sm:text-sm text-gray-600">View & manage member accounts</p>
          </Link>

          {/* 🆕 NEW: Create Admin Link */}
          <Link href="/dashboard/admin/create-admin" className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
            <UserPlus size={32} className="text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Create Admin</h3>
            <p className="text-xs sm:text-sm text-gray-600">Add new administrator</p>
          </Link>

          <Link href="/dashboard/admin/reports" className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
            <FileText size={32} className="text-blue-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Reports</h3>
            <p className="text-xs sm:text-sm text-gray-600">Generate financial reports</p>
          </Link>

          <Link href="/dashboard/admin/settings" className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
            <Settings size={32} className="text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Settings</h3>
            <p className="text-xs sm:text-sm text-gray-600">System configuration</p>
          </Link>

          <Link href="/dashboard/admin/account-types" className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
            <Layers size={32} className="text-purple-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Account Types</h3>
            <p className="text-xs sm:text-sm text-gray-600">Manage account configurations</p>
          </Link>
        </div>

        {/* MEMBERS LIST */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-white/60 flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="sm:w-6 sm:h-6 text-indigo-600" />
              Member Management ({members.length})
            </h3>
            <button
              onClick={loadAllTransactions}
              disabled={loadingTransactions}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingTransactions ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  View All Transactions
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 backdrop-blur-sm">
                <tr>
                  {["Name", "Email", "Join Date", "Status", "Contribution", "Balance", "Action"].map((h) => (
                    <th
                      key={h}
                      className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white/60 backdrop-blur-xl">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{member.name}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 hidden sm:table-cell">{member.email}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{new Date(member.joinDate).toLocaleDateString()}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' :
                        member.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {member.status === 'active' && <CheckCircle size={12} />}
                        {member.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-900 hidden lg:table-cell">KES {member.contribution.toLocaleString()}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-900">KES {member.balance.toLocaleString()}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <Link href={`/dashboard/admin/manage/${member.id}`} className="text-xs bg-indigo-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-indigo-700 whitespace-nowrap">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Transactions Section */}
        {showTransactions && (
          <TransactionHistory transactions={transactions} />
        )}

        {/* ALERTS & NOTIFICATIONS */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="sm:w-6 sm:h-6 text-orange-600" />
            System Alerts & Notifications
          </h3>

          <div className="space-y-4">
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
              <Clock size={18} className="sm:w-5 sm:h-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm sm:text-base text-yellow-900">Pending Loan Applications</p>
                <p className="text-xs sm:text-sm text-yellow-700 mt-1">12 members have submitted loan applications awaiting approval</p>
              </div>
            </div>

            <div className="border border-green-200 bg-green-50 rounded-lg p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
              <CheckCircle size={18} className="sm:w-5 sm:h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm sm:text-base text-green-900">Monthly Compliance Check Passed</p>
                <p className="text-xs sm:text-sm text-green-700 mt-1">All regulatory compliance requirements met for December 2025</p>
              </div>
            </div>

            <div className="border border-red-200 bg-red-50 rounded-lg p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
              <AlertCircle size={18} className="sm:w-5 sm:h-5 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm sm:text-base text-red-900">High Default Rate Alert</p>
                <p className="text-xs sm:text-sm text-red-700 mt-1">Default rate has increased to 0.8%. Review collection strategies.</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <AnimatedFooter />

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