///home/hp/JERE/AutoNest/app/components/sections/PaymentPendingModal.tsx
import { Loader2 } from 'lucide-react';

interface PaymentPendingModalProps {
  transactionId?: string;
  onCancel: () => void;
}

export default function PaymentPendingModal({ transactionId, onCancel }: PaymentPendingModalProps) {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row">
      {/* Image Panel - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-8 min-h-screen">
        <div className="text-center">
          <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="80" r="50" fill="#E0E7FF" opacity="0.2"/>
            <path d="M70 100 L100 60 L130 100 M100 60 L100 140" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
            <rect x="60" y="140" width="80" height="8" rx="4" fill="#FCD34D"/>
            <path d="M50 120 Q100 110 150 120" stroke="#A78BFA" strokeWidth="2" opacity="0.5" strokeDasharray="5,5"/>
          </svg>
          <h2 className="text-3xl font-bold text-white mb-3">Secure Your Future</h2>
          <p className="text-indigo-100 text-lg">Plan your retirement with confidence</p>
        </div>
      </div>

      {/* Modal Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Pending</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your registration is pending payment. Please complete the M-Pesa prompt on your phone.
            </p>
            <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded mb-4">
              Transaction ID: <span className="font-mono">{transactionId}</span>
            </p>
            <button
              onClick={onCancel}
              className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
