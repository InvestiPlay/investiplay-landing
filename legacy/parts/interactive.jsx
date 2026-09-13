// interactive.jsx — Loader, ScrollProgress, Cursor, Marquee + draggable coins, Manifesto
const { useState: useStateI, useEffect: useEffectI, useRef: useRefI, useCallback: useCBI } = React;

const coarsePointer = () => window.matchMedia("(hover: none), (pointer: coarse)").matches;

/* ============== INTRO LOADER (Late Checkout-style reveal) ============== */
function Loader({ enabled }) {
  const [phase, setPhase] = useStateI("init"); // init -> open -> gone
  const [count, setCount] = useStateI(0);
  useEffectI(() => {
    if (!enabled || coarsePointer() && false) {}
    const reduce = document.body.classList.contains("no-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled || reduce || sessionStorage.getItem("iplay_intro") === "1") { setPhase("gone"); return; }
    sessionStorage.setItem("iplay_intro", "1");
    document.body.style.overflow = "hidden";
    const t0 = performance.now();
    let raf;
    const tick = (now) => { const p = Math.min(1, (now - t0) / 1400); setCount(Math.round(p * 100)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const t1 = setTimeout(() => setPhase("open"), 1750);
    const t2 = setTimeout(() => { setPhase("gone"); document.body.style.overflow = ""; }, 2700);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); document.body.style.overflow = ""; };
  }, [enabled]);

  if (phase === "gone") return null;
  const opening = phase === "open";
  const Panel = ({ side }) => (
    <div style={{
      position: "absolute", left: 0, right: 0, height: "50%", [side]: 0,
      background: "linear-gradient(180deg,#0a3d2e,#06291f)",
      transform: opening ? `translateY(${side === "top" ? "-101%" : "101%"})` : "translateY(0)",
      transition: "transform .95s cubic-bezier(.76,0,.24,1)", zIndex: 1,
    }} />
  );
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: opening ? "none" : "auto", overflow: "hidden" }}
         onClick={() => setPhase("open")}>
      <Panel side="top" /><Panel side="bottom" />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22,
        opacity: opening ? 0 : 1, transition: "opacity .4s" }}>
        <div style={{ overflow: "hidden" }}>
          <div className="wordmark wordmark--light" style={{ fontSize: "clamp(2.2rem,7vw,4.2rem)", animation: "riseUp .7s cubic-bezier(.2,.7,.3,1) both" }}>
            Investi<span className="play">Play</span>
          </div>
        </div>
        <svg width="220" height="48" viewBox="0 0 220 48" style={{ display: "block" }}>
          <path d="M4 40 L40 30 L70 36 L100 18 L140 26 L175 8 L216 14" fill="none" stroke="#3fe08f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            style={{ strokeDasharray: 340, strokeDashoffset: 340, animation: "drawLine 1.3s ease forwards .25s" }} />
          <circle cx="216" cy="14" r="5" fill="#3fe08f" style={{ opacity: 0, animation: "fadeDot .3s ease forwards 1.4s" }} />
        </svg>
        <div className="mono" style={{ color: "#7fae9a", fontSize: ".85rem", letterSpacing: ".25em", textTransform: "uppercase", display: "flex", gap: 10 }}>
          <span>Opening the market</span><span style={{ color: "#eafff5", width: 42, textAlign: "right" }}>{count}%</span>
        </div>
      </div>
      <style>{`
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        @keyframes fadeDot { to { opacity: 1; } }
      `}</style>
    </div>
  );
}

