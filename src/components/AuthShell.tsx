'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Logo from './Logo';

type Props = {
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthShell({ children, footer }: Props) {
  return (
    <div className="min-h-screen bg-glow bg-grid relative overflow-hidden flex items-center justify-center p-6 sm:p-10">
      {/* Décorations */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-orange-500/15 to-transparent blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-xl"
      >
        {/* Glow border */}
        <div className="absolute -inset-1 bg-gradient-to-br from-orange-500/40 via-orange-600/20 to-amber-500/30 rounded-[2rem] blur-sm" />

        <div className="relative rounded-[1.75rem] border border-white/10 bg-[#0c0c10]/90 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

          <div className="px-8 sm:px-12 pt-10 pb-8">
            <div className="flex justify-center mb-10">
              <Logo />
            </div>
            {children}
          </div>

          {footer && (
            <div className="px-8 sm:px-12 pb-10 pt-2 border-t border-white/5">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
