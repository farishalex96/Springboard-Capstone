import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import PageContainer from '../components/PageContainer';
import { Button } from '../components/Button';
import PasswordRules from '../components/PasswordRules';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [token]);

  const validatePassword = (pw) => {
    if (!pw || pw.length < 8) return false;
    if (!/[A-Z]/.test(pw)) return false;
    if (!/[0-9]/.test(pw)) return false;
    if (!/[!@#$%^&*(),.?"{}|<>\[\]\\;:'`~_+=\-\/]/.test(pw)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!password || !confirmPassword) {
      setMessage('Please fill in both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must be at least 8 characters and include an uppercase letter, a number, and a special character.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        newPassword: password,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <GlassCard className="max-w-xl mx-auto space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Create New Password</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Reset your password</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Enter a new password below. It must be different from your previous password.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
              placeholder="Create a strong password"
            />
          </div>

          <PasswordRules password={password} visible={passwordFocused} />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
              placeholder="Confirm your password"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('successfully') || message.includes('redirecting') ? 'text-emerald-600' : 'text-rose-500'}`}>
              {message}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={loading || !token}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
            Login instead
          </Link>
        </p>
      </GlassCard>
    </PageContainer>
  );
}
