"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import UpdateBankDetailsForm from "@/app/components/settings/UpdateBankDetailsForm";
import { userApi } from "@/app/lib/api-client";

interface BankAccount {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branchCode?: string;
  branchName?: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branchCode?: string;
  branchName?: string;
  role?: string;
}

export default function BankDetailsSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const storedUser = userStr ? JSON.parse(userStr) : null;

        if (!storedUser?.id) {
          toast.error('Please log in to access settings');
          router.push('/login');
          return;
        }

        // Fetch fresh user data from the backend
        const userResponse = await userApi.getById(storedUser.id);
        
        if (userResponse.success && userResponse.user) {
          // Update both state and localStorage with fresh data
          setUser(userResponse.user);
          localStorage.setItem('user', JSON.stringify(userResponse.user));
        } else {
          // Fallback to stored user if fetch fails
          setUser(storedUser);
          toast.warning('Using cached user data');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Failed to load user data');
        
        // Try to use cached data as fallback
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleSuccess = async () => {
    // Refresh user data after successful update
    try {
      if (user?.id) {
        // Wait a moment for the backend to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const userResponse = await userApi.getById(user.id);
        if (userResponse.success && userResponse.user) {
          setUser(userResponse.user);
          localStorage.setItem('user', JSON.stringify(userResponse.user));
          toast.success('Bank details updated successfully!');
        }
      }
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard/customer');
      }, 1500);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      toast.warning('Bank details saved, but failed to refresh display');
    }
  };

  // Extract bank details from user object
  const getBankDetails = (): BankAccount => {
    if (!user) return {};
    
    return {
      bankName: user.bankName,
      accountNumber: user.accountNumber,
      accountName: user.accountName,
      branchCode: user.branchCode,
      branchName: user.branchName,
    };
  };

  const currentBankDetails = getBankDetails();
  const hasBankDetails = !!(
    currentBankDetails.bankName || 
    currentBankDetails.accountNumber || 
    currentBankDetails.accountName
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <div className="h-12 w-12 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">User not found</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-indigo-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bank Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {hasBankDetails ? 'Update' : 'Add'} your bank account information for receiving pension payments
          </p>
        </div>

        {/* Current Bank Details Display (if exists) */}
        {hasBankDetails && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Current Bank Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentBankDetails.bankName && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bank Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{currentBankDetails.bankName}</p>
                </div>
              )}
              {currentBankDetails.accountName && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Account Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{currentBankDetails.accountName}</p>
                </div>
              )}
              {currentBankDetails.accountNumber && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Account Number</p>
                  <p className="text-gray-900 dark:text-white font-medium">{currentBankDetails.accountNumber}</p>
                </div>
              )}
              {currentBankDetails.branchCode && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Branch Code</p>
                  <p className="text-gray-900 dark:text-white font-medium">{currentBankDetails.branchCode}</p>
                </div>
              )}
              {currentBankDetails.branchName && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Branch Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{currentBankDetails.branchName}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bank Details Form */}
        <UpdateBankDetailsForm
          userId={user.id}
          currentBankDetails={currentBankDetails}
          onSuccess={handleSuccess}
        />

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Important Information
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Ensure your bank account details are accurate</li>
            <li>• This account will be used for pension withdrawals and payments</li>
            <li>• Changes may take 24-48 hours to reflect in the system</li>
            <li>• Contact support if you need to change verified details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}