import { formatPrice, formatDistance, formatOrderNumber } from '@/utils/format';

export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    pending: 'Pendiente',
    'preparing': 'En preparación',
    ready: 'Listo',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  return map[status] || status;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'preparing': 'bg-blue-100 text-blue-800 border-blue-300',
    ready: 'bg-green-100 text-green-800 border-green-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };
  return map[status] || 'bg-gray-100 text-gray-800 border-gray-300';
}

export function formatShortId(id: string): string {
  return id.slice(-6).toUpperCase();
}

export { formatPrice, formatDistance, formatOrderNumber };
