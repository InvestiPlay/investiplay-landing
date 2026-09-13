// shared.jsx — hooks, icons, small reusable bits. Exported to window.
const { useState, useEffect, useRef, useCallback } = React;

/* ---------- Scroll reveal ---------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.18 }
    );
    el.querySelectorAll(".reveal").forEach((n) => io.observe(el));
    el.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    if (el.classList.contains("reveal")) io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ---------- Count up on view ---------- */
function useCountUp(target, { duration = 1600, decimals = 0 } = {}) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(target * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setVal(target);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return [display, ref];
}

/* ---------- Sparkline path generator ---------- */
function sparkPath(points, w, h, pad = 4) {
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const step = (w - pad * 2) / (points.length - 1);
  const pts = points.map((p, i) => [pad + i * step, h - pad - ((p - min) / range) * (h - pad * 2)]);
  // smooth-ish line
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return { d, pts, area: d + ` L ${pts[pts.length-1][0]},${h} L ${pts[0][0]},${h} Z` };
}

function randomWalk(n, start, vol) {
  const out = [start];
  for (let i = 1; i < n; i++) {
    out.push(Math.max(1, out[i - 1] + (Math.random() - 0.48) * vol));
  }
  return out;
}

/* ---------- Icons (simple stroked glyphs, brand-consistent) ---------- */
const Icon = ({ name, size = 22, stroke = 1.8, color = "currentColor" }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5V20.5"/><path d="M9 8h7M9 12h5"/></>,
    flask: <><path d="M9 3h6"/><path d="M10 3v6.5L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-8.5V3"/><path d="M7.5 14h9"/></>,
    chart: <><path d="M4 19V5"/><path d="M4 19h16"/><path d="M7 15l3.5-4 3 2.5L20 7"/></>,
    trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/><path d="M10 14h4M9 20h6M12 14v6"/></>,
    coin: <><circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 9.5h3.5a1.5 1.5 0 0 1 0 3H10a1.5 1.5 0 0 0 0 3h3.5"/></>,
    spark: <><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z"/></>,
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.6" fill={color}/></>,
    shield: <><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></>,
    bolt: <><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></>,
    rocket: <><path d="M5 15c-1.5 1-2 4-2 4s3-.5 4-2"/><path d="M9 13l2 2"/><path d="M14.5 4.5c3 0 5 2 5 5L13 16l-5-5z"/><circle cx="15" cy="9" r="1.4"/></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></>,
    play: <><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z" fill={color} stroke="none"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check: <><path d="M5 12l4 4L19 7"/></>,
    store: <><path d="M4 9l1.5-5h13L20 9"/><path d="M4 9v10h16V9"/><path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/><path d="M9 19v-5h6v5"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3 3 0 0 1 0 5.8M21 20c0-2.5-1.4-4.7-3.5-5.6"/></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    cap: <><path d="M12 4L2 9l10 5 10-5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/></>,
    doc: <><path d="M7 3h6l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M13 3v5h5"/><path d="M9 13h6M9 17h4"/></>,
  };
  return <svg {...common}>{paths[name] || null}</svg>;
};

const fmt = (n, d = 2) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

Object.assign(window, { useReveal, useCountUp, sparkPath, randomWalk, Icon, fmt });
