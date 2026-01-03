"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { toast } from "sonner";
import { userApi } from "@/app/lib/api-client";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  User,
  CreditCard,
  Loader2,
  Save,
} from "lucide-react";
import Link from "next/link";

interface UserDetail {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  occupation?: string;
  employer?: string;
  nationalId?: string;
  role?: string;
}

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserDetail>>({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    occupation: "",
    employer: "",
    nationalId: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const response = await userApi.getById(id);
        if (response.success && response.user) {
          const user = response.user;
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
            dateOfBirth: user.dateOfBirth || "",
            gender: user.gender || "",
            address: user.address || "",
            city: user.city || "",
            country: user.country || "",
            occupation: user.occupation || "",
            employer: user.employer || "",
            nationalId: user.nationalId || "",
          });
        } else {
          toast.error("❌ User not found");
          router.push("/dashboard/admin/customers");
        }
      } catch (err) {
        console.error("Error loading user:", err);
        toast.error("Failed to load user details");
        router.push("/dashboard/admin/customers");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await userApi.update(id, formData);
      if (response.success) {
        toast.success("✅ User updated successfully");
        router.push(`/dashboard/admin/manage/${id}`);
      } else {
        toast.error(response.error || "Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="ml-4 text-gray-600 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            href={`/dashboard/admin/manage/${id}`}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft size={20} />
            Back to User Details
          </Link>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <User size={32} />
              Edit User Details
            </h1>
            <p className="text-indigo-100 mt-2">
              Update user information and profile details
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-indigo-600" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., +254712345678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <CreditCard size={16} className="inline mr-1" />
                  National ID
                </label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) =>
                    setFormData({ ...formData, nationalId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter national ID"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-indigo-600" />
              Location Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-indigo-600" />
              Employment Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) =>
                    setFormData({ ...formData, occupation: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter occupation"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employer
                </label>
                <input
                  type="text"
                  value={formData.employer}
                  onChange={(e) =>
                    setFormData({ ...formData, employer: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter employer name"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/admin/manage/${id}`)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
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
        </form>
      </div>
    </div>
  );
}