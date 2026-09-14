import { Link } from 'react-router-dom';
import '@src/styles/home.css';

const CARDS = [
  {
    to: 'kiosk',
    title: 'Self-Service Kiosk',
    copy: 'Tap meals, build a cart, and place an order like a QSR lobby kiosk.',
    tone: 'kiosk',
  },
  {
    to: 'pos',
    title: 'Realtime POS',
    copy: 'Watch kiosk tickets land live, advance kitchen status, and checkout by order id.',
    tone: 'pos',
  },
  {
    to: 'status',
    title: 'Order Status Board',
    copy: 'Lobby board from queue to preparing to ready for pickup.',
    tone: 'status',
  },
] as const;

export default function HomeScreen() {
  return (
    <div className="app-shell home-shell">
      <header className="home-hero rise">
        <p className="home-kicker">Advance kiosk demo</p>
        <h1 className="brand-mark home-title">BeeJoy</h1>
        <p className="home-sub">
          Three linked screens for a self-service counter: guest kiosk, staff POS, and pickup board.
        </p>
      </header>
      <div className="home-grid">
        {CARDS.map((card, index) => (
          <Link
            key={card.to}
            to={card.to}
            className={`home-card home-card-${card.tone} rise`}
            style={{ animationDelay: `${0.08 * (index + 1)}s` }}
          >
            <span className="home-card-index">0{index + 1}</span>
            <h2 className="brand-mark">{card.title}</h2>
            <p>{card.copy}</p>
            <span className="home-card-cta">Open screen</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
