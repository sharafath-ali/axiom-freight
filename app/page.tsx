import FreightCalculator from "@/app/components/FreightCalculator";
import { RATE_PER_CBM, ROUTE } from "@/lib/config";

export default function Page() {
  return (
    <div className="page">
      <div className="grid-bg" />
      <header className="header content">
        <div className="logo">
          <div className="logo-mark" />
          <div>
            <div className="logo-text">AXIOM</div>
            <div className="logo-sub">Freight Solutions</div>
          </div>
        </div>
        <div className="header-route">
          <span className="route-dot" />
          <span>LIVE RATES · FCL/LCL</span>
        </div>
      </header>

      <main className="main content">
        <div className="hero">
          <div className="hero-eyebrow">Sea Freight Estimator</div>
          <h1 className="hero-title">
            CARGO<br /><span>QUOTE</span>
          </h1>
          <p className="hero-desc">
            Instant LCL rate estimates based on chargeable weight. Enter your shipment details below.
          </p>
        </div>
        <div className="route-banner">
          <div className="route-city">
            <div className="route-city-code">{ROUTE.fromCode}</div>
            <div className="route-city-name">{ROUTE.fromCity}</div>
          </div>
          <div className="route-arrow">
            <div className="route-line" />
            <span className="route-ship">🚢</span>
          </div>
          <div className="route-city">
            <div className="route-city-code">{ROUTE.toCode}</div>
            <div className="route-city-name">{ROUTE.toCity}</div>
          </div>
          <div className="route-meta">
            <strong>${RATE_PER_CBM}</strong>
            per CBM
          </div>
        </div>

        <FreightCalculator />
      </main>

      <footer className="footer content">
        <div className="footer-text">© 2025 AXIOM FREIGHT · ESTIMATES ONLY · NOT A BINDING CONTRACT</div>
        <div className="footer-right">
          <div className="footer-pill">SEA FREIGHT</div>
          <div className="footer-pill">LCL</div>
          <div className="footer-pill">CAN → JEA</div>
        </div>
      </footer>
    </div>
  );
}
