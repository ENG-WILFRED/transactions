///app/components/dashboard/QuickActions.tsx
"use client";

import { useRouter } from 'next/navigation';
import { CreditCard, Download, Target, TrendingUp, Users, FileText, Settings, AlertCircle } from 'lucide-react';

interface QuickActionsProps {
  userType?: 'customer' | 'admin';
}

export default function QuickActions({ userType = 'customer' }: QuickActionsProps) {
  const router = useRouter();

  const customerActions = [
    {
      action: 'contribute',
      icon: CreditCard,
      title: 'Make Contribution',
      description: 'Add funds to your pension account.',
      color: 'from-green-500 to-emerald-600',
      onClick: () => router.push('/dashboard/customer/contributions')
    },
    {
      action: 'reports',
      icon: FileText,
      title: 'My Reports',
      description: 'Download your account reports.',
      color: 'from-blue-500 to-indigo-600',
      onClick: () => router.push('/dashboard/customer/reports')
    },
    {
      action: 'goals',
      icon: Target,
      title: 'Update Goals',
      description: 'Adjust your retirement targets.',
      color: 'from-purple-500 to-pink-600',
      onClick: () => router.push('/dashboard/customer/goals')
    },
    {
      action: 'calculator',
      icon: TrendingUp,
      title: 'Retirement Calculator',
      description: 'Project your retirement savings.',
      color: 'from-orange-500 to-red-600',
      onClick: () => router.push('/dashboard/customer/calculator')
    }
  ];

  const adminActions = [
    {
      action: 'approve',
      icon: Users,
      title: 'Manage Users',
      description: 'Review and manage members.',
      color: 'from-green-500 to-emerald-600',
      onClick: () => router.push('/dashboard/admin/manage')
    },
    {
      action: 'generate-report',
      icon: FileText,
      title: 'Reports',
      description: 'Generate system reports.',
      color: 'from-blue-500 to-indigo-600',
      onClick: () => router.push('/dashboard/admin/reports')
    },
    {
      action: 'system-check',
      icon: Settings,
      title: 'System Settings',
      description: 'Configure system parameters.',
      color: 'from-purple-500 to-pink-600',
      onClick: () => router.push('/dashboard/admin/settings')
    },
    {
      action: 'alerts',
      icon: AlertCircle,
      title: 'Account Types',
      description: 'Manage account types.',
      color: 'from-orange-500 to-red-600',
      onClick: () => router.push('/dashboard/admin/account-types')
    }
  ];

  const actions = userType === 'admin' ? adminActions : customerActions;

  return (
    <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Quick Actions</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Perform common tasks</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={action.onClick}
              className="group bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-5 flex flex-col items-start hover:shadow-lg hover:scale-105 transition-all text-left"
            >
              <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">{action.title}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 transition-colors duration-300">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}