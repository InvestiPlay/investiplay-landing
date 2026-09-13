// facts.jsx — Mana-style pinned horizontal "facts reel" with Jeff spinning at center-bottom
const { useState: useStateF, useEffect: useEffectF, useRef: useRefF } = React;

const REEL_FACTS = [
  { icon: "book",   kicker: "Missions",     stat: "300+",    unit: "lessons",     line: "10 levels, 35 units — from the Psychology of Money to running a business.", bg: "var(--ink)",      fg: "#eafff5", accent: "#3fe08f" },
  { icon: "chart",  kicker: "Stocks",       stat: "Live",    unit: "markets",     line: "Trade NVDA, AAPL, TSLA & more at real last-close prices.",            bg: "var(--white)",    fg: "var(--ink)", accent: "var(--emerald-2)", border: true },
  { icon: "bolt",   kicker: "Rewards",      stat: "+250",    unit: "XP a mission", line: "Build streaks, bank coins and unlock brand-new territory.",            bg: "var(--gold)",     fg: "#3a2a06", accent: "#3a2a06" },
  { icon: "doc",    kicker: "The Lab",      stat: "Real",    unit: "paperwork",   line: "File W-4s, I-9s and tax forms in a safe sandbox before it counts.",     bg: "var(--leaf)",     fg: "#042018", accent: "#042018" },
  { icon: "store",  kicker: "Business",     stat: "Build",   unit: "a venture",   line: "Run your own business inside a living, breathing economy.",             bg: "var(--white)",    fg: "var(--ink)", accent: "var(--gold)", border: true },
  { icon: "trophy", kicker: "Leaderboard",  stat: "Compete", unit: "class-wide",  line: "Climb the ranks against your entire classroom, every week.",            bg: "var(--emerald-2)",fg: "#eafff5", accent: "#9ff0c6" },
];

function FactsReel() {
  const secRef = useRefF(null);
  const wrapRef = useRefF(null);
  const trackRef = useRefF(null);
  const jeffRef = useRefF(null);
  const cardEls = useRefF([]);
  const fillRef = useRefF(null);
  const [reduce, setReduce] = useStateF(false);

  useEffectF(() => {
    if (document.body.classList.contains("no-motion")) { setReduce(true); return; }
    const sec = secRef.current, wrap = wrapRef.current, track = trackRef.current;
    if (!sec || !wrap || !track) return;

    let travel = 0, target = 0, cur = 0, raf;
    const measure = () => { travel = Math.max(0, track.scrollWidth - wrap.clientWidth); };
    measure();

    const apply = (p) => {
      track.style.transform = `translate3d(${-p * travel}px,0,0)`;
      const W = window.innerWidth;
      for (let i = 0; i < cardEls.current.length; i++) {
        const el = cardEls.current[i]; if (!el) continue;
        const rect = el.getBoundingClientRect();
        const nx = (rect.left + rect.width / 2) / W;
        const arc = Math.sin(Math.min(1, Math.max(0, nx)) * Math.PI);
        el.style.transform = `translateY(${-arc * 46}px) scale(${0.9 + arc * 0.14}) rotate(${(nx - 0.5) * 9}deg)`;
        el.style.zIndex = String(Math.round(arc * 10));
        el.style.opacity = String(0.5 + arc * 0.5);
      }
      if (jeffRef.current) jeffRef.current.style.transform = `rotateY(${p * 1080}deg) scale(${1 + p * 0.18})`;
      if (fillRef.current) fillRef.current.style.width = `${p * 100}%`;
    };

    const onScroll = () => {
      const r = sec.getBoundingClientRect();
      const range = sec.offsetHeight - window.innerHeight;
      target = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
      apply(target); // immediate snap (correct even if rAF is throttled)
    };
    const onResize = () => { measure(); onScroll(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    const loop = () => {                       // rAF adds buttery smoothing on top of the snap
      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.0002) cur = target;
      apply(cur);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  const Card = ({ f, i }) => (
    <article ref={(el) => (cardEls.current[i] = el)} className="reel-card" style={{ background: f.bg, color: f.fg, border: f.border ? "1.5px solid var(--line)" : "none" }}>
      <div className="reel-card-top">
        <span className="reel-chip" style={{ background: f.border ? "var(--mint)" : "rgba(255,255,255,.14)", color: f.accent }}><Icon name={f.icon} size={20} color={f.accent} /></span>
        <span className="reel-kicker" style={{ color: f.accent }}>{f.kicker}</span>
        <span className="reel-num" style={{ color: f.fg, opacity: .3 }}>{String(i + 1).padStart(2, "0")}</span>
      </div>
      <div className="reel-stat-wrap">
        <div className="reel-stat">{f.stat}</div>
        <div className="reel-unit" style={{ color: f.accent }}>{f.unit}</div>
      </div>
      <p className="reel-line">{f.line}</p>
    </article>
  );

  if (reduce) {
    return (
      <section id="inside" style={{ background: "var(--paper)", padding: "90px 0", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <span className="eyebrow"><Icon name="grid" size={14} color="var(--emerald)" /> Inside InvestiPlay</span>
          <h2 className="sec-title" style={{ marginTop: 14 }}>One app, an entire risk-free economy<sup style={{ color: "#2563eb" }}>*</sup></h2>
          <p style={{ margin: "10px 0 0", fontSize: ".9rem", color: "rgba(6,41,31,.62)", maxWidth: "44ch", lineHeight: 1.4 }}>
            <span style={{ color: "#2563eb", fontWeight: 800 }}>*</span> Students trade, invest and build businesses with virtual coins — never real money.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginTop: 36 }}>
            {REEL_FACTS.map((f, i) => <Card key={f.kicker} f={f} i={i} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={secRef} id="inside" className="reel-sec" style={{ height: `${REEL_FACTS.length * 105 + 70}vh`, position: "relative", background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
      <div ref={wrapRef} className="reel-pin">
        <div className="reel-head">
          <span className="eyebrow"><Icon name="grid" size={14} color="var(--emerald)" /> Inside InvestiPlay</span>
          <h2 className="reel-title">One app, an <span>entire risk-free economy</span><sup style={{ color: "#2563eb", fontWeight: 800 }}>*</sup></h2>
          <p style={{ margin: 0, fontSize: "clamp(.8rem,1.4vw,.95rem)", color: "rgba(6,41,31,.62)", maxWidth: "44ch", lineHeight: 1.4 }}>
            <span style={{ color: "#2563eb", fontWeight: 800 }}>*</span> Students trade, invest and build businesses with virtual coins — never real money.
          </p>
          <div className="reel-prog"><span ref={fillRef} className="reel-prog-fill" /></div>
        </div>

        <div className="reel-viewport">
          <div ref={trackRef} className="reel-track">
            {REEL_FACTS.map((f, i) => <Card key={f.kicker} f={f} i={i} />)}
          </div>
        </div>

        {/* Jeff spinning at center-bottom, like Mana's can */}
        <div className="reel-jeff-stage">
          <div className="reel-jeff-disc" />
          <div ref={jeffRef} className="reel-jeff-spin">
            <Jeff uid="reel" size={240} idle={false} arm="point" expr="happy" />
          </div>
        </div>
        <div className="reel-hint">keep scrolling →</div>
      </div>
    </section>
  );
}

Object.assign(window, { FactsReel });
