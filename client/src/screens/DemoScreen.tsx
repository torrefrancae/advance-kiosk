import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createOrder, pesos, updateOrderStatus, type Order } from '@src/lib/api';
import '@src/styles/demo.css';

type Step = {
  title: string;
  detail: string;
  screen: string;
};

const STEPS: Step[] = [
  {
    title: '1. Customer kiosk',
    detail: 'Guest builds a tray and places an order. Ticket starts as awaiting payment.',
    screen: 'Kiosk',
  },
  {
    title: '2. Cashier payment',
    detail: 'Cashier can edit the tray, then takes payment. Ticket moves to the cook queue.',
    screen: 'Cashier',
  },
  {
    title: '3. Cook station',
    detail: 'Cook starts cooking, then marks the order ready for pickup.',
    screen: 'Cook',
  },
  {
    title: '4. Status board',
    detail: 'Lobby board shows Pay Counter, Kitchen, Cooking, and Ready live.',
    screen: 'Status',
  },
  {
    title: '5. Handoff',
    detail: 'Cashier hands the ready order to the guest and closes the ticket.',
    screen: 'Cashier',
  },
];

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function DemoScreen() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef(false);

  useEffect(() => {
    return () => {
      stopRef.current = true;
    };
  }, []);

  const push = (line: string) => setLog((prev) => [...prev.slice(-8), line]);

  const run = async () => {
    if (running) return;
    stopRef.current = false;
    setRunning(true);
    setError(null);
    setLog([]);
    setOrder(null);
    setStep(0);

    try {
      push('Creating a demo tray on the kiosk...');
      const created = await createOrder({
        customer_name: 'Demo Guest',
        items: [
          { id: 'chicken-joy-meal', qty: 1 },
          { id: 'float', qty: 1 },
        ],
        source: 'demo',
      });
      if (stopRef.current) return;
      setOrder(created);
      push(`Kiosk placed ${created.code} for ${pesos(created.total_cents)}`);
      setStep(0);
      await wait(1600);

      setStep(1);
      push('Cashier takes payment...');
      let current = await updateOrderStatus(created.id, 'paid');
      setOrder(current);
      push(`${current.code} is paid and waiting for cook`);
      await wait(1600);

      setStep(2);
      push('Cook starts cooking...');
      current = await updateOrderStatus(created.id, 'preparing');
      setOrder(current);
      push(`${current.code} cooking started`);
      await wait(1600);

      push('Cook marks ready...');
      current = await updateOrderStatus(created.id, 'ready');
      setOrder(current);
      setStep(3);
      push(`${current.code} is ready on the lobby board`);
      await wait(1600);

      setStep(4);
      push('Cashier hands order to guest...');
      current = await updateOrderStatus(created.id, 'completed');
      setOrder(current);
      push(`Done. ${current.code} completed.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="app-shell demo-shell">
      <header className="demo-top rise">
        <div>
          <Link to=".." className="kiosk-back">
            All screens
          </Link>
          <h1 className="brand-mark">Live Demo</h1>
          <p>Watch one ticket move from kiosk to cashier to cook to ready to handoff.</p>
        </div>
        <button type="button" className="btn btn-primary" disabled={running} onClick={() => void run()}>
          {running ? 'Running demo...' : 'Start demo'}
        </button>
      </header>

      {error ? <p className="err rise">{error}</p> : null}

      <div className="demo-grid">
        <section className="screen-card demo-steps rise">
          {STEPS.map((item, index) => (
            <article key={item.title} className={`demo-step ${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`}>
              <span className="demo-screen">{item.screen}</span>
              <h2>{item.title}</h2>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <aside className="screen-card demo-panel rise">
          <h2 className="brand-mark">Ticket snapshot</h2>
          {order ? (
            <>
              <strong className="demo-code">{order.code}</strong>
              <p>{order.customer_name}</p>
              <p className="demo-status">{order.status}</p>
              <ul>
                {order.items.map((line) => (
                  <li key={`${order.id}-${line.id}`}>
                    {line.qty} x {line.name}
                  </li>
                ))}
              </ul>
              <div className="staff-total">{pesos(order.total_cents)}</div>
            </>
          ) : (
            <p className="muted">Press Start demo to place a sample order and walk the full flow.</p>
          )}
          <div className="demo-log">
            {log.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="demo-links">
            <Link to="/kiosk">Open kiosk</Link>
            <Link to="/cashier">Open cashier</Link>
            <Link to="/cook">Open cook</Link>
            <Link to="/status">Open status</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
