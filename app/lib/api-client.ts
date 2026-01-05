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

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pension-backend-rs4h.onrender.com';
const API_TIMEOUT = 30000; // 30 seconds timeout

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

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Custom timeout error class
 */
class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError('Request timeout - server took too long to respond');
    }
    throw error;
  }
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
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
    const response = await fetchWithTimeout(
      url,
      {
        ...options,
        headers,
      },
      timeout
    );

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
    // Handle timeout errors gracefully
    if (error instanceof TimeoutError) {
      return {
        success: false,
        error: 'Request timeout - server is taking too long to respond. Please try again.',
      };
    }
    
    // Handle network errors
    if (error instanceof Error) {
      // Don't log timeout or network errors to console (they're expected)
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return {
          success: false,
          error: 'Network error - please check your internet connection',
        };
      }
    }
    
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
    }, 45000), // 45 seconds for registration (longer due to M-Pesa integration)
  getRegisterStatus: (transactionId: string) =>
    apiCall<RegistrationStatusResponse>(`/api/auth/register/status/${transactionId}`, {
      method: 'GET',
    }, 20000), // 20 seconds for status checks (shorter for polling)
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
  // Promote user to admin
  makeAdmin: (data: {
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
  // Demote admin to customer
  demote: (data: { userId: string }) =>
    apiCall('/api/auth/demote', {
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
// USER API (FULLY UPDATED WITH ALL ENDPOINTS)
// ========================================
export const userApi = {
  /**
   * GET /api/users
   * List all registered users (admin only)
   */
  getAll: () => apiCall('/api/users', { method: 'GET' }),
  
  /**
   * GET /api/users/{id}
   * Get a user by id (self or admin)
   */
  getById: (userId: string) => apiCall(`/api/users/${userId}`, { method: 'GET' }),
  
  /**
   * PUT /api/users/{id}
   * Update a user (self or admin)
   */
  update: (userId: string, data: {
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
  }) =>
    apiCall(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  /**
   * DELETE /api/users/{id}
   * Delete a user (admin only)
   */
  delete: (userId: string) =>
    apiCall(`/api/users/${userId}`, { method: 'DELETE' }),
  
  /**
   * PUT /api/users/{id}/bank-details
   * Update bank details for a user's account (self or admin)
   */
  updateBankDetails: (userId: string, data: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    branchCode?: string;
  }) =>
    apiCall(`/api/users/${userId}/bank-details`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  /**
   * GET /api/users/user-names-by-phone
   * Get a user's first and last name by phone number (public)
   */
  getUserNamesByPhone: (phone: string) =>
    apiCall(`/api/users/user-names-by-phone?phone=${phone}`, { method: 'GET' }),
  
  /**
   * Promote user to admin (uses POST /api/auth/makeadmin)
   */
  promoteToAdmin: async (userId: string) => {
    try {
      // First get user details
      const userResponse = await userApi.getById(userId);
      if (!userResponse.success || !userResponse.user) {
        return { success: false, error: 'User not found' };
      }

      const user = userResponse.user;
      
      // Then promote to admin
      const response = await authApi.makeAdmin({
        userId: userId,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        city: user.city,
        country: user.country,
      });

      return response;
    } catch (error) {
      console.error('Error promoting user:', error);
      return { success: false, error: 'Failed to promote user' };
    }
  },
  
  /**
   * Demote admin to customer (uses POST /api/auth/demote)
   */
  demoteToCustomer: async (userId: string) => {
    try {
      const response = await authApi.demote({ userId });
      return response;
    } catch (error) {
      console.error('Error demoting user:', error);
      return { success: false, error: 'Failed to demote user' };
    }
  },
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
  getAll: () => apiCall('/api/accounts', { method: 'GET' }),
  getById: (id: string) => apiCall(`/api/accounts/${id}`, { method: 'GET' }),
  getSummary: (id: string) => apiCall(`/api/accounts/${id}/summary`, { method: 'GET' }),
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
  getByUserId: (userId: string) =>
    apiCall(`/api/accounts/user/${userId}`, { method: 'GET' }),
  addContribution: (id: string, data: {
    employeeAmount: number;
    employerAmount: number;
    description?: string;
  }) =>
    apiCall(`/api/accounts/${id}/contribution`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deposit: (accountNumber: string, data: {
    amount: number;
    phone: string;
    description?: string;
  }) =>
    apiCall(`/api/accounts/${accountNumber}/deposit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  withdraw: (id: string, data: {
    amount: number;
    withdrawalType: string;
    description?: string;
  }) =>
    apiCall(`/api/accounts/${id}/withdraw`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  addEarnings: (id: string, data: {
    type: 'interest' | 'investment' | 'dividend';
    amount: number;
    description?: string;
  }) =>
    apiCall(`/api/accounts/${id}/earnings`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatus: (id: string, data: {
    accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }) =>
    apiCall(`/api/accounts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: {
    accountTypeId?: string;
    accountStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }) =>
    apiCall(`/api/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/api/accounts/${id}`, { method: 'DELETE' }),
};

// ========================================
// ACCOUNT TYPES API (FULLY UPDATED)
// ========================================
export const accountTypeApi = {
  getAll: () => apiCall('/api/account-types', { method: 'GET' }),
  getById: (id: string) => apiCall(`/api/account-types/${id}`, { method: 'GET' }),
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
    active?: boolean;
    metadata?: any;
  }) =>
    apiCall('/api/account-types', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
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
  delete: (id: string) =>
    apiCall(`/api/account-types/${id}`, { method: 'DELETE' }),
  getAccounts: (id: string) =>
    apiCall(`/api/account-types/${id}/accounts`, { method: 'GET' }),
};

// ========================================
// TRANSACTIONS API
// ========================================
export const transactionsApi = {
  /**
   * GET /api/transactions
   * Get all transactions (admin only)
   */
  getAll: () => apiCall('/api/transactions', { method: 'GET' }),
};

// ========================================
// REPORTS API (UPDATED TO MATCH BACKEND)
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/reports/generate-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error) {
      console.error('Error generating transaction report:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: 'Request timeout - server took too long to respond' };
      }
      return { success: false, error: 'Failed to generate transaction report' };
    }
  },

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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/reports/generate-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error) {
      console.error('Error generating customer report:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: 'Request timeout - server took too long to respond' };
      }
      return { success: false, error: 'Failed to generate customer report' };
    }
  },

  getAll: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error) {
      console.error('Error fetching reports:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: 'Request timeout - server took too long to respond' };
      }
      return { success: false, error: 'Failed to fetch reports' };
    }
  },

  getById: async (reportId: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error) {
      console.error('Error fetching report:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: 'Request timeout - server took too long to respond' };
      }
      return { success: false, error: 'Failed to fetch report' };
    }
  },

  delete: async (reportId: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error) {
      console.error('Error deleting report:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: 'Request timeout - server took too long to respond' };
      }
      return { success: false, error: 'Failed to delete report' };
    }
  },

  downloadPDF: (pdfBase64: string, fileName: string) => {
    try {
      const linkSource = `data:application/pdf;base64,${pdfBase64}`;
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw new Error('Failed to download PDF');
    }
  },

  viewPDF: (pdfBase64: string) => {
    try {
      const blob = base64ToBlob(pdfBase64, 'application/pdf');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error viewing PDF:', error);
      throw new Error('Failed to view PDF');
    }
  },
};

function base64ToBlob(base64: string, contentType: string = ''): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

// ========================================
// HEALTH API
// ========================================
export const healthApi = {
  check: () => apiCall('/api/health'),
};