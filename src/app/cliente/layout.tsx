'use client';

import { usePathname } from 'next/navigation';
import ClientShell from '@/components/client/ClientShell';

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/cliente/registro' || pathname === '/cliente/login') {
    return <>{children}</>;
  }
  return <ClientShell>{children}</ClientShell>;
}
