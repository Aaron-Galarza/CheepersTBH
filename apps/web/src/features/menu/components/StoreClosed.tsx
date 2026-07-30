'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { menuService } from '@/services/menu.service';
import type { StoreConfig } from '@/types';

export function StoreStatus() {
  const [config, setConfig] = useState<StoreConfig | null>(null);

  useEffect(() => {
    menuService.getStoreStatus().then(setConfig).catch(() => {});
  }, []);

  if (!config) return null;

  const isOpen = config.isOpen;
  const isAvailable = config.deliveryAvailable;

  if (isOpen && isAvailable) {
    return (
      <div className="mx-auto max-w-[400px] rounded-full bg-green-50 px-6 py-2.5 text-center text-sm font-semibold border border-green-200 shadow-sm">
        <span className="flex items-center justify-center gap-2">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-green-700">Abierto - Pedí ahora</span>
        </span>
      </div>
    );
  }

  if (isOpen && !isAvailable) {
    return (
      <div className="mx-auto max-w-[400px] rounded-full bg-yellow-50 px-6 py-2.5 text-center text-sm font-semibold border border-yellow-200 shadow-sm">
        <span className="flex items-center justify-center gap-2">
          <AlertTriangle size={16} className="text-yellow-600" />
          <span className="text-yellow-700">Solo retiro en local</span>
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[400px] rounded-full bg-red-50 px-6 py-2.5 text-center text-sm font-semibold border border-red-200 shadow-sm">
      <span className="flex items-center justify-center gap-2">
        <XCircle size={16} className="text-red-600" />
        <span className="text-red-700">
          Cerrado{config.message ? ` - ${config.message}` : ''}
        </span>
      </span>
    </div>
  );
}
