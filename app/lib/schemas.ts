import { z } from 'zod';

// Child schema for the children array
const childSchema = z.object({
  name: z.string().optional(),
  dob: z.string().optional(),
});

// Registration form schema
export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(1, 'Username is required'),
  phone: z.string().min(1, 'Phone number is required for payment'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  spouseName: z.string().optional(),
  spouseDob: z.string().optional(),
  children: z.array(childSchema).optional(),
  nationalId: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  salary: z.number().optional(),
  contributionRate: z.number().optional(),
  retirementAge: z.number().optional(),
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
