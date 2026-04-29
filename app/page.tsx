"use client";

import { useState, useEffect, useRef } from "react";

const ROUTE = { from: "Guangzhou", to: "Jebel Ali", code: "CAN → JEA" };
const RATE_PER_CBM = 265;
const DOC_FEE = 150;
const WEIGHT_DIVISOR = 500;

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start = null;
    const from = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(from + (target - from) * ease);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

function NumTicker({ value, decimals = 2, prefix = "" }) {
  const animated = useCountUp(value);
  return <>{prefix}{animated.toFixed(decimals)}</>;
}

export default function FreightCalculator() {
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [docNeeded, setDocNeeded] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const validate = () => {
    const e = {};
    const w = parseFloat(weight);
    const v = parseFloat(volume);
    if (!weight || isNaN(w) || w <= 0) e.weight = "Enter a valid gross weight";
    if (!volume || isNaN(v) || v <= 0) e.volume = "Enter a valid volume";
    return e;
  };

  const calculate = () => {
    const e = validate();
    setErrors(e);
    setSubmitted(true);
    if (Object.keys(e).length > 0) return;

    const w = parseFloat(weight);
    const v = parseFloat(volume);
    const weightCBM = w / WEIGHT_DIVISOR;
    const chargeableCBM = Math.max(weightCBM, v);
    const freightCost = chargeableCBM * RATE_PER_CBM;
    const docCost = docNeeded ? DOC_FEE : 0;
    const total = freightCost + docCost;

    setResult({ w, v, weightCBM, chargeableCBM, freightCost, docCost, total });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const reset = () => {
    setWeight(""); setVolume(""); setDocNeeded(false);
    setErrors({}); setSubmitted(false); setResult(null);
  };

  const totalAnimated = useCountUp(result?.total ?? 0);
  const freightAnimated = useCountUp(result?.freightCost ?? 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0c0c0e;
          --surface: #131317;
          --surface2: #1a1a20;
          --border: #2a2a35;
          --border-accent: #3d3d50;
          --text: #e8e8f0;
          --muted: #6b6b80;
          --accent: #f0b429;
          --accent2: #4a9eff;
          --danger: #ff4d4d;
          --success: #2ecc71;
          --font-display: 'Bebas Neue', sans-serif;
          --font-mono: 'DM Mono', monospace;
          --font-body: 'DM Sans', sans-serif;
        }

        body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr auto;
          position: relative;
          overflow: hidden;
        }

        /* Noise texture overlay */
        .page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* Grid lines background */
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .content { position: relative; z-index: 1; }

        /* Header */
        .header {
          border-bottom: 1px solid var(--border);
          padding: 0 clamp(1rem, 5vw, 3rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          background: rgba(12,12,14,0.95);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-mark {
          width: 32px;
          height: 32px;
          background: var(--accent);
          clip-path: polygon(0 25%, 50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 1.4rem;
          letter-spacing: 0.08em;
          color: var(--text);
          line-height: 1;
        }

        .logo-sub {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--muted);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .header-route {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--muted);
          letter-spacing: 0.1em;
        }

        .route-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--success);
          box-shadow: 0 0 6px var(--success);
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Main layout */
        .main {
          padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 3rem);
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }

        /* Hero section */
        .hero {
          margin-bottom: 3rem;
        }

        .hero-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--accent);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-eyebrow::before {
          content: '';
          width: 24px;
          height: 1px;
          background: var(--accent);
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 8vw, 6rem);
          line-height: 0.9;
          letter-spacing: 0.02em;
          color: var(--text);
          margin-bottom: 1rem;
        }

        .hero-title span { color: var(--accent); }

        .hero-desc {
          font-size: 0.9rem;
          color: var(--muted);
          max-width: 420px;
          line-height: 1.7;
        }

        /* Route banner */
        .route-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border: 1px solid var(--border-accent);
          background: var(--surface);
          border-radius: 4px;
          margin-bottom: 2.5rem;
          overflow: hidden;
          position: relative;
        }

        .route-banner::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--accent);
        }

        .route-city {
          display: flex;
          flex-direction: column;
        }

        .route-city-code {
          font-family: var(--font-display);
          font-size: 1.8rem;
          line-height: 1;
          letter-spacing: 0.05em;
          color: var(--text);
        }

        .route-city-name {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .route-arrow {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-width: 80px;
        }

        .route-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          position: relative;
        }

        .route-line::after {
          content: '▶';
          position: absolute;
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--accent2);
          font-size: 0.7rem;
        }

        .route-ship {
          font-size: 1.2rem;
          position: absolute;
          animation: ship-move 4s ease-in-out infinite;
        }

        @keyframes ship-move {
          0%, 100% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
        }

        .route-meta {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--muted);
          margin-left: auto;
          text-align: right;
        }

        .route-meta strong {
          display: block;
          color: var(--accent);
          font-size: 0.9rem;
          font-family: var(--font-display);
          letter-spacing: 0.05em;
        }

        /* Two-column layout */
        .layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
        }

        @media (max-width: 768px) {
          .layout { grid-template-columns: 1fr; }
        }

        .panel {
          background: var(--surface);
          padding: 2rem;
        }

        .panel-right {
          background: var(--surface2);
        }

        .panel-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--muted);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panel-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* Form fields */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .field-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex;
          justify-content: space-between;
        }

        .field-error {
          color: var(--danger);
          font-size: 0.65rem;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-unit {
          position: absolute;
          right: 12px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--muted);
          pointer-events: none;
          letter-spacing: 0.05em;
        }

        input[type="number"] {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 2px;
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 1rem;
          padding: 0.8rem 3rem 0.8rem 1rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          -moz-appearance: textfield;
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        input[type="number"]:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(240,180,41,0.08);
        }

        input[type="number"].error {
          border-color: var(--danger);
          box-shadow: 0 0 0 3px rgba(255,77,77,0.08);
        }

        input[type="number"]::placeholder { color: var(--border-accent); }

        /* Toggle */
        .toggle-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border: 1px solid var(--border);
          background: var(--bg);
          border-radius: 2px;
          cursor: pointer;
          transition: border-color 0.2s;
          user-select: none;
        }

        .toggle-field:hover { border-color: var(--border-accent); }
        .toggle-field.active { border-color: var(--accent); background: rgba(240,180,41,0.04); }

        .toggle-left { display: flex; flex-direction: column; gap: 2px; }
        .toggle-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text);
        }
        .toggle-detail {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--muted);
        }

        .toggle-switch {
          width: 44px;
          height: 24px;
          background: var(--border);
          border-radius: 12px;
          position: relative;
          transition: background 0.25s;
          flex-shrink: 0;
        }

        .toggle-switch.on { background: var(--accent); }

        .toggle-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }

        .toggle-switch.on .toggle-thumb { transform: translateX(20px); }

        /* Submit button */
        .btn-calculate {
          width: 100%;
          margin-top: 2rem;
          padding: 1rem;
          background: var(--accent);
          color: #000;
          border: none;
          border-radius: 2px;
          font-family: var(--font-display);
          font-size: 1.3rem;
          letter-spacing: 0.12em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, opacity 0.15s;
        }

        .btn-calculate:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-calculate:active { transform: translateY(0); }

        .btn-calculate::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }

        .btn-calculate:hover::before { transform: translateX(100%); }

        /* Result panel */
        .result-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 300px;
          gap: 1rem;
          opacity: 0.3;
        }

        .result-empty-icon {
          font-size: 3rem;
          opacity: 0.5;
        }

        .result-empty-text {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--muted);
          letter-spacing: 0.15em;
          text-align: center;
        }

        /* Results */
        .result-total {
          margin-bottom: 2rem;
        }

        .result-total-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--muted);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .result-total-amount {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4rem);
          line-height: 1;
          color: var(--accent);
          letter-spacing: 0.02em;
        }

        .result-total-usd {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--muted);
          margin-top: 4px;
        }

        /* Breakdown */
        .breakdown {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--border);
        }

        .breakdown-row {
          display: flex;
          align-items: center;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--border);
          gap: 1rem;
          animation: row-in 0.4s ease both;
        }

        .breakdown-row:last-child { border-bottom: none; }

        @keyframes row-in {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .breakdown-row:nth-child(1) { animation-delay: 0.05s; }
        .breakdown-row:nth-child(2) { animation-delay: 0.1s; }
        .breakdown-row:nth-child(3) { animation-delay: 0.15s; }
        .breakdown-row:nth-child(4) { animation-delay: 0.2s; }
        .breakdown-row:nth-child(5) { animation-delay: 0.25s; }

        .breakdown-row.highlight {
          background: rgba(240,180,41,0.06);
          border-color: rgba(240,180,41,0.2);
        }

        .breakdown-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 2px;
          flex-shrink: 0;
        }

        .breakdown-label {
          flex: 1;
          font-size: 0.8rem;
          color: var(--muted);
        }

        .breakdown-label strong {
          display: block;
          font-size: 0.85rem;
          color: var(--text);
          font-weight: 500;
          margin-bottom: 2px;
        }

        .breakdown-value {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          color: var(--text);
          text-align: right;
        }

        .breakdown-value.accent { color: var(--accent); font-weight: 500; }
        .breakdown-value.muted { color: var(--muted); font-size: 0.75rem; }

        /* Chargeable tag */
        .tag {
          display: inline-flex;
          align-items: center;
          padding: 1px 6px;
          background: rgba(74,158,255,0.1);
          border: 1px solid rgba(74,158,255,0.3);
          border-radius: 2px;
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--accent2);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-left: 6px;
        }

        .tag.winner { background: rgba(240,180,41,0.1); border-color: rgba(240,180,41,0.3); color: var(--accent); }

        /* Reset button */
        .btn-reset {
          width: 100%;
          margin-top: 1.5rem;
          padding: 0.7rem;
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 2px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .btn-reset:hover { border-color: var(--danger); color: var(--danger); }

        /* Footer */
        .footer {
          border-top: 1px solid var(--border);
          padding: 1.25rem clamp(1rem, 5vw, 3rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .footer-text {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--muted);
          letter-spacing: 0.1em;
        }

        .footer-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .footer-pill {
          padding: 3px 10px;
          border: 1px solid var(--border);
          border-radius: 12px;
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--muted);
          letter-spacing: 0.1em;
        }

        /* Responsive tweaks */
        @media (max-width: 480px) {
          .route-meta { display: none; }
          .header-route { display: none; }
          .panel { padding: 1.25rem; }
        }
      `}</style>

      <div className="page">
        <div className="grid-bg" />

        {/* Header */}
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

        {/* Main */}
        <main className="main content">
          {/* Hero */}
          <div className="hero">
            <div className="hero-eyebrow">Sea Freight Estimator</div>
            <h1 className="hero-title">
              CARGO<br /><span>QUOTE</span>
            </h1>
            <p className="hero-desc">
              Instant LCL rate estimates based on chargeable weight. Enter your shipment details below.
            </p>
          </div>

          {/* Route banner */}
          <div className="route-banner">
            <div className="route-city">
              <div className="route-city-code">CAN</div>
              <div className="route-city-name">Guangzhou, CN</div>
            </div>
            <div className="route-arrow">
              <div className="route-line" />
              <span className="route-ship">🚢</span>
            </div>
            <div className="route-city">
              <div className="route-city-code">JEA</div>
              <div className="route-city-name">Jebel Ali, AE</div>
            </div>
            <div className="route-meta">
              <strong>${RATE_PER_CBM}</strong>
              per CBM
            </div>
          </div>

          {/* Calculator layout */}
          <div className="layout">
            {/* Left: Input panel */}
            <div className="panel">
              <div className="panel-label">Shipment Details</div>
              <div className="field-group">
                <div className="field">
                  <div className="field-label">
                    <span>Gross Weight</span>
                    {submitted && errors.weight && <span className="field-error">{errors.weight}</span>}
                  </div>
                  <div className="input-wrap">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className={submitted && errors.weight ? "error" : ""}
                      min="0"
                      step="any"
                    />
                    <span className="input-unit">KG</span>
                  </div>
                </div>

                <div className="field">
                  <div className="field-label">
                    <span>Volume</span>
                    {submitted && errors.volume && <span className="field-error">{errors.volume}</span>}
                  </div>
                  <div className="input-wrap">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={volume}
                      onChange={e => setVolume(e.target.value)}
                      className={submitted && errors.volume ? "error" : ""}
                      min="0"
                      step="any"
                    />
                    <span className="input-unit">CBM</span>
                  </div>
                </div>

                <div className="field">
                  <div className="field-label">Local Documentation</div>
                  <div
                    className={`toggle-field${docNeeded ? " active" : ""}`}
                    onClick={() => setDocNeeded(v => !v)}
                  >
                    <div className="toggle-left">
                      <div className="toggle-name">Documentation Required</div>
                      <div className="toggle-detail">Adds ${DOC_FEE} flat fee · B/L, CO, etc.</div>
                    </div>
                    <div className={`toggle-switch${docNeeded ? " on" : ""}`}>
                      <div className="toggle-thumb" />
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn-calculate" onClick={calculate}>
                CALCULATE RATE
              </button>
            </div>

            {/* Right: Results panel */}
            <div className="panel panel-right" ref={resultRef}>
              <div className="panel-label">Rate Breakdown</div>

              {!result ? (
                <div className="result-empty">
                  <div className="result-empty-icon">⚓</div>
                  <div className="result-empty-text">
                    ENTER SHIPMENT DETAILS<br />TO GENERATE QUOTE
                  </div>
                </div>
              ) : (
                <div>
                  <div className="result-total">
                    <div className="result-total-label">Total Estimated Cost</div>
                    <div className="result-total-amount">
                      ${totalAnimated.toFixed(2)}
                    </div>
                    <div className="result-total-usd">USD · All charges included</div>
                  </div>

                  <div className="breakdown">
                    <div className="breakdown-row">
                      <div className="breakdown-icon">⚖️</div>
                      <div className="breakdown-label">
                        <strong>Weight → CBM</strong>
                        {result.w.toFixed(2)} kg ÷ {WEIGHT_DIVISOR}
                      </div>
                      <div className="breakdown-value">
                        {result.weightCBM.toFixed(3)} CBM
                        {result.weightCBM >= result.v && <span className="tag winner">USED</span>}
                      </div>
                    </div>

                    <div className="breakdown-row">
                      <div className="breakdown-icon">📦</div>
                      <div className="breakdown-label">
                        <strong>Actual Volume</strong>
                        As declared
                      </div>
                      <div className="breakdown-value">
                        {result.v.toFixed(3)} CBM
                        {result.v > result.weightCBM && <span className="tag winner">USED</span>}
                      </div>
                    </div>

                    <div className="breakdown-row highlight">
                      <div className="breakdown-icon">✓</div>
                      <div className="breakdown-label">
                        <strong>Chargeable CBM</strong>
                        Higher of the two values
                      </div>
                      <div className="breakdown-value accent">
                        {result.chargeableCBM.toFixed(3)} CBM
                      </div>
                    </div>

                    <div className="breakdown-row">
                      <div className="breakdown-icon">🚢</div>
                      <div className="breakdown-label">
                        <strong>Freight Cost</strong>
                        {result.chargeableCBM.toFixed(3)} × ${RATE_PER_CBM}/CBM
                      </div>
                      <div className="breakdown-value">
                        ${freightAnimated.toFixed(2)}
                      </div>
                    </div>

                    {result.docCost > 0 && (
                      <div className="breakdown-row">
                        <div className="breakdown-icon">📋</div>
                        <div className="breakdown-label">
                          <strong>Documentation Fee</strong>
                          Local docs · B/L handling
                        </div>
                        <div className="breakdown-value">${result.docCost.toFixed(2)}</div>
                      </div>
                    )}
                  </div>

                  <button className="btn-reset" onClick={reset}>
                    ↺ NEW CALCULATION
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer content">
          <div className="footer-text">© 2025 AXIOM FREIGHT · ESTIMATES ONLY · NOT A BINDING CONTRACT</div>
          <div className="footer-right">
            <div className="footer-pill">SEA FREIGHT</div>
            <div className="footer-pill">LCL</div>
            <div className="footer-pill">CAN → JEA</div>
          </div>
        </footer>
      </div>
    </>
  );
}
