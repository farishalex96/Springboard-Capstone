import { Link } from 'react-router-dom';
import GlassCard from './GlassCard';
import { Button } from './Button';

export default function PlantCard({ plant, actionLabel, onAction, actionVariant = 'secondary', actionDisabled = false }) {
  return (
    <GlassCard className="flex flex-col overflow-hidden p-0 shadow-glass">
      <Link to={`/plants/${plant._id}`} className="group block overflow-hidden transition hover:opacity-90">
        <div className="h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={plant.imageUrl}
            alt={plant.commonName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          <span>{plant.category}</span>
          <span>{plant.difficulty}</span>
        </div>
        <Link to={`/plants/${plant._id}`} className="block">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{plant.commonName}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plant.scientificName}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{plant.description}</p>
        </Link>
        {onAction && (
          <Button
            type="button"
            onClick={onAction}
            variant={actionVariant}
            className="w-full"
            disabled={actionDisabled}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
