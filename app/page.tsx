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
