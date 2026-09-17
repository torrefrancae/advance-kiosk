import { Link } from 'react-router-dom';
import '@src/styles/home.css';

const CARDS = [
  {
    to: 'kiosk',
    title: 'Self-Service Kiosk',
    copy: 'Customer screen: tap meals, build a tray, and place an order.',
    tone: 'kiosk',
    primary: true,
  },
  {
    to: 'cashier',
    title: 'Cashier',
    copy: 'Take payment for unpaid tickets, then hand ready orders to guests.',
    tone: 'cashier',
    primary: false,
  },
  {
    to: 'cook',
    title: 'Cook Station',
    copy: 'See paid tickets, start cooking, and mark each order ready.',
    tone: 'cook',
    primary: false,
  },
  {
    to: 'status',
    title: 'Order Status Board',
    copy: 'Lobby board from pay queue to cooking to ready for pickup.',
    tone: 'status',
    primary: false,
  },
] as const;

export default function HomeScreen() {
  return (
    <div className="app-shell home-shell">
      <header className="home-hero rise">
        <p className="home-kicker">Advance kiosk demo</p>
        <h1 className="brand-mark home-title">BeeJoy</h1>
        <p className="home-sub">
          Start on the customer kiosk, then open cashier, cook, and status on other tabs.
        </p>
        <Link to="kiosk" className="btn btn-primary home-hero-cta pulse">
          Open self-service kiosk
        </Link>
      </header>
      <div className="home-grid">
        {CARDS.map((card, index) => (
          <Link
            key={card.to}
            to={card.to}
            className={`home-card home-card-${card.tone}${card.primary ? ' home-card-primary' : ''} rise`}
            style={{ animationDelay: `${0.08 * (index + 1)}s` }}
          >
            <span className="home-card-index">0{index + 1}</span>
            <h2 className="brand-mark">{card.title}</h2>
            <p>{card.copy}</p>
            <span className="home-card-cta">{card.primary ? 'Order here' : 'Open screen'}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
