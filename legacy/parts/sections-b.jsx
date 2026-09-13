// sections-b.jsx — HowItWorks/Features, StockSim (interactive), Lab token creator
const { useState: useStateB, useEffect: useEffectB, useRef: useRefB } = React;

/* ============== IDEA→LIFE (Lusion-style scroll-drawn squiggle) ============== */
function IdeaToLife() {
  const secRef = useRefB(null);
  const pathRef = useRefB(null);
  const headRef = useRefB(null);
  useEffectB(() => {
    const path = pathRef.current, sec = secRef.current; if (!path || !sec) return;
    const reduce = document.body.classList.contains("no-motion");
    let len = 0;
    const measure = () => { try { const l = path.getTotalLength(); if (Number.isFinite(l) && l > 0) len = l; } catch (e) {} return len; };
    const place = (drawn) => {
      if (!headRef.current || !len) return;
      const at = Math.max(0.1, Math.min(len - 0.1, drawn));
      if (!Number.isFinite(at)) return;
      try { const pt = path.getPointAtLength(at); headRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`); } catch (e) {}
    };
    measure();
    if (reduce) { if (len) { path.style.strokeDasharray = len; path.style.strokeDashoffset = 0; place(len); } return; }
    const on = () => {
      if (!len && !measure()) return;            // wait until the path is measurable
      path.style.strokeDasharray = len;
      const r = sec.getBoundingClientRect();
      const scrolledPast = window.innerHeight - r.top;
      const p = Math.max(0, Math.min(1, scrolledPast / ((r.height + window.innerHeight) * 0.78)));
      const drawn = p * len;
      path.style.strokeDashoffset = len - drawn;
      place(drawn);
      if (headRef.current) headRef.current.style.opacity = (p > 0.012 && p < 0.992) ? 1 : 0;
    };
    if (len) { path.style.strokeDasharray = len; path.style.strokeDashoffset = len; }
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    on();
    const retry = setTimeout(on, 300);           // re-run once layout settles if it wasn't measurable yet
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); clearTimeout(retry); };
  }, []);
  return (
    <section ref={secRef} id="how" className="ideal" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", padding: "90px 0" }}>
      <svg className="squiggle" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="sqgrad" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#2bb673" />
            <stop offset="55%" stopColor="#1c8059" />
            <stop offset="100%" stopColor="#e0a52e" />
          </linearGradient>
        </defs>
        <path ref={pathRef} d="M 1180 -80 C 1040 110 1280 250 1120 360 C 960 470 600 360 560 520 C 520 680 880 700 760 860 C 700 940 480 980 360 1040" fill="none" stroke="url(#sqgrad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <g ref={headRef} style={{ opacity: 0, transition: "opacity .3s" }}>
          <circle r="20" fill="none" stroke="#e0a52e" strokeOpacity="0.35" strokeWidth="2" />
          <circle r="10" fill="#e0a52e" />
        </g>
      </svg>
      <span className="eyebrow ideal-eyebrow"><Icon name="grid" size={14} color="var(--emerald)" /> One ecosystem, four ways to learn</span>
      <h2 className="ideal-title">Textbooks tell,<br /><span>InvestiPlay lets them do.</span></h2>
      <div className="ideal-jeff"><Jeff uid="ideal" size={150} arm="point" look="up" expr="happy" /></div>
      <p className="ideal-sub">Every concept students learn in a Mission, they immediately apply in a living economy — trading, building, and competing with their classmates.</p>
    </section>
  );
}

/* ============== HOW IT WORKS / FEATURES ============== */
function HowItWorks() {
  const ref = useReveal();
  return (
    <section id="how-grid" ref={ref} style={{ padding: "70px 0 40px" }}>
      <div className="wrap">
        {/* gated-progression banner: lessons unlock everything else */}
        <div className="reveal lock-banner" style={{ background: "var(--dark)", borderRadius: 26, padding: "30px 34px", display: "flex", alignItems: "center", gap: 30, flexWrap: "wrap", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(620px 240px at 10% -20%, rgba(43,182,115,.16), transparent)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", maxWidth: "54ch" }}>
            <div style={{ flexShrink: 0, width: 60, height: 60, borderRadius: 16, background: "rgba(43,182,115,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="lock" size={26} color="#4fd99b" />
            </div>
            <div>
              <div className="mono" style={{ color: "#4fd99b", fontSize: ".74rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>Learn first, then play</div>
              <h3 style={{ color: "#eafff5", fontSize: "1.38rem", fontWeight: 800, letterSpacing: "-.02em", margin: 0, lineHeight: 1.25 }}>You can&rsquo;t trade, build, or file a form until the lesson&rsquo;s done.</h3>
              <p style={{ color: "#9cc4b3", fontSize: ".98rem", lineHeight: 1.5, margin: "8px 0 0" }}>The market, The Lab, and Build-a-Business stay locked until students complete the matching financial-literacy Mission. Mastery is the only key that opens the fun.</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", flexWrap: "wrap" }}>
            <div className="pill-tag" style={{ background: "rgba(20,160,91,.16)", color: "#4fd99b", fontSize: ".82rem", padding: "10px 14px" }}><Icon name="check" size={15} /> Lesson complete</div>
            <Icon name="arrow" size={18} color="#5e8775" />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[["chart", "Trade"], ["doc", "The Lab"], ["store", "Build"]].map(([ic, l]) => (
                <div key={l} className="pill-tag" style={{ background: "rgba(255,255,255,.06)", color: "#cfeede", fontSize: ".82rem", padding: "10px 14px" }}><Icon name={ic} size={15} color="#e0a52e" /> {l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width:900px){ .feat-grid{ grid-template-columns:1fr 1fr !important; } } @media (max-width:600px){ .feat-grid{ grid-template-columns:1fr !important; } } @media (max-width:760px){ .lock-banner{ flex-direction:column; align-items:flex-start !important; } }`}</style>
    </section>
  );
}

/* ============== LIVE STOCK SIM — real Yahoo Finance data + adjustable trades ============== */
const QUICK = ["AAPL", "TSLA", "NVDA", "SPY"];

// Which Yahoo range/interval each selectable period maps to, plus how many
// points to keep (intraday needs fewer; a year of daily bars needs more).
const RANGE_PARAMS = {
  "1d":  { interval: "5m",  cap: 96 },
  "5d":  { interval: "30m", cap: 200 },
  "1mo": { interval: "1d",  cap: 400 },
  "6mo": { interval: "1d",  cap: 400 },
  "1y":  { interval: "1d",  cap: 400 },
};

// Tiny in-memory cache so re-clicking a period you just viewed is instant and
// the poller doesn't refetch faster than the data actually changes.
const _chartCache = new Map();

// Yahoo's chart API doesn't send CORS headers, so we route through public CORS
// proxies. Instead of trying them one-by-one (slow when some are rate-limited),
// we RACE them all and take the first that returns a valid chart.
async function fetchViaProxies(target) {
  const enc = encodeURIComponent(target);
  const sources = [
    { url: `https://api.allorigins.win/raw?url=${enc}`, wrapped: false },
    { url: `https://corsproxy.io/?url=${enc}`,          wrapped: false },
    { url: `https://proxy.cors.sh/${target}`,           wrapped: false },
    { url: `https://api.allorigins.win/get?url=${enc}`, wrapped: true },
  ];
  const attempts = sources.map((src) => (async () => {
    const res = await fetch(src.url, { cache: "no-store" });
    if (!res.ok) throw new Error("status " + res.status);
    let data = await res.json();
    if (src.wrapped) data = JSON.parse(data.contents); // allorigins /get wraps the body
    const r = data && data.chart && data.chart.result && data.chart.result[0];
    if (!r) throw new Error("no result");
    return r;
  })());
  return await Promise.any(attempts); // first proxy to succeed wins
}

async function fetchYahoo(symbol, range = "1d") {
  const cacheKey = `${symbol}|${range}`;
  const hit = _chartCache.get(cacheKey);
  if (hit && Date.now() - hit.t < 15000) return hit.data;

  const { interval, cap } = RANGE_PARAMS[range] || RANGE_PARAMS["1d"];
  const target = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
  try {
    const r = await fetchViaProxies(target);
    const meta = r.meta || {};
    const q = r.indicators && r.indicators.quote && r.indicators.quote[0];
    // Keep each close paired with its timestamp so the chart can show the
    // time/date behind any point on hover (drop only the null-close gaps).
    const rawCloses = (q && q.close) || [];
    const stamps = r.timestamp || [];
    const pairs = [];
    for (let i = 0; i < rawCloses.length; i++) {
      if (rawCloses[i] != null) pairs.push([stamps[i] != null ? stamps[i] : null, rawCloses[i]]);
    }
    const closes = pairs.map((p) => p[1]);
    if (!closes.length) return null;
    const price = meta.regularMarketPrice != null ? meta.regularMarketPrice : closes[closes.length - 1];
    // % change reference: previous close for 1D, start-of-window for longer views.
    const prev = range === "1d"
      ? (meta.chartPreviousClose != null ? meta.chartPreviousClose
         : (meta.previousClose != null ? meta.previousClose : closes[0]))
      : closes[0];
    if (price == null) return null;
    const tail = pairs.slice(-cap);
    const out = {
      symbol: (meta.symbol || symbol).toUpperCase(),
      name: meta.longName || meta.shortName || (meta.symbol || symbol).toUpperCase(),
      currency: meta.currency || "USD",
      price, prev,
      series: tail.map((p) => p[1]),
      times: tail.map((p) => p[0]),
    };
    _chartCache.set(cacheKey, { t: Date.now(), data: out });
    return out;
  } catch (e) {
    return null; // every proxy failed → caller shows the simulated feed
  }
}

// Selectable chart periods (Yahoo range values) + a friendly label per period.
const RANGES = [["1D", "1d"], ["1W", "5d"], ["1M", "1mo"], ["6M", "6mo"], ["1Y", "1y"]];
const RANGE_LABEL = { "1d": "Today", "5d": "Past week", "1mo": "Past month", "6mo": "Past 6 months", "1y": "Past year" };

function StockSim() {
  const ref = useReveal();
  const [sym, setSym] = useStateB("AAPL");
  const [field, setField] = useStateB("");
  const [quote, setQuote] = useStateB(null);
  const [live, setLive] = useStateB(true);       // true = real Yahoo data, false = simulated fallback
  const [loading, setLoading] = useStateB(true);
  const [series, setSeries] = useStateB(() => randomWalk(40, 180, 5));
  const [cash, setCash] = useStateB(10000);
  const [shares, setShares] = useStateB(0);
  const [avg, setAvg] = useStateB(0);
  const [qty, setQty] = useStateB(1);
  const [toast, setToast] = useStateB(null);
  const [hoverI, setHoverI] = useStateB(null); // hovered point on the price chart
  const [range, setRange] = useStateB("1d");    // selected chart period
  const chartRef = useRefB(null);

  // reset the paper position when switching tickers
  useEffectB(() => { setShares(0); setAvg(0); setQty(1); }, [sym]);

  // fetch real data on symbol change, then poll for fresh prices
  useEffectB(() => {
    let alive = true;
    setLoading(true);
    setHoverI(null);
    const run = async () => {
      const data = await fetchYahoo(sym, range);
      if (!alive) return;
      if (data) {
        setQuote(data);
        setSeries(data.series.length > 1 ? data.series : randomWalk(40, data.price, Math.max(1, data.price * 0.01)));
        setLive(true);
      } else {
        setQuote(null);
        setLive(false);
        setSeries((s) => (s.length > 1 ? s : randomWalk(40, 180, 5)));
      }
      setLoading(false);
    };
    run();
    // Intraday moves fast (poll 20s); daily views change slowly (poll 60s).
    const id = setInterval(run, range === "1d" ? 20000 : 60000);
    return () => { alive = false; clearInterval(id); };
  }, [sym, range]);

  // when real data is unavailable, drift the simulated series so the chart still lives
  useEffectB(() => {
    if (live) return;
    const id = setInterval(() => {
      setSeries((s) => [...s.slice(1), Math.max(5, s[s.length - 1] + (Math.random() - 0.5) * 5)]);
    }, 1300);
    return () => clearInterval(id);
  }, [live]);

  const price = quote ? quote.price : series[series.length - 1];
  const prev = quote ? quote.prev : series[0];
  const name = quote ? quote.name : sym;
  const ticker = quote ? quote.symbol : sym;
  const dayChg = prev ? ((price - prev) / prev) * 100 : 0;

  const showToast = (msg, kind) => { setToast({ msg, kind }); setTimeout(() => setToast(null), 2600); };
  const maxBuy = Math.max(0, Math.floor(cash / price));
  const buy = () => {
    const n = Math.max(1, qty);
    const cost = n * price;
    if (cash < cost) return showToast("Not enough cash — that's a real lesson too.", "warn");
    const ns = shares + n;
    setAvg((shares * avg + cost) / ns);
    setShares(ns);
    setCash((c) => c - cost);
    showToast(`Bought ${n} ${n > 1 ? "shares" : "share"} of ${ticker} 📈`, "good");
  };
  const sell = () => {
    const n = Math.max(1, qty);
    if (shares < n) return showToast(shares === 0 ? "No shares to sell yet — buy first!" : `You only own ${shares}.`, "warn");
    setShares((sh) => sh - n);
    setCash((c) => c + n * price);
    const gain = (price - avg) * n;
    showToast(gain >= 0 ? `Sold ${n} for a $${fmt(gain)} gain 🎉` : `Sold ${n} at a $${fmt(Math.abs(gain))} loss — note why.`, gain >= 0 ? "good" : "warn");
  };

  const submitSym = (e) => {
    e.preventDefault();
    const v = field.trim().toUpperCase();
    if (v && v !== sym) setSym(v);
    setField("");
  };

  const { d, area, pts } = sparkPath(series, 560, 220, 8);
  const holdingsVal = shares * price;
  const total = cash + holdingsVal;
  const pl = shares > 0 ? (price - avg) * shares : 0;

  // ── Hover-to-read: map a pointer x onto the nearest price point ──
  const times = (quote && quote.times && quote.times.length === series.length) ? quote.times : null;
  const fmtTime = (t) => {
    try {
      const dt = new Date(t * 1000);
      return range === "1d"
        ? dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        : dt.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch (e) { return ""; }
  };
  const onHoverMove = (clientX) => {
    const el = chartRef.current; if (!el) return;
    const rect = el.getBoundingClientRect(); if (!rect.width) return;
    let f = (clientX - rect.left) / rect.width; f = Math.max(0, Math.min(1, f));
    const n = series.length; const step = (560 - 16) / Math.max(1, n - 1);
    const i = Math.round((f * 560 - 8) / step);
    setHoverI(Math.max(0, Math.min(n - 1, i)));
  };
  const hp = hoverI != null && pts[hoverI] ? pts[hoverI] : null;      // [x,y] in viewBox units
  const hx = hp ? (hp[0] / 560) * 100 : 0;                            // → % across the chart
  const hy = hp ? (hp[1] / 220) * 100 : 0;
  const hColor = dayChg >= 0 ? "#3fe08f" : "#ff8a80";

  const StepBtn = ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="mono" style={{ width: 38, height: 38, borderRadius: 11, fontSize: "1.1rem", fontWeight: 700,
      background: "rgba(255,255,255,.06)", color: disabled ? "#3d5a4c" : "#eafff5", cursor: disabled ? "not-allowed" : "pointer" }}>{label}</button>
  );

  return (
    <section id="sim" ref={ref} style={{ padding: "70px 0" }}>
      <div className="wrap">
        <div className="reveal sim-head" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", marginBottom: 36 }}>
          <div>
            <span className="eyebrow"><Icon name="chart" size={14} color="var(--emerald)" /> Try it live · real market data</span>
            <h2 className="sec-title">Trade a real market.<br /><span style={{ color: "var(--emerald-2)" }}>Risk exactly $0.</span></h2>
          </div>
          <p className="sec-sub">This is the actual simulator students use, wired to <strong style={{ color: "var(--ink)" }}>live Yahoo Finance prices</strong>. Pick or type any ticker, set how many shares to trade, and place an order. Every buy and sell teaches risk, timing, and discipline — with virtual cash.</p>
        </div>

        <div className="reveal" style={{ background: "var(--dark)", borderRadius: 30, padding: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22 }} className="sim-grid">
            {/* chart side */}
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                {QUICK.map((k) => (
                  <button key={k} onClick={() => setSym(k)} className="mono"
                    style={{ padding: "8px 14px", borderRadius: 11, fontWeight: 700, fontSize: ".82rem", transition: "all .2s",
                      background: sym === k ? "var(--leaf)" : "rgba(255,255,255,.06)",
                      color: sym === k ? "#042018" : "#bfe0d0" }}>{k}</button>
                ))}
                <form onSubmit={submitSym} style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                  <input value={field} onChange={(e) => setField(e.target.value)} placeholder="Symbol…" maxLength={8} className="mono"
                    style={{ width: 96, padding: "8px 12px", borderRadius: 11, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)", color: "#eafff5", fontSize: ".82rem", fontWeight: 700, outline: "none", textTransform: "uppercase" }} />
                  <button type="submit" className="mono" style={{ padding: "8px 12px", borderRadius: 11, fontWeight: 700, fontSize: ".82rem", background: "rgba(255,255,255,.1)", color: "#eafff5" }}>Load</button>
                </form>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ color: "#eafff5", fontWeight: 800, fontSize: "1.05rem" }}>{name}</span>
                <span className="mono" style={{ color: "#7fae9a", fontSize: ".8rem" }}>{ticker}</span>
                <span style={{ color: "#7fae9a", fontSize: ".8rem", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: live ? "#4fd99b" : "#e0a52e", display: "inline-block", animation: "pulseDot 1.4s infinite" }} /> {loading ? "LOADING" : live ? "LIVE" : "SIM"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                <span className="mono" style={{ color: "#eafff5", fontSize: "2.4rem", fontWeight: 700, letterSpacing: "-.02em" }}>${fmt(price)}</span>
                <span className="mono" style={{ color: dayChg >= 0 ? "#4fd99b" : "#ff8a80", fontWeight: 700 }}>{dayChg >= 0 ? "▲" : "▼"} {Math.abs(dayChg).toFixed(2)}%</span>
                <span style={{ color: "#7fae9a", fontSize: ".8rem", fontWeight: 600 }}>{RANGE_LABEL[range]}</span>
              </div>
              {/* Time-period selector */}
              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
                {RANGES.map(([label, val]) => (
                  <button key={val} onClick={() => setRange(val)} className="mono"
                    style={{ padding: "6px 13px", borderRadius: 9, fontWeight: 700, fontSize: ".78rem", transition: "all .2s",
                      background: range === val ? "var(--leaf)" : "rgba(255,255,255,.06)",
                      color: range === val ? "#042018" : "#bfe0d0" }}>{label}</button>
                ))}
                {loading && <span className="mono" style={{ color: "#7fae9a", fontSize: ".72rem", marginLeft: 2 }}>updating…</span>}
              </div>
              <div ref={chartRef}
                onMouseMove={(e) => onHoverMove(e.clientX)}
                onMouseLeave={() => setHoverI(null)}
                onTouchStart={(e) => onHoverMove(e.touches[0].clientX)}
                onTouchMove={(e) => onHoverMove(e.touches[0].clientX)}
                onTouchEnd={() => setHoverI(null)}
                style={{ position: "relative", width: "100%", cursor: "crosshair", touchAction: "pan-y" }}>
                {/* preserveAspectRatio none → the line fills the box, so the HTML
                    crosshair/tooltip overlays line up exactly with the curve. */}
                <svg viewBox="0 0 560 220" preserveAspectRatio="none" style={{ width: "100%", height: 200, display: "block" }}>
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={dayChg >= 0 ? "#2bb673" : "#e0524a"} stopOpacity="0.32" />
                      <stop offset="100%" stopColor={dayChg >= 0 ? "#2bb673" : "#e0524a"} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="8" x2="552" y1={220 * g} y2={220 * g} stroke="rgba(255,255,255,.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
                  <path d={area} fill="url(#sg)" />
                  <path d={d} fill="none" stroke={hColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ transition: "all .5s" }} />
                </svg>
                {hp && <div style={{ position: "absolute", left: `${hx}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,.28)", transform: "translateX(-50%)", pointerEvents: "none" }} />}
                {hp && <div style={{ position: "absolute", left: `${hx}%`, top: `${hy}%`, width: 12, height: 12, borderRadius: 99, transform: "translate(-50%,-50%)", background: hColor, border: "2px solid #04140e", boxShadow: `0 0 0 4px ${hColor}33`, pointerEvents: "none" }} />}
                {hp && (
                  <div className="mono" style={{ position: "absolute", left: `${Math.max(14, Math.min(86, hx))}%`, top: `${hy}%`, transform: "translate(-50%,-150%)", pointerEvents: "none", background: "#04140e", border: "1px solid rgba(255,255,255,.14)", borderRadius: 10, padding: "6px 10px", whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(0,0,0,.45)", zIndex: 4 }}>
                    <div style={{ color: "#eafff5", fontWeight: 700, fontSize: ".92rem", textAlign: "center" }}>${fmt(series[hoverI])}</div>
                    {times && times[hoverI] != null && <div style={{ color: "#7fae9a", fontSize: ".66rem", marginTop: 2, textAlign: "center" }}>{fmtTime(times[hoverI])}</div>}
                  </div>
                )}
              </div>
            </div>

            {/* trade panel */}
            <div style={{ background: "var(--dark-2)", borderRadius: 20, padding: 20, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: ".74rem", color: "#7fae9a", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>Your paper account</div>
              <div className="mono" style={{ color: "#eafff5", fontSize: "2rem", fontWeight: 700, margin: "6px 0 2px" }}>${fmt(total)}</div>
              <div className="mono" style={{ color: pl >= 0 ? "#4fd99b" : "#ff8a80", fontSize: ".85rem", marginBottom: 16 }}>
                {shares > 0 ? `${pl >= 0 ? "+" : "−"}$${fmt(Math.abs(pl))} unrealized` : "Cash only — make your first trade"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[["Cash", `$${fmt(cash)}`], ["Shares", shares.toString()], ["Avg cost", shares > 0 ? `$${fmt(avg)}` : "—"], ["Holdings", `$${fmt(holdingsVal)}`]].map(([k, v]) => (
                  <div key={k} style={{ background: "rgba(255,255,255,.04)", borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ color: "#7fae9a", fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>{k}</div>
                    <div className="mono" style={{ color: "#eafff5", fontWeight: 700, marginTop: 2, fontSize: ".95rem" }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* adjustable quantity */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ color: "#7fae9a", fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>Shares to trade</span>
                  <button onClick={() => setQty(Math.max(1, maxBuy))} className="mono" style={{ color: "#4fd99b", fontSize: ".72rem", fontWeight: 700 }}>MAX {maxBuy}</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <StepBtn label="−" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} />
                  <input type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10) || 1))} className="mono"
                    style={{ flex: 1, minWidth: 0, textAlign: "center", height: 38, borderRadius: 11, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)", color: "#eafff5", fontSize: "1rem", fontWeight: 700, outline: "none" }} />
                  <StepBtn label="+" onClick={() => setQty((q) => q + 1)} />
                </div>
                <div className="mono" style={{ color: "#7fae9a", fontSize: ".74rem", marginTop: 8 }}>Est. order ≈ ${fmt(qty * price)}</div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                <button onClick={buy} className="btn" style={{ flex: 1, justifyContent: "center", background: "var(--leaf)", color: "#042018", padding: "14px" }}>Buy</button>
                <button onClick={sell} className="btn" style={{ flex: 1, justifyContent: "center", background: "rgba(255,255,255,.08)", color: "#eafff5", padding: "14px" }}>Sell</button>
              </div>
            </div>
          </div>
          {/* toast */}
          {toast && (
            <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", zIndex: 5, animation: "riseUp .3s ease",
              background: toast.kind === "good" ? "var(--leaf)" : "#f0c14b", color: "#042018", fontWeight: 700, fontSize: ".9rem",
              padding: "11px 20px", borderRadius: 999, boxShadow: "var(--shadow-lg)" }}>{toast.msg}</div>
          )}
        </div>
        <p style={{ textAlign: "center", color: "rgba(6,41,31,.5)", fontSize: ".86rem", marginTop: 16 }}>
          {live ? "Live market data via Yahoo Finance, refreshed automatically. Trades use virtual cash." : "Live feed unavailable right now — showing a simulated market. Trades use virtual cash."}
        </p>
      </div>
      <style>{`@media (max-width:860px){ .sim-grid{ grid-template-columns:1fr !important; } .sim-head{ grid-template-columns:1fr !important; gap:16px !important; } }`}</style>
    </section>
  );
}

/* ============== THE LAB — REAL-WORLD FORMS ============== */
const FORMS = [
  { id: "w4", code: "W-4", title: "Employee's Withholding Certificate", agency: "Treasury · Internal Revenue Service", icon: "doc" },
  { id: "i9", code: "I-9", title: "Employment Eligibility Verification", agency: "U.S. Citizenship & Immigration", icon: "shield" },
  { id: "dd", code: "DD", title: "Direct Deposit Authorization", agency: "Payroll onboarding", icon: "coin" },
  { id: "w2", code: "W-2", title: "Wage & Tax Statement", agency: "Year-end review", icon: "chart" },
];
const FILING = ["Single", "Married — jointly", "Head of household"];
function Lab() {
  const ref = useReveal();
  const [formId, setFormId] = useStateB("w4");
  const [fullName, setFullName] = useStateB("Jordan Rivera");
  const [filing, setFiling] = useStateB(0);
  const [deps, setDeps] = useStateB(1);
  const [signed, setSigned] = useStateB(false);
  const [doneForms, setDoneForms] = useStateB([]);
  const [stamp, setStamp] = useStateB(false);

  const form = FORMS.find((f) => f.id === formId);
  const isDone = doneForms.includes(form.code);
  const claim = deps * 2000;

  const pickForm = (id) => {
    const c = FORMS.find((f) => f.id === id).code;
    setFormId(id);
    setSigned(doneForms.includes(c));
  };
  const submit = () => {
    if (!fullName.trim() || !signed) return;
    setStamp(true);
    setTimeout(() => setStamp(false), 750);
    setDoneForms((d) => (d.includes(form.code) ? d : [...d, form.code]));
  };

  const Row = ({ label, value, mono }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 14, padding: "7px 0", borderBottom: "1px dashed rgba(6,41,31,.16)" }}>
      <span style={{ fontSize: ".7rem", fontWeight: 700, color: "rgba(6,41,31,.5)", textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap" }}>{label}</span>
      <span className={mono ? "mono" : ""} style={{ fontSize: ".95rem", fontWeight: 700, color: "#16271e", textAlign: "right" }}>{value}</span>
    </div>
  );

  return (
    <section id="lab" ref={ref} style={{ padding: "70px 0" }}>
      <div className="wrap">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 44px" }}>
          <span className="eyebrow"><Icon name="doc" size={14} color="var(--emerald)" /> The Lab</span>
          <h2 className="sec-title">Fill out the forms <span style={{ color: "var(--emerald-2)" }}>adulthood throws at you.</span></h2>
          <p className="sec-sub" style={{ margin: "16px auto 0" }}>Students complete the real paperwork — W-4s, I-9s, direct deposit and year-end W-2s — in a safe sandbox. So the first time they sign one, it isn't on day one of a real job.</p>
        </div>

        <div className="reveal card" style={{ padding: 30, borderRadius: 30, display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 40, alignItems: "stretch", overflow: "hidden" }} >
          {/* paper preview */}
          <div className="lab-preview" style={{ background: "var(--dark)", borderRadius: 24, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 18, position: "relative", overflow: "hidden", justifyContent: "space-between" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(440px 200px at 50% 0%, rgba(43,182,115,.14), transparent)" }} />
            <div style={{ position: "relative", background: "#fbfdfb", borderRadius: 14, padding: "22px 22px 24px", boxShadow: "0 22px 50px rgba(0,0,0,.42)" }}>
              {isDone && (
                <div style={{ position: "absolute", top: 16, right: 14, transform: "rotate(-12deg)", border: "3px solid var(--up)", color: "var(--up)", borderRadius: 8, padding: "4px 12px", fontWeight: 800, fontSize: ".8rem", letterSpacing: ".12em", opacity: .9, animation: stamp ? "pop .5s ease" : "none" }}>FILED</div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "#16271e", letterSpacing: "-.02em", lineHeight: 1, padding: "8px 12px", border: "2px solid #16271e", borderRadius: 9 }}>{form.code}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: ".98rem", color: "#16271e", lineHeight: 1.2 }}>{form.title}</div>
                  <div className="mono" style={{ fontSize: ".68rem", color: "rgba(6,41,31,.5)", marginTop: 3 }}>{form.agency}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Row label="Legal name" value={fullName.trim() || "—"} />
                <Row label="Filing status" value={FILING[filing]} />
                <Row label="Dependents" value={deps} mono />
                <Row label="Est. annual credit" value={`$${claim.toLocaleString()}`} mono />
              </div>
              <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 30, borderBottom: "2px solid #16271e", display: "flex", alignItems: "flex-end", paddingBottom: 2 }}>
                    {signed && <span style={{ fontFamily: "'Brush Script MT', cursive", fontSize: "1.4rem", color: "#1c3a2c", lineHeight: 1 }}>{fullName.trim() || "—"}</span>}
                  </div>
                  <div style={{ fontSize: ".62rem", fontWeight: 700, color: "rgba(6,41,31,.5)", textTransform: "uppercase", letterSpacing: ".05em", marginTop: 4 }}>Employee signature</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ height: 30, borderBottom: "2px solid #16271e", minWidth: 86, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", paddingBottom: 2 }}>
                    <span className="mono" style={{ fontSize: ".82rem", color: "#16271e" }}>06 / 13 / 26</span>
                  </div>
                  <div style={{ fontSize: ".62rem", fontWeight: 700, color: "rgba(6,41,31,.5)", textTransform: "uppercase", letterSpacing: ".05em", marginTop: 4 }}>Date</div>
                </div>
              </div>
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span className="mono" style={{ color: "#7fae9a", fontSize: ".82rem" }}>{doneForms.length} of {FORMS.length} forms filed</span>
              <div style={{ display: "flex", gap: 7 }}>
                {FORMS.map((f) => (
                  <div key={f.id} title={f.code} style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 30, height: 30, padding: "0 8px", borderRadius: 8, fontSize: ".64rem", fontWeight: 800,
                    background: doneForms.includes(f.code) ? "var(--leaf)" : "rgba(255,255,255,.06)", color: doneForms.includes(f.code) ? "#042018" : "#7fae9a", transition: "all .25s" }}>{f.code}</div>
                ))}
              </div>
            </div>
          </div>

          {/* controls side */}
          <div>
            <LabField label="Choose a form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {FORMS.map((f) => {
                  const on = f.id === formId;
                  return (
                    <button key={f.id} onClick={() => pickForm(f.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 13, textAlign: "left", transition: "all .15s",
                      border: on ? "1.5px solid var(--accent)" : "1.5px solid var(--line)", background: on ? "rgba(21,96,74,.08)" : "var(--white)" }}>
                      <Icon name={f.icon} size={18} color={on ? "var(--accent)" : "rgba(6,41,31,.5)"} />
                      <span style={{ fontWeight: 700, fontSize: ".9rem", color: on ? "var(--ink)" : "rgba(6,41,31,.66)" }}>{f.code}
                        {doneForms.includes(f.code) && <span style={{ color: "var(--up)", marginLeft: 6 }}>✓</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </LabField>
            <LabField label="Legal name">
              <input value={fullName} maxLength={26} onChange={(e) => { setFullName(e.target.value); setSigned(false); }} className="lab-input" placeholder="First Last" />
            </LabField>
            <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 14 }}>
              <LabField label="Filing status">
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {FILING.map((s, i) => (
                    <button key={s} onClick={() => setFiling(i)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 10, textAlign: "left", transition: "all .15s",
                      background: filing === i ? "var(--accent)" : "var(--mint)", color: filing === i ? "#eafff5" : "var(--ink)", fontWeight: 700, fontSize: ".84rem" }}>
                      <span style={{ flexShrink: 0, width: 8, height: 8, borderRadius: 99, background: filing === i ? "#eafff5" : "rgba(6,41,31,.3)" }} />{s}
                    </button>
                  ))}
                </div>
              </LabField>
              <LabField label={`Dependents · ${deps}`}>
                <input type="range" min="0" max="4" step="1" value={deps} onChange={(e) => setDeps(+e.target.value)} className="lab-range" />
                <div className="mono" style={{ fontSize: ".74rem", color: "rgba(6,41,31,.5)", marginTop: 8 }}>Claim ≈ ${claim.toLocaleString()}</div>
              </LabField>
            </div>
            <LabField label="Signature">
              <button onClick={() => setSigned((s) => !s)} disabled={!fullName.trim()} style={{ width: "100%", padding: "13px 15px", borderRadius: 13, fontWeight: 700, fontSize: ".95rem", transition: "all .2s",
                border: signed ? "1.5px solid var(--up)" : "1.5px dashed var(--line)", background: signed ? "rgba(20,160,91,.1)" : "var(--mint)", color: signed ? "var(--up)" : "rgba(6,41,31,.6)", cursor: fullName.trim() ? "pointer" : "not-allowed" }}>
                {signed ? "✓ Signed — looks good" : "Tap to sign"}
              </button>
            </LabField>
            <button onClick={submit} disabled={!signed} className="btn btn-gold" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "1.05rem", marginTop: 2, opacity: signed ? 1 : .55, cursor: signed ? "pointer" : "not-allowed" }}>
              <Icon name="check" size={19} /> {isDone ? `${form.code} filed` : `File ${form.code}`}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .lab-input{ width:100%; padding:13px 15px; border-radius:13px; border:1.5px solid var(--line); background:var(--mint); font-size:1rem; font-weight:600; color:var(--ink); outline:none; transition:border .2s; }
        .lab-input:focus{ border-color:var(--accent); }
        .lab-range{ width:100%; accent-color:var(--accent); height:6px; margin-top:14px; }
        @media (max-width:780px){ .reveal.card{ grid-template-columns:1fr !important; } }
      `}</style>
    </section>
  );
}
function LabField({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: ".78rem", fontWeight: 700, color: "rgba(6,41,31,.6)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 9 }}>{label}</div>
      {children}
    </div>
  );
}

Object.assign(window, { IdeaToLife, HowItWorks, StockSim, Lab });
