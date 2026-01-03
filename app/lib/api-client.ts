///home/hp/JERE/AutoNest/app/lib/api-client.ts

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

// Client library for calling the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
  [key: string]: any;
}

// Report interface
interface Report {
  id: string;
  type: string;
  title: string;
  fileName: string;
  pdfBase64: string;
  metadata?: any;
  createdAt: string;
}

// Helper function to get token
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

  // Add auth token if available
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

// Auth API calls - Following documented auth flow
export const authApi = {
  /**
   * POST /api/auth/register
   * Initiates registration and M-Pesa payment
   */
  register: (data: RegistrationFormData) =>
    apiCall<RegistrationInitResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * GET /api/auth/register/status/{transactionId}
   * Polls payment status and completes registration
   */
  getRegisterStatus: (transactionId: string) =>
    apiCall<RegistrationStatusResponse>(
      `/api/auth/register/status/${transactionId}`,
      {
        method: 'GET',
      }
    ),

  /**
   * POST /api/auth/login
   * Step 1: Verify password and send OTP
   */
  login: (data: { identifier: string; password: string }) =>
    apiCall<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/auth/login/otp
   * Step 2: Verify OTP and complete login
   * Optional newPassword required for first-time users (temporary password exchange)
   */
  loginOtp: (data: {
    identifier: string;
    otp: string;
    newPassword?: string;
  }) =>
    apiCall<OtpVerificationResponse>('/api/auth/login/otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/auth/ussd-login
   * USSD login using phone and PIN (no OTP)
   */
  ussdLogin: (data: UssdLoginFormData) =>
    apiCall<UssdLoginResponse>('/api/auth/ussd-login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * GET /api/auth/verify
   * Verify current JWT token validity
   */
  verify: () =>
    apiCall('/api/auth/verify', {
      method: 'GET',
    }),

  /**
   * POST /api/auth/send-otp
   * Send OTP to email (for resend functionality)
   * @deprecated Use resendOtp instead
   */
  sendOtp: (data: { identifier: string }) =>
    apiCall('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/auth/resend-otp
   * Resend OTP to user's email and phone
   * Validates user exists, OTP was previously generated, and OTP not expired
   */
  resendOtp: (data: { identifier: string }) =>
    apiCall('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/auth/change-pin
   * Change PIN (authenticated) - requires current PIN
   */
  changePin: (data: ChangePinFormData) =>
    apiCall<ChangePinResponse>('/api/auth/change-pin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/auth/reset-pin
   * Request PIN reset OTP - sends OTP to phone via SMS
   */
  requestPinReset: (data: RequestPinResetFormData) =>
    apiCall<RequestPinResetResponse>('/api/auth/reset-pin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/auth/reset-pin/verify
   * Verify OTP and reset PIN
   */
  verifyPinReset: (data: VerifyPinResetFormData) =>
    apiCall<VerifyPinResetResponse>('/api/auth/reset-pin/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Terms and Conditions API calls
export const termsApi = {
  /**
   * GET /api/terms-and-conditions
   * Get current terms and conditions
   */
  getCurrent: () =>
    apiCall('/api/terms-and-conditions', {
      method: 'GET',
    }),

  /**
   * PUT /api/terms-and-conditions
   * Update terms and conditions (Admin only)
   */
  update: (data: { body: string }) =>
    apiCall('/api/terms-and-conditions', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Payment API calls
export const paymentApi = {
  initiate: (data: {
    amount: number;
    planId?: string;
    description?: string;
  }) =>
    apiCall('/api/payment/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStatus: (transactionId: string) =>
    apiCall(`/api/payment/status/${transactionId}`, {
      method: 'GET',
    }),
};

// Dashboard API calls
export const dashboardApi = {
  getUser: () =>
    apiCall('/api/dashboard/user', {
      method: 'GET',
    }),

  getTransactions: () =>
    apiCall('/api/dashboard/transactions', {
      method: 'GET',
    }),

  getStats: () =>
    apiCall('/api/dashboard/stats', {
      method: 'GET',
    }),
};

// User API calls
export const userApi = {
  /**
   * GET /api/users
   * Get all users (Admin only)
   */
  getAll: () =>
    apiCall('/api/users', {
      method: 'GET',
    }),
    
  getById: (userId: string) =>
    apiCall(`/api/users/${userId}`, {
      method: 'GET',
    }),
    
  promoteToAdmin: (userId: string) =>
    apiCall(`/api/users/${userId}/promote`, {
      method: 'POST',
    }),
    
  demoteToCustomer: (userId: string) =>
    apiCall(`/api/users/${userId}/demote`, {
      method: 'POST',
    }),
};

// 🆕 Admin API calls (ADMIN ONLY)
export const adminApi = {
  /**
   * POST /api/auth/makeadmin
   * Create new admin user or promote existing customer to admin (Admin only - no payment required)
   * Creating new admin requires: email, phone, firstName, lastName
   * Promoting existing user accepts: email OR userId
   */
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
    userId?: string; // For promoting existing user
  }) =>
    apiCall('/api/auth/makeadmin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * GET /api/admin/list
   * Get all admin users (Admin only)
   */
  listAdmins: () =>
    apiCall('/api/admin/list', {
      method: 'GET',
    }),
};

// 🆕 ACCOUNTS API - Pension Account Management
export const accountsApi = {
  /**
   * GET /api/accounts
   * List all accounts for the current user
   */
  getAll: () =>
    apiCall('/api/accounts', {
      method: 'GET',
    }),

  /**
   * GET /api/accounts/{id}
   * Get account details
   */
  getById: (id: string) =>
    apiCall(`/api/accounts/${id}`, {
      method: 'GET',
    }),

  /**
   * GET /api/accounts/{id}/summary
   * Get account summary with all balances
   */
  getSummary: (id: string) =>
    apiCall(`/api/accounts/${id}/summary`, {
      method: 'GET',
    }),

  /**
   * POST /api/accounts/{id}/contribution
   * Add contribution to account
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
   * @param accountNumber - 8-digit account number (e.g., "00000001")
   * @param data - Deposit details including amount, phone, and description
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
   * Withdraw funds from account
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
   * Update account status
   */
  updateStatus: (id: string, data: {
    accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }) =>
    apiCall(`/api/accounts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Account Types API calls (ADMIN ONLY)
export const accountTypeApi = {
  /**
   * GET /api/account-types
   * Get all account types
   */
  getAll: () =>
    apiCall('/api/account-types', {
      method: 'GET',
    }),

  /**
   * GET /api/account-types/:id
   * Get single account type
   */
  getById: (id: string) =>
    apiCall(`/api/account-types/${id}`, {
      method: 'GET',
    }),

  /**
   * POST /api/account-types
   * Create new account type (Admin only)
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
   * PUT /api/account-types/:id
   * Update account type (Admin only)
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
    metadata: any;
  }>) =>
    apiCall(`/api/account-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE /api/account-types/:id
   * Delete account type (Admin only)
   */
  delete: (id: string) =>
    apiCall(`/api/account-types/${id}`, {
      method: 'DELETE',
    }),
};

// 🆕 Reports API - Report Generation and Management
export const reportsApi = {
  /**
   * POST /api/reports/generate-transaction
   * Generate transaction report
   */
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

  /**
   * POST /api/reports/generate-customer
   * Generate customer report
   */
  generateCustomerReport: async (data: {
    title: string;
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
    };
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

  /**
   * GET /api/reports
   * List all reports
   */
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching reports:', error);
      return { success: false, error: 'Failed to fetch reports' };
    }
  },

  /**
   * GET /api/reports/{reportId}
   * Get report by ID
   */
  getById: async (reportId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching report:', error);
      return { success: false, error: 'Failed to fetch report' };
    }
  },

  /**
   * DELETE /api/reports/{reportId}
   * Delete report
   */
  delete: async (reportId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting report:', error);
      return { success: false, error: 'Failed to delete report' };
    }
  },

  /**
   * Download PDF from base64
   * Utility function to download PDF reports
   */
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

// Health check
export const healthApi = {
  check: () => apiCall('/api/health'),
};