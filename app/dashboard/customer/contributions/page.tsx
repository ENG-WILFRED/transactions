"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { accountsApi } from "@/app/lib/api-client";
import { CreditCard, DollarSign, Loader2, TrendingUp, X, AlertCircle } from "lucide-react";

interface Account {
  id: string;
  accountNumber?: string; 
  accountType: { name: string };
  totalBalance: number;
}

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  onSuccess: () => void;
}

function DepositModal({ isOpen, onClose, account, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !account) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!phone || !phone.match(/^\+254\d{9}$/)) {
      toast.error('Please enter a valid phone number (+254XXXXXXXXX)');
      return;
    }

    setSubmitting(true);

    try {
      const accountIdentifier = account.accountNumber || account.id;
      
      const response = await accountsApi.deposit(accountIdentifier, {
        amount: parseFloat(amount),
        phone,
        description: 'M-Pesa deposit',
      });

      if (response.success) {
        toast.success('📱 M-Pesa STK Push initiated! Check your phone.');
        onClose();
        setAmount("");
        setPhone("");
        
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        toast.error(response.error || 'Failed to initiate payment');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <DollarSign className="text-green-600 dark:text-green-500" size={24} />
            M-Pesa Deposit
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 transition-colors duration-300">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Depositing to:</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{account.accountType.name}</p>
          {account.accountNumber && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Account: {account.accountNumber}</p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Current Balance: <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              KES {account.totalBalance.toLocaleString()}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Amount (KES)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254712345678"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              required
              pattern="^\+254\d{9}$"
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Format: +254XXXXXXXXX (e.g., +254712345678)
            </p>
          </div>

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
              disabled={submitting}
              className="flex-1 bg-green-600 dark:bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign size={20} />
                  Deposit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CustomerContributionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeAmount: "",
    employerAmount: "",
    description: "",
  });

  const loadAccounts = async () => {
    try {
      const response = await accountsApi.getAll();
      
      if (response.success && response.accounts) {
        setAccounts(response.accounts);
        
        const accountParam = searchParams?.get('account');
        if (accountParam) {
          setSelectedAccountId(accountParam);
        } else if (response.accounts.length > 0) {
          setSelectedAccountId(response.accounts[0].id);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load accounts');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadAccounts();
      setLoading(false);
    };

    loadData();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccountId) {
      toast.error('Please select an account');
      return;
    }

    if (!formData.employeeAmount && !formData.employerAmount) {
      toast.error('Please enter at least one contribution amount');
      return;
    }

    setSubmitting(true);

    try {
      const response = await accountsApi.addContribution(selectedAccountId, {
        employeeAmount: parseFloat(formData.employeeAmount) || 0,
        employerAmount: parseFloat(formData.employerAmount) || 0,
        description: formData.description || 'Regular contribution',
      });

      if (response.success) {
        toast.success('✅ Contribution added successfully!');
        setFormData({ employeeAmount: "", employerAmount: "", description: "" });
        await loadAccounts();
      } else {
        toast.error(response.error || 'Failed to add contribution');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add contribution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDepositClick = () => {
    if (!selectedAccountId) {
      toast.error('Please select an account');
      return;
    }
    setDepositModalOpen(true);
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Make Contributions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Add contributions to your pension account</p>
        </div>

        {/* No Accounts Warning */}
        {accounts.length === 0 && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-6 rounded-lg transition-colors duration-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 dark:text-yellow-500 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-300 mb-2">
                  No Pension Accounts Found
                </h3>
                <p className="text-yellow-800 dark:text-yellow-400 mb-4">
                  You don't have any pension accounts yet. Please contact your administrator to create an account for you, or if you're setting up your own account, use the admin panel.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-yellow-600 dark:bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-600 transition font-semibold"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => window.location.href = 'mailto:support@autonest.com?subject=Request Pension Account'}
                    className="border border-yellow-600 dark:border-yellow-500 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition font-semibold"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contribution Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <CreditCard size={24} />
                Contribution Details
              </h2>

              {accounts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-gray-400 dark:text-gray-500" size={40} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Accounts Available</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Contact your administrator to set up your pension account.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Account Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Select Account
                    </label>
                    <select
                      value={selectedAccountId}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                      required
                    >
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.accountType.name}
                          {account.accountNumber && ` (${account.accountNumber})`}
                          {' - KES '}
                          {account.totalBalance.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Employee Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Employee Contribution (KES)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.employeeAmount}
                      onChange={(e) => setFormData({ ...formData, employeeAmount: e.target.value })}
                      placeholder="0.00"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    />
                  </div>

                  {/* Employer Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Employer Contribution (KES)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.employerAmount}
                      onChange={(e) => setFormData({ ...formData, employerAmount: e.target.value })}
                      placeholder="0.00"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., Monthly contribution for December"
                      rows={3}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    />
                  </div>

                  {/* Total */}
                  {(formData.employeeAmount || formData.employerAmount) && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4 transition-colors duration-300">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Total Contribution:</span>
                        <span className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">
                          KES {((parseFloat(formData.employeeAmount) || 0) + (parseFloat(formData.employerAmount) || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || (!formData.employeeAmount && !formData.employerAmount)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition font-semibold"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Add Contribution
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar - Quick Actions & Info */}
          <div className="space-y-6">
            {/* M-Pesa Deposit */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                M-Pesa Deposit
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Make a quick deposit using M-Pesa STK Push
              </p>
              <button
                onClick={handleDepositClick}
                disabled={!selectedAccountId || accounts.length === 0}
                className="w-full bg-green-600 dark:bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition font-semibold"
              >
                Deposit via M-Pesa
              </button>
              {accounts.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
                  Account required to deposit
                </p>
              )}
            </div>

            {/* Account Summary */}
            {selectedAccount && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl shadow-lg p-6 text-white transition-colors duration-300">
                <h3 className="text-lg font-bold mb-2">Selected Account</h3>
                <p className="text-sm opacity-90 mb-1">{selectedAccount.accountType.name}</p>
                {selectedAccount.accountNumber && (
                  <p className="text-xs opacity-75 mb-4">Account: {selectedAccount.accountNumber}</p>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} />
                  <span className="text-sm">Current Balance</span>
                </div>
                <p className="text-3xl font-bold">KES {selectedAccount.totalBalance.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        account={selectedAccount || null}
        onSuccess={loadAccounts}
      />
    </>
  );
}