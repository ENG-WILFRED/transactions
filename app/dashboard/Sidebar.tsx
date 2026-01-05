///app/dashboard/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Settings,
  Layers,
  LogOut,
  Menu,
  X,
  Wallet,
  CreditCard,
  PieChart,
  TrendingUp,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../components/ThemeProvider";

interface SidebarProps {
  userType: "customer" | "admin";
  firstName?: string;
  lastName?: string;
}

export default function Sidebar({ userType, firstName, lastName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    document.cookie = "auth=; path=/; max-age=0";
    router.push("/login");
  };

  const handleThemeToggle = () => {
    console.log("Theme toggle clicked. Current theme:", theme);
    toggleTheme();
  };

  // Admin navigation items
  const adminNavItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/admin",
    },
    {
      name: "Manage Users",
      icon: Users,
      href: "/dashboard/admin/manage",
    },
    {
      name: "Manage Accounts",
      icon: Wallet,
      href: "/dashboard/admin/accounts",
    },
    {
      name: "Create Admin",
      icon: UserPlus,
      href: "/dashboard/admin/create-admin",
    },
    {
      name: "Reports",
      icon: FileText,
      href: "/dashboard/admin/reports",
    },
    {
      name: "Account Types",
      icon: Layers,
      href: "/dashboard/admin/account-types",
    },
    {
      name: "Profile",
      icon: User,
      href: "/dashboard/profile",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/dashboard/admin/settings",
    },
  ];

  // Customer navigation items
  const customerNavItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/customer",
    },
    {
      name: "My Pension",
      icon: Wallet,
      href: "/dashboard/customer/pension",
    },
    {
      name: "Contributions",
      icon: CreditCard,
      href: "/dashboard/customer/contributions",
    },
    {
      name: "Investments",
      icon: TrendingUp,
      href: "/dashboard/customer/investments",
    },
    {
      name: "Portfolio",
      icon: PieChart,
      href: "/dashboard/customer/portfolio",
    },
    {
      name: "Reports",
      icon: FileText,
      href: "/dashboard/customer/reports",
    },
    {
      name: "Profile",
      icon: User,
      href: "/dashboard/profile",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/dashboard/customer/settings",
    },
  ];

  const navItems = userType === "admin" ? adminNavItems : customerNavItems;

  const SidebarContent = () => (
    <>
      {/* Logo & User Info */}
      <div className="p-6 border-b border-gray-700 dark:border-gray-600">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {firstName?.[0]?.toUpperCase() || lastName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm">
              {firstName} {lastName}
            </h3>
            <p className="text-xs text-gray-400">
              {userType === "admin" ? "Administrator" : "Customer"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700 dark:border-gray-600 space-y-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={handleThemeToggle}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700 transition-all"
        >
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </div>
          <div
            className={`w-12 h-6 rounded-full transition-all ${
              theme === "dark" ? "bg-indigo-600" : "bg-gray-600"
            } relative`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                theme === "dark" ? "right-0.5" : "left-0.5"
              }`}
            />
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button - Fixed Position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-gray-900 dark:bg-gray-800 text-white rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Desktop (ALWAYS VISIBLE - FIXED) */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 dark:bg-gray-800 fixed left-0 top-0 bottom-0 border-r border-gray-800 dark:border-gray-700 z-40">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile (Slide In/Out) */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-[50] w-64 bg-gray-900 dark:bg-gray-800 h-screen border-r border-gray-800 dark:border-gray-700 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}