import { Link } from 'react-router-dom';
import { useLiveOrders } from '@src/hooks/useLiveOrders';
import { pesos, statusLabel, updateOrderStatus, type Order } from '@src/lib/api';
import '@src/styles/staff.css';

export default function CashierScreen() {
  const { orders, connected, error, setOrders } = useLiveOrders();
  const awaitingPay = orders.filter((o) => o.status === 'queued');
  const readyPickup = orders.filter((o) => o.status === 'ready');

  const act = async (order: Order, status: 'paid' | 'completed') => {
    const updated = await updateOrderStatus(order.id, status);
    setOrders((prev) => {
      if (updated.status === 'completed') return prev.filter((row) => row.id !== updated.id);
      return prev.map((row) => (row.id === updated.id ? updated : row));
    });
  };

  return (
    <div className="app-shell staff-shell">
      <header className="staff-top rise">
        <div>
          <Link to=".." className="kiosk-back">
            All screens
          </Link>
          <h1 className="brand-mark">Cashier</h1>
          <p>Take payment for kiosk tickets, then hand ready orders to guests.</p>
        </div>
        <span className={`pill ${connected ? 'live' : 'idle'}`}>{connected ? 'Live sync on' : 'Reconnecting'}</span>
      </header>

      {error ? <p className="err rise">{error}</p> : null}

      <div className="staff-columns">
        <section className="staff-col">
          <h2 className="brand-mark">Awaiting payment</h2>
          <div className="staff-grid">
            {awaitingPay.length === 0 ? (
              <div className="screen-card staff-empty rise">No unpaid kiosk orders.</div>
            ) : null}
            {awaitingPay.map((order, index) => (
              <article key={order.id} className="screen-card staff-ticket rise status-queued" style={{ animationDelay: `${index * 0.04}s` }}>
                <div className="staff-ticket-head">
                  <strong className="brand-mark">{order.code}</strong>
                  <span className="pill idle">{statusLabel(order.status)}</span>
                </div>
                <p className="staff-name">{order.customer_name}</p>
                <ul>
                  {order.items.map((line) => (
                    <li key={`${order.id}-${line.id}`}>
                      {line.qty} x {line.name}
                    </li>
                  ))}
                </ul>
                <div className="staff-total">{pesos(order.total_cents)}</div>
                <button type="button" className="btn btn-primary" onClick={() => void act(order, 'paid')}>
                  Take payment
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="staff-col">
          <h2 className="brand-mark">Ready for handoff</h2>
          <div className="staff-grid">
            {readyPickup.length === 0 ? (
              <div className="screen-card staff-empty rise">Nothing ready yet.</div>
            ) : null}
            {readyPickup.map((order, index) => (
              <article key={order.id} className="screen-card staff-ticket rise status-ready" style={{ animationDelay: `${index * 0.04}s` }}>
                <div className="staff-ticket-head">
                  <strong className="brand-mark">{order.code}</strong>
                  <span className="pill live">Ready</span>
                </div>
                <p className="staff-name">{order.customer_name}</p>
                <ul>
                  {order.items.map((line) => (
                    <li key={`${order.id}-${line.id}`}>
                      {line.qty} x {line.name}
                    </li>
                  ))}
                </ul>
                <div className="staff-total">{pesos(order.total_cents)}</div>
                <button type="button" className="btn btn-danger" onClick={() => void act(order, 'completed')}>
                  Hand to guest
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
