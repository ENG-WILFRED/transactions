"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import Sidebar from "./Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import AnimatedFooter from "../components/AnimatedFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    firstName?: string;
    lastName?: string;
    role?: "customer" | "admin";
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const storedUser = userStr ? JSON.parse(userStr) : null;

    if (!storedUser?.id) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    setUser(storedUser);
    setLoading(false);
  }, [router]);

  // Determine user type from pathname
  const userType = pathname?.includes("/admin") ? "admin" : "customer";

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-700 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Sidebar - Fixed on desktop, slides in/out on mobile */}
      <Sidebar
        userType={userType}
        firstName={user?.firstName}
        lastName={user?.lastName}
      />

      {/* Main Content Area - Add left margin to account for fixed sidebar on desktop */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <DashboardHeader
          firstName={user?.firstName}
          lastName={user?.lastName}
          userType={userType}
        />

        {/* Scrollable Content */}
        <main className="flex-1">
          <div className="pb-20">{children}</div>
        </main>

        {/* Footer */}
        <AnimatedFooter />
      </div>
    </div>
  );
}