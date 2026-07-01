import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'Light' : 'Dark';

  return (
    <Button variant="secondary" onClick={toggleTheme} className="min-w-[120px]">
      {nextTheme} Mode
    </Button>
  );
}
