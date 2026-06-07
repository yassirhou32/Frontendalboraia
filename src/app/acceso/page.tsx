'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, LogIn, Mail, Shield, UserPlus } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  GlobalStyles, AuthBackground, ChromeCard, PremiumButton,
  AuthHero, authCardClass, authInputClass, authLabelClass, authLinkCardClass,
} from '@/components/admin/y2k';
import { api } from '@/lib/api';
import { setClientAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectAdmin, setRedirectAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRedirectAdmin(false);
    setLoading(true);
    try {
      const data = await api<{ token: string; user: { id: string; nombre: string; email: string } }>(
        '/auth/login',
        { method: 'POST', body: { email, password } }
      );
      setClientAuth(data.token, data.user);
      router.push('/cliente/dashboard');
    } catch (err) {
      const e = err as Error & { role?: string };
      setError(e.message || 'Credenciales incorrectas');
      if (e.role === 'admin') setRedirectAdmin(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl lg:max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ChromeCard className={authCardClass} title="Iniciar sesión" subtitle="Introduce tus credenciales para continuar" hideMenu>
          {justRegistered && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-base backdrop-blur-sm">
              Cuenta creada. Inicia sesión para continuar.
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-base space-y-2 backdrop-blur-sm">
              <p>{error}</p>
              {redirectAdmin && (
                <Link href="/admin/login" className="inline-flex items-center gap-1 font-semibold hover:underline">
                  Ir a acceso administrador <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={authLabelClass}>Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 drop-shadow-md" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={cn(authInputClass, 'pl-12')} placeholder="tu@email.com" required />
              </div>
            </div>
            <div>
              <label className={authLabelClass}>Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 drop-shadow-md" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={cn(authInputClass, 'pl-12')} placeholder="••••••••" required />
              </div>
            </div>
            <PremiumButton type="submit" disabled={loading} className="w-full">
              {loading ? <LoadingSpinner size="sm" /> : (<><LogIn className="w-5 h-5" />Entrar<ArrowRight className="w-5 h-5" /></>)}
            </PremiumButton>
          </form>
        </ChromeCard>

        <Link href="/cliente/registro" className={cn('group flex items-center gap-5 p-6 mt-6', authLinkCardClass)}>
          <div className="w-14 h-14 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0 group-hover:bg-white/12 border border-white/20">
            <UserPlus className="w-7 h-7 text-white drop-shadow-md" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Crear cuenta</p>
            <p className="text-base text-neutral-200 mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">¿Nuevo cliente? Regístrate gratis</p>
          </div>
          <ArrowRight className="w-6 h-6 text-neutral-200 group-hover:translate-x-1 transition-transform drop-shadow-md" />
        </Link>

        <div className="flex justify-center mt-8 gap-6">
          <Link href="/" className="text-sm text-neutral-200 hover:text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            Volver al inicio
          </Link>
          <Link href="/admin/login" className="flex items-center gap-2 text-sm text-neutral-200 hover:text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <Shield className="w-4 h-4" /> Acceso administrador
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AccesoPage() {
  return (
    <div className="admin-y2k auth-page relative min-h-screen flex flex-col p-6 sm:p-10 lg:p-14 overflow-x-hidden">
      <GlobalStyles />
      <AuthBackground />
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col flex-1">
        <AuthHero
          title="Bienvenido"
          subtitle="Acceso para clientes"
          brandName="Alboraya Garage Accesorios"
          centerTitle
          className="mb-8 lg:mb-12 shrink-0"
        />
        <div className="flex-1 flex items-start sm:items-center justify-center pb-8">
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
