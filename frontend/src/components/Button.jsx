import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-emerald-600 text-white shadow-[0_20px_45px_-18px_rgba(16,185,129,0.65)] hover:bg-emerald-500',
  secondary: 'bg-white/85 text-slate-900 shadow-sm border border-slate-200/80 hover:bg-white dark:bg-slate-800/75 dark:text-slate-100 dark:border-slate-700/80 dark:hover:bg-slate-700',
  ghost: 'bg-transparent text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-500/10',
};

export function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
