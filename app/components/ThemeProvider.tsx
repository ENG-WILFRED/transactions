///app/components/ThemeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      applyTheme(initialTheme);
      localStorage.setItem("theme", initialTheme);
    }
    
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove("light", "dark");
    
    // Add the appropriate class
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }
    
    console.log("Theme applied:", newTheme, "HTML classes:", root.className);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Toggling theme from", theme, "to", newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}