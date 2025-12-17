'use client';

import { useState } from 'react';
import Link from 'next/link';
import { paymentApi } from '@/app/lib/api-client';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Pension Plan',
    description: 'Low-risk plan for steady long-term growth.',
    image:
      'https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&w=1200&q=60',
    price: 500,
  },
  {
    id: 'growth',
    name: 'Growth Pension Plan',
    description: 'Balanced portfolio for higher returns.',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=60',
    price: 2000,
  },
  {
    id: 'premium',
    name: 'Premium Pension Plan',
    description: 'Higher risk with potential for greater rewards.',
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=60',
    price: 10000,
  },
];

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInvest = async (planId: string, amount: number) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res: any = await paymentApi.initiate({ amount, planId, description: `Contribution to ${planId}` });
      if (!res.success) {
        setError(res.error || 'Failed to initiate payment');
        setLoading(false);
      } else if (res.paymentUrl) {
        // Redirect to external payment gateway
        window.location.href = res.paymentUrl;
      } else {
        setError('No payment gateway configured');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Pension Plans</h1>
            <p className="text-gray-600 mt-1">Choose a plan and make a contribution to your pension.</p>
          </div>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{message}</div>}

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl shadow p-4">
              <img src={plan.image} alt={plan.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-gray-600 mt-2 text-sm">{plan.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Suggested contribution</div>
                  <div className="text-lg font-semibold">KES {plan.price.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => handleInvest(plan.id, plan.price)}
                  disabled={loading}
                  className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading ? 'Processing...' : 'Invest'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
