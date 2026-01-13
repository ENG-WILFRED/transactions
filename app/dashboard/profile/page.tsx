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
  CreditCard,
  CheckCircle2
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
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 dark:text-orange-400" />
          <p className="ml-4 text-slate-600 dark:text-slate-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <User size={64} className="mx-auto text-slate-400 dark:text-slate-600 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white transition-colors duration-300">
                My Profile
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 transition-colors duration-300">
                View and manage your personal information
              </p>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
              >
                <Edit size={20} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all font-bold"
                >
                  <X size={20} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 dark:from-orange-700 dark:via-orange-600 dark:to-orange-700 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden transition-colors duration-300">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 dark:bg-white/3 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-24 h-24 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-black border-4 border-white/30 dark:border-white/20 shadow-xl">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-orange-100 dark:text-orange-200 text-lg mb-2">{user.email}</p>
                <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                  <Shield size={16} />
                  <span className="text-sm font-bold uppercase tracking-wide">{user.role}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/30 dark:border-white/20">
              <div>
                <p className="text-orange-100 dark:text-orange-200 text-sm mb-1 font-semibold">Member Since</p>
                <p className="font-bold text-lg">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-orange-100 dark:text-orange-200 text-sm mb-1 font-semibold">Last Updated</p>
                <p className="font-bold text-lg">
                  {user.updatedAt 
                    ? new Date(user.updatedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) 
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-8 mb-6 transition-colors duration-300">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-2 transition-colors duration-300">
            <User className="text-orange-600 dark:text-orange-400" size={24} />
            Personal Information
          </h3>

          <div className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2 transition-colors duration-300">
                  <User size={16} className="text-orange-600 dark:text-orange-400" />
                  First Name
                </label>
                <input
                  type="text"
                  value={editing ? formData.firstName : user.firstName || "Not set"}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!editing}
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl p-3.5 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-orange-400/10 transition-all outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2 transition-colors duration-300">
                  <User size={16} className="text-orange-600 dark:text-orange-400" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={editing ? formData.lastName : user.lastName || "Not set"}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!editing}
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl p-3.5 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-orange-400/10 transition-all outline-none font-medium"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2 transition-colors duration-300">
                  <Mail size={16} className="text-orange-600 dark:text-orange-400" />
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl p-3.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1 transition-colors duration-300">
                  <Shield size={12} />
                  Email cannot be changed
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2 transition-colors duration-300">
                  <Phone size={16} className="text-orange-600 dark:text-orange-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editing ? formData.phone : user.phone || "Not set"}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl p-3.5 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-orange-400/10 transition-all outline-none font-medium"
                />
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2 transition-colors duration-300">
                  <Calendar size={16} className="text-orange-600 dark:text-orange-400" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={editing ? formData.dateOfBirth : user.dateOfBirth || ""}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  disabled={!editing}
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl p-3.5 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-orange-400/10 transition-all outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2 transition-colors duration-300">
                  <User size={16} className="text-orange-600 dark:text-orange-400" />
                  Gender
                </label>
                <select
                  value={editing ? formData.gender : user.gender || ""}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  disabled={!editing}
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl p-3.5 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-orange-400/10 transition-all outline-none font-medium"
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
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2 transition-colors duration-300">
                <MapPin size={16} className="text-orange-600 dark:text-orange-400" />
                Street Address
              </label>
              <input
                type="text"
                value={editing ? formData.address : user.address || "Not set"}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!editing}
                placeholder="123 Main Street"
                className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl p-3.5 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-orange-400/10 transition-all outline-none font-medium placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2 transition-colors duration-300">
                  <MapPin size={16} className="text-orange-600 dark:text-orange-400" />
                  City
                </label>
                <input
                  type="text"
                  value={editing ? formData.city : user.city || "Not set"}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!editing}
                  placeholder="Nairobi"
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl p-3.5 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-orange-400/10 transition-all outline-none font-medium placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2 transition-colors duration-300">
                  <MapPin size={16} className="text-orange-600 dark:text-orange-400" />
                  Country
                </label>
                <input
                  type="text"
                  value={editing ? formData.country : user.country || "Not set"}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={!editing}
                  placeholder="Kenya"
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-xl p-3.5 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-orange-400/10 transition-all outline-none font-medium placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push(`/dashboard/${user.role === 'admin' ? 'admin' : 'customer'}/settings`)}
            className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-400 px-6 py-4 rounded-xl hover:bg-orange-50 dark:hover:bg-slate-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all font-bold shadow-md hover:shadow-lg group"
          >
            <Shield size={20} className="group-hover:scale-110 transition-transform" />
            Security Settings
          </button>
          <button
            onClick={() => router.push(`/dashboard/${user.role === 'admin' ? 'admin' : 'customer'}/accounts`)}
            className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400 px-6 py-4 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all font-bold shadow-md hover:shadow-lg group"
          >
            <CreditCard size={20} className="group-hover:scale-110 transition-transform" />
            My Accounts
          </button>
        </div>
      </div>
    </div>
  );
}