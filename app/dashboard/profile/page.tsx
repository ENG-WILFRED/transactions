"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { dashboardApi, userApi } from "@/app/lib/api-client";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit, 
  Save, 
  X,
  Loader2,
  Shield,
  CreditCard
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await dashboardApi.getUser();
      
      if (response.success && response.user) {
        setUser(response.user);
        setFormData({
          firstName: response.user.firstName || "",
          lastName: response.user.lastName || "",
          phone: response.user.phone || "",
          dateOfBirth: response.user.dateOfBirth || "",
          gender: response.user.gender || "",
          address: response.user.address || "",
          city: response.user.city || "",
          country: response.user.country || "",
        });
      } else {
        toast.error("Failed to load profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const response = await userApi.update(user.id, formData);

      if (response.success) {
        toast.success("✅ Profile updated successfully!");
        setEditing(false);
        loadProfile();
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
      });
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="ml-4 text-gray-600 dark:text-gray-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <User size={64} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage your personal information</p>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-semibold shadow-lg"
              >
                <Edit size={20} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
                >
                  <X size={20} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-indigo-100 dark:text-indigo-200">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Shield size={16} />
                <span className="text-sm font-semibold uppercase">{user.role}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-400">
            <div>
              <p className="text-indigo-100 dark:text-indigo-200 text-sm">Member Since</p>
              <p className="font-semibold">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-indigo-100 dark:text-indigo-200 text-sm">Last Updated</p>
              <p className="font-semibold">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Personal Information</h3>

          <div className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User size={16} />
                  First Name
                </label>
                <input
                  type="text"
                  value={editing ? formData.firstName : user.firstName || "Not set"}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!editing}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-600 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User size={16} />
                  Last Name
                </label>
                <input
                  type="text"
                  value={editing ? formData.lastName : user.lastName || "Not set"}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!editing}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-600 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone
                </label>
                <input
                  type="tel"
                  value={editing ? formData.phone : user.phone || "Not set"}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-600 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={editing ? formData.dateOfBirth : user.dateOfBirth || ""}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  disabled={!editing}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-600 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User size={16} />
                  Gender
                </label>
                <select
                  value={editing ? formData.gender : user.gender || ""}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  disabled={!editing}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-600 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Address
              </label>
              <input
                type="text"
                value={editing ? formData.address : user.address || "Not set"}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!editing}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-600 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  City
                </label>
                <input
                  type="text"
                  value={editing ? formData.city : user.city || "Not set"}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!editing}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-600 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Country
                </label>
                <input
                  type="text"
                  value={editing ? formData.country : user.country || "Not set"}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={!editing}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-600 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push(`/dashboard/${user.role === 'admin' ? 'admin' : 'customer'}/settings`)}
            className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 px-6 py-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-700 transition font-semibold"
          >
            <Shield size={20} />
            Security Settings
          </button>
          <button
            onClick={() => router.push(`/dashboard/${user.role === 'admin' ? 'admin' : 'customer'}/accounts`)}
            className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-400 px-6 py-4 rounded-xl hover:bg-purple-50 dark:hover:bg-gray-700 transition font-semibold"
          >
            <CreditCard size={20} />
            My Accounts
          </button>
        </div>
      </div>
    </div>
  );
}