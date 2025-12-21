'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authApi.login({
        identifier: formData.email,
        password: formData.password,
      });
console.log('Login result:', result);
      if (!result.success) {
        toast.error(result.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      toast.success('OTP sent to your email');
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
      setLoading(false);
    }
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
            <g opacity="0.3">
              <circle cx="40" cy="40" r="3" fill="#FFFFFF"/>
              <circle cx="160" cy="50" r="2" fill="#FFFFFF"/>
              <circle cx="50" cy="170" r="2.5" fill="#FFFFFF"/>
              <circle cx="170" cy="160" r="2" fill="#FFFFFF"/>
            </g>
          </svg>
          <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
          <p className="text-indigo-100 text-lg">Manage your pension with confidence</p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto flex flex-col justify-center">
        <div className="p-4 sm:p-6 lg:p-8 max-w-md mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
            <p className="text-sm text-gray-600">Access your pension account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-0.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-0.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold text-sm flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-xs text-center">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
