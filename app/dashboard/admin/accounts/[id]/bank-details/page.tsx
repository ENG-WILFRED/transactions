"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { accountsApi } from "@/app/lib/api-client";
import { toast } from "sonner";
import { CreditCard, Trash, Save, Loader2, ArrowLeft } from "lucide-react";

interface BankDetails {
  id?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branchCode?: string;
  branchName?: string;
}

export default function AccountBankDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [form, setForm] = useState<BankDetails>({ bankName: "", accountNumber: "", accountName: "", branchCode: "", branchName: "" });

  useEffect(() => {
    const load = async () => {
      if (!accountId) {
        toast.error("Missing account id");
        router.push("/dashboard/admin/accounts");
        return;
      }

      try {
        const res = await accountsApi.getBankDetails(accountId);
        if (res.success) {
          // API might return object or array; handle both
          const data = res.bankDetails || res.data || res.details || res;
          if (data) {
            // if array, take first
            const d = Array.isArray(data) ? data[0] : data;
            setBankDetails(d || null);
            setForm({
              bankName: d?.bankName || "",
              accountNumber: d?.accountNumber || "",
              accountName: d?.accountName || "",
              branchCode: d?.branchCode || "",
              branchName: d?.branchName || "",
            });
          } else {
            setBankDetails(null);
          }
        } else {
          // treat 404 or empty as no bank details
          setBankDetails(null);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bank details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [accountId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let res;
      if (bankDetails) {
        res = await accountsApi.updateBankDetails(accountId, form as any);
      } else {
        res = await accountsApi.createBankDetails(accountId, form as any);
      }

      if (res.success) {
        toast.success("Bank details saved");
        // reload
        const reload = await accountsApi.getBankDetails(accountId);
        if (reload.success) {
          const data = reload.bankDetails || reload.data || reload.details || reload;
          const d = Array.isArray(data) ? data[0] : data;
          setBankDetails(d || null);
          setForm({
            bankName: d?.bankName || "",
            accountNumber: d?.accountNumber || "",
            accountName: d?.accountName || "",
            branchCode: d?.branchCode || "",
            branchName: d?.branchName || "",
          });
        }
      } else {
        toast.error(res.error || "Failed to save bank details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save bank details");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete bank details for this account?")) return;
    setSaving(true);
    try {
      const res = await accountsApi.deleteBankDetails(accountId);
      if (res.success) {
        toast.success("Bank details deleted");
        setBankDetails(null);
        setForm({ bankName: "", accountNumber: "", accountName: "", branchCode: "", branchName: "" });
      } else {
        toast.error(res.error || "Failed to delete bank details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete bank details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/dashboard/admin/accounts/${accountId}/view`)}
            className="flex items-center gap-2 text-indigo-600 hover:underline mb-4"
          >
            <ArrowLeft size={18} /> Back to account
          </button>
          <h1 className="text-2xl font-bold">Account Bank Details</h1>
          <p className="text-gray-600 mt-1">Manage bank details associated with this account</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-gray-600">Loading bank details...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-white rounded-2xl p-6 border">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <CreditCard size={18} className="text-indigo-600" /> Current Bank Details
                </h3>

                {bankDetails ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Bank: <span className="font-semibold text-gray-900">{bankDetails.bankName}</span></p>
                    <p className="text-sm text-gray-600">Account Name: <span className="font-semibold text-gray-900">{bankDetails.accountName}</span></p>
                    <p className="text-sm text-gray-600">Account Number: <span className="font-semibold text-gray-900">{bankDetails.accountNumber}</span></p>
                    {bankDetails.branchCode && <p className="text-sm text-gray-600">Branch Code: <span className="font-semibold text-gray-900">{bankDetails.branchCode}</span></p>}
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => { /* focus form */ }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Edit</button>
                      <button onClick={handleDelete} disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-lg">{saving ? 'Deleting...' : 'Delete'}</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No bank details set for this account.</p>
                )}
              </div>
            </div>

            <div>
              <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border">
                <h3 className="font-bold mb-3">{bankDetails ? 'Update Bank Details' : 'Add Bank Details'}</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600">Bank Name *</label>
                    <input name="bankName" value={form.bankName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600">Account Name *</label>
                    <input name="accountName" value={form.accountName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600">Account Number *</label>
                    <input name="accountNumber" value={form.accountNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600">Branch Code</label>
                    <input name="branchCode" value={form.branchCode} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600">Branch Name</label>
                    <input name="branchName" value={form.branchName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2">
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} /> Save
                        </>
                      )}
                    </button>
                    <button type="button" onClick={() => {
                      setForm({ bankName: bankDetails?.bankName || "", accountNumber: bankDetails?.accountNumber || "", accountName: bankDetails?.accountName || "", branchCode: bankDetails?.branchCode || "", branchName: bankDetails?.branchName || "" });
                    }} className="px-4 py-2 bg-gray-200 rounded-lg">Reset</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
