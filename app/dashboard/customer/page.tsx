"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import AnimatedFooter from "@/app/components/AnimatedFooter";
import UserProfile from "@/app/components/dashboard/UserProfile";
import BalanceCards from "@/app/components/dashboard/BalanceCards";
import EmploymentDetails from "@/app/components/dashboard/EmploymentDetails";
import BankDetailsComponent from "@/app/components/dashboard/BankDetails";
import PensionPlans from "@/app/components/dashboard/PensionPlans";
import TransactionHistory from "@/app/components/dashboard/TransactionHistory";
import QuickActions from "@/app/components/dashboard/QuickActions";
import { userApi } from "@/app/lib/api-client";

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
  bankAccount?: any;
  kra?: string;
  nssfNumber?: string;
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

  useEffect(() => {
    const load = async () => {
      try {
        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        const storedUser = userStr ? JSON.parse(userStr) : null;

        if (!storedUser?.id) {
          router.push('/login');
          return;
        }

        // Fetch full user data from API
        const userResponse = await userApi.getById(storedUser.id);
        if (userResponse.success && userResponse.user) {
          setUser(userResponse.user);
        } else {
          // Fallback to stored user if API fails
          setUser(storedUser);
        }
        toast.success(`Welcome back, ${(userResponse.user?.firstName || storedUser.firstName)}!`);

        // Mock pension plans
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

        // Mock transactions - expanded
        const mockTransactions: Transaction[] = [
          {
            id: "1",
            amount: 15000,
            type: "debit",
            status: "completed",
            description: "Growth Fund Contribution",
            createdAt: new Date(),
          },
          {
            id: "2",
            amount: 10000,
            type: "debit",
            status: "completed",
            description: "Balanced Fund Contribution",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            id: "3",
            amount: 8000,
            type: "debit",
            status: "completed",
            description: "Conservative Fund Contribution",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            id: "4",
            amount: 12500,
            type: "credit",
            status: "completed",
            description: "Monthly Investment Returns",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            id: "5",
            amount: 15000,
            type: "debit",
            status: "completed",
            description: "Growth Fund Contribution",
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          {
            id: "6",
            amount: 8500,
            type: "credit",
            status: "completed",
            description: "Dividend Distribution",
            createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          },
          {
            id: "7",
            amount: 10000,
            type: "debit",
            status: "completed",
            description: "Balanced Fund Contribution",
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          },
          {
            id: "8",
            amount: 33000,
            type: "credit",
            status: "completed",
            description: "Quarterly Performance Bonus",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
          {
            id: "9",
            amount: 5000,
            type: "debit",
            status: "pending",
            description: "Loan Disbursement",
            createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
          },
        ];

        const totalContrib = mockPensionPlans.reduce((sum, plan) => sum + plan.contribution, 0);
        const totalBalance = mockPensionPlans.reduce((sum, plan) => sum + plan.balance, 0);

        setPensionPlans(mockPensionPlans);
        setTransactions(mockTransactions);
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
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-700 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 relative overflow-x-hidden flex flex-col">

      {/* Floating shapes */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-300/30 blur-3xl rounded-full animate-floating-slow" />
      <div className="absolute bottom-16 right-10 w-52 h-52 bg-purple-300/20 blur-3xl rounded-full animate-floating-slower" />

      <DashboardHeader firstName={user?.firstName ?? 'User'} lastName={user?.lastName ?? ''} userType={'customer'} />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
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
          <BankDetailsComponent bankAccount={user?.bankAccount} />
        </div>

        <PensionPlans plans={pensionPlans} />
        <TransactionHistory transactions={transactions} />
        <QuickActions userType={'customer'} />
      </main>

      <AnimatedFooter />

      {/* ANIMATIONS */}
      <style jsx>{`
        .animate-floating-slow {
          animation: float 9s ease-in-out infinite;
        }
        .animate-floating-slower {
          animation: float 14s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-18px) scale(1.04);
          }
        }
      `}</style>
    </div>
  );
}
