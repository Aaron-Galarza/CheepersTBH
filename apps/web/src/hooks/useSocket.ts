'use client';

import { useEffect } from 'react';
import { getSocket } from '@/services/socket.service';

export function useSocket(event: string, handler: (...args: unknown[]) => void) {
  useEffect(() => {
    const socket = getSocket();
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
}

export function useSocketEmit(event: string, data?: unknown) {
  useEffect(() => {
    const socket = getSocket();
    if (data !== undefined) {
      socket.emit(event, data);
    }
  }, [event, data]);
}

export { getSocket };
