'use client';

import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface AccountCredentialsSectionProps {
  formData: { email: string; phone: string; pin: string };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function AccountCredentialsSection({ formData, errors, onChange }: AccountCredentialsSectionProps) {
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="space-y-5">
      {/* Email Field - Full Width */}
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2.5">
          Email *
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={onChange}
            className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 ${
              errors.email ? 'border-red-400' : 'border-slate-200'
            } text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300`}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone and PIN Fields - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Phone Number Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2.5">
            Phone Number * (M-Pesa)
          </label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+254712345678"
              value={formData.phone}
              onChange={onChange}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 ${
                errors.phone ? 'border-red-400' : 'border-slate-200'
              } text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.phone}
            </p>
          )}
        </div>

        {/* PIN Field */}
        <div>
          <label htmlFor="pin" className="block text-sm font-bold text-slate-700 mb-2.5">
            4-digit USSD PIN (Optional)
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              id="pin"
              name="pin"
              type={showPin ? 'text' : 'password'}
              placeholder="••••"
              maxLength={4}
              value={formData.pin}
              onChange={onChange}
              className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 border-2 ${
                errors.pin ? 'border-red-400' : 'border-slate-200'
              } text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300`}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
            >
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.pin && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.pin}
            </p>
          )}
          <p className="mt-1.5 text-xs text-slate-500">For *384*24*318# USSD access</p>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 mb-1">Note:</p>
            <p className="text-sm text-blue-800 leading-relaxed">
              A temporary password will be sent to your email and phone after successful registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}