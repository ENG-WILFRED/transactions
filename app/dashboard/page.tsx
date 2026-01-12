"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkUserRole = async () => {
      try {
        console.log('[Dashboard] Starting role check...');
        
        // Check if we're in browser
        if (typeof window === 'undefined') {
          console.log('[Dashboard] Not in browser, skipping...');
          return;
        }

        // Get auth token first
        const token = localStorage.getItem('auth_token');
        console.log('[Dashboard] Token exists:', !!token);

        if (!token) {
          console.log('[Dashboard] No token found, redirecting to login');
          if (mounted) {
            toast.error('Please login to continue');
            router.replace('/login');
          }
          return;
        }

        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        console.log('[Dashboard] User data exists:', !!userStr);

        if (!userStr) {
          console.log('[Dashboard] No user data, redirecting to login');
          if (mounted) {
            toast.error('Session expired. Please login again.');
            localStorage.clear(); // Clear everything
            router.replace('/login');
          }
          return;
        }

        const user = JSON.parse(userStr);
        console.log('[Dashboard] User role:', user.role);

        // Validate user object - if missing role, assume customer
        if (!user.role) {
          console.warn('[Dashboard] User object missing role, assuming customer:', user);
          user.role = 'customer'; // Default role
          // Update localStorage with role
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Add small delay to prevent race conditions
        await new Promise(resolve => setTimeout(resolve, 100));

        // Redirect based on role
        if (mounted) {
          if (user.role === 'admin') {
            console.log('[Dashboard] Redirecting to admin dashboard');
            router.replace('/dashboard/admin');
          } else if (user.role === 'customer') {
            console.log('[Dashboard] Redirecting to customer dashboard');
            router.replace('/dashboard/customer');
          } else {
            console.error('[Dashboard] Unknown role:', user.role);
            toast.error('Invalid user role');
            router.replace('/login');
          }
        }
      } catch (err) {
        console.error('[Dashboard] Error checking user role:', err);
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          toast.error('Session error. Please login again.');
          
          // Clear storage and redirect after a delay
          setTimeout(() => {
            localStorage.clear();
            router.replace('/login');
          }, 2000);
        }
      } finally {
        if (mounted) {
          // Set a maximum timeout
          setTimeout(() => {
            setChecking(false);
          }, 500);
        }
      }
    };

    checkUserRole();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [router]);

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-red-50 to-pink-100 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Session Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-indigo-700 font-medium">Checking your access...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return null;
}