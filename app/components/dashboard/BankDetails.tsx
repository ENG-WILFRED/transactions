import { CreditCard, AlertCircle, Loader2, Edit } from 'lucide-react';
import Link from 'next/link';

interface BankAccount {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branchCode?: string;
  branchName?: string;
}

interface BankDetailsProps {
  bankAccount?: BankAccount;
  loading?: boolean;
  onEdit?: () => void;
}

export default function BankDetailsComponent({ bankAccount, loading = false, onEdit }: BankDetailsProps) {
  // Show loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
          <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400" />
          Bank Account
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    );
  }

  // Show message if no bank account details
  if (!bankAccount || !bankAccount.bankName) {
    return (
      <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
          <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400" />
          Bank Account
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 dark:text-amber-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No bank account details found</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            Please add your bank information to receive payments
          </p>
          <Link 
            href="/settings/bank-details"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium inline-flex items-center gap-2"
          >
            <CreditCard size={16} />
            Add Bank Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
          <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400" />
          Bank Account
        </h3>
        {onEdit ? (
          <button
            onClick={onEdit}
            className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
            title="Edit bank details"
          >
            <Edit size={18} />
          </button>
        ) : (
          <Link
            href="/settings/bank-details"
            className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
            title="Edit bank details"
          >
            <Edit size={18} />
          </Link>
        )}
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Bank:</span>
          <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            {bankAccount.bankName}
          </span>
        </div>
        
        {bankAccount.accountName && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Account Name:</span>
            <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              {bankAccount.accountName}
            </span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Account Number:</span>
          <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            ****{bankAccount.accountNumber?.slice(-4) || '****'}
          </span>
        </div>
        
        {bankAccount.branchName && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Branch:</span>
            <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              {bankAccount.branchName}
            </span>
          </div>
        )}
        
        {bankAccount.branchCode && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Branch Code:</span>
            <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              {bankAccount.branchCode}
            </span>
          </div>
        )}
        
        <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 transition-colors duration-300">
          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Status:</span>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded text-xs font-semibold transition-colors duration-300">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}