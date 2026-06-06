export default function HeroSection() {
  return (
    <section style={{
      height: "100vh", scrollSnapAlign: "start", position: "relative",
      backgroundImage: "url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(12,11,8,0.38)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(10,9,6,0.45) 0%, transparent 80%)" }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 55% 75% at 78% -5%,  rgba(255,225,110,0.55) 0%, rgba(255,200,70,0.25) 30%, transparent 65%),
          linear-gradient(148deg, rgba(255,220,100,0.18) 0%, transparent 48%),
          linear-gradient(154deg, rgba(255,215,90,0.12)  0%, transparent 44%),
          linear-gradient(160deg, rgba(255,220,100,0.15) 0%, transparent 50%),
          linear-gradient(166deg, rgba(255,210,80,0.10)  0%, transparent 42%),
          linear-gradient(172deg, rgba(255,220,100,0.13) 0%, transparent 46%),
          linear-gradient(178deg, rgba(255,215,90,0.08)  0%, transparent 38%)
        `,
      }} />
      <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px", zIndex: 1 }}>
        <h1 style={{
          fontFamily: "Space Grotesk, sans-serif", fontWeight: 700,
          color: "#ffffff", lineHeight: 1.05, letterSpacing: "-0.025em",
          fontSize: "clamp(3rem, 7vw, 7.5rem)", textAlign: "center",
          textShadow: "0 2px 40px rgba(10,9,6,0.6), 0 1px 8px rgba(10,9,6,0.4)",
        }}>
          Temukan Paket<br />
          Wisata <span style={{ color: "#e8e0c8" }}>Terbaik</span><br />
          untuk Anda.
        </h1>
      </div>
      <button
        onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
        style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.75)", padding: "8px 16px" }}
      >
        <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em" }}>
          Geser ke bawah
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: "chevronBounce 1.6s ease-in-out infinite" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </section>
  );
}
