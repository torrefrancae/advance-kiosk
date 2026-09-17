import { useEffect, useRef } from 'react';
import { DEMO_ITEMS, openDemoChannel, type DemoChannelMessage } from '@src/lib/demoChannel';
import type { Order } from '@src/lib/api';

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
  const runRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const channel = openDemoChannel();
    let cancelled = false;

    const onMessage = (event: MessageEvent<DemoChannelMessage>) => {
      const data = event.data;
      if (!data || typeof data !== 'object' || !('type' in data)) return;

      if (data.type === 'beejoy-demo-begin') {
        if (runRef.current === data.runId) {
          channel.postMessage({ type: 'beejoy-demo-ack', runId: data.runId } satisfies DemoChannelMessage);
          return;
        }

        runRef.current = data.runId;
        channel.postMessage({ type: 'beejoy-demo-ack', runId: data.runId } satisfies DemoChannelMessage);

        void (async () => {
          setError(null);
          setPlaced(null);
          setName('Demo Guest');
          setCart({});
          setBusy(true);

          try {
            for (const item of DEMO_ITEMS) {
              if (cancelled || runRef.current !== data.runId) return;
              await wait(380);
              setCart((prev) => ({ ...prev, [item.id]: item.qty }));
            }
          } finally {
            if (!cancelled && runRef.current === data.runId) setBusy(false);
          }
        })();
        return;
      }

      if (data.type === 'beejoy-demo-placed' && data.runId === runRef.current) {
        setCart({});
        setBusy(false);
        setPlaced(data.order as Order);
        setError(null);
      }

      if (data.type === 'beejoy-demo-error' && data.runId === runRef.current) {
        setBusy(false);
        setError(data.error);
      }
    };

    channel.addEventListener('message', onMessage);
    return () => {
      cancelled = true;
      channel.removeEventListener('message', onMessage);
      channel.close();
    };
  }, [enabled, setBusy, setCart, setError, setName, setPlaced]);
}
