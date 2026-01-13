'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!identifier) {
      toast.error('Please enter your email or phone number');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const result = await authApi.login({
        identifier,
        password,
      });

      if (!result.success) {
        const errorMsg = result.error || 'Failed to initiate login';
        
        if (result.error?.includes('locked') || result.error?.includes('too many')) {
          toast.error('🔒 Account locked due to too many failed login attempts. Please try again later.');
        } else if (result.error?.includes('not found') || result.error?.includes('Invalid')) {
          toast.error('❌ User not found');
        } else {
          toast.error(errorMsg);
        }
        setLoading(false);
        return;
      }

      toast.success('📧 OTP sent! Check your email or SMS.');
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_identifier', identifier);
      }

      router.push(`/verify-otp?identifier=${encodeURIComponent(identifier)}`);
    } catch (err) {
      toast.error('⚠️ An unexpected error occurred. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
      
      {/* Geometric patterns */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-orange-400/30 rounded-full"></div>
      <div className="absolute top-40 right-32 w-3 h-3 bg-orange-500/20 rounded-full"></div>
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full"></div>
      <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-orange-300/40 rounded-full"></div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          {/* Logo Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-orange-100">
              <img
                src="/pensions.jpeg"
                alt="AutoNest Pension logo"
                className="w-12 h-12 object-cover rounded-xl shadow-md"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                AutoNest Pension
              </span>
            </div>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              Welcome Back to Your
              <span className="block text-transparent bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text">
                Financial Future
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              Secure access to your retirement planning tools and pension dashboard
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-lg">Secure Authentication</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Two-factor verification for enhanced security</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-lg">Real-time Tracking</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Monitor your retirement savings growth</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-lg">Smart Planning</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Personalized retirement strategies</p>
              </div>
            </div>
          </div>

          {/* Trust badge */}
          <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white"></div>
            </div>
            <p className="text-sm text-slate-600">
              <span className="font-bold text-slate-900">10,000+</span> users trust AutoNest with their retirement
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-slate-200/50 backdrop-blur-sm">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8 pb-6 border-b border-slate-200">
              <img src="/pensions.jpeg" alt="AutoNest Pension" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
              <span className="text-lg font-bold text-slate-900">AutoNest Pension</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-4 tracking-wide uppercase">
                <Lock className="w-3 h-3" />
                Secure Login
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 leading-tight">
                Welcome Back
              </h2>
              <p className="text-slate-600">
                Sign in to access your pension account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="identifier" className="block text-sm font-bold text-slate-700 mb-2">
                  Email, Username, or Phone
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    id="identifier"
                    type="text"
                    placeholder="you@example.com or +254712345678"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 px-6 rounded-xl hover:from-orange-700 hover:to-orange-600 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all font-bold text-base flex items-center justify-center gap-3 mt-8 shadow-lg hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-slate-600 text-center text-sm">
                New to AutoNest Pension?{' '}
                <Link 
                  href="/register" 
                  className="text-orange-600 hover:text-orange-700 font-bold underline decoration-2 underline-offset-4 decoration-orange-500/30 hover:decoration-orange-600/50 transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}