"use client";

import { useState, useEffect } from "react";
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
    localStorage.clear();
    document.cookie = "auth=; path=/; max-age=0";
    router.push("/login");
  };

  const adminNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/admin" },
    { name: "Manage Users", icon: Users, href: "/dashboard/admin/manage" },
    { name: "Manage Accounts", icon: Wallet, href: "/dashboard/admin/accounts" },
    { name: "Create Admin", icon: UserPlus, href: "/dashboard/admin/create-admin" },
    { name: "Reports", icon: FileText, href: "/dashboard/admin/reports" },
    { name: "Account Types", icon: Layers, href: "/dashboard/admin/account-types" },
    { name: "Profile", icon: User, href: "/dashboard/profile" },
    { name: "Settings", icon: Settings, href: "/dashboard/admin/settings" },
  ];

  const customerNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/customer" },
    { name: "My Pension", icon: Wallet, href: "/dashboard/customer/pension" },
    { name: "Contributions", icon: CreditCard, href: "/dashboard/customer/contributions" },
    { name: "Investments", icon: TrendingUp, href: "/dashboard/customer/investments" },
    { name: "Portfolio", icon: PieChart, href: "/dashboard/customer/portfolio" },
    { name: "Reports", icon: FileText, href: "/dashboard/customer/reports" },
    { name: "Profile", icon: User, href: "/dashboard/profile" },
    { name: "Settings", icon: Settings, href: "/dashboard/customer/settings" },
  ];

  const navItems = userType === "admin" ? adminNavItems : customerNavItems;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900 dark:bg-gray-800 border-r border-gray-800 dark:border-gray-700 flex flex-col transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* User Info */}
        <div className="p-6 border-b border-gray-700 dark:border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white font-bold">
              {firstName?.[0] || "U"}
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold">
                {firstName} {lastName}
              </h3>
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                {userType === "admin" ? "Administrator" : "Customer"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                    : "text-gray-300 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-700"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 dark:border-gray-600 space-y-2">
          {/* Theme Toggle - FIXED: Shows current mode and switches to opposite */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              {/* FIXED: Show current theme icon */}
              {theme === "dark" ? (
                <Moon size={20} className="text-blue-400" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
              {/* FIXED: Show current mode name */}
              <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            </div>
            <div
              className={`w-12 h-6 rounded-full relative transition ${
                theme === "dark" ? "bg-indigo-600" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${
                  theme === "dark" ? "right-0.5" : "left-0.5"
                }`}
              />
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 dark:text-red-500 hover:bg-red-900/20 dark:hover:bg-red-900/30 transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}