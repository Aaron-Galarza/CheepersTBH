'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { AdminTabs } from '@/components/layout/AdminTabs';
import { ReactNode } from 'react';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isCocina = pathname?.startsWith('/admin/cocina');
  const isPOS = pathname?.startsWith('/admin/pos');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div className="cart-bg min-h-screen flex items-center justify-center"><p className="text-[#757575]">Cargando...</p></div>;
  }

  return (
    <div className={(isCocina || isPOS) ? '-mt-[70px] md:-mt-[100px]' : ''}>
      <div className={`sticky z-40 ${(isCocina || isPOS) ? 'top-0' : 'top-[70px] md:top-[100px]'}`}>
        <AdminTabs />
      </div>
      {children}
    </div>
  );
}
