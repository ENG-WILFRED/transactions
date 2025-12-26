import { Eye, EyeOff } from 'lucide-react';

interface AccountCredentialsSectionProps {
  formData: { email: string; phone: string; username?: string };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function AccountCredentialsSection({ formData, errors, onChange }: AccountCredentialsSectionProps) {
  return (
    <div className="space-y-2 pb-4 mb-4 border-b">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Account Credentials</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
             <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
               Username *
             </label>
             <input
               id="username"
               name="username"
               type="text"
               value={formData.username || ''}
               onChange={onChange}
               required
               className={`w-full px-4 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                 errors.username ? 'border-red-500' : 'border-gray-300'
               }`}
               placeholder="choose-a-username"
             />
             {errors.username && <p className="text-red-600 text-xs mt-0.5">{errors.username}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-0.5">
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
          {errors.email && <p className="text-red-600 text-xs mt-0.5">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-0.5">
            Phone * (M-Pesa)
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
          {errors.phone && <p className="text-red-600 text-xs mt-0.5">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="sm:col-span-2">
             <p className="text-sm text-gray-600">A temporary password will be issued via email after registration.</p>
        </div>
      </div>
    </div>
  );
}
