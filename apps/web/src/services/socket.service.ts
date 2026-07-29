type EventHandler = (...args: unknown[]) => void;

const listeners: Record<string, EventHandler[]> = {};

export function getSocket() {
  return {
    on(event: string, handler: EventHandler) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    },
    off(event: string, handler?: EventHandler) {
      if (!listeners[event]) return;
      if (handler) {
        listeners[event] = listeners[event].filter((h) => h !== handler);
      } else {
        delete listeners[event];
      }
    },
    emit(event: string, data?: unknown) {
      (listeners[event] || []).forEach((h) => h(data));
    },
    disconnect() {
      Object.keys(listeners).forEach((key) => delete listeners[key]);
    },
  };
}

export function disconnectSocket() {}
