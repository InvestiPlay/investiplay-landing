// sections-c.jsx — Curriculum path, FinalCTA, DemoModal, Footer
const { useState: useStateC, useEffect: useEffectC } = React;

/* ============== CURRICULUM LEARNING PATH ============== */
// The real curriculum: 10 levels → 35 units → 300+ lessons (mirrors the app's
// unitInfo / LEVEL_TITLES). `units` is how many units live in each level.
const UNITS = [
  { n: "1",  title: "Money Foundations",      std: "Psychology of money · Income · Budgeting · Investing basics", units: 4,  icon: "spark" },
  { n: "2",  title: "Banking & Credit",       std: "Banking · Credit & debt · Insurance",                         units: 3,  icon: "shield" },
  { n: "3",  title: "Investing Core",         std: "Intro to investing · Stocks · How markets work",              units: 3,  icon: "chart" },
  { n: "4",  title: "Portfolio Strategy",     std: "Portfolios · ETFs & funds · Bonds",                           units: 3,  icon: "coin" },
  { n: "5",  title: "Company Analysis",       std: "Financial statements · Ratios · Valuation",                   units: 3,  icon: "doc" },
  { n: "6",  title: "Behavioral Finance",     std: "Behavioral economics · Bubbles & crashes",                    units: 2,  icon: "users" },
  { n: "7",  title: "Macro Economics",        std: "Inflation & rates · Economic indicators",                     units: 2,  icon: "target" },
  { n: "8",  title: "Entrepreneurship",       std: "Starting a business · Strategy · Marketing · Leadership",     units: 11, icon: "rocket" },
  { n: "9",  title: "Advanced Investing",     std: "Options · Alternative investments",                           units: 2,  icon: "bolt" },
  { n: "10", title: "Real-World Application", std: "10-year financial plan · Market simulations",                 units: 2,  icon: "trophy" },
];

// horizontal fraction (0..1) of each level node — alternates around the centre so
// every label sits on the OUTER side, clear of the squiggle that runs up the middle
const ZIG_FX = UNITS.map((_, i) => (i % 2 === 0 ? 0.30 : 0.70));

// Jeff hanging out on Level 5 of the path: one flip on arrival, then a "click me!"
// nudge — every click makes him flip again.
function PathJeff() {
  const [flipKey, setFlipKey] = useStateC(0);
  const [hint, setHint] = useStateC(false);
  useEffectC(() => {
    const t = setTimeout(() => setHint(true), 1250); // after the first flip finishes
    return () => clearTimeout(t);
  }, []);
  return (
    <div role="button" aria-label="Make Jeff flip" style={{ position: "relative", cursor: "pointer" }}
      onClick={() => { setHint(false); setFlipKey(k => k + 1); }}>
      <div key={flipKey} className="jeff-flip-once">
        <Jeff uid="path" size={120} idle={false} arm="point" look="up" expr="happy" />
      </div>
      {hint && <div className="jeff-clickme">click me!</div>}
    </div>
  );
}

