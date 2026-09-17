import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createOrder, pesos, updateOrderStatus, type Order } from '@src/lib/api';
import { DEMO_ITEMS, openDemoChannel, type DemoChannelMessage } from '@src/lib/demoChannel';
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

function waitForKioskAck(runId: string, timeoutMs = 12000) {
  return new Promise<void>((resolve, reject) => {
    const channel = openDemoChannel();
    const started = Date.now();

    const finish = (err?: Error) => {
      window.clearInterval(pulse);
      window.clearTimeout(timer);
      channel.removeEventListener('message', onMessage);
      channel.close();
      if (err) reject(err);
      else resolve();
    };

    const onMessage = (event: MessageEvent<DemoChannelMessage>) => {
      const data = event.data;
      if (data?.type === 'beejoy-demo-ack' && data.runId === runId) finish();
    };

    channel.addEventListener('message', onMessage);

    const pulse = window.setInterval(() => {
      channel.postMessage({ type: 'beejoy-demo-begin', runId } satisfies DemoChannelMessage);
      if (Date.now() - started > timeoutMs) {
        finish(new Error('Kiosk panel did not respond. Refresh and try again.'));
      }
    }, 350);

    channel.postMessage({ type: 'beejoy-demo-begin', runId } satisfies DemoChannelMessage);
    const timer = window.setTimeout(() => {
      finish(new Error('Kiosk panel did not respond. Refresh and try again.'));
    }, timeoutMs);
  });
}

export default function DemoScreen() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState('Press Start demo to run the full flow across all four screens.');
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = openDemoChannel();
    return () => {
      stopRef.current = true;
      channelRef.current?.close();
      channelRef.current = null;
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

    const runId = `run-${Date.now()}`;
    const channel = channelRef.current ?? openDemoChannel();

    try {
      await waitForKioskAck(runId);
      if (stopRef.current) return;

      await wait(1400);
      if (stopRef.current) return;

      const created = await createOrder({
        customer_name: 'Demo Guest',
        items: DEMO_ITEMS.map((row) => ({ id: row.id, qty: row.qty })),
        source: 'demo',
      });
      if (stopRef.current) return;

      channel.postMessage({
        type: 'beejoy-demo-placed',
        runId,
        order: created,
      } satisfies DemoChannelMessage);

      setOrder(created);
      setMessage(`${STEPS[0]} - ${created.code} (${pesos(created.total_cents)})`);
      await wait(1600);

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
      const text = err instanceof Error ? err.message : 'Demo failed';
      setError(text);
      channel.postMessage({ type: 'beejoy-demo-error', runId, error: text } satisfies DemoChannelMessage);
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
              <iframe title={frame.title} src={frame.href} loading="eager" />
            </section>
          );
        })}
      </div>
    </div>
  );
}
