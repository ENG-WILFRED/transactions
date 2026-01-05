///app/components/dashboard/BankDetails.tsx
import { CreditCard } from 'lucide-react';

interface BankDetails {
  bankName?: string;
  accountNumber?: string;
}

interface BankDetailsProps {
  bankAccount?: BankDetails;
}

export default function BankDetailsComponent({ bankAccount }: BankDetailsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
        <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400" />
        Bank Account
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Bank:</span>
          <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{bankAccount?.bankName || 'Kenya Commercial Bank'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Account Type:</span>
          <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Savings</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Account Number:</span>
          <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">****{(bankAccount?.accountNumber || '1234567890').slice(-4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Status:</span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded text-xs font-semibold transition-colors duration-300">Verified</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 transition-colors duration-300">
          <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Swift Code:</span>
          <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">KCBLKENA</span>
        </div>
      </div>
    </div>
  );
}