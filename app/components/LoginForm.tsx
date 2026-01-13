'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, ArrowRight, Shield, TrendingUp, Users } from 'lucide-react';

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* LEFT HALF - DARK THEME */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden min-h-screen">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-20 right-20 w-64 h-64 border border-orange-500/10 rounded-full"></div>
        <div className="absolute bottom-32 left-16 w-80 h-80 border border-orange-500/5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-orange-400/40 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-orange-300/30 rounded-full"></div>

        <div className="relative z-10 max-w-xl mx-auto w-full">
          {/* Logo */}
          <div className="mb-12">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-3xl blur-2xl"></div>
              <img
                src="/pensions.jpeg"
                alt="AutoNest Pension logo"
                className="relative w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-2xl shadow-2xl border-2 border-orange-500/30"
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Welcome Back to Your
            <span className="block text-transparent bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text mt-2">
              Financial Future
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl lg:text-2xl text-slate-300 mb-12 font-light leading-relaxed">
            Secure access to your retirement planning tools and pension dashboard
          </p>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-transparent mb-12 rounded-full"></div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 group-hover:scale-105 transition-all duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Secure Authentication</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Two-factor verification with OTP for enhanced security</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Real-time Tracking</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Monitor your retirement savings growth daily</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Smart Planning</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Personalized retirement strategies for your future</p>
              </div>
            </div>
          </div>

          {/* Trust badge */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-3 border-slate-900 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">10K+</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-3 border-slate-900"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-3 border-slate-900"></div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                <span className="font-bold text-white">10,000+ users</span> trust AutoNest with their retirement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT HALF - LIGHT PLEASANT COLOR */}
      <div className="lg:w-1/2 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8 lg:p-16 flex items-center justify-center min-h-screen relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl"></div>
        
        {/* Floating dots */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-orange-400/40 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-32 right-32 w-2 h-2 bg-rose-400/40 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <img src="/pensions.jpeg" alt="AutoNest Pension" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
              <span className="text-lg font-bold text-slate-900">AutoNest Pension</span>
            </div>
            <Link 
              href="/register" 
              className="text-xs font-bold bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white transition shadow-sm"
            >
              Sign up
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/50">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-5 tracking-wide uppercase border border-orange-200">
                <Lock className="w-3.5 h-3.5" />
                Secure Login
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-3 leading-tight">
                Welcome Back
              </h2>
              <p className="text-slate-600 text-base">
                Sign in to access your pension account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="identifier" className="block text-sm font-bold text-slate-700 mb-2.5">
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
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2.5">
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
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 px-6 rounded-xl hover:from-orange-700 hover:to-orange-600 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all font-bold text-base flex items-center justify-center gap-3 mt-8 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0 group"
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
                  className="text-orange-600 hover:text-orange-700 font-bold underline decoration-2 underline-offset-4 decoration-orange-500/30 hover:decoration-orange-600/50 transition-all"
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