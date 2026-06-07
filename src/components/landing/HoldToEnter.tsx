'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car } from 'lucide-react';
import { LANDING_IMAGES } from './content';

const GOLD = '#C09A3A';
const INK = '#0C0A08';
const HOLD_MS = 2880; // 90% du temps précédent

/* Voiture qui fait l'aller-retour avec traînées de vitesse */
function DrivingCar({ boost }: { boost: number }) {
  const [right, setRight] = useState(true);
  const baseDur = 3.4;
  const dur = baseDur - boost * 0.022; // accélère avec la progression

  return (
    <div className="relative w-full max-w-[520px] h-16 mx-auto">
      {/* route */}
      <div className="absolute bottom-3 left-0 right-0 h-px" style={{ background: `${GOLD}40` }} />
      <div className="absolute bottom-3 left-0 right-0 h-px flex justify-between opacity-60">
        {[...Array(18)].map((_, i) => (
          <span key={i} className="w-3 h-px" style={{ background: GOLD }} />
        ))}
      </div>

      <motion.div
        className="absolute bottom-4"
        animate={{ left: right ? 'calc(100% - 36px)' : '0%' }}
        initial={{ left: '0%' }}
        transition={{ duration: dur, ease: 'easeInOut' }}
        onAnimationComplete={() => setRight(r => !r)}
      >
        <div style={{ transform: right ? 'scaleX(1)' : 'scaleX(-1)' }} className="relative">
          {/* traînées de vitesse */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-1 flex flex-col gap-1">
            {[14, 22, 10].map((w, i) => (
              <motion.span
                key={i}
                className="block h-[2px] rounded-full"
                style={{ width: w, background: `linear-gradient(to left, ${GOLD}, transparent)` }}
                animate={{ opacity: [0.2, 0.8, 0.2], width: [w * 0.5, w, w * 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
          <Car className="h-8 w-8" style={{ color: GOLD }} strokeWidth={1.6} />
        </div>
      </motion.div>
    </div>
  );
}

export default function HoldToEnter({ onEnter }: { onEnter: () => void }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const [exiting, setExiting] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const baseRef = useRef(0);
  const doneRef = useRef(false);

  const stopRaf = () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };

  const finish = useCallback(() => {
    doneRef.current = true;
    setDone(true);
    setHolding(false);
    stopRaf();
    setTimeout(() => setExiting(true), 450);
    setTimeout(() => onEnter(), 1450);
  }, [onEnter]);

  const tickFill = useCallback((t: number) => {
    if (startRef.current === null) startRef.current = t;
    const elapsed = t - startRef.current;
    const next = Math.min(100, baseRef.current + (elapsed / HOLD_MS) * 100);
    setProgress(next);
    if (next >= 100) { finish(); return; }
    rafRef.current = requestAnimationFrame(tickFill);
  }, [finish]);

  const tickDecay = useCallback(() => {
    setProgress(prev => {
      const next = Math.max(0, prev - 2.6);
      if (next <= 0) { stopRaf(); return 0; }
      rafRef.current = requestAnimationFrame(tickDecay);
      return next;
    });
  }, []);

  const startHold = useCallback(() => {
    if (doneRef.current) return;
    stopRaf();
    setHolding(true);
    startRef.current = null;
    setProgress(p => { baseRef.current = p; return p; });
    rafRef.current = requestAnimationFrame(tickFill);
  }, [tickFill]);

  const endHold = useCallback(() => {
    if (doneRef.current) return;
    setHolding(false);
    stopRaf();
    rafRef.current = requestAnimationFrame(tickDecay);
  }, [tickDecay]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) { e.preventDefault(); startHold(); } };
    const up = (e: KeyboardEvent) => { if (e.code === 'Space' || e.code === 'Enter') endHold(); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [startHold, endHold]);

  useEffect(() => () => stopRaf(), []);

  const R = 82;
  const CIRC = 2 * Math.PI * R;
  const dash = CIRC - (progress / 100) * CIRC;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden select-none"
          style={{ background: INK }}
          initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Univers de voitures flottantes */}
          <div className="absolute inset-0 z-0">
            {[LANDING_IMAGES[8], LANDING_IMAGES[3], LANDING_IMAGES[1], LANDING_IMAGES[6], LANDING_IMAGES[2]].map((src, i) => {
              const p = [
                { top: '8%', left: '6%', w: 240, dur: 9 },
                { top: '60%', left: '11%', w: 185, dur: 11 },
                { top: '12%', right: '7%', w: 265, dur: 10 },
                { top: '64%', right: '9%', w: 205, dur: 12 },
                { top: '40%', left: '47%', w: 160, dur: 8 },
              ][i] as { top: string; left?: string; right?: string; w: number; dur: number };
              return (
                <motion.div key={i} className="absolute hidden md:block"
                  style={{ top: p.top, left: p.left, right: p.right }}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: holding ? 0.6 : 0.22, scale: holding ? 1 + progress / 380 : 0.9, y: [0, -16, 0] }}
                  transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.6 }, y: { duration: p.dur, repeat: Infinity, ease: 'easeInOut' } }}>
                  <img src={src} alt="" style={{ width: p.w, filter: `grayscale(${holding ? 0 : 80}%) brightness(${0.6 + progress / 250})` }}
                    className="object-cover aspect-[4/3] rounded-sm shadow-2xl transition-all duration-500" />
                </motion.div>
              );
            })}
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, transparent 0%, ${INK}cc 55%, ${INK} 85%)` }} />
          </div>

          {/* Halo */}
          <motion.div className="absolute z-10 rounded-full pointer-events-none"
            style={{ width: 460, height: 460, background: `radial-gradient(circle, ${GOLD}40 0%, transparent 70%)` }}
            animate={{ scale: 1 + progress / 110, opacity: 0.22 + progress / 220 }} transition={{ duration: 0.3 }} />

          {/* Brand */}
          <motion.div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-center"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <p className="text-[0.55rem] font-bold uppercase tracking-[0.5em] mb-1" style={{ color: GOLD, fontFamily: 'Orbitron, sans-serif' }}>Alboraya</p>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-white">Garage Accesorios</p>
          </motion.div>

          {/* Cercle */}
          <div className="relative z-20 flex flex-col items-center">
            <motion.button
              aria-label="Mantener pulsado para entrar"
              className="relative flex items-center justify-center rounded-full cursor-pointer touch-none"
              style={{ width: 210, height: 210 }}
              onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); startHold(); }}
              onPointerUp={endHold} onPointerLeave={endHold} onPointerCancel={endHold}
              whileTap={{ scale: 0.96 }}
            >
              {/* anneau pointillé rotatif */}
              <motion.svg width="210" height="210" className="absolute"
                animate={{ rotate: 360 }} transition={{ duration: holding ? 6 : 24, repeat: Infinity, ease: 'linear' }}>
                <circle cx="105" cy="105" r={94} fill="none" stroke={`${GOLD}22`} strokeWidth="1" strokeDasharray="2 8" />
              </motion.svg>

              {/* anneau de progression */}
              <svg width="210" height="210" className="absolute -rotate-90">
                <circle cx="105" cy="105" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                <circle cx="105" cy="105" r={R} fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={CIRC} strokeDashoffset={dash}
                  style={{ filter: `drop-shadow(0 0 ${4 + progress / 7}px ${GOLD})`, transition: holding ? 'none' : 'stroke-dashoffset 0.1s linear' }} />
              </svg>

              {/* disque intérieur */}
              <motion.div className="rounded-full flex items-center justify-center relative overflow-hidden"
                style={{ width: 156, height: 156, border: `1px solid ${GOLD}30` }}
                animate={{ scale: holding ? 0.94 : 1, backgroundColor: holding ? `${GOLD}14` : 'rgba(255,255,255,0.02)' }}
                transition={{ duration: 0.3 }}>
                <motion.div className="absolute bottom-0 left-0 right-0" style={{ background: `${GOLD}22` }}
                  animate={{ height: `${progress}%` }} transition={{ duration: 0.1 }} />
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10">
                      <Car className="h-9 w-9" style={{ color: GOLD }} />
                    </motion.div>
                  ) : holding ? (
                    <motion.div key="pct" className="relative z-10 flex flex-col items-center">
                      <span className="text-3xl font-black" style={{ fontFamily: 'Orbitron, sans-serif', color: 'white' }}>{Math.round(progress)}%</span>
                    </motion.div>
                  ) : (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex flex-col items-center gap-2">
                      <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                        <Car className="h-7 w-7" style={{ color: GOLD }} />
                      </motion.div>
                      <span className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-white text-center leading-tight">Mantén<br />pulsado</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.button>

            <motion.p className="mt-9 text-[0.6rem] font-bold uppercase tracking-[0.4em] text-center"
              style={{ color: 'rgba(255,255,255,0.35)' }} animate={{ opacity: holding ? 0 : 1 }}>
              {done ? 'Bienvenido' : 'Click & Hold · Entrar al universo'}
            </motion.p>

            {/* Voiture aller-retour */}
            <div className="mt-8 w-screen max-w-[560px] px-6">
              <DrivingCar boost={progress} />
            </div>
          </div>

          {/* Hint bas */}
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <span className="h-px w-8" style={{ background: `${GOLD}50` }} />
            <span className="text-[0.5rem] font-medium uppercase tracking-[0.4em]" style={{ color: 'rgba(255,255,255,0.3)' }}>Una experiencia automotriz</span>
            <span className="h-px w-8" style={{ background: `${GOLD}50` }} />
          </motion.div>

          {/* Rideau de révélation */}
          {done && (
            <>
              <motion.div className="absolute inset-y-0 left-0 z-30" style={{ background: INK, width: '50%' }}
                initial={{ x: 0 }} animate={{ x: '-100%' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.35 }} />
              <motion.div className="absolute inset-y-0 right-0 z-30" style={{ background: INK, width: '50%' }}
                initial={{ x: 0 }} animate={{ x: '100%' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.35 }} />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
