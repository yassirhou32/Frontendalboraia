'use client';

import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  useMotionValue,
  AnimatePresence,
} from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowRight, Phone, Mail, Clock, Check,
  ChevronDown, Star, Shield, Zap,
  Gauge, Settings, Thermometer, Radio, AlertTriangle, Cpu, Volume2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LandingHeader from './LandingHeader';
import HoldToEnter from './HoldToEnter';
import { LANDING_IMAGES, SERVICES, WHY_CHOOSE_US, BOX_FEATURES, CONTACT } from './content';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const C = {
  ivory: '#F5F2EC',
  white: '#FAFAF7',
  cream: '#EDE9DF',
  ink: '#0C0A08',
  gold: '#C09A3A',
  muted: '#8A8075',
  border: '#E2DDD4',
} as const;

const SERVICE_ICONS = [Gauge, Settings, Thermometer, Radio, AlertTriangle, Cpu, Volume2, Star];

/* ────────────────────────────────────────────
   CUSTOM CURSOR
─────────────────────────────────────────── */
function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let ox = -200, oy = -200, ix = -200, iy = -200;
    let raf: number;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
    const tick = () => {
      ix = lerp(ix, ox, 0.14);
      iy = lerp(iy, oy, 0.14);
      outer.style.transform = `translate(${ix - 20}px, ${iy - 20}px)`;
      inner.style.transform = `translate(${ox - 3}px, ${oy - 3}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      ox = e.clientX; oy = e.clientY;
      if (!visible) setVisible(true);
    };
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    document.addEventListener('mousemove', onMove);
    const els = document.querySelectorAll('a, button, [data-hover]');
    els.forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
    };
  }, [visible]);

  return (
    <>
      <div
        ref={outerRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full border transition-all duration-300"
        style={{
          width: hovered ? 52 : 40, height: hovered ? 52 : 40,
          borderColor: hovered ? C.gold : `${C.ink}35`,
          backgroundColor: hovered ? `${C.gold}18` : 'transparent',
          opacity: visible ? 1 : 0,
        }}
      />
      <div
        ref={innerRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{ width: 6, height: 6, background: C.gold, opacity: visible ? 1 : 0 }}
      />
    </>
  );
}

/* ────────────────────────────────────────────
   NOISE TEXTURE (premium grain)
─────────────────────────────────────────── */
function Grain() {
  return (
    <svg
      className="fixed inset-0 z-[9998] pointer-events-none w-full h-full opacity-[0.03]"
      style={{ mixBlendMode: 'multiply' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

/* ────────────────────────────────────────────
   SCROLL PROGRESS BAR (top gold)
─────────────────────────────────────────── */
function ScrollProgress({ enabled }: { enabled: boolean }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  if (!enabled) return null;
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left"
      style={{ scaleX, background: `linear-gradient(to right, ${C.gold}, #E6C36B)` }}
    />
  );
}

/* ────────────────────────────────────────────
   FLOATING BOOK CTA (appears on scroll)
─────────────────────────────────────────── */
function FloatingBook({ enabled }: { enabled: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);

  return (
    <AnimatePresence>
      {enabled && show && (
        <motion.div
          className="fixed bottom-6 right-6 z-[70]"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/acceso"
            className="group flex items-center gap-3 rounded-full pl-5 pr-6 py-3.5 shadow-2xl transition-all duration-400 hover:scale-105"
            style={{ background: C.gold, color: C.ink }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: C.ink }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: C.ink }} />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.18em]">Reservar cita</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────
   SMOOTH SCROLL
─────────────────────────────────────────── */
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      infinite: false,
    } as ConstructorParameters<typeof Lenis>[0]);
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);
}

/* ────────────────────────────────────────────
   PARALLAX BLOCK
─────────────────────────────────────────── */
function PX({ children, className, speed = 1, spy }: {
  children: React.ReactNode; className?: string; speed?: number; spy: MotionValue<number>;
}) {
  const y = useTransform(spy, [0, 1], [0, speed * 280]);
  const ys = useSpring(y, { stiffness: 55, damping: 18 });
  return <motion.div style={{ y: ys }} className={className}>{children}</motion.div>;
}

/* ────────────────────────────────────────────
   3D TILT IMAGE
─────────────────────────────────────────── */
function TiltImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotX = useSpring(useTransform(rx, [-0.5, 0.5], [7, -7]), { stiffness: 180, damping: 22 });
  const rotY = useSpring(useTransform(ry, [-0.5, 0.5], [-7, 7]), { stiffness: 180, damping: 22 });
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rx.set((e.clientY - r.top) / r.height - 0.5);
    ry.set((e.clientX - r.left) / r.width - 0.5);
  };
  return (
    <motion.div
      onMouseMove={move}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
    >
      <img src={src} alt={alt} className={className} />
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   1. HERO
─────────────────────────────────────────── */
function Hero({ spy, entered }: { spy: MotionValue<number>; entered: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const scale = useTransform(spy, [0, 0.35], [1, 1.1]);
  const fadeY = useTransform(spy, [0, 0.38], [0, 90]);
  const fadeO = useTransform(spy, [0, 0.35], [1, 0]);

  useLayoutEffect(() => {
    if (!entered) return;
    const ctx = gsap.context(() => {
      gsap.from('.hl', {
        yPercent: 110, duration: 1.4, stagger: 0.14, ease: 'power4.out', delay: 0.15,
      });
      gsap.from('.hb', { opacity: 0, y: 24, duration: 0.9, delay: 0.08, ease: 'power3.out' });
      gsap.from('.hs', { opacity: 0, y: 30, duration: 1, delay: 1.05, ease: 'power3.out' });
      gsap.from('.hc > *', { opacity: 0, y: 28, stagger: 0.1, duration: 0.9, delay: 1.2, ease: 'power3.out' });
      gsap.from('.hscroll', { opacity: 0, duration: 1.3, delay: 2.1 });
      ScrollTrigger.refresh();
    }, ref);
    return () => ctx.revert();
  }, [entered]);

  return (
    <section id="inicio" ref={ref} className="relative h-screen min-h-[680px] overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ scale }}>
        <img src={LANDING_IMAGES[8]} alt="Hero" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 z-10" style={{
        background: 'linear-gradient(140deg, rgba(12,10,8,0.90) 0%, rgba(12,10,8,0.42) 52%, rgba(12,10,8,0.70) 100%)',
      }} />
      {/* Gold vertical accent */}
      <div className="absolute top-0 bottom-0 right-0 w-px z-20 opacity-30"
        style={{ background: `linear-gradient(to bottom, transparent, ${C.gold} 30%, ${C.gold} 70%, transparent)` }} />

      <motion.div
        style={{ y: fadeY, opacity: fadeO }}
        className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 lg:px-24 pointer-events-none"
      >
        <div className="hb pointer-events-auto inline-flex w-max items-center gap-2.5 rounded-full border px-5 py-2 mb-10"
          style={{ borderColor: `${C.gold}45`, background: `${C.gold}12` }}>
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: C.gold }} />
          <span className="text-[0.58rem] font-bold uppercase tracking-[0.32em]" style={{ color: C.gold }}>
            Taller Premium · Valencia
          </span>
        </div>

        <h1 className="pointer-events-auto" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {['ALBORAYA', 'GARAGE'].map((line, i) => (
            <div key={i} className="overflow-hidden leading-none block">
              <div className={cn('hl text-[16vw] sm:text-[13vw] md:text-[10.5vw] font-black tracking-[-0.04em] uppercase text-white')}>
                {line}
                {i === 1 && (
                  <span className="ml-4 text-[3.5vw] font-light align-middle tracking-[0.3em]"
                    style={{ color: `${C.gold}80`, fontFamily: 'system-ui, sans-serif' }}>
                    ACCESORIOS
                  </span>
                )}
              </div>
            </div>
          ))}
        </h1>

        <p className="hs pointer-events-auto mt-8 text-sm md:text-base font-light uppercase tracking-[0.28em] max-w-md"
          style={{ color: 'rgba(255,255,255,0.5)' }}>
          Mantenimiento · Reparación · Alquiler de Boxes
        </p>

        <div className="hc pointer-events-auto mt-10 flex flex-wrap gap-5">
          <Link href="/acceso"
            className="group relative overflow-hidden inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.18em]"
            style={{ background: C.gold, color: C.ink }}>
            <span className="relative z-10">Reservar ahora</span>
            <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
            <motion.span className="absolute inset-0 rounded-full bg-white"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.6, opacity: 0.18 }}
              transition={{ duration: 0.55 }} />
          </Link>
          <a href="#servicios"
            className="inline-flex items-center gap-3 rounded-full border px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] transition-all duration-400 hover:border-white/40"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)' }}>
            Descubrir servicios
          </a>
        </div>
      </motion.div>

      <div className="hscroll absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <motion.div
          animate={{ scaleY: [1, 0.25, 1] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12"
          style={{ background: `linear-gradient(to bottom, ${C.gold}, transparent)` }}
        />
        <span className="text-[0.52rem] font-bold uppercase tracking-[0.45em]" style={{ color: `${C.gold}70` }}>Scroll</span>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   2. GOLD TICKER
─────────────────────────────────────────── */
function GoldTicker() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.tk', { xPercent: -50, ease: 'none', duration: 20, repeat: -1 });
    }, ref);
    return () => ctx.revert();
  }, []);

  const items = SERVICES.map(s => s.title);

  return (
    <div ref={ref} className="relative z-20 overflow-hidden border-y py-3.5" style={{ background: C.gold }}>
      <div className="tk flex whitespace-nowrap">
        {[...Array(3)].map((_, k) => (
          <div key={k} className="flex items-center shrink-0">
            {items.map((t) => (
              <React.Fragment key={t}>
                <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] px-8" style={{ color: C.ink }}>{t}</span>
                <span className="text-[0.55rem] mr-2" style={{ color: `${C.ink}40` }}>◆</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   3. BRAND STATEMENT
─────────────────────────────────────────── */
function BrandStatement() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bs-line', {
        yPercent: 110, stagger: 0.12, duration: 1.3, ease: 'power4.out',
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
      });
      gsap.from('.bs-side > *', {
        opacity: 0, x: 50, stagger: 0.1, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 68%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative z-20 overflow-hidden" style={{ background: C.ivory }}>
      <div className="mx-auto max-w-[1600px] px-6 md:px-16 py-28 md:py-44">
        <div className="grid grid-cols-12 gap-8 items-end">
          <div className="col-span-12 lg:col-span-7">
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.42em] block mb-14"
              style={{ color: C.gold }}>— Nuestra promesa</span>
            {[
              { t: 'Su vehículo,', g: false },
              { t: 'nuestra', g: false },
              { t: 'pasión.', g: true },
            ].map(({ t, g }, i) => (
              <div key={i} className="overflow-hidden">
                <div
                  className={cn('bs-line text-[9vw] md:text-[6.5vw] font-black leading-[0.86] tracking-tight uppercase')}
                  style={{ fontFamily: 'Orbitron, sans-serif', color: g ? C.gold : C.ink }}
                >
                  {t}
                </div>
              </div>
            ))}
          </div>

          <div className="bs-side col-span-12 lg:col-span-5 pb-2 flex flex-col gap-6">
            <div className="h-px" style={{ background: `linear-gradient(to right, ${C.gold}, transparent)` }} />
            <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: C.muted }}>
              Instalaciones modernas, equipamiento profesional y un equipo cualificado para responder a todas sus necesidades automotrices en Valencia.
            </p>
            <Link href="/acceso"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest w-max transition-colors hover:text-[#C09A3A]"
              style={{ color: C.ink }}>
              Pedir cita <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   4. SERVICES — HORIZONTAL SCROLL
─────────────────────────────────────────── */
function Services() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;
      gsap.to(track, {
        x: () => -(track.scrollWidth - wrap.offsetWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${track.scrollWidth - wrap.offsetWidth}`,
          pin: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="servicios" className="relative z-20" style={{ background: C.ink }}>
      <div ref={wrapRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-screen items-stretch"
          style={{ width: `${SERVICES.length * 420 + 320}px` }}
        >
          {/* Label panel */}
          <div className="shrink-0 w-64 flex flex-col justify-between py-16 pl-8 md:pl-16 border-r"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.42em]" style={{ color: C.gold }}>
              — Servicios
            </span>
            <div>
              <h2
                className="text-3xl font-black uppercase leading-[0.85] mb-5"
                style={{ fontFamily: 'Orbitron, sans-serif', color: 'white' }}
              >
                Expertise<br /><span style={{ color: C.gold }}>Total</span>
              </h2>
              <p className="text-[0.6rem] uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                → Deslizar
              </p>
            </div>
          </div>

          {/* Service cards — premium redesign */}
          {SERVICES.map((svc, i) => {
            const Icon = SERVICE_ICONS[i];
            return (
              <motion.div
                key={svc.title}
                className="shrink-0 w-[420px] h-full group relative overflow-hidden border-l cursor-default"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                whileHover="hovered"
                initial="idle"
              >
                {/* Full-bleed image with parallax on hover */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <motion.img
                    src={LANDING_IMAGES[i % LANDING_IMAGES.length]}
                    alt={svc.title}
                    className="h-full w-full object-cover"
                    variants={{ idle: { scale: 1.08 }, hovered: { scale: 1.18 } }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {/* base overlay */}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(170deg,rgba(12,10,8,0.55) 0%,rgba(12,10,8,0.82) 60%,rgba(12,10,8,0.95) 100%)' }} />
                  {/* gold overlay on hover */}
                  <motion.div className="absolute inset-0"
                    style={{ background: `linear-gradient(170deg, ${C.gold}00 0%, ${C.gold}12 100%)` }}
                    variants={{ idle: { opacity: 0 }, hovered: { opacity: 1 } }}
                    transition={{ duration: 0.5 }} />
                </div>

                {/* Top: number + tag */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-start justify-between p-7">
                  <motion.div
                    className="flex flex-col"
                    variants={{ idle: { opacity: 0.4 }, hovered: { opacity: 1 } }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-[4.5rem] font-black leading-none tracking-tighter select-none"
                      style={{ fontFamily: 'Orbitron, sans-serif', color: 'transparent', WebkitTextStroke: `1px ${C.gold}` }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </motion.div>

                  <motion.div
                    className="mt-2 px-3 py-1.5 border text-[0.52rem] font-bold uppercase tracking-[0.3em]"
                    style={{ borderColor: `${C.gold}40`, color: C.gold, backdropFilter: 'blur(8px)', background: 'rgba(12,10,8,0.4)' }}
                    variants={{ idle: { opacity: 0, x: 10 }, hovered: { opacity: 1, x: 0 } }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                  >
                    Servicio
                  </motion.div>
                </div>

                {/* Gold left border animated */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] origin-bottom z-10"
                  style={{ background: `linear-gradient(to top, ${C.gold}, ${C.gold}00)` }}
                  variants={{ idle: { scaleY: 0 }, hovered: { scaleY: 1 } }}
                  transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                />

                {/* Bottom: icon + title + desc + cta */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-7">
                  {/* icon */}
                  <motion.div
                    className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{ borderColor: `${C.gold}35`, background: 'rgba(12,10,8,0.5)', backdropFilter: 'blur(6px)' }}
                    variants={{ idle: { borderColor: 'rgba(192,154,58,0.2)' }, hovered: { borderColor: `${C.gold}70` } }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon className="h-5 w-5 transition-colors duration-500 group-hover:text-[#C09A3A]"
                      style={{ color: 'rgba(255,255,255,0.55)' }} />
                  </motion.div>

                  {/* separator */}
                  <motion.div className="h-px mb-5 origin-left"
                    style={{ background: `linear-gradient(to right, ${C.gold}, transparent)` }}
                    variants={{ idle: { scaleX: 0.3, opacity: 0.3 }, hovered: { scaleX: 1, opacity: 1 } }}
                    transition={{ duration: 0.5 }} />

                  <h3 className="text-xl font-black uppercase tracking-tight text-white leading-tight mb-3">
                    {svc.title}
                  </h3>

                  <motion.p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: 'rgba(255,255,255,0.58)' }}
                    variants={{ idle: { opacity: 0, y: 10 }, hovered: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.45, delay: 0.08 }}
                  >
                    {svc.description}
                  </motion.p>

                  <motion.div
                    variants={{ idle: { opacity: 0, y: 8 }, hovered: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.4, delay: 0.12 }}
                  >
                    <Link href="/acceso"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
                      style={{ color: C.gold }}>
                      Reservar
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}

          <div className="shrink-0 w-20 h-full" />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   5. BOX RENTAL — floating card, light & airy
─────────────────────────────────────────── */
function BoxRental() {
  const ref  = useRef<HTMLElement>(null);
  const [hov, setHov] = useState<number | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bx-card', {
        opacity: 0, y: 70, scale: 0.97, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      });
      gsap.from('.bx-pre',  { opacity: 0, y: 14, duration: 0.7, delay: 0.35, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 76%' } });
      gsap.from('.bx-t1',  { yPercent: 115, duration: 1.05, delay: 0.38, ease: 'power4.out', scrollTrigger: { trigger: ref.current, start: 'top 76%' } });
      gsap.from('.bx-t2',  { yPercent: 115, duration: 1.05, delay: 0.46, ease: 'power4.out', scrollTrigger: { trigger: ref.current, start: 'top 76%' } });
      gsap.from('.bx-t3',  { yPercent: 115, duration: 1.05, delay: 0.54, ease: 'power4.out', scrollTrigger: { trigger: ref.current, start: 'top 76%' } });
      gsap.from('.bx-desc',{ opacity: 0, y: 20, duration: 0.9, delay: 0.55, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 76%' } });
      gsap.from('.bx-feat',{ opacity: 0, x: -20, stagger: 0.07, duration: 0.75, delay: 0.6, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 76%' } });
      gsap.from('.bx-cta', { opacity: 0, y: 16, duration: 0.75, delay: 0.9, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 76%' } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="box" ref={ref} className="relative z-20 py-28 md:py-40"
      style={{ background: C.ivory }}>

      {/* soft radial glow behind card */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div style={{
          width: '70%', height: '70%', borderRadius: '50%',
          background: `radial-gradient(ellipse, ${C.gold}0A 0%, transparent 72%)`,
        }} />
      </div>

      {/* ── FLOATING CARD ── */}
      <div className="bx-card mx-auto max-w-[1380px] px-4 md:px-10">
        <div className="rounded-[2.5rem] overflow-hidden grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]"
          style={{
            background: C.white,
            boxShadow: `0 32px 80px -12px rgba(12,10,8,0.14), 0 0 0 1px ${C.border}`,
          }}>

          {/* LEFT — image with overlay stats */}
          <div className="relative min-h-[420px] lg:min-h-0 overflow-hidden">
            <img src={LANDING_IMAGES[4]} alt="Box equipado"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: 'brightness(0.75) contrast(1.05)' }} />

            {/* gradient overlay */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(12,10,8,0.55) 0%, rgba(12,10,8,0.2) 60%, transparent 100%)' }} />

            {/* stats in bottom-left */}
            <div className="absolute bottom-8 left-8 flex gap-8">
              {[{ val: '5+', label: 'Boxes' }, { val: '24h', label: 'Acceso' }, { val: '100%', label: 'Equipado' }].map(({ val, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-black leading-none"
                    style={{ fontFamily: 'Orbitron, sans-serif', color: C.gold }}>{val}</span>
                  <span className="text-[0.55rem] uppercase tracking-[0.28em] mt-1.5"
                    style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* certified pill top-left */}
            <div className="absolute top-7 left-7 flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: `${C.gold}EE`, backdropFilter: 'blur(8px)' }}>
              <Shield className="h-3.5 w-3.5" style={{ color: C.ink }} />
              <span className="text-[0.6rem] font-black uppercase tracking-widest"
                style={{ color: C.ink }}>Espacio Certificado</span>
            </div>

            {/* corner accent */}
            <div className="absolute bottom-6 right-6 w-14 h-14 border-b-2 border-r-2 pointer-events-none rounded-br-md"
              style={{ borderColor: `${C.gold}70` }} />
          </div>

          {/* RIGHT — content */}
          <div className="flex flex-col justify-center gap-8 px-10 md:px-14 py-14">

            <span className="bx-pre text-[0.56rem] font-bold uppercase tracking-[0.44em]"
              style={{ color: C.gold }}>— Alquiler de Box</span>

            <h2 style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <div className="overflow-hidden">
                <div className="bx-t1" style={{ fontSize: 'clamp(2rem,3.8vw,3.4rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', color: C.ink, textTransform: 'uppercase' }}>Su propio</div>
              </div>
              <div className="overflow-hidden">
                <div className="bx-t2" style={{ fontSize: 'clamp(2rem,3.8vw,3.4rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', color: C.ink, textTransform: 'uppercase' }}>espacio de</div>
              </div>
              <div className="overflow-hidden">
                <div className="bx-t3" style={{ fontSize: 'clamp(2rem,3.8vw,3.4rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', color: C.gold, textTransform: 'uppercase' }}>trabajo</div>
              </div>
            </h2>

            <p className="bx-desc text-sm leading-relaxed font-light" style={{ color: C.muted, maxWidth: '36ch' }}>
              ¿Desea realizar usted mismo el mantenimiento o la reparación de su vehículo?
              Boxes totalmente equipados para aficionados y profesionales.
            </p>

            {/* features */}
            <div className="flex flex-col border-t" style={{ borderColor: C.border }}>
              {BOX_FEATURES.map((f, i) => {
                const isH = hov === i;
                return (
                  <div key={f}
                    className="bx-feat flex items-center gap-4 py-4 border-b cursor-default group"
                    style={{ borderColor: C.border }}
                    onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>

                    <motion.div
                      className="shrink-0 w-5 h-5 rounded-full border flex items-center justify-center"
                      animate={{ background: isH ? C.gold : 'transparent', borderColor: isH ? C.gold : C.border }}
                      transition={{ duration: 0.22 }}>
                      <Check className="h-2.5 w-2.5" style={{ color: isH ? C.ink : C.muted }} />
                    </motion.div>

                    <span className="flex-1 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-250"
                      style={{ color: isH ? C.ink : C.muted }}>
                      {f}
                    </span>

                    <motion.div className="h-px origin-right" style={{ background: C.gold, width: 32 }}
                      animate={{ scaleX: isH ? 1 : 0, opacity: isH ? 1 : 0 }}
                      transition={{ duration: 0.3 }} />
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="bx-cta flex items-center gap-5 pt-2">
              <Link href="/acceso"
                className="group inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-350 hover:scale-105 hover:shadow-lg"
                style={{ background: C.ink, color: 'white' }}>
                Reservar mi box
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-[0.62rem] font-light" style={{ color: C.muted }}>
                Disponibilidad inmediata
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   6. STATS — animated counters
─────────────────────────────────────────── */
function useCountUp(to: number, run: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let v = 0;
    const step = to / (1800 / 16);
    const id = setInterval(() => {
      v += step;
      if (v >= to) { setN(to); clearInterval(id); } else setN(Math.floor(v));
    }, 16);
    return () => clearInterval(id);
  }, [run, to]);
  return n;
}

function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  const n = useCountUp(value, go);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); io.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex flex-col items-center gap-3 py-16 px-6">
      <span className="text-5xl md:text-6xl font-black" style={{ fontFamily: 'Orbitron, sans-serif', color: C.gold }}>
        {n}{suffix}
      </span>
      <div className="w-8 h-px" style={{ background: C.gold }} />
      <span className="text-xs font-bold uppercase tracking-[0.24em] text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
    </div>
  );
}

function Stats() {
  return (
    <section className="relative z-20" style={{ background: C.ink }}>
      <div className="mx-auto max-w-[1600px] grid grid-cols-2 lg:grid-cols-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {[
          { value: 500, suffix: '+', label: 'Clientes satisfechos' },
          { value: 8, suffix: '', label: 'Servicios especializados' },
          { value: 15, suffix: '+', label: 'Años de experiencia' },
          { value: 100, suffix: '%', label: 'Garantía de calidad' },
        ].map((s, i) => (
          <div key={s.label} className={cn('border-r border-b lg:border-b-0', i === 3 && 'border-r-0')}
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <Counter {...s} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   7. WHY US — editorial dark rows
─────────────────────────────────────────── */
const WHY_DETAILS = [
  'Equipos de diagnóstico OBD de última generación, elevadores de 4 T y herramientas de precisión certificadas por los principales fabricantes.',
  'Multi-taller coordinado en tiempo real: intervenciones simultáneas para reducir las esperas al mínimo y respetar siempre sus plazos.',
  'Más de 15 años en el sector. Técnicos con formación continua y certificaciones oficiales actualizadas cada año.',
  'Presupuesto detallado antes de cualquier intervención. Sin sorpresas en la factura. Precio acordado = precio final.',
  'Revisión gratuita a los 30 días post-servicio, seguimiento por WhatsApp y atención personalizada en cada visita.',
  'Reserve su cita en menos de 2 minutos desde cualquier dispositivo. Confirmación y recordatorio automáticos.',
];

function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const [hov, setHov] = useState<number | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.wh-badge', { opacity: 0, y: 16, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 78%' } });
      gsap.from('.wh-t1', { yPercent: 115, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
      gsap.from('.wh-t2', { yPercent: 115, duration: 1.2, delay: 0.1, ease: 'power4.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
      gsap.from('.wh-meta', { opacity: 0, y: 20, duration: 0.9, delay: 0.3, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 72%' } });
      gsap.from('.wh-strip', {
        opacity: 0, y: 40, stagger: 0.06, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: '.wh-strips', start: 'top 80%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative z-20 overflow-hidden" style={{ background: C.ink }}>

      {/* ── BG image that changes on hover ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {hov !== null && (
            <motion.div key={hov} className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}>
              <img src={LANDING_IMAGES[hov % LANDING_IMAGES.length]} alt=""
                className="h-full w-full object-cover"
                style={{ filter: 'grayscale(50%) contrast(0.9)' }} />
              <div className="absolute inset-0" style={{ background: `${C.ink}E6` }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-16 pt-24 md:pt-40">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-16 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <span className="wh-badge text-[0.58rem] font-bold uppercase tracking-[0.42em] block mb-10"
              style={{ color: C.gold }}>— Por qué elegirnos</span>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <div className="overflow-hidden"><div className="wh-t1 text-6xl md:text-8xl font-black uppercase leading-[0.84] tracking-[-0.02em] text-white">La diferencia</div></div>
              <div className="overflow-hidden"><div className="wh-t2 text-6xl md:text-8xl font-black uppercase leading-[0.84] tracking-[-0.02em]" style={{ color: C.gold }}>Alboraya</div></div>
            </h2>
          </div>
          <div className="wh-meta flex flex-col items-start md:items-end gap-3 pb-2 shrink-0">
            <span className="text-[7rem] font-black leading-none select-none"
              style={{ fontFamily: 'Orbitron, sans-serif', color: 'transparent', WebkitTextStroke: `1px ${C.gold}22` }}>
              06
            </span>
            <p className="text-xs font-light" style={{ color: 'rgba(255,255,255,0.35)' }}>razones para elegirnos</p>
          </div>
        </div>

        {/* ── Strips ── */}
        <div className="wh-strips">
          {WHY_CHOOSE_US.map((label, i) => {
            const isH = hov === i;
            return (
              <div key={label}
                className="wh-strip border-b relative overflow-hidden cursor-default"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>

                {/* Row image thumbnail (expands on hover) */}
                <motion.div
                  className="absolute right-0 top-0 bottom-0 overflow-hidden z-0"
                  animate={{ width: isH ? '38%' : '0%' }}
                  transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
                  <img src={LANDING_IMAGES[i % LANDING_IMAGES.length]} alt=""
                    className="h-full w-full object-cover"
                    style={{ filter: 'brightness(0.55) contrast(1.1)' }} />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, rgba(12,10,8,0.95) 0%, rgba(12,10,8,0) 60%)' }} />
                </motion.div>

                {/* Gold left bar */}
                <motion.div className="absolute left-0 top-0 bottom-0 w-[3px] z-20"
                  style={{ background: `linear-gradient(to bottom, ${C.gold}, ${C.gold}80)` }}
                  animate={{ scaleY: isH ? 1 : 0 }}
                  initial={{ scaleY: 0 }}
                  transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                />

                {/* Main row content */}
                <div className="relative z-10 flex items-center gap-6 md:gap-10 py-7 px-6 md:pl-10">

                  {/* Number */}
                  <motion.span
                    className="text-[3.5rem] md:text-[5rem] font-black leading-none shrink-0 select-none transition-all duration-400"
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      color: 'transparent',
                      WebkitTextStroke: `1px ${isH ? C.gold : 'rgba(255,255,255,0.12)'}`,
                    }}>
                    {String(i + 1).padStart(2, '0')}
                  </motion.span>

                  {/* Divider */}
                  <motion.div className="hidden md:block h-12 w-px shrink-0"
                    style={{ background: isH ? `${C.gold}60` : 'rgba(255,255,255,0.08)' }}
                    transition={{ duration: 0.3 }} />

                  {/* Label + detail */}
                  <div className="flex-1 min-w-0">
                    <motion.h3
                      className="font-black uppercase tracking-tight leading-tight transition-all duration-400"
                      style={{ color: isH ? 'white' : 'rgba(255,255,255,0.45)' }}
                      animate={{ fontSize: isH ? '1.35rem' : '1.1rem' }}
                      transition={{ duration: 0.35 }}>
                      {label}
                    </motion.h3>

                    <AnimatePresence>
                      {isH && (
                        <motion.p
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
                          className="overflow-hidden text-sm font-light leading-relaxed max-w-lg"
                          style={{ color: 'rgba(255,255,255,0.52)' }}>
                          {WHY_DETAILS[i]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* CTA arrow */}
                  <motion.div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-400"
                    animate={{
                      borderColor: isH ? C.gold : 'rgba(255,255,255,0.1)',
                      background: isH ? C.gold : 'transparent',
                      x: isH ? 0 : 8,
                      opacity: isH ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.35 }}>
                    <ArrowRight className="h-4 w-4" style={{ color: isH ? C.ink : 'white' }} />
                  </motion.div>
                </div>

                {/* Bottom gold line sweep */}
                <motion.div className="absolute bottom-0 left-0 right-0 h-px origin-left z-20"
                  style={{ background: C.gold }}
                  animate={{ scaleX: isH ? 1 : 0 }}
                  transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }} />
              </div>
            );
          })}
        </div>

        {/* ── Bottom strip ── */}
        <div className="py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Más de <span className="font-bold" style={{ color: C.gold }}>500 clientes</span> confían en nosotros cada año.
          </p>
          <Link href="/acceso"
            className="group inline-flex items-center gap-3 rounded-full border px-8 py-3.5 text-xs font-bold uppercase tracking-[0.22em] transition-all duration-400 hover:bg-[#C09A3A] hover:border-[#C09A3A] hover:text-black"
            style={{ borderColor: `${C.gold}45`, color: C.gold }}>
            Reservar ahora
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   8. IMAGE BREAK (full-width cinematic)
─────────────────────────────────────────── */
function CinematicBreak({ spy }: { spy: MotionValue<number> }) {
  return (
    <section className="relative z-20 h-[55vh] overflow-hidden">
      <PX spy={spy} speed={-0.3} className="absolute inset-0 h-[130%] -top-[15%]">
        <img src={LANDING_IMAGES[3]} alt="" className="h-full w-full object-cover"
          style={{ filter: 'contrast(1.06) saturate(0.88)' }} />
      </PX>
      <div className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(90deg, rgba(245,242,236,1) 0%, rgba(245,242,236,0.5) 45%, rgba(245,242,236,0) 100%)' }} />
      <div className="absolute inset-0 z-20 flex items-center px-6 md:px-24">
        <div>
          <span className="text-[0.58rem] font-bold uppercase tracking-[0.42em] block mb-5" style={{ color: C.gold }}>
            — Alta precisión
          </span>
          <h3
            className="text-4xl md:text-6xl xl:text-7xl font-black uppercase leading-[0.86] tracking-tight"
            style={{ fontFamily: 'Orbitron, sans-serif', color: C.ink }}
          >
            Cada detalle,<br /><span style={{ color: C.gold }}>controlado.</span>
          </h3>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   9. GALLERY
─────────────────────────────────────────── */
function Gallery({ spy }: { spy: MotionValue<number> }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gi', {
        opacity: 0, scale: 0.93, stagger: 0.08, duration: 1.15, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative z-20 overflow-hidden" style={{ background: C.cream }}>
      <div className="mx-auto max-w-[1600px] px-6 md:px-16 py-28 md:py-44">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.42em] block mb-6"
              style={{ color: C.gold }}>— Nuestras instalaciones</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight"
              style={{ fontFamily: 'Orbitron, sans-serif', color: C.ink }}>
              El espacio
            </h2>
          </div>
          <Link href="/acceso"
            className="group hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors hover:text-[#C09A3A]"
            style={{ color: C.ink }}>
            Reservar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-3 md:gap-4">
          <div className="gi col-span-12 md:col-span-8 overflow-hidden group">
            <PX spy={spy} speed={0.1}>
              <img src={LANDING_IMAGES[0]} alt="" className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-700" />
            </PX>
          </div>
          <div className="gi col-span-12 md:col-span-4 overflow-hidden group">
            <PX spy={spy} speed={-0.12}>
              <img src={LANDING_IMAGES[2]} alt="" className="w-full h-full object-cover aspect-[4/3] md:aspect-auto group-hover:scale-105 transition-transform duration-700" />
            </PX>
          </div>
          <div className="gi col-span-6 md:col-span-4 overflow-hidden group">
            <img src={LANDING_IMAGES[5]} alt="" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="gi col-span-6 md:col-span-4 overflow-hidden group">
            <img src={LANDING_IMAGES[6]} alt="" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="gi col-span-12 md:col-span-4 overflow-hidden group">
            <img src={LANDING_IMAGES[1]} alt="" className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   10. CTA — full bleed
─────────────────────────────────────────── */
function CTASection({ spy }: { spy: MotionValue<number> }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-in > *', {
        opacity: 0, y: 60, stagger: 0.12, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative z-20 overflow-hidden min-h-[72vh] flex items-center">
      <PX spy={spy} speed={-0.3} className="absolute inset-0 h-[130%] -top-[15%] z-0">
        <img src={LANDING_IMAGES[7]} alt="" className="h-full w-full object-cover"
          style={{ filter: 'grayscale(15%) contrast(1.05)' }} />
      </PX>
      <div className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(130deg, rgba(12,10,8,0.92) 0%, rgba(12,10,8,0.72) 100%)' }} />

      <div className="cta-in relative z-20 mx-auto max-w-[1600px] w-full px-6 md:px-16 py-28">
        <span className="text-[0.58rem] font-bold uppercase tracking-[0.42em] block mb-8" style={{ color: C.gold }}>
          — Contacte con nosotros
        </span>
        <h2
          className="text-5xl md:text-8xl font-black uppercase leading-[0.85] tracking-tight text-white mb-12 max-w-5xl"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          ¿Listo para<br /><span style={{ color: C.gold }}>su vehículo?</span>
        </h2>

        <div className="flex flex-wrap gap-4 mb-16">
          <Link href="/acceso"
            className="group inline-flex items-center gap-3 rounded-full px-9 py-4 text-sm font-bold uppercase tracking-[0.18em] transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            style={{ background: C.gold, color: C.ink }}>
            Reservar ahora <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-3 rounded-full border px-9 py-4 text-sm font-bold uppercase tracking-[0.18em] transition-all duration-400 hover:border-[#C09A3A]/60 hover:text-[#C09A3A]"
            style={{ borderColor: 'rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.7)' }}>
            <Phone className="h-4 w-4" /> {CONTACT.phone}
          </a>
        </div>

        <div className="flex flex-wrap gap-12 border-t pt-12"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {[
            { Icon: Phone, label: 'Teléfono', val: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
            { Icon: Mail, label: 'Email', val: CONTACT.email, href: `mailto:${CONTACT.email}` },
            { Icon: Clock, label: 'Horario', val: CONTACT.hours, href: undefined },
          ].map(({ Icon, label, val, href }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <span className="flex items-center gap-2 text-[0.58rem] font-bold uppercase tracking-[0.38em]"
                style={{ color: C.gold }}>
                <Icon className="h-3.5 w-3.5" />{label}
              </span>
              {href
                ? <a href={href} className="text-sm font-medium text-white hover:text-[#C09A3A] transition-colors">{val}</a>
                : <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{val}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   FOOTER
─────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="relative z-30" style={{ background: '#07060404' }}>
      <div style={{ background: '#080706' }}>
        <div className="h-px w-full"
          style={{ background: `linear-gradient(to right, transparent, ${C.gold}70, transparent)` }} />
        <div className="mx-auto max-w-[1600px] px-6 md:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
            <div className="xl:col-span-2">
              <p className="text-2xl font-black uppercase tracking-tight text-white"
                style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Alboraya <span style={{ color: C.gold }}>Garage</span>
              </p>
              <p className="mt-5 text-sm leading-relaxed max-w-sm"
                style={{ color: 'rgba(255,255,255,0.33)' }}>
                Su taller de confianza para el mantenimiento, la reparación y el alquiler de boxes equipados en Valencia.
              </p>
            </div>
            <div>
              <h4 className="text-[0.58rem] font-bold uppercase tracking-[0.38em] mb-8" style={{ color: C.gold }}>Contacto</h4>
              <div className="flex flex-col gap-4">
                {[
                  { Icon: Phone, text: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
                  { Icon: Mail, text: CONTACT.email, href: `mailto:${CONTACT.email}` },
                  { Icon: Clock, text: CONTACT.hours, href: undefined },
                ].map(({ Icon, text, href }) => (
                  href
                    ? <a key={text} href={href} className="flex items-start gap-3 text-xs font-medium hover:text-[#C09A3A] transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: C.gold }} />{text}
                      </a>
                    : <div key={text} className="flex items-start gap-3 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: C.gold }} />{text}
                      </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[0.58rem] font-bold uppercase tracking-[0.38em] mb-8" style={{ color: C.gold }}>Accesos</h4>
              <div className="flex flex-col gap-4 mb-8">
                {[
                  { href: '/acceso', label: 'Área cliente' },
                  { href: '/cliente/registro', label: 'Crear cuenta' },
                  { href: '/admin/login', label: 'Administrador' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href}
                    className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:text-[#C09A3A]"
                    style={{ color: 'rgba(255,255,255,0.38)' }}>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />{label}
                  </Link>
                ))}
              </div>
              <Link href="/acceso"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:scale-105"
                style={{ background: C.gold, color: C.ink }}>
                Reservar ahora
              </Link>
            </div>
          </div>
          <div className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <span className="text-[0.55rem] font-medium uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.18)' }}>
              © {new Date().getFullYear()} Alboraya Garage Accesorios · Todos los derechos reservados
            </span>
            <span className="text-[0.55rem] font-medium uppercase tracking-widest"
              style={{ color: `${C.gold}35` }}>
              Valencia · España
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────
   MAIN EXPORT
─────────────────────────────────────────── */
export default function DisorderedGridLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const [entered, setEntered] = useState(false);
  useLenis();

  // Bloque le scroll pendant l'intro
  useEffect(() => {
    document.documentElement.style.overflow = entered ? '' : 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, [entered]);

  return (
    <div
      ref={containerRef}
      className="font-sans selection:bg-[#C09A3A] selection:text-black relative"
      style={{ background: C.white }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&display=swap');`}</style>

      {!entered && <HoldToEnter onEnter={() => setEntered(true)} />}

      <CustomCursor />
      <Grain />
      <ScrollProgress enabled={entered} />
      <FloatingBook enabled={entered} />
      <LandingHeader />

      <motion.main
        className="relative w-full overflow-x-hidden"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={entered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Hero spy={scrollYProgress} entered={entered} />
        <GoldTicker />
        <BrandStatement />
        <Services />
        <BoxRental />
        <Stats />
        <WhyUs />
        <CinematicBreak spy={scrollYProgress} />
        <Gallery spy={scrollYProgress} />
        <CTASection spy={scrollYProgress} />
      </motion.main>

      <Footer />
    </div>
  );
}
