import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type FontSize = "small" | "medium" | "large";

interface ThemeContextType {
  themeMode: ThemeMode;
  fontSize: FontSize;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "system",
  fontSize: "medium",
  isDarkMode: false,
  setThemeMode: () => {},
  setFontSize: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') as ThemeMode;
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeModeState(savedTheme);
    }
    
    if (savedFontSize && ['small', 'medium', 'large'].includes(savedFontSize)) {
      setFontSizeState(savedFontSize);
    }
  }, []);

  // Determine if dark mode should be active
  useEffect(() => {
    const updateDarkMode = () => {
      let shouldBeDark = false;
      
      if (themeMode === "dark") {
        shouldBeDark = true;
      } else if (themeMode === "system") {
        shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      
      setIsDarkMode(shouldBeDark);
      
      // Apply theme to document
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    updateDarkMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (themeMode === "system") {
        updateDarkMode();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

  // Apply font size to document
  useEffect(() => {
    const fontSizeClasses = {
      small: "text-sm",
      medium: "text-base", 
      large: "text-lg"
    };

    // Remove all font size classes
    document.documentElement.classList.remove("font-size-small", "font-size-medium", "font-size-large");
    
    // Add current font size class
    document.documentElement.classList.add(`font-size-${fontSize}`);
    
    // Set CSS custom property for font scaling
    const fontScales = {
      small: "0.875",
      medium: "1",
      large: "1.125"
    };
    
    document.documentElement.style.setProperty("--font-scale", fontScales[fontSize]);
  }, [fontSize]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('fontSize', size);
  };

  const value: ThemeContextType = {
    themeMode,
    fontSize,
    isDarkMode,
    setThemeMode,
    setFontSize,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};