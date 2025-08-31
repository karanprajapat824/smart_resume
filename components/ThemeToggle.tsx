"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 dark:text-white hover:cursor-pointer"
    >
      {theme == "dark" ? (
        <Sun />
      ) : (
        <Moon  />
      )}
    </button>
  );
}
