///home/hp/JERE/pension/app/components/RegisterForm.tsx

'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { registrationSchema, type RegistrationFormData } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ZodError } from 'zod';

import AccountCredentialsSection from './sections/AccountCredentialsSection';
import PersonalSection from './sections/PersonalSection';
import AddressSection from './sections/AddressSection';
import EmploymentSection from './sections/EmploymentSection';
import PensionSection from './sections/PensionSection';
import PaymentPendingModal from './sections/PaymentPendingModal';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pollRef = useRef<number | null>(null);

  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
    email: '',
    username: '',
    phone: '',
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
  });

  const [paymentPending, setPaymentPending] = useState<{
    transactionId?: string;
    checkoutRequestId?: string;
    statusCheckUrl?: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    // convert certain fields to numbers
    const numericFields = ['salary', 'contributionRate', 'retirementAge'];
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? (value ? Number(value) : undefined) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Multi-step UI state
  const [step, setStep] = useState(0);
  const steps = ['Account', 'Personal', 'Address', 'Employment', 'Pension'];

  const validateStep = (idx: number) => {
    const e: Record<string, string> = {};
    if (idx === 0) {
      if (!formData.username) e.username = 'Username is required';
      if (!formData.email) e.email = 'Email is required';
      if (!formData.phone) e.phone = 'Phone is required';
    }
    if (idx === 1) {
      // personal - optional but check for names if provided
      // no required fields here
    }
    if (idx === 2) {
      // address
    }
    if (idx === 3) {
      // employment
    }
    if (idx === 4) {
      // pension
      if (formData.contributionRate == null) e.contributionRate = 'Select contribution rate';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!validateStep(step)) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // last step -> submit
    // create a fake event to reuse handleSubmit
    await handleSubmit(new Event('submit') as unknown as FormEvent);
  };

  const handleBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (step > 0) setStep(step - 1);
  };

  const validateForm = () => {
    try {
      registrationSchema.parse(formData);
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

  const handleSubmit = async (e: FormEvent) => {
    // allow calling without an actual DOM event
    try { e.preventDefault?.(); } catch {}

    if (!validateForm()) {
      toast.error('⚠️ Please fix validation errors');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = formData;
      const result = await authApi.register(dataToSend as RegistrationFormData);
      
      if (!result.success) {
        const errorMsg = result.error || 'Registration failed';
        if (errorMsg.includes('already')) {
          toast.error('❌ Email or username already registered');
        } else if (errorMsg.includes('Payment') || errorMsg.includes('payment')) {
          toast.error('💳 Failed to initiate payment. Please check your details and try again.');
        } else {
          toast.error(errorMsg);
        }
        setLoading(false);
        return;
      }

      const { checkoutRequestId, statusCheckUrl, transactionId, message, status } = result as any;

      if (status === 'payment_initiated' || checkoutRequestId) {
        toast.success('💳 M-Pesa prompt sent to your phone!');
        toast.info('📱 Please check your phone and enter your M-Pesa PIN');
        setPaymentPending({ transactionId, checkoutRequestId, statusCheckUrl });
        setLoading(false);
        setPolling(true);
        return;
      }

      toast.success('✅ Account created successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      toast.error('⚠️ An unexpected error occurred');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!paymentPending?.transactionId || !polling) return;

    let attempts = 0;
    const maxAttempts = 120; // 4 minutes (120 * 2 seconds)

    const poll = async () => {
      attempts++;
      try {
        const res = await authApi.getRegisterStatus(paymentPending.transactionId as string);
        
        if (!res.success) {
          const status = (res as any).status;
          
          if (status === 'payment_failed') {
            toast.error('❌ Payment failed. Please try again.');
            setPolling(false);
            setPaymentPending(null);
            setLoading(false);
            return;
          }
          
          console.warn('Status check returned non-success', res);
        } else {
          const s = (res as any).status;
          
          // First poll: show waiting message
          if (s === 'payment_pending' && attempts === 1) {
            toast.loading('⏳ Waiting for payment confirmation...');
          }

          // Payment completed
          if (s === 'registration_completed') {
            const token = (res as any).token;
            if (token && typeof window !== 'undefined') {
              localStorage.setItem('auth_token', token);
            }
            toast.success('🎉 Registration completed! You are now signed in.');
            setPolling(false);
            setPaymentPending(null);
            setLoading(false);
            setTimeout(() => router.push('/dashboard'), 1500);
            return;
          }

          // Payment failed
          if (s === 'payment_failed') {
            toast.error('❌ Payment failed. Please try again.');
            setPolling(false);
            setPaymentPending(null);
            setLoading(false);
            return;
          }
        }

        // Timeout after 4 minutes of polling
        if (attempts >= maxAttempts) {
          toast.error('⏱️ Payment confirmation timeout. Please check the transaction status and try again.');
          setPolling(false);
          setPaymentPending(null);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    };

    poll();
    pollRef.current = window.setInterval(poll, 2000) as unknown as number;

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [paymentPending?.transactionId, polling, router]);

  if (paymentPending) {
    return (
      <PaymentPendingModal
        transactionId={paymentPending.transactionId}
        onCancel={() => {
          setPolling(false);
          setPaymentPending(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row">
      {/* Branding Panel - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 items-center justify-center p-12 min-h-screen relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <img
                src="/pensions.jpeg"
                alt="Pensions logo"
                className="w-28 h-28 object-cover rounded-2xl shadow-xl border-2 border-white/20"
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">Secure Your<br />Future Today</h1>
          
          {/* Subheading */}
          <p className="text-xl text-blue-100 mb-8 font-medium">Start your pension journey in minutes</p>

          {/* Process Steps */}
          <div className="space-y-4 text-left mt-12 pt-8 border-t border-white/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Create Account</p>
                <p className="text-blue-100 text-xs">Quick registration in 5 steps</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Quick Payment</p>
                <p className="text-blue-100 text-xs">Only 1 KES via M-Pesa</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Start Growing</p>
                <p className="text-blue-100 text-xs">Access your pension account</p>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <p className="text-white/60 text-xs mt-12 pt-8 border-t border-white/10">
            Join thousands managing their retirement
          </p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto flex flex-col rounded-none shadow-2xl">
          <div className="flex items-center justify-between gap-4 p-6 border-b">
            <div className="flex items-center gap-3">
                <img src="/pensions.jpeg" alt="Pensions" className="w-8 h-8 rounded-md object-cover shadow-sm" />
                <div className="text-lg font-semibold text-gray-900">PENSIONS</div>
              </div>
            <div>
              <Link href="/login" className="text-sm bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 px-4 py-2 rounded-lg shadow-sm text-indigo-600 hover:bg-indigo-50 font-semibold transition">Already registered? Sign in</Link>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600 mt-1">Step <span className="font-bold text-indigo-600">{step + 1}</span> of <span className="font-bold text-indigo-600">{steps.length}</span> — <span className="font-semibold">{steps[step]}</span></p>

              <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
              </div>
            </div>

            <form className="space-y-6 min-h-[55vh]" onSubmit={handleSubmit}>
              <div className="space-y-4 min-h-[50vh] flex flex-col">
              {step === 0 && (
                <div className="transform scale-100">
                  <AccountCredentialsSection
                    formData={{
                      email: formData.email as string,
                      phone: formData.phone as string,
                      username: formData.username as string,
                    }}
                    errors={errors}
                    onChange={handleChange}
                  />
                </div>
              )}

              {step === 1 && (
                <div className="transform scale-100">
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
                </div>
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
                  }}
                  onChange={handleChange}
                />
              )}
              </div>
            </form>
          </div>

          <div className="border-t bg-white p-4 lg:p-6 sticky bottom-0 shadow-xl">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 0}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold border-2 text-base transition ${step === 0 ? 'text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50' : 'text-indigo-700 border-indigo-300 hover:bg-indigo-50 bg-white'}`}
                >
                  ← Back
                </button>

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-base font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={(e) => handleNext(e as any)}
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-base font-semibold hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <span>Create & Pay 1 KES</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                {steps.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => { setStep(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-3 h-3 rounded-full transition ${i <= step ? 'bg-indigo-600 w-8 rounded-full' : 'bg-gray-300 hover:bg-gray-400'} focus:outline-none`}
                    aria-label={`Step ${i + 1}`}
                    title={s}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

