"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of users, funds, and plans.</p>
          </div>
          <nav className="space-x-4">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">← Back</Link>
            <Link href="/dashboard/customer" className="text-sm text-gray-600 hover:underline">Customer View</Link>
          </nav>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-sm text-gray-500">Active Users</h3>
            <p className="text-2xl font-bold mt-2">3,482</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-sm text-gray-500">Total Assets</h3>
            <p className="text-2xl font-bold mt-2">KES 128,430,000</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-sm text-gray-500">Active Plans</h3>
            <p className="text-2xl font-bold mt-2">12</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold mb-4">Recent Signups</h3>
          <div className="divide-y">
            <div className="py-3 flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1531123414780-f3d2a9f1b2d7?auto=format&fit=crop&w=200&q=60" alt="user" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">Amina K.</div>
                <div className="text-sm text-gray-500">Joined 2 hours ago</div>
              </div>
            </div>
            <div className="py-3 flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60" alt="user" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">Daniel M.</div>
                <div className="text-sm text-gray-500">Joined yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
