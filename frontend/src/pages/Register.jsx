import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import PageContainer from '../components/PageContainer';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import PasswordRules from '../components/PasswordRules';

export default function Register() {
  const { register, user, loading, error, setError } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [growingZone, setGrowingZone] = useState('');
  const [heatZone, setHeatZone] = useState('');
  const [message, setMessage] = useState(null);
  const [detectingZone, setDetectingZone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [setError]);

  useEffect(() => {
    if (user) {
      navigate('/profile', { replace: true });
    }
  }, [user, navigate]);

  const validatePassword = (pw) => {
    if (!pw || pw.length < 8) return false;
    if (!/[A-Z]/.test(pw)) return false;
    if (!/[0-9]/.test(pw)) return false;
    if (!/[!@#$%^&*(),.?"{}|<>\[\]\\;:'`~_+=\-\/]/.test(pw)) return false;
    return true;
  };

  const handleDetectZone = async () => {
    setDetectingZone(true);
    setMessage(null);

    if (!navigator.geolocation) {
      setMessage('Geolocation is not supported by your browser.');
      setDetectingZone(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(`/api/auth/hardiness-zone?lat=${latitude}&lng=${longitude}`);
          const data = await response.json();

          if (!response.ok) {
            setMessage(data.message || 'Could not determine zone from location.');
            setDetectingZone(false);
            return;
          }

          setGrowingZone(data.zone);
          setMessage(null);
          setDetectingZone(false);
        } catch (error) {
          setMessage('Error fetching zone data. Please try again.');
          setDetectingZone(false);
        }
      },
      () => {
        setMessage('Unable to access your location. Please allow location access or enter zone manually.');
        setDetectingZone(false);
      },
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!username || !email || !password) {
      setMessage('Username, email, and password are required.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must be at least 8 characters and include an uppercase letter, a number, and a special character.');
      return;
    }

    const result = await register({ username, email, password, growingZone, heatZone });
    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage('Registration complete! Redirecting to profile...');
  };

  return (
    <PageContainer>
      <GlassCard className="max-w-xl mx-auto space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Create account</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Register for Greenlight</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Sign up and start saving your favorite plants and growing zones.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
              placeholder="forestkeeper"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
              placeholder="hello@greenlight.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
              placeholder="Create a secure password"
            />
          </div>

          <PasswordRules password={password} visible={passwordFocused} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Growing zone</label>
                <button
                  type="button"
                  onClick={handleDetectZone}
                  disabled={detectingZone}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {detectingZone ? 'Detecting...' : 'Detect from location'}
                </button>
              </div>
              <input
                value={growingZone}
                onChange={(event) => setGrowingZone(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                placeholder="e.g. 9b"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Heat zone</label>
              <input
                value={heatZone}
                onChange={(event) => setHeatZone(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                placeholder="e.g. hot, mild"
              />
            </div>
          </div>

          {message && <p className="text-sm text-rose-500">{message}</p>}
          {error && <p className="text-sm text-rose-500">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
            Login instead
          </Link>
        </p>
      </GlassCard>
    </PageContainer>
  );
}
