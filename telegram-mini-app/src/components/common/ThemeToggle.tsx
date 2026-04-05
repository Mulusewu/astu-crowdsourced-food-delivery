import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/ui/themeStore";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "button" | "switch";
}

export function ThemeToggle({ className = "", variant = "icon" }: ThemeToggleProps) {
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === "dark";

  if (variant === "button") {
    return (
      <Button
        onClick={toggleMode}
        variant="outline"
        size="sm"
        className={`gap-2 ${className}`}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      </Button>
    );
  }

  if (variant === "switch") {
    return (
      <button
        onClick={toggleMode}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          isDark ? "bg-primary" : "bg-gray-200"
        } ${className}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    );
  }

  // Default: icon variant
  return (
    <button
      onClick={toggleMode}
      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
    </button>
  );
}