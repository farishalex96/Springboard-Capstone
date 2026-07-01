import React from 'react';
import { motion } from 'framer-motion';

function Rule({ passed, children }) {
  return (
    <div className="flex items-start gap-2">
      <div className={`mt-1 text-sm ${passed ? 'text-emerald-600' : 'text-rose-500'}`}>
        {passed ? '✓' : '✕'}
      </div>
      <div className={`text-sm ${passed ? 'text-emerald-700' : 'text-slate-600 dark:text-slate-300'}`}>{children}</div>
    </div>
  );
}

export default function PasswordRules({ password = '', visible = false, textOnly = false, animate = false }) {
  if (!visible) return null;

  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?"{}|<>\[\]\\;:'`~_+=\-\/]/.test(password);

  const rules = [
    { passed: minLength, text: 'At least 8 characters' },
    { passed: hasUpper, text: 'At least one uppercase letter' },
    { passed: hasNumber, text: 'At least one number' },
    { passed: hasSpecial, text: 'At least one special character' },
  ];

  if (textOnly) {
    const rulesText = rules.map((r) => r.text).join(', ');
    const content = (
      <div className="mt-2 bg-white/50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200">
        {rulesText}
      </div>
    );

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      );
    }
    return content;
  }

  return (
    <div className="mt-2 space-y-1 bg-white/50 p-3 rounded-md border border-slate-100 dark:bg-slate-900/60 dark:border-slate-700">
      <Rule passed={minLength}>At least 8 characters</Rule>
      <Rule passed={hasUpper}>At least one uppercase letter</Rule>
      <Rule passed={hasNumber}>At least one number</Rule>
      <Rule passed={hasSpecial}>At least one special character</Rule>
    </div>
  );
}
