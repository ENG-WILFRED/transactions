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
    identifier: '',
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
    
    if (!formData.identifier || !formData.password) {
      toast.error('Please enter your email/username and password');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Verify password
      const result = await authApi.login({
        identifier: formData.identifier,
        password: formData.password,
      });

      if (!result.success) {
        const errorMsg = result.error || 'Invalid credentials';
        
        // Check for specific error codes
        if (result.error?.includes('locked') || result.error?.includes('too many')) {
          toast.error('🔒 Account locked due to too many failed login attempts. Please try again later.');
        } else if (result.error?.includes('Invalid')) {
          toast.error('❌ Invalid email, username, or password');
        } else {
          toast.error(errorMsg);
        }
        setLoading(false);
        return;
      }

      // Success: OTP has been sent
      toast.success('📧 OTP sent to your email! Check your inbox.');
      
      // Store identifier for OTP page and redirect
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_identifier', formData.identifier);
      }

      router.push(`/verify-otp?identifier=${encodeURIComponent(formData.identifier)}`);
    } catch (err) {
      toast.error('⚠️ An unexpected error occurred. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row">
      {/* Branding Panel - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 items-center justify-center p-12 min-h-screen relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <img
                src="/pensions.jpeg"
                alt="Pensions logo"
                className="w-28 h-28 object-cover rounded-2xl shadow-xl border-2 border-white/20"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg">
                ✓
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">Welcome Back</h1>
          
          {/* Subheading */}
          <p className="text-xl text-blue-100 mb-8 font-medium">Access your pension account</p>

          {/* Features List */}
          <div className="space-y-4 text-left mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-white text-lg">🔒</span>
              </div>
              <span className="text-white text-sm font-medium">Two-factor authentication</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-white text-lg">📊</span>
              </div>
              <span className="text-white text-sm font-medium">Real-time pension tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-white text-lg">🎯</span>
              </div>
              <span className="text-white text-sm font-medium">Retirement goal planning</span>
            </div>
          </div>

          {/* Footer text */}
          <p className="text-white/60 text-xs mt-12 pt-8 border-t border-white/10">
            Your financial future starts here
          </p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto flex flex-col justify-center bg-white">
          <div className="lg:hidden flex items-center justify-between gap-4 p-6 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <img src="/pensions.jpeg" alt="Pensions" className="w-8 h-8 rounded-md object-cover shadow-sm" />
            <div className="text-lg font-semibold text-gray-900">Pensions</div>
          </div>
          <Link href="/register" className="text-sm bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 px-4 py-2 rounded-lg text-indigo-600 font-semibold transition hover:bg-indigo-50">Create account</Link>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-md mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your pension account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700 mb-2">
                Email, Username, or Phone
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Use your temporary password from registration or your permanent password
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition font-semibold text-base flex items-center justify-center gap-2 mt-8 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="text-lg">→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-center mb-4">
              New to Pensions?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-bold">
                Create an account
              </Link>
            </p>
            <p className="text-gray-500 text-xs text-center">
              Don't have your password? Contact support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
