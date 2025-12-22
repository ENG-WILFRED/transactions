import { Wallet, ArrowDownRight, TrendingUp, Clock } from 'lucide-react';

interface BalanceCardsProps {
  balance?: number;
  totalContributions?: number;
  projectedRetirement?: number;
  user?: {
    salary?: string | number;
    contributionRate?: string | number;
    dateOfBirth?: string;
    retirementAge?: number;
    createdAt?: string;
  };
}

export default function BalanceCards({ balance, totalContributions, projectedRetirement, user }: BalanceCardsProps) {
  // Calculate values from user data if available
  const calculateMonthlyContribution = (): number => {
    if (user?.salary && user?.contributionRate) {
      const salary = typeof user.salary === 'string' ? parseInt(user.salary) : user.salary;
      const rate = typeof user.contributionRate === 'string' ? parseFloat(user.contributionRate) : user.contributionRate;
      return Math.round((rate / 100) * salary);
    }
    return totalContributions || 0;
  };

  const calculateYearsToRetirement = (): number => {
    if (user?.dateOfBirth && user?.retirementAge) {
      const birthDate = new Date(user.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return Math.max(0, user.retirementAge - age);
    }
    return 35;
  };

  const calculateTotalBalance = (): number => {
    if (user?.createdAt && user?.salary && user?.contributionRate) {
      const joinDate = new Date(user.createdAt);
      const today = new Date();
      const monthsElapsed = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());
      const monthlyContrib = calculateMonthlyContribution();
      return Math.round(monthlyContrib * Math.max(1, monthsElapsed));
    }
    return balance || 0;
  };

  const monthlyContrib = calculateMonthlyContribution();
  const yearsToRetirement = calculateYearsToRetirement();
  const totalBalance = calculateTotalBalance();
  const projectedAt65 = Math.round(totalBalance * Math.pow(1.08, yearsToRetirement));
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold opacity-90">Total Balance</h4>
          <Wallet size={20} className="opacity-75" />
        </div>
        <p className="text-3xl font-bold">KES {totalBalance.toLocaleString()}</p>
        <p className="text-indigo-100 text-xs mt-2">Across all plans</p>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold opacity-90">Monthly Contribution</h4>
          <ArrowDownRight size={20} className="opacity-75" />
        </div>
        <p className="text-3xl font-bold">KES {monthlyContrib.toLocaleString()}</p>
        <p className="text-emerald-100 text-xs mt-2">Total allocated</p>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold opacity-90">Projected @ {user?.retirementAge || 65}</h4>
          <TrendingUp size={20} className="opacity-75" />
        </div>
        <p className="text-3xl font-bold">KES {projectedAt65.toLocaleString()}</p>
        <p className="text-pink-100 text-xs mt-2">8% annual growth</p>
      </div>

      <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold opacity-90">Years to Retirement</h4>
          <Clock size={20} className="opacity-75" />
        </div>
        <p className="text-3xl font-bold">{yearsToRetirement}</p>
        <p className="text-red-100 text-xs mt-2">Target age: {user?.retirementAge || 65}</p>
      </div>
    </div>
  );
}
