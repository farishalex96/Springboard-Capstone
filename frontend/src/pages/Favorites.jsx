import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import PageContainer from '../components/PageContainer';
import PlantCard from '../components/PlantCard';
import { Button } from '../components/Button';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('/api/favorites');
        setFavorites(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load favorites.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (plantId) => {
    setActionMessage('');

    try {
      await axios.delete(`/api/favorites/${plantId}`);
      setFavorites((prev) => prev.filter((plant) => String(plant._id) !== plantId));
      setActionMessage('Favorite removed successfully.');
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Unable to remove favorite.');
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <GlassCard className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Saved favorites</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Your favorite plants</h1>
            <p className="max-w-3xl text-slate-600 dark:text-slate-300">
              View the plants you've marked as favorites and remove any item you no longer want to save.
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
            <p className="text-lg font-medium text-slate-700 dark:text-slate-200">Loading favorites…</p>
          </GlassCard>
        ) : error ? (
          <GlassCard className="max-w-5xl mx-auto py-16 text-center border-rose-200 bg-rose-50/80 dark:border-rose-300/30 dark:bg-rose-900/20">
            <p className="text-lg font-semibold text-rose-700 dark:text-rose-200">{error}</p>
          </GlassCard>
        ) : favorites.length === 0 ? (
          <GlassCard className="max-w-5xl mx-auto py-16 text-center">
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">No favorites yet</p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Head to search to discover plants and add them to your favorites.
            </p>
            <div className="mt-6 flex justify-center">
              <Link to="/search" className="w-full sm:w-auto">
                <Button type="button" variant="primary">
                  Explore plants
                </Button>
              </Link>
            </div>
          </GlassCard>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {favorites.map((plant) => (
              <PlantCard
                key={plant._id}
                plant={plant}
                actionLabel="Remove favorite"
                actionVariant="secondary"
                onAction={() => handleRemove(plant._id)}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
