import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { pesos, updateOrderStatus, type Order } from '@src/lib/api';
import '@src/styles/demo.css';

const BASE = '/sample/advance-kiosk';

const FRAMES = [
  { key: 'kiosk', title: '1. Kiosk', href: `${BASE}/kiosk?embed=1`, stepKeys: [0] },
  { key: 'cashier', title: '2. Cashier', href: `${BASE}/cashier?embed=1`, stepKeys: [1, 4] },
  { key: 'cook', title: '3. Cook', href: `${BASE}/cook?embed=1`, stepKeys: [2] },
  { key: 'status', title: '4. Status', href: `${BASE}/status?embed=1`, stepKeys: [3] },
] as const;

const STEPS = [
  'Customer taps items on the kiosk and places the order',
  'Cashier takes payment - ticket moves to cook queue',
  'Cook starts cooking',
  'Cook marks ready - status board updates',
  'Cashier hands order to guest',
] as const;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function requestKioskOrder(frame: HTMLIFrameElement | null) {
  return new Promise<Order>((resolve, reject) => {
    const target = frame?.contentWindow;
    if (!target) {
      reject(new Error('Kiosk panel is not ready yet'));
      return;
    }

    const timeout = window.setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('Kiosk demo timed out'));
    }, 20000);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'beejoy-demo-order') return;
      window.clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
      if (typeof event.data.error === 'string') {
        reject(new Error(event.data.error));
        return;
      }
      resolve(event.data.order as Order);
    };

    window.addEventListener('message', onMessage);
    target.postMessage({ type: 'beejoy-demo-place' }, window.location.origin);
  });
}

export default function DemoScreen() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState('Press Start demo to run the full flow across all four screens.');
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef(false);
  const kioskRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    return () => {
      stopRef.current = true;
    };
  }, []);

  const run = async () => {
    if (running) return;
    stopRef.current = false;
    setRunning(true);
    setError(null);
    setOrder(null);
    setStep(0);
    setMessage(STEPS[0]);

    try {
      const created = await requestKioskOrder(kioskRef.current);
      if (stopRef.current) return;
      setOrder(created);
      setMessage(`${STEPS[0]} - ${created.code} (${pesos(created.total_cents)})`);
      await wait(1800);

      setStep(1);
      setMessage(STEPS[1]);
      let current = await updateOrderStatus(created.id, 'paid');
      setOrder(current);
      await wait(2200);

      setStep(2);
      setMessage(STEPS[2]);
      current = await updateOrderStatus(created.id, 'preparing');
      setOrder(current);
      await wait(2200);

      setStep(3);
      setMessage(STEPS[3]);
      current = await updateOrderStatus(created.id, 'ready');
      setOrder(current);
      await wait(2200);

      setStep(4);
      setMessage(STEPS[4]);
      current = await updateOrderStatus(created.id, 'completed');
      setOrder(current);
      setMessage(`Done. ${current.code} completed. Watch the four panels update live.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="demo-wall">
      <header className="demo-wall-top">
        <div className="demo-wall-copy">
          <Link to=".." className="kiosk-back">
            All screens
          </Link>
          <h1 className="brand-mark">Control Room Demo</h1>
          <p>{message}</p>
          {order ? (
            <p className="demo-wall-ticket">
              Ticket <strong>{order.code}</strong> - {order.status} - {pesos(order.total_cents)}
            </p>
          ) : null}
          {error ? <p className="err">{error}</p> : null}
        </div>
        <button type="button" className="btn btn-primary demo-start" disabled={running} onClick={() => void run()}>
          {running ? 'Running demo...' : 'Start demo'}
        </button>
      </header>

      <div className="demo-frames" role="group" aria-label="Live kiosk screens">
        {FRAMES.map((frame) => {
          const active = (frame.stepKeys as readonly number[]).includes(step);
          return (
            <section key={frame.key} className={`demo-frame ${active ? 'is-active' : ''}`}>
              <header className="demo-frame-label">
                <span>{frame.title}</span>
                {active ? <span className="demo-live-pill">Active</span> : null}
              </header>
              <iframe
                ref={frame.key === 'kiosk' ? kioskRef : undefined}
                title={frame.title}
                src={frame.href}
                loading="eager"
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
