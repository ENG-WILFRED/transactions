///home/hp/JERE/AutoNest/app/components/dashboard/PensionPlans.tsx

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
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-white/60">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <PieChart size={24} className="text-indigo-600" />
          Pension Plans ({plans.length})
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Plan Name</p>
                <p className="text-lg font-bold text-gray-900">{plan.name}</p>
                <p className="text-xs text-gray-600 mt-1">{plan.provider}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Balance</p>
                <p className="text-lg font-bold text-gray-900">KES {plan.balance.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">Current value</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Monthly Contribution</p>
                <p className="text-lg font-bold text-gray-900">KES {plan.contribution.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">Regular payment</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Expected Return</p>
                <p className="text-lg font-bold text-green-600">{plan.expectedReturn}%</p>
                <p className={`text-xs mt-1 ${plan.riskLevel === 'High' ? 'text-red-600' : plan.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                  Risk: {plan.riskLevel}
                </p>
              </div>
              <div className="flex items-end">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">{plan.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
