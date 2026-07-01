import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl shadow-sm shadow-slate-900/5 dark:border-slate-700/60 dark:bg-slate-950/70">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="text-2xl font-bold tracking-tight text-emerald-700 transition-colors duration-300 dark:text-emerald-300">
          Greenlight
        </Link>

        <div className="flex flex-1 flex-wrap items-center justify-between gap-3 sm:justify-end">
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link to="/search" className="transition hover:text-emerald-600 dark:hover:text-emerald-300">
              Search
            </Link>
            <Link to="/favorites" className="transition hover:text-emerald-600 dark:hover:text-emerald-300">
              Favorites
            </Link>
            <Link to="/my-plants" className="transition hover:text-emerald-600 dark:hover:text-emerald-300">
              My Plants
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-slate-700 transition hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-300">
                  {user.username}
                </Link>
                <Button variant="ghost" onClick={logout} className="px-4 py-2 text-sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-700 transition hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-300">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium text-slate-700 transition hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-300">
                  Register
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