/* ============== SCROLL PROGRESS ============== */
function ScrollProgress() {
  const [w, setW] = useStateI(0);
  useEffectI(() => {
    const on = () => { const h = document.documentElement.scrollHeight - window.innerHeight; setW(h > 0 ? (window.scrollY / h) * 100 : 0); };
    window.addEventListener("scroll", on, { passive: true }); on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div style={{ position: "fixed", top: 0, left: 0, height: 3, width: `${w}%`, background: "linear-gradient(90deg,var(--leaf),var(--gold))", zIndex: 9000, transition: "width .08s linear", boxShadow: "0 0 10px rgba(43,182,115,.6)" }} />;
}

/* ============== CURSOR — normal pointer + yellow climax glow ============== */
function Cursor({ enabled }) {
  const glow = useRefI(null);
  useEffectI(() => {
    if (!enabled || coarsePointer()) return;
    const g = glow.current;
    let raf, x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    const move = (e) => { x = e.clientX; y = e.clientY; };
    const loop = () => { cx += (x - cx) * 0.3; cy += (y - cy) * 0.3; if (g) g.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; raf = requestAnimationFrame(loop); };
    loop();
    window.addEventListener("mousemove", move);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", move); };
  }, [enabled]);
  if (!enabled || coarsePointer()) return null;
  // OS cursor stays visible; this soft glow only lights up (yellow) during the InvestiPlay climax
  return <div ref={glow} className="cursor-glow" aria-hidden="true" />;
}

/* ============== MARQUEE + DRAGGABLE COINS ============== */
function DragCoin({ color, glyph, label, init }) {
  const ref = useRefI(null);
  useEffectI(() => {
    const el = ref.current; if (!el) return;
    let drag = false, sx = 0, sy = 0, ox = 0, oy = 0, x = 0, y = 0;
    const down = (e) => { drag = true; el.setPointerCapture(e.pointerId); sx = e.clientX; sy = e.clientY; ox = x; oy = y; el.style.transition = "none"; el.style.zIndex = 30; el.style.cursor = "grabbing"; };
    const moveE = (e) => { if (!drag) return; x = ox + (e.clientX - sx); y = oy + (e.clientY - sy); const rot = Math.max(-22, Math.min(22, (e.clientX - sx) * 0.12)); el.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg)`; };
    const up = () => { if (!drag) return; drag = false; el.style.transition = "transform .6s cubic-bezier(.2,1.4,.4,1)"; el.style.transform = `translate(${x}px,${y}px) rotate(0deg)`; el.style.cursor = "grab"; };
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", moveE); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    return () => { el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", moveE); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); };
  }, []);
  return (
    <div ref={ref} data-cur="drag me" title="drag me!" style={{
      position: "absolute", ...init, width: 76, height: 76, borderRadius: "50%", cursor: "grab", touchAction: "none", userSelect: "none",
      background: `radial-gradient(circle at 34% 28%, ${color}, ${color} 58%, rgba(0,0,0,.3))`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      boxShadow: `0 12px 28px ${color}66, inset 0 -5px 12px rgba(0,0,0,.28), inset 0 5px 10px rgba(255,255,255,.32)`,
      border: "3px solid rgba(255,255,255,.4)", zIndex: 4,
    }}>
      <span style={{ fontSize: 24, color: "#fff", lineHeight: 1, textShadow: "0 2px 5px rgba(0,0,0,.25)" }}>{glyph}</span>
      <span className="mono" style={{ fontSize: ".5rem", color: "#fff", fontWeight: 700, marginTop: 2, letterSpacing: ".05em" }}>{label}</span>
    </div>
  );
}

/* ============== PHYSICS BAND (Lusion-style cursor force field) ============== */
const BLOCK_ITEMS = [
  { t: "Learn by doing", bg: "var(--leaf)", fg: "#042018", fs: "1.55rem", home: [0.26, 0.34] },
  { t: "Trade live", bg: "var(--ink)", fg: "#eafff5", fs: "1.7rem", home: [0.7, 0.22] },
  { t: "Level up", bg: "var(--gold)", fg: "#3a2a06", fs: "1.95rem", home: [0.5, 0.52] },
  { t: "Compete", bg: "var(--emerald-2)", fg: "#eafff5", fs: "1.7rem", home: [0.85, 0.56] },
  { t: "Build businesses", bg: "var(--white)", fg: "var(--ink)", fs: "1.45rem", home: [0.28, 0.72], border: true },
  { t: "$", bg: "var(--gold)", fg: "#3a2a06", fs: "1.7rem", round: true, home: [0.12, 0.62] },
  { t: "★", bg: "var(--leaf)", fg: "#042018", fs: "1.45rem", round: true, home: [0.9, 0.28] },
  { t: "XP", bg: "#2563eb", fg: "#eafff5", fs: "1.35rem", round: true, home: [0.46, 0.86] },
];

function PhysicsBand() {
  const wrapRef = useRefI(null);
  const nodes = useRefI([]);
  const blocks = useRefI([]);
  const P = useRefI({ x: -9999, y: -9999, active: false, grab: -1 });
  const reduce = typeof document !== "undefined" && document.body.classList.contains("no-motion");

  useEffectI(() => {
    if (reduce) return;
    const wrap = wrapRef.current; if (!wrap) return;
    let W = wrap.clientWidth, H = wrap.clientHeight;
    const init = () => {
      W = wrap.clientWidth; H = wrap.clientHeight;
      blocks.current = nodes.current.map((node, i) => {
        const hw = node.offsetWidth / 2, hh = node.offsetHeight / 2;
        const hx = BLOCK_ITEMS[i].home[0] * W, hy = BLOCK_ITEMS[i].home[1] * H;
        const prev = blocks.current[i];
        return { x: prev ? prev.x : hx, y: prev ? prev.y : hy, vx: 0, vy: 0, hw, hh, hx, hy, rot: prev ? prev.rot : 0 };
      });
    };
    init();
    const onResize = () => init();
    window.addEventListener("resize", onResize);

    const RAD = 175, STR = 2.6, FR = 0.9, K = 0.015, MAXV = 64;
    let raf;
    const step = () => {
      const B = blocks.current;
      for (let i = 0; i < B.length; i++) {
        const b = B[i];
        if (P.current.grab !== i) {
          b.vx += (b.hx - b.x) * K; b.vy += (b.hy - b.y) * K;          // spring home
          if (P.current.active && P.current.grab === -1) {             // cursor repulsion
            const dx = b.x - P.current.x, dy = b.y - P.current.y, d = Math.hypot(dx, dy) || 1;
            if (d < RAD) { const f = (1 - d / RAD) * STR; b.vx += (dx / d) * f; b.vy += (dy / d) * f; }
          }
          b.vx *= FR; b.vy *= FR;
          b.vx = Math.max(-MAXV, Math.min(MAXV, b.vx)); b.vy = Math.max(-MAXV, Math.min(MAXV, b.vy));
          b.x += b.vx; b.y += b.vy;
        }
        if (b.x - b.hw < 0) { b.x = b.hw; b.vx = Math.abs(b.vx) * 0.5; }
        if (b.x + b.hw > W) { b.x = W - b.hw; b.vx = -Math.abs(b.vx) * 0.5; }
        if (b.y - b.hh < 0) { b.y = b.hh; b.vy = Math.abs(b.vy) * 0.5; }
        if (b.y + b.hh > H) { b.y = H - b.hh; b.vy = -Math.abs(b.vy) * 0.5; }
      }
      for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {  // collisions
        const a = B[i], c = B[j];
        const dx = c.x - a.x, dy = c.y - a.y;
        const ox = (a.hw + c.hw) - Math.abs(dx), oy = (a.hh + c.hh) - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          if (ox < oy) { const p = ox / 2 * (dx < 0 ? -1 : 1); a.x -= p; c.x += p; const t = a.vx; a.vx = c.vx * 0.6; c.vx = t * 0.6; }
          else { const p = oy / 2 * (dy < 0 ? -1 : 1); a.y -= p; c.y += p; const t = a.vy; a.vy = c.vy * 0.6; c.vy = t * 0.6; }
        }
      }
      for (let i = 0; i < B.length; i++) {
        const b = B[i], node = nodes.current[i]; if (!node) continue;
        const target = Math.max(-15, Math.min(15, b.vx * 0.9));
        b.rot += (target - b.rot) * 0.1;
        node.style.transform = `translate(${b.x - b.hw}px, ${b.y - b.hh}px) rotate(${b.rot}deg)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const rect = () => wrap.getBoundingClientRect();
    const onMove = (e) => {
      const r = rect(); const x = e.clientX - r.left, y = e.clientY - r.top;
      if (P.current.grab !== -1) { const b = blocks.current[P.current.grab]; if (b) { b.vx = x - b.x; b.vy = y - b.y; b.x = x; b.y = y; } }
      P.current.x = x; P.current.y = y; P.current.active = true;
    };
    const onLeave = () => { P.current.active = false; P.current.grab = -1; };
    const onDown = (e) => {
      const r = rect(); const x = e.clientX - r.left, y = e.clientY - r.top;
      const B = blocks.current;
      for (let i = B.length - 1; i >= 0; i--) { const b = B[i]; if (Math.abs(x - b.x) < b.hw && Math.abs(y - b.y) < b.hh) { P.current.grab = i; nodes.current[i].style.cursor = "grabbing"; nodes.current[i].style.zIndex = 20; break; } }
    };
    const onUp = () => { const g = P.current.grab; if (g !== -1 && nodes.current[g]) { nodes.current[g].style.cursor = "grab"; nodes.current[g].style.zIndex = ""; } P.current.grab = -1; };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize); window.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointermove", onMove); wrap.removeEventListener("pointerleave", onLeave); wrap.removeEventListener("pointerdown", onDown);
    };
  }, []);

  const blockStyle = (it) => ({
    position: reduce ? "relative" : "absolute", left: 0, top: 0,
    display: "inline-flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap",
    padding: it.round ? "0" : "16px 26px", width: it.round ? 64 : "auto", height: it.round ? 64 : "auto",
    borderRadius: it.round ? "50%" : 18, background: it.bg, color: it.fg,
    border: it.border ? "1.5px solid var(--line)" : "none",
    fontWeight: 800, fontSize: it.fs, letterSpacing: "-.02em",
    boxShadow: "0 12px 30px rgba(6,41,31,.16), inset 0 1px 0 rgba(255,255,255,.18)",
    cursor: "grab", userSelect: "none", touchAction: "none", willChange: "transform",
  });

  return (
    <section className="grain" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
      <div className="econ-banner" aria-hidden="true">
        <div className="econ-banner-track">
          <img src={window.__resources.economyBanner} alt="" />
          <img src={window.__resources.economyBanner} alt="" />
        </div>
      </div>
      <div style={{ position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)", zIndex: 2, pointerEvents: "none" }}>
        <span className="eyebrow">An entire economy to play in</span>
      </div>
      <div ref={wrapRef} className="pfield"
        style={{ position: "relative", height: "clamp(440px,62vh,640px)", zIndex: 1,
          ...(reduce ? { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 18, padding: "90px 32px" } : {}) }}>
        {BLOCK_ITEMS.map((it, i) => (
          <div key={it.t} ref={(el) => (nodes.current[i] = el)} style={blockStyle(it)}>{it.t}</div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", color: "rgba(6,41,31,.42)", fontSize: ".74rem", fontWeight: 600, zIndex: 2, pointerEvents: "none" }}>↑ sweep your cursor through the words — grab one and throw it ↑</div>
      <style>{`
        .econ-banner { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none;
          opacity: .5; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
        .econ-banner-track { display: flex; width: max-content; height: 100%; align-items: center;
          animation: econScroll 90s linear infinite; }
        .econ-banner-track img { height: 100%; width: auto; display: block; object-fit: cover; }
        @keyframes econScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        body.no-motion .econ-banner-track { animation: none; }
      `}</style>
    </section>
  );
}

/* ============== FINANCIAL-LITERACY BACKDROP (faint charts) ============== */
function FinanceBackdrop() {
  return (
    <svg className="fin-bg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {/* grid */}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={"h" + i} x1="0" y1={80 + i * 75} x2="1200" y2={80 + i * 75} stroke="#3fe08f" strokeWidth="1" opacity="0.06" />
      ))}
      {/* area chart */}
      <path d="M0 470 L120 430 L240 450 L360 360 L480 390 L600 280 L720 310 L840 210 L960 250 L1080 150 L1200 190 L1200 600 L0 600 Z" fill="#3fe08f" opacity="0.05" />
      <path className="fin-line" d="M0 470 L120 430 L240 450 L360 360 L480 390 L600 280 L720 310 L840 210 L960 250 L1080 150 L1200 190" fill="none" stroke="#3fe08f" strokeWidth="3" opacity="0.35" strokeLinecap="round" strokeLinejoin="round" />
      {/* candlesticks */}
      {[[140, 300, 120, 60], [300, 340, 110, 70], [470, 250, 150, 50], [640, 300, 100, 80], [820, 200, 140, 60], [1000, 250, 120, 70]].map((c, i) => {
        const [x, y, h, wick] = c;
        const up = i % 2 === 0;
        return (
          <g key={i} opacity="0.16">
            <line x1={x} y1={y - wick} x2={x} y2={y + h + wick} stroke={up ? "#2bb673" : "#e0a52e"} strokeWidth="2" />
            <rect x={x - 9} y={y} width="18" height={h} rx="2" fill={up ? "#2bb673" : "#e0a52e"} />
          </g>
        );
      })}
      {/* floating glyphs */}
      <text x="90" y="140" fill="#e0a52e" opacity="0.14" fontSize="54" fontWeight="800">$</text>
      <text x="1080" y="470" fill="#3fe08f" opacity="0.14" fontSize="48" fontWeight="800">%</text>
      <text x="540" y="120" fill="#3fe08f" opacity="0.12" fontSize="40" fontWeight="800">↗</text>
    </svg>
  );
}

/* ============== MANIFESTO (scroll reveal) ============== */
const FRAMES = [
  { type: "school", k: "School taught you", big: "You learned the ", em: "alphabet", rest: ".", scene: "alpha" },
  { type: "school", k: "School taught you", big: "You learned the ", em: "quadratic formula", rest: ".", scene: "math" },
  { type: "school", k: "School taught you", big: "You memorized the ", em: "periodic table", rest: ".", scene: "lab" },
  { type: "gap", k: "The gap", big: "But no one ever ", em: "taught you", rest: "…" },
  { type: "finlit" },
  { type: "word", word: "Welcome" },
  { type: "word", word: "To" },
];

function Scene({ which }) {
  if (which === "alpha") return <SceneAlphabet />;
  if (which === "math") return <SceneMath />;
  if (which === "lab") return <SceneLab />;
  return null;
}

function SchoolFrame({ m }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "min(3.2vh,30px)", width: "100%" }}>
      <div style={{ textAlign: "center" }}>
        <div className="mono" style={{ color: "#4fd99b", fontSize: ".76rem", letterSpacing: ".26em", textTransform: "uppercase", marginBottom: 12 }}>{m.k}</div>
        <h2 style={{ color: "#eafff5", fontSize: "clamp(1.5rem,3.6vw,2.7rem)", fontWeight: 800, letterSpacing: "-.035em", margin: "0 auto", lineHeight: 1.08, maxWidth: "12em" }}>
          {m.big}<span style={{ color: "#3fe08f" }}>{m.em}</span>{m.rest}
        </h2>
      </div>
      <Scene which={m.scene} />
    </div>
  );
}

function FinLitFrame({ o = 1 }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <FinanceBackdrop />
      <div className="finlit-glow" />
      <div style={{ position: "relative", textAlign: "center", zIndex: 2 }}>
        <div className="mono" style={{ color: "#4fd99b", fontSize: ".8rem", letterSpacing: ".26em", textTransform: "uppercase", marginBottom: 18 }}>What school skipped</div>
        <h2 className="finlit-title">Financial Literacy</h2>
        <p style={{ color: "#9cc4b3", fontSize: "clamp(1rem,1.5vw,1.2rem)", maxWidth: "40ch", margin: "20px auto 0", lineHeight: 1.55 }}>
          The one subject that quietly runs every single day of your life.
        </p>
      </div>
      {/* Jeff flows in from below, gazing up in awe */}
      <div className="finlit-jeff" style={{ transform: `translateY(${(1 - o) * 90}px)`, opacity: o }}>
        <Jeff uid="fl" look="up" expr="wow" size={140} />
      </div>
    </div>
  );
}

function WordFrame({ word }) {
  return <h2 className="intro-word">{word}</h2>;
}

function Manifesto() {
  const wrapRef = useRefI(null);
  const [p, setP] = useStateI(0);
  const reduce = typeof document !== "undefined" && document.body.classList.contains("no-motion");
  const N = FRAMES.length;
  const lockedRef = useRefI(true);
  useEffectI(() => {
    const on = () => {
      const el = wrapRef.current; if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(total, Math.max(0, -el.getBoundingClientRect().top));
      setP(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on); on();
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  // INTRO ONLY: no free scrolling — the Next button is the sole way through the slides
  useEffectI(() => {
    if (reduce) return;
    const el = wrapRef.current;
    if (el && el.getBoundingClientRect().bottom < window.innerHeight * 0.5) lockedRef.current = false;
    const KEYS = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Spacebar"];
    const blockWheel = (e) => { if (lockedRef.current) e.preventDefault(); };
    const blockKey = (e) => { if (lockedRef.current && KEYS.includes(e.key)) e.preventDefault(); };
    window.addEventListener("wheel", blockWheel, { passive: false });
    window.addEventListener("touchmove", blockWheel, { passive: false });
    window.addEventListener("keydown", blockKey, true);
    return () => {
      window.removeEventListener("wheel", blockWheel); window.removeEventListener("touchmove", blockWheel);
      window.removeEventListener("keydown", blockKey, true);
    };
  }, []);

  // advance one slide per press; on the last slide, release the lock and move into the climax
  const goNext = () => {
    const el = wrapRef.current; if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const docTop = window.scrollY + el.getBoundingClientRect().top;
    const cur = Math.round(p * (N - 1));            // nearest frame index (frame i centred at i/(N-1))
    const next = cur + 1;
    if (next > N - 1) {
      lockedRef.current = false;                     // free scrolling resumes after the intro
      const climax = document.querySelector(".climax");
      const cy = climax ? window.scrollY + climax.getBoundingClientRect().top + 4 : docTop + total + window.innerHeight * 0.5;
      window.scrollTo({ top: cy, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: docTop + (next / (N - 1)) * total, behavior: "smooth" });
  };

  const renderInner = (f, o) => {
    if (f.type === "school") return <SchoolFrame m={f} />;
    if (f.type === "finlit") return <FinLitFrame o={o} />;
    if (f.type === "word") return <WordFrame word={f.word} />;
    return (
      <div style={{ textAlign: "center" }}>
        <div className="mono" style={{ color: "#4fd99b", fontSize: ".82rem", letterSpacing: ".26em", textTransform: "uppercase", marginBottom: 16 }}>{f.k}</div>
        <h2 style={{ color: "#eafff5", fontSize: "clamp(1.9rem,4.6vw,3.6rem)", fontWeight: 800, letterSpacing: "-.035em", margin: "0 auto", lineHeight: 1.1, maxWidth: "9em" }}>
          {f.big}<span style={{ color: "#3fe08f" }}>{f.em}</span>{f.rest}
        </h2>
      </div>
    );
  };

  if (reduce) {
    return (
      <section id="why" style={{ background: "var(--dark)", padding: "90px 0" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 70, alignItems: "center" }}>
          {FRAMES.map((f, i) => <div key={i} style={{ width: "100%" }}>{renderInner(f, 1)}</div>)}
        </div>
      </section>
    );
  }

  return (
    <section id="why" ref={wrapRef} style={{ height: `${(N + 1) * 88}vh`, position: "relative", background: "var(--dark)" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 500px at 50% 50%, rgba(43,182,115,.08), transparent)" }} />
        {/* progress dots */}
        <div style={{ position: "absolute", left: "max(28px,4vw)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 12, zIndex: 4 }}>
          {Array.from({ length: N }).map((_, i) => {
            const active = Math.round(p * (N - 1)) === i;
            return <div key={i} style={{ width: active ? 10 : 7, height: active ? 10 : 7, borderRadius: "50%", background: active ? "#3fe08f" : "rgba(255,255,255,.2)", transition: "all .3s" }} />;
          })}
        </div>
        <div className="wrap" style={{ position: "relative", width: "100%", height: "100%" }}>
          {FRAMES.map((f, i) => {
            const center = N > 1 ? i / (N - 1) : 0.5;
            const dist = (p - center) * (N - 1);
            const opacity = Math.max(0, 1 - Math.abs(dist) * 1.5);
            const ty = dist * -64;
            const scale = 1 - Math.min(0.12, Math.abs(dist) * 0.12);
            return (
              <div key={i} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity, transform: `translateY(${ty}px) scale(${scale})`, pointerEvents: opacity > 0.5 ? "auto" : "none" }}>
                {renderInner(f, opacity)}
              </div>
            );
          })}
        </div>
        <button onClick={goNext} className="intro-next" aria-label="Next"
          style={{ bottom: p < 0.1 ? "120px" : "34px", opacity: 1, pointerEvents: "auto" }}>
          <span>Next</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {/* first-slide-only hint: make it obvious you advance with Next */}
        <div className="intro-firsthint" style={{ opacity: p < 0.06 ? 1 : 0, pointerEvents: "none" }}>
          <span className="intro-firsthint-label">Press <strong>Next</strong> to keep going</span>
          <svg className="intro-firsthint-arrow" width="34" height="46" viewBox="0 0 34 46" fill="none">
            <path d="M17 3v33M6 26l11 12 11-12" stroke="#3fe08f" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ============== CONFETTI BURST ============== */
function Confetti({ fire }) {
  const COLORS = ["#3fe08f", "#2bb673", "#e0a52e", "#5ab0ff", "#ff8da3", "#eafff5", "#b69bff"];
  const pieces = useRefI(null);
  if (!pieces.current) {
    pieces.current = Array.from({ length: 110 }).map(() => {
      const ang = Math.random() * Math.PI * 2;
      const spread = 120 + Math.random() * 520;
      return {
        c: COLORS[(Math.random() * COLORS.length) | 0],
        ux: Math.cos(ang) * spread * 0.45,
        uy: -(140 + Math.random() * 320),                 // burst upward/outward
        dx: Math.cos(ang) * spread + (Math.random() - 0.5) * 120,
        dy: 360 + Math.random() * 520,                    // gravity fall
        rot: (Math.random() - 0.5) * 1080,
        w: 7 + Math.random() * 9,
        h: 10 + Math.random() * 14,
        round: Math.random() < 0.3,
        delay: Math.random() * 0.25,
        dur: 1.7 + Math.random() * 1.3,
      };
    });
  }
  if (!fire) return null;
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 5 }}>
      {pieces.current.map((p, i) => (
        <span key={i} className="confetti-bit" style={{
          position: "absolute", left: "50%", top: "46%",
          width: p.w, height: p.round ? p.w : p.h, borderRadius: p.round ? "50%" : 2,
          background: p.c, opacity: 0,
          "--ux": p.ux + "px", "--uy": p.uy + "px", "--dx": p.dx + "px", "--dy": p.dy + "px", "--rot": p.rot + "deg",
          animation: `confettiPop ${p.dur}s cubic-bezier(.22,.7,.35,1) ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}

/* ============== CLIMAX — dark pause, then InvestiPlay in lights ============== */
function ClimaxReveal() {
  const ref = useRefI(null);
  const [stage, setStage] = useStateI("idle"); // idle -> dark -> reveal
  const started = useRefI(false);
  useEffectI(() => {
    const reduce = document.body.classList.contains("no-motion");
    let t1, t2;
    const lock = () => { document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden"; };
    const unlock = () => { document.documentElement.style.overflow = ""; document.body.style.overflow = ""; };
    const onScroll = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const pinned = r.top <= 1 && r.bottom >= window.innerHeight - 1;
      if (pinned) {
        document.body.classList.add("climax-cursor");
        if (!started.current) {
          started.current = true;
          if (reduce) { setStage("reveal"); }
          else {
            setStage("dark");
            lock();                                   // freeze scroll during the dramatic pause
            t1 = setTimeout(() => setStage("reveal"), 2000);
            t2 = setTimeout(() => unlock(), 3700);     // release only once "InvestiPlay" is fully lit
          }
        }
      } else {
        document.body.classList.remove("climax-cursor");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); clearTimeout(t1); clearTimeout(t2); unlock(); document.body.classList.remove("climax-cursor"); };
  }, []);
  const on = stage === "reveal";
  return (
    <section ref={ref} className="climax" style={{ height: "180vh", position: "relative", background: "#000" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div className={`climax-word ${on ? "on" : ""}`}>Investi<span>Play</span></div>
        <div className={`climax-jeff ${on ? "on" : ""}`}>
          <Jeff uid="climax" look="up" expr="wow" arm="point" size={150} />
        </div>
        <div className={`climax-hint ${on ? "on" : ""}`}>the rest is up to you ↓</div>
      </div>
    </section>
  );
}

Object.assign(window, { Loader, ScrollProgress, Cursor, PhysicsBand, Manifesto, ClimaxReveal, FinanceBackdrop });
