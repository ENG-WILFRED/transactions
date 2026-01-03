// File: /app/dashboard/admin/settings/page.tsx
"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import ChangePinForm from '@/app/components/ChangePinForm';
import ChangePasswordForm from '@/app/components/ChangePasswordForm';
import { Settings, Lock, Bell, User, Save, Shield, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [user, setUser] = useState<{firstName?: string; lastName?: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'system'>('security');
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'AutoNest Pension',
    maintenanceMode: false,
    emailNotifications: true,
    autoLockdownHours: 24,
    defaultLoanRate: 12.5,
    maxMemberLoans: 5,
  });
  const [saving, setSaving] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    }
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('✅ Settings saved successfully');
    setSaving(false);
  };

  const handleToggle = (key: keyof typeof systemSettings) => {
    if (typeof systemSettings[key] === 'boolean') {
      setSystemSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  return (
    <DashboardLayout 
      userType="admin" 
      firstName={user?.firstName ?? 'Admin'} 
      lastName={user?.lastName ?? ''}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Settings</h1>
                <p className="text-sm text-gray-600">System configuration and security settings</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                activeTab === 'general' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/80 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={18} />
                General
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                activeTab === 'security' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/80 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock size={18} />
                Security
              </div>
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                activeTab === 'system' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/80 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings size={18} />
                System
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'general' && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={24} />
                General Settings
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={user?.firstName || ''}
                      disabled
                      className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={user?.lastName || ''}
                      disabled
                      className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-orange-900">
                      <p className="font-semibold mb-1">Admin Account</p>
                      <p>As an administrator, you have full access to system settings. Contact the super admin to update your personal information.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Key size={24} />
                  Change Password
                </h2>
                <p className="text-sm text-gray-600 mb-6">Update your account password</p>

                <ChangePasswordForm />
              </div>

              {/* Change PIN */}
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Lock size={24} />
                  Change PIN
                </h2>
                <p className="text-sm text-gray-600 mb-6">Update your 4-digit security PIN</p>

                <ChangePinForm />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900">
                  <strong>Security Tips:</strong> Use a strong, unique password and change it regularly. Never share your password or PIN with anyone.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings size={24} />
                System Configuration
              </h2>

              <div className="space-y-6">
                {/* Site Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
                  <input 
                    type="text" 
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>

                {/* Auto Lockdown Hours */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Auto-lockdown after inactivity (hours)</label>
                  <input 
                    type="number" 
                    value={systemSettings.autoLockdownHours}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, autoLockdownHours: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>

                {/* Default Loan Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Default Loan Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={systemSettings.defaultLoanRate}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, defaultLoanRate: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>

                {/* Max Member Loans */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Loans per Member</label>
                  <input 
                    type="number" 
                    value={systemSettings.maxMemberLoans}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, maxMemberLoans: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>

                {/* Maintenance Mode */}
                <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Maintenance Mode</p>
                    <p className="text-xs text-gray-600 mt-1">Temporarily disable user access during maintenance</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={systemSettings.maintenanceMode}
                      onChange={() => handleToggle('maintenanceMode')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">{systemSettings.maintenanceMode ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-600 mt-1">Send alerts and reports to administrators</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={systemSettings.emailNotifications}
                      onChange={() => handleToggle('emailNotifications')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">{systemSettings.emailNotifications ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleSaveSettings} 
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                  <button 
                    onClick={() => { 
                      setSystemSettings({
                        siteName: 'AutoNest Pension',
                        maintenanceMode: false,
                        emailNotifications: true,
                        autoLockdownHours: 24,
                        defaultLoanRate: 12.5,
                        maxMemberLoans: 5,
                      }); 
                      toast('Settings reset to defaults'); 
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}