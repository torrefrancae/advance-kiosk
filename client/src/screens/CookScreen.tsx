import { Link } from 'react-router-dom';
import { useEmbedMode } from '@src/hooks/useEmbedMode';
import { useLiveOrders } from '@src/hooks/useLiveOrders';
import { pesos, statusLabel, updateOrderStatus, type Order } from '@src/lib/api';
import '@src/styles/staff.css';

export default function CookScreen() {
  const embed = useEmbedMode();
  const { orders, connected, error, setOrders } = useLiveOrders();
  const waiting = orders.filter((o) => o.status === 'paid');
  const cooking = orders.filter((o) => o.status === 'preparing');

  const act = async (order: Order, status: 'preparing' | 'ready') => {
    const updated = await updateOrderStatus(order.id, status);
    setOrders((prev) => prev.map((row) => (row.id === updated.id ? updated : row)));
  };

  return (
    <div className={`app-shell staff-shell${embed ? ' is-embed' : ''}`}>
      <header className="staff-top rise">
        <div>
          {embed ? null : (
            <Link to=".." className="kiosk-back">
              All screens
            </Link>
          )}
          <h1 className="brand-mark">Cook Station</h1>
          {embed ? null : <p>See paid tickets, start cooking, then mark each order ready.</p>}
        </div>
        <span className={`pill ${connected ? 'live' : 'idle'}`}>{connected ? 'Live sync on' : 'Reconnecting'}</span>
      </header>

      {error ? <p className="err rise">{error}</p> : null}

      <div className="staff-columns">
        <section className="staff-col">
          <h2 className="brand-mark">Paid - start cooking</h2>
          <div className="staff-grid">
            {waiting.length === 0 ? (
              <div className="screen-card staff-empty rise">No paid tickets waiting.</div>
            ) : null}
            {waiting.map((order, index) => (
              <article key={order.id} className="screen-card staff-ticket rise status-paid" style={{ animationDelay: `${index * 0.04}s` }}>
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
                <button type="button" className="btn btn-primary" onClick={() => void act(order, 'preparing')}>
                  Start cooking
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="staff-col">
          <h2 className="brand-mark">Cooking now</h2>
          <div className="staff-grid">
            {cooking.length === 0 ? (
              <div className="screen-card staff-empty rise">Nothing on the grill yet.</div>
            ) : null}
            {cooking.map((order, index) => (
              <article key={order.id} className="screen-card staff-ticket rise status-preparing" style={{ animationDelay: `${index * 0.04}s` }}>
                <div className="staff-ticket-head">
                  <strong className="brand-mark">{order.code}</strong>
                  <span className="pill live pulse">Cooking</span>
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
                <button type="button" className="btn btn-danger" onClick={() => void act(order, 'ready')}>
                  Mark ready
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
