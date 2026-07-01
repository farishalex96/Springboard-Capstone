import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import PageContainer from '../components/PageContainer';
import PlantCard from '../components/PlantCard';
import { Button } from '../components/Button';

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().split('T')[0];
};

const calculateNextWateringDate = (lastWatered, wateringFrequencyDays) => {
  if (!lastWatered || !wateringFrequencyDays) return '';

  const frequencyDays = Number(wateringFrequencyDays);
  const wateredDate = new Date(`${lastWatered}T00:00:00.000Z`);

  if (!Number.isFinite(frequencyDays) || frequencyDays < 1 || Number.isNaN(wateredDate.getTime())) {
    return '';
  }

  wateredDate.setUTCDate(wateredDate.getUTCDate() + Math.floor(frequencyDays));
  return formatDate(wateredDate);
};

const prettyDate = (value) => {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const careStatusOptions = [
  { value: 'not-started', label: 'Not started' },
  { value: 'on-track', label: 'On track' },
  { value: 'due-soon', label: 'Due soon' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'needs-attention', label: 'Needs attention' },
];

const careStatusLabel = (value) => (
  careStatusOptions.find((option) => option.value === value)?.label || 'Not started'
);

export default function MyPlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [activeEditId, setActiveEditId] = useState(null);
  const [formState, setFormState] = useState({
    nickname: '',
    location: '',
    acquiredDate: '',
    lastWatered: '',
    wateringFrequencyDays: '',
    lastFertilized: '',
    careStatus: 'not-started',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const fetchMyPlants = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/myplants');
      setPlants(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your collection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPlants();
  }, []);

  const startEdit = (entry) => {
    setActiveEditId(entry._id);
    setFormState({
      nickname: entry.nickname || '',
      location: entry.location || '',
      acquiredDate: formatDate(entry.acquiredDate),
      lastWatered: formatDate(entry.lastWatered),
      wateringFrequencyDays: entry.wateringFrequencyDays || '',
      lastFertilized: formatDate(entry.lastFertilized),
      careStatus: entry.careStatus || 'not-started',
      notes: entry.notes || '',
    });
    setActionMessage('');
  };

  const cancelEdit = () => {
    setActiveEditId(null);
    setFormState({
      nickname: '',
      location: '',
      acquiredDate: '',
      lastWatered: '',
      wateringFrequencyDays: '',
      lastFertilized: '',
      careStatus: 'not-started',
      notes: '',
    });
  };

  const handleSave = async () => {
    if (!activeEditId) return;

    setSaving(true);
    setActionMessage('');

    try {
      const response = await axios.put(`/api/myplants/${activeEditId}`, {
        nickname: formState.nickname,
        location: formState.location,
        acquiredDate: formState.acquiredDate || null,
        lastWatered: formState.lastWatered || null,
        wateringFrequencyDays: formState.wateringFrequencyDays ? Number(formState.wateringFrequencyDays) : null,
        lastFertilized: formState.lastFertilized || null,
        careStatus: formState.careStatus,
        notes: formState.notes,
      });

      setPlants((prev) => prev.map((entry) => (entry._id === activeEditId ? response.data : entry)));
      setActionMessage('Plant details saved.');
      cancelEdit();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Unable to save plant details.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    setRemovingId(id);
    setActionMessage('');

    try {
      await axios.delete(`/api/myplants/${id}`);
      setPlants((prev) => prev.filter((entry) => entry._id !== id));
      setActionMessage('Plant removed from your collection.');
      if (activeEditId === id) cancelEdit();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Unable to remove plant.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <GlassCard className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">My Plants</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Your collection</h1>
            <p className="max-w-3xl text-slate-600 dark:text-slate-300">
              Manage the plants you own, update care notes, and keep your collection organized.
            </p>
          </div>
          {actionMessage && (
            <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
              {actionMessage}
            </div>
          )}
        </GlassCard>

        {loading ? (
          <GlassCard className="max-w-5xl mx-auto py-20 text-center">
            <p className="text-lg font-medium text-slate-700 dark:text-slate-200">Loading your plant collection…</p>
          </GlassCard>
        ) : error ? (
          <GlassCard className="max-w-5xl mx-auto py-16 text-center border-rose-200 bg-rose-50/80 dark:border-rose-300/30 dark:bg-rose-900/20">
            <p className="text-lg font-semibold text-rose-700 dark:text-rose-200">{error}</p>
          </GlassCard>
        ) : plants.length === 0 ? (
          <GlassCard className="max-w-5xl mx-auto py-16 text-center">
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">No plants in your collection yet</p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Visit a plant detail page to add a plant to your collection.
            </p>
            <div className="mt-6 flex justify-center">
              <Link to="/search">
                <Button type="button" variant="primary">Browse plants</Button>
              </Link>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {plants.map((entry) => {
              const plant = entry.plantId;
              const isEditing = activeEditId === entry._id;
              const calculatedNextWateringDate = calculateNextWateringDate(
                formState.lastWatered,
                formState.wateringFrequencyDays
              );

              return (
                <div key={entry._id} className="space-y-4">
                  <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
                    <PlantCard
                      plant={plant}
                      actionLabel={removingId === entry._id ? 'Removing...' : 'Remove plant'}
                      actionVariant="secondary"
                      actionDisabled={removingId === entry._id}
                      onAction={() => handleRemove(entry._id)}
                    />

                    <GlassCard className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Your plant</p>
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                              {entry.nickname || plant.commonName}
                            </h2>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <Button type="button" variant="secondary" onClick={() => startEdit(entry)}>
                              {isEditing ? 'Editing' : 'Edit details'}
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Nickname</p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{entry.nickname || 'None'}</p>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Location</p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{entry.location || 'None'}</p>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Acquired</p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{prettyDate(entry.acquiredDate)}</p>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Care status</p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{careStatusLabel(entry.careStatus)}</p>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Last watered</p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{prettyDate(entry.lastWatered)}</p>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Next watering</p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{prettyDate(entry.nextWateringDate)}</p>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Watering frequency</p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                              {entry.wateringFrequencyDays ? `Every ${entry.wateringFrequencyDays} days` : 'Not set'}
                            </p>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Last fertilized</p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{prettyDate(entry.lastFertilized)}</p>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Notes</p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{entry.notes || 'No notes yet'}</p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  {isEditing && (
                    <GlassCard className="space-y-4">
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit plant details</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Update collection details, care dates, watering cadence, and notes for this plant.
                        </p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                          Nickname
                          <input
                            value={formState.nickname}
                            onChange={(e) => setFormState((prev) => ({ ...prev, nickname: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                          Location
                          <input
                            value={formState.location}
                            onChange={(e) => setFormState((prev) => ({ ...prev, location: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                          Acquired date
                          <input
                            type="date"
                            value={formState.acquiredDate}
                            onChange={(e) => setFormState((prev) => ({ ...prev, acquiredDate: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                          Last watered
                          <input
                            type="date"
                            value={formState.lastWatered}
                            onChange={(e) => setFormState((prev) => ({ ...prev, lastWatered: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                          Watering frequency days
                          <input
                            type="number"
                            min="1"
                            value={formState.wateringFrequencyDays}
                            onChange={(e) => setFormState((prev) => ({ ...prev, wateringFrequencyDays: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                          />
                        </label>
                        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                          Next watering date
                          <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                            {calculatedNextWateringDate ? prettyDate(calculatedNextWateringDate) : 'Set last watered and frequency'}
                          </div>
                        </div>
                        <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                          Last fertilized
                          <input
                            type="date"
                            value={formState.lastFertilized}
                            onChange={(e) => setFormState((prev) => ({ ...prev, lastFertilized: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                          Care status
                          <select
                            value={formState.careStatus}
                            onChange={(e) => setFormState((prev) => ({ ...prev, careStatus: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                          >
                            {careStatusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200 sm:col-span-2">
                          Notes
                          <textarea
                            value={formState.notes}
                            onChange={(e) => setFormState((prev) => ({ ...prev, notes: e.target.value }))}
                            rows={4}
                            className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                          />
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button type="button" variant="primary" onClick={handleSave} disabled={saving}>
                          {saving ? 'Saving…' : 'Save changes'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </GlassCard>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
