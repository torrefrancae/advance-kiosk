import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemoKioskDrive } from '@src/hooks/useDemoKioskDrive';
import { useEmbedMode } from '@src/hooks/useEmbedMode';
import { createOrder, fetchMenu, pesos, type MenuItem, type Order } from '@src/lib/api';
import '@src/styles/kiosk.css';

type Cart = Record<string, number>;

export default function KioskScreen() {
  const embed = useEmbedMode();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Cart>({});
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('All');

  useDemoKioskDrive({
    enabled: embed,
    setName,
    setCart,
    setBusy,
    setPlaced,
    setError,
  });

  useEffect(() => {
    void fetchMenu()
      .then(setMenu)
      .catch((err) => setError(err instanceof Error ? err.message : 'Menu failed'));
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(menu.map((m) => m.category)))], [menu]);
  const visible = menu.filter((m) => category === 'All' || m.category === category);
  const lines = menu
    .filter((m) => (cart[m.id] || 0) > 0)
    .map((m) => ({ item: m, qty: cart[m.id] }));
  const total = lines.reduce((sum, row) => sum + Number(row.item.price_cents) * row.qty, 0);

  const bump = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] || 0) + delta;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const place = async () => {
    if (!lines.length || busy) return;
    setBusy(true);
    setError(null);
    try {
      const order = await createOrder({
        customer_name: name.trim() || 'Guest',
        items: lines.map((row) => ({ id: row.item.id, qty: row.qty })),
        source: 'kiosk',
      });
      setPlaced(order);
      setCart({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`app-shell kiosk-shell${embed ? ' is-embed' : ''}`}>
      <header className="kiosk-top rise">
        <div>
          {embed ? null : (
            <Link to=".." className="kiosk-back">
              All screens
            </Link>
          )}
          <h1 className="brand-mark">BeeJoy Kiosk</h1>
          {embed ? null : <p>Tap to order. Pay at Cashier, then watch Cook and the status board.</p>}
        </div>
        <label className="kiosk-name">
          Name on order
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest" />
        </label>
      </header>

      <div className="kiosk-cats rise">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`btn ${category === cat ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="kiosk-layout">
        <section className="kiosk-menu">
          {visible.map((item, index) => (
            <article
              key={item.id}
              className="menu-tile rise"
              style={{ animationDelay: `${index * 0.04}s`, borderColor: item.color }}
            >
              <img className="menu-photo" src={item.image} alt={item.name} loading="lazy" />
              <div className="menu-copy">
                <h2>{item.name}</h2>
                <p>{item.tag}</p>
                <strong>{pesos(item.price_cents)}</strong>
              </div>
              <div className="menu-actions">
                <button type="button" className="btn btn-ghost" onClick={() => bump(item.id, -1)}>
                  -
                </button>
                <span>{cart[item.id] || 0}</span>
                <button type="button" className="btn btn-primary" onClick={() => bump(item.id, 1)}>
                  +
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="screen-card kiosk-cart rise">
          <h2 className="brand-mark">Your tray</h2>
          {lines.length === 0 && !placed ? <p className="muted">Add something delicious.</p> : null}
          <ul>
            {lines.map((row) => (
              <li key={row.item.id}>
                <span>
                  {row.qty} x {row.item.name}
                </span>
                <strong>{pesos(row.item.price_cents * row.qty)}</strong>
              </li>
            ))}
          </ul>
          {lines.length > 0 ? (
            <div className="kiosk-total">
              <span>Total</span>
              <strong>{pesos(total)}</strong>
            </div>
          ) : null}
          {error ? <p className="err">{error}</p> : null}
          <button type="button" className="btn btn-danger" disabled={!lines.length || busy} onClick={() => void place()}>
            {busy ? 'Sending...' : 'Place order'}
          </button>
          {placed ? (
            <div className="placed pulse">
              <p>Order placed</p>
              <strong className="brand-mark">{placed.code}</strong>
              <span className="placed-total">{pesos(placed.total_cents)}</span>
              <ul className="placed-lines">
                {placed.items.map((line) => (
                  <li key={`${placed.id}-${line.id}`}>
                    {line.qty} x {line.name}
                  </li>
                ))}
              </ul>
              <span>Open Cashier to take payment for this ticket.</span>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
