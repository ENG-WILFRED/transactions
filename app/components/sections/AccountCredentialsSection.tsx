import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface AccountCredentialsSectionProps {
  formData: { email: string; phone: string; pin: string };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function AccountCredentialsSection({ formData, errors, onChange }: AccountCredentialsSectionProps) {
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="space-y-4 pb-4 mb-4">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Account Credentials</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            required
            className={`w-full px-4 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number * (M-Pesa)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            required
            className={`w-full px-4 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+254712345678"
          />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
            Please enter your 4-digit USSD PIN for *384*24*318# (Optional)
          </label>
          <div className="relative">
            <input
              id="pin"
              name="pin"
              type={showPin ? 'text' : 'password'}
              value={formData.pin}
              onChange={onChange}
              maxLength={4}
              className={`w-full px-4 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.pin ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="****"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.pin && <p className="text-red-600 text-xs mt-1">{errors.pin}</p>}
          <p className="text-xs text-gray-500 mt-1">Optional: Enter your USSD PIN for enhanced account access</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> A temporary password will be sent to your email and phone after successful registration.
        </p>
      </div>
    </div>
  );
}