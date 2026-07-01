import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`rounded-[2rem] border border-white/30 bg-white/70 px-6 py-6 shadow-glass backdrop-blur-xl transition-colors duration-500 dark:border-slate-700/40 dark:bg-slate-900/50 ${className}`}
    >
      {children}
    </motion.div>
  );
}
