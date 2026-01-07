"use client";

import Link from "next/link";
import { Shield, Zap, BarChart3, Clock, TrendingUp, Users, Briefcase, DollarSign, X, CreditCard, Lightbulb, PiggyBank, Settings, Target, Percent } from "lucide-react";
import React, { useState } from "react";

export default function Home() {
  const [showStatsModal, setShowStatsModal] = useState(false);

  // AutoNest statistics
  const stats = [
    { value: "Automated", label: "Micro-Savings", icon: <PiggyBank className="w-6 h-6" /> },
    { value: "Real-Time", label: "Tracking", icon: <BarChart3 className="w-6 h-6" /> },
    { value: "Multi-Scheme", label: "Compatible", icon: <Briefcase className="w-6 h-6" /> },
    { value: "24/7", label: "Support", icon: <Clock className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-orange-950/10 dark:to-gray-950 relative overflow-hidden transition-colors duration-300">

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 dark:bg-orange-600/15 rounded-full blur-3xl animate-float-slow hidden md:block" />
      <div className="absolute bottom-0 right-20 w-96 h-96 bg-red-500/15 dark:bg-red-600/10 rounded-full blur-3xl animate-float-slower hidden md:block" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-400/10 dark:bg-orange-600/8 rounded-full blur-3xl hidden md:block" />

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-16 py-6 border-b border-orange-200/50 dark:border-orange-900/20 backdrop-blur-md bg-white/50 dark:bg-gray-950/50">
        <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500 bg-clip-text text-transparent">
          AutoNest
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#features" className="text-gray-700 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition">Features</a>
          <button onClick={() => setShowStatsModal(true)} className="text-gray-700 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition cursor-pointer">About</button>
          <a href="#benefits" className="text-gray-700 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition">Benefits</a>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="relative z-5 min-h-[calc(100vh-70px)]">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-6 md:px-16 py-16 items-center">
          
          {/* LEFT: Content Panel */}
          <div className="flex flex-col justify-center">
            <div className="inline-block w-fit mb-5 px-4 py-2 rounded-full bg-orange-500/20 dark:bg-orange-600/15 border border-orange-400/50 dark:border-orange-500/40">
              <span className="text-orange-700 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">Micro-Pension Innovation</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-5">
              The Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500">
                Micro-Pension Savings
              </span>
            </h1>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-2 max-w-xl font-light">
              AutoNest is an innovative financial technology system designed to bridge the gap between daily consumption and long-term retirement security.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-500 leading-relaxed mb-8 max-w-lg">
              Every purchase contributes a fraction towards your future, effectively automating the discipline required for pension building.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-600 dark:to-red-600 text-white font-semibold shadow-2xl hover:shadow-orange-500/50 dark:hover:shadow-orange-600/40 hover:scale-[1.02] transition-all text-base"
              >
                Start Saving Automatically
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center px-10 py-4 rounded-xl border-2 border-orange-400/50 dark:border-orange-500/40 text-orange-700 dark:text-orange-400 bg-white/80 dark:bg-white/5 backdrop-blur-lg font-semibold hover:bg-orange-50 dark:hover:bg-white/10 hover:scale-[1.02] transition-all text-base"
              >
                Sign In
              </Link>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-500">
              <div className="flex flex-col items-start gap-2 pb-3 border-b border-orange-500/20 dark:border-orange-600/15">
                <Percent className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                <span className="font-semibold text-gray-800 dark:text-gray-300">Flexible Rates</span>
                <span className="text-xs">1%-10% per transaction</span>
              </div>
              <div className="flex flex-col items-start gap-2 pb-3 border-b border-green-500/20 dark:border-green-600/15">
                <CreditCard className="w-5 h-5 text-green-600 dark:text-green-500" />
                <span className="font-semibold text-gray-800 dark:text-gray-300">Smart Integration</span>
                <span className="text-xs">Links to payment methods</span>
              </div>
              <div className="flex flex-col items-start gap-2 pb-3 border-b border-blue-500/20 dark:border-blue-600/15">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                <span className="font-semibold text-gray-800 dark:text-gray-300">Auto-Growth</span>
                <span className="text-xs">Compound interest power</span>
              </div>
            </div>
          </div>

          {/* RIGHT: How AutoNest Works */}
          <div className="flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/15 to-red-500/15 dark:from-orange-600/10 dark:to-red-600/10 border border-orange-400/30 dark:border-orange-500/25 backdrop-blur-lg hover:border-orange-400/60 dark:hover:border-orange-500/45 transition-all">
              <div className="flex items-start gap-4">
                <CreditCard className="w-7 h-7 text-orange-600 dark:text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">Spending-Based Contributions</h3>
                  <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    Link AutoNest to your bank account or payment methods. Each purchase automatically contributes a predetermined percentage (1%-10%) to your pension scheme.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 dark:from-blue-600/10 dark:to-cyan-600/10 border border-blue-400/30 dark:border-blue-500/25 backdrop-blur-lg hover:border-blue-400/60 dark:hover:border-blue-500/45 transition-all">
              <div className="flex items-start gap-4">
                <BarChart3 className="w-7 h-7 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">Real-Time Tracking & Insights</h3>
                  <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    Monitor your spending in real-time with insights into daily spending habits and pension contributions, helping you stay informed and engaged with your financial growth.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/15 to-pink-500/15 dark:from-purple-600/10 dark:to-pink-600/10 border border-purple-400/30 dark:border-purple-500/25 backdrop-blur-lg hover:border-purple-400/60 dark:hover:border-purple-500/45 transition-all">
              <div className="flex items-start gap-4">
                <Settings className="w-7 h-7 text-purple-600 dark:text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">Automated Adjustments</h3>
                  <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    Set preferences for contribution increments based on spending thresholds or financial goals. Increase savings during higher expenditure or bonus periods.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/15 to-emerald-500/15 dark:from-green-600/10 dark:to-emerald-600/10 border border-green-400/30 dark:border-green-500/25 backdrop-blur-lg hover:border-green-400/60 dark:hover:border-green-500/45 transition-all">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-7 h-7 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">Educational Resources</h3>
                  <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    Access resources to help you understand pension landscape, investment options, and the importance of fostering a financially literate user base.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="px-6 md:px-16 py-20 bg-gradient-to-b from-orange-50/50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Key Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                AutoNest offers comprehensive features designed to make retirement savings effortless
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Target className="w-8 h-8 text-orange-600 dark:text-orange-500" />}
                title="Customizable Contribution Rates"
                description="Adjust the percentage you wish to contribute. Completely flexible based on your current financial situation, making it suitable for various income levels."
              />
              
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-blue-600 dark:text-blue-500" />}
                title="Seamless Integration"
                description="Easily integrated with various payment platforms. User-friendly interface simplifies the process of managing contributions."
              />
              
              <FeatureCard
                icon={<Shield className="w-8 h-8 text-green-600 dark:text-green-500" />}
                title="Multi-Scheme Compatibility"
                description="Works with registered pension providers including ICEA LION, Sanlam, Britam, MMF and more. Route funds to your chosen scheme."
              />
              
              <FeatureCard
                icon={<DollarSign className="w-8 h-8 text-purple-600 dark:text-purple-500" />}
                title="Cap & Floor Limits"
                description="Set daily or monthly caps to prevent overdrawing. Floor limits ensure minimum savings regardless of low spending."
              />
              
              <FeatureCard
                icon={<TrendingUp className="w-8 h-8 text-red-600 dark:text-red-500" />}
                title='Round-Up Mode'
                description="Collect standard deductions with round-up feature. Instead of 3.40, round up to 4.00 and save the difference automatically."
              />
              
              <FeatureCard
                icon={<Users className="w-8 h-8 text-indigo-600 dark:text-indigo-500" />}
                title="Gig Economy Solution"
                description="Perfect for freelancers, gig workers, and casual workers who lack employer-sponsored pension match or regular salary."
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="px-6 md:px-16 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Benefits of AutoNest
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Transform your approach to retirement savings with automated, effortless contributions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-600/5 dark:to-red-600/5 border-2 border-orange-200 dark:border-orange-900/30">
                <PiggyBank className="w-12 h-12 text-orange-600 dark:text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Simplified Saving</h3>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                  By automating contributions, users can save without the burden of having to remember to transfer funds manually.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-600/5 dark:to-cyan-600/5 border-2 border-blue-200 dark:border-blue-900/30">
                <Lightbulb className="w-12 h-12 text-blue-600 dark:text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Encourages Mindful Spending</h3>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                  As users become aware that a portion of their spending goes toward their future, it may encourage them to make more mindful financial decisions.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-600/5 dark:to-emerald-600/5 border-2 border-green-200 dark:border-green-900/30">
                <TrendingUp className="w-12 h-12 text-green-600 dark:text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Compound Growth</h3>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                  Even small contributions can grow significantly over time due to the power of compound interest, enhancing retirement savings without noticeable impact on current finances.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-600/5 dark:to-pink-600/5 border border-purple-200 dark:border-purple-900/30">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-500" />
                  Painless Saving
                </h3>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                  Psychologically, it is easier to part with small amounts of money frequently than a large lump sum once a month. Because the deduction is tied to spending, it scales with your lifestyle—if you spend less, you save less (easing cash flow); if you spend more, you save more (preventing lifestyle creep).
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 dark:from-yellow-600/5 dark:to-orange-600/5 border border-yellow-200 dark:border-yellow-900/30">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                  Solves the "Gig Economy" Gap
                </h3>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                  For freelancers, gig workers, Mijengo and casual workers who lack an employer-sponsored pension match or regular salary, AutoNest provides a systematic way to build a retirement fund that mimics a payroll deduction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Protocol */}
        <section className="px-6 md:px-16 py-20 bg-gradient-to-b from-white to-orange-50/50 dark:from-gray-950 dark:to-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Deduct-and-Deposit Protocol
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Understanding how AutoNest works with every transaction
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl border border-orange-200 dark:border-orange-900/30">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Link & Sync</h3>
                    <p className="text-gray-700 dark:text-gray-400">
                      Users connect their primary spending accounts to the AutoNest secure platform.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Set the Nest Rate</h3>
                    <p className="text-gray-700 dark:text-gray-400">
                      The user selects a "Nest Rate"—the percentage of spending they wish to save (e.g., 1%, 3%, 5% up to 10%).
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">The Transaction Trigger</h3>
                    <p className="text-gray-700 dark:text-gray-400 mb-3">
                      <strong>Scenario:</strong> You buy tomatoes for Kes 100.00
                    </p>
                    <p className="text-gray-700 dark:text-gray-400 mb-2">
                      <strong>Action:</strong> If your Nest Rate is 5%, AutoNest calculates Kes 5.00
                    </p>
                    <p className="text-gray-700 dark:text-gray-400">
                      <strong>Execution:</strong> The system processes the 100.00 payment to the vendor and simultaneously triggers a separate transfer of 5.90 from your funding source to your pension pot.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Accumulation</h3>
                    <p className="text-gray-700 dark:text-gray-400">
                      These micro-transactions, while individually small, accumulate rapidly over months and years, leading into the ballooning pension fund.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="px-6 md:px-16 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 dark:from-orange-700 dark:to-red-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Younger Self Giving to Older Self
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-3">Conscious to Consequential</h3>
                  <p className="text-white/90 leading-relaxed">
                    AutoNest represents a shift from conscious saving to consequential saving. It turns the act of consumption—often seen as the enemy of savings—into the very engine that drives retirement growth.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-3">Paradigm Shift</h3>
                  <p className="text-white/90 leading-relaxed">
                    By making the process of saving effortless and integrated into daily life, it addresses the common barriers to pension investment. As more people recognize the importance of preparing for retirement, tools like AutoNest can empower them to take control of their financial futures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 md:px-16 py-20 bg-gradient-to-b from-orange-50/50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Start Building Your Future Today
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
              Join thousands who are effortlessly growing their retirement savings with every purchase
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-12 py-5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.02] transition-all"
            >
              Get Started with AutoNest
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-600 mt-6">
              A product of MINEL SOLUTIONS LIMITED
            </p>
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
  <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-lg transition-all group">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
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
  <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-900/30 rounded-3xl shadow-2xl max-w-3xl w-full p-8 md:p-12 relative max-h-[90vh] overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
      >
        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
      </button>

      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">About AutoNest</h2>
        <p className="text-gray-700 dark:text-gray-400 text-lg">
          The innovative platform transforming retirement savings through everyday spending
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 hover:border-orange-400 dark:hover:border-orange-600 transition-all text-center"
          >
            <div className="flex justify-center mb-3 text-orange-600 dark:text-orange-500">{stat.icon}</div>
            <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500 bg-clip-text text-transparent mb-1">
              {stat.value}
            </p>
            <p className="text-gray-700 dark:text-gray-400 text-xs font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* About Content */}
      <div className="space-y-4 mb-8">
        <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30">
          <h4 className="text-orange-700 dark:text-orange-400 font-semibold text-lg mb-2 flex items-center gap-2">
            <PiggyBank className="w-5 h-5" />
            Automated Micro-Savings
          </h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
            AutoNest automatically deducts a customizable percentage (1-10%) from every transaction and routes it to your pension scheme. Small contributions accumulate into significant retirement funds through the power of compound growth.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
          <h4 className="text-blue-700 dark:text-blue-400 font-semibold text-lg mb-2 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Perfect for the Gig Economy
          </h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
            Designed for freelancers, gig workers, and anyone without traditional employer-sponsored pension plans. AutoNest provides the systematic retirement savings that mimics payroll deductions.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30">
          <h4 className="text-green-700 dark:text-green-400 font-semibold text-lg mb-2 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Smart & Flexible Features
          </h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
            Set daily/monthly caps and floor limits, enable round-up mode, choose from multiple pension providers (ICEA LION, Sanlam, Britam, MMF), and track everything in real-time with comprehensive analytics.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30">
          <h4 className="text-purple-700 dark:text-purple-400 font-semibold text-lg mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Pay Yourself First Philosophy
          </h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
            AutoNest embodies the "pay yourself first" principle by making savings automatic and effortless. Every purchase becomes an investment in your future, turning consumption into the engine of retirement growth.
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
      >
        Start Your Journey
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-600 mt-6">
        A product of MINEL SOLUTIONS LIMITED
      </p>
    </div>
  </div>
);