/* InvestiPlay landing page behaviour. Kept in its own file so the Content-Security-Policy
   can allow scripts from this site only (no inline scripts). Add new JS here, not in a <script> tag. */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- nav ---------- */
  const nav = $("#nav"), progress = $("#progress");
  const themed = $$("[data-theme]");
  const onScrollNav = () => {
    nav.classList.toggle("solid", window.scrollY > 24);
    let light = false;
    for (const el of themed) { const r = el.getBoundingClientRect(); if (r.top <= 40 && r.bottom > 40) { light = el.dataset.theme === "light"; break; } }
    nav.classList.toggle("on-light", light);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScrollNav, { passive: true }); onScrollNav();
  $("#burger").addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$("#mobileMenu a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  /* ---------- demo modal ---------- */
  const modal = $("#demoModal");
  const openModal = () => { modal.classList.add("open"); document.body.classList.remove("menu-open"); document.body.style.overflow = "hidden"; };
  const closeModal = () => { modal.classList.remove("open"); document.body.style.overflow = ""; };
  $$("[data-demo]").forEach(b => b.addEventListener("click", openModal));
  $$("[data-close]").forEach(b => b.addEventListener("click", closeModal));
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  window.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15, rootMargin: "0px 0px -6% 0px" });
  $$("[data-reveal]").forEach(el => io.observe(el));

  /* ---------- count up ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, target = +el.dataset.count, dec = +(el.dataset.dec || 0), t0 = performance.now(), dur = 1500;
    const fmt = v => dec ? v.toFixed(dec) : Math.round(v).toLocaleString();
    const tick = now => { const p = Math.min(1, (now - t0) / dur), v = target * (1 - Math.pow(1 - p, 3)); el.textContent = fmt(v); if (p < 1) requestAnimationFrame(tick); else el.dataset.done = "1"; };
    reduce ? (el.textContent = fmt(target), el.dataset.done = "1") : requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ---------- spotlight cards ---------- */
  $$(".spot").forEach(c => c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); }));

  /* ---------- laptop: scale dashboard + scroll tilt + mouse parallax ---------- */
  const disp = $("#lapDisplay"), dash = $("#dash"), laptop = $("#devices"), stage = $("#laptopStage");
  const phDisp = $("#phDisplay"), mob = $("#mob");
  const fit = () => { dash.style.transform = `scale(${disp.clientWidth / 1200})`; mob.style.transform = `scale(${phDisp.clientWidth / 390})`; };
  new ResizeObserver(fit).observe(disp); new ResizeObserver(fit).observe(phDisp); fit();

  let mx = 0, my = 0, tmx = 0, tmy = 0, tilt = 1;
  const applyLaptop = () => {
    if (reduce) { laptop.style.transform = "none"; return; }
    const rx = 14 * tilt + my * -2.5, ry = mx * 3.5 * (1 - tilt * .5);
    const sc = .96 + .04 * (1 - tilt), ty = 24 * tilt;
    laptop.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)}) translateY(${ty.toFixed(1)}px)`;
  };
  const onScrollLaptop = () => {
    const r = stage.getBoundingClientRect(), vh = window.innerHeight;
    // 1 = fully tilted (laptop top near bottom of viewport), 0 = flat (laptop top ~18% from top)
    const p = (r.top - vh * .18) / (vh * .62);
    tilt = Math.max(0, Math.min(1, p));
    applyLaptop();
  };
  window.addEventListener("scroll", onScrollLaptop, { passive: true }); window.addEventListener("resize", onScrollLaptop); onScrollLaptop();
  if (window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("pointermove", e => { tmx = (e.clientX / window.innerWidth - .5) * 2; tmy = (e.clientY / window.innerHeight - .5) * 2; });
    const loop = () => { mx += (tmx - mx) * .06; my += (tmy - my) * .06; applyLaptop(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  /* dashboard "live" bits */
  const tickerItems = [
    ["👥", "Friends", "#2 of 18", "up"], ["🏆", "Class", "#3 of 27", "up"], ["🏆", "National", "#148 of 2,140", "up"],
    ["📈", "Portfolio", "+3.40%", "up"], ["🪙", "Coins", "1,240", "gold"], ["🔥", "Streak", "12 days", "fire"],
  ];
  const tk = $("#dTicker");
  tk.innerHTML = [...tickerItems, ...tickerItems].map(([i, l, v, c]) => `<span>${i} ${l} <b class="${c}">${v}</b></span>`).join("");
  const startDash = () => {
    dash.classList.add("live");
    const coins = $("#dCoins"), net = $("#dNet"), t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - p, 3);
      coins.textContent = Math.round(1240 * e).toLocaleString();
      net.textContent = Math.round(219 * e).toString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  setTimeout(startDash, reduce ? 0 : 700);

  /* ---------- features: sticky switcher ---------- */
  const fvs = $$("#featScreen .fv"), dots = $$("#featDots i"), items = $$("#featList .feat-item");
  const setFeat = i => { fvs.forEach((v, k) => v.classList.toggle("on", k === i)); dots.forEach((d, k) => d.classList.toggle("on", k === i)); items.forEach((it, k) => it.classList.toggle("active", k === i)); };
  const fio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setFeat(+e.target.dataset.i); }), { rootMargin: "-42% 0px -42% 0px", threshold: 0 });
  items.forEach(it => fio.observe(it));
  // on narrow screens, move each visual into its feature block
  const mobileFeat = window.matchMedia("(max-width: 900px)");
  const placeFeat = () => {
    if (!mobileFeat.matches) return;
    items.forEach((it, k) => { const slot = $(".feat-inline", it); if (slot && !slot.children.length) slot.appendChild(fvs[k]); });
  };
  placeFeat(); mobileFeat.addEventListener("change", () => { if (mobileFeat.matches) placeFeat(); else location.reload(); });

  /* ---------- curriculum journey ---------- */
  const LEVELS = [
    { t: "Money Foundations",      u: ["The Psychology of Money", "Income & Earning Power", "Budgeting Mastery", "Investing Fundamentals"], d: "Why we make the money decisions we make, and how to take control of them." },
    { t: "Banking & Credit",       u: ["Banking Systems", "Credit & Debt", "Insurance & Protection"], d: "How accounts, credit scores and insurance work, and how to make them work for you." },
    { t: "Investing Core",         u: ["Introduction to Investing", "Stocks Explained", "Stock Market System"], d: "Students place their first trades in the live market sim once this level is mastered." },
    { t: "Portfolio Strategy",     u: ["Portfolio Construction", "ETFs & Mutual Funds", "Bonds & Fixed Income"], d: "Diversification, risk and the tools that make a portfolio more than a pile of stocks." },
    { t: "Company Analysis",       u: ["Financial Statements", "Financial Ratios", "Valuation"], d: "Read an income statement, compare ratios and decide what a company is actually worth." },
    { t: "Behavioral Finance",     u: ["Behavioral Economics", "Bubbles & Crashes"], d: "The biases that wreck good plans, and the market history that proves it." },
    { t: "Macro Economics",        u: ["Inflation & Rates", "Economic Indicators"], d: "What the Fed, CPI and GDP mean for a paycheck and a portfolio." },
    { t: "Entrepreneurship",       u: ["Starting a Business", "Competitive Strategy", "Business Management & Strategy", "Marketing", "Consumer Behavior", "The Marketing Mix - 4 Ps", "Market Research", "Leadership & Management", "Strategic Analysis Tools", "PESTEL Analysis", "Business Ethics & Social Responsibility"], d: "The deepest level: eleven units that feed directly into the Micro-Business sim." },
    { t: "Advanced Investing",     u: ["Options Basics", "Alternative Investments"], d: "Derivatives, real estate, private markets and how the pros use them." },
    { t: "Real-World Application", u: ["10-Year Financial Plan", "Market Simulations"], d: "Everything comes together in a personal ten-year plan and full market simulations." },
  ];
  const LESSONS = [50, 38, 30, 29, 23, 14, 14, 77, 15, 12];
  const track = $("#jTrack"), fill = $("#jFill");
  LEVELS.forEach((l, i) => {
    const b = document.createElement("button"); b.className = "j-node" + (i === 0 ? " on" : ""); b.innerHTML = `<span class="c">${i + 1}</span><span class="t">${l.t}</span>`;
    b.addEventListener("click", () => { pauseJ(); showLevel(i); }); track.appendChild(b);
  });
  const nodes = $$(".j-node", track);
  let cur = 0, jTimer = null, jPaused = false;
  const showLevel = i => {
    cur = (i + LEVELS.length) % LEVELS.length; const l = LEVELS[cur];
    nodes.forEach((n, k) => { n.classList.toggle("on", k === cur); n.classList.toggle("done", k < cur); });
    fill.style.width = (cur / (LEVELS.length - 1)) * 100 + "%";
    $("#jLevel").textContent = "Level " + String(cur + 1).padStart(2, "0");
    $("#jTitle").textContent = l.t; $("#jDesc").textContent = l.d;
    $("#jUnits").textContent = l.u.length; $("#jLessons").textContent = LESSONS[cur];
    $("#jLock").textContent = cur === 0 ? "Start" : "Level " + cur;
    $("#jUnitList").innerHTML = l.u.map((u, k) => `<div class="j-unit" style="--i:${k}"><span class="k">${String(k + 1).padStart(2, "0")}</span>${u}</div>`).join("");
  };
  const pauseJ = () => { jPaused = true; clearInterval(jTimer); $("#jAuto").classList.add("paused"); $("#jAuto").lastChild.textContent = " Paused · use the arrows to browse"; };
  $("#jPrev").addEventListener("click", () => { pauseJ(); showLevel(cur - 1); });
  $("#jNext").addEventListener("click", () => { pauseJ(); showLevel(cur + 1); });
  showLevel(0);
  const jio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !jPaused && !jTimer && !reduce) jTimer = setInterval(() => showLevel(cur + 1), 3400);
    if (!e.isIntersecting && jTimer) { clearInterval(jTimer); jTimer = null; }
  }), { threshold: .3 });
  jio.observe($("#journey"));

  /* ---------- accolades (edit this list) ---------- */
  const ACCOLADES = [
    { year: "2026", title: "Winner, Innovate South Florida Business Plan Competition", org: "NFTE · Network for Teaching Entrepreneurship", note: "First place for the InvestiPlay business plan and pitch.", hl: true },
    { year: "2026", title: "1st Place, Gulliver Business Showcase", org: "Gulliver Preparatory School", note: "First place at the school-wide business showcase." },
  ];
  const icons = ['<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/><path d="M10 14h4M9 20h6M12 14v6"/></svg>',
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z"/></svg>',
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4L2 9l10 5 10-5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/></svg>'];
  $("#accGrid").innerHTML = ACCOLADES.map((a, i) => `<div class="acc${a.hl ? " hl" : ""}" data-reveal style="--d:${i * .08}s"><span class="yr">${a.year}</span><span class="ic">${icons[i % icons.length]}</span><h3>${a.title}</h3><div class="org">${a.org}</div><p>${a.note}</p></div>`).join("");
  $$("#accGrid [data-reveal]").forEach(el => io.observe(el));

  /* ---------- 85-minute block hover ---------- */
  const tip = $("#barTip");
  $$("#bar85 i").forEach(seg => seg.addEventListener("pointerenter", () => { tip.textContent = seg.dataset.t; }));
})();
