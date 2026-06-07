'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AutomotiveClientCard, ChromeCard, PageIntro } from '@/components/admin/y2k';
import { api } from '@/lib/api';
import { getAdminToken } from '@/lib/auth';
import type { ClientUser } from '@/lib/types';

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/admin/login');
      return;
    }
    api<ClientUser[]>('/users/admin/all', { token: getAdminToken() })
      .then(setClients)
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

  return (
    <div>
      <PageIntro
        title="Clientes"
        description={`${clients.length} clientes registrados en el sistema. Selecciona un perfil para ver el detalle.`}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
        {clients.map((client) => (
          <Link key={client._id} href={`/admin/clientes/${client._id}`} className="block h-full">
            <AutomotiveClientCard
              nombre={client.nombre}
              email={client.email}
              registro={format(new Date(client.createdAt), 'dd MMM yyyy', { locale: es })}
              solicitudes={client.solicitudes}
              active={client.solicitudes > 0}
            />
          </Link>
        ))}
        {clients.length === 0 && (
          <ChromeCard className="col-span-full" title="Sin Clientes" subtitle="No hay registros">
            <p className="text-neutral-500 text-base text-center py-12">No hay clientes registrados</p>
          </ChromeCard>
        )}
      </div>
    </div>
  );
}
