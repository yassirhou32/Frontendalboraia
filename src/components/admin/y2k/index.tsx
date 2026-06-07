'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue, LayoutGroup } from 'framer-motion';
import { ArrowLeft, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

function PremiumCarSvg({ className, uid, animateWheels = false }: { className?: string; uid: string; animateWheels?: boolean }) {
  const grad = `carGold-${uid}`;
  const glow = `carGlow-${uid}`;
  const Wheel = animateWheels ? motion.g : 'g';
  const wheelSpin = animateWheels
    ? { animate: { rotate: 360 }, transition: { duration: 0.5, repeat: Infinity, ease: 'linear' as const } }
    : {};

  return (
    <svg viewBox="0 0 72 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9A7B1A" />
        </linearGradient>
        <radialGradient id={glow} cx="80%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF8D0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="36" cy="30" rx="28" ry="2" fill="rgba(212,175,55,0.15)" />
      <motion.ellipse
        cx="64" cy="16" rx="8" ry="4"
        fill={`url(#${glow})`}
        animate={{ opacity: [0.3, 0.9, 0.3], rx: [6, 10, 6] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <Wheel style={{ transformOrigin: '17px 27px', transformBox: 'fill-box' as never }} {...wheelSpin}>
        <circle cx="17" cy="27" r="5.5" stroke={`url(#${grad})`} strokeWidth="1.6" fill="#080808" />
        <circle cx="17" cy="27" r="2.2" fill={`url(#${grad})`} opacity="0.55" />
        <line x1="17" y1="22" x2="17" y2="32" stroke={`url(#${grad})`} strokeWidth="0.8" opacity="0.4" />
        <line x1="12" y1="27" x2="22" y2="27" stroke={`url(#${grad})`} strokeWidth="0.8" opacity="0.4" />
      </Wheel>
      <Wheel style={{ transformOrigin: '53px 27px', transformBox: 'fill-box' as never }} {...wheelSpin}>
        <circle cx="53" cy="27" r="5.5" stroke={`url(#${grad})`} strokeWidth="1.6" fill="#080808" />
        <circle cx="53" cy="27" r="2.2" fill={`url(#${grad})`} opacity="0.55" />
        <line x1="53" y1="22" x2="53" y2="32" stroke={`url(#${grad})`} strokeWidth="0.8" opacity="0.4" />
        <line x1="48" y1="27" x2="58" y2="27" stroke={`url(#${grad})`} strokeWidth="0.8" opacity="0.4" />
      </Wheel>
      <path
        d="M6 26 L11 20 L18 17 L28 12 L42 9 L54 10 L64 14 L68 18 L66 24 L60 26 Z"
        stroke={`url(#${grad})`}
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill="rgba(212,175,55,0.12)"
      />
      <path
        d="M30 12 L40 9 L52 10 L60 14 L55 17 L34 17 Z"
        stroke={`url(#${grad})`}
        strokeWidth="1.2"
        fill="rgba(255,255,255,0.08)"
      />
      <path d="M62 15 L68 17 L65 20" stroke="#FFF3B0" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M42 9 L54 10" stroke="#FFF3B0" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function CarSpeedStreak({ delay, top, width }: { delay: number; top: string; width: string }) {
  return (
    <motion.span
      className="absolute h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#F5D76E] to-transparent pointer-events-none"
      style={{ top, width }}
      animate={{
        x: [28, -36],
        opacity: [0, 0.85, 0],
        scaleX: [0.4, 1.2, 0.6],
      }}
      transition={{ duration: 1.1, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  );
}

function CarExhaustSpark({ delay, y }: { delay: number; y: number }) {
  return (
    <motion.span
      className="absolute w-1.5 h-1.5 rounded-full bg-[#F5D76E] pointer-events-none"
      style={{ top: y }}
      animate={{
        x: [-8, -22],
        y: [0, -4],
        opacity: [0.9, 0],
        scale: [1, 0.2],
      }}
      transition={{ duration: 0.7, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  );
}

export function AnimatedCarIcon({ className, amplified = false }: { className?: string; amplified?: boolean }) {
  const uid = React.useId().replace(/:/g, '');
  const travel = amplified ? 32 : 20;
  const bounce = amplified ? 6 : 4;
  const lean = amplified ? 5 : 3;
  const duration = amplified ? 3.2 : 4.5;
  const carSize = amplified ? 'w-[4rem]' : 'w-[3.6rem]';

  return (
    <div className={cn(
      'relative shrink-0 overflow-visible',
      amplified ? 'w-[6.5rem] h-[4.5rem]' : 'w-[5.5rem] h-16',
      className
    )}>
      <motion.div
        animate={{ opacity: [0.15, 0.45, 0.15], scale: [0.85, 1.15, 0.85] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[4.5rem] h-5 rounded-full bg-[#D4AF37]/30 blur-lg pointer-events-none"
      />

      <div className="absolute bottom-3 left-2 right-2 h-[2px] overflow-hidden opacity-50 pointer-events-none">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: amplified ? 0.4 : 0.55, repeat: Infinity, ease: 'linear' }}
          className="flex gap-2 w-[200%]"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="block w-3 h-[2px] rounded-full bg-[#D4AF37]/70 shrink-0" />
          ))}
        </motion.div>
      </div>

      <CarSpeedStreak delay={0} top="32%" width={amplified ? '2.5rem' : '2rem'} />
      <CarSpeedStreak delay={0.2} top="44%" width={amplified ? '3rem' : '2.5rem'} />
      <CarSpeedStreak delay={0.4} top="56%" width={amplified ? '2.25rem' : '1.75rem'} />
      <CarSpeedStreak delay={0.6} top="38%" width={amplified ? '2.75rem' : '2.25rem'} />

      <motion.div
        animate={{
          x: [-travel, travel, -travel],
          y: [0, -bounce, 0, bounce * 0.5, 0],
          rotate: [-lean, 0, lean, 0, -lean],
        }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 pointer-events-none">
            <CarExhaustSpark delay={0} y={4} />
            <CarExhaustSpark delay={0.2} y={10} />
            <CarExhaustSpark delay={0.4} y={7} />
            {amplified && <CarExhaustSpark delay={0.6} y={12} />}
          </div>
          <PremiumCarSvg
            animateWheels
            className={cn(carSize, 'h-auto relative z-10 drop-shadow-[0_0_22px_rgba(212,175,55,0.65)]')}
            uid={uid}
          />
        </div>
      </motion.div>

      <motion.div
        animate={{ opacity: [0, 0.6, 0], scaleX: [0.5, 1.3, 0.5] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-[#FFF3B0]/50 to-transparent pointer-events-none"
      />
    </div>
  );
}

export function AnimatedCarLogo({ className }: { className?: string }) {
  const uid = React.useId().replace(/:/g, '');
  return (
    <div className={cn(
      'relative w-14 h-14 rounded-lg overflow-hidden shrink-0',
      'bg-gradient-to-br from-[#1c1c1c] via-[#111] to-[#080808]',
      'border border-[#D4AF37]/40 shadow-[0_0_24px_rgba(212,175,55,0.15)]',
      className
    )}>
      <div className="absolute inset-0 automotive-carbon opacity-60" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      <motion.div
        animate={{ x: [-6, 6, -6], y: [0, -1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center px-1"
      >
        <PremiumCarSvg animateWheels className="w-10 h-auto drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]" uid={`logo-${uid}`} />
      </motion.div>
    </div>
  );
}

export const premiumInputClass =
  'w-full px-5 py-4 bg-white/[0.04] border border-white/[0.1] rounded-xl text-base text-white outline-none transition-all duration-200 placeholder:text-neutral-500 focus:border-white/25 focus:bg-white/[0.06] focus:ring-4 focus:ring-white/[0.04]';

export const premiumLabelClass =
  'block text-sm font-semibold text-neutral-300 mb-2.5 tracking-wide';

export const authCardClass =
  'rounded-3xl !bg-black/20 !backdrop-blur-sm border-white/35 shadow-[0_8px_32px_rgba(0,0,0,0.25)] gold-line-top [&>div]:border-white/20 [&_.card-title]:drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [&>div>p]:drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]';

export const authInputClass = cn(
  premiumInputClass,
  '!bg-black/25 !border-white/30 placeholder:text-neutral-300 focus:!bg-black/35 focus:!border-white/45 focus:ring-white/10'
);

export const authLabelClass = cn(
  premiumLabelClass,
  'text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]'
);

export const authLinkCardClass =
  'rounded-3xl border border-white/30 bg-black/20 backdrop-blur-sm hover:border-white/45 hover:bg-black/30 transition-all';

export const clientCardClass = authCardClass;
export const clientInputClass = authInputClass;
export const clientLabelClass = authLabelClass;

export function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

      .admin-y2k {
        --bg: #050506;
        --surface: #0e0e10;
        --surface-elevated: #141418;
        --gold: #D4AF37;
        --gold-light: #F5D76E;
        --gold-glow: rgba(212, 175, 55, 0.35);
        --border: rgba(255, 255, 255, 0.08);
        --border-gold: rgba(212, 175, 55, 0.35);
        --text: #fafafa;
        --muted: #9ca3af;
        background-color: var(--bg);
        color: var(--text);
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .admin-y2k .font-mono { font-family: 'JetBrains Mono', monospace; }

      .admin-y2k ::-webkit-scrollbar { width: 6px; }
      .admin-y2k ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 8px; }

      .admin-y2k .display-title {
        font-family: 'Orbitron', 'Plus Jakarta Sans', sans-serif;
        font-size: clamp(2.75rem, 6vw, 4.75rem);
        font-weight: 800;
        letter-spacing: 0.02em;
        line-height: 0.95;
        color: #fff;
        text-transform: uppercase;
      }

      .admin-y2k .gold-text {
        background: linear-gradient(135deg, #F5D76E 0%, #D4AF37 50%, #B8860B 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .admin-y2k .automotive-carbon {
        background-image:
          linear-gradient(135deg, rgba(255,255,255,0.03) 25%, transparent 25%),
          linear-gradient(225deg, rgba(255,255,255,0.03) 25%, transparent 25%),
          linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
          linear-gradient(315deg, rgba(255,255,255,0.03) 25%, transparent 25%);
        background-size: 8px 8px;
        background-color: #0a0a0a;
      }

      .admin-y2k .gold-line-top::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
      }

      .admin-y2k .card-title {
        font-size: clamp(1.35rem, 2.5vw, 1.75rem);
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 1.2;
        color: #fff;
      }

      .admin-y2k .stat-number {
        font-size: clamp(2.5rem, 5vw, 3.5rem);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1;
      }

      .admin-y2k.auth-page {
        background-color: transparent;
      }

      .admin-y2k.auth-page .display-title {
        text-shadow: 0 2px 16px rgba(0, 0, 0, 0.95), 0 0 40px rgba(0, 0, 0, 0.5);
      }

      .admin-y2k.client-shell,
      .admin-y2k.admin-shell {
        background-color: transparent;
      }

      .admin-y2k.client-shell .chrome-card,
      .admin-y2k.admin-shell .chrome-card {
        background: rgba(0, 0, 0, 0.14) !important;
        backdrop-filter: blur(6px);
        border-color: rgba(255, 255, 255, 0.24);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
      }

      .admin-y2k.client-shell .chrome-card .card-title,
      .admin-y2k.admin-shell .chrome-card .card-title,
      .admin-y2k.client-shell .page-intro h2,
      .admin-y2k.admin-shell .page-intro h2 {
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.5);
      }

      .admin-y2k.client-shell .page-intro p,
      .admin-y2k.admin-shell .page-intro p,
      .admin-y2k.client-shell .chrome-card p,
      .admin-y2k.admin-shell .chrome-card p,
      .admin-y2k.client-shell .chrome-card label,
      .admin-y2k.admin-shell .chrome-card label,
      .admin-y2k.client-shell .chrome-card span,
      .admin-y2k.admin-shell .chrome-card span,
      .admin-y2k.client-shell .chrome-card h3,
      .admin-y2k.admin-shell .chrome-card h3 {
        text-shadow: 0 1px 6px rgba(0, 0, 0, 0.92);
      }

      .admin-y2k.client-shell .page-intro,
      .admin-y2k.admin-shell .page-intro {
        border-color: rgba(255, 255, 255, 0.15);
      }

      .admin-y2k.client-shell .display-title,
      .admin-y2k.admin-shell .display-title,
      .admin-y2k.client-shell header p,
      .admin-y2k.admin-shell header p,
      .admin-y2k.client-shell header span,
      .admin-y2k.admin-shell header span {
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95), 0 0 16px rgba(0, 0, 0, 0.45);
      }

      .admin-y2k.client-shell input,
      .admin-y2k.admin-shell input,
      .admin-y2k.client-shell textarea,
      .admin-y2k.admin-shell textarea,
      .admin-y2k.client-shell select,
      .admin-y2k.admin-shell select {
        background: rgba(0, 0, 0, 0.18) !important;
        border-color: rgba(255, 255, 255, 0.26) !important;
        backdrop-filter: blur(5px);
        color: #fff !important;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
      }

      .admin-y2k.client-shell .relative > button,
      .admin-y2k.admin-shell .relative > button {
        background: rgba(0, 0, 0, 0.18) !important;
        border-color: rgba(255, 255, 255, 0.26) !important;
        backdrop-filter: blur(5px);
      }

      .admin-y2k.client-shell .status-frame,
      .admin-y2k.admin-shell .status-frame {
        backdrop-filter: blur(6px);
      }

      .admin-y2k.client-shell .shell-sidebar > div,
      .admin-y2k.admin-shell .shell-sidebar > div {
        background: rgba(0, 0, 0, 0.12) !important;
        backdrop-filter: blur(6px);
        border-color: rgba(255, 255, 255, 0.22);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
      }

      .admin-y2k.client-shell .shell-sidebar a,
      .admin-y2k.admin-shell .shell-sidebar a,
      .admin-y2k.client-shell .shell-sidebar button,
      .admin-y2k.admin-shell .shell-sidebar button {
        text-shadow: 0 1px 6px rgba(0, 0, 0, 0.92);
      }

      .admin-y2k.client-shell header .rounded-xl,
      .admin-y2k.admin-shell header .rounded-xl {
        background: rgba(0, 0, 0, 0.12) !important;
        backdrop-filter: blur(6px);
        border-color: rgba(255, 255, 255, 0.22) !important;
      }

      .admin-y2k.client-shell main [class*="bg-black/"],
      .admin-y2k.admin-shell main [class*="bg-black/"],
      .admin-y2k.client-shell main [class*="bg-neutral-9"],
      .admin-y2k.admin-shell main [class*="bg-neutral-9"] {
        background-color: rgba(0, 0, 0, 0.22) !important;
        backdrop-filter: blur(6px);
      }

      .admin-y2k.client-shell main th,
      .admin-y2k.admin-shell main th,
      .admin-y2k.client-shell main td,
      .admin-y2k.admin-shell main td {
        text-shadow: 0 1px 5px rgba(0, 0, 0, 0.9);
      }

      .admin-y2k.admin-shell .automotive-client-card {
        background: rgba(0, 0, 0, 0.14) !important;
        backdrop-filter: blur(6px);
      }

      @media (prefers-reduced-motion: reduce) {
        .admin-y2k * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      }
    `}</style>
  );
}

export const AUTH_BG_IMAGE = '/images/peter-broomfield-m3m-lnR90uM-unsplash (1).jpg';

export const ADMIN_BG_IMAGE = '/images/pexels-shots-by-sandhu-61082068-17016814.jpg';

export const CLIENT_BG_VIDEO = '/images/4488722-uhd_2160_4096_25fps (1).mp4';

export function AdminBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <Image
        src={ADMIN_BG_IMAGE}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/8 via-transparent to-black/5" />
    </div>
  );
}

export function ClientVideoBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={CLIENT_BG_VIDEO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/8 via-transparent to-black/5" />
    </div>
  );
}

export function AuthBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <Image
        src={AUTH_BG_IMAGE}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
    </div>
  );
}

export function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050506]">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -15%, rgba(212,175,55,0.12) 0%, transparent 50%), radial-gradient(ellipse 40% 30% at 100% 80%, rgba(212,175,55,0.06) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(212,175,55,0.03) 40px, rgba(212,175,55,0.03) 41px)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050506]/50 to-[#050506]" />
    </div>
  );
}

export function ChromeCard({
  children,
  className,
  title,
  subtitle,
  hideMenu: _hideMenu,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  hideMenu?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const spotlight = useMotionTemplate`
    radial-gradient(480px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 65%)
  `;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'chrome-card group relative rounded-xl border border-white/[0.08] bg-[#0e0e10]/95 backdrop-blur-xl gold-line-top overflow-hidden',
        'shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]',
        'hover:border-[#D4AF37]/30 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.15)] transition-all duration-300',
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: spotlight }}
      />
      <div className="relative z-10 p-7 sm:p-8 lg:p-9 h-full flex flex-col overflow-visible">
        {(title || subtitle) && (
          <div className="mb-7 pb-6 border-b border-white/[0.06]">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && (
              <p className="text-base text-neutral-400 mt-2 font-medium">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}

export function PremiumButton({
  children,
  className,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#B8860B] text-black hover:brightness-110 shadow-lg shadow-[#D4AF37]/25 font-bold',
    ghost: 'bg-white/[0.06] text-white border border-white/10 hover:bg-white/10 hover:border-white/20 font-semibold',
    danger: 'bg-red-600 text-white hover:bg-red-500 font-bold shadow-lg shadow-red-900/30',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base transition-all duration-200',
        'hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type NavItem = { label: string; href: string };

export function PillNav({ pathname, items }: { pathname: string; items: readonly NavItem[] }) {
  const active = items.find((i) =>
    pathname === i.href || pathname.startsWith(i.href + '/')
  )?.label ?? items[0]?.label;

  return (
    <LayoutGroup>
      <div className="flex gap-1 p-1.5 rounded-xl bg-[#0e0e10] border border-white/[0.08] w-fit">
        {items.map((item) => {
          const isActive = active === item.label;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'relative px-6 py-3 rounded-lg text-base font-semibold transition-colors z-10',
                isActive ? 'text-black' : 'text-neutral-400 hover:text-white'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="pill-active"
                  className="absolute inset-0 bg-gradient-to-r from-[#F5D76E] to-[#D4AF37] rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

const ADMIN_NAV = [
  { label: 'Hub', href: '/admin/dashboard' },
  { label: 'Sync', href: '/admin/solicitudes' },
  { label: 'Assets', href: '/admin/clientes' },
  { label: 'Config', href: '/admin/calendario' },
] as const;

export function AdminPillNav({ pathname }: { pathname: string }) {
  return <PillNav pathname={pathname} items={ADMIN_NAV} />;
}

export function getActiveTab(pathname: string): string {
  if (pathname.startsWith('/admin/solicitudes')) return 'Sync';
  if (pathname.startsWith('/admin/clientes')) return 'Assets';
  if (pathname.startsWith('/admin/calendario')) return 'Config';
  return 'Hub';
}

type SidebarLink = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

export function ShellSidebar({
  logoHref,
  links,
  pathname,
  onLogout,
  brandName = 'Alboraia',
  brandTag = 'Garage OS',
  transparent = false,
  logoOnly = false,
}: {
  logoHref: string;
  links: SidebarLink[];
  pathname: string;
  onLogout: () => void;
  brandName?: string;
  brandTag?: string;
  transparent?: boolean;
  logoOnly?: boolean;
}) {
  return (
    <aside className="shell-sidebar hidden lg:flex w-[260px] flex-col shrink-0 z-30 py-6 px-4">
      <div className={cn(
        'flex-1 flex flex-col rounded-xl gold-line-top relative overflow-hidden',
        transparent
          ? 'border border-white/22 bg-black/[0.12] backdrop-blur-[6px] shadow-[0_4px_24px_rgba(0,0,0,0.12)]'
          : 'border border-[#D4AF37]/20 bg-[#0e0e10]/90 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]'
      )}>
        <Link href={logoHref} className={cn(
          'border-b border-white/[0.06] transition-colors',
          logoOnly
            ? 'flex justify-center px-5 py-8 hover:opacity-90'
            : cn(
                'flex items-center gap-4 px-5 py-6',
                transparent ? 'hover:bg-white/[0.06]' : 'hover:bg-white/[0.02]'
              )
        )}>
          {logoOnly ? <AnimatedCarIcon /> : (
            <>
              <AnimatedCarLogo />
              <div>
                <p className="text-xl font-bold tracking-tight text-white uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]" style={{ fontFamily: 'Orbitron, sans-serif' }}>{brandName}</p>
                <p className="text-sm text-[#D4AF37] font-semibold uppercase tracking-wider drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">{brandTag}</p>
              </div>
            </>
          )}
        </Link>

        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200',
                  active
                    ? 'bg-gradient-to-r from-[#F5D76E]/90 to-[#D4AF37]/90 text-black shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : transparent
                      ? 'text-neutral-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:text-[#F5D76E] hover:bg-white/[0.08]'
                      : 'text-neutral-400 hover:text-[#F5D76E] hover:bg-white/[0.04]'
                )}
              >
                <Icon className={cn('w-5 h-5 shrink-0', active ? 'text-black' : '')} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onLogout}
            className={cn(
              'w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-medium transition-all',
              transparent
                ? 'text-neutral-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:text-red-400 hover:bg-red-500/[0.12]'
                : 'text-neutral-400 hover:text-red-400 hover:bg-red-500/[0.08]'
            )}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </aside>
  );
}

export function ShellHeader({
  title,
  tagline,
  status,
  statusDetail,
  nav,
}: {
  title: string;
  tagline?: string;
  status: string;
  statusDetail: string;
  nav?: React.ReactNode;
  searchPlaceholder?: string;
}) {
  return (
    <header className="mb-8 shrink-0 space-y-6">
      <div className={cn('flex flex-col gap-6', nav ? 'xl:flex-row xl:items-end justify-between' : undefined)}>
        <div className="space-y-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-[0.25em] mb-3">
              {tagline || 'Sistema de gestión'}
            </p>
            <h1 className="display-title">{title}</h1>
          </motion.div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {status}
            </span>
            <span className="text-sm text-neutral-500 font-medium">{statusDetail}</span>
          </div>
        </div>
        {nav && <div className="shrink-0">{nav}</div>}
      </div>
    </header>
  );
}

export function ContentPanel({ children, pathname }: { children: React.ReactNode; pathname: string }) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="pb-12"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function AuthHero({
  title,
  subtitle,
  className,
  brandName = 'Alboraia Garage',
  centerTitle = false,
}: {
  title: string;
  subtitle: string;
  className?: string;
  brandName?: string;
  centerTitle?: boolean;
}) {
  return (
    <div className={cn('mb-10', className)}>
      <div className={cn('flex items-center gap-5 mb-8', centerTitle && 'justify-center')}>
        <AnimatedCarIcon amplified />
        <div className={cn(centerTitle && 'text-center')}>
          <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest">{brandName}</p>
          <p className="text-base text-neutral-500">{subtitle}</p>
        </div>
      </div>
      <h1 className={cn('display-title', centerTitle && 'text-center')}>{title}</h1>
    </div>
  );
}

export function AuthBackHome({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-3 rounded-full border px-6 py-3.5 shrink-0',
        'border-white/20 bg-white/[0.06] backdrop-blur-md',
        'text-sm font-semibold text-neutral-200 hover:text-white hover:bg-white/10 hover:border-white/30',
        'transition-all duration-300',
        className,
      )}
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Volver a la página de inicio
    </Link>
  );
}

export function AuthFormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-start sm:items-center justify-center pb-8 w-full">
      <div className="w-full max-w-xl lg:max-w-2xl mx-auto">
        {children}
      </div>
    </div>
  );
}

export function PageIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="page-intro mb-8 pb-6 border-b border-[#D4AF37]/15">
      <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3 uppercase" style={{ fontFamily: 'Orbitron, sans-serif' }}>{title}</h2>
      <p className="text-lg sm:text-xl text-neutral-400 font-medium max-w-2xl">{description}</p>
    </div>
  );
}

export function AutomotiveClientCard({
  nombre,
  email,
  registro,
  solicitudes,
  active,
}: {
  nombre: string;
  email: string;
  registro: string;
  solicitudes: number;
  active: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'automotive-client-card relative h-full rounded-xl overflow-hidden cursor-pointer',
        'border border-white/20 bg-black/[0.14] backdrop-blur-[6px]',
        'hover:border-[#D4AF37]/45 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.2)]',
        'transition-all duration-300'
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      <div className="absolute inset-0 automotive-carbon opacity-10 pointer-events-none" />

      <div className="relative z-10 p-7 flex flex-col h-full min-h-[220px]">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-lg bg-black/20 border border-[#D4AF37]/30 flex items-center justify-center backdrop-blur-sm">
            <Car className="w-7 h-7 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" strokeWidth={1.5} />
          </div>
          <span className={cn(
            'px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest border',
            active
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-neutral-500/10 text-neutral-500 border-neutral-600/30'
          )}>
            {active ? 'Activo' : 'Idle'}
          </span>
        </div>

        <div className="flex-1">
          <h4 className="text-2xl font-bold text-white tracking-tight mb-2 capitalize drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">{nombre}</h4>
          <p className="text-sm text-neutral-300 font-medium truncate drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">{email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/15">
          <div>
            <p className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Registro</p>
            <p className="text-base font-semibold text-white uppercase drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">{registro}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Solicitudes</p>
            <p className="text-3xl font-black gold-text leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">{solicitudes}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function buildTelemetryData(stats: { pendientes: number; aprobados: number; rechazados: number; total: number }) {
  const t = Math.max(stats.total, 1);
  return {
    daily: [
      { name: '00:00', speed: stats.pendientes, stability: stats.aprobados },
      { name: '04:00', speed: Math.round(stats.pendientes * 0.8), stability: Math.round(stats.aprobados * 0.9) },
      { name: '08:00', speed: stats.aprobados, stability: stats.rechazados },
      { name: '12:00', speed: stats.total, stability: Math.round(stats.aprobados * 1.1) },
      { name: '16:00', speed: Math.round(stats.pendientes * 0.6), stability: stats.aprobados },
      { name: '20:00', speed: stats.rechazados, stability: Math.round(stats.total * 0.7) },
      { name: '24:00', speed: stats.total, stability: stats.pendientes },
    ],
    monthly: [
      { name: 'Sem 1', speed: stats.pendientes * 10, stability: stats.aprobados * 10 },
      { name: 'Sem 2', speed: stats.aprobados * 12, stability: stats.rechazados * 8 },
      { name: 'Sem 3', speed: stats.total * 15, stability: stats.aprobados * 14 },
      { name: 'Sem 4', speed: stats.aprobados * 11, stability: stats.pendientes * 9 },
    ],
    yearly: [
      { name: 'Ene', speed: stats.total * 40, stability: stats.aprobados * 35 },
      { name: 'Feb', speed: stats.pendientes * 45, stability: stats.total * 38 },
      { name: 'Mar', speed: stats.aprobados * 50, stability: stats.rechazados * 30 },
      { name: 'Abr', speed: stats.total * 55, stability: stats.aprobados * 48 },
      { name: 'May', speed: stats.aprobados * 60, stability: stats.pendientes * 42 },
      { name: 'Jun', speed: stats.total * 65, stability: stats.aprobados * 58 },
    ],
    radar: [
      { subject: 'Pendientes', A: stats.pendientes, fullMark: t },
      { subject: 'Aprobadas', A: stats.aprobados, fullMark: t },
      { subject: 'Rechazadas', A: stats.rechazados, fullMark: t },
      { subject: 'Total', A: stats.total, fullMark: t },
      { subject: 'Garage', A: Math.round(stats.aprobados * 0.7), fullMark: t },
      { subject: 'Box', A: Math.round(stats.pendientes * 0.8), fullMark: t },
    ],
  };
}
