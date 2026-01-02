"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import ChangePinForm from '@/app/components/ChangePinForm';
import { Settings, Lock, Bell, User, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerSettings() {
  const [user, setUser] = useState<{firstName?: string; lastName?: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('security');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    monthlyStatements: true,
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

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout 
      userType="customer" 
      firstName={user?.firstName ?? 'User'} 
      lastName={user?.lastName ?? ''}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your account preferences and security settings</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                activeTab === 'general' 
                  ? 'bg-indigo-600 text-white' 
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
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white/80 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock size={18} />
                Security
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                activeTab === 'notifications' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white/80 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell size={18} />
                Notifications
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'general' && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings size={24} />
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

                <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <strong>Note:</strong> To update your personal information, please contact customer support.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Lock size={24} />
                  Security Settings
                </h2>
                <p className="text-sm text-gray-600 mb-6">Manage your account security and PIN</p>

                <ChangePinForm />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900">
                  <strong>Forgot your PIN?</strong> Visit the <a href="/reset-pin" className="underline font-semibold hover:text-blue-700">PIN Reset page</a> to reset it via SMS OTP.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bell size={24} />
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-600 mt-1">Receive updates via email</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.emailNotifications}
                      onChange={() => handleToggle('emailNotifications')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">{settings.emailNotifications ? 'On' : 'Off'}</span>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-600 mt-1">Receive alerts via SMS</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.smsNotifications}
                      onChange={() => handleToggle('smsNotifications')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">{settings.smsNotifications ? 'On' : 'Off'}</span>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Monthly Statements</p>
                    <p className="text-xs text-gray-600 mt-1">Receive monthly account statements</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.monthlyStatements}
                      onChange={() => handleToggle('monthlyStatements')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">{settings.monthlyStatements ? 'On' : 'Off'}</span>
                  </label>
                </div>

                <button 
                  onClick={handleSaveSettings} 
                  disabled={saving}
                  className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Notification Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}