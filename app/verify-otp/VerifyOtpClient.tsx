"use client";

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import OtpInput from '@/app/components/OtpInput';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramIdentifier = searchParams.get('identifier');
  
  const [identifier, setIdentifier] = useState<string | null>(paramIdentifier);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  
  // Password setting (first-time users with temporary password)
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

    // If we need a new password but don't have one yet, validate and proceed
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
        
        // Check for specific error conditions
        if (errorMsg.includes('expired') || errorMsg.includes('Expired')) {
          toast.error('⏰ OTP has expired. Please request a new one.');
        } else if (errorMsg.includes('Invalid')) {
          toast.error('❌ Invalid OTP. Please check and try again.');
        } else if (errorMsg.includes('too many') || errorMsg.includes('Too many')) {
          toast.error('🔒 Too many failed attempts. Please try login again.');
        } else if (errorMsg.includes('temporary') || errorMsg.includes('Temporary')) {
          // Server is indicating we need a password
          setRequireNewPassword(true);
          toast.info('🔐 This is your first login. Please set a permanent password.');
        } else {
          toast.error(errorMsg);
        }
        setLoading(false);
        return;
      }

      // Check if first-time user who needs to set password
      if ((res as any).temporary === true && !newPassword) {
        setRequireNewPassword(true);
        toast.info('🔐 Please set your permanent password to complete login');
        setLoading(false);
        return;
      }

      // Success: OTP verified and optionally password set
      const token = (res as any).token;
      const user = (res as any).user;

      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        
        // If user object exists but is missing role, set default role
        let userToStore = user;
        if (user && !user.role) {
          userToStore = {
            ...user,
            role: 'customer', // Default role for newly logged-in users
          };
        }
        
        if (userToStore) {
          localStorage.setItem('user', JSON.stringify(userToStore));
        }
      }

      // Set auth cookie
      try {
        document.cookie = 'auth=true; path=/; max-age=86400';
      } catch (err) {
        console.warn('Failed to set auth cookie', err);
      }

      toast.success('✅ Login successful! Redirecting to dashboard...');
      
      // Clear stored identifier
      try {
        localStorage.removeItem('auth_identifier');
      } catch {}

      // Redirect to dashboard
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

      // ✅ FIXED: Use resendOtp instead of sendOtp
      const res = await authApi.resendOtp({ identifier: id });

      if (!res.success) {
        const errorMsg = res.error || 'Failed to resend OTP';
        
        // Handle specific error codes from backend
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

  // Timer countdown effect
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 border border-orange-500/10 rounded-full"></div>
      
      <div className="max-w-md w-full bg-[#1a2332] rounded-2xl shadow-2xl p-8 border border-gray-800 relative z-10">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-orange-400 hover:text-orange-300 font-semibold transition group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Verify OTP</h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Enter the 6-digit code sent to <br />
            <span className="font-bold text-orange-400">{identifier}</span>
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-300 mb-4 tracking-wide">
            One-Time Password
          </label>
          <OtpInput value={otp} onChange={setOtp} isLoading={loading} />
        </div>

        {/* Password Setting Section (First-time Users) */}
        {requireNewPassword && (
          <div className="mb-6 p-5 bg-orange-500/5 border border-orange-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-orange-400">
                Set Your Permanent Password
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2 tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter new password"
                    className="w-full pr-10 pl-4 py-3 border-2 border-gray-700 bg-[#0f1624] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-500 transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition-colors"
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
                <label className="block text-xs font-bold text-gray-300 mb-2 tracking-wide">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 border-2 border-gray-700 bg-[#0f1624] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-500 transition-all"
                  disabled={loading}
                />
              </div>

              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-red-400 font-medium">{passwordError}</p>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleVerifyOtp}
          disabled={loading || otpValue.length !== 6 || (requireNewPassword && !newPassword)}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3.5 px-4 rounded-xl hover:from-orange-700 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-bold text-base shadow-lg hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {requireNewPassword ? 'Setting Password...' : 'Verifying...'}
            </>
          ) : (
            <>
              {requireNewPassword ? 'Complete Login' : 'Verify OTP'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>

        <div className="mt-8 text-center pt-6 border-t border-gray-800">
          <p className="text-sm text-gray-400 mb-4">Didn't receive the code?</p>
          <button
            onClick={handleResendOtp}
            disabled={resendLoading || timer > 0}
            className="text-orange-400 hover:text-orange-300 font-bold disabled:text-gray-600 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2 mx-auto group"
          >
            {resendLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : timer > 0 ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resend in {timer}s
              </>
            ) : (
              <>
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Resend OTP
              </>
            )}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-500">
            OTP expires after 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
}