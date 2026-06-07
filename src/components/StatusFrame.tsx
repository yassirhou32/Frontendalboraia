'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Send, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusVariant = 'enviado' | 'aprobado' | 'rechazado' | 'pendiente' | 'error';

const config: Record<StatusVariant, {
  icon: typeof Send;
  title: string;
  gradient: string;
  glow: string;
  ring: string;
  text: string;
  accent: string;
  pulse?: boolean;
}> = {
  enviado: {
    icon: Send,
    title: 'SOLICITUD ENVIADA',
    gradient: 'from-indigo-600/20 via-violet-600/15 to-indigo-900/30',
    glow: 'shadow-[0_0_60px_-10px_rgba(99,102,241,0.5),0_20px_60px_-20px_rgba(0,0,0,0.8)]',
    ring: 'ring-indigo-400/30',
    text: 'text-indigo-100/90',
    accent: 'text-indigo-300',
  },
  aprobado: {
    icon: CheckCircle,
    title: 'SOLICITUD APROBADA',
    gradient: 'from-emerald-600/20 via-green-600/15 to-emerald-900/30',
    glow: 'shadow-[0_0_60px_-10px_rgba(34,197,94,0.5),0_20px_60px_-20px_rgba(0,0,0,0.8)]',
    ring: 'ring-emerald-400/30',
    text: 'text-emerald-100/90',
    accent: 'text-emerald-300',
  },
  rechazado: {
    icon: XCircle,
    title: 'SOLICITUD RECHAZADA',
    gradient: 'from-red-600/20 via-rose-600/15 to-red-900/30',
    glow: 'shadow-[0_0_60px_-10px_rgba(239,68,68,0.5),0_20px_60px_-20px_rgba(0,0,0,0.8)]',
    ring: 'ring-red-400/30',
    text: 'text-red-100/90',
    accent: 'text-red-300',
    pulse: true,
  },
  pendiente: {
    icon: Clock,
    title: 'SOLICITUD PENDIENTE',
    gradient: 'from-amber-600/15 via-yellow-600/10 to-amber-900/25',
    glow: 'shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)]',
    ring: 'ring-amber-400/25',
    text: 'text-amber-100/90',
    accent: 'text-amber-300',
  },
  error: {
    icon: AlertTriangle,
    title: 'ERROR',
    gradient: 'from-red-600/20 via-rose-600/15 to-red-900/30',
    glow: 'shadow-[0_0_50px_-10px_rgba(239,68,68,0.4)]',
    ring: 'ring-red-400/30',
    text: 'text-red-100/90',
    accent: 'text-red-300',
  },
};

type Props = {
  variant: StatusVariant;
  message: string;
  subtitle?: string;
  mode?: 'toast' | 'inline';
  visible?: boolean;
  onDismiss?: () => void;
  autoDismissMs?: number;
};

function FrameContent({
  variant,
  message,
  subtitle,
  onDismiss,
}: {
  variant: StatusVariant;
  message: string;
  subtitle?: string;
  onDismiss?: () => void;
}) {
  const cfg = config[variant];
  const Icon = cfg.icon;

  return (
    <div className={cn(
      'status-frame relative overflow-hidden rounded-[24px] backdrop-blur-md ring-1',
      `bg-gradient-to-br ${cfg.gradient}`,
      cfg.glow,
      cfg.ring,
      cfg.pulse && 'animate-pulse'
    )}>
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-6 flex items-start gap-4">
        <div className={cn(
          'shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center',
          'bg-black/30 backdrop-blur-md ring-1',
          cfg.ring
        )}>
          <Icon className={cn('w-6 h-6 sm:w-7 sm:h-7', cfg.accent)} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn('font-bold text-base sm:text-lg tracking-tight', cfg.accent)}>
            {cfg.title}
          </p>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-1 font-medium">
              {subtitle}
            </p>
          )}
          <p className={cn('text-base sm:text-lg mt-3 leading-relaxed font-medium', cfg.text)}>
            {message}
          </p>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 w-8 h-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-neutral-500 hover:text-white text-xs"
          >
            ✕
          </button>
        )}
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
        initial={{ width: '0%', opacity: 0 }}
        animate={{ width: '100%', opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
      />
    </div>
  );
}

export default function StatusFrame({
  variant,
  message,
  subtitle,
  mode = 'inline',
  visible = true,
  onDismiss,
  autoDismissMs = 8000,
}: Props) {
  useEffect(() => {
    if (mode !== 'toast' || !visible || !onDismiss || !autoDismissMs) return;
    const t = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(t);
  }, [mode, visible, onDismiss, autoDismissMs]);

  if (mode === 'toast') {
    if (typeof document === 'undefined') return null;
    const toast = (
      <AnimatePresence>
        {visible && message && (
          <motion.div
            key="status-toast"
            initial={{ y: 100, opacity: 0, scale: 0.94, filter: 'blur(12px)' }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ y: 100, opacity: 0, scale: 0.94, filter: 'blur(12px)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed bottom-8 left-[58%] -translate-x-1/2 z-[10000] w-full max-w-lg px-4 pointer-events-auto"
          >
            <FrameContent variant={variant} message={message} subtitle={subtitle} onDismiss={onDismiss} />
          </motion.div>
        )}
      </AnimatePresence>
    );
    return createPortal(toast, document.body);
  }

  if (!visible || !message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <FrameContent variant={variant} message={message} subtitle={subtitle} />
    </motion.div>
  );
}

export function statusToVariant(estado: string): StatusVariant {
  if (estado === 'aprobado') return 'aprobado';
  if (estado === 'rechazado') return 'rechazado';
  return 'pendiente';
}

export function statusMessage(estado: string, motivoRechazo?: string): string {
  if (estado === 'aprobado') return 'Tu solicitud ha sido validada por el garage. Consulta la facturación abajo.';
  if (estado === 'rechazado') return motivoRechazo ? `Motivo: ${motivoRechazo}` : 'Tu solicitud no ha sido aceptada. Contacta con el garage para más información.';
  return 'Tu solicitud está en revisión. Te notificaremos cuando sea procesada.';
}
