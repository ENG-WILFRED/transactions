"use client";

import React, { useState, useEffect } from 'react';
import { authApi } from '../../app/lib/api-client';
import { toast } from 'sonner';

export default function ResetPinPage() {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'request' | 'verify' | 'done'>('request');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u?.phone) setPhone(u.phone);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please provide your phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.requestPinReset({ phone });
      if (res.success) {
        toast.success(res.message || 'Reset code sent');
        setStep('verify');
      } else {
        toast.error(res.error || res.message || 'Failed to request PIN reset');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !otp || !newPin) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.verifyPinReset({ phone, otp, newPin });
      if (res.success) {
        toast.success(res.message || 'PIN reset successful');
        setStep('done');
      } else {
        toast.error(res.error || res.message || 'Verification failed');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Reset PIN</h2>

        {step === 'request' && (
          <form onSubmit={requestReset} className="space-y-4">
            <p className="text-sm text-gray-600">Enter the phone number associated with your account. We will send a verification code.</p>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+2547XXXXXXXX"
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </div>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={verifyReset} className="space-y-4">
            <p className="text-sm text-gray-600">Enter the verification code we sent, and choose a new 4-digit PIN.</p>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <input value={phone} readOnly className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Verification Code (OTP)</span>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">New PIN</span>
              <input
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="4-digit PIN"
                maxLength={4}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('request')}
                className="px-4 py-2 bg-gray-100 rounded-md"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify & Reset PIN'}
              </button>
            </div>
          </form>
        )}

        {step === 'done' && (
          <div className="space-y-4">
            <p className="text-green-700">Your PIN has been reset successfully. You can now log in using your new PIN.</p>
            <div className="flex justify-end">
              <a href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Go to Login</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
