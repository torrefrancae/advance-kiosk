import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemoKioskDrive } from '@src/hooks/useDemoKioskDrive';
import { useEmbedMode } from '@src/hooks/useEmbedMode';
import { categoryCopy } from '@src/lib/categoryCopy';
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
  const [category, setCategory] = useState('');

  useDemoKioskDrive({
    enabled: true,
    setName,
    setCart,
    setBusy,
    setPlaced,
    setError,
  });

  useEffect(() => {
    void fetchMenu()
      .then((items) => {
        setMenu(items);
        setCategory((prev) => prev || items[0]?.category || '');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Menu failed'));
  }, []);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: { name: string; thumb: string; color: string; count: number }[] = [];
    menu.forEach((item) => {
      if (!seen.has(item.category)) {
        seen.add(item.category);
        list.push({
          name: item.category,
          thumb: item.image || '',
          color: item.color,
          count: menu.filter((row) => row.category === item.category).length,
        });
      }
    });
    return list;
  }, [menu]);

  const visible = menu.filter((m) => m.category === category);
  const lines = menu
    .filter((m) => (cart[m.id] || 0) > 0)
    .map((m) => ({ item: m, qty: cart[m.id] }));
  const total = lines.reduce((sum, row) => sum + Number(row.item.price_cents) * row.qty, 0);
  const trayCount = lines.reduce((sum, row) => sum + row.qty, 0);

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
          {embed ? null : <p>Pick a category on the left, then add items to your tray.</p>}
        </div>
        <label className="kiosk-name">
          Name on order
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest" />
        </label>
      </header>

      <div className="kiosk-board">
        <nav className="kiosk-rail rise" aria-label="Menu categories">
          {categories.map((cat) => {
            const active = category === cat.name;
            const copy = categoryCopy(cat.name);
            return (
              <button
                key={cat.name}
                type="button"
                className={`kiosk-rail-btn${active ? ' is-active' : ''}`}
                style={{ ['--cat-color' as string]: cat.color }}
                aria-current={active ? 'true' : undefined}
                onClick={() => setCategory(cat.name)}
              >
                <span className="kiosk-rail-glow" aria-hidden />
                <span className="kiosk-rail-thumb">
                  <img src={cat.thumb} alt="" />
                </span>
                <span className="kiosk-rail-copy">
                  <span className="kiosk-rail-label">{copy.title}</span>
                  <span className="kiosk-rail-blurb">{copy.blurb}</span>
                </span>
                {active ? <span className="kiosk-rail-live">Selected</span> : <span className="kiosk-rail-count">{cat.count} items</span>}
              </button>
            );
          })}
        </nav>

        <section className="kiosk-products rise">
          <div className="kiosk-products-head">
            <div>
              <p className="kiosk-products-kicker">{categoryCopy(category).blurb}</p>
              <h2 className="brand-mark">{categoryCopy(category).title || 'Menu'}</h2>
            </div>
            <p>{visible.length} items</p>
          </div>
          <div className="kiosk-menu">
            {visible.map((item, index) => (
              <article
                key={item.id}
                className="menu-tile"
                style={{ animationDelay: `${index * 0.03}s`, borderColor: item.color }}
              >
                <img className="menu-photo" src={item.image} alt={item.name} loading="lazy" />
                <div className="menu-copy">
                  <h3>{item.name}</h3>
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
          </div>
        </section>

        <aside className="screen-card kiosk-cart rise">
          <h2 className="brand-mark">Your tray</h2>
          <p className="kiosk-cart-meta">{trayCount} item{trayCount === 1 ? '' : 's'}</p>
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
