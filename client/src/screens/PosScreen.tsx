import { Link } from 'react-router-dom';
import { useLiveOrders } from '@src/hooks/useLiveOrders';
import { pesos, updateOrderStatus, type Order, type OrderStatus } from '@src/lib/api';
import '@src/styles/pos.css';

const FLOW: OrderStatus[] = ['queued', 'preparing', 'ready', 'completed'];

function nextStatus(status: OrderStatus): OrderStatus | null {
  const idx = FLOW.indexOf(status);
  if (idx < 0 || idx >= FLOW.length - 1) return null;
  return FLOW[idx + 1];
}

export default function PosScreen() {
  const { orders, connected, error, setOrders } = useLiveOrders();

  const act = async (order: Order, status: OrderStatus) => {
    const updated = await updateOrderStatus(order.id, status);
    setOrders((prev) => {
      if (updated.status === 'completed') return prev.filter((row) => row.id !== updated.id);
      return prev.map((row) => (row.id === updated.id ? updated : row));
    });
  };

  return (
    <div className="app-shell pos-shell">
      <header className="pos-top rise">
        <div>
          <Link to=".." className="kiosk-back">
            All screens
          </Link>
          <h1 className="brand-mark">BeeJoy POS</h1>
          <p>Realtime tickets from the kiosk. Checkout by order id when paid and picked up.</p>
        </div>
        <span className={`pill ${connected ? 'live' : 'idle'}`}>{connected ? 'Live sync on' : 'Reconnecting'}</span>
      </header>

      {error ? <p className="err rise">{error}</p> : null}

      <div className="pos-grid">
        {orders.length === 0 ? (
          <div className="screen-card pos-empty rise">
            <h2 className="brand-mark">Waiting for kiosk orders</h2>
            <p>Open the kiosk screen on another tab and place a tray.</p>
          </div>
        ) : null}
        {orders.map((order, index) => {
          const nxt = nextStatus(order.status);
          return (
            <article key={order.id} className={`screen-card pos-ticket rise status-${order.status}`} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="pos-ticket-head">
                <strong className="brand-mark">{order.code}</strong>
                <span className="pill idle">{order.status}</span>
              </div>
              <p className="pos-name">{order.customer_name}</p>
              <ul>
                {order.items.map((line) => (
                  <li key={`${order.id}-${line.id}`}>
                    {line.qty} x {line.name}
                  </li>
                ))}
              </ul>
              <div className="pos-total">{pesos(order.total_cents)}</div>
              <div className="pos-actions">
                {nxt && nxt !== 'completed' ? (
                  <button type="button" className="btn btn-primary" onClick={() => void act(order, nxt)}>
                    Mark {nxt}
                  </button>
                ) : null}
                {order.status === 'ready' || order.status === 'preparing' || order.status === 'queued' ? (
                  <button type="button" className="btn btn-danger" onClick={() => void act(order, 'completed')}>
                    Checkout {order.code}
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
