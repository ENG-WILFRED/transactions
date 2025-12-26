"use client";

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import AnimatedFooter from '@/app/components/AnimatedFooter';
import { Users, Search, Download, CheckCircle } from 'lucide-react';
import { userApi } from '@/app/lib/api-client';

export default function AdminManageList() {
  const [members, setMembers] = useState(() => {
    return [
      { id: '1', name: 'Wilfred Kimani', email: 'kimaniwilfred95@gmail.com', joinDate: '2024-12-21', status: 'active', contribution: 33000, balance: 548000, role: 'admin' },
      { id: '2', name: 'Grace Ouma', email: 'grace.ouma@example.com', joinDate: '2024-12-19', status: 'active', contribution: 25000, balance: 425000, role: 'customer' },
      { id: '3', name: 'James Kipchoge', email: 'james.kipchoge@example.com', joinDate: '2024-12-18', status: 'active', contribution: 18000, balance: 285000, role: 'customer' },
      { id: '4', name: 'Mary Mutua', email: 'mary.mutua@example.com', joinDate: '2024-12-15', status: 'inactive', contribution: 12000, balance: 145000, role: 'customer' },
      { id: '5', name: 'Peter Mwangi', email: 'peter.mwangi@example.com', joinDate: '2024-12-12', status: 'active', contribution: 22000, balance: 380000, role: 'customer' },
      { id: '6', name: 'Susan Njoki', email: 'susan.njoki@example.com', joinDate: '2024-12-10', status: 'active', contribution: 28000, balance: 420000, role: 'customer' },
    ];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const next = m.status === 'active' ? 'inactive' : 'active';
        toast.success(`${m.name} is now ${next}`);
        return { ...m, status: next };
      }
      return m;
    }));
  };

  const promoteUser = async (id: string) => {
    try {
      const res = await userApi.promoteToAdmin(id);
      if (res.success) {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, role: 'admin' } : m));
        toast.success('User promoted to admin');
      } else {
        toast.error(res.error || 'Failed to promote user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to promote user');
    }
  };

  const demoteUser = async (id: string) => {
    try {
      const res = await userApi.demoteToCustomer(id);
      if (res.success) {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, role: 'customer' } : m));
        toast.success('User demoted to customer');
      } else {
        toast.error(res.error || 'Failed to demote user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to demote user');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-sm text-gray-600 mt-1">View and manage member accounts and permissions.</p>
            </div>
            <Link href="/dashboard/admin" className="text-sm text-blue-600 hover:underline">← Back to Admin</Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none w-full"
                />
              </div>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="flex items-center gap-2 justify-center bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 text-sm font-medium">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          {/* Members Table - Mobile Responsive */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-white/60">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="sm:w-6 sm:h-6 text-indigo-600" />
                Members ({filteredMembers.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 backdrop-blur-sm">
                  <tr>
                    {["Name", "Email", "Join Date", "Status", "Balance", "Action"].map((h) => (
                      <th
                        key={h}
                        className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white/60">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{m.name}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 hidden sm:table-cell">{m.email}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{new Date(m.joinDate).toLocaleDateString()}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                          m.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {m.status === 'active' && <CheckCircle size={14} />}
                          {m.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-900 hidden lg:table-cell">KES {m.balance.toLocaleString()}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 flex gap-2">
                        <Link href={`/dashboard/admin/manage/${m.id}`} className="text-xs bg-indigo-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-indigo-700 whitespace-nowrap">
                          View
                        </Link>
                        <button 
                          onClick={() => toggleStatus(m.id)} 
                          className="text-xs px-2 sm:px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 whitespace-nowrap"
                        >
                          {m.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                        {m.role !== 'admin' ? (
                          <button
                            onClick={() => promoteUser(m.id)}
                            className="text-xs px-2 sm:px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap"
                          >
                            Promote
                          </button>
                        ) : (
                          <button
                            onClick={() => demoteUser(m.id)}
                            className="text-xs px-2 sm:px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 whitespace-nowrap"
                          >
                            Demote
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AnimatedFooter />
    </div>
  );
}
