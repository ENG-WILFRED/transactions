"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OtpInput from '@/app/components/OtpInput';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

// NOTE: user and tokens are stored at login. OTP verification should not overwrite user storage.

export default function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const otpValue = otp.join('');

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // On successful OTP verification we set an auth cookie (middleware/proxy may rely on it).
      // Tokens and user should already have been stored at login.
      try {
        document.cookie = 'auth=true; path=/; max-age=86400';
      } catch (err) {
        console.warn('Failed to set auth cookie', err);
      }

      toast.success('OTP verified successfully!');
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      toast.success('OTP sent to your email (mock)');
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
      toast.error('An unexpected error occurred');
      console.error(err);
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <h2 className="text-3xl font-bold text-black mb-2 text-center">Verify OTP</h2>
        <p className="text-center text-gray-600 mb-8">
          Enter the 6-digit code sent to <br />
          <span className="font-semibold">{email}</span>
        </p>

        <div className="mb-8">
          <OtpInput value={otp} onChange={setOtp} isLoading={loading} />
        </div>

        <button
          onClick={handleVerifyOtp}
          disabled={loading || otpValue.length !== 6}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
          <button
            onClick={handleResendOtp}
            disabled={resendLoading || timer > 0}
            className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2"
          >
            {resendLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : timer > 0 ? (
              `Resend in ${timer}s`
            ) : (
              'Resend OTP'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
