import { useEffect, useRef, useState } from 'react';
import { API_BASE, fetchOrders, type Order } from '@src/lib/api';

export function useLiveOrders(pollMs = 1500) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const apply = (next: Order[]) => {
      if (!cancelled) {
        setOrders(next);
        setConnected(true);
        setError(null);
      }
    };

    const poll = async () => {
      try {
        const next = await fetchOrders(true);
        apply(next);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Live sync failed');
      }
    };

    const startSse = () => {
      try {
        const es = new EventSource(`${API_BASE}/orders/stream`);
        esRef.current = es;
        es.addEventListener('orders', (evt) => {
          try {
            const payload = JSON.parse((evt as MessageEvent).data) as { orders: Order[] };
            apply(payload.orders || []);
          } catch {
            /* ignore bad frames */
          }
        });
        es.onerror = () => {
          es.close();
          esRef.current = null;
          if (!cancelled) {
            setConnected(false);
            void poll();
            timer = window.setInterval(() => void poll(), pollMs);
          }
        };
      } catch {
        void poll();
        timer = window.setInterval(() => void poll(), pollMs);
      }
    };

    void poll();
    startSse();

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      esRef.current?.close();
    };
  }, [pollMs]);

  return { orders, connected, error, setOrders };
}
