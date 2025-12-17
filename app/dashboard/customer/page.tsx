"use client";

import Link from "next/link";

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Customer Dashboard</h1>
            <p className="text-gray-600 mt-1">Your pension overview and contributions.</p>
          </div>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">← Back</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-sm text-gray-500">Current Balance</h3>
            <p className="text-3xl font-bold mt-2">KES 42,780.50</p>
            <p className="text-sm text-gray-500 mt-2">Updated just now</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-sm text-gray-500">Next Contribution</h3>
            <p className="text-2xl font-semibold mt-2">KES 2,000</p>
            <p className="text-sm text-gray-500 mt-2">Due in 5 days</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold mb-4">Recent Contributions</h3>
          <ul className="divide-y">
            <li className="py-3 flex justify-between">
              <div>
                <div className="font-medium">Monthly contribution</div>
                <div className="text-sm text-gray-500">Plan: Growth Pension</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">KES 2,000</div>
                <div className="text-sm text-gray-500">2 days ago</div>
              </div>
            </li>
            <li className="py-3 flex justify-between">
              <div>
                <div className="font-medium">One-time top-up</div>
                <div className="text-sm text-gray-500">Plan: Premium Pension</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">KES 10,000</div>
                <div className="text-sm text-gray-500">3 months ago</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
