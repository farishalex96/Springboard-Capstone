const lightLevelLabels = {
  1: 'Very low light',
  2: 'Low to medium indirect light',
  3: 'Medium to bright indirect light',
  4: 'Bright indirect light',
  5: 'Bright indirect to direct light',
};

const waterLevelLabels = {
  1: 'Very low water',
  2: 'Low water',
  3: 'Moderate water',
  4: 'Higher moisture',
  5: 'Very high moisture',
};

const levelLabels = {
  light: lightLevelLabels,
  water: waterLevelLabels,
};

export default function CareLevelBubble({ type, level, detail, compact = false }) {
  const label = levelLabels[type]?.[level] || 'Care level';
  const title = type === 'light' ? 'Light level' : 'Water level';
  const description = detail || label;

  return (
    <span className="group/level relative inline-flex w-full cursor-help items-center justify-between gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-left dark:border-slate-700/50 dark:bg-slate-950/70">
      <span>{compact ? title.replace(' level', '') : title}: {level ?? 'Unknown'}</span>
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
        i
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-64 -translate-x-1/2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-xs leading-5 text-slate-700 opacity-0 shadow-glass transition group-hover/level:opacity-100 group-focus-within/level:opacity-100 dark:border-emerald-500/25 dark:bg-slate-950 dark:text-slate-200">
        <span className="block font-semibold text-slate-900 dark:text-slate-100">{label}</span>
        <span className="mt-1 block">{description}</span>
      </span>
    </span>
  );
}
