'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ArrowLeft, Car, MapPin, Phone, User, Calendar, Gauge,
  CheckCircle, XCircle, CreditCard,
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChromeCard } from '@/components/admin/y2k';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { getAdminToken } from '@/lib/auth';
import type { ServiceRequest } from '@/lib/types';
import { HORAS } from '@/lib/types';

export default function AdminRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [precio, setPrecio] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/admin/login');
      return;
    }
    api<ServiceRequest>(`/requests/admin/${id}`, { token: getAdminToken() })
      .then(setRequest)
      .catch(() => setError('Solicitud no encontrada'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleApprove = async () => {
    if (!precio || !horaSalida) {
      setError('Debe introducir el precio y la hora de salida');
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      const data = await api<{ request: ServiceRequest }>(
        `/requests/admin/${id}/approve`,
        { method: 'PATCH', token: getAdminToken(), body: { precio, horaSalida } }
      );
      setRequest(data.request);
      setSuccess('Solicitud aprobada correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    setError('');
    try {
      const data = await api<{ request: ServiceRequest }>(
        `/requests/admin/${id}/reject`,
        { method: 'PATCH', token: getAdminToken(), body: { motivoRechazo } }
      );
      setRequest(data.request);
      setSuccess('Solicitud rechazada');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!request) {
    return (
      <ChromeCard title="Error" subtitle="Solicitud no encontrada">
        <p className="font-mono text-neutral-500 text-center py-10">{error || 'Solicitud no encontrada'}</p>
      </ChromeCard>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/solicitudes" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white font-mono transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver a solicitudes
      </Link>

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      <ChromeCard title="Detalle de Solicitud" subtitle={request.estado.toUpperCase()}>
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Cliente
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono">
              <div><span className="text-neutral-500">Nombre:</span> <span className="text-white">{request.nombre}</span></div>
              <div><span className="text-neutral-500">Email:</span> <span className="text-white">{request.email}</span></div>
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-4 h-4 text-neutral-500" /> {request.telefono}
              </div>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-4 h-4 text-neutral-500" /> {request.direccion}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-indigo-400" />
              Vehículo
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono">
              <div><span className="text-neutral-500">Matrícula:</span> <span className="text-white">{request.matricule}</span></div>
              <div><span className="text-neutral-500">Marca/Modelo:</span> <span className="text-white">{request.marca} {request.modelo}</span></div>
              <div className="flex items-center gap-2 text-white">
                <Gauge className="w-4 h-4 text-neutral-500" />
                {request.kilometraje.toLocaleString()} km
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-4">Servicio</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <span className="text-neutral-500">Tipo:</span>{' '}
                <span className="text-white">{request.tipoServicio === 'garage' ? 'Reparación por garage' : 'Alquiler de box'}</span>
              </div>
              <div><span className="text-neutral-500">Servicio:</span> <span className="text-white">{request.servicioBox}</span></div>
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-neutral-500" />
                Entrada: {format(new Date(request.fechaEntrada), 'dd MMM yyyy', { locale: es })} — {request.horaEntrada}
              </div>
            </div>
          </div>

          {request.estado === 'aprobado' && request.facturacion.precio && (
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/15">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-green-400" />
                <span className="font-bold text-green-400 font-mono uppercase">Facturación Aprobada</span>
              </div>
              <div className="text-sm font-mono">
                <div className="text-white">Precio: <strong>{request.facturacion.precio} €</strong></div>
                {request.facturacion.horaSalida && (
                  <div className="text-white">
                    Salida: {format(new Date(request.fechaEntrada), 'dd MMM yyyy', { locale: es })} — {request.facturacion.horaSalida}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ChromeCard>

      {request.estado === 'pendiente' && (
        <div className="grid md:grid-cols-2 gap-6">
          <ChromeCard title="Aprobar" subtitle="Facturación Requerida">
            <div className="space-y-4 mt-2">
              <div>
                <label className="block font-mono text-xs uppercase text-neutral-400 mb-2">Precio (€)</label>
                <input
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="p-3 bg-neutral-900/50 border border-white/20 font-mono text-sm outline-none focus:border-indigo-500 transition-colors rounded-lg text-white w-full"
                  min="0"
                  step="0.01"
                  placeholder="150.00"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase text-neutral-400 mb-2">Hora de Salida</label>
                <p className="text-xs text-neutral-500 mb-3 font-mono">
                  Mismo día: {format(new Date(request.fechaEntrada), 'dd MMM yyyy', { locale: es })}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {HORAS.filter((h) => {
                    const idxEntrada = HORAS.indexOf(request.horaEntrada);
                    const idxHora = HORAS.indexOf(h);
                    return idxHora > idxEntrada;
                  }).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHoraSalida(h)}
                      className={cn(
                        'py-3 px-2 rounded-xl border text-sm font-bold font-mono transition-all cursor-pointer',
                        horaSalida === h
                          ? 'border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                          : 'border-white/15 bg-neutral-900/50 text-zinc-200 hover:border-indigo-500/60 hover:bg-indigo-500/10'
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-6 py-2 bg-white text-black font-bold text-xs uppercase hover:bg-neutral-200 transition-colors rounded flex items-center gap-2"
              >
                {actionLoading ? <LoadingSpinner size="sm" /> : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Validar Solicitud
                  </>
                )}
              </button>
            </div>
          </ChromeCard>

          <ChromeCard className="border-red-500/30 bg-red-900/10" title="Rechazar" subtitle="ACCIÓN CRÍTICA">
            <div className="space-y-4 mt-2">
              <div>
                <label className="block font-mono text-xs uppercase text-neutral-400 mb-2">Motivo (opcional)</label>
                <input
                  type="text"
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  className="p-3 bg-neutral-900/50 border border-white/20 font-mono text-sm outline-none focus:border-red-500 transition-colors rounded-lg text-white w-full"
                  placeholder="Motivo del rechazo"
                />
              </div>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="whitespace-nowrap px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest rounded-lg transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-2"
              >
                {actionLoading ? <LoadingSpinner size="sm" /> : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </>
                )}
              </button>
            </div>
          </ChromeCard>
        </div>
      )}
    </div>
  );
}
