"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UserProfile from "@/app/components/dashboard/UserProfile";
import BalanceCards from "@/app/components/dashboard/BalanceCards";
import EmploymentDetails from "@/app/components/dashboard/EmploymentDetails";
import BankDetailsComponent from "@/app/components/dashboard/BankDetails";
import UpdateBankDetailsForm from '@/app/components/settings/UpdateBankDetailsForm';
import PensionPlans from "@/app/components/dashboard/PensionPlans";
import TransactionHistory from "@/app/components/dashboard/TransactionHistory";
import QuickActions from "@/app/components/dashboard/QuickActions";
import CustomerSettings from '@/app/dashboard/customer/settings/page';
import { userApi, dashboardApi } from "@/app/lib/api-client";

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
  phone?: string;
  employer?: string;
  occupation?: string;
  salary?: string | number;
  contributionRate?: string | number;
  retirementAge?: number;
  dateOfBirth?: string;
  numberOfChildren?: number;
  address?: any;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branchCode?: string;
  branchName?: string;
  kra?: string;
  nssfNumber?: string;
  role?: 'customer' | 'admin';
  bankDetails?: any[];
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  description?: string | null;
  createdAt: any;
}

interface PensionPlan {
  id: string;
  name: string;
  provider: string;
  contribution: number;
  expectedReturn: number;
  riskLevel: string;
  balance: number;
  status: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [pensionPlans, setPensionPlans] = useState<PensionPlan[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [projectedRetirement, setProjectedRetirement] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingBankDetails, setLoadingBankDetails] = useState(true);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Helper function to extract bank details from user object
  const getBankDetails = (user: User | null): BankAccount | undefined => {
    if (!user) return undefined;
    // Prefer nested bankDetails array if present (API returns array)
    if (Array.isArray(user.bankDetails) && user.bankDetails.length > 0) {
      const bd: any = user.bankDetails[0];
      return {
        bankName: bd.bankName || bd.bank || bd.bank_name,
        accountNumber: bd.accountNumber || bd.account_number || bd.account || bd.accountNo,
        accountName: bd.bankAccountName || bd.accountName || bd.account_name || bd.accountHolder,
        branchCode: bd.branchCode || bd.branch_code,
        branchName: bd.branchName || bd.branch_name,
      };
    }

    // Fallback to direct fields on user object
    const hasDirectDetails = user.bankName || user.accountNumber || user.accountName;
    if (hasDirectDetails) {
      return {
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        accountName: user.accountName,
        branchCode: user.branchCode,
        branchName: user.branchName,
      };
    }

    return undefined;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const storedUser = userStr ? JSON.parse(userStr) : null;

        if (!storedUser?.id) {
          router.push('/login');
          return;
        }

        if (storedUser.role === 'admin') {
          toast.error('🚫 Admins cannot access customer dashboard');
          router.push('/dashboard/admin');
          return;
        }

        setLoadingBankDetails(true);
        
        // Fetch fresh user data from backend
        const userResponse = await userApi.getById(storedUser.id);
        
        if (userResponse.success && userResponse.user) {
          if (userResponse.user.role === 'admin') {
            toast.error('Admins cannot access customer dashboard');
            router.push('/dashboard/admin');
            return;
          }
          
          // Update state with fresh data
          setUser(userResponse.user);
          
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(userResponse.user));
          console.log(userResponse.user);
          // Check for bank details using the helper function
          const bankDetails = getBankDetails(userResponse.user);
          
          if (bankDetails && bankDetails.bankName) {
            toast.success(`Welcome back, ${userResponse.user.firstName || storedUser.firstName}!`);
          } else {
            toast.info('💳 Please update your bank details in settings');
          }
        } else {
          // Fallback to cached data
          setUser(storedUser);
          toast.warning('Using cached profile data');
        }
        setLoadingBankDetails(false);

        // Pre-fill phone if available in user profile for deposit/other forms
        // (no-op here, kept for future enhancements)

        setLoadingTransactions(true);
        const transactionsResponse = await dashboardApi.getTransactions();
        
        if (transactionsResponse.success && transactionsResponse.transactions) {
          setTransactions(transactionsResponse.transactions);
        } else {
          console.warn('Failed to load transactions:', transactionsResponse.error);
          toast.warning('⚠️ Could not load transactions. Using sample data.');
          setTransactions([
            {
              id: "1",
              amount: 15000,
              type: "debit",
              status: "completed",
              description: "Monthly Contribution",
              createdAt: new Date(),
            },
          ]);
        }
        setLoadingTransactions(false);

