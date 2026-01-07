///home/hp/JERE/AutoNest/app/components/dashboard/UserProfile.tsx
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  nssfNumber?: string;
  kra?: string;
  nationalId?: string;
  createdAt?: string;
}

interface UserProfileProps {
  user: User | null;
  onOpenSettings?: () => void;
}

export default function UserProfile({ user, onOpenSettings }: UserProfileProps) {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h3>
              <p className="text-gray-600 text-sm">{user?.email}</p>
              <p className="text-gray-500 text-xs mt-1">Member Since: {formatDate(user?.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenSettings?.()}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
            >
              Account Settings
            </button>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Key Information</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-500">ID Number:</span>
            <p className="font-semibold text-gray-900">{user?.nationalId}</p>
          </div>
          <div>
            <span className="text-gray-500">NSSF:</span>
            <p className="font-semibold text-gray-900">{user?.nssfNumber || 'IV/123456'}</p>
          </div>
          <div>
            <span className="text-gray-500">KRA PIN:</span>
            <p className="font-semibold text-gray-900">{user?.kra || 'A012345678B'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
