// mascot.jsx — "Jeff", the InvestiPlay explorer mascot + intro scenes
const { useState: useStateM, useEffect: useEffectM, useRef: useRefM } = React;

/* ============================================================
   JEFF — a friendly little explorer (Duolingo-simple geometry)
   props:
     size  – px
     look  – "front" | "up"      (pupil direction)
     expr  – "happy" | "wow" | "think"
     lab   – bool                (white lab coat + goggles)
     arm   – "rest" | "point" | "chin"
   ============================================================ */
function Jeff({ size = 200, look = "front", expr = "happy", lab = false, arm = "rest", idle = true, party = false, uid = "j" }) {
  const pupilDY = look === "up" ? -6 : 1.5;
  const g = (s) => `${uid}-${s}`;
  return (
    <svg width={size} height={size} viewBox="0 0 240 250" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }} className={idle ? "jeff-idle" : ""}>
      <defs>
        <radialGradient id={g("body")} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#3fd98c" />
          <stop offset="60%" stopColor="#2bb673" />
          <stop offset="100%" stopColor="#1c8a55" />
        </radialGradient>
        <linearGradient id={g("hat")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#efd9ab" />
          <stop offset="100%" stopColor="#d6b277" />
        </linearGradient>
        <radialGradient id={g("belly")} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#eafff4" />
          <stop offset="100%" stopColor="#cdeed9" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="120" cy="236" rx="62" ry="11" fill="rgba(0,0,0,.22)" />

      {/* feet */}
      <ellipse cx="98" cy="224" rx="20" ry="13" fill="#17794a" />
      <ellipse cx="146" cy="224" rx="20" ry="13" fill="#17794a" />

      {/* left arm */}
      <g style={{ transformOrigin: "70px 150px", transform: arm === "point" ? "rotate(8deg)" : "none" }}>
        <ellipse cx="58" cy="158" rx="15" ry="27" fill="#1c8a55" transform="rotate(16 58 158)" />
      </g>
      {/* right arm — raised for point / chin */}
      <g style={{ transformOrigin: "182px 152px", transform: arm === "point" ? "rotate(-46deg)" : arm === "chin" ? "rotate(-28deg)" : "none" }}>
        <ellipse cx="184" cy="158" rx="15" ry="27" fill="#1c8a55" transform="rotate(-16 184 158)" />
        {arm === "point" && <circle cx="196" cy="120" r="11" fill="#2bb673" />}
      </g>

      {/* body */}
      <ellipse cx="120" cy="150" rx="66" ry="70" fill={`url(#${g("body")})`} />
      {/* belly */}
      <ellipse cx="120" cy="166" rx="40" ry="46" fill={`url(#${g("belly")})`} opacity={lab ? 0 : 1} />

      {/* lab coat */}
      {lab && (
        <g>
          <path d="M70 128 Q120 150 170 128 L176 220 Q120 234 64 220 Z" fill="#fbfdfb" />
          <path d="M120 140 L120 218" stroke="#dde8e0" strokeWidth="2.5" />
          <path d="M70 128 L120 158 L96 196 Z" fill="#ffffff" stroke="#e4ede7" strokeWidth="1.5" />
          <path d="M170 128 L120 158 L144 196 Z" fill="#ffffff" stroke="#e4ede7" strokeWidth="1.5" />
          <circle cx="120" cy="176" r="3" fill="#bcd3c6" />
          <circle cx="120" cy="196" r="3" fill="#bcd3c6" />
        </g>
      )}

      {/* face */}
      <g>
        {/* eyes whites */}
        <ellipse className="jeff-eyes" cx="100" cy="120" rx="17" ry="19" fill="#fff" />
        <ellipse className="jeff-eyes" cx="140" cy="120" rx="17" ry="19" fill="#fff" />
        {/* pupils */}
        <circle cx="102" cy={120 + pupilDY} r="8" fill="#0d2b1f" />
        <circle cx="138" cy={120 + pupilDY} r="8" fill="#0d2b1f" />
        <circle cx="105" cy={117 + pupilDY} r="2.6" fill="#fff" />
        <circle cx="141" cy={117 + pupilDY} r="2.6" fill="#fff" />
        {/* cheeks */}
        <ellipse cx="82" cy="140" rx="9" ry="6" fill="rgba(224,165,46,.28)" />
        <ellipse cx="158" cy="140" rx="9" ry="6" fill="rgba(224,165,46,.28)" />
        {/* mouth */}
        {expr === "wow"
          ? <ellipse cx="120" cy="150" rx="9" ry="11" fill="#0d2b1f" />
          : expr === "think"
            ? <path d="M108 150 Q120 156 132 150" stroke="#0d2b1f" strokeWidth="4" strokeLinecap="round" fill="none" />
            : <path d="M104 146 Q120 164 136 146" stroke="#0d2b1f" strokeWidth="4.5" strokeLinecap="round" fill="none" />}
      </g>

      {/* goggles (lab) */}
      {lab && (
        <g opacity="0.92">
          <circle cx="100" cy="118" r="22" fill="rgba(180,225,255,.32)" stroke="#9fb6ad" strokeWidth="3.5" />
          <circle cx="140" cy="118" r="22" fill="rgba(180,225,255,.32)" stroke="#9fb6ad" strokeWidth="3.5" />
          <path d="M122 118 h-4 M158 110 q12 2 14 14" stroke="#9fb6ad" strokeWidth="3.5" fill="none" />
        </g>
      )}

      {/* party blower — uncurls from the mouth (party mode) */}
      {party && (
        <g className="jeff-blower" style={{ transformOrigin: "132px 150px" }}>
          <path d="M130 150 L208 140 L208 160 Z" fill="#3fe08f" stroke="#1c8a55" strokeWidth="2" strokeLinejoin="round" />
          <path d="M208 140 L208 160 L228 156 L226 144 Z" fill="#e0a52e" stroke="#c8861f" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M226 150 q14 -3 12 -13 q-2 -8 -11 -6" fill="none" stroke="#e0a52e" strokeWidth="6" strokeLinecap="round" />
        </g>
      )}

      {/* headwear */}
      {party ? (
        <g>
          {/* party cone hat with stripes + pom-pom */}
          <path d="M120 8 L92 78 L148 78 Z" fill={`url(#${g("hat")})`} stroke="#c9a36a" strokeWidth="2" strokeLinejoin="round" />
          <path d="M120 8 L110 33 L128 33 Z" fill="#3fe08f" />
          <path d="M112 53 L132 53 L136 63 L108 63 Z" fill="#e0a52e" />
          <path d="M99 73 L141 73 L143 78 L97 78 Z" fill="#5ab0ff" />
          <ellipse cx="120" cy="80" rx="32" ry="7" fill="#1c8a55" />
          <circle cx="120" cy="8" r="9" fill="#ff8da3" stroke="#e0617c" strokeWidth="2" />
        </g>
      ) : (
        /* explorer pith helmet */
        <g>
          <ellipse cx="120" cy="84" rx="70" ry="17" fill="#c9a36a" />
          <ellipse cx="120" cy="80" rx="70" ry="15" fill={`url(#${g("hat")})`} />
          <path d="M60 82 A60 56 0 0 1 180 82 Z" fill={`url(#${g("hat")})`} />
          <path d="M60 82 A60 56 0 0 1 180 82" fill="none" stroke="#c9a36a" strokeWidth="2" />
          <rect x="60" y="74" width="120" height="10" rx="5" fill="#1c8a55" />
          <circle cx="120" cy="34" r="7" fill="#efd9ab" stroke="#c9a36a" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}

/* ---- shared little board/panel that matches the site theme ---- */
function ChalkPanel({ children, w = 300, accent = "#3fe08f", tilt = -3 }) {
  return (
    <div style={{
      width: w, maxWidth: "42vw", padding: "20px 22px", borderRadius: 18,
      background: "linear-gradient(160deg,#102219,#0a160f)",
      border: "6px solid #6b4f2a", boxShadow: "0 22px 50px rgba(0,0,0,.5), inset 0 0 0 2px rgba(255,255,255,.03)",
      transform: `rotate(${tilt}deg)`, position: "relative",
    }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "radial-gradient(120px 80px at 70% 20%, rgba(255,255,255,.05), transparent)", pointerEvents: "none" }} />
      <div style={{ position: "relative", color: accent }}>{children}</div>
    </div>
  );
}

/* ============== SCENE: ALPHABET (Jeff the teacher) ============== */
function SceneAlphabet({ size = 1 }) {
  return (
    <div className="scene-row">
      <ChalkPanel w={320} accent="#eafff4" tilt={-3}>
        <div className="mono" style={{ fontSize: ".7rem", letterSpacing: ".2em", color: "#7fae9a", marginBottom: 12 }}>LESSON 01</div>
        <div style={{ display: "flex", gap: 16, fontWeight: 800, fontSize: "clamp(2rem,4vw,3.2rem)", color: "#fbf1d6", lineHeight: 1 }}>
          <span>Aa</span><span style={{ color: "#3fe08f" }}>Bb</span><span>Cc</span>
        </div>
        <div style={{ marginTop: 14, height: 3, borderRadius: 9, background: "repeating-linear-gradient(90deg,#3fe08f 0 18px,transparent 18px 30px)", opacity: .5 }} />
      </ChalkPanel>
      <div className="scene-jeff"><Jeff uid="alpha" arm="point" expr="happy" size={180} /></div>
    </div>
  );
}

/* ============== SCENE: MATH (Jeff thinking) ============== */
function SceneMath() {
  return (
    <div className="scene-row">
      <div className="scene-jeff" style={{ position: "relative" }}>
        <Jeff uid="math" arm="chin" expr="think" look="up" size={180} />
        {/* thought bubble */}
        <div style={{ position: "absolute", top: -8, right: -34, background: "#fbfdfb", color: "#0d2b1f", borderRadius: 16, padding: "10px 14px", fontWeight: 800, boxShadow: "0 12px 30px rgba(0,0,0,.3)" }} className="jeff-pop">
          <span className="mono" style={{ fontSize: "1.05rem" }}>x² − 5x + 6</span>
          <span style={{ position: "absolute", bottom: -7, left: 16, width: 14, height: 14, background: "#fbfdfb", transform: "rotate(45deg)" }} />
        </div>
      </div>
      <ChalkPanel w={340} accent="#3fe08f" tilt={3}>
        <div className="mono" style={{ fontSize: ".7rem", letterSpacing: ".2em", color: "#7fae9a", marginBottom: 12 }}>QUADRATIC FORMULA</div>
        <div className="mono" style={{ fontSize: "clamp(1.2rem,2.4vw,1.9rem)", fontWeight: 700, color: "#fbf1d6", display: "flex", alignItems: "center", gap: 8 }}>
          x =
          <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: ".8em" }}>−b ± √(b²−4ac)</span>
            <span style={{ width: "100%", height: 2, background: "#fbf1d6", margin: "3px 0" }} />
            <span>2a</span>
          </span>
        </div>
      </ChalkPanel>
    </div>
  );
}

