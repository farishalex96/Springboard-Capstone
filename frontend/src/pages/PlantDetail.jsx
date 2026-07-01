import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import PageContainer from '../components/PageContainer';
import CareLevelBubble from '../components/CareLevelBubble';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function PlantDetail() {
  const { plantId } = useParams();
  const { user, refreshProfile } = useAuth();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const isFavorited = !!user?.favoritePlants?.some((favoriteId) => String(favoriteId) === plantId);

  useEffect(() => {
    const fetchPlant = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`/api/plants/${plantId}`);
        setPlant(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load plant details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [plantId]);

  const handleAuthRequired = () => {
    setActionMessage(
      'You need to be logged in to save this plant. ' +
        'Visit the login page to continue.'
    );
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    setFavoriteLoading(true);
    setActionMessage('');

    try {
      const favoriteUrl = `/api/favorites/${plantId}`;
      const message = isFavorited ? 'Removed from favorites.' : 'Added to favorites.';

      if (isFavorited) {
        await axios.delete(favoriteUrl);
      } else {
        await axios.post(favoriteUrl);
      }

      await refreshProfile();
      setActionMessage(message);
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Unable to update favorite status.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddToMyPlants = async () => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    setActionMessage('');

    try {
      const response = await axios.post('/api/myplants', { plantId });
      if (response.status === 200) {
        setActionMessage(response.data.message || 'Plant is already in your collection.');
      } else {
        setActionMessage('Added to My Plants. Track it from your personal collection.');
      }
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Unable to add this plant to your collection.');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <GlassCard className="max-w-5xl mx-auto py-20 text-center">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200">Loading plant details…</p>
        </GlassCard>
      </PageContainer>
    );
  }

  if (error || !plant) {
    return (
      <PageContainer>
        <GlassCard className="max-w-5xl mx-auto py-16 text-center">
          <p className="text-lg font-semibold text-rose-700 dark:text-rose-200">{error || 'Plant not found.'}</p>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Try returning to the <Link to="/search" className="font-semibold text-emerald-600 underline dark:text-emerald-300">search page</Link>.
          </p>
        </GlassCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <GlassCard className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Plant details</p>
              <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{plant.commonName}</h1>
              <p className="text-sm italic text-slate-500 dark:text-slate-400">{plant.scientificName}</p>
            </div>

            <div className="rounded-[1.75rem] overflow-hidden border border-slate-200 bg-slate-100/80 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/70">
              <img
                src={plant.imageUrl}
                alt={plant.commonName}
                className="h-96 w-full object-cover"
              />
            </div>

            <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-950/65">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">About this plant</h2>
              <p className="text-slate-600 dark:text-slate-300">{plant.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <GlassCard className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 rounded-3xl border border-emerald-200/80 bg-emerald-50/80 px-5 py-4 text-sm font-semibold text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <span>Category</span>
                  <span>{plant.category}</span>
                </div>
                <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Difficulty</p>
                    <p className="mt-2 font-semibold">{plant.difficulty}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Size</p>
                    <p className="mt-2 font-semibold">{plant.size}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="space-y-5">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Care information</h2>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <CareLevelBubble type="light" level={plant.lightLevel} detail={plant.care?.light} />
                <CareLevelBubble type="water" level={plant.waterLevel} detail={plant.care?.water} />
              </div>
            </GlassCard>

            <GlassCard className="space-y-5">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Toxicity</h2>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Pets</p>
                  <p className="mt-2 font-semibold">{plant.toxicity?.pets || 'Unknown'}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Humans</p>
                  <p className="mt-2 font-semibold">{plant.toxicity?.humans || 'Unknown'}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 dark:border-slate-700/50 dark:bg-slate-950/70 dark:text-slate-300">
                <p className="font-semibold">Notes</p>
                <p className="mt-2">{plant.toxicity?.notes || 'No toxicity notes available.'}</p>
              </div>
            </GlassCard>

            <GlassCard className="space-y-5">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Zones</h2>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Growing zones</p>
                  <p className="mt-2 font-semibold">{plant.growingZones?.join(', ') || 'N/A'}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/50 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Heat zones</p>
                  <p className="mt-2 font-semibold">{plant.heatZones?.join(', ') || 'N/A'}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="space-y-4">
              <div className="space-y-3">
                <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">Save this plant</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {user
                    ? 'Add this plant to a personal collection or mark it as a favorite.'
                    : (
                        <>
                          Create an account to save plants. <Link to="/login" className="font-semibold text-emerald-600 underline dark:text-emerald-300">Log in</Link> to continue.
                        </>
                      )}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={handleFavoriteToggle}
                  className="flex-1"
                  variant={user ? 'primary' : 'ghost'}
                  disabled={favoriteLoading}
                >
                  {isFavorited ? 'Remove favorite' : 'Add to Favorites'}
                </Button>
                <Button
                  type="button"
                  onClick={handleAddToMyPlants}
                  className="flex-1"
                  variant={user ? 'primary' : 'secondary'}
                >
                  Add to My Plants
                </Button>
              </div>

              {actionMessage && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700/50 dark:bg-slate-900/70 dark:text-slate-200">
                  {actionMessage}
                </div>
              )}
            </GlassCard>
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  );
}
