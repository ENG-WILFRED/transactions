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
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
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

        toast.success('OTP sent to your email');
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        const result = await authApi.register(formData);
        if (!result.success) {
          toast.error(result.error || 'Registration failed');
          setLoading(false);
          return;
        }

        // Backend-driven M-Pesa flow: expect checkoutRequestId + statusCheckUrl + transactionId
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
    const maxAttempts = 120; // ~4 minutes at 2s interval

    const poll = async () => {
      attempts++;
      try {
        const res = await authApi.getRegisterStatus(paymentPending.transactionId as string);
        if (!res.success) {
          // backend may return success=false with payment_failed
          if ((res as any).status === 'payment_failed') {
            toast.error((res as any).error || 'Payment failed. Please try again.');
            setPolling(false);
            setLoading(false);
            return;
          }
          // other non-fatal errors keep polling
          console.warn('Status check returned non-success', res);
        } else {
          const s = (res as any).status;
          if (s === 'payment_pending') {
            // still waiting — show an info toast once
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

    // start immediate poll then interval
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </h2>

        {paymentPending ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Payment Pending</h3>
            <p className="text-sm text-gray-700">
              Your registration is pending payment.
            </p>

            {paymentPending.checkoutRequestId && (
              <p className="text-sm text-gray-700">
                Checkout Request:
                <span className="font-mono ml-2">{paymentPending.checkoutRequestId}</span>
              </p>
            )}

            <p className="text-sm text-gray-700">
              Transaction ID:
              <span className="font-mono ml-2">{paymentPending.transactionId}</span>
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPolling(false);
                  setPaymentPending(null);
                }}
                type="button"
                className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-500">If you completed payment but completion fails, wait a few seconds and try again.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email or Username or phone
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              placeholder="you@example.com or username"
            />
          </div>

          {isLogin && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          )}

          {!isLogin && (
            <>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  placeholder="Doe"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  placeholder="+254712345678"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || !formData.email || (isLogin && !formData.password)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link
            href={isLogin ? '/register' : '/login'}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
}
