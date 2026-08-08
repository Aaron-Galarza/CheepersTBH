'use client';

import { useEffect, useState } from 'react';
import { fetchAnalyticsStats, fetchAnalyticsOrders } from '@/services/admin.service';
import { formatCurrency } from '@/utils/format';
import { exportVentas } from '@/utils/exportVentas';
import { CreditCard, Calendar, Download, Package } from 'lucide-react';
import { Order } from '@/types';

const PAGE_SIZE = 10;
const RANGES = ['today', 'yesterday', 'week', 'month', 'custom'] as const;
const RANGE_LABELS: Record<string, string> = { today: 'Hoy', yesterday: 'Ayer', week: 'Semana', month: 'Mes', custom: 'Personalizado' };

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [grouped, setGrouped] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('today');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [viewGrouped, setViewGrouped] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true); setShowAll(false);
    const f = viewGrouped
      ? fetchAnalyticsStats(range as any, customFrom || undefined, customTo || undefined).then((s) => setGrouped(s.products || []))
      : fetchAnalyticsOrders(range as any, paymentFilter, customFrom || undefined, customTo || undefined)
        .then(({ orders, total: t }) => { setOrders(orders); setTotal(t); });
    f.catch(() => {}).finally(() => setLoading(false));
  }, [range, paymentFilter, customFrom, customTo, viewGrouped]);

  const fmtDate = (d: any) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) + ' ' + dt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  const displayed = showAll ? orders : orders.slice(0, PAGE_SIZE);

  if (loading) return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"><p className="text-[#757575] text-sm">Cargando...</p></div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-base sm:text-lg font-bold font-[var(--font-montserrat)] text-[#212121] flex items-center gap-2"><CreditCard size={18} /> Pedidos Entregados</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={viewGrouped} onChange={(e) => setViewGrouped(e.target.checked)} className="w-4 h-4 accent-[#D9383A]" />
            <span className="text-xs font-medium text-[#757575] flex items-center gap-1"><Package size={14} /> Agrupado</span>
          </label>
          {orders.length > 0 && (
            <button onClick={() => exportVentas(orders, range, customFrom || undefined, customTo || undefined)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700"><Download size={14} /> Exportar</button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {RANGES.map((r) => (
          <button key={r} onClick={() => setRange(r)} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${range === r ? 'bg-[#D9383A] text-white' : 'bg-gray-100 text-[#757575] hover:bg-gray-200'}`}>{RANGE_LABELS[r]}</button>
        ))}
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 bg-white text-[#757575] focus:outline-none focus:border-[#D9383A]">
          <option value="">Todos los pagos</option><option value="cash">Efectivo</option><option value="transfer">Transferencia</option>
        </select>
        {viewGrouped && <span className="self-center text-xs text-[#757575]">Vista agrupada</span>}
      </div>

      {range === 'custom' && (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <Calendar size={14} className="text-[#757575]" /><input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="px-2 py-1 border rounded text-xs" /><span className="text-xs text-[#757575]">a</span><input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="px-2 py-1 border rounded text-xs" />
        </div>
      )}

      {viewGrouped ? (
        grouped.length === 0 ? <p className="text-[#757575] text-sm">Sin datos</p> : (
          <table className="w-full text-sm"><thead><tr className="border-b text-left text-[#757575] text-xs uppercase tracking-wider"><th className="py-2 font-medium">Producto</th><th className="py-2 text-right font-medium">Cantidad</th><th className="py-2 text-right font-medium">Total</th></tr></thead>
            <tbody>{grouped.map((p, i) => (<tr key={i} className="border-b border-gray-50"><td className="py-2 font-medium text-[#212121]">{p.title}</td><td className="py-2 text-right text-[#757575]">{p.qty}</td><td className="py-2 text-right font-bold text-[#D9383A]">{formatCurrency(p.revenue)}</td></tr>))}</tbody>
            <tfoot><tr className="border-t-2 border-gray-200"><td className="py-3 font-bold text-sm text-[#212121]">Total</td><td className="py-3 text-right font-bold text-[#212121]">{grouped.reduce((s, p) => s + p.qty, 0)}</td><td className="py-3 text-right font-bold text-base text-[#D9383A]">{formatCurrency(grouped.reduce((s, p) => s + p.revenue, 0))}</td></tr></tfoot>
          </table>
        )
      ) : orders.length === 0 ? <p className="text-[#757575] text-sm">Sin pedidos entregados</p> : (
        <>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-[#757575] text-xs uppercase tracking-wider"><th className="py-2 font-medium">Fecha/Hora</th><th className="py-2 font-medium">Pedido</th><th className="py-2 font-medium">Pago</th><th className="py-2 text-right font-medium">Subtotal</th></tr></thead>
            <tbody>
              {displayed.map((o) => (
                <tr key={o._id} className="border-b border-gray-50">
                  <td className="py-2 text-xs whitespace-nowrap text-[#757575]">{fmtDate(o.createdAt)}</td>
                  <td className="py-2">{o.items.map((item, i) => (<div key={i}><span className="font-medium text-[#212121]">{item.quantity}x {item.title}</span>{item.additionals?.map((a, j) => (<span key={j} className="text-xs text-[#757575] ml-2">+{a.name}</span>))}</div>))}</td>
                  <td className="py-2">
                    <span className="text-xs font-medium text-[#757575]">{o.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'}</span>
                    {o.discountPercent > 0 && (
                      <span className="text-[10px] text-green-600 font-medium ml-1">-{o.discountPercent}%</span>
                    )}
                  </td>
                  <td className="py-2 text-right font-semibold text-[#212121]">{formatCurrency(o.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr className="border-t-2 border-gray-200"><td colSpan={3} className="py-3 text-right font-bold text-sm text-[#212121]">Total</td><td className="py-3 text-right font-bold text-base text-[#212121]">{formatCurrency(total)}</td></tr></tfoot>
          </table>
          {orders.length > PAGE_SIZE && !showAll && (
            <button onClick={() => setShowAll(true)} className="mt-3 w-full py-2 text-sm font-medium text-[#D9383A] hover:text-[#b52d2f]">{`Ver mas (${orders.length - PAGE_SIZE} restantes)`}</button>
          )}
        </>
      )}
    </div>
  );
}
