///app/components/dashboard/PensionPlans.tsx
import { PieChart } from 'lucide-react';

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

interface PensionPlansProps {
  plans: PensionPlan[];
}

export default function PensionPlans({ plans }: PensionPlansProps) {
  return (
    <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
          <PieChart size={24} className="text-indigo-600 dark:text-indigo-400" />
          Pension Plans ({plans.length})
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md dark:hover:bg-gray-700 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">Plan Name</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">{plan.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">{plan.provider}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">Balance</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">KES {plan.balance.toLocaleString()}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Current value</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">Monthly Contribution</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">KES {plan.contribution.toLocaleString()}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Regular payment</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">Expected Return</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 transition-colors duration-300">{plan.expectedReturn}%</p>
                <p className={`text-xs mt-1 transition-colors duration-300 ${
                  plan.riskLevel === 'High' 
                    ? 'text-red-600 dark:text-red-400' 
                    : plan.riskLevel === 'Medium' 
                    ? 'text-yellow-600 dark:text-yellow-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  Risk: {plan.riskLevel}
                </p>
              </div>
              <div className="flex items-end">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold transition-colors duration-300">{plan.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}