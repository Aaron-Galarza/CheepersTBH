'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket-client';
import io from 'socket.io-client';

export function useSocket(event: string, handler: (...args: unknown[]) => void) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.on(event, handler as any);
    return () => { socket.off(event, handler as any); };
  }, [event, handler]);
}

export function useSocketEmit(event: string, data?: unknown) {
  useEffect(() => {
    const socket = getSocket();
    if (socket && data !== undefined) socket.emit(event, data);
  }, [event, data]);
}

export { getSocket };
