// File: /app/components/ChangePasswordForm.tsx
"use client";

import { useState } from 'react';
import { authApi } from '@/app/lib/api-client';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      errors: [
        password.length < minLength && 'At least 8 characters',
        !hasUpperCase && 'One uppercase letter',
        !hasLowerCase && 'One lowercase letter',
        !hasNumber && 'One number',
        !hasSpecialChar && 'One special character',
      ].filter(Boolean) as string[],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    // Validation
    if (!formData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (!formData.newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    const validation = validatePassword(formData.newPassword);
    if (!validation.isValid) {
      toast.error('New password does not meet requirements');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        toast.success('✅ Password changed successfully!');
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        toast.error(response.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('An error occurred while changing password');
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.newPassword);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-900">
            Your password has been changed successfully. Please use your new password for future logins.
          </p>
        </div>
      )}

      {/* Current Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Current Password *
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter current password"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          New Password *
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter new password"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Requirements */}
        {formData.newPassword && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
            <ul className="space-y-1">
              {[
                { met: formData.newPassword.length >= 8, text: 'At least 8 characters' },
                { met: /[A-Z]/.test(formData.newPassword), text: 'One uppercase letter' },
                { met: /[a-z]/.test(formData.newPassword), text: 'One lowercase letter' },
                { met: /\d/.test(formData.newPassword), text: 'One number' },
                { met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword), text: 'One special character' },
              ].map((req, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs">
                  {req.met ? (
                    <CheckCircle size={14} className="text-green-600" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={req.met ? 'text-green-700 font-medium' : 'text-gray-600'}>
                    {req.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Confirm New Password *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-indigo-500"
            placeholder="Confirm new password"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
          <p className="mt-2 text-xs text-red-600">Passwords do not match</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !passwordValidation.isValid || formData.newPassword !== formData.confirmPassword}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Changing Password...
          </>
        ) : (
          <>
            <Lock size={20} />
            Change Password
          </>
        )}
      </button>
    </form>
  );
}