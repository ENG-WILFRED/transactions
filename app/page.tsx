///home/hp/JERE/pension/app/page.tsx
"use client";

import Link from "next/link";
import { Shield, Zap, BarChart3, Clock, TrendingUp, Users, Briefcase, DollarSign, X } from "lucide-react";
import React, { useState } from "react";

export default function Home() {
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Pension statistics
  const stats = [
    { value: "500K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { value: "$2.5B", label: "Assets Managed", icon: <DollarSign className="w-6 h-6" /> },
    { value: "95%", label: "User Satisfaction", icon: <BarChart3 className="w-6 h-6" /> },
    { value: "24/7", label: "Support Available", icon: <Clock className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float-slow hidden md:block" />
      <div className="absolute bottom-0 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-float-slower hidden md:block" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl hidden md:block" />

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-16 py-6 border-b border-white/10 backdrop-blur-md">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
          PensionVault
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
          <button onClick={() => setShowStatsModal(true)} className="text-gray-300 hover:text-white transition cursor-pointer">Why Us</button>
          <a href="#plans" className="text-gray-300 hover:text-white transition">Plans</a>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="relative z-5 h-[calc(100vh-70px)]">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 px-6 md:px-16 py-16 items-center h-full">
          
          {/* LEFT: Content Panel */}
          <div className="flex flex-col justify-center">
            <div className="inline-block w-fit mb-5 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/50">
              <span className="text-indigo-300 text-xs font-semibold uppercase tracking-wider">Award-Winning Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
              Plan Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                Retirement with Confidence
              </span>
            </h1>

            <p className="text-lg text-gray-200 leading-relaxed mb-2 max-w-xl font-light">
              PensionVault is the trusted platform for managing your pension plans, optimizing investments, and securing your financial independence.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-lg">
              Used by 500K+ professionals to manage over $2.5B in retirement assets with industry-leading security and transparency.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-2xl hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all text-base"
              >
                create account
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center px-10 py-4 rounded-xl border-2 border-indigo-400/50 text-indigo-300 bg-white/5 backdrop-blur-lg font-semibold hover:bg-white/10 hover:scale-[1.02] transition-all text-base"
              >
                Sign In to Account
              </Link>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
              <div className="flex flex-col items-start gap-2 pb-3 border-b border-indigo-500/20">
                <Shield className="w-5 h-5 text-indigo-400" />
                <span className="font-semibold text-gray-200">FCA Regulated</span>
                <span className="text-xs">Licensed & compliant</span>
              </div>
              <div className="flex flex-col items-start gap-2 pb-3 border-b border-green-500/20">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-gray-200">8.5% Returns</span>
                <span className="text-xs">Average performance</span>
              </div>
              <div className="flex flex-col items-start gap-2 pb-3 border-b border-purple-500/20">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-gray-200">Real-Time</span>
                <span className="text-xs">Live portfolio tracking</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Professional Benefits Panel */}
          <div className="flex flex-col gap-3">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-blue-500/15 border border-indigo-400/30 backdrop-blur-lg hover:border-indigo-400/60 transition-all">
              <div className="flex items-start gap-4">
                <Shield className="w-7 h-7 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1">FCA Regulated & Certified</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">Licensed by the Financial Conduct Authority. ISO 27001 certified for information security and full GDPR compliance.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/15 to-emerald-500/15 border border-green-400/30 backdrop-blur-lg hover:border-green-400/60 transition-all">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-7 h-7 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Proven Performance</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">Average 8.5% annual returns across all portfolio types. Outperforming traditional pension schemes since 2001.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/15 to-pink-500/15 border border-purple-400/30 backdrop-blur-lg hover:border-purple-400/60 transition-all">
              <div className="flex items-start gap-4">
                <Users className="w-7 h-7 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Trusted by 500K+ Users</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">Managing $2.5B+ in retirement assets. 95% user satisfaction rating with dedicated 24/7 support team.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/15 to-orange-500/15 border border-yellow-400/30 backdrop-blur-lg hover:border-yellow-400/60 transition-all">
              <div className="flex items-start gap-4">
                <Briefcase className="w-7 h-7 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Expert-Driven Platform</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">200+ certified financial advisors with 50+ years combined expertise. Personalized guidance and strategic planning.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Modal */}
        {showStatsModal && (
          <StatsModal 
            stats={stats} 
            onClose={() => setShowStatsModal(false)} 
          />
        )}
      </main>

      {/* Animations */}
      <style jsx>{`
        .animate-gradient-x {
          background-size: 200%;
          animation: gradientShift 5s ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-float-slow {
          animation: float 7s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float 11s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-12px) scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* FEATURE CARD */
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all group">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-indigo-300 transition">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

/* STATS MODAL */
const StatsModal = ({
  stats,
  onClose,
}: {
  stats: Array<{ value: string; label: string; icon: React.ReactNode }>;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl max-w-3xl w-full p-8 md:p-12 relative max-h-[90vh] overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
      >
        <X className="w-6 h-6 text-gray-400" />
      </button>

      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-3">Why Choose PensionVault</h2>
        <p className="text-gray-300 text-lg">
          Leading platform for retirement planning - trusted by 500K+ professionals
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all text-center"
          >
            <div className="flex justify-center mb-3">{stat.icon}</div>
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-1">
              {stat.value}
            </p>
            <p className="text-gray-300 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Why Us Content */}
      <div className="space-y-4 mb-8">
        <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
          <h4 className="text-indigo-300 font-semibold text-lg mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Regulatory Excellence & Security
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            FCA regulated and authorized. ISO 27001 certified with 256-bit encryption. Full GDPR, PCI-DSS, and SOC 2 compliance. Your money is protected by institutional-grade security.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/30">
          <h4 className="text-green-300 font-semibold text-lg mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Proven Performance & Returns
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            Average 8.5% annual returns. Outperforming traditional schemes for 24 years. $2.5B+ in managed assets. Transparent fee structure with no hidden charges - just straightforward pricing.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30">
          <h4 className="text-purple-300 font-semibold text-lg mb-2 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Expert Advisory & Support
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            200+ certified financial advisors with 50+ years combined experience. 24/7 dedicated support. Personalized retirement planning. 95% customer satisfaction rating.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
          <h4 className="text-yellow-300 font-semibold text-lg mb-2 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Award-Winning Platform
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            Best Pension Platform 2024. Recognized by industry leaders. Featured in Financial Times, Bloomberg, and BBC News. Trusted by FTSE 100 companies' employees.
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
      >
        Get Started Today
      </button>
    </div>
  </div>
);
