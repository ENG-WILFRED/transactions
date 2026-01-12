////home/hp/JERE/AutoNest/app/components/LoginForm.tsx
'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Mail } from 'lucide-react';

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
      // Step 1: Initiate login (sends OTP)
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

      // Success: OTP has been sent
      toast.success('📧 OTP sent! Check your email or SMS.');
      
      // Store identifier for OTP page and redirect
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
    <div className="min-h-screen w-full bg-[#0a0e1a] flex flex-col lg:flex-row">
      {/* Branding Panel - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f1624] via-[#1a2332] to-[#0a0e1a] items-center justify-center p-16 min-h-screen relative overflow-hidden">
        {/* Decorative elements - static */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        {/* Geometric decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 border border-orange-500/10 rounded-full"></div>
        <div className="absolute bottom-32 left-16 w-96 h-96 border border-orange-500/5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-orange-400/40 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-orange-300/30 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-orange-400/35 rounded-full"></div>
        
        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="mb-16">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-3xl blur-2xl"></div>
              <img
                src="/pensions.jpeg"
                alt="AutoNest Pension logo"
                className="relative w-32 h-32 object-cover rounded-2xl shadow-2xl border-2 border-orange-500/20"
              />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                ✓
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Welcome Back
          </h1>
          
          {/* Subheading */}
          <p className="text-xl text-gray-300 mb-12 font-medium leading-relaxed">
            Secure access to your AutoNest Pension account and retirement planning tools
          </p>

          {/* Divider */}
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-transparent mb-12 rounded-full"></div>

          {/* Features List */}
          <div className="space-y-5">
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/15 transition-all duration-300">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Two-factor authentication</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Enhanced security with OTP verification</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/15 transition-all duration-300">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Real-time pension tracking</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Monitor your retirement savings growth</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/15 transition-all duration-300">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Retirement goal planning</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Personalized strategies for your future</p>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm font-light">
              Your financial future starts here with AutoNest Pension
            </p>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto flex flex-col justify-center bg-[#0f1624] relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #ff6b35 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between gap-4 p-6 border-b border-gray-800 bg-[#0f1624]/90 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <img src="/pensions.jpeg" alt="AutoNest Pension" className="w-9 h-9 rounded-lg object-cover shadow-sm border border-orange-500/20" />
            <div className="text-lg font-bold text-white">AutoNest Pension</div>
          </div>
          <Link 
            href="/register" 
            className="text-sm bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-2.5 rounded-lg text-white font-semibold transition-all hover:from-orange-700 hover:to-orange-600 shadow-sm hover:shadow-md"
          >
            Create account
          </Link>
        </div>

        <div className="p-6 sm:p-8 lg:p-16 max-w-md mx-auto w-full relative z-10">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-6 tracking-wide uppercase border border-orange-500/20">
              Secure Login
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-3 leading-tight tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Sign in to your AutoNest Pension account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="identifier" className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">
                Email, Username, or Phone
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                <input
                  id="identifier"
                  type="text"
                  placeholder="you@example.com or +254712345678"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-5 py-4 rounded-xl bg-[#1a2332] border border-gray-700 text-white placeholder-gray-500 transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-5 pr-5 py-4 rounded-xl bg-[#1a2332] border border-gray-700 text-white placeholder-gray-500 transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 px-6 rounded-xl hover:from-orange-700 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all font-bold text-base flex items-center justify-center gap-3 mt-8 shadow-lg hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-center mb-5 text-base">
              New to AutoNest Pension?{' '}
              <Link href="/register" className="text-orange-400 hover:text-orange-300 font-bold underline decoration-2 underline-offset-4 decoration-orange-500/30 hover:decoration-orange-400/50 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}