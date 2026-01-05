///home/hp/JERE/AutoNest/app/components/AuthForm.tsx
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  isLogin?: boolean;
}

export default function AuthForm({ isLogin = false }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    
    // Registration fields
    phone: '',
    pin: '',
    firstName: '',
    lastName: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankBranchName: '',
    bankBranchCode: '',
  });

  const [paymentPending, setPaymentPending] = useState<{
    transactionId?: string;
    checkoutRequestId?: string;
    statusCheckUrl?: string;
  } | null>(null);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<number | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await authApi.login({
          identifier: formData.email,
          password: formData.password,
        });

        if (!result.success) {
          toast.error(result.error || 'Invalid credentials');
          setLoading(false);
          return;
        }

        try { localStorage.setItem('auth_identifier', formData.email); } catch {}
        toast.success(result.message || 'OTP sent to your email');
        router.push(`/verify-otp?identifier=${encodeURIComponent(formData.email)}`);
      } else {
        // Validate PIN is 4 digits
        if (!/^\d{4}$/.test(formData.pin)) {
          toast.error('PIN must be exactly 4 digits');
          setLoading(false);
          return;
        }

        // Validate phone number format (Kenyan)
        if (!/^\+?254\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
          toast.error('Phone must be in format +254XXXXXXXXX');
          setLoading(false);
          return;
        }

        const result = await authApi.register({
          email: formData.email,
          phone: formData.phone,
          pin: formData.pin,
          bankName: formData.bankName,
          bankAccountName: formData.bankAccountName,
          bankAccountNumber: formData.bankAccountNumber,
          bankBranchName: formData.bankBranchName,
          bankBranchCode: formData.bankBranchCode,
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined,
        });

        if (!result.success) {
          toast.error(result.error || 'Registration failed');
          setLoading(false);
          return;
        }

        const { checkoutRequestId, statusCheckUrl, transactionId, message, status } = result as any;

        if (status === 'payment_initiated' || checkoutRequestId) {
          toast.success(message || 'Payment initiated. Check your phone for the M-Pesa prompt.');
          setPaymentPending({ transactionId, checkoutRequestId, statusCheckUrl });
          setLoading(false);
          setPolling(true);
          return;
        }

        toast.success('✅ Account created successfully. You can now sign in.');
        setTimeout(() => router.push('/login'), 1200);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
      setLoading(false);
    }
  };

  // Polling effect for registration status
  useEffect(() => {
    if (!paymentPending?.transactionId || !polling) return;

    let attempts = 0;
    const maxAttempts = 120;

    const poll = async () => {
      attempts++;
      try {
        const res = await authApi.getRegisterStatus(paymentPending.transactionId as string);
        if (!res.success) {
          if ((res as any).status === 'payment_failed') {
            toast.error((res as any).error || 'Payment failed. Please try again.');
            setPolling(false);
            setLoading(false);
            return;
          }
          console.warn('Status check returned non-success', res);
        } else {
          const s = (res as any).status;
          if (s === 'payment_pending') {
            if (attempts === 1) toast('Waiting for payment confirmation...');
          }

          if (s === 'registration_completed') {
            const token = (res as any).token;
            if (token && typeof window !== 'undefined') {
              localStorage.setItem('auth_token', token);
            }
            toast.success('Registration completed — you are now signed in');
            setPolling(false);
            setLoading(false);
            router.push('/dashboard');
            return;
          }

          if (s === 'payment_failed') {
            toast.error((res as any).error || 'Payment failed. Please try again.');
            setPolling(false);
            setLoading(false);
            return;
          }
        }

        if (attempts >= maxAttempts) {
          toast.error('Registration timeout. Please try again.');
          setPolling(false);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    };

    poll();
    pollRef.current = window.setInterval(poll, 2000) as unknown as number;

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [paymentPending?.transactionId, polling, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Sign in to access your dashboard' : 'Register for AutoNest Pension'}
          </p>
        </div>

        {paymentPending ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment Pending</h3>
              <p className="text-sm text-blue-800 mb-3">
                Check your phone for the M-Pesa payment prompt
              </p>

              {paymentPending.checkoutRequestId && (
                <div className="text-xs text-blue-700 mb-2">
                  <span className="font-medium">Checkout Request:</span>
                  <span className="font-mono ml-2 block mt-1">{paymentPending.checkoutRequestId}</span>
                </div>
              )}

              <div className="text-xs text-blue-700">
                <span className="font-medium">Transaction ID:</span>
                <span className="font-mono ml-2 block mt-1">{paymentPending.transactionId}</span>
              </div>
            </div>

            <div className="flex items-center justify-center py-4">
              <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Waiting for payment...</span>
            </div>

            <button
              onClick={() => {
                setPolling(false);
                setPaymentPending(null);
              }}
              type="button"
              className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <p className="text-xs text-gray-500 text-center">
              If you completed payment, wait a few seconds for confirmation
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field (Both Login & Register) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {isLogin ? 'Email, Username, or Phone' : 'Email Address'}
              </label>
              <input
                id="email"
                name="email"
                type={isLogin ? 'text' : 'email'}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder={isLogin ? 'your@email.com or username' : 'your@email.com'}
              />
            </div>

            {isLogin ? (
              /* Login Fields */
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            ) : (
              /* Registration Fields */
              <>
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Phone & PIN */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone (M-Pesa) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="+254712345678"
                    />
                  </div>

                  <div>
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                      4-Digit PIN <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="pin"
                      name="pin"
                      type="password"
                      maxLength={4}
                      value={formData.pin}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="1234"
                    />
                  </div>
                </div>

                {/* Bank Account Details */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Bank Account Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="bankName"
                        name="bankName"
                        type="text"
                        value={formData.bankName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="e.g., Equity Bank, KCB"
                      />
                    </div>

                    <div>
                      <label htmlFor="bankAccountName" className="block text-sm font-medium text-gray-700 mb-1">
                        Account Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="bankAccountName"
                        name="bankAccountName"
                        type="text"
                        value={formData.bankAccountName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="bankAccountNumber"
                        name="bankAccountNumber"
                        type="text"
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="1234567890"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="bankBranchName" className="block text-sm font-medium text-gray-700 mb-1">
                          Branch Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="bankBranchName"
                          name="bankBranchName"
                          type="text"
                          value={formData.bankBranchName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="Nairobi"
                        />
                      </div>

                      <div>
                        <label htmlFor="bankBranchCode" className="block text-sm font-medium text-gray-700 mb-1">
                          Branch Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="bankBranchCode"
                          name="bankBranchCode"
                          type="text"
                          value={formData.bankBranchCode}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="001"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-semibold text-lg mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Register & Pay'
              )}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link
            href={isLogin ? '/register' : '/login'}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
}