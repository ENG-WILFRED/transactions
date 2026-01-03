"use client";

/**
 * DEPRECATED: This component is no longer needed.
 * Layout functionality has been moved to /app/dashboard/layout.tsx
 * 
 * This file is kept for backwards compatibility only.
 * Any component still importing this will just render its children.
 */

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "customer" | "admin";
  firstName?: string;
  lastName?: string;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // Just render children - the actual layout is handled by layout.tsx
  return <>{children}</>;
}