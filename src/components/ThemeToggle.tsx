import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle"
      onClick={onToggle}
      className="p-2.5 rounded-full bg-cream-200 dark:bg-forest-700 text-forest-700 dark:text-cream-100 hover:scale-105 transition-transform border border-forest-200 dark:border-forest-600 focus:outline-none"
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? (
        <Sun id="theme-toggle-sun-icon" className="w-5 h-5" />
      ) : (
        <Moon id="theme-toggle-moon-icon" className="w-5 h-5" />
      )}
    </button>
  );
}
