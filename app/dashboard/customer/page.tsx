"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UserProfile from "@/app/components/dashboard/UserProfile";
import BalanceCards from "@/app/components/dashboard/BalanceCards";
import EmploymentDetails from "@/app/components/dashboard/EmploymentDetails";
import BankDetailsComponent from "@/app/components/dashboard/BankDetails";
import PensionPlans from "@/app/components/dashboard/PensionPlans";
import TransactionHistory from "@/app/components/dashboard/TransactionHistory";
import QuickActions from "@/app/components/dashboard/QuickActions";
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

  // Helper function to extract bank details from user object
  const getBankDetails = (user: User | null): BankAccount | undefined => {
    if (!user) return undefined;
    
    // Check if any bank details exist as direct fields on user
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <UserProfile user={user} />
      
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
  );
}