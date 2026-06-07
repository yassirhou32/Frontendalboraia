'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Mail, Trash2, User, FileText } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChromeCard } from '@/components/admin/y2k';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { getAdminToken } from '@/lib/auth';
import type { ClientDetail } from '@/lib/types';

const statusMap: Record<string, string> = {
  pendiente: 'PENDIENTE',
  aprobado: 'APROBADO',
  rechazado: 'RECHAZADO',
};

export default function AdminClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/admin/login');
      return;
    }
    api<ClientDetail>(`/users/admin/${id}`, { token: getAdminToken() })
      .then(setData)
      .catch(() => setError('Cliente no encontrado'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await api(`/users/admin/${id}`, {
        method: 'DELETE',
        token: getAdminToken(),
      });
      router.push('/admin/clientes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <ChromeCard title="Error" subtitle="Cliente no encontrado">
        <p className="font-mono text-neutral-500 text-center py-10">{error || 'Cliente no encontrado'}</p>
      </ChromeCard>
    );
  }

  const { user, solicitudes } = data;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/clientes" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white font-mono transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver a clientes
      </Link>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      <ChromeCard title={user.nombre} subtitle="Perfil de Cliente">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <User className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-mono">
                Registrado: {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: es })}
              </p>
            </div>
          </div>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 font-mono text-xs uppercase rounded-lg hover:bg-red-600/30 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Cliente
            </button>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400 font-mono">¿Confirmar eliminación?</p>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 bg-red-600 text-white font-mono text-xs uppercase rounded hover:bg-red-700"
              >
                {deleting ? <LoadingSpinner size="sm" /> : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 border border-white/20 text-neutral-400 font-mono text-xs uppercase rounded hover:bg-white/10"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </ChromeCard>

      <ChromeCard title="Solicitudes" subtitle={`${solicitudes.length} REGISTROS`}>
        {solicitudes.length === 0 ? (
          <p className="text-neutral-500 text-sm font-mono text-center py-10">Este cliente no tiene solicitudes</p>
        ) : (
          <div className="space-y-3">
            {solicitudes.map((req) => (
              <div
                key={req._id}
                className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div>
                  <p className="font-mono font-medium text-sm text-white">
                    {req.marca} {req.modelo} — {req.matricule}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 font-mono">
                    {req.tipoServicio === 'garage' ? 'Garage' : 'Box'} — {req.servicioBox}
                    {' · '}
                    {format(new Date(req.fechaEntrada), 'dd MMM yyyy', { locale: es })} — {req.horaEntrada}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'px-2 py-1 rounded border text-xs font-mono',
                    req.estado === 'aprobado' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                      req.estado === 'pendiente' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                        'border-red-500/30 text-red-500 bg-red-500/10'
                  )}>
                    {statusMap[req.estado]}
                  </span>
                  <Link
                    href={`/admin/solicitudes/${req._id}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-mono uppercase"
                  >
                    Ver solicitud
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </ChromeCard>
    </div>
  );
}