/* ============== SCENE: PERIODIC TABLE (Jeff + microscope) ============== */
function SceneLab() {
  const tiles = [["H", "#3fe08f"], ["He", "#e0a52e"], ["Li", "#5ab0ff"], ["C", "#fbf1d6"], ["O", "#ff8da3"], ["Na", "#b69bff"]];
  return (
    <div className="scene-row">
      <div className="scene-jeff" style={{ position: "relative" }}>
        <Jeff uid="lab" lab arm="point" expr="happy" look="up" size={180} />
        {/* microscope */}
        <svg width="120" height="150" viewBox="0 0 120 150" style={{ position: "absolute", right: -56, bottom: 8 }}>
          <ellipse cx="60" cy="140" rx="44" ry="9" fill="rgba(0,0,0,.25)" />
          <rect x="34" y="128" width="58" height="12" rx="6" fill="#16271e" />
          <rect x="54" y="40" width="12" height="78" rx="6" fill="#2bb673" />
          <rect x="50" y="36" width="40" height="14" rx="7" fill="#e0a52e" transform="rotate(28 70 43)" />
          <circle cx="92" cy="32" r="12" fill="#fbf1d6" stroke="#e0a52e" strokeWidth="3" />
          <rect x="48" y="116" width="34" height="8" rx="4" fill="#16271e" />
        </svg>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, transform: "rotate(2deg)" }}>
        {tiles.map(([s, c], i) => (
          <div key={i} className="ptile" style={{ width: 64, height: 64, borderRadius: 10, border: `2px solid ${c}`, background: "rgba(255,255,255,.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animationDelay: `${i * 0.12}s` }}>
            <span style={{ fontSize: ".55rem", color: "#7fae9a" }}>{i + 1}</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: c }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Jeff, ChalkPanel, SceneAlphabet, SceneMath, SceneLab });
