import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export function ThemeToggle({ className }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      className={cn(
        'h-9 w-9 rounded-full border border-border bg-background text-foreground',
        'flex items-center justify-center text-base',
        'transition-all duration-200 hover:border-primary hover:text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <span
        className="inline-block transition-transform duration-300"
        style={{ transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        {theme === 'light' ? '☀' : '◑'}
      </span>
    </button>
  );
}
