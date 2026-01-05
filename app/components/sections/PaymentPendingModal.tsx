import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentPendingModalProps {
  transactionId?: string;
  onCancel: () => void;
}

export default function PaymentPendingModal({ transactionId, onCancel }: PaymentPendingModalProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const MAX_WAIT_TIME = 240; // 4 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev >= MAX_WAIT_TIME) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = Math.min((timeElapsed / MAX_WAIT_TIME) * 100, 100);
  const isTimeout = timeElapsed >= MAX_WAIT_TIME;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            {/* Status Icon */}
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isTimeout ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {isTimeout ? (
                <Clock className="w-8 h-8 text-red-600" />
              ) : (
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isTimeout ? 'Payment Timeout' : 'Waiting for Payment'}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
              {isTimeout ? (
                <>
                  The payment confirmation has timed out. If payment was deducted from your M-Pesa, 
                  please contact support with your transaction ID.
                </>
              ) : (
                <>
                  Please complete the M-Pesa prompt on your phone to finalize your registration.
                  <br />
                  <span className="text-xs text-gray-500 mt-1 block">
                    Check your phone for the M-Pesa notification
                  </span>
                </>
              )}
            </p>

            {/* Transaction ID */}
            {transactionId && (
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mb-4 border border-gray-200">
                <div className="font-semibold text-gray-700 mb-1">Transaction ID:</div>
                <div className="font-mono break-all">{transactionId}</div>
              </div>
            )}

            {/* Progress Bar */}
            {!isTimeout && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>Time elapsed: {formatTime(timeElapsed)}</span>
                  <span>Max wait: {formatTime(MAX_WAIT_TIME)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Messages */}
            {!isTimeout && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2 text-left">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </div>
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">What to do next:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Check your phone for M-Pesa prompt</li>
                      <li>• Enter your M-Pesa PIN</li>
                      <li>• Wait for confirmation</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Timeout Warning */}
            {timeElapsed > 120 && !isTimeout && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-yellow-800">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <p>Taking longer than expected. Please ensure you've completed the M-Pesa payment.</p>
                </div>
              </div>
            )}

            {/* Cancel/Back Button */}
            <button
              onClick={onCancel}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold transition ${
                isTimeout
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {isTimeout ? 'Back to Registration' : 'Cancel & Return'}
            </button>

            {/* Support Notice */}
            {isTimeout && (
              <p className="text-xs text-gray-500 mt-4">
                Need help? Contact support at{' '}
                <a href="mailto:support@pensions.com" className="text-blue-600 underline">
                  support@pensions.com
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}