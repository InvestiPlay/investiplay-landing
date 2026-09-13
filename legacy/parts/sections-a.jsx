// sections-a.jsx — LiveTicker, Nav, Hero (3 variants)
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

/* ============== LIVE TICKER BAR ============== */
const SEED = [
  ["AAPL", 291.13], ["NVDA", 205.19], ["TSLA", 406.43], ["MSFT", 390.74],
  ["AMZN", 238.55], ["META", 566.98], ["GOOGL", 359.68], ["JPM", 320.72],
  ["SPY", 741.75], ["QQQ", 721.34], ["DIS", 118.40], ["NKE", 94.22],
];
function LiveTicker() {
  const [rows, setRows] = useStateA(() => SEED.map(([s, p]) => ({ s, p, base: p, chg: (Math.random() - 0.4) * 2 })));
  useEffectA(() => {
    const id = setInterval(() => {
      setRows((prev) => prev.map((r) => {
        const np = Math.max(1, r.p + (Math.random() - 0.5) * (r.p * 0.004));
        return { ...r, p: np, chg: ((np - r.base) / r.base) * 100 };
      }));
    }, 2200);
    return () => clearInterval(id);
  }, []);
  const Item = ({ r, k }) => (
    <span key={k} style={{ display: "inline-flex", alignItems: "baseline", gap: 8, padding: "0 22px", borderRight: "1px solid rgba(255,255,255,.09)" }}>
      <span style={{ fontWeight: 700, color: "#cfeede", fontSize: ".82rem", letterSpacing: ".02em" }}>{r.s}</span>
      <span className="mono" style={{ color: "#eafff5", fontSize: ".82rem" }}>${fmt(r.p)}</span>
      <span className="mono" style={{ fontSize: ".76rem", fontWeight: 600, color: r.chg >= 0 ? "#4fd99b" : "#ff8a80" }}>
        {r.chg >= 0 ? "▲" : "▼"} {Math.abs(r.chg).toFixed(2)}%
      </span>
    </span>
  );
  const loop = [...rows, ...rows];
  return (
    <div style={{ background: "linear-gradient(90deg,#06291f,#0a3d2e 60%,#06291f)", overflow: "hidden", height: 40, display: "flex", alignItems: "center", position: "relative", zIndex: 60 }}>
      <div style={{ display: "flex", whiteSpace: "nowrap", animation: "tickerScroll 42s linear infinite", willChange: "transform" }}>
        {loop.map((r, i) => <Item r={r} k={i} key={i} />)}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg,#06291f,transparent)" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(270deg,#06291f,transparent)" }} />
    </div>
  );
}

/* ============== NAV ============== */
function Nav({ onDemo }) {
  const [scrolled, setScrolled] = useStateA(false);
  useEffectA(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [["How it works", "#how"], ["Simulation", "#sim"], ["The Lab", "#lab"], ["Curriculum", "#curriculum"]];
  const linkBase = scrolled ? "rgba(6,41,31,.6)" : "rgba(234,255,245,.66)";
  const linkLit = scrolled ? "var(--accent)" : "#eafff5";
  const litBg = scrolled ? "rgba(21,96,74,.10)" : "rgba(255,255,255,.12)";
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50, transition: "all .3s",
      background: scrolled ? "rgba(231,240,234,.82)" : "rgba(231,240,234,0)",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="#top" className={`wordmark ${scrolled ? "" : "wordmark--light"}`} style={{ fontSize: "1.45rem", transition: "color .3s" }}>Investi<span className="play">Play</span></a>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="nav-links">
          {links.map(([t, h]) => (
            <a key={t} href={h} style={{ fontWeight: 600, fontSize: ".95rem", color: linkBase, padding: "8px 14px", borderRadius: 999, whiteSpace: "nowrap", transition: "color .2s, background .2s" }}
               onMouseEnter={(e) => { e.currentTarget.style.color = linkLit; e.currentTarget.style.background = litBg; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = linkBase; e.currentTarget.style.background = "transparent"; }}>{t}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="https://investiplay.app/auth" className="nav-login" style={{ fontWeight: 700, fontSize: ".95rem", whiteSpace: "nowrap", color: scrolled ? "var(--ink)" : "#eafff5", transition: "color .3s" }}>Log in</a>
          <button className="btn btn-primary" style={{ padding: "11px 20px", fontSize: ".92rem" }} onClick={onDemo}>Request a Demo</button>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px){ .nav-links{ display:none !important; } }
        @media (max-width: 560px){ .nav-login{ display:none !important; } }
      `}</style>
    </nav>
  );
}

/* ============== Mini app-preview card (used in hero) ============== */
function AppPreview() {
  const [series, setSeries] = useStateA(() => randomWalk(26, 100, 6));
  const [coins, setCoins] = useStateA(1240);
  useEffectA(() => {
    const id = setInterval(() => {
      setSeries((s) => { const n = [...s.slice(1), Math.max(40, s[s.length - 1] + (Math.random() - 0.45) * 9)]; return n; });
      setCoins((c) => c + Math.floor(Math.random() * 6));
    }, 1500);
    return () => clearInterval(id);
  }, []);
  const last = series[series.length - 1], first = series[0];
  const up = last >= first;
  const { d, area } = sparkPath(series, 320, 120, 6);
  return (
    <div style={{ position: "relative" }}>
      {/* floating gold coin chip */}
      <div style={{ position: "absolute", top: -22, right: 18, zIndex: 3, animation: "floaty 5s ease-in-out infinite" }}>
        <div className="pill-tag" style={{ background: "var(--gold-soft)", color: "#7a5a08", boxShadow: "var(--shadow-md)", fontSize: ".9rem", padding: "9px 14px" }}>
          <Icon name="coin" size={18} color="#caa12e" /> <span className="mono" style={{ fontWeight: 700 }}>{coins.toLocaleString()}</span> coins
        </div>
      </div>
      {/* floating level chip */}
      <div style={{ position: "absolute", bottom: 92, left: -30, zIndex: 3, animation: "floaty2 6s ease-in-out infinite" }}>
        <div className="pill-tag" style={{ background: "var(--white)", color: "var(--emerald)", boxShadow: "var(--shadow-md)", fontSize: ".9rem", padding: "9px 14px", border: "1px solid var(--line)" }}>
          <Icon name="spark" size={18} color="var(--gold)" /> Level 7 · Investor
        </div>
      </div>

      <div className="card" style={{ padding: 20, borderRadius: 26, boxShadow: "var(--shadow-lg)", background: "var(--white)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: ".8rem", color: "rgba(6,41,31,.55)", fontWeight: 600 }}>Portfolio value</div>
            <div className="mono" style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-.02em" }}>${fmt(10000 + (last - 100) * 84)}</div>
          </div>
          <span className="pill-tag" style={{ background: up ? "rgba(20,160,91,.12)" : "rgba(224,82,74,.12)", color: up ? "var(--up)" : "var(--down)" }}>
            {up ? "▲" : "▼"} {(((last - first) / first) * 100).toFixed(2)}%
          </span>
        </div>
        <div style={{ background: "var(--dark)", borderRadius: 18, padding: "16px 14px 10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "#7fae9a", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em" }}>IPLAY · GROWTH FUND</span>
            <span style={{ color: "#4fd99b", fontSize: ".72rem" }} className="mono">LIVE</span>
          </div>
          <svg viewBox="0 0 320 120" style={{ width: "100%", height: 96, display: "block" }}>
            <defs>
              <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2bb673" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2bb673" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#hg)" />
            <path d={d} fill="none" stroke="#3fe08f" strokeWidth="2.4" strokeLinecap="round" style={{ transition: "all .6s" }} />
          </svg>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
          {[["Lessons", "12/40"], ["Streak", "9 🔥"], ["Rank", "#3"]].map(([k, v]) => (
            <div key={k} style={{ background: "var(--mint)", borderRadius: 12, padding: "9px 10px", textAlign: "center" }}>
              <div style={{ fontSize: ".68rem", color: "rgba(6,41,31,.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>{k}</div>
              <div className="mono" style={{ fontWeight: 700, fontSize: ".95rem", marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============== HERO ============== */
const HEADLINES = {
  default: ["The financial literacy class", "students actually finish."],
  graduation: ["Money skills that", "count toward graduation."],
  game: ["Learn to invest", "by actually playing."],
};
function Hero({ heroStyle, headline, onDemo }) {
  const hl = HEADLINES[headline] || HEADLINES.default;
  const Sub = () => (
    <p style={{ fontSize: "1.18rem", lineHeight: 1.55, color: "rgba(6,41,31,.7)", maxWidth: "32ch", margin: "0 0 32px" }}>
      A gamified, <strong style={{ color: "var(--ink)" }}>curriculum-aligned</strong> financial-literacy app for middle &amp; high schoolers. They learn by <em style={{ fontStyle: "normal", color: "var(--emerald-2)", fontWeight: 700 }}>doing</em> — trading a live market sim, building businesses, and minting tokens in The Lab.
    </p>
  );
  const Ctas = ({ center }) => (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: center ? "center" : "flex-start" }}>
      <button className="btn btn-primary" style={{ padding: "16px 30px", fontSize: "1.05rem" }} onClick={onDemo}>
        Request a Demo <Icon name="arrow" size={19} />
      </button>
      <a href="#sim" className="btn btn-ghost" style={{ padding: "16px 26px", fontSize: "1.05rem" }}>
        <Icon name="play" size={19} /> Try the simulator
      </a>
    </div>
  );
  const Badges = ({ center }) => (
    <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginTop: 30, justifyContent: center ? "center" : "flex-start", color: "rgba(6,41,31,.6)", fontWeight: 600, fontSize: ".92rem" }}>
      <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><Icon name="check" size={17} color="var(--emerald-2)" /> Meets state requirements</span>
      <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><Icon name="check" size={17} color="var(--emerald-2)" /> No prep for teachers</span>
      <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><Icon name="check" size={17} color="var(--emerald-2)" /> Free for families</span>
    </div>
  );

  /* ---- SPLIT ---- */
  if (heroStyle === "split") {
    return (
      <header id="top" className="grain" style={{ position: "relative", paddingTop: 40, paddingBottom: 70, overflow: "hidden" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 56, alignItems: "center" }} >
          <div className="hero-col">
            <span className="eyebrow"><Icon name="cap" size={15} color="var(--emerald)" /> Grades 6–12 · Standards-aligned</span>
            <h1 style={{ fontSize: "clamp(2.6rem,5vw,4.3rem)", fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1.02, margin: "20px 0 22px" }}>
              {hl[0]}<br /><span style={{ color: "var(--emerald-2)" }}>{hl[1]}</span>
            </h1>
            <Sub /><Ctas /><Badges />
          </div>
          <div style={{ animation: "floaty 8s ease-in-out infinite" }}><AppPreview /></div>
        </div>
      </header>
    );
  }

  /* ---- CENTERED with orbiting badges ---- */
  if (heroStyle === "centered") {
    const orbit = [
      { icon: "book", label: "Missions", c: "#1c8059", x: "8%", y: "20%", d: "7s" },
      { icon: "flask", label: "The Lab", c: "#caa12e", x: "84%", y: "16%", d: "8s" },
      { icon: "chart", label: "Live Sim", c: "#14a05b", x: "12%", y: "70%", d: "9s" },
      { icon: "trophy", label: "Leaderboard", c: "#e0a52e", x: "82%", y: "68%", d: "6.5s" },
    ];
    return (
      <header id="top" className="grain" style={{ position: "relative", paddingTop: 60, paddingBottom: 60, overflow: "hidden" }}>
        <div className="wrap" style={{ textAlign: "center", position: "relative", maxWidth: 920 }}>
          {orbit.map((o, i) => (
            <div key={i} className="orbit-chip" style={{ position: "absolute", left: o.x, top: o.y, animation: `floaty ${o.d} ease-in-out infinite`, zIndex: 2 }}>
              <div className="pill-tag" style={{ background: "var(--white)", boxShadow: "var(--shadow-md)", border: "1px solid var(--line)", padding: "10px 15px", fontSize: ".92rem", color: "var(--ink)" }}>
                <Icon name={o.icon} size={18} color={o.c} /> {o.label}
              </div>
            </div>
          ))}
          <span className="eyebrow" style={{ marginTop: 18 }}><Icon name="cap" size={15} color="var(--emerald)" /> Grades 6–12 · Standards-aligned</span>
          <h1 style={{ fontSize: "clamp(2.7rem,6.4vw,5rem)", fontWeight: 800, letterSpacing: "-.045em", lineHeight: 1.0, margin: "22px 0 22px" }}>
            {hl[0]}<br /><span style={{ color: "var(--emerald-2)" }}>{hl[1]}</span>
          </h1>
          <div style={{ margin: "0 auto" }}><div style={{ maxWidth: "46ch", margin: "0 auto" }}>
            <p style={{ fontSize: "1.2rem", lineHeight: 1.55, color: "rgba(6,41,31,.7)", margin: "0 0 32px" }}>
              A gamified, <strong style={{ color: "var(--ink)" }}>curriculum-aligned</strong> financial-literacy app where students learn by <em style={{ fontStyle: "normal", color: "var(--emerald-2)", fontWeight: 700 }}>doing</em> — not by reading a textbook.
            </p>
          </div></div>
          <Ctas center /><Badges center />
        </div>
        <style>{`@media (max-width:780px){ .orbit-chip{ display:none !important; } }`}</style>
      </header>
    );
  }

  /* ---- EDITORIAL (huge type + dark panel) ---- */
  return (
    <header id="top" className="grain" style={{ position: "relative", paddingTop: 36, paddingBottom: 0, overflow: "hidden" }}>
      <div className="wrap">
        <span className="eyebrow"><Icon name="cap" size={15} color="var(--emerald)" /> Grades 6–12 · Standards-aligned</span>
        <h1 style={{ fontSize: "clamp(3rem,9vw,7rem)", fontWeight: 800, letterSpacing: "-.05em", lineHeight: .94, margin: "16px 0 0" }}>
          {hl[0]}<br /><span style={{ color: "var(--emerald-2)" }}>{hl[1]}</span>
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "end", marginTop: 36 }} className="ed-grid">
          <div>
            <Sub /><Ctas /><Badges />
          </div>
          <div style={{ marginBottom: -50 }}><AppPreview /></div>
        </div>
      </div>
      <div style={{ height: 50 }} />
      <style>{`@media (max-width:820px){ .ed-grid{ grid-template-columns:1fr !important; } }`}</style>
    </header>
  );
}

Object.assign(window, { LiveTicker, Nav, Hero, AppPreview });
