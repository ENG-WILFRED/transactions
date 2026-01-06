import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "AutoNest Pension Fund",
  description: "Secure your future with AutoNest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* CRITICAL: This script runs BEFORE React hydrates to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
                console.log('🚀 Initial theme applied:', theme);
              } catch (e) {
                console.error('Theme init error:', e);
                document.documentElement.classList.add('light');
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}