import { Order } from '@/types';
import { analyticsService } from '@/services/analytics.service';
import * as XLSX from 'xlsx';

export async function exportVentas(orders: Order[], range: string, customFrom?: string, customTo?: string) {
  const stats = await analyticsService.getStats(range as any, customFrom, customTo);
  const grouped = stats.products || [];
  const wb = XLSX.utils.book_new();

  const orderData = orders.flatMap((o) => {
    const d = new Date(o.createdAt!);
    return o.items.map((item) => ({
      Fecha: d.toLocaleDateString('es-AR'),
      Hora: d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      Cliente: o.customer.name,
      Producto: item.title,
      Adicionales: (item.additionals || []).map((a) => a.name).join(', ') || '-',
      Cantidad: item.quantity,
      Pago: o.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia',
      Subtotal: item.price * item.quantity,
      Total: o.total,
    }));
  });

  const ws1 = XLSX.utils.json_to_sheet(orderData);
  ws1['!cols'] = [{ wch: 12 }, { wch: 8 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Pedidos');

  const ws2 = XLSX.utils.json_to_sheet(grouped.map((p: any) => ({ Producto: p.title, Cantidad: p.qty, Total: p.revenue })));
  ws2['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Agrupado');

  XLSX.writeFile(wb, `ventas_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
