import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import PageContainer from '../components/PageContainer';
import CareLevelBubble from '../components/CareLevelBubble';
import { Button } from '../components/Button';

const categoryOptions = ['Foliage', 'Succulent', 'Flowering'];
const difficultyOptions = ['Easy', 'Moderate'];
const sizeOptions = ['1-2 ft', '1-4 ft', '1-10 ft', '2-4 ft', '2-3 ft', '3-8 ft', '4-6 ft', '4-8 ft', '6-8 in', '3-6 in', '1-2 ft trailing'];
const levelOptions = [1, 2, 3, 4, 5];
const zoneOptions = ['8', '9', '10', '11', '12', '13'];

const defaultFilters = {
  category: '',
  difficulty: '',
  size: '',
  petSafe: false,
  humanSafe: false,
  lightLevel: '',
  waterLevel: '',
  growingZone: '',
  heatZone: '',
};

const buildParams = (search, filters) => {
  const params = {};

  if (search.trim()) {
    params.search = search.trim();
  }
  if (filters.category) {
    params.category = filters.category;
  }
  if (filters.difficulty) {
    params.difficulty = filters.difficulty;
  }
  if (filters.size) {
    params.size = filters.size;
  }
  if (filters.petSafe) {
    params.petSafe = true;
  }
  if (filters.humanSafe) {
    params.humanSafe = true;
  }
  if (filters.lightLevel) {
    params.lightLevel = filters.lightLevel;
  }
  if (filters.waterLevel) {
    params.waterLevel = filters.waterLevel;
  }
  if (filters.growingZone) {
    params.growingZone = filters.growingZone;
  }
  if (filters.heatZone) {
    params.heatZone = filters.heatZone;
  }

  return params;
};

export default function Search() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchPlants = async (params = {}) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/plants', { params });
      setPlants(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load plants. Please try again.');
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    fetchPlants(buildParams(query, filters));
  };

  const handleReset = () => {
    setQuery('');
    setFilters(defaultFilters);
    setError('');
    setIsSubmitted(false);
    fetchPlants();
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <GlassCard className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Plant search</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Find your next indoor companion</h1>
            <p className="max-w-2xl text-slate-600 dark:text-slate-300">
              Search and filter the Greenlight plant library by care needs, pet safety, and growing conditions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Search</label>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  placeholder="Search by common or scientific name"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Category
                  <select
                    value={filters.category}
                    onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  >
                    <option value="">All categories</option>
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Difficulty
                  <select
                    value={filters.difficulty}
                    onChange={(event) => setFilters((prev) => ({ ...prev, difficulty: event.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  >
                    <option value="">All difficulties</option>
                    {difficultyOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Size
                  <select
                    value={filters.size}
                    onChange={(event) => setFilters((prev) => ({ ...prev, size: event.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  >
                    <option value="">All sizes</option>
                    {sizeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700/60 dark:bg-slate-950/60">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={filters.petSafe}
                    onChange={(event) => setFilters((prev) => ({ ...prev, petSafe: event.target.checked }))}
                    className="h-5 w-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Pet safe only
                </label>

                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={filters.humanSafe}
                    onChange={(event) => setFilters((prev) => ({ ...prev, humanSafe: event.target.checked }))}
                    className="h-5 w-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Human safe
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Light level
                  <select
                    value={filters.lightLevel}
                    onChange={(event) => setFilters((prev) => ({ ...prev, lightLevel: event.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  >
                    <option value="">Any</option>
                    {levelOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Water level
                  <select
                    value={filters.waterLevel}
                    onChange={(event) => setFilters((prev) => ({ ...prev, waterLevel: event.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  >
                    <option value="">Any</option>
                    {levelOptions.filter((option) => option <= 4).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Growing zone
                  <select
                    value={filters.growingZone}
                    onChange={(event) => setFilters((prev) => ({ ...prev, growingZone: event.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  >
                    <option value="">Any</option>
                    {zoneOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Heat zone
                  <select
                    value={filters.heatZone}
                    onChange={(event) => setFilters((prev) => ({ ...prev, heatZone: event.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
                  >
                    <option value="">Any</option>
                    {zoneOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" className="flex-1">Search</Button>
                <Button type="button" variant="secondary" onClick={handleReset} className="flex-1">
                  Reset filters
                </Button>
              </div>
            </div>
          </form>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Results</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {loading ? 'Fetching plants…' : `${plants.length} plant${plants.length === 1 ? '' : 's'} found`}
              </p>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {isSubmitted ? 'Filtered results are shown below.' : 'Showing all indoor plants.'}
            </div>
          </div>

          {loading ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-10 text-center text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/70 dark:text-slate-300">
              Loading plants...
            </div>
          ) : error ? (
            <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50/80 p-8 text-center text-rose-700 shadow-sm dark:border-rose-300/30 dark:bg-rose-900/20 dark:text-rose-200">
              <p className="font-semibold">Unable to load plants</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          ) : plants.length === 0 ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-8 text-center text-slate-700 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/70 dark:text-slate-300">
              <p className="font-semibold">No matching plants found</p>
              <p className="mt-2 text-sm">Try adjusting your search or filters to see more plants.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {plants.map((plant) => (
                  <motion.article
                    key={plant._id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="group overflow-visible rounded-[1.75rem] border border-white/40 bg-white/80 shadow-glass backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-200 dark:border-slate-700/50 dark:bg-slate-900/65"
                  >
                    <Link to={`/plants/${plant._id}`} className="block h-full">
                      <div className="overflow-hidden rounded-t-[1.75rem] bg-slate-100 dark:bg-slate-800">
                        <img
                          src={plant.imageUrl}
                          alt={plant.commonName}
                          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                            {plant.category}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            {plant.difficulty}
                          </span>
                        </div>

                        <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {plant.commonName}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {plant.description}
                        </p>

                        <div className="mt-5 grid gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700/50 dark:bg-slate-950/70">
                            Size: {plant.size || 'Unknown'}
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700/50 dark:bg-slate-950/70">
                            Pet safe: {plant.petSafe ? 'Yes' : 'No'}
                          </div>
                          <CareLevelBubble type="light" level={plant.lightLevel} detail={plant.care?.light} compact />
                          <CareLevelBubble type="water" level={plant.waterLevel} detail={plant.care?.water} compact />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </GlassCard>
      </div>
    </PageContainer>
  );
}
