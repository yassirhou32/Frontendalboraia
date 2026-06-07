'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CreditCard, FileText } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChromeCard, PageIntro } from '@/components/admin/y2k';
import StatusFrame, { statusMessage, statusToVariant } from '@/components/StatusFrame';
import { api } from '@/lib/api';
import { getClientToken } from '@/lib/auth';
import type { ServiceRequest } from '@/lib/types';

export default function ClientRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getClientToken()) {
      router.push('/acceso');
      return;
    }
    api<ServiceRequest[]>('/requests/my', { token: getClientToken() })
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <ChromeCard title="Mis Solicitudes" subtitle="Sin registros" className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-500 font-mono text-sm">No tienes solicitudes todavía</p>
        </div>
      </ChromeCard>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageIntro title="Mis solicitudes" description="Consulta el estado y la facturación de todas tus reservas." />
      {requests.map((req) => (
        <ChromeCard
          key={req._id}
          title={`${req.marca} ${req.modelo}`}
          subtitle={req.matricule}
        >
          <p className="text-sm text-neutral-400 font-mono mb-4 -mt-2">
            {req.tipoServicio === 'garage' ? 'Reparación por garage' : 'Alquiler de box'}
            {' · '}{req.servicioBox}
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-sm font-mono mb-6">
            <div className="flex items-center gap-2 text-neutral-400">
              <Calendar className="w-4 h-4" />
              <span className="text-white">
                {format(new Date(req.fechaEntrada), 'dd MMM yyyy', { locale: es })} — {req.horaEntrada}
              </span>
            </div>
            <div className="text-neutral-400">
              <span className="opacity-50">KM: </span>
              <span className="text-white">{req.kilometraje.toLocaleString()}</span>
            </div>
            <div className="text-neutral-400">
              <span className="opacity-50">Creada: </span>
              <span className="text-white">{format(new Date(req.createdAt), 'dd MMM yyyy', { locale: es })}</span>
            </div>
          </div>

          <StatusFrame
            mode="inline"
            variant={statusToVariant(req.estado)}
            message={statusMessage(req.estado, req.motivoRechazo)}
            subtitle={`Estado · ${req.estado.toUpperCase()}`}
          />

          {req.estado === 'aprobado' && req.facturacion.precio && (
            <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/25 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-green-400" />
                <span className="font-bold text-green-400 font-mono uppercase text-xs">Facturación</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-sm font-mono">
                <div className="text-white">
                  <span className="text-neutral-500">Precio: </span>
                  <span className="font-bold text-lg">{req.facturacion.precio} €</span>
                </div>
                {req.facturacion.horaSalida && (
                  <div className="text-white">
                    <span className="text-neutral-500">Salida: </span>
                    {format(new Date(req.fechaEntrada), 'dd MMM yyyy', { locale: es })} — {req.facturacion.horaSalida}
                  </div>
                )}
              </div>
            </div>
          )}
        </ChromeCard>
      ))}
    </div>
  );
}
