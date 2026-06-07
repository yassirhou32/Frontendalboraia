'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, LayoutDashboard, LogOut } from 'lucide-react';
import Logo from './Logo';
import { clearClientAuth, getClientUser, type UserData } from '@/lib/auth';

const links = [
  { href: '/cliente/dashboard', label: 'Nueva Solicitud', icon: LayoutDashboard },
  { href: '/cliente/solicitudes', label: 'Mis Solicitudes', icon: FileText },
];

export default function ClientNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    setUser(getClientUser());
  }, []);

  const handleLogout = () => {
    clearClientAuth();
    router.push('/cliente/login');
  };

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo href="/cliente/dashboard" />
          <div className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === href
                    ? 'bg-accent/15 text-accent-light'
                    : 'text-muted hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-muted hidden md:block">
                {user.nombre}
              </span>
            )}
            <button onClick={handleLogout} className="btn-secondary !py-2 !px-3 text-sm">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
