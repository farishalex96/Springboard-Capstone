import { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import PageContainer from '../components/PageContainer';
import { Button } from '../components/Button';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send reset email. Please try again.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <GlassCard className="max-w-xl mx-auto space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Reset Password</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Forgot your password?</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
              placeholder="your.email@example.com"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('successfully') || message.includes('sent') ? 'text-emerald-600' : 'text-rose-500'}`}>
              {message}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
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
