'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { changePinSchema } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { ZodError } from 'zod';

export default function ChangePinForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPins, setShowPins] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [formData, setFormData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow digits and max 4 characters
    if (/^\d*$/.test(value) && value.length <= 4) {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    }
  };

  const toggleShow = (field: 'current' | 'new' | 'confirm') => {
    setShowPins({ ...showPins, [field]: !showPins[field] });
  };

  const validateForm = () => {
    try {
      // Check if new PIN matches confirmation
      if (formData.newPin !== formData.confirmPin) {
        setErrors({ confirmPin: 'PINs do not match' });
        return false;
      }

      // Validate using zod schema
      changePinSchema.parse({
        currentPin: formData.currentPin,
        newPin: formData.newPin,
      });

      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          const path = error.path[0] as string;
          newErrors[path] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('⚠️ Please fix validation errors');
      return;
    }

    setLoading(true);

    try {
      const result = await authApi.changePin({
        currentPin: formData.currentPin,
        newPin: formData.newPin,
      });

      if (!result.success) {
        const errorMsg = result.error || 'Failed to change PIN';
        if (errorMsg.toLowerCase().includes('incorrect') || errorMsg.toLowerCase().includes('invalid')) {
          toast.error('❌ Current PIN is incorrect');
        } else if (errorMsg.toLowerCase().includes('not set')) {
          toast.error('⚠️ PIN not set. Please contact support.');
        } else {
          toast.error(errorMsg);
        }
        setLoading(false);
        return;
      }

      toast.success('✅ PIN changed successfully! Please sign in again.');
      
      // Clear auth data and redirect to login (security measure)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
      
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      toast.error('⚠️ An unexpected error occurred');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Change Your PIN</h2>
          <p className="text-gray-600 mt-2 text-sm">Enter your current PIN and choose a new 4-digit PIN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current PIN */}
          <div>
            <label htmlFor="currentPin" className="block text-sm font-semibold text-gray-700 mb-2">
              Current PIN
            </label>
            <div className="relative">
              <input
                id="currentPin"
                name="currentPin"
                type={showPins.current ? 'text' : 'password'}
                value={formData.currentPin}
                onChange={handleChange}
                maxLength={4}
                required
                className={`w-full px-4 py-3 border ${errors.currentPin ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-center text-2xl font-bold tracking-widest`}
                placeholder="••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => toggleShow('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPins.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPin && (
              <p className="text-xs text-red-600 mt-1">{errors.currentPin}</p>
            )}
          </div>

          {/* New PIN */}
          <div>
            <label htmlFor="newPin" className="block text-sm font-semibold text-gray-700 mb-2">
              New PIN
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
                className={`w-full px-4 py-3 border ${errors.newPin ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-center text-2xl font-bold tracking-widest`}
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

          {/* Confirm New PIN */}
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
                className={`w-full px-4 py-3 border ${errors.confirmPin ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-center text-2xl font-bold tracking-widest`}
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

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Lock size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-900">
                <p className="font-semibold mb-1">Security Notice</p>
                <p>After changing your PIN, you'll be logged out and need to sign in again with your new PIN.</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.currentPin || !formData.newPin || !formData.confirmPin}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition font-semibold text-base flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Changing PIN...
              </>
            ) : (
              <>
                <Lock size={20} />
                Change PIN
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}