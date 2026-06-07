'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

function RedirectToHome() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.toString();
    router.replace(q ? `/acceso?${q}` : '/acceso');
  }, [router, searchParams]);

  return null;
}

export default function ClientLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
      <RedirectToHome />
    </Suspense>
  );
}