function Curriculum() {
  const ref = useReveal();
  const trackRef = useRef(null);
  const nodeRefs = useRef([]);
  const blockRefs = useRef([]);
  const [layout, setLayout] = useStateC({ h: 0, w: 0, circles: [], blocks: [] });

  // ----- build the zigzag geometry from the container width -----
  useEffectC(() => {
    const el = trackRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      const narrow = w < 560;
      const R = narrow ? 30 : 40;
      const rowGap = narrow ? 150 : 196;
      const topPad = R + 14;
      const botPad = R + 30;
      // on narrow screens pull the horizontal spread toward centre so labels fit
      const fx = (f) => narrow ? 0.5 + (f - 0.5) * 0.5 : f;
      const circles = UNITS.map((_, i) => ({ x: fx(ZIG_FX[i]) * w, y: topPad + i * rowGap, r: R, i }));
      const h = topPad + (UNITS.length - 1) * rowGap + botPad;

      // cumulative distance along centre polyline → thresholds
      const segLen = [];
      let total = 0;
      for (let i = 0; i < circles.length - 1; i++) {
        const d = Math.hypot(circles[i + 1].x - circles[i].x, circles[i + 1].y - circles[i].y);
        segLen.push(d); total += d;
      }
      let cum = 0;
      circles[0].t = 0.05;
      for (let i = 1; i < circles.length; i++) { cum += segLen[i - 1]; circles[i].t = cum / total; }

      // little blocks that make up each connector — laid along a true SQUIGGLE
      // (a sine wave that wiggles in and out as it travels between two nodes)
      const blocks = [];
      const bs = narrow ? 9 : 11;
      const gap = narrow ? 9 : 11;
      const clear = R + 9;           // keep blocks off the circles
      const TWO_PI = Math.PI * 2;
      let before = 0;
      for (let i = 0; i < circles.length - 1; i++) {
        const a = circles[i], b = circles[i + 1], d = segLen[i];
        const ux = (b.x - a.x) / d, uy = (b.y - a.y) / d;
        const px = -uy, py = ux;     // perpendicular (the wiggle axis)
        const waves = 2.5;           // number of half-oscillations along the segment
        const amp = Math.min(40, Math.max(22, d * 0.11));
        // sample densely along the wavy curve, then drop blocks at even arc-length
        const samples = 220;
        const pts = [];
        let arc = 0, prevX = a.x, prevY = a.y;
        for (let s = 0; s <= samples; s++) {
          const tt = s / samples;
          const wob = Math.sin(tt * Math.PI * waves) * amp;
          const x = a.x + ux * d * tt + px * wob;
          const y = a.y + uy * d * tt + py * wob;
          if (s > 0) arc += Math.hypot(x - prevX, y - prevY);
          // tangent of the wavy curve
          const dwob = Math.cos(tt * Math.PI * waves) * amp * Math.PI * waves / d;
          const tgx = ux + px * dwob, tgy = uy + py * dwob;
          pts.push({ x, y, arc, ang: Math.atan2(tgy, tgx) * 180 / Math.PI });
          prevX = x; prevY = y;
        }
        const arcLen = arc;
        const step = bs + gap;
        const n = Math.max(4, Math.round((arcLen - clear * 2) / step));
        for (let k = 0; k < n; k++) {
          const targetArc = clear + (k + 0.5) * (arcLen - clear * 2) / n;
          // find sample at this arc length
          let lo = 0; while (lo < pts.length - 1 && pts[lo].arc < targetArc) lo++;
          const p = pts[lo];
          if (Math.hypot(p.x - a.x, p.y - a.y) < clear || Math.hypot(p.x - b.x, p.y - b.y) < clear) continue;
          blocks.push({
            x: p.x, y: p.y, size: bs, ang: p.ang,
            t: (before + arcLen * (targetArc / arcLen)) / total,
          });
        }
        before += d;
      }
      setLayout({ h, w, circles, blocks });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ----- drive unlock progress from scroll position -----
  useEffectC(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, (vh * 0.8 - rect.top) / (rect.height * 0.92)));
      for (const node of blockRefs.current) {
        if (node) node.classList.toggle("on", p >= +node.dataset.t);
      }
      for (const node of nodeRefs.current) {
        if (node) node.classList.toggle("on", p >= +node.dataset.t);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [layout]);

  return (
    <section id="curriculum" ref={ref} style={{ padding: "70px 0 90px" }}>
      <div className="wrap">
        <div className="reveal cur-head" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 30, alignItems: "end", marginBottom: 18 }}>
          <div>
            <span className="eyebrow"><Icon name="cap" size={14} color="var(--emerald)" /> The curriculum</span>
            <h2 className="sec-title">The full curriculum,<br /><span style={{ color: "var(--emerald-2)" }}>level by level.</span></h2>
          </div>
          <p className="sec-sub" style={{ margin: 0 }}>Ten levels, 35 units and 300+ lessons — from the Psychology of Money all the way to running a business and live market simulations. Students unlock each level by proving mastery. <strong style={{ color: "var(--emerald-2)" }}>Scroll to follow the path.</strong></p>
        </div>

        {/* scroll-driven zigzag path */}
        <div className="reveal zig-shell">
          <div ref={trackRef} className="zig-track" style={{ height: layout.h }}>
            {layout.blocks.map((b, i) => (
              <span key={"b" + i} ref={(el) => (blockRefs.current[i] = el)} data-t={b.t} className="zblock"
                style={{ left: b.x, top: b.y, width: b.size, height: b.size, transform: `translate(-50%,-50%) rotate(${b.ang}deg)` }} />
            ))}
            {layout.circles.map((c, i) => {
              const u = UNITS[i];
              const side = c.x < layout.w / 2 ? "left" : "right";
              return (
                <div key={"c" + i} ref={(el) => (nodeRefs.current[i] = el)} data-t={c.t} className={"znode " + side}
                  style={{ left: c.x, top: c.y }}>
                  <div className="zcircle" style={{ width: c.r * 2, height: c.r * 2 }}>
                    <span className="znum">{u.n}</span>
                    <span className="zbadge zbadge-lock"><Icon name="lock" size={13} color="rgba(6,41,31,.4)" stroke={2.2} /></span>
                    <span className="zbadge zbadge-check"><Icon name="check" size={14} color="#eafff5" stroke={2.6} /></span>
                  </div>
                  <div className="zlabel">
                    <div className="zlabel-top">
                      <Icon name={u.icon} size={15} />
                      <span className="zlabel-title">{u.title}</span>
                    </div>
                    <div className="zlabel-std">{u.std}</div>
                    <span className="zstatus">
                      <span className="zstatus-locked"><Icon name="lock" size={11} stroke={2.4} /> Locked</span>
                      <span className="zstatus-open"><Icon name="check" size={11} stroke={2.6} /> {u.units} units unlocked</span>
                    </span>
                  </div>
                </div>
              );
            })}
            {/* Jeff cheering you on at Level 5 of the path */}
            {layout.w > 560 && layout.circles.length >= 5 && (
              <div style={{
                position: "absolute",
                left: layout.circles[4].x + (layout.circles[4].x < layout.w / 2 ? 100 : -100),
                top: layout.circles[4].y,
                transform: "translate(-50%, -50%)",
                zIndex: 3,
              }}>
                <PathJeff />
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .zig-shell{ max-width: 1100px; margin: 30px auto 0; }
        .zig-track{ position: relative; width: 100%; }

        .zblock{ position: absolute; border-radius: 3px; background: var(--mint-2);
          transition: background-color .55s ease, box-shadow .55s ease; will-change: background-color; }
        .zblock.on{ background: var(--leaf); box-shadow: 0 2px 9px rgba(43,182,115,.4); }

        .znode{ position: absolute; transform: translate(-50%,-50%); z-index: 2; }
        .zcircle{ position: relative; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          background: var(--white); border: 3px solid var(--mint-2); box-shadow: var(--shadow-sm);
          transition: background-color .5s ease, border-color .5s ease, box-shadow .5s ease, transform .5s ease; }
        .znum{ font-family: "JetBrains Mono", monospace; font-weight: 800; font-size: 1.6rem; color: rgba(6,41,31,.38);
          transition: color .5s ease; }
        .znode.on .zcircle{ background: var(--leaf); border-color: var(--leaf); box-shadow: 0 16px 34px rgba(43,182,115,.42); transform: scale(1.06); }
        .znode.on .znum{ color: #eafff5; }

        .zbadge{ position: absolute; right: -3px; bottom: -3px; width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; border: 2px solid var(--paper);
          transition: opacity .4s ease, transform .4s ease; }
        .zbadge-lock{ background: var(--mint); opacity: 1; }
        .zbadge-check{ background: var(--emerald); opacity: 0; transform: scale(.5); }
        .znode.on .zbadge-lock{ opacity: 0; transform: scale(.5); }
        .znode.on .zbadge-check{ opacity: 1; transform: scale(1); }

        .zlabel{ position: absolute; top: 50%; transform: translateY(-50%); width: 218px; }
        .znode.right .zlabel{ left: calc(100% + 18px); text-align: left; }
        .znode.left .zlabel{ right: calc(100% + 18px); text-align: right; }
        .zlabel-top{ display: flex; align-items: center; gap: 7px; color: rgba(6,41,31,.45); transition: color .5s ease; }
        .znode.left .zlabel-top{ flex-direction: row-reverse; }
        .zlabel-title{ font-weight: 800; font-size: 1.06rem; letter-spacing: -.01em; }
        .znode.on .zlabel-top{ color: var(--ink); }
        .zlabel-std{ font-size: .82rem; color: rgba(6,41,31,.42); margin-top: 3px; transition: color .5s ease; }
        .znode.on .zlabel-std{ color: rgba(6,41,31,.6); }
        .zstatus{ display: inline-flex; align-items: center; gap: 5px; margin-top: 8px; font-size: .74rem; font-weight: 700;
          padding: 4px 10px; border-radius: 999px; }
        .zstatus-locked{ display: inline-flex; align-items: center; gap: 5px; color: rgba(6,41,31,.42); }
        .zstatus-open{ display: none; align-items: center; gap: 5px; color: var(--up); }
        .zstatus{ background: rgba(6,41,31,.06); color: rgba(6,41,31,.42); transition: background-color .5s ease; }
        .znode.on .zstatus{ background: rgba(20,160,91,.13); }
        .znode.on .zstatus-locked{ display: none; }
        .znode.on .zstatus-open{ display: inline-flex; }

        .jeff-flip-once{ animation: jeffFlip 1.15s cubic-bezier(.5,.05,.3,1); transform-origin: center 62%; will-change: transform; }
        @keyframes jeffFlip{
          0%   { transform: translateY(0) rotate(0deg); }
          22%  { transform: translateY(-10px) rotate(0deg); }
          55%  { transform: translateY(-52px) rotate(-180deg); }
          100% { transform: translateY(0) rotate(-360deg); }
        }
        .jeff-clickme{ position: absolute; left: 50%; top: -12px; transform: translate(-50%,-100%);
          background: var(--gold); color: #3a2a06; font-weight: 800; font-size: .8rem; white-space: nowrap;
          padding: 6px 13px; border-radius: 999px; box-shadow: 0 8px 20px rgba(224,165,46,.4);
          animation: clickmePulse 1.2s ease-in-out infinite; pointer-events: none; }
        .jeff-clickme::after{ content: ""; position: absolute; left: 50%; bottom: -4px; width: 10px; height: 10px;
          background: var(--gold); transform: translateX(-50%) rotate(45deg); }
        @keyframes clickmePulse{ 0%,100%{ transform: translate(-50%,-100%) scale(1); } 50%{ transform: translate(-50%,-100%) scale(1.08); } }
        body.no-motion .jeff-flip-once{ animation: none; }
        body.no-motion .jeff-clickme{ animation: none; }

        @media (max-width:820px){ .cur-head{ grid-template-columns:1fr !important; } }
        @media (max-width:560px){
          .znode .zlabel, .znode.left .zlabel, .znode.right .zlabel{
            left: 50%; right: auto; top: calc(100% + 8px); transform: translateX(-50%);
            width: 160px; text-align: center; }
          .znode.left .zlabel-top{ flex-direction: row; justify-content: center; }
          .znode.right .zlabel-top{ justify-content: center; }
          .zlabel-title{ font-size: .92rem; }
        }
      `}</style>
    </section>
  );
}

/* ============== FINAL CTA ============== */
function FinalCTA({ onDemo }) {
  const ref = useReveal();
  return (
    <section ref={ref} style={{ padding: "40px 0 80px" }}>
      <div className="wrap">
        <div className="reveal" style={{ background: "linear-gradient(135deg,#0a3d2e,#06291f)", borderRadius: 34, padding: "64px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(700px 300px at 20% 0%, rgba(43,182,115,.22), transparent), radial-gradient(600px 300px at 90% 110%, rgba(224,165,46,.16), transparent)" }} />
          <div style={{ position: "relative" }}>
            <span className="pill-tag" style={{ background: "rgba(255,255,255,.1)", color: "#bfe0d0", fontSize: ".82rem", marginBottom: 22 }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: "#4fd99b", display: "inline-block", animation: "pulseDot 1.4s infinite" }} /> Now enrolling Fall 2026 classrooms
            </span>
            <h2 style={{ color: "#eafff5", fontSize: "clamp(2.2rem,5vw,3.6rem)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.04, margin: "0 auto 18px", maxWidth: "16ch" }}>
              See how a class learns money by <span style={{ color: "#4fd99b" }}>playing</span>.
            </h2>
            <p style={{ color: "#9cc4b3", fontSize: "1.15rem", maxWidth: "44ch", margin: "0 auto 34px", lineHeight: 1.5 }}>
              Book a 20-minute walkthrough. We'll map InvestiPlay to your state standards and set up a free pilot for your students.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-gold" style={{ padding: "16px 32px", fontSize: "1.08rem" }} onClick={onDemo}>Request a Demo <Icon name="arrow" size={19} /></button>
              <a href="#how" className="btn" style={{ padding: "16px 28px", fontSize: "1.08rem", background: "rgba(255,255,255,.1)", color: "#eafff5" }}>Explore features</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== DEMO MODAL — reach the founders directly ============== */
function DemoModal({ open, onClose }) {
  useEffectC(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  const founders = [
    { name: "Eduardo Ribeiro do Valle", title: "Co-founder", email: "eduardorvalle@investiplay.app" },
    { name: "Devon Roy", title: "Co-founder", email: "devonroy@investiplay.app" },
  ];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(6,41,31,.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "riseUp .25s ease" }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: "min(460px,100%)", borderRadius: 26, padding: 32, position: "relative", boxShadow: "var(--shadow-lg)" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 18, right: 18, width: 34, height: 34, borderRadius: 10, background: "var(--mint)", color: "var(--ink)", fontSize: 18, fontWeight: 700 }}>×</button>
        <div className="wordmark" style={{ fontSize: "1.3rem", marginBottom: 4 }}>Investi<span className="play">Play</span></div>
        <h3 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-.02em", margin: "8px 0 6px" }}>Request a demo</h3>
        <p style={{ color: "rgba(6,41,31,.62)", margin: "0 0 22px", fontSize: ".98rem" }}>Email a founder directly and we'll set up your walkthrough.</p>
        <div style={{ display: "grid", gap: 12 }}>
          {founders.map((m) => (
            <a key={m.email} href={`mailto:${m.email}`} className="demo-founder" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16, border: "1.5px solid var(--line)", background: "var(--white)", transition: "border-color .18s, transform .18s, box-shadow .18s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, background: "rgba(21,96,74,.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="users" size={20} color="var(--emerald)" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--ink)", lineHeight: 1.2 }}>{m.name}</div>
                <div style={{ color: "var(--emerald-2)", fontWeight: 700, fontSize: ".9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.email}</div>
              </div>
              <Icon name="arrow" size={18} color="rgba(6,41,31,.4)" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============== FOOTER ============== */
function Footer({ onDemo }) {
  const cols = [
    ["Product", ["Missions", "Live Sim", "The Lab", "Leaderboard"]],
    ["For", ["Teachers", "Schools & Districts", "Parents", "Students"]],
    ["Company", ["About", "Standards alignment", "Pricing", "Contact"]],
  ];
  return (
    <footer style={{ background: "var(--dark)", color: "#bfe0d0", padding: "56px 0 30px" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 30 }} className="foot-grid">
          <div>
            <div className="wordmark wordmark--light" style={{ fontSize: "1.4rem" }}>Investi<span className="play">Play</span></div>
            <p style={{ color: "#7fae9a", maxWidth: "28ch", margin: "14px 0 18px", lineHeight: 1.5, fontSize: ".95rem" }}>Learn money skills that last. The financial-literacy app students actually finish.</p>
            <button className="btn btn-gold" style={{ padding: "12px 22px" }} onClick={onDemo}>Request a Demo</button>
          </div>
          {cols.map(([h, items]) => (
            <div key={h}>
              <div style={{ color: "#eafff5", fontWeight: 700, fontSize: ".95rem", marginBottom: 14 }}>{h}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((it) => <a key={it} href="#" style={{ color: "#7fae9a", fontSize: ".92rem", transition: "color .2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#4fd99b"} onMouseLeave={(e) => e.currentTarget.style.color = "#7fae9a"}>{it}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", marginTop: 40, paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, color: "#5e8775", fontSize: ".85rem" }}>
          <span>© 2026 InvestiPlay. All rights reserved.</span>
          <span style={{ display: "flex", gap: 22 }}><a href="#" style={{ color: "#5e8775" }}>Privacy</a><a href="#" style={{ color: "#5e8775" }}>Terms</a><a href="#" style={{ color: "#5e8775" }}>@InvestiPlay</a></span>
        </div>
      </div>
      <style>{`@media (max-width:760px){ .foot-grid{ grid-template-columns:1fr 1fr !important; } }`}</style>
    </footer>
  );
}

Object.assign(window, { Curriculum, FinalCTA, DemoModal, Footer });
