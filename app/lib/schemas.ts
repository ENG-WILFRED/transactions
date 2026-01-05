///home/hp/JERE/AutoNest/app/lib/schemas.ts
import { z } from 'zod';

// Child schema for the children array
const childSchema = z.object({
  name: z.string().optional(),
  dob: z.string().optional(),
});

// Registration form schema - Updated to match backend API
export const registrationSchema = z.object({
  // Account credentials
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required for M-Pesa payment'),
  pin: z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits').optional().or(z.literal('')),
  
  // Bank account details
  bankAccountName: z.string().min(1, 'Bank account name is required'),
  bankAccountNumber: z.string().min(1, 'Bank account number is required'),
  bankBranchName: z.string().min(1, 'Bank branch name is required'),
  bankBranchCode: z.string().min(1, 'Bank branch code is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  
  // Personal information
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  spouseName: z.string().optional(),
  spouseDob: z.string().optional(),
  children: z.array(childSchema).optional(),
  nationalId: z.string().optional(),
  
  // Address
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  
  // Employment
  occupation: z.string().optional(),
  employer: z.string().optional(),
  salary: z.number().optional(),
  
  // Pension details
  contributionRate: z.number().optional(),
  retirementAge: z.number().optional(),
  accountType: z.enum(['MANDATORY', 'VOLUNTARY', 'INDIVIDUAL']).optional(),
  riskProfile: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  currency: z.enum(['KES', 'USD', 'EUR']).optional(),
  accountStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  kycVerified: z.boolean().optional(),
  complianceStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

// Login schema
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username required'),
  password: z.string().min(1, 'Password required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// OTP Verification schema
export const otpVerificationSchema = z.object({
  identifier: z.string().min(1, 'Email, username, or phone is required'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export type OtpVerificationData = z.infer<typeof otpVerificationSchema>;

// 🆕 Change PIN schema
export const changePinSchema = z.object({
  currentPin: z.string().regex(/^\d{4}$/, 'Current PIN must be exactly 4 digits'),
  newPin: z.string().regex(/^\d{4}$/, 'New PIN must be exactly 4 digits'),
}).refine((data) => data.currentPin !== data.newPin, {
  message: 'New PIN must be different from current PIN',
  path: ['newPin'],
});

export type ChangePinFormData = z.infer<typeof changePinSchema>;

// 🆕 Request PIN Reset schema
export const requestPinResetSchema = z.object({
  phone: z.string().regex(/^\+254\d{9}$/, 'Phone must be in format +254XXXXXXXXX'),
});

export type RequestPinResetFormData = z.infer<typeof requestPinResetSchema>;

// 🆕 Verify PIN Reset schema
export const verifyPinResetSchema = z.object({
  phone: z.string().regex(/^\+254\d{9}$/, 'Phone must be in format +254XXXXXXXXX'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  newPin: z.string().regex(/^\d{4}$/, 'New PIN must be exactly 4 digits'),
});

export type VerifyPinResetFormData = z.infer<typeof verifyPinResetSchema>;

// 🆕 USSD Login schema
export const ussdLoginSchema = z.object({
  phone: z.string().regex(/^\+254\d{9}$/, 'Phone must be in format +254XXXXXXXXX'),
  pin: z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits'),
});

export type UssdLoginFormData = z.infer<typeof ussdLoginSchema>;

// Auth Response types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'customer' | 'admin';
  numberOfChildren?: number;
  dateOfBirth?: string;
}

export interface RegistrationInitResponse {
  success: boolean;
  status: 'payment_initiated';
  message: string;
  transactionId: string;
  checkoutRequestId: string;
  statusCheckUrl: string;
}

export interface RegistrationStatusResponse {
  success: boolean;
  status: 'payment_pending' | 'registration_completed' | 'payment_failed';
  message: string;
  transactionId: string;
  token?: string;
  user?: User;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface OtpVerificationResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  temporary?: boolean;
  identifier?: string;
  error?: string;
}

// 🆕 PIN Management Response types
export interface ChangePinResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface RequestPinResetResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface VerifyPinResetResponse {
  success: boolean;
  message: string;
  error?: string;
}

// 🆕 USSD Login Response
export interface UssdLoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
  error?: string;
}