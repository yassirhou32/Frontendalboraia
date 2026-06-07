'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ban, Trash2, Plus, Clock } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import DatePicker from '@/components/DatePicker';
import ServiceDropdown from '@/components/ServiceDropdown';
import { ChromeCard } from '@/components/admin/y2k';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { getAdminToken } from '@/lib/auth';
import { HORAS } from '@/lib/types';
import type { BlockedDate } from '@/lib/types';

export default function AdminCalendarPage() {
  const router = useRouter();
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState<'dia_completo' | 'hora_especifica'>('dia_completo');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fullBlockedDates = blocked
    .filter((b) => b.tipo === 'dia_completo')
    .map((b) => b.fecha.split('T')[0]);

  const fetchBlocked = () => {
    api<BlockedDate[]>('/calendar/blocked')
      .then(setBlocked)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/admin/login');
      return;
    }
    fetchBlocked();
  }, [router]);

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha) {
      setError('Debe seleccionar una fecha');
      return;
    }
    if (tipo === 'hora_especifica' && !hora) {
      setError('Debe seleccionar una hora');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await api('/calendar/block', {
        method: 'POST',
        token: getAdminToken(),
        body: { fecha, tipo, hora: tipo === 'hora_especifica' ? hora : undefined, motivo },
      });
      setSuccess(tipo === 'dia_completo' ? 'Día bloqueado correctamente' : 'Hora bloqueada correctamente');
      setFecha('');
      setHora('');
      setMotivo('');
      fetchBlocked();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al bloquear');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      await api(`/calendar/block/${id}`, {
        method: 'DELETE',
        token: getAdminToken(),
      });
      setBlocked((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desbloquear');
    }
  };

  const getTipoLabel = (b: BlockedDate) => {
    if (b.tipo === 'dia_completo') return 'Día completo';
    return `Hora: ${b.hora}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {success && (
        <div className="md:col-span-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono">
          {success}
        </div>
      )}
      {error && (
        <div className="md:col-span-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      <ChromeCard title="Variables del Sistema" subtitle="Bloqueo de Calendario">
        <form className="space-y-6 mt-2 flex flex-col pb-4" onSubmit={handleBlock}>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase text-neutral-400">Tipo de Bloqueo</label>
            <ServiceDropdown
              value={tipo}
              onChange={(v) => {
                setTipo(v as 'dia_completo' | 'hora_especifica');
                setHora('');
              }}
              options={[
                { value: 'dia_completo', label: 'Día completo' },
                { value: 'hora_especifica', label: 'Hora específica' },
              ]}
              placeholder="— Selecciona tipo de bloqueo —"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase text-neutral-400">Fecha</label>
            <DatePicker
              value={fecha}
              onChange={(d) => { setFecha(d); setHora(''); }}
              blockedDates={fullBlockedDates}
              placeholder="Selecciona una fecha"
            />
          </div>

          {tipo === 'hora_especifica' && fecha && (
            <div className="space-y-4 p-5 rounded-2xl border border-white/10 bg-black/40">
              <label className="block font-mono text-xs uppercase text-neutral-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Hora a bloquear
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {HORAS.map((h) => {
                  const alreadyBlocked = blocked.some(
                    (b) => b.tipo === 'hora_especifica' && b.hora === h && b.fecha.split('T')[0] === fecha
                  );
                  const selected = hora === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={alreadyBlocked}
                      onClick={() => setHora(h)}
                      className={cn(
                        'py-3 px-2 rounded-xl border text-sm font-bold font-mono transition-all',
                        alreadyBlocked
                          ? 'border-red-500/20 bg-red-500/5 text-red-400/40 line-through cursor-not-allowed'
                          : selected
                            ? 'border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] cursor-pointer'
                            : 'border-white/15 bg-neutral-900/50 text-zinc-200 hover:border-indigo-500/60 hover:bg-indigo-500/10 cursor-pointer'
                      )}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase text-neutral-400">Motivo (opcional)</label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="p-3 bg-neutral-900/50 border border-white/20 font-mono text-sm outline-none focus:border-indigo-500 transition-colors rounded-lg text-white"
              placeholder="Ej: Vacaciones, mantenimiento..."
            />
          </div>

          <div className="flex gap-4 pt-4 mt-auto">
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2 bg-white text-black font-bold text-xs uppercase hover:bg-neutral-200 transition-colors rounded flex items-center gap-2"
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : (
                <>
                  <Plus className="w-4 h-4" />
                  Bloquear
                </>
              )}
            </button>
          </div>
        </form>
      </ChromeCard>

      <ChromeCard title="Terminal" subtitle="Bloqueos Activos" className="flex flex-col">
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : blocked.length === 0 ? (
          <div className="flex-1 bg-black/60 border border-white/10 rounded-lg p-4 font-mono text-xs text-green-400 min-h-[200px] flex items-center justify-center">
            <p className="opacity-50">No hay bloqueos activos</p>
          </div>
        ) : (
          <div className="flex-1 space-y-3 max-h-[32rem] overflow-y-auto">
            {blocked.map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div>
                  <p className="font-mono font-medium text-sm text-white">
                    {format(new Date(b.fecha), 'EEEE, dd MMM yyyy', { locale: es })}
                  </p>
                  <p className="text-xs text-indigo-400 mt-0.5 font-mono font-medium flex items-center gap-1">
                    <Ban className="w-3 h-3" />
                    {getTipoLabel(b)}
                  </p>
                  {b.motivo && (
                    <p className="text-xs text-neutral-500 mt-1 font-mono">{b.motivo}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleUnblock(b._id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                  title="Eliminar bloqueo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ChromeCard>
    </div>
  );
}
