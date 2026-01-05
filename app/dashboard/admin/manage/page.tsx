///app/dashboard/admin/manage/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { userApi, accountTypeApi, accountsApi } from "@/app/lib/api-client";
import { Plus, Users, CreditCard, Loader2, Search, X } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
}

interface AccountType {
  id: string;
  name: string;
  description: string;
  interestRate?: number;
  category?: string;
}

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateAccountModal({ isOpen, onClose, onSuccess }: CreateAccountModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    userId: "",
    accountTypeId: "",
    initialBalance: "0",
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, typesRes] = await Promise.all([
        userApi.getAll(),
        accountTypeApi.getAll(),
      ]);

      if (usersRes.success && usersRes.users) {
        const customers = usersRes.users.filter((u: User) => u.role === 'customer');
        setUsers(customers);
      }

      if (typesRes.success && typesRes.accountTypes) {
        setAccountTypes(typesRes.accountTypes);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !formData.accountTypeId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/accounts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          userId: formData.userId,
          accountTypeId: formData.accountTypeId,
          initialBalance: parseFloat(formData.initialBalance) || 0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Account created successfully!');
        onClose();
        setFormData({ userId: "", accountTypeId: "", initialBalance: "0" });
        onSuccess();
      } else {
        toast.error(data.error || 'Failed to create account');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
            <CreditCard className="text-indigo-600 dark:text-indigo-400" size={28} />
            Create Pension Account
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            <p className="ml-3 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Select Customer *
              </label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                />
              </div>
              <select
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                required
                size={5}
              >
                <option value="">-- Select a customer --</option>
                {filteredUsers.length === 0 ? (
                  <option disabled>No customers found</option>
                ) : (
                  filteredUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} - {user.email}
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                {users.length} customer{users.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {/* Account Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Account Type *
              </label>
              <select
                value={formData.accountTypeId}
                onChange={(e) => setFormData({ ...formData, accountTypeId: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                required
              >
                <option value="">-- Select account type --</option>
                {accountTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} - {type.description}
                    {type.interestRate && ` (${type.interestRate}% interest)`}
                  </option>
                ))}
              </select>
              {accountTypes.length === 0 && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 transition-colors duration-300">
                  No account types available. Please create account types first.
                </p>
              )}
            </div>

            {/* Initial Balance */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Initial Balance (KES) - Optional
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.initialBalance}
                onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                placeholder="0.00"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                min="0"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                Leave as 0 for new accounts
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.userId || !formData.accountTypeId}
                className="flex-1 bg-indigo-600 dark:bg-indigo-700 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminAccountManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Account Management</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">Create and manage pension accounts for customers</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center transition-colors duration-300">
              <CreditCard className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white transition-colors duration-300">Create Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Add new pension account</p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Create New Account
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center transition-colors duration-300">
              <Users className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white transition-colors duration-300">View Customers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Manage customer list</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard/admin/customers'}
            className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition font-semibold"
          >
            View All Customers
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center transition-colors duration-300">
              <CreditCard className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white transition-colors duration-300">Account Types</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Manage account types</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard/admin/account-types'}
            className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition font-semibold"
          >
            Manage Types
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600 p-6 rounded-lg mb-8 transition-colors duration-300">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2 transition-colors duration-300">How to Create Accounts</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-300 transition-colors duration-300">
          <li>Click "Create New Account" button above</li>
          <li>Select a customer from the dropdown list</li>
          <li>Choose an account type (e.g., Individual Pension, Corporate Pension)</li>
          <li>Optionally set an initial balance</li>
          <li>Click "Create Account" to finish</li>
        </ol>
        <p className="mt-4 text-sm text-blue-700 dark:text-blue-300 transition-colors duration-300">
          💡 <strong>Tip:</strong> Make sure you have account types created before creating accounts. 
          If you don't see any account types, click "Manage Types" above to create them first.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">📋 Account Types Needed</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
            Before creating accounts, ensure you have these account types set up:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
              <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Individual Pension Account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
              <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Corporate Pension Account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
              <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Retirement Savings Account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
              <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Voluntary Contribution Account</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">⚠️ Important Notes</h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300 transition-colors duration-300">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">→</span>
              <span>Each customer can have multiple accounts of different types</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">→</span>
              <span>Account numbers are auto-generated upon creation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">→</span>
              <span>Initial balance is optional and can be set to 0</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">→</span>
              <span>Customers can only be assigned pension accounts, not admins</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Create Account Modal */}
      <CreateAccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}