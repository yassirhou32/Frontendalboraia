'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ActivitySquare } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChromeCard } from '@/components/admin/y2k';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { getAdminToken } from '@/lib/auth';
import type { ServiceRequest } from '@/lib/types';

const statusMap: Record<string, string> = {
  pendiente: 'PENDIENTE',
  aprobado: 'APROBADO',
  rechazado: 'RECHAZADO',
};

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/admin/login');
      return;
    }
    api<ServiceRequest[]>('/requests/admin/all', { token: getAdminToken() })
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.estado === filter);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ChromeCard className="flex-1 w-full min-h-[600px] flex flex-col p-0 overflow-hidden" title="" subtitle="" hideMenu>
      <div className="p-6 border-b border-white/10 flex flex-wrap justify-between items-center gap-4 bg-black/40 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white flex items-center gap-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <ActivitySquare className="w-6 h-6 text-[#D4AF37]" /> Solicitudes
          </h2>
          <p className="text-sm text-neutral-400 mt-1 font-medium">{requests.length} registros en total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pendiente', 'aprobado', 'rechazado'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1 text-[10px] font-mono border border-white/20 rounded uppercase transition-colors tracking-wider',
                filter === f ? 'bg-gradient-to-r from-[#F5D76E] to-[#D4AF37] text-black font-bold border-[#D4AF37]/50' : 'hover:bg-[#D4AF37]/10 hover:text-[#F5D76E] text-neutral-400'
              )}
            >
              {f === 'all' ? 'todas' : f}
            </button>
          ))}
        </div>
        <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded text-xs font-mono animate-pulse">
          SYNCING
        </div>
      </div>
      <div className="overflow-auto w-full flex-1 p-0">
        <table className="w-full text-left font-mono text-xs whitespace-nowrap">
          <thead className="sticky top-0 bg-neutral-900/90 backdrop-blur-md z-10 border-b border-white/10">
            <tr>
              <th className="py-4 px-6 font-bold uppercase tracking-widest text-neutral-500">Nombre</th>
              <th className="py-4 px-6 font-bold uppercase tracking-widest text-neutral-500">Email</th>
              <th className="py-4 px-6 font-bold uppercase tracking-widest text-neutral-500">Servicio</th>
              <th className="py-4 px-6 font-bold uppercase tracking-widest text-neutral-500">Tipo</th>
              <th className="py-4 px-6 font-bold uppercase tracking-widest text-neutral-500 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((req) => (
              <tr key={req._id} className="hover:bg-white/5 transition-colors group cursor-crosshair">
                <td className="py-4 px-6">
                  <Link href={`/admin/solicitudes/${req._id}`} className="font-bold text-[#D4AF37] group-hover:text-[#F5D76E]">
                    {req.nombre}
                  </Link>
                </td>
                <td className="py-4 px-6 text-neutral-300">{req.email}</td>
                <td className="py-4 px-6 text-neutral-300">{req.servicioBox}</td>
                <td className="py-4 px-6 text-neutral-500">{req.tipoServicio === 'garage' ? 'Garage' : 'Box'}</td>
                <td className="py-4 px-6 text-right">
                  <span className={cn(
                    'px-2 py-1 rounded border',
                    req.estado === 'aprobado' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                      req.estado === 'pendiente' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                        'border-red-500/30 text-red-500 bg-red-500/10 animate-pulse'
                  )}>
                    {statusMap[req.estado]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-neutral-500 font-mono text-sm">
            No hay solicitudes con este filtro
          </div>
        )}
      </div>
    </ChromeCard>
  );
}
