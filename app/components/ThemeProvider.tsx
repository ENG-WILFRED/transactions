"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (savedTheme === "dark" || savedTheme === "light") {
      console.log("📥 Loaded theme from localStorage:", savedTheme);
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      console.log("🎨 Using system preference:", initialTheme);
      setThemeState(initialTheme);
      applyTheme(initialTheme);
      localStorage.setItem("theme", initialTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    console.log("🔧 Applying theme - Before:", root.className);
    
    // Remove BOTH classes first
    root.classList.remove("light", "dark");
    
    // Force browser to process the removal
    void root.offsetHeight;
    
    // Add the new theme
    root.classList.add(newTheme);
    
    console.log("✅ Applying theme - After:", root.className);
    
    // Double check it was applied
    setTimeout(() => {
      console.log("🔍 Verification - HTML classes:", root.className);
      console.log("🔍 Verification - Has dark?", root.classList.contains("dark"));
      console.log("🔍 Verification - Has light?", root.classList.contains("light"));
      
      // Additional debugging
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      console.log("🎨 Body background-color:", computedStyle.backgroundColor);
      console.log("🎨 Body color:", computedStyle.color);
    }, 50);
  };

  const setTheme = (newTheme: Theme) => {
    console.log("🎨 setTheme called:", newTheme);
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("🔄 toggleTheme: from", theme, "to", newTheme);
    setTheme(newTheme);
  };

  // Prevent flash - return null while loading
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
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