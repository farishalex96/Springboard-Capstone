import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import PageContainer from '../components/PageContainer';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import PasswordRules from '../components/PasswordRules';

export default function Login() {
  const { login, user, loading, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [setError]);

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage('Please fill in both email and password.');
      return;
    }

    const result = await login({ email, password });
    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage('Login successful. Redirecting...');
  };

  return (
    <PageContainer>
      <GlassCard className="max-w-xl mx-auto space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Welcome back</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Login to your account</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Enter your credentials to access Greenlight and resume plant tracking.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
              placeholder="hello@greenlight.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
              placeholder="Enter your password"
            />
          </div>

          <PasswordRules password={password} visible={passwordFocused} textOnly animate />

          {message && <p className="text-sm text-rose-500">{message}</p>}
          {error && <p className="text-sm text-rose-500">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          New to Greenlight?{' '}
          <Link to="/register" className="font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
            Create an account
          </Link>
        </p>
      </GlassCard>
    </PageContainer>
  );
}
