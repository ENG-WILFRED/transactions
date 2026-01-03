"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TransactionHistory from "@/app/components/dashboard/TransactionHistory";
import QuickActions from "@/app/components/dashboard/QuickActions";
import { 
  Users, TrendingUp, AlertCircle, CheckCircle, Clock, 
  Wallet, RefreshCw, FileText
} from "lucide-react";
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
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  createdAt: string;
  role?: string;
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
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [user, setUser] = useState<{ firstName?: string; lastName?: string; email?: string; role?: string } | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactions, setShowTransactions] = useState(false);
  
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalAssets: 548000000,
    activeLoans: 412,
    monthlyRevenue: 2850000,
    defaultRate: 0.8,
  });

  const [systemMetrics, setSystemMetrics] = useState({
    apiUptime: 99.8,
    activeConnections: 847,
    dailyTransactions: 1245,
    avgResponseTime: 145,
  });

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await userApi.getAll();
      if (response.success && response.users) {
        setMembers(response.users);
        setStats(prev => ({
          ...prev,
          totalUsers: response.users.length,
          activeUsers: response.users.filter((u: any) => u.role === 'customer').length,
        }));
        toast.success(`📊 Loaded ${response.users.length} users`);
      } else {
        console.warn('Failed to load users:', response.error);
        toast.warning('⚠️ Could not load users from API');
      }
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

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

        await loadUsers();

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
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Admin'}! 👋</h1>
        <p className="text-indigo-100 mt-2">Monitor system performance, manage users, and oversee platform operations.</p>
      </div>

      {/* ADMIN STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-600">Total Users</h4>
            <Users size={20} className="sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2">↑ {stats.activeUsers} customers</p>
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

      {/* QUICK ACTIONS */}
      <QuickActions userType="admin" />

      {/* MEMBERS LIST */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-white/60 flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={20} className="sm:w-6 sm:h-6 text-indigo-600" />
            User Management ({members.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={loadUsers}
              disabled={loadingUsers}
              className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw size={16} className={loadingUsers ? 'animate-spin' : ''} />
              {loadingUsers ? 'Refreshing...' : 'Refresh Users'}
            </button>
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
                  View Transactions
                </>
              )}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-4 text-gray-600">Loading users...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">No users found</p>
              <p className="text-gray-500 text-sm">Users will appear here once registered</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/50 backdrop-blur-sm">
                <tr>
                  {["Name", "Email", "Phone", "Join Date", "Role", "Action"].map((h) => (
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
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                      {member.firstName || member.lastName ? `${member.firstName || ''} ${member.lastName || ''}`.trim() : 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{member.email}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 hidden lg:table-cell">
                      {member.phone || 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.role || 'customer'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <button 
                        onClick={() => router.push(`/dashboard/admin/manage/${member.id}`)}
                        className="text-xs bg-indigo-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-indigo-700 whitespace-nowrap"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
    </div>
  );
}