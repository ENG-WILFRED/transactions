// File: /app/lib/api-client.ts
'use client';

import type {
  RegistrationFormData,
  RegistrationInitResponse,
  RegistrationStatusResponse,
  LoginResponse,
  OtpVerificationResponse,
  ChangePinFormData,
  ChangePinResponse,
  RequestPinResetFormData,
  RequestPinResetResponse,
  VerifyPinResetFormData,
  VerifyPinResetResponse,
  UssdLoginFormData,
  UssdLoginResponse,
} from './schemas';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
  [key: string]: any;
}

interface Report {
  id: string;
  type: string;
  title: string;
  fileName: string;
  pdfBase64: string;
  metadata?: any;
  createdAt: string;
}

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
        ...data,
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========================================
// AUTH API
// ========================================
export const authApi = {
  register: (data: RegistrationFormData) =>
    apiCall<RegistrationInitResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getRegisterStatus: (transactionId: string) =>
    apiCall<RegistrationStatusResponse>(`/api/auth/register/status/${transactionId}`, {
      method: 'GET',
    }),
  login: (data: { identifier: string; password: string }) =>
    apiCall<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  loginOtp: (data: { identifier: string; otp: string; newPassword?: string }) =>
    apiCall<OtpVerificationResponse>('/api/auth/login/otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  ussdLogin: (data: UssdLoginFormData) =>
    apiCall<UssdLoginResponse>('/api/auth/ussd-login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verify: () => apiCall('/api/auth/verify', { method: 'GET' }),
  sendOtp: (data: { identifier: string }) =>
    apiCall('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  resendOtp: (data: { identifier: string }) =>
    apiCall('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  changePin: (data: ChangePinFormData) =>
    apiCall<ChangePinResponse>('/api/auth/change-pin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  requestPinReset: (data: RequestPinResetFormData) =>
    apiCall<RequestPinResetResponse>('/api/auth/reset-pin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyPinReset: (data: VerifyPinResetFormData) =>
    apiCall<VerifyPinResetResponse>('/api/auth/reset-pin/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiCall('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  forgotPassword: (data: { identifier: string }) =>
    apiCall('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyForgotPassword: (data: { identifier: string; otp: string; newPassword: string }) =>
    apiCall('/api/auth/forgot-password/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  setPassword: (data: { password: string }) =>
    apiCall('/api/auth/set-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ========================================
// TERMS & CONDITIONS API
// ========================================
export const termsApi = {
  getCurrent: () => apiCall('/api/terms-and-conditions', { method: 'GET' }),
  update: (data: { body: string }) =>
    apiCall('/api/terms-and-conditions', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ========================================
// PAYMENT API
// ========================================
export const paymentApi = {
  initiate: (data: { amount: number; planId?: string; description?: string }) =>
    apiCall('/api/payment/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getStatus: (transactionId: string) =>
    apiCall(`/api/payment/status/${transactionId}`, { method: 'GET' }),
};

// ========================================
// DASHBOARD API
// ========================================
export const dashboardApi = {
  getUser: () => apiCall('/api/dashboard/user', { method: 'GET' }),
  getTransactions: () => apiCall('/api/dashboard/transactions', { method: 'GET' }),
  getStats: () => apiCall('/api/dashboard/stats', { method: 'GET' }),
};

// ========================================
// USER API
// ========================================
export const userApi = {
  getAll: () => apiCall('/api/users', { method: 'GET' }),
  getById: (userId: string) => apiCall(`/api/users/${userId}`, { method: 'GET' }),
  promoteToAdmin: (userId: string) =>
    apiCall(`/api/users/${userId}/promote`, { method: 'POST' }),
  demoteToCustomer: (userId: string) =>
    apiCall(`/api/users/${userId}/demote`, { method: 'POST' }),
  update: (userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    country?: string;
  }) =>
    apiCall(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (userId: string) =>
    apiCall(`/api/users/${userId}`, { method: 'DELETE' }),
};

// ========================================
// ADMIN API
// ========================================
export const adminApi = {
  createAdmin: (data: {
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    country?: string;
    userId?: string;
  }) =>
    apiCall('/api/auth/makeadmin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  listAdmins: () => apiCall('/api/admin/list', { method: 'GET' }),
};

// ========================================
// ACCOUNTS API (FULLY UPDATED)
// ========================================
export const accountsApi = {
  /**
   * GET /api/accounts
   * List all accounts (for admin: all accounts, for customer: their accounts)
   */
  getAll: () => apiCall('/api/accounts', { method: 'GET' }),

  /**
   * GET /api/accounts/{id}
   * Get detailed information about a specific account
   */
  getById: (id: string) => apiCall(`/api/accounts/${id}`, { method: 'GET' }),

  /**
   * GET /api/accounts/{id}/summary
   * Get account summary with all balances and recent transactions
   */
  getSummary: (id: string) => apiCall(`/api/accounts/${id}/summary`, { method: 'GET' }),

  /**
   * 🆕 POST /api/accounts/create
   * Create a new pension account for a user (Admin only)
   * NOTE: Ensure this endpoint exists in your backend
   */
  create: (data: {
    userId: string;
    accountTypeId: string;
    initialBalance?: number;
    accountStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }) =>
    apiCall('/api/accounts/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * 🆕 GET /api/accounts/user/{userId}
   * Get all accounts for a specific user (Admin only)
   * NOTE: Ensure this endpoint exists in your backend
   */
  getByUserId: (userId: string) =>
    apiCall(`/api/accounts/user/${userId}`, { method: 'GET' }),

  /**
   * POST /api/accounts/{id}/contribution
   * Add employee/employer contribution to an account
   */
  addContribution: (id: string, data: {
    employeeAmount: number;
    employerAmount: number;
    description?: string;
  }) =>
    apiCall(`/api/accounts/${id}/contribution`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/accounts/{accountNumber}/deposit
   * Deposit funds to an account (initiates M-Pesa STK Push)
   */
  deposit: (accountNumber: string, data: {
    amount: number;
    phone: string;
    description?: string;
  }) =>
    apiCall(`/api/accounts/${accountNumber}/deposit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/accounts/{id}/withdraw
   * Withdraw funds from an account
   */
  withdraw: (id: string, data: {
    amount: number;
    withdrawalType: string;
    description?: string;
  }) =>
    apiCall(`/api/accounts/${id}/withdraw`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/accounts/{id}/earnings
   * Add earnings to account (interest, investment returns, dividends)
   */
  addEarnings: (id: string, data: {
    type: 'interest' | 'investment' | 'dividend';
    amount: number;
    description?: string;
  }) =>
    apiCall(`/api/accounts/${id}/earnings`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * PUT /api/accounts/{id}/status
   * Update account status (ACTIVE, INACTIVE, SUSPENDED)
   */
  updateStatus: (id: string, data: {
    accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }) =>
    apiCall(`/api/accounts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * 🆕 PUT /api/accounts/{id}
   * Update account details (Admin only)
   */
  update: (id: string, data: {
    accountTypeId?: string;
    accountStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }) =>
    apiCall(`/api/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * 🆕 DELETE /api/accounts/{id}
   * Delete an account (Admin only, use with caution)
   */
  delete: (id: string) =>
    apiCall(`/api/accounts/${id}`, { method: 'DELETE' }),
};

// ========================================
// ACCOUNT TYPES API (FULLY UPDATED)
// ========================================
export const accountTypeApi = {
  /**
   * GET /api/account-types
   * List all available account types
   */
  getAll: () => apiCall('/api/account-types', { method: 'GET' }),

  /**
   * GET /api/account-types/{id}
   * Get details for a single account type
   */
  getById: (id: string) => apiCall(`/api/account-types/${id}`, { method: 'GET' }),

  /**
   * POST /api/account-types
   * Create a new account type (Admin only)
   */
  create: (data: {
    name: string;
    description: string;
    interestRate?: number;
    category?: string;
    minBalance?: number;
    maxBalance?: number;
    lockInPeriodMonths?: number;
    allowWithdrawals?: boolean;
    allowLoans?: boolean;
    metadata?: any;
  }) =>
    apiCall('/api/account-types', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * PUT /api/account-types/{id}
   * Update an existing account type (Admin only)
   */
  update: (id: string, data: Partial<{
    name: string;
    description: string;
    interestRate: number;
    category: string;
    minBalance: number;
    maxBalance: number;
    lockInPeriodMonths: number;
    allowWithdrawals: boolean;
    allowLoans: boolean;
    active: boolean;
    metadata: any;
  }>) =>
    apiCall(`/api/account-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE /api/account-types/{id}
   * Delete an account type (Admin only)
   */
  delete: (id: string) =>
    apiCall(`/api/account-types/${id}`, { method: 'DELETE' }),

  /**
   * 🆕 GET /api/account-types/{id}/accounts
   * Get all accounts using this account type
   */
  getAccounts: (id: string) =>
    apiCall(`/api/account-types/${id}/accounts`, { method: 'GET' }),
};

// ========================================
// REPORTS API
// ========================================
export const reportsApi = {
  generateTransactionReport: async (data: {
    title: string;
    transactions: Array<{
      id: string;
      type: string;
      amount: number;
      status: string;
      createdAt: string;
    }>;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/generate-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error generating transaction report:', error);
      return { success: false, error: 'Failed to generate transaction report' };
    }
  },
  generateCustomerReport: async (data: {
    title: string;
    user: { id: string; email: string; firstName?: string; lastName?: string };
    transactions: Array<any>;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/generate-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error generating customer report:', error);
      return { success: false, error: 'Failed to generate customer report' };
    }
  },
  generateAccountReport: async (data: {
    title: string;
    accountId: string;
    dateRange?: { start: string; end: string };
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/generate-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error generating account report:', error);
      return { success: false, error: 'Failed to generate account report' };
    }
  },
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching reports:', error);
      return { success: false, error: 'Failed to fetch reports' };
    }
  },
  getById: async (reportId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching report:', error);
      return { success: false, error: 'Failed to fetch report' };
    }
  },
  delete: async (reportId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting report:', error);
      return { success: false, error: 'Failed to delete report' };
    }
  },
  downloadPDF: (pdfBase64: string, fileName: string) => {
    try {
      const linkSource = `data:application/pdf;base64,${pdfBase64}`;
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw new Error('Failed to download PDF');
    }
  },
};

// ========================================
// HEALTH API
// ========================================
export const healthApi = {
  check: () => apiCall('/api/health'),
};