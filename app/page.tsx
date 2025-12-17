"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Zap, BarChart3, Clock } from "lucide-react";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 relative overflow-hidden">

      {/* Floating gradient shapes */}
      <div className="absolute top-8 left-6 w-32 h-32 bg-indigo-300/30 rounded-full blur-3xl animate-float-slow hidden md:block" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-float-slower hidden md:block" />

      {/* Layout */}
      <main className="grid grid-cols-1 md:grid-cols-2 h-screen">

        {/* IMAGE PANEL */}
        <section className="relative w-full h-64 md:h-full overflow-hidden">
          <Image
            src="/transactions.jpeg"
            alt="Money Transactions Illustration"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />

          {/* Overlay on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent md:hidden" />
        </section>

        {/* CONTENT PANEL */}
        <section className="relative flex items-start justify-start px-6 md:px-16 lg:px-24 pt-12 md:pt-20 pb-10 h-full bg-gradient-to-t from-white/70 via-white/40 to-transparent backdrop-blur-lg">

          {/* Right-side vertical soft gradient wash */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-200/40 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-2xl w-full h-full flex flex-col">

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight drop-shadow-sm">
              Your All-In-One
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 animate-gradient-x">
                Pension Manager
              </span>
            </h1>

            <p className="mt-5 mb-3 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed max-w-xl">
              Grow your retirement savings — explore pension plans, make
              contributions, and track your long-term performance in a clean
              and secure dashboard built for retirement planning.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-8 mb-6 flex flex-col sm:flex-row gap-4 sm:gap-5">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-indigo-600 text-indigo-700 bg-white font-semibold hover:bg-indigo-50 hover:scale-[1.03] transition-all"
              >
                Create Account
              </Link>
            </div>

            {/* FEATURES */}
            <div
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-20 flex-1 pb-0"
              style={{ gridAutoRows: '1fr' }}
            >

              <Feature
                title="Pension Plans & Contributions"
                icon={<Zap className="text-indigo-600 w-6 h-6" />}
              >
                Curated plans, suggested contributions, and simple one-click investing.
              </Feature>

              <Feature
                title="Secure Transaction Logs"
                icon={<Shield className="text-indigo-600 w-6 h-6" />}
              >
                Full activity history with smart filtering.
              </Feature>

              <Feature
                title="Real-Time Status"
                icon={<Clock className="text-indigo-600 w-6 h-6" />}
              >
                Instant success & failure notifications.
              </Feature>

              <Feature
                title="Analytics Dashboard"
                icon={<BarChart3 className="text-indigo-600 w-6 h-6" />}
              >
                Smooth charts, insights & easy navigation.
              </Feature>
            </div>
          </div>
        </section>
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

/* REUSABLE FEATURE CARD */
const Feature = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 h-full flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <h3 className="text-indigo-700 font-semibold text-lg">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm mt-1 flex-1 leading-relaxed">
      {children}
    </p>
  </div>
);
