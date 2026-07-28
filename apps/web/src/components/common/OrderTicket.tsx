import { formatCurrency, formatTime } from '@/utils/format';

interface OrderTicketProps {
  order: {
    _id?: string;
    customer: { name: string; phone: string };
    items: {
      title: string;
      price: number;
      quantity: number;
      additionals?: { name: string; price: number; quantity: number }[];
    }[];
    deliveryType: string;
    paymentMethod: string;
    subtotal: number;
    deliveryCost: number;
    discountPercent: number;
    total: number;
    createdAt?: Date | string;
  };
}

export function OrderTicket({ order }: OrderTicketProps) {
  return (
    <div className="mx-auto max-w-[280px] rounded-lg border border-[#e0e0e0] bg-white p-4 font-mono text-xs shadow-sm">
      <h2 className="mb-2 text-center text-base font-bold">CHEEPERS</h2>
      <p className="mb-2 text-center text-[11px]">The Burger House</p>
      <hr className="mb-2 border-[#e0e0e0]" />

      <div className="mb-1 flex justify-between">
        <span className="font-semibold">Pedido:</span>
        <span>#{order._id?.slice(-6) || '---'}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span className="font-semibold">Cliente:</span>
        <span>{order.customer.name}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span className="font-semibold">Tel:</span>
        <span>{order.customer.phone}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span className="font-semibold">Entrega:</span>
        <span>{order.deliveryType === 'delivery' ? 'Domicilio' : 'Retiro'}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span className="font-semibold">Pago:</span>
        <span>{order.paymentMethod}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span className="font-semibold">Fecha:</span>
        <span>{order.createdAt ? formatTime(order.createdAt) : ''}</span>
      </div>
      <hr className="my-2 border-[#e0e0e0]" />

      {order.items.map((item, i) => (
        <div key={i} className="mb-1">
          <div className="flex justify-between">
            <span>
              {item.quantity}x {item.title}
            </span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
          {item.additionals?.map((a, j) => (
            <div key={j} className="ml-4 flex justify-between text-[10px]">
              <span>+ {a.name}</span>
              <span>{formatCurrency(a.price)}</span>
            </div>
          ))}
        </div>
      ))}

      <hr className="my-2 border-[#e0e0e0]" />
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>{formatCurrency(order.subtotal)}</span>
      </div>
      {order.deliveryCost > 0 && (
        <div className="flex justify-between">
          <span>Envío:</span>
          <span>{formatCurrency(order.deliveryCost)}</span>
        </div>
      )}
      {order.discountPercent > 0 && (
        <div className="flex justify-between">
          <span>Descuento:</span>
          <span>{order.discountPercent}%</span>
        </div>
      )}
      <div className="mt-1 flex justify-between text-sm font-bold">
        <span>TOTAL:</span>
        <span>{formatCurrency(order.total)}</span>
      </div>
      <hr className="my-2 border-[#e0e0e0]" />
      <p className="text-center text-[10px] text-[#718096]">Gracias por tu compra</p>
    </div>
  );
}