        const mockPensionPlans: PensionPlan[] = [
          {
            id: "plan1",
            name: "Growth Pension Fund",
            provider: "Kenya Pension Fund Limited",
            contribution: 15000,
            expectedReturn: 12.5,
            riskLevel: "High",
            balance: 285000,
            status: "Active",
          },
          {
            id: "plan2",
            name: "Balanced Pension Fund",
            provider: "Heritage Insurance Pension",
            contribution: 10000,
            expectedReturn: 8.75,
            riskLevel: "Medium",
            balance: 165000,
            status: "Active",
          },
          {
            id: "plan3",
            name: "Conservative Pension Fund",
            provider: "Equity Bank Pension Scheme",
            contribution: 8000,
            expectedReturn: 5.5,
            riskLevel: "Low",
            balance: 98000,
            status: "Active",
          },
        ];

        const totalContrib = mockPensionPlans.reduce((sum, plan) => sum + plan.contribution, 0);
        const totalBalance = mockPensionPlans.reduce((sum, plan) => sum + plan.balance, 0);

        setPensionPlans(mockPensionPlans);
        setTotalContributions(totalContrib);
        setBalance(totalBalance);
        setProjectedRetirement(Math.round(totalBalance * Math.pow(1.08, 30)));

      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950 flex flex-col items-center justify-center transition-colors duration-300">
        <div className="h-12 w-12 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-700 dark:text-indigo-300 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  // Get bank details using helper function
  const bankDetails = getBankDetails(user);

  const handleOpenBankModal = () => setBankModalOpen(true);
  const handleCloseBankModal = () => setBankModalOpen(false);

  const handleBankUpdateSuccess = async () => {
    // refresh user from API after update
    try {
      const userStr = localStorage.getItem('user');
      const storedUser = userStr ? JSON.parse(userStr) : null;
      if (!storedUser?.id) return;
      const userResponse = await userApi.getById(storedUser.id);
      if (userResponse.success && userResponse.user) {
        setUser(userResponse.user);
        localStorage.setItem('user', JSON.stringify(userResponse.user));
        toast.success('Bank details updated');
      }
    } catch (err) {
      console.warn('Failed to refresh user after bank update', err);
    } finally {
      handleCloseBankModal();
    }
  };

  const handleOpenSettings = () => setSettingsModalOpen(true);
  const handleCloseSettings = () => setSettingsModalOpen(false);

  return (
    <>
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <UserProfile user={user} onOpenSettings={handleOpenSettings} />
      
      <BalanceCards 
        balance={balance} 
        totalContributions={totalContributions} 
        projectedRetirement={projectedRetirement}
        user={user ? {
          salary: user.salary,
          contributionRate: user.contributionRate,
          dateOfBirth: user.dateOfBirth,
          retirementAge: user.retirementAge,
        } : undefined}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <EmploymentDetails 
          employer={user?.employer} 
          occupation={user?.occupation}
          salary={user?.salary} 
          contributionRate={user?.contributionRate}
          retirementAge={user?.retirementAge}
        />
        <BankDetailsComponent 
          bankAccount={bankDetails}
          loading={loadingBankDetails}
          onEdit={handleOpenBankModal}
        />
      </div>

      <PensionPlans plans={pensionPlans} />
      
      {loadingTransactions ? (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-12 flex flex-col items-center justify-center transition-colors duration-300">
          <div className="h-10 w-10 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading transactions...</p>
        </div>
      ) : (
        <TransactionHistory transactions={transactions} />
      )}
      
      <QuickActions userType="customer" />
    </div>

    {/* Bank details edit modal */}
    {bankModalOpen && user && (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Bank Details</h3>
            <button onClick={handleCloseBankModal} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <UpdateBankDetailsForm
            userId={user.id}
            currentBankDetails={bankDetails}
            onSuccess={handleBankUpdateSuccess}
          />
        </div>
      </div>
    )}

    {/* Settings modal */}
    {settingsModalOpen && (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Settings</h3>
            <button onClick={handleCloseSettings} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          {/* render the existing settings page component inside the modal */}
          <CustomerSettings />
        </div>
      </div>
    )}
    </>
  );
}