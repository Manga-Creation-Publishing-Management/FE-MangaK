import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-primary" />
      ) : (
        <Moon size={20} className="text-primary" />
      )}
    </button>
  );
}
