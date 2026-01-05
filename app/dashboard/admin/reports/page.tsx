///home/hp/JERE/AutoNest/app/dashboard/admin/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Trash2,
  RefreshCw,
  Plus,
  Calendar,
  User,
  Receipt,
  Eye,
  Loader2,
  Search,
  Users,
  X,
} from "lucide-react";
import { reportsApi, dashboardApi, userApi } from "@/app/lib/api-client";

interface Report {
  id: string;
  type: string;
  title: string;
  fileName: string;
  pdfBase64: string;
  metadata?: any;
  createdAt: string;
}

interface UserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
}

export default function AdminReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportType, setReportType] = useState<"transaction" | "customer">("transaction");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await reportsApi.getAll();
      if (response.success && response.data) {
        setReports(response.data);
        toast.success(`📊 Loaded ${response.data.length} reports`);
      } else {
        console.warn('Failed to load reports:', response.error);
        toast.warning('⚠️ Could not load reports');
        setReports([]);
      }
    } catch (err) {
      console.error('Error loading reports:', err);
      toast.error('Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await userApi.getAll();
      if (response.success && response.users) {
        setUsers(response.users.filter((u: UserData) => u.role === "customer"));
      } else {
        console.warn('Failed to load users:', response.error);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setUsers([]);
    }
  };

  const openGenerateModal = (type: "transaction" | "customer") => {
    setReportType(type);
    setSelectedUserId("");
    setShowGenerateModal(true);
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      if (reportType === "transaction") {
        const transactionsResponse = await dashboardApi.getTransactions();
        if (!transactionsResponse.success || !transactionsResponse.transactions) {
          toast.error('Failed to fetch transactions');
          return;
        }

        const response = await reportsApi.generateTransactionReport({
          title: `Transaction Report - ${new Date().toLocaleDateString()}${
            selectedUserId ? ` (User: ${selectedUserId})` : " (All Users)"
          }`,
          transactions: transactionsResponse.transactions.map((tx: any) => ({
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            status: tx.status,
            createdAt: tx.createdAt,
          })),
        });

        if (response.success) {
          toast.success('✅ Transaction report generated successfully');
          setShowGenerateModal(false);
          await loadReports();
        } else {
          toast.error(response.error || 'Failed to generate report');
        }
      } else {
        // Customer report
        const targetUserId = selectedUserId || localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : null;
        
        if (!targetUserId) {
          toast.error('Please select a user');
          return;
        }

        const [userResponse, transactionsResponse] = await Promise.all([
          userApi.getById(targetUserId),
          dashboardApi.getTransactions(),
        ]);

        if (!userResponse.success || !userResponse.user) {
          toast.error('Failed to fetch user data');
          return;
        }

        const response = await reportsApi.generateCustomerReport({
          title: `Customer Report - ${userResponse.user.firstName} ${userResponse.user.lastName} - ${new Date().toLocaleDateString()}`,
          user: {
            id: userResponse.user.id,
            email: userResponse.user.email,
            firstName: userResponse.user.firstName,
            lastName: userResponse.user.lastName,
          },
          transactions: transactionsResponse.success ? transactionsResponse.transactions : [],
        });

        if (response.success) {
          toast.success('✅ Customer report generated successfully');
          setShowGenerateModal(false);
          await loadReports();
        } else {
          toast.error(response.error || 'Failed to generate report');
        }
      }
    } catch (err) {
      console.error('Error generating report:', err);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleView = async (report: Report) => {
    try {
      // If we don't have the full PDF data, fetch it
      if (!report.pdfBase64) {
        const response = await reportsApi.getById(report.id);
        if (response.success && response.data) {
          setViewingReport(response.data);
        } else {
          toast.error('Failed to load report');
        }
      } else {
        setViewingReport(report);
      }
    } catch (err) {
      console.error('Error viewing report:', err);
      toast.error('Failed to view report');
    }
  };

  const handleDownload = async (report: Report) => {
    try {
      toast.info('📥 Downloading report...');
      
      // If we don't have the PDF data, fetch it first
      let pdfData = report.pdfBase64;
      if (!pdfData) {
        const response = await reportsApi.getById(report.id);
        if (response.success && response.data?.pdfBase64) {
          pdfData = response.data.pdfBase64;
        } else {
          toast.error('Failed to load report data');
          return;
        }
      }

      reportsApi.downloadPDF(pdfData, report.fileName);
      toast.success('✅ Report downloaded successfully');
    } catch (err) {
      console.error('Error downloading report:', err);
      toast.error('Failed to download report');
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await reportsApi.delete(reportId);
      if (response.success) {
        toast.success('✅ Report deleted successfully');
        setReports(reports.filter((r) => r.id !== reportId));
      } else {
        toast.error(response.error || 'Failed to delete report');
      }
    } catch (err) {
      console.error('Error deleting report:', err);
      toast.error('Failed to delete report');
    }
  };

  const filteredReports = reports.filter((report) =>
    searchTerm === "" ||
    report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const storedUser = userStr ? JSON.parse(userStr) : null;

    if (!storedUser || storedUser.role !== 'admin') {
      toast.error('Access denied');
      router.push('/dashboard/customer');
      return;
    }

    setUser(storedUser);
    loadReports();
    loadUsers();
  }, [router]);

  if (loading && !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <FileText size={32} />
              Reports Management
            </h1>
            <p className="text-indigo-100 mt-2">
              Generate, view, and manage system-wide reports
            </p>
          </div>
          <button
            onClick={loadReports}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition font-semibold shadow-lg disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Generate Reports Section */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus size={24} className="text-indigo-600" />
          Generate New Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => openGenerateModal("transaction")}
            className="flex flex-col items-center gap-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
          >
            <Receipt size={48} />
            <span className="font-semibold text-lg">Transaction Report</span>
            <span className="text-sm text-blue-100">
              Generate for all users or specific user
            </span>
          </button>

          <button
            onClick={() => openGenerateModal("customer")}
            className="flex flex-col items-center gap-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition shadow-lg"
          >
            <User size={48} />
            <span className="font-semibold text-lg">Customer Report</span>
            <span className="text-sm text-purple-100">
              Account summary for specific customer
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search reports by title, type, or filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? "No reports found" : "No reports yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Generate your first report to get started"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Generate Report
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {report.type === "transaction" ? (
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Receipt className="text-blue-600" size={24} />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="text-purple-600" size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {report.title}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-4">
                {report.type === "customer"
                  ? "Customer Account Report"
                  : "Transaction History"}
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleView(report)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs"
                  title="View Report"
                >
                  <Eye size={14} />
                  View
                </button>
                <button
                  onClick={() => handleDownload(report)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                  title="Download Report"
                >
                  <Download size={14} />
                  Save
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  title="Delete Report"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Generate {reportType === "transaction" ? "Transaction" : "Customer"} Report
              </h2>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {reportType === "customer" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Customer <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a customer</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {reportType === "transaction" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select User (Optional)
                  </label>
                  <div className="relative">
                    <Users
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">All Users</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to generate report for all users
                  </p>
                </div>
              )}

              {generating && (
                <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <p className="text-sm text-blue-900">Generating report...</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  disabled={generating}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={generating || (reportType === "customer" && !selectedUserId)}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {viewingReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {viewingReport.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {viewingReport.fileName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(viewingReport)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Download size={16} />
                  Download
                </button>
                <button
                  onClick={() => setViewingReport(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <iframe
                src={`data:application/pdf;base64,${viewingReport.pdfBase64}`}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}