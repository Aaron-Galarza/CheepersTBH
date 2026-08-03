'use client';

import Link from 'next/link';
import { LayoutDashboard, Package, ChefHat, DollarSign } from 'lucide-react';

const cards = [
  { label: 'Ordenes hoy', value: '0', color: 'text-[#D9383A]', href: null },
  { label: 'Ventas totales', value: '$0', color: 'text-green-600', href: null },
  { label: 'Ticket promedio', value: '$0', color: 'text-blue-600', href: null },
  { href: '/admin/pedidos', label: 'Pedidos', value: null, Icon: Package, color: 'text-[#D9383A]' },
  { href: '/admin/cocina', label: 'Cocina', value: null, Icon: ChefHat, color: 'text-orange-600' },
  { href: '/admin/ventas', label: 'Ventas', value: null, Icon: DollarSign, color: 'text-green-600' },
];

export default function AdminDashboardPage() {
  return (
    <div className="cart-bg min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#212121] font-[var(--font-montserrat)] flex items-center gap-2 px-2 sm:px-0">
          <LayoutDashboard size={22} className="sm:size-[28px]" /> Dashboard
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 px-2 sm:px-0">
          {cards.map((c, i) => {
            const inner = (
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md h-full flex flex-col justify-between">
                <p className="text-[#757575] text-xs sm:text-sm mb-1 sm:mb-2">{c.label}</p>
                {c.value !== null ? (
                  <p className={`text-xl sm:text-3xl font-bold ${c.color}`}>{c.value}</p>
                ) : c.Icon ? (
                  <c.Icon size={28} className={`sm:size-[36px] ${c.color}`} />
                ) : null}
              </div>
            );
            return c.href ? <Link key={c.href} href={c.href}>{inner}</Link> : <div key={c.label}>{inner}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
