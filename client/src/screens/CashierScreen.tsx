import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveOrders } from '@src/hooks/useLiveOrders';
import {
  fetchMenu,
  pesos,
  statusLabel,
  updateOrder,
  updateOrderStatus,
  type MenuItem,
  type Order,
} from '@src/lib/api';
import '@src/styles/staff.css';

type Cart = Record<string, number>;

function cartFromOrder(order: Order): Cart {
  const next: Cart = {};
  order.items.forEach((line) => {
    next[line.id] = line.qty;
  });
  return next;
}

export default function CashierScreen() {
  const { orders, connected, error, setOrders } = useLiveOrders();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<Order | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftCart, setDraftCart] = useState<Cart>({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const awaitingPay = orders.filter((o) => o.status === 'queued');
  const readyPickup = orders.filter((o) => o.status === 'ready');

  useEffect(() => {
    void fetchMenu().then(setMenu).catch(() => undefined);
  }, []);

  const draftLines = useMemo(
    () =>
      menu
        .filter((m) => (draftCart[m.id] || 0) > 0)
        .map((m) => ({ item: m, qty: draftCart[m.id] })),
    [menu, draftCart]
  );
  const draftTotal = draftLines.reduce((sum, row) => sum + row.item.price_cents * row.qty, 0);

  const act = async (order: Order, status: 'paid' | 'completed') => {
    const updated = await updateOrderStatus(order.id, status);
    setOrders((prev) => {
      if (updated.status === 'completed') return prev.filter((row) => row.id !== updated.id);
      return prev.map((row) => (row.id === updated.id ? updated : row));
    });
  };

  const openEdit = (order: Order) => {
    setEditing(order);
    setDraftName(order.customer_name);
    setDraftCart(cartFromOrder(order));
    setEditError(null);
  };

  const bump = (id: string, delta: number) => {
    setDraftCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] || 0) + delta;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const saveEdit = async () => {
    if (!editing || !draftLines.length || saving) return;
    setSaving(true);
    setEditError(null);
    try {
      const updated = await updateOrder(editing.id, {
        customer_name: draftName.trim() || 'Guest',
        items: draftLines.map((row) => ({ id: row.item.id, qty: row.qty })),
      });
      setOrders((prev) => prev.map((row) => (row.id === updated.id ? updated : row)));
      setEditing(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Could not save order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell staff-shell">
      <header className="staff-top rise">
        <div>
          <Link to=".." className="kiosk-back">
            All screens
          </Link>
          <h1 className="brand-mark">Cashier</h1>
          <p>Edit unpaid tickets like the kiosk, take payment, then hand ready orders to guests.</p>
        </div>
        <span className={`pill ${connected ? 'live' : 'idle'}`}>{connected ? 'Live sync on' : 'Reconnecting'}</span>
      </header>

      {error ? <p className="err rise">{error}</p> : null}

      <div className="staff-columns">
        <section className="staff-col">
          <h2 className="brand-mark">Awaiting payment ({awaitingPay.length})</h2>
          <div className="staff-grid">
            {awaitingPay.length === 0 ? (
              <div className="screen-card staff-empty rise">No unpaid kiosk orders. Place one on the kiosk.</div>
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
                <div className="staff-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => openEdit(order)}>
                    Edit order
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => void act(order, 'paid')}>
                    Take payment
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="staff-col">
          <h2 className="brand-mark">Ready for handoff ({readyPickup.length})</h2>
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

      {editing ? (
        <div className="edit-overlay" role="dialog" aria-label="Edit order">
          <div className="edit-panel screen-card">
            <header className="edit-head">
              <div>
                <h2 className="brand-mark">Edit {editing.code}</h2>
                <p>Same tray controls as the self-service kiosk.</p>
              </div>
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
                Close
              </button>
            </header>
            <label className="edit-name">
              Name on order
              <input value={draftName} onChange={(e) => setDraftName(e.target.value)} />
            </label>
            <div className="edit-menu">
              {menu.map((item) => (
                <article key={item.id} className="edit-tile">
                  {item.image ? <img src={item.image} alt="" /> : null}
                  <div>
                    <strong>{item.name}</strong>
                    <p>{pesos(item.price_cents)}</p>
                  </div>
                  <div className="menu-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => bump(item.id, -1)}>
                      -
                    </button>
                    <span>{draftCart[item.id] || 0}</span>
                    <button type="button" className="btn btn-primary" onClick={() => bump(item.id, 1)}>
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="kiosk-total">
              <span>Total</span>
              <strong>{pesos(draftTotal)}</strong>
            </div>
            {editError ? <p className="err">{editError}</p> : null}
            <button type="button" className="btn btn-danger" disabled={!draftLines.length || saving} onClick={() => void saveEdit()}>
              {saving ? 'Saving...' : 'Save order'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
