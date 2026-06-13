export default function HeroSection() {
  return (
    <section className="h-screen snap-start relative bg-[url('/bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-[rgba(12,11,8,0.38)]" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(10,9,6,0.45) 0%, transparent 80%)" }} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 55% 75% at 78% -5%,  rgba(255,225,110,0.55) 0%, rgba(255,200,70,0.25) 30%, transparent 65%),
            linear-gradient(148deg, rgba(255,220,100,0.18) 0%, transparent 48%),
            linear-gradient(154deg, rgba(255,215,90,0.12)  0%, transparent 44%),
            linear-gradient(160deg, rgba(255,220,100,0.15) 0%, transparent 50%),
            linear-gradient(166deg, rgba(255,210,80,0.10)  0%, transparent 42%),
            linear-gradient(172deg, rgba(255,220,100,0.13) 0%, transparent 46%),
            linear-gradient(178deg, rgba(255,215,90,0.08)  0%, transparent 38%)
          `,
        }}
      />
      <div className="relative h-full flex items-center justify-center px-6 z-[1]">
        <h1
          className="font-display font-bold text-white leading-[1.05] tracking-[-0.025em] text-[clamp(3rem,7vw,7.5rem)] text-center"
          style={{ textShadow: "0 2px 40px rgba(10,9,6,0.6), 0 1px 8px rgba(10,9,6,0.4)" }}
        >
          Temukan Paket<br />
          Wisata <span className="text-accent-light">Terbaik</span><br />
          untuk Anda.
        </h1>
      </div>
      <button
        onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-transparent border-0 cursor-pointer flex flex-col items-center gap-1.5 text-white/75 py-2 px-4"
      >
        <span className="font-display text-[13px] font-medium tracking-[0.04em]">
          Geser ke bawah
        </span>
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="animate-chevron-bounce"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </section>
  );
}
