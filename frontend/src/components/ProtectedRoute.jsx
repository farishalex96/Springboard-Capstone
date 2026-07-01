import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 text-slate-700 dark:text-slate-200">
        <div className="rounded-3xl border border-white/25 bg-white/80 px-8 py-6 shadow-glass dark:border-slate-700/40 dark:bg-slate-900/70">
          <p className="text-lg font-medium">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
