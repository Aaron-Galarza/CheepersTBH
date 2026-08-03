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

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = dayKeys[now.getDay()];
  const todaySchedule = config.dailySchedule?.find((d) => d.day === today);

  let isClosedBySchedule = true;
  if (todaySchedule?.isStoreOpen) {
    const [oh, om] = todaySchedule.openTime.split(':').map(Number);
    const [ch, cm] = todaySchedule.closeTime.split(':').map(Number);
    const openMin = oh * 60 + om;
    let closeMin = ch * 60 + cm;
    if (closeMin <= openMin) closeMin += 24 * 60;
    isClosedBySchedule = currentMinutes < openMin || currentMinutes > closeMin;
  }
  const isClosed = !config.isOpen || config.isEmergencyClosed || isClosedBySchedule;

  return isClosed ? (
    <div className="mx-auto max-w-[400px] rounded-full bg-red-50 px-6 py-2.5 text-center text-sm font-semibold border border-red-200 shadow-sm">
      <span className="flex items-center justify-center gap-2">
        <XCircle size={16} className="text-red-600" />
        <span className="text-red-700">
          Negocio cerrado{config.emergencyMessage ? ` - ${config.emergencyMessage}` : ''}
        </span>
      </span>
    </div>
  ) : (
    <div className="mx-auto max-w-[400px] rounded-full bg-green-50 px-6 py-2.5 text-center text-sm font-semibold border border-green-200 shadow-sm">
      <span className="flex items-center justify-center gap-2">
        <CheckCircle size={16} className="text-green-600" />
        <span className="text-green-700">Abierto - Pedi ahora</span>
      </span>
    </div>
  );
}
