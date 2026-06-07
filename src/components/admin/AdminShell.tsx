'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, ClipboardList, Users, Calendar } from 'lucide-react';
import {
  GlobalStyles, AdminBackground,
  ShellSidebar, ShellHeader, ContentPanel,
} from '@/components/admin/y2k';
import { clearAdminAuth, getAdminToken, getAdminUser, type AdminData } from '@/lib/auth';

const sidebarLinks = [
  { href: '/admin/dashboard', icon: BarChart3, label: 'Panel' },
  { href: '/admin/solicitudes', icon: ClipboardList, label: 'Solicitudes' },
  { href: '/admin/clientes', icon: Users, label: 'Clientes' },
  { href: '/admin/calendario', icon: Calendar, label: 'Calendario' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/admin/login');
      return;
    }
    setAdmin(getAdminUser());
    setReady(true);
  }, [router, pathname]);

  if (!ready) return null;

  return (
    <div className="admin-y2k admin-shell min-h-screen text-white bg-transparent selection:bg-[#D4AF37]/30">
      <GlobalStyles />

      <div className="relative flex h-screen overflow-hidden">
        <AdminBackground />
        <ShellSidebar
          logoHref="/admin/dashboard"
          links={sidebarLinks}
          pathname={pathname}
          transparent
          logoOnly
          onLogout={() => { clearAdminAuth(); router.push('/admin/login'); }}
        />

        <main className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-hidden px-5 sm:px-8 lg:px-10 py-6 lg:py-8">
            <ShellHeader
              title="Alboraia"
              tagline="Panel de administración"
              status="En línea"
              statusDetail={admin?.email || 'admin'}
            />
            <ContentPanel pathname={pathname}>{children}</ContentPanel>
          </div>
        </main>
      </div>
    </div>
  );
}
