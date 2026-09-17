import { Link } from 'react-router-dom';
import { useEmbedMode } from '@src/hooks/useEmbedMode';
import { useLiveOrders } from '@src/hooks/useLiveOrders';
import type { Order, OrderStatus } from '@src/lib/api';
import '@src/styles/status.css';

const COLUMNS: { key: OrderStatus; title: string; hint: string }[] = [
  { key: 'queued', title: 'Pay Counter', hint: 'Awaiting payment' },
  { key: 'paid', title: 'In Kitchen', hint: 'Paid, waiting cook' },
  { key: 'preparing', title: 'Cooking', hint: 'Cooking started' },
  { key: 'ready', title: 'Ready', hint: 'Please pick up' },
];

function Column({ title, hint, orders }: { title: string; hint: string; orders: Order[] }) {
  return (
    <section className="status-col screen-card rise">
      <header>
        <h2 className="brand-mark">{title}</h2>
        <p>{hint}</p>
      </header>
      <div className="status-list">
        {orders.length === 0 ? <p className="muted">None right now</p> : null}
        {orders.map((order) => (
          <article key={order.id} className={`status-chip ${order.status === 'ready' || order.status === 'preparing' ? 'pulse' : ''}`}>
            <strong className="brand-mark">{order.code}</strong>
            <span>{order.customer_name}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function StatusScreen() {
  const embed = useEmbedMode();
  const { orders, connected } = useLiveOrders();

  return (
    <div className={`app-shell status-shell${embed ? ' is-embed' : ''}`}>
      <header className="status-top rise">
        <div>
          {embed ? null : (
            <Link to=".." className="kiosk-back">
              All screens
            </Link>
          )}
          <h1 className="brand-mark">Now Serving</h1>
          {embed ? null : <p>Lobby board updates as cashier and cook move each ticket.</p>}
        </div>
        <span className={`pill ${connected ? 'live' : 'idle'}`}>{connected ? 'Live' : 'Syncing'}</span>
      </header>
      <div className="status-board status-board-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.key}
            title={col.title}
            hint={col.hint}
            orders={orders.filter((order) => order.status === col.key)}
          />
        ))}
      </div>
    </div>
  );
}
