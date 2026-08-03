'use client';

import { useState } from 'react';
import { Ticket, Plus } from 'lucide-react';
import { couponsService } from '@/services/coupons.service';
import { Coupon } from '@/types';

interface CouponFormProps {
  onCouponAdded: (c: Coupon) => void;
}

export function CouponForm({ onCouponAdded }: CouponFormProps) {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const c = await couponsService.create({ code: code.toUpperCase(), discountPercent: discount, active: true });
      onCouponAdded(c);
      setCode('');
      setDiscount(10);
    } catch (err: any) { setError(err.message || 'Error'); }
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-bold mb-4 font-[var(--font-montserrat)] text-[#212121] flex items-center gap-2"><Plus size={18} /> Nuevo cupon</h2>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
      <div className="space-y-3">
        <input type="text" value={code} onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
          placeholder="DESCUENTO10" required disabled={loading} maxLength={20}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#D9383A] font-mono uppercase" />
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#212121]">Descuento (%)</label>
          <input type="number" min={1} max={100} value={discount} onChange={(e) => setDiscount(parseInt(e.target.value) || 1)}
            required disabled={loading} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#D9383A]" />
        </div>
      </div>
      <button type="submit" disabled={loading || !code}
        className="w-full mt-4 bg-[#D9383A] text-white py-2 rounded-lg font-bold hover:bg-[#b52d2f] disabled:bg-gray-400 transition flex items-center justify-center gap-2">
        <Ticket size={16} /> {loading ? 'Creando...' : 'Crear cupon'}
      </button>
    </form>
  );
}
