'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText } from 'lucide-react';
import {
  GlobalStyles, ClientVideoBackground, PillNav,
  ShellSidebar, ShellHeader, ContentPanel,
} from '@/components/admin/y2k';
import { clearClientAuth, getClientToken, getClientUser, type UserData } from '@/lib/auth';

const sidebarLinks = [
  { href: '/cliente/dashboard', icon: LayoutDashboard, label: 'Nueva solicitud' },
  { href: '/cliente/solicitudes', icon: FileText, label: 'Mis solicitudes' },
];

const CLIENT_NAV = [
  { label: 'Nueva', href: '/cliente/dashboard' },
  { label: 'Mis Solicitudes', href: '/cliente/solicitudes' },
] as const;

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getClientToken()) {
      router.push('/acceso');
      return;
    }
    setUser(getClientUser());
    setReady(true);
  }, [router, pathname]);

  if (!ready) return null;

  return (
    <div className="admin-y2k client-shell min-h-screen text-white bg-transparent selection:bg-[#D4AF37]/30">
      <GlobalStyles />

      <div className="relative flex h-screen overflow-hidden">
        <ClientVideoBackground />
        <ShellSidebar
          logoHref="/cliente/dashboard"
          links={sidebarLinks}
          pathname={pathname}
          transparent
          logoOnly
          onLogout={() => { clearClientAuth(); router.push('/acceso'); }}
        />

        <main className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-hidden px-5 sm:px-8 lg:px-10 py-6 lg:py-8">
            <ShellHeader
              title="Alboraia"
              tagline="Tu garage de confianza"
              status="Conectado"
              statusDetail={user?.nombre || user?.email || 'cliente'}
              nav={<PillNav pathname={pathname} items={CLIENT_NAV} />}
            />
            <ContentPanel pathname={pathname}>{children}</ContentPanel>
          </div>
        </main>
      </div>
    </div>
  );
}
