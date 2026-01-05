///home/hp/JERE/AutoNest/app/components/dashboard/BankDetails.tsx
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
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard size={20} className="text-indigo-600" />
        Bank Account
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Bank:</span>
          <span className="font-semibold text-gray-900">{bankAccount?.bankName || 'Kenya Commercial Bank'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Account Type:</span>
          <span className="font-semibold text-gray-900">Savings</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Account Number:</span>
          <span className="font-semibold text-gray-900">****{(bankAccount?.accountNumber || '1234567890').slice(-4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">Verified</span>
        </div>
        <div className="flex justify-between border-t pt-3 mt-3">
          <span className="text-gray-600">Swift Code:</span>
          <span className="font-semibold text-gray-900">KCBLKENA</span>
        </div>
      </div>
    </div>
  );
}
