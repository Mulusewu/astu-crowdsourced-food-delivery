import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";
export type ThemeColor = "#F26A1C" | string; // Primary brand color

export interface ThemeState {
  // State
  mode: ThemeMode;
  primaryColor: ThemeColor;
  isInitialized: boolean;

  // Actions
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void; // Fixed: Changed from toggleMode to toggleTheme
  setPrimaryColor: (color: ThemeColor) => void;
  initializeTheme: () => void;

  // Getters
  getCurrentTheme: () => {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
  };
}

// Theme color constants
export const themeColors = {
  light: {
    background: "#FFFFFF",
    foreground: "#1F2937",
    card: "#FFFFFF",
    cardForeground: "#1F2937",
    primary: "#F26A1C",
    primaryForeground: "#FFFFFF",
    secondary: "#F3F4F6",
    secondaryForeground: "#1F2937",
    muted: "#F9FAFB",
    mutedForeground: "#6B7280",
    border: "#E5E7EB",
    input: "#E5E7EB",
    ring: "#F26A1C",
  },
  dark: {
    background: "#111827",
    foreground: "#F9FAFB",
    card: "#1F2937",
    cardForeground: "#F9FAFB",
    primary: "#F26A1C",
    primaryForeground: "#FFFFFF",
    secondary: "#374151",
    secondaryForeground: "#F9FAFB",
    muted: "#1F2937",
    mutedForeground: "#9CA3AF",
    border: "#374151",
    input: "#374151",
    ring: "#F26A1C",
  },
};


export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: "light",
      primaryColor: "#F26A1C",
      isInitialized: false,

      setMode: (_mode) => {
        // Force light mode
        set({ mode: "light" });
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("dark");
        }
      },

      toggleTheme: () => {
        // No-op to disable theme switching
      },

      setPrimaryColor: (color) => {
        set({ primaryColor: color });
        // Update CSS variable
        if (typeof document !== "undefined") {
          document.documentElement.style.setProperty("--primary", color);
        }
      },

      initializeTheme: () => {
        if (get().isInitialized) return;

        // Force light mode on initialization
        get().setMode("light");

        // Set primary color CSS variable
        const primaryColor = get().primaryColor;
        if (typeof document !== "undefined") {
          document.documentElement.style.setProperty("--primary", primaryColor);
        }

        set({ isInitialized: true });
      },

      getCurrentTheme: () => {
        return {
          ...themeColors.light,
          primary: get().primaryColor,
        };
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({
        primaryColor: state.primaryColor,
      }),
    },
  ),
);
