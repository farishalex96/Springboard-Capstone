import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageContainer from '../components/PageContainer';
import GlassCard from '../components/GlassCard';
import PlantCard from '../components/PlantCard';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

const getDailyPlantIndex = (count) => {
  if (!count) return 0;

  const today = new Date();
  const daySeed = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const dayNumber = Math.floor(daySeed / 86400000);

  return dayNumber % count;
};

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [plants, setPlants] = useState([]);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [plantsError, setPlantsError] = useState('');
  const [collection, setCollection] = useState([]);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [collectionError, setCollectionError] = useState('');

  useEffect(() => {
    const fetchPlants = async () => {
      setPlantsLoading(true);
      setPlantsError('');

      try {
        const response = await axios.get('/api/plants');
        setPlants(response.data);
      } catch (err) {
        setPlantsError(err.response?.data?.message || 'Unable to load featured plant.');
      } finally {
        setPlantsLoading(false);
      }
    };

    fetchPlants();
  }, []);

  useEffect(() => {
    if (authLoading || !user) {
      setCollection([]);
      setCollectionLoading(false);
      setCollectionError('');
      return;
    }

    const fetchCollection = async () => {
      setCollectionLoading(true);
      setCollectionError('');

      try {
        const response = await axios.get('/api/myplants');
        setCollection(response.data);
      } catch (err) {
        setCollectionError(err.response?.data?.message || 'Unable to load your collection.');
      } finally {
        setCollectionLoading(false);
      }
    };

    fetchCollection();
  }, [authLoading, user]);

  const featuredPlant = useMemo(() => {
    if (plants.length === 0) return null;
    return plants[getDailyPlantIndex(plants.length)];
  }, [plants]);

  const collectionPreview = collection.slice(0, 3);

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl space-y-8">
        <GlassCard className="space-y-6">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Indoor plant care made simple</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
              Greenlight helps you manage your indoor plants with calm, natural clarity.
            </h1>
            <p className="max-w-2xl text-slate-600 dark:text-slate-300">
              A modern plant care experience that balances search, favorites, and your personal plant collection in one beautiful interface.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/search" className="inline-block">
                <Button>Browse plants</Button>
              </Link>
              <Link to="/my-plants" className="inline-block">
                <Button variant="secondary">My collection</Button>
              </Link>
            </div>
          </div>
        </GlassCard>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Daily feature</p>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Plant of the day</h2>
              <p className="text-slate-600 dark:text-slate-300">
                A fresh plant from the Greenlight catalog, rotated daily.
              </p>
            </div>

            {plantsLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-slate-600 dark:border-slate-700/50 dark:bg-slate-950/70 dark:text-slate-300">
                Loading today&apos;s plant...
              </div>
            ) : plantsError ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-6 text-rose-700 dark:border-rose-300/30 dark:bg-rose-900/20 dark:text-rose-200">
                {plantsError}
              </div>
            ) : featuredPlant ? (
              <div className="grid gap-5 sm:grid-cols-[0.8fr_1fr] lg:grid-cols-1 xl:grid-cols-[0.8fr_1fr]">
                <Link to={`/plants/${featuredPlant._id}`} className="group block overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src={featuredPlant.imageUrl}
                    alt={featuredPlant.commonName}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      <span>{featuredPlant.category}</span>
                      <span>{featuredPlant.difficulty}</span>
                    </div>
                    <Link to={`/plants/${featuredPlant._id}`} className="mt-3 block">
                      <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{featuredPlant.commonName}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{featuredPlant.scientificName}</p>
                    </Link>
                  </div>
                  <p className="line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{featuredPlant.description}</p>
                  <Link to={`/plants/${featuredPlant._id}`} className="inline-block">
                    <Button type="button" variant="secondary">View plant</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-slate-600 dark:border-slate-700/50 dark:bg-slate-950/70 dark:text-slate-300">
                No plants are available yet.
              </div>
            )}
          </GlassCard>

          <GlassCard className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Your greenhouse</p>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Collection preview</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Keep your saved plants close at hand from the home page.
                </p>
              </div>
              {user && (
                <Link to="/my-plants" className="inline-block">
                  <Button type="button" variant="secondary">View all</Button>
                </Link>
              )}
            </div>

            {authLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-slate-600 dark:border-slate-700/50 dark:bg-slate-950/70 dark:text-slate-300">
                Checking your session...
              </div>
            ) : !user ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-6 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <p className="font-semibold text-emerald-950 dark:text-emerald-100">Sign in to see your plant collection here.</p>
                <p className="mt-2 text-sm leading-6 text-emerald-900 dark:text-emerald-200">
                  Your saved plants, care notes, and watering details will appear as a quick home-page snapshot.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to="/login">
                    <Button type="button" variant="primary">Log in</Button>
                  </Link>
                  <Link to="/register">
                    <Button type="button" variant="secondary">Create account</Button>
                  </Link>
                </div>
              </div>
            ) : collectionLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-slate-600 dark:border-slate-700/50 dark:bg-slate-950/70 dark:text-slate-300">
                Loading your collection...
              </div>
            ) : collectionError ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-6 text-rose-700 dark:border-rose-300/30 dark:bg-rose-900/20 dark:text-rose-200">
                {collectionError}
              </div>
            ) : collectionPreview.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-700/50 dark:bg-slate-950/70">
                <p className="font-semibold text-slate-900 dark:text-slate-100">No plants saved yet</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Browse the catalog and add a plant from its detail page.
                </p>
                <div className="mt-5">
                  <Link to="/search">
                    <Button type="button" variant="primary">Browse plants</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {collectionPreview.map((entry) => (
                  <PlantCard key={entry._id} plant={entry.plantId} />
                ))}
              </div>
            )}
          </GlassCard>
        </section>
      </div>
    </PageContainer>
  );
}
