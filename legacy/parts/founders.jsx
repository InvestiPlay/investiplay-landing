// founders.jsx — "Made by students, for students" team section (same as prior site)
function Founders() {
  const ref = useReveal();
  const team = [
    { name: "Eduardo Ribeiro do Valle", title: "Co-founder", email: "eduardorvalle@investiplay.app" },
    { name: "Devon Roy", title: "Co-founder", email: "devonroy@investiplay.app" },
  ];
  return (
    <section id="team" ref={ref} style={{ padding: "40px 0 40px" }}>
      <div className="wrap">
        <div className="reveal" style={{ background: "linear-gradient(135deg,#0a3d2e,#06291f)", borderRadius: 34, padding: "62px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(620px 280px at 50% -8%, rgba(43,182,115,.20), transparent), radial-gradient(540px 280px at 90% 120%, rgba(224,165,46,.12), transparent)" }} />
          <div style={{ position: "relative", textAlign: "center" }}>
            <span className="pill-tag" style={{ background: "rgba(255,255,255,.1)", color: "#bfe0d0", fontSize: ".82rem", marginBottom: 20 }}>
              <Icon name="cap" size={14} color="#4fd99b" /> The team
            </span>
            <h2 style={{ color: "#eafff5", fontSize: "clamp(2rem,4.6vw,3.3rem)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.05, margin: "0 auto 14px", maxWidth: "18ch" }}>
              Made by Students, <span style={{ color: "#4fd99b" }}>for Students</span>.
            </h2>
            <p style={{ color: "#9cc4b3", fontSize: "1.12rem", maxWidth: "50ch", margin: "0 auto 40px", lineHeight: 1.5 }}>
              InvestiPlay was founded by two high school students who recognized a gap in traditional education. They built the platform they never had, one that teaches real financial skills through real experience.
            </p>
            <div className="reveal" style={{ maxWidth: 480, margin: "0 auto 40px", borderRadius: 26, padding: 6, background: "linear-gradient(135deg,#4fd99b,#15604a)", boxShadow: "0 22px 54px rgba(0,0,0,.42)", transitionDelay: "120ms" }}>
              <img src="/founders.jpg" alt="Eduardo Ribeiro do Valle and Devon Roy, InvestiPlay co-founders" loading="lazy" style={{ width: "100%", borderRadius: 21, display: "block", border: "3px solid #06291f" }} />
            </div>
            <div className="founder-grid" style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              {team.map((m, i) => (
                <div
                  key={m.name}
                  className="reveal founder-card"
                  style={{ width: 300, maxWidth: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, padding: "26px 28px", transition: "transform .28s cubic-bezier(.2,.7,.3,1), box-shadow .28s, border-color .28s", transitionDelay: `${i * 120}ms` }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 44px rgba(0,0,0,.38)"; e.currentTarget.style.borderColor = "rgba(79,217,155,.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; }}
                >
                  <div style={{ color: "#eafff5", fontSize: "1.24rem", fontWeight: 800, letterSpacing: "-.01em" }}>{m.name}</div>
                  <div style={{ color: "#4fd99b", fontSize: ".8rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", margin: "6px 0 10px" }}>{m.title}</div>
                  <a href={`mailto:${m.email}`} style={{ color: "#9cc4b3", fontSize: ".94rem", fontWeight: 600, transition: "color .2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#4fd99b"} onMouseLeave={(e) => e.currentTarget.style.color = "#9cc4b3"}>{m.email}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width:560px){ .founder-grid .founder-card{ width:100% !important; } }`}</style>
    </section>
  );
}

Object.assign(window, { Founders });
