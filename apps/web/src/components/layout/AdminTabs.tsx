'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { LayoutDashboard, ShoppingCart, ChefHat, Package, DollarSign, Image, Settings, LogOut } from 'lucide-react';

const tabs = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/pos', label: 'POS', Icon: ShoppingCart },
  { href: '/admin/cocina', label: 'Cocina', Icon: ChefHat },
  { href: '/admin/pedidos', label: 'Pedidos', Icon: Package },
  { href: '/admin/ventas', label: 'Ventas', Icon: DollarSign },
  { href: '/admin/galeria', label: 'Galeria', Icon: Image },
  { href: '/admin/config', label: 'Config', Icon: Settings },
];

export function AdminTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-40">
      <div className="flex overflow-x-auto hide-scrollbar">
        {tabs.map(({ href, label, Icon }) => (
          <Link key={href} href={href}
            className={`px-3 py-3 font-semibold whitespace-nowrap transition border-b-2 flex items-center gap-2 text-xs sm:text-sm ${
              pathname === href ? 'border-[#D9383A] text-[#D9383A]' : 'border-transparent text-[#757575] hover:text-[#212121] hover:bg-gray-50'}`}>
            <Icon size={16} className="sm:size-[16px] size-[18px]" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        ))}
        <button onClick={handleLogout}
          className="ml-auto px-3 py-3 text-[#D9383A] hover:bg-red-50 font-semibold border-b-2 border-transparent transition flex items-center gap-1 text-xs sm:text-sm">
          <LogOut size={16} /> Salir
        </button>
      </div>
    </div>
  );
}
