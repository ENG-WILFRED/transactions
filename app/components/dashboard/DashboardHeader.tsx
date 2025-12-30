import { LogOut, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  firstName?: string;
  lastName?: string;
  userType?: 'customer' | 'admin';
}

export default function DashboardHeader({ firstName, lastName, userType = 'customer' }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      document.cookie = 'auth=; path=/; max-age=0';
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm w-full">
      <div className="w-full flex items-center justify-between py-4 px-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {userType === 'admin' ? 'Admin Dashboard' : 'AutoNest Dashboard'}
          </h1>
          <p className="text-gray-600 text-sm">
            Welcome, {firstName} {lastName}
            {userType === 'admin' && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Administrator</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white shadow hover:bg-red-700 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}