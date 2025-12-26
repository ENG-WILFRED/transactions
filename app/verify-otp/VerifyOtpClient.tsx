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
        newPassword: newPassword || undefined,
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
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
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

      const res = await authApi.sendOtp({ identifier: id });

      if (!res.success) {
        toast.error(res.error || 'Failed to send OTP');
        setResendLoading(false);
        return;
      }

      toast.success('📧 New OTP sent to your email');
      setOtp(Array(6).fill(''));
      setTimer(60);
      
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error('⚠️ An unexpected error occurred');
      console.error(err);
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!identifier) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('auth_identifier') : null;
      if (stored) setIdentifier(stored);
    }
  }, [identifier]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <span className="text-lg">✉️</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
          <p className="text-center text-gray-600">
            Enter the 6-digit code sent to <br />
            <span className="font-semibold text-gray-900">{identifier}</span>
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-medium text-gray-700 mb-3">
            One-Time Password
          </label>
          <OtpInput value={otp} onChange={setOtp} isLoading={loading} />
        </div>

        {/* Password Setting Section (First-time Users) */}
        {requireNewPassword && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-4">
              🔐 Set Your Permanent Password
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  disabled={loading}
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-600 font-medium">{passwordError}</p>
              )}
              <p className="text-xs text-gray-600">
                Password must be at least 6 characters
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleVerifyOtp}
          disabled={loading || otpValue.length !== 6 || (requireNewPassword && !newPassword)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {requireNewPassword ? 'Setting Password...' : 'Verifying...'}
            </>
          ) : (
            requireNewPassword ? 'Complete Login' : 'Verify OTP'
          )}
        </button>

        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
          <button
            onClick={handleResendOtp}
            disabled={resendLoading || timer > 0}
            className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2 mx-auto"
          >
            {resendLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : timer > 0 ? (
              <>
                ⏱️ Resend in {timer}s
              </>
            ) : (
              '📧 Resend OTP'
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          OTP expires after 10 minutes
        </p>
      </div>
    </div>
  );
}
