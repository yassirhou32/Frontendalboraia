'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Mail, Shield } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  GlobalStyles, AuthBackground, ChromeCard, PremiumButton,
  authLabelClass, AuthHero, authCardClass, authInputClass,
} from '@/components/admin/y2k';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { setAdminAuth } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectClient, setRedirectClient] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRedirectClient(false);
    setLoading(true);
    try {
      const data = await api<{ token: string; admin: { id: string; nombre: string; email: string } }>(
        '/auth/admin/login',
        { method: 'POST', body: { email, password } }
      );
      setAdminAuth(data.token, data.admin);
      router.push('/admin/dashboard');
    } catch (err) {
      const e = err as Error & { role?: string };
      setError(e.message || 'Credenciales incorrectas');
      if (e.role === 'client') setRedirectClient(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-y2k auth-page relative min-h-screen flex flex-col p-6 sm:p-10 lg:p-14 overflow-x-hidden">
      <GlobalStyles />
      <AuthBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col flex-1">
        <AuthHero
          title="Administrator Centre"
          subtitle="Acceso restringido al equipo"
          brandName="Alboraya Garage Accesorios"
          centerTitle
          className="mb-8 lg:mb-12 shrink-0"
        />

        <div className="flex-1 flex items-start sm:items-center justify-center pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl lg:max-w-2xl mx-auto"
          >
            <ChromeCard
              className={authCardClass}
              title="Iniciar sesión"
              subtitle="Solo para administradores autorizados"
              hideMenu
            >
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-base space-y-2">
                  <p>{error}</p>
                  {redirectClient && (
                    <Link href="/acceso" className="inline-flex items-center gap-1 font-semibold hover:underline">
                      Ir al acceso de cliente <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={authLabelClass}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={cn(authInputClass, 'pl-12')} placeholder="admin@email.com" required />
                  </div>
                </div>
                <div>
                  <label className={authLabelClass}>Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={cn(authInputClass, 'pl-12')} placeholder="••••••••" required />
                  </div>
                </div>
                <PremiumButton type="submit" disabled={loading} className="w-full">
                  {loading ? <LoadingSpinner size="sm" /> : (<><Shield className="w-5 h-5" />Acceder al panel<ArrowRight className="w-5 h-5" /></>)}
                </PremiumButton>
              </form>
            </ChromeCard>

            <Link href="/acceso" className="group flex items-center justify-center gap-2 py-8 text-base text-neutral-400 hover:text-white font-medium">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Volver al acceso de cliente
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
