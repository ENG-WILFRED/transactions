'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi, termsApi } from '@/app/lib/api-client';
import { registrationSchema, type RegistrationFormData } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Zap, Lock } from 'lucide-react';
import { ZodError } from 'zod';

import AccountCredentialsSection from './sections/AccountCredentialsSection';
import PersonalSection from './sections/PersonalSection';
import AddressSection from './sections/AddressSection';
import EmploymentSection from './sections/EmploymentSection';
import PensionSection from './sections/PensionSection';
import PaymentPendingModal from './sections/PaymentPendingModal';
import TermsAndConditionsModal from './TermsAndConditionsModal';

// API TIMEOUT CONSTANTS
const API_TIMEOUT = 180000; 
const PAYMENT_TOTAL_TIMEOUT = 240000; 
const POLL_INTERVAL = 2000; 

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const pollStartTimeRef = useRef<number | null>(null);
  const pollAttemptsRef = useRef<number>(0);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string>(''); 
  const [termsContent, setTermsContent] = useState<string>('');
  const [loadingTerms, setLoadingTerms] = useState(false);

  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
    email: '',
    phone: '',
    pin: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankBranchName: '',
    bankBranchCode: '',
    bankName: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    spouseName: '',
    spouseDob: '',
    children: [],
    nationalId: '',
    address: '',
    city: '',
    country: '',
    occupation: '',
    employer: '',
    salary: undefined,
    contributionRate: undefined,
    retirementAge: undefined,
    accountType: 'MANDATORY',
    riskProfile: 'MEDIUM',
    currency: 'KES',
    accountStatus: 'ACTIVE',
    kycVerified: false,
    complianceStatus: 'PENDING',
  });

  const [paymentPending, setPaymentPending] = useState<{
    transactionId?: string;
    checkoutRequestId?: string;
    statusCheckUrl?: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const numericFields = ['salary', 'contributionRate', 'retirementAge'];
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? (value ? Number(value) : undefined) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const [step, setStep] = useState(0);
  const steps = [
    { title: 'Account', icon: '👤', desc: 'Your credentials' },
    { title: 'Personal', icon: '📋', desc: 'About you' },
    { title: 'Address', icon: '📍', desc: 'Your location' },
    { title: 'Employment', icon: '💼', desc: 'Work details' },
    { title: 'Pension & Bank', icon: '🏦', desc: 'Final setup' }
  ];

  const validateStep = (idx: number) => {
    const e: Record<string, string> = {};
    if (idx === 0) {
      if (!formData.email) e.email = 'Email is required';
      if (!formData.phone) e.phone = 'Phone is required';
      if (formData.pin && formData.pin.trim() !== '' && !/^\d{4}$/.test(formData.pin)) {
        e.pin = 'PIN must be exactly 4 digits if provided';
      }
    }
    if (idx === 4) {
      if (!formData.bankAccountName) e.bankAccountName = 'Bank account name is required';
      if (!formData.bankAccountNumber) e.bankAccountNumber = 'Bank account number is required';
      if (!formData.bankBranchName) e.bankBranchName = 'Bank branch name is required';
      if (!formData.bankBranchCode) e.bankBranchCode = 'Bank branch code is required';
      if (!formData.bankName) e.bankName = 'Bank name is required';
      if (formData.contributionRate == null) e.contributionRate = 'Select contribution rate';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleTermsClick = () => {
    setShowTermsModal(true);
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    if (checked) {
      setTermsError('');
    }
  };

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!validateStep(step)) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (!termsAccepted) {
      setTermsError('You must accept the Terms and Conditions to continue');
      toast.error('⚠️ Please accept the Terms and Conditions');
      return;
    }
    
    handleSubmit(new Event('submit') as unknown as FormEvent);
  };

  const handleBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (step > 0) setStep(step - 1);
  };

  const validateForm = () => {
    try {
      const cleanedData = {
        ...formData,
        pin: formData.pin && formData.pin.trim() !== '' ? formData.pin : undefined,
      };
      
      registrationSchema.parse(cleanedData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          const path = error.path.join('.');
          newErrors[path] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setTermsError('');
    setShowTermsModal(false);
    toast.success('✅ Terms and Conditions accepted');
  };

  const handleTermsDecline = () => {
    setShowTermsModal(false);
    toast.info('ℹ️ You must accept the Terms and Conditions to proceed');
  };

  const apiCallWithTimeout = async <T,>(
    apiPromise: Promise<T>,
    timeoutMs: number = API_TIMEOUT
  ): Promise<T> => {
    return Promise.race([
      apiPromise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
      ),
    ]);
  };

  const stopPolling = () => {
    console.log('[Register] Stopping polling...');
    setPolling(false);
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    pollAttemptsRef.current = 0;
    pollStartTimeRef.current = null;
  };

  const handleRegistrationSuccess = (token?: string, user?: any, account?: any) => {
    console.log('[Register] Registration successful!', { hasToken: !!token, hasUser: !!user, hasAccount: !!account });
    
    stopPolling();
    setPaymentPending(null);
    setLoading(false);
    
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      
      let userToStore = user;
      if (user && !user.role) {
        userToStore = {
          ...user,
          role: 'customer',
        };
      }
      
      if (userToStore) {
        localStorage.setItem('user', JSON.stringify(userToStore));
      }
      
      if (account) {
        console.log('[Register] Storing account data:', account);
        localStorage.setItem('account', JSON.stringify(account));
      }
    }
    
    toast.success('🎉 Registration completed! Redirecting to dashboard...');
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handleSubmit = async (e: FormEvent) => {
    try { e.preventDefault?.(); } catch {}

    if (!validateForm()) {
      toast.error('⚠️ Please fix validation errors');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        pin: formData.pin && formData.pin.trim() !== '' ? formData.pin : undefined,
        accountType: formData.accountType || 'MANDATORY',
        riskProfile: formData.riskProfile || 'MEDIUM',
        currency: formData.currency || 'KES',
        accountStatus: formData.accountStatus || 'ACTIVE',
        kycVerified: formData.kycVerified || false,
        complianceStatus: formData.complianceStatus || 'PENDING',
      };
      
      const result = await apiCallWithTimeout(
        authApi.register(dataToSend as RegistrationFormData),
        API_TIMEOUT
      );
      
      if (!result.success) {
        const errorMsg = result.error || 'Registration failed';
        if (errorMsg.includes('already')) {
          toast.error('❌ Email or phone already registered');
        } else if (errorMsg.includes('Payment') || errorMsg.includes('payment')) {
          toast.error('💳 Failed to initiate payment. Please check your details and try again.');
        } else if (errorMsg.includes('timeout') || errorMsg.includes('Timeout')) {
          toast.error('⏱️ Request timed out. Please check your connection and try again.');
        } else {
          toast.error(errorMsg);
        }
        setLoading(false);
        return;
      }

      const { checkoutRequestId, statusCheckUrl, transactionId, message, status, token, user, account } = result as any;

      if (status === 'registration_completed' || token) {
        handleRegistrationSuccess(token, user, account);
        return;
      }

      if (status === 'payment_initiated' || checkoutRequestId) {
        console.log('[Register] Payment initiated, starting polling...', { transactionId });
        toast.success('💳 M-Pesa prompt sent to your phone!');
        toast.info('📱 Please check your phone and enter your M-Pesa PIN');
        setPaymentPending({ transactionId, checkoutRequestId, statusCheckUrl });
        setLoading(false);
        setPolling(true);
        pollStartTimeRef.current = Date.now();
        pollAttemptsRef.current = 0;
        return;
      }

      toast.success('✅ Account created successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      if (err.message === 'Request timeout') {
        toast.error('⏱️ Request timed out. Please check your connection and try again.');
      } else {
        toast.error('⚠️ An unexpected error occurred');
      }
      console.error('[Register] Submit error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTerms = async () => {
      setLoadingTerms(true);
      try {
        const res = await apiCallWithTimeout(termsApi.getCurrent(), API_TIMEOUT);
        if (res.success && res.body) {
          setTermsContent(res.body);
        }
      } catch (err: any) {
        console.error('[Register] Failed to load terms:', err);
      } finally {
        setLoadingTerms(false);
      }
    };

    fetchTerms();
  }, []);

  useEffect(() => {
    if (!paymentPending?.transactionId || !polling) {
      return;
    }

    console.log('[Register] Starting payment polling...', { transactionId: paymentPending.transactionId });

    const maxAttempts = 120;

    const poll = async () => {
      pollAttemptsRef.current++;
      const attempts = pollAttemptsRef.current;
      
      const elapsedTime = Date.now() - (pollStartTimeRef.current || Date.now());
      if (elapsedTime > PAYMENT_TOTAL_TIMEOUT) {
        console.log('[Register] Payment timeout reached');
        toast.error('⏱️ Payment confirmation timeout. Please contact support if payment was deducted.');
        stopPolling();
        setPaymentPending(null);
        setLoading(false);
        return;
      }

      if (attempts >= maxAttempts) {
        console.log('[Register] Max polling attempts reached');
        toast.error('⏱️ Maximum attempts reached. Please check the transaction status.');
        stopPolling();
        setPaymentPending(null);
        setLoading(false);
        return;
      }

      try {
        console.log(`[Register] Polling attempt ${attempts}/${maxAttempts}...`);
        
        const res = await apiCallWithTimeout(
          authApi.getRegisterStatus(paymentPending.transactionId as string),
          API_TIMEOUT
        );
        
        console.log('[Register] Poll response:', { success: res.success, status: (res as any).status });

        if (res.success) {
          const { status, token, user, account } = res as any;
          
          if (status === 'registration_completed' && token) {
            console.log('[Register] Payment confirmed! Registration complete.', { account });
            handleRegistrationSuccess(token, user, account);
            return;
          }

          if (status === 'payment_failed') {
            console.log('[Register] Payment failed');
            toast.error('❌ Payment failed. Please try again.');
            stopPolling();
            setPaymentPending(null);
            setLoading(false);
            return;
          }

          if (status === 'payment_pending' && attempts === 1) {
            toast('⏳ Waiting for payment confirmation...', { duration: 3000 });
          }
        } else {
          const status = (res as any).status;
          
          if (status === 'payment_failed') {
            console.log('[Register] Payment failed (from error response)');
            toast.error('❌ Payment failed. Please try again.');
            stopPolling();
            setPaymentPending(null);
            setLoading(false);
            return;
          }
        }
      } catch (err: any) {
        if (err.message !== 'Request timeout') {
          console.error('[Register] Poll error:', err);
        }
      }
    };

    poll();
    
    pollRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [paymentPending?.transactionId, polling, router]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  if (paymentPending) {
    return (
      <PaymentPendingModal
        transactionId={paymentPending.transactionId}
        onCancel={() => {
          console.log('[Register] User cancelled payment');
          stopPolling();
          setPaymentPending(null);
          setLoading(false);
          toast.info('ℹ️ Payment confirmation cancelled. You can try registering again.');
        }}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen w-full flex flex-col lg:flex-row">
        {/* LEFT HALF - DARK THEME */}
        <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden min-h-screen">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Geometric patterns */}
          <div className="absolute top-20 right-20 w-64 h-64 border border-orange-500/10 rounded-full"></div>
          <div className="absolute bottom-32 left-16 w-80 h-80 border border-orange-500/5 rounded-full"></div>

          <div className="relative z-10 max-w-xl mx-auto w-full">
            {/* Logo */}
            <div className="mb-10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-3xl blur-2xl"></div>
                <img
                  src="/pensions.jpeg"
                  alt="AutoNest Pension logo"
                  className="relative w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-2xl shadow-2xl border-2 border-orange-500/30"
                />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Secure Your
              <span className="block text-transparent bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text mt-2">
                Future Today
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl lg:text-2xl text-slate-300 mb-12 font-light leading-relaxed">
              Join thousands building their retirement with AutoNest Pension
            </p>

            {/* Divider */}
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-transparent mb-10 rounded-full"></div>

            {/* Steps Overview */}
            <div className="space-y-5">
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Quick Setup</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Complete registration in just 5 simple steps</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Fast Activation</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Only 1 KES via M-Pesa to activate your account</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Bank-level Security</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Your data protected with enterprise encryption</p>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-3 border-slate-900"></div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-3 border-slate-900"></div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-3 border-slate-900"></div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Join <span className="font-bold text-white">10,000+</span> planning their retirement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT HALF - LIGHT PLEASANT COLOR */}
        <div className="lg:w-1/2 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col min-h-screen relative overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl"></div>

          {/* Header */}
          <div className="border-b border-slate-200/80 bg-white/60 backdrop-blur-md px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
              <img src="/pensions.jpeg" alt="AutoNest Pension" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
              <span className="text-lg font-bold text-slate-900">AutoNest Pension</span>
            </div>
            <Link 
              href="/login" 
              className="text-sm font-bold bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2 rounded-lg text-slate-700 transition"
            >
              Sign in
            </Link>
          </div>

          {/* Progress Indicator */}
          <div className="px-8 py-6 bg-white/40 backdrop-blur-sm border-b border-slate-200/80">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center">
                    <button
                      onClick={() => setStep(i)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        i === step 
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg scale-110' 
                          : i < step 
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </button>
                    {i < steps.length - 1 && (
                      <div className={`w-12 lg:w-20 h-1 mx-1 rounded-full transition-all ${
                        i < step ? 'bg-green-500' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">{steps[step].title}</p>
                <p className="text-xs text-slate-600">{steps[step].desc}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/50">
                <form onSubmit={handleSubmit} className="space-y-6 min-h-[400px]">
                  {step === 0 && (
                    <AccountCredentialsSection
                      formData={{
                        email: formData.email as string,
                        phone: formData.phone as string,
                        pin: formData.pin as string,
                      }}
                      errors={errors}
                      onChange={handleChange}
                    />
                  )}

                  {step === 1 && (
                    <PersonalSection
                      formData={{
                        firstName: formData.firstName as string,
                        lastName: formData.lastName as string,
                        gender: formData.gender as string,
                        dateOfBirth: formData.dateOfBirth as string,
                        nationalId: formData.nationalId as string,
                        maritalStatus: formData.maritalStatus as string,
                        spouseName: formData.spouseName as string,
                        spouseDob: formData.spouseDob as string,
                      }}
                      errors={errors}
                      onChange={handleChange}
                    />
                  )}

                  {step === 2 && (
                    <AddressSection
                      formData={{
                        address: formData.address as string,
                        city: formData.city as string,
                        country: formData.country as string,
                      }}
                      onChange={handleChange}
                    />
                  )}

                  {step === 3 && (
                    <EmploymentSection
                      formData={{
                        occupation: formData.occupation as string,
                        employer: formData.employer as string,
                        salary: formData.salary,
                      }}
                      onChange={handleChange}
                    />
                  )}

                  {step === 4 && (
                    <PensionSection
                      formData={{
                        contributionRate: formData.contributionRate,
                        retirementAge: formData.retirementAge,
                        bankAccountName: formData.bankAccountName as string,
                        bankAccountNumber: formData.bankAccountNumber as string,
                        bankBranchName: formData.bankBranchName as string,
                        bankBranchCode: formData.bankBranchCode as string,
                        bankName: formData.bankName as string,
                        accountType: formData.accountType,
                        riskProfile: formData.riskProfile,
                      }}
                      errors={errors}
                      onChange={handleChange}
                      termsAccepted={termsAccepted}
                      onTermsChange={handleTermsChange}
                      onTermsClick={handleTermsClick}
                      termsError={termsError}
                    />
                  )}
                </form>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 0}
                    className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                      step === 0 
                        ? 'text-slate-400 bg-slate-100 cursor-not-allowed' 
                        : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={loading}
                      className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/30 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <CheckCircle2 className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={handleTermsDecline}
        onAccept={handleTermsAccept}
        termsContent={termsContent}
        loading={loadingTerms}
      />
    </>
  );
}