import { useEffect, useRef, useState } from 'react';
import { fetchOrders, type Order } from '@src/lib/api';

export function useLiveOrders(pollMs = 1200) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tick = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const poll = async () => {
      try {
        const next = await fetchOrders(true);
        if (cancelled) return;
        setOrders(next);
        setConnected(true);
        setError(null);
        tick.current += 1;
      } catch (err) {
        if (!cancelled) {
          setConnected(false);
          setError(err instanceof Error ? err.message : 'Live sync failed');
        }
      }
    };

    void poll();
    timer = window.setInterval(() => void poll(), pollMs);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, [pollMs]);

  return { orders, connected, error, setOrders };
}
