'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';

interface AuthFormProps {
  isLogin?: boolean;
}

export default function AuthForm({ isLogin = false }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stkStatus, setStkStatus] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  // (MPESA flows removed) registration now completes immediately.

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setStkStatus('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await authApi.login({
          email: formData.email,
          password: formData.password,
        });
        if (!result.success) {
          setError(result.error || 'An error occurred');
          setLoading(false);
          return;
        }
        // Login successful - store token and redirect
        localStorage.setItem('auth_token', result.token);
        router.push('/dashboard');
      } else {
        result = await authApi.register(formData);
        if (!result.success) {
          setError(result.error || 'An error occurred');
          setLoading(false);
          return;
        }

        // If gateway URL was returned, ask user to complete external 1 KES payment
        if (result.paymentUrl) {
          setStkStatus('🔗 Registration pending - please complete the 1 KES payment via the external gateway.');
          setPaymentUrl(result.paymentUrl);
          setLoading(false);
          return;
        }

        // If no gateway configured but registration was created, show message and wait
        if (result.transactionId && !result.paymentUrl) {
          setStkStatus(result.message || 'Registration created. Awaiting external payment.');
          setLoading(false);
          return;
        }

        // Default: registration created and completed inline
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
      setLoading(false);
    }
  };

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

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {stkStatus && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {stkStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>

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
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link
            href={isLogin ? '/register' : '/login'}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
        {paymentUrl && (
          <div className="mt-4 text-center">
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Open Payment Gateway to pay 1 KES
            </a>
            <p className="text-xs text-gray-500 mt-2">After payment completes, return here to sign in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
