import { User } from 'lucide-react';

interface EmploymentDetailsProps {
  employer?: string;
  occupation?: string;
  salary?: string | number;
  contributionRate?: string | number;
  retirementAge?: number;
}

export default function EmploymentDetails({ 
  employer, 
  occupation, 
  salary, 
  contributionRate, 
  retirementAge 
}: EmploymentDetailsProps) {
  const salaryNum = typeof salary === 'string' ? parseInt(salary) : (salary || 85000);
  const formatRate = typeof contributionRate === 'string' && !contributionRate.includes('%') 
    ? `${contributionRate}%` 
    : (contributionRate || '38.67%');
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <User size={20} className="text-indigo-600 dark:text-indigo-400" />
        Employment Details
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Employer:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{employer || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Occupation:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{occupation || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Status:</span>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-semibold">
            Employed
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Monthly Salary:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">KES {salaryNum.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          <span className="text-gray-600 dark:text-gray-400">Contribution Rate:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{formatRate}</span>
        </div>
        {retirementAge && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Retirement Age:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{retirementAge}</span>
          </div>
        )}
      </div>
    </div>
  );
}