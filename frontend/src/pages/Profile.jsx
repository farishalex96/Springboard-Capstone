import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import PageContainer from '../components/PageContainer';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import PasswordRules from '../components/PasswordRules';
import axios from 'axios';

export default function Profile() {
  const { user, loading, token, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    growingZone: user?.growingZone || '',
    heatZone: user?.heatZone || '',
  });
  const [emailPassword, setEmailPassword] = useState('');
  const [emailPasswordFocused, setEmailPasswordFocused] = useState(false);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [detectingZone, setDetectingZone] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        growingZone: user.growingZone || '',
        heatZone: user.heatZone || '',
      });
    }
  }, [user]);

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
          const response = await axios.get('/api/auth/hardiness-zone', {
            params: { lat: latitude, lng: longitude },
          });

          setFormData((prev) => ({ ...prev, growingZone: response.data.zone }));
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

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const updateData = {
        growingZone: formData.growingZone,
        heatZone: formData.heatZone,
      };

      // If email changed, include it and require password
      if (formData.email !== user.email) {
        if (!emailPassword) {
          setMessage('Please enter your password to change email.');
          setSaving(false);
          return;
        }
        updateData.email = formData.email;
        updateData.password = emailPassword;
      }

      const response = await axios.put('/api/users/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Profile updated successfully!');
      setEmailPassword('');
      setIsEditing(false);
      await refreshProfile();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update profile.';
      setMessage(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <GlassCard className="max-w-4xl mx-auto">
          <p className="text-slate-700 dark:text-slate-200">Loading your profile…</p>
        </GlassCard>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <GlassCard className="max-w-4xl mx-auto">
          <p className="text-slate-700 dark:text-slate-200">No profile information is available.</p>
        </GlassCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <GlassCard className="max-w-4xl mx-auto space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Welcome, {user.username}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Your account details and plant preferences.</p>
        </div>

        <div className="space-y-6">
          {/* Editable fields */}
          {isEditing && (
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/50 p-5 dark:border-slate-700/60 dark:bg-slate-900/50">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  placeholder="your.email@example.com"
                />
                {formData.email !== user.email && (
                  <div className="mt-3 space-y-2 rounded-2xl border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-700/30 dark:bg-amber-900/20">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Password required to change email</p>
                    <input
                      type="password"
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      onFocus={() => setEmailPasswordFocused(true)}
                      onBlur={() => setEmailPasswordFocused(false)}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-amber-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-amber-700/50 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:ring-amber-500/20"
                    />
                    <PasswordRules password={emailPassword} visible={emailPasswordFocused} textOnly animate />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Growing Zone</label>
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
                  type="text"
                  value={formData.growingZone}
                  onChange={(e) => setFormData({ ...formData, growingZone: e.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  placeholder="e.g. 9b"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Heat Zone</label>
                <input
                  type="text"
                  value={formData.heatZone}
                  onChange={(e) => setFormData({ ...formData, heatZone: e.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  placeholder="e.g. hot, mild"
                />
              </div>

              {message && <p className={`text-sm ${message.includes('successfully') ? 'text-emerald-600' : 'text-rose-500'}`}>{message}</p>}

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} variant="primary" disabled={saving} className="flex-1">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      email: user.email || '',
                      growingZone: user.growingZone || '',
                      heatZone: user.heatZone || '',
                    });
                    setEmailPassword('');
                    setMessage(null);
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* View mode */}
          {!isEditing && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 rounded-3xl border border-slate-200 bg-white/80 p-5 dark:border-slate-700/60 dark:bg-slate-900/70">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</p>
                  <p className="text-base text-slate-900 dark:text-slate-100">{user.email}</p>
                </div>
                <div className="space-y-1 rounded-3xl border border-slate-200 bg-white/80 p-5 dark:border-slate-700/60 dark:bg-slate-900/70">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Growing Zone</p>
                  <p className="text-base text-slate-900 dark:text-slate-100">{user.growingZone || 'Not set'}</p>
                </div>
                <div className="space-y-1 rounded-3xl border border-slate-200 bg-white/80 p-5 dark:border-slate-700/60 dark:bg-slate-900/70">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Heat Zone</p>
                  <p className="text-base text-slate-900 dark:text-slate-100">{user.heatZone || 'Not set'}</p>
                </div>
                <button
                  onClick={() => navigate('/favorites')}
                  className="space-y-1 rounded-3xl border border-slate-200 bg-white/80 p-5 transition hover:bg-white/90 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:bg-slate-900/80 text-left"
                >
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Favorite Plants</p>
                  <p className="text-base text-slate-900 dark:text-slate-100">{user.favoritePlants?.length || 0} saved</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">View favorites →</p>
                </button>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setIsEditing(true)} variant="primary" className="flex-1">
                  Edit Profile
                </Button>
              </div>
            </>
          )}
        </div>
      </GlassCard>
    </PageContainer>
  );
}
