'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { requestPinResetSchema, verifyPinResetSchema } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { Loader2, Smartphone, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ZodError } from 'zod';

export default function ResetPinForm() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPins, setShowPins] = useState({
    new: false,
    confirm: false,
  });
  
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    newPin: '',
    confirmPin: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle phone input
    if (name === 'phone') {
      // Auto-format phone number
      let formatted = value.replace(/[^\d+]/g, '');
      if (!formatted.startsWith('+') && formatted.startsWith('254')) {
        formatted = '+' + formatted;
      } else if (!formatted.startsWith('+') && !formatted.startsWith('254') && formatted.length > 0) {
        formatted = '+254' + formatted;
      }
      setFormData({ ...formData, [name]: formatted });
    }
    // Handle OTP and PIN inputs (digits only)
    else if (name === 'otp' || name === 'newPin' || name === 'confirmPin') {
      const maxLength = name === 'otp' ? 6 : 4;
      if (/^\d*$/.test(value) && value.length <= maxLength) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const toggleShow = (field: 'new' | 'confirm') => {
    setShowPins({ ...showPins, [field]: !showPins[field] });
  };

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();

    try {
      requestPinResetSchema.parse({ phone: formData.phone });
      setErrors({});
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          const field = error.path[0] as string;
          newErrors[field] = error.message;
        });
        setErrors(newErrors);
        toast.error('⚠️ Please enter a valid phone number');
        return;
      }
    }

    setLoading(true);

    try {
      const result = await authApi.requestPinReset({ phone: formData.phone });

      if (!result.success) {
        const errorMsg = result.error || 'Failed to send OTP';
        if (errorMsg.toLowerCase().includes('not found')) {
          toast.error('❌ No account found with this phone number');
        } else {
          toast.error(errorMsg);
        }
        setLoading(false);
        return;
      }

      toast.success('📱 OTP sent to your phone via SMS!');
      toast.info('Check your messages for the 6-digit code');
      setStep('otp');
    } catch (err) {
      toast.error('⚠️ An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPin = async (e: FormEvent) => {
    e.preventDefault();

    // Check if PINs match
    if (formData.newPin !== formData.confirmPin) {
      setErrors({ confirmPin: 'PINs do not match' });
      toast.error('⚠️ PINs do not match');
      return;
    }

    try {
      verifyPinResetSchema.parse({
        phone: formData.phone,
        otp: formData.otp,
        newPin: formData.newPin,
      });
      setErrors({});
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          const field = error.path[0] as string;
          newErrors[field] = error.message;
        });
        setErrors(newErrors);
        toast.error('⚠️ Please fix validation errors');
        return;
      }
    }

    setLoading(true);

    try {
      const result = await authApi.verifyPinReset({
        phone: formData.phone,
        otp: formData.otp,
        newPin: formData.newPin,
      });

      if (!result.success) {
        const errorMsg = result.error || 'Failed to reset PIN';
        if (errorMsg.toLowerCase().includes('expired') || errorMsg.toLowerCase().includes('invalid otp')) {
          toast.error('❌ OTP is invalid or expired. Please request a new one.');
        } else if (errorMsg.toLowerCase().includes('not found')) {
          toast.error('❌ User not found');
        } else {
          toast.error(errorMsg);
        }
        setLoading(false);
        return;
      }

      toast.success('✅ PIN reset successfully! You can now sign in.');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      toast.error('⚠️ An unexpected error occurred');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {step === 'phone' ? <Smartphone className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'phone' ? 'Reset Your PIN' : 'Enter OTP & New PIN'}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              {step === 'phone' 
                ? 'Enter your phone number to receive an OTP via SMS' 
                : 'Check your messages for the 6-digit code'}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full pl-11 pr-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
                    placeholder="+254712345678"
                    disabled={loading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">Enter the phone number registered to your account</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.phone}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition font-semibold text-base flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPin} className="space-y-5">
              {/* OTP */}
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                  6-Digit OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={6}
                  required
                  className={`w-full px-4 py-3 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-center text-2xl font-bold tracking-widest`}
                  placeholder="● ● ● ● ● ●"
                  disabled={loading}
                />
                {errors.otp && (
                  <p className="text-xs text-red-600 mt-1">{errors.otp}</p>
                )}
              </div>

              {/* New PIN */}
              <div>
                <label htmlFor="newPin" className="block text-sm font-semibold text-gray-700 mb-2">
                  New 4-Digit PIN
                </label>
                <div className="relative">
                  <input
                    id="newPin"
                    name="newPin"
                    type={showPins.new ? 'text' : 'password'}
                    value={formData.newPin}
                    onChange={handleChange}
                    maxLength={4}
                    required
                    className={`w-full px-4 py-3 border ${errors.newPin ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-center text-2xl font-bold tracking-widest`}
                    placeholder="••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPins.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPin && (
                  <p className="text-xs text-red-600 mt-1">{errors.newPin}</p>
                )}
              </div>

              {/* Confirm PIN */}
              <div>
                <label htmlFor="confirmPin" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New PIN
                </label>
                <div className="relative">
                  <input
                    id="confirmPin"
                    name="confirmPin"
                    type={showPins.confirm ? 'text' : 'password'}
                    value={formData.confirmPin}
                    onChange={handleChange}
                    maxLength={4}
                    required
                    className={`w-full px-4 py-3 border ${errors.confirmPin ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-center text-2xl font-bold tracking-widest`}
                    placeholder="••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPins.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPin && (
                  <p className="text-xs text-red-600 mt-1">{errors.confirmPin}</p>
                )}
                {formData.newPin && formData.confirmPin && formData.newPin === formData.confirmPin && (
                  <div className="flex items-center gap-2 mt-2 text-green-600 text-xs">
                    <CheckCircle2 size={14} />
                    <span>PINs match</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.otp || !formData.newPin || !formData.confirmPin}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition font-semibold text-base flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting PIN...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Reset PIN
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setFormData({ ...formData, otp: '', newPin: '', confirmPin: '' });
                }}
                disabled={loading}
                className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}