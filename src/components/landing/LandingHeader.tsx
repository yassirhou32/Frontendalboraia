'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Box', href: '#box' },
  { label: 'Contacto', href: '#contacto' },
] as const;

const GOLD = '#B8973A';

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [atHero, setAtHero] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setAtHero(y < (window.innerHeight * 0.85));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 md:px-16 transition-all duration-500',
          scrolled ? 'py-3' : 'py-6',
        )}
      >
        <div
          className={cn(
            'absolute inset-x-0 top-0 bottom-0 transition-all duration-500',
            scrolled
              ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]'
              : 'bg-transparent',
          )}
        />

        <a href="#inicio" className="relative group flex flex-col leading-none z-10">
          <span
            className={cn(
              'text-[0.55rem] font-bold uppercase tracking-[0.4em] transition-colors duration-400',
              atHero ? 'text-[#B8973A]' : 'text-[#B8973A]',
            )}
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Alboraya
          </span>
          <span
            className={cn(
              'text-sm font-black uppercase tracking-widest transition-colors duration-400',
              atHero ? 'text-white group-hover:text-[#B8973A]' : 'text-[#111010] group-hover:text-[#B8973A]',
            )}
          >
            Garage Accesorios
          </span>
        </a>

        <nav className="relative hidden items-center gap-8 lg:flex z-10">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'text-[0.65rem] font-bold uppercase tracking-[0.22em] transition-colors duration-300 hover:text-[#B8973A]',
                atHero ? 'text-white/75' : 'text-[#111010]/60',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href="/acceso"
          className={cn(
            'relative z-10 group flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition-all duration-400 hover:scale-105',
            atHero
              ? 'border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-[#B8973A] hover:border-[#B8973A] hover:text-black'
              : 'border-[#B8973A]/50 bg-[#B8973A]/8 text-[#B8973A] hover:bg-[#B8973A] hover:text-black',
          )}
        >
          <User className="h-3.5 w-3.5" />
          Perfil
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.header>
  );
}
