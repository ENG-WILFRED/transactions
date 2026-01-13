"use client";

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import OtpInput from '@/app/components/OtpInput';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Eye, EyeOff, Mail, Lock, Shield, CheckCircle2, Clock } from 'lucide-react';

export default function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramIdentifier = searchParams.get('identifier');
  
  const [identifier, setIdentifier] = useState<string | null>(paramIdentifier);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [requireNewPassword, setRequireNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const otpValue = otp.join('');

  const validatePassword = (): boolean => {
    setPasswordError('');
    
    if (!newPassword) {
      setPasswordError('Password is required');
      return false;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error('⚠️ Please enter all 6 digits');
      return;
    }

    if (requireNewPassword && !newPassword) {
      toast.error('⚠️ Please set your permanent password');
      return;
    }

    if (requireNewPassword && !validatePassword()) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      const id = identifier || 
        (typeof window !== 'undefined' ? localStorage.getItem('auth_identifier') : null) || 
        '';

      const res = await authApi.loginOtp({
        identifier: id,
        otp: otpValue,
      });

      if (!res.success) {
        const errorMsg = res.error || 'OTP verification failed';
        
        if (errorMsg.includes('expired') || errorMsg.includes('Expired')) {
          toast.error('⏰ OTP has expired. Please request a new one.');
        } else if (errorMsg.includes('Invalid')) {
          toast.error('❌ Invalid OTP. Please check and try again.');
        } else if (errorMsg.includes('too many') || errorMsg.includes('Too many')) {
          toast.error('🔒 Too many failed attempts. Please try login again.');
        } else if (errorMsg.includes('temporary') || errorMsg.includes('Temporary')) {
          setRequireNewPassword(true);
          toast.info('🔐 This is your first login. Please set a permanent password.');
        } else {
          toast.error(errorMsg);
        }
        setLoading(false);
        return;
      }

      if ((res as any).temporary === true && !newPassword) {
        setRequireNewPassword(true);
        toast.info('🔐 Please set your permanent password to complete login');
        setLoading(false);
        return;
      }

      const token = (res as any).token;
      const user = (res as any).user;

      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        
        let userToStore = user;
        if (user && !user.role) {
          userToStore = {
            ...user,
            role: 'customer',
          };
        }
        
        if (userToStore) {
          localStorage.setItem('user', JSON.stringify(userToStore));
        }
      }

      try {
        document.cookie = 'auth=true; path=/; max-age=86400';
      } catch (err) {
        console.warn('Failed to set auth cookie', err);
      }

      toast.success('✅ Login successful! Redirecting to dashboard...');
      
      try {
        localStorage.removeItem('auth_identifier');
      } catch {}

      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      toast.error('⚠️ An unexpected error occurred. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const id = identifier ||
        (typeof window !== 'undefined' ? localStorage.getItem('auth_identifier') : null) ||
        '';

      if (!id) {
        toast.error('❌ No identifier found. Please login again.');
        setResendLoading(false);
        return;
      }

      const res = await authApi.resendOtp({ identifier: id });

      if (!res.success) {
        const errorMsg = res.error || 'Failed to resend OTP';
        
        if (errorMsg.includes('not found') || errorMsg.includes('Invalid identifier')) {
          toast.error('❌ User not found. Please check your identifier.');
        } else if (errorMsg.includes('expired') || errorMsg.includes('OTP has expired')) {
          toast.error('⏰ Previous OTP expired. A new one has been sent.');
        } else if (errorMsg.includes('No OTP found')) {
          toast.error('⚠️ No OTP found. Please log in again to get an OTP.');
        } else {
          toast.error(`❌ ${errorMsg}`);
        }
        setResendLoading(false);
        return;
      }

      toast.success('📧 New OTP sent to your email and phone!');
      setOtp(Array(6).fill(''));
      setTimer(60);
      setResendLoading(false);
    } catch (err) {
      console.error('Resend OTP error:', err);
      toast.error('⚠️ Failed to resend OTP. Please try logging in again.');
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!identifier) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('auth_identifier') : null;
      if (stored) setIdentifier(stored);
    }
  }, [identifier]);

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
            Secure Your
            <span className="block text-transparent bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text mt-2">
              Access
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl lg:text-2xl text-slate-300 mb-12 font-light leading-relaxed">
            Two-factor authentication keeps your pension account safe
          </p>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-transparent mb-12 rounded-full"></div>

          {/* Security Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 group-hover:scale-105 transition-all duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Enhanced Security</h3>
                <p className="text-slate-400 text-sm leading-relaxed">One-time password adds an extra layer of protection</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Multi-Channel Delivery</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Code sent via email and SMS for convenience</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Time-Limited Access</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Codes expire after 10 minutes for security</p>
              </div>
            </div>
          </div>

          {/* Trust badge */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-3 border-slate-900 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-3 border-slate-900 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                <span className="font-bold text-white">Bank-level</span> security protecting your account
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
          </div>

          {/* Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/50">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="mb-6 flex items-center text-slate-600 hover:text-slate-900 font-semibold transition group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-200 rounded-2xl mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-3">
                Verify OTP
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter the 6-digit code sent to
              </p>
              <p className="font-bold text-orange-600 mt-1 break-all px-4">
                {identifier}
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-4">
                One-Time Password
              </label>
              <OtpInput value={otp} onChange={setOtp} isLoading={loading} />
            </div>

            {/* Password Setting Section */}
            {requireNewPassword && (
              <div className="mb-6 p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-orange-900">
                      Set Your Permanent Password
                    </p>
                    <p className="text-xs text-orange-700">
                      First-time login setup
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-10 py-3 bg-white border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-slate-900 placeholder-slate-400 transition-all"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="Confirm password"
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-slate-900 placeholder-slate-400 transition-all"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                      <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-red-700 font-medium">{passwordError}</p>
                    </div>
                  )}
                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Password must be at least 6 characters
                  </p>
                </div>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otpValue.length !== 6 || (requireNewPassword && !newPassword)}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 px-6 rounded-xl hover:from-orange-700 hover:to-orange-600 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-bold text-base shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {requireNewPassword ? 'Setting Password...' : 'Verifying...'}
                </>
              ) : (
                <>
                  {requireNewPassword ? 'Complete Login' : 'Verify OTP'}
                  <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>

            {/* Resend Section */}
            <div className="mt-8 text-center pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-4">Didn't receive the code?</p>
              <button
                onClick={handleResendOtp}
                disabled={resendLoading || timer > 0}
                className="text-orange-600 hover:text-orange-700 font-bold disabled:text-slate-400 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2 mx-auto group"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : timer > 0 ? (
                  <>
                    <Clock className="w-4 h-4" />
                    Resend in {timer}s
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Resend OTP
                  </>
                )}
              </button>
            </div>

            {/* Info Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-800 font-medium">
                OTP expires after 10 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}