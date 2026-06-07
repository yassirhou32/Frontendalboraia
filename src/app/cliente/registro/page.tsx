'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Mail, User, UserPlus } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  GlobalStyles, AuthBackground, ChromeCard, PremiumButton,
  authLabelClass, AuthHero, authCardClass, authInputClass,
} from '@/components/admin/y2k';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

export default function ClientRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api('/auth/register', { method: 'POST', body: form });
      router.push('/acceso?registered=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
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
          title="Crear cuenta"
          subtitle="Únete como nuevo cliente"
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
              title="Registro"
              subtitle="Todos los campos son obligatorios"
              hideMenu
            >
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-base">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={authLabelClass}>Nombre</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={cn(authInputClass, 'pl-12')} placeholder="Tu nombre completo" required />
                  </div>
                </div>
                <div>
                  <label className={authLabelClass}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={cn(authInputClass, 'pl-12')} placeholder="tu@email.com" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={authLabelClass}>Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={cn(authInputClass, 'pl-12')} placeholder="Mín. 6 caracteres" required minLength={6} />
                    </div>
                  </div>
                  <div>
                    <label className={authLabelClass}>Confirmar</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className={cn(authInputClass, 'pl-12')} placeholder="Repetir" required />
                    </div>
                  </div>
                </div>
                <PremiumButton type="submit" disabled={loading} className="w-full">
                  {loading ? <LoadingSpinner size="sm" /> : (<><UserPlus className="w-5 h-5" />Crear cuenta<ArrowRight className="w-5 h-5" /></>)}
                </PremiumButton>
              </form>
            </ChromeCard>

            <Link href="/acceso" className="group flex items-center justify-center gap-2 py-8 text-base text-neutral-400 hover:text-white font-medium">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Volver a iniciar sesión
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
