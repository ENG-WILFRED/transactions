"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { accountTypeApi } from "@/app/lib/api-client";
import { Plus, Edit, Trash2, Loader2, X, CreditCard } from "lucide-react";

interface AccountType {
  id: string;
  name: string;
  description: string;
  interestRate?: number;
  category?: string;
  minBalance?: number;
  maxBalance?: number;
  lockInPeriodMonths?: number;
  allowWithdrawals?: boolean;
  allowLoans?: boolean;
}

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingType?: AccountType | null;
}

function CreateEditModal({ isOpen, onClose, onSuccess, editingType }: CreateEditModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    interestRate: "",
    category: "Individual",
    minBalance: "",
    maxBalance: "",
    lockInPeriodMonths: "",
    allowWithdrawals: true,
    allowLoans: true,
  });

  useEffect(() => {
    if (editingType) {
      setFormData({
        name: editingType.name,
        description: editingType.description,
        interestRate: editingType.interestRate?.toString() || "",
        category: editingType.category || "Individual",
        minBalance: editingType.minBalance?.toString() || "",
        maxBalance: editingType.maxBalance?.toString() || "",
        lockInPeriodMonths: editingType.lockInPeriodMonths?.toString() || "",
        allowWithdrawals: editingType.allowWithdrawals ?? true,
        allowLoans: editingType.allowLoans ?? true,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        interestRate: "",
        category: "Individual",
        minBalance: "",
        maxBalance: "",
        lockInPeriodMonths: "",
        allowWithdrawals: true,
        allowLoans: true,
      });
    }
  }, [editingType, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
        category: formData.category,
        minBalance: formData.minBalance ? parseFloat(formData.minBalance) : undefined,
        maxBalance: formData.maxBalance ? parseFloat(formData.maxBalance) : undefined,
        lockInPeriodMonths: formData.lockInPeriodMonths ? parseInt(formData.lockInPeriodMonths) : undefined,
        allowWithdrawals: formData.allowWithdrawals,
        allowLoans: formData.allowLoans,
      };

      const response = editingType
        ? await accountTypeApi.update(editingType.id, payload)
        : await accountTypeApi.create(payload);

      if (response.success) {
        toast.success(editingType ? '✅ Account type updated!' : '✅ Account type created!');
        onClose();
        onSuccess();
      } else {
        toast.error(response.error || 'Failed to save account type');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save account type');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {editingType ? 'Edit Account Type' : 'Create Account Type'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Type Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Individual Pension Account"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this account type"
                rows={3}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="Retirement">Retirement</option>
                <option value="Voluntary">Voluntary</option>
              </select>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="e.g., 8.5"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Min Balance */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Balance (KES)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minBalance}
                onChange={(e) => setFormData({ ...formData, minBalance: e.target.value })}
                placeholder="0"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Max Balance */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Balance (KES)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.maxBalance}
                onChange={(e) => setFormData({ ...formData, maxBalance: e.target.value })}
                placeholder="No limit"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Lock-in Period */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lock-in Period (Months)
              </label>
              <input
                type="number"
                value={formData.lockInPeriodMonths}
                onChange={(e) => setFormData({ ...formData, lockInPeriodMonths: e.target.value })}
                placeholder="0"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="md:col-span-2 space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.allowWithdrawals}
                  onChange={(e) => setFormData({ ...formData, allowWithdrawals: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Allow Withdrawals</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.allowLoans}
                  onChange={(e) => setFormData({ ...formData, allowLoans: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Allow Loans</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 transition font-semibold flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {editingType ? 'Update' : 'Create'} Account Type
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AccountTypesPage() {
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<AccountType | null>(null);

  const loadAccountTypes = async () => {
    setLoading(true);
    try {
      const response = await accountTypeApi.getAll();
      if (response.success && response.accountTypes) {
        setAccountTypes(response.accountTypes);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load account types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccountTypes();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await accountTypeApi.delete(id);
      if (response.success) {
        toast.success('✅ Account type deleted');
        loadAccountTypes();
      } else {
        toast.error(response.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete account type');
    }
  };

  const handleEdit = (type: AccountType) => {
    setEditingType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingType(null);
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="ml-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Types</h1>
          <p className="text-gray-600 mt-2">Manage pension account types</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          Create Account Type
        </button>
      </div>

      {/* Account Types List */}
      {accountTypes.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-12 text-center">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Account Types Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first account type to start managing pension accounts.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-indigo-600 text-white py-2 px-6 rounded-xl hover:bg-indigo-700 transition font-semibold inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create Account Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {type.category && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold text-gray-900">{type.category}</span>
                  </div>
                )}
                {type.interestRate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-semibold text-green-600">{type.interestRate}%</span>
                  </div>
                )}
                {type.minBalance !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Min Balance:</span>
                    <span className="font-semibold text-gray-900">
                      KES {type.minBalance.toLocaleString()}
                    </span>
                  </div>
                )}
                {type.lockInPeriodMonths && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lock-in Period:</span>
                    <span className="font-semibold text-gray-900">
                      {type.lockInPeriodMonths} months
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(type)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(type.id, type.name)}
                  className="flex-1 border border-red-300 text-red-700 py-2 px-3 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CreateEditModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          handleCloseModal();
          loadAccountTypes();
        }}
        editingType={editingType}
      />
    </div>
  );
}