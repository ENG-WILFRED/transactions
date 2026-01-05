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
const DEFAULT_TIMEOUT = 20000; // 20 seconds

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

// Helper function to create timeout promise
function createTimeoutPromise(timeoutMs: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeoutMs);
  });
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT
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
    const fetchPromise = fetch(url, {
      ...options,
      headers,
    });

    // Race between fetch and timeout
    const response = await Promise.race([
      fetchPromise,
      createTimeoutPromise(timeoutMs),
    ]) as Response;

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
  } catch (error: any) {
    // Don't log timeout errors to console during polling operations
    if (error.message !== 'Request timeout') {
      console.error('API call error:', error);
    }
    
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
  register: (data: RegistrationFormData, timeout?: number) =>
    apiCall<RegistrationInitResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  getRegisterStatus: (transactionId: string, timeout?: number) =>
    apiCall<RegistrationStatusResponse>(`/api/auth/register/status/${transactionId}`, {
      method: 'GET',
    }, timeout),
  login: (data: { identifier: string; password: string }, timeout?: number) =>
    apiCall<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  loginOtp: (data: { identifier: string; otp: string; newPassword?: string }, timeout?: number) =>
    apiCall<OtpVerificationResponse>('/api/auth/login/otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  ussdLogin: (data: UssdLoginFormData, timeout?: number) =>
    apiCall<UssdLoginResponse>('/api/auth/ussd-login', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  verify: (timeout?: number) => apiCall('/api/auth/verify', { method: 'GET' }, timeout),
  sendOtp: (data: { identifier: string }, timeout?: number) =>
    apiCall('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  resendOtp: (data: { identifier: string }, timeout?: number) =>
    apiCall('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  changePin: (data: ChangePinFormData, timeout?: number) =>
    apiCall<ChangePinResponse>('/api/auth/change-pin', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  requestPinReset: (data: RequestPinResetFormData, timeout?: number) =>
    apiCall<RequestPinResetResponse>('/api/auth/reset-pin', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  verifyPinReset: (data: VerifyPinResetFormData, timeout?: number) =>
    apiCall<VerifyPinResetResponse>('/api/auth/reset-pin/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  changePassword: (data: { currentPassword: string; newPassword: string }, timeout?: number) =>
    apiCall('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  forgotPassword: (data: { identifier: string }, timeout?: number) =>
    apiCall('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  verifyForgotPassword: (data: { identifier: string; otp: string; newPassword: string }, timeout?: number) =>
    apiCall('/api/auth/forgot-password/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  setPassword: (data: { password: string }, timeout?: number) =>
    apiCall('/api/auth/set-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
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
  }, timeout?: number) =>
    apiCall('/api/auth/makeadmin', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  demote: (data: { userId: string }, timeout?: number) =>
    apiCall('/api/auth/demote', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
};

// ========================================
// TERMS & CONDITIONS API
// ========================================
export const termsApi = {
  getCurrent: (timeout?: number) => apiCall('/api/terms-and-conditions', { method: 'GET' }, timeout),
  update: (data: { body: string }, timeout?: number) =>
    apiCall('/api/terms-and-conditions', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, timeout),
};

// ========================================
// PAYMENT API
// ========================================
export const paymentApi = {
  initiate: (data: { amount: number; planId?: string; description?: string }, timeout?: number) =>
    apiCall('/api/payment/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  getStatus: (transactionId: string, timeout?: number) =>
    apiCall(`/api/payment/status/${transactionId}`, { method: 'GET' }, timeout),
};

// ========================================
// DASHBOARD API
// ========================================
export const dashboardApi = {
  getUser: (timeout?: number) => apiCall('/api/dashboard/user', { method: 'GET' }, timeout),
  getTransactions: (timeout?: number) => apiCall('/api/dashboard/transactions', { method: 'GET' }, timeout),
  getStats: (timeout?: number) => apiCall('/api/dashboard/stats', { method: 'GET' }, timeout),
};

// ========================================
// USER API
// ========================================
export const userApi = {
  getAll: (timeout?: number) => apiCall('/api/users', { method: 'GET' }, timeout),
  getById: (userId: string, timeout?: number) => apiCall(`/api/users/${userId}`, { method: 'GET' }, timeout),
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
  }, timeout?: number) =>
    apiCall(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, timeout),
  delete: (userId: string, timeout?: number) =>
    apiCall(`/api/users/${userId}`, { method: 'DELETE' }, timeout),
  updateBankDetails: (userId: string, data: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    branchCode?: string;
  }, timeout?: number) =>
    apiCall(`/api/users/${userId}/bank-details`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, timeout),
  getUserNamesByPhone: (phone: string, timeout?: number) =>
    apiCall(`/api/users/user-names-by-phone?phone=${phone}`, { method: 'GET' }, timeout),
  promoteToAdmin: async (userId: string, timeout?: number) => {
    try {
      const userResponse = await userApi.getById(userId, timeout);
      if (!userResponse.success || !userResponse.user) {
        return { success: false, error: 'User not found' };
      }

      const user = userResponse.user;
      
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
      }, timeout);

      return response;
    } catch (error) {
      console.error('Error promoting user:', error);
      return { success: false, error: 'Failed to promote user' };
    }
  },
  demoteToCustomer: async (userId: string, timeout?: number) => {
    try {
      const response = await authApi.demote({ userId }, timeout);
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
  }, timeout?: number) =>
    apiCall('/api/auth/makeadmin', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  listAdmins: (timeout?: number) => apiCall('/api/admin/list', { method: 'GET' }, timeout),
};

// ========================================
// ACCOUNTS API
// ========================================
export const accountsApi = {
  getAll: (timeout?: number) => apiCall('/api/accounts', { method: 'GET' }, timeout),
  getById: (id: string, timeout?: number) => apiCall(`/api/accounts/${id}`, { method: 'GET' }, timeout),
  getSummary: (id: string, timeout?: number) => apiCall(`/api/accounts/${id}/summary`, { method: 'GET' }, timeout),
  create: (data: {
    userId: string;
    accountTypeId: string;
    initialBalance?: number;
    accountStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }, timeout?: number) =>
    apiCall('/api/accounts/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  getByUserId: (userId: string, timeout?: number) =>
    apiCall(`/api/accounts/user/${userId}`, { method: 'GET' }, timeout),
  addContribution: (id: string, data: {
    employeeAmount: number;
    employerAmount: number;
    description?: string;
  }, timeout?: number) =>
    apiCall(`/api/accounts/${id}/contribution`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  deposit: (accountNumber: string, data: {
    amount: number;
    phone: string;
    description?: string;
  }, timeout?: number) =>
    apiCall(`/api/accounts/${accountNumber}/deposit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  withdraw: (id: string, data: {
    amount: number;
    withdrawalType: string;
    description?: string;
  }, timeout?: number) =>
    apiCall(`/api/accounts/${id}/withdraw`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  addEarnings: (id: string, data: {
    type: 'interest' | 'investment' | 'dividend';
    amount: number;
    description?: string;
  }, timeout?: number) =>
    apiCall(`/api/accounts/${id}/earnings`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
  updateStatus: (id: string, data: {
    accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }, timeout?: number) =>
    apiCall(`/api/accounts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, timeout),
  update: (id: string, data: {
    accountTypeId?: string;
    accountStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  }, timeout?: number) =>
    apiCall(`/api/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, timeout),
  delete: (id: string, timeout?: number) =>
    apiCall(`/api/accounts/${id}`, { method: 'DELETE' }, timeout),
};

// ========================================
// ACCOUNT TYPES API
// ========================================
export const accountTypeApi = {
  getAll: (timeout?: number) => apiCall('/api/account-types', { method: 'GET' }, timeout),
  getById: (id: string, timeout?: number) => apiCall(`/api/account-types/${id}`, { method: 'GET' }, timeout),
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
  }, timeout?: number) =>
    apiCall('/api/account-types', {
      method: 'POST',
      body: JSON.stringify(data),
    }, timeout),
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
  }>, timeout?: number) =>
    apiCall(`/api/account-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, timeout),
  delete: (id: string, timeout?: number) =>
    apiCall(`/api/account-types/${id}`, { method: 'DELETE' }, timeout),
  getAccounts: (id: string, timeout?: number) =>
    apiCall(`/api/account-types/${id}/accounts`, { method: 'GET' }, timeout),
};

// ========================================
// TRANSACTIONS API
// ========================================
export const transactionsApi = {
  getAll: (timeout?: number) => apiCall('/api/transactions', { method: 'GET' }, timeout),
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
  }, timeout?: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/generate-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(timeout || DEFAULT_TIMEOUT),
      });
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error: any) {
      if (error.name === 'TimeoutError' || error.message === 'Request timeout') {
        return { success: false, error: 'Request timeout' };
      }
      console.error('Error generating transaction report:', error);
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
  }, timeout?: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/generate-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(timeout || DEFAULT_TIMEOUT),
      });
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error: any) {
      if (error.name === 'TimeoutError' || error.message === 'Request timeout') {
        return { success: false, error: 'Request timeout' };
      }
      console.error('Error generating customer report:', error);
      return { success: false, error: 'Failed to generate customer report' };
    }
  },

  getAll: async (timeout?: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        signal: AbortSignal.timeout(timeout || DEFAULT_TIMEOUT),
      });
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error: any) {
      if (error.name === 'TimeoutError' || error.message === 'Request timeout') {
        return { success: false, error: 'Request timeout' };
      }
      console.error('Error fetching reports:', error);
      return { success: false, error: 'Failed to fetch reports' };
    }
  },

  getById: async (reportId: string, timeout?: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        signal: AbortSignal.timeout(timeout || DEFAULT_TIMEOUT),
      });
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error: any) {
      if (error.name === 'TimeoutError' || error.message === 'Request timeout') {
        return { success: false, error: 'Request timeout' };
      }
      console.error('Error fetching report:', error);
      return { success: false, error: 'Failed to fetch report' };
    }
  },

  delete: async (reportId: string, timeout?: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        signal: AbortSignal.timeout(timeout || DEFAULT_TIMEOUT),
      });
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error: any) {
      if (error.name === 'TimeoutError' || error.message === 'Request timeout') {
        return { success: false, error: 'Request timeout' };
      }
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
  check: (timeout?: number) => apiCall('/api/health', {}, timeout),
};