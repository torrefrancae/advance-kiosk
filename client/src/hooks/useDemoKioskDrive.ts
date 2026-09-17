import { useEffect } from 'react';
import { createOrder, type Order } from '@src/lib/api';

const DEMO_ITEMS = [
  { id: 'chicken-joy-meal', qty: 1 },
  { id: 'peach-mango-pie', qty: 1 },
  { id: 'float', qty: 1 },
] as const;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

type CartSetter = (value: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;

interface Options {
  enabled: boolean;
  setName: (value: string) => void;
  setCart: CartSetter;
  setBusy: (value: boolean) => void;
  setPlaced: (order: Order | null) => void;
  setError: (value: string | null) => void;
}

export function useDemoKioskDrive({ enabled, setName, setCart, setBusy, setPlaced, setError }: Options) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'beejoy-demo-place') return;

      void (async () => {
        setError(null);
        setPlaced(null);
        setName('Demo Guest');
        setCart({});
        setBusy(true);

        try {
          for (const item of DEMO_ITEMS) {
            if (cancelled) return;
            await wait(380);
            setCart((prev) => ({ ...prev, [item.id]: item.qty }));
          }
          if (cancelled) return;
          await wait(520);

          const order = await createOrder({
            customer_name: 'Demo Guest',
            items: DEMO_ITEMS.map((row) => ({ id: row.id, qty: row.qty })),
            source: 'demo',
          });
          if (cancelled) return;

          setCart({});
          setPlaced(order);
          window.parent.postMessage({ type: 'beejoy-demo-order', order }, window.location.origin);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Could not place order';
          setError(message);
          window.parent.postMessage({ type: 'beejoy-demo-order', error: message }, window.location.origin);
        } finally {
          if (!cancelled) setBusy(false);
        }
      })();
    };

    window.addEventListener('message', onMessage);
    return () => {
      cancelled = true;
      window.removeEventListener('message', onMessage);
    };
  }, [enabled, setBusy, setCart, setError, setName, setPlaced]);
}
