import { useState, useEffect, useRef } from "react";
import type { OptimizeRequest } from "@wisata-gen/shared";
import DatasetView from "./DatasetView";

const BUDGET_PRESETS   = [{ label: "Hemat",      sub: "Rp 3.000.000",  value: 3000  },
                          { label: "Menengah",   sub: "Rp 8.000.000",  value: 8000  },
                          { label: "Premium",    sub: "Rp 15.000.000", value: 15000 }];
const DURATION_PRESETS = [{ label: "Weekend",    sub: "2–3 hari",      value: 3  },
                          { label: "Seminggu",   sub: "7 hari",        value: 7  },
                          { label: "Dua Minggu", sub: "14 hari",       value: 14 }];

interface Props {
  onSubmit:  (req: OptimizeRequest) => void;
  appState:  "idle" | "loading" | "done" | "error";
}

export default function FormSection({ onSubmit, appState }: Props) {
  const [visible, setVisible]         = useState(false);
  const [anggaran, setAnggaran]       = useState(8000);
  const [durasi, setDurasi]           = useState(7);
  const [populasi, setPopulasi]       = useState(50);
  const [generasi, setGenerasi]       = useState(100);
  const [pc, setPc]                   = useState(0.8);
  const [pm, setPm]                   = useState(0.05);
  const [metode, setMetode]           = useState<"tournament" | "roulette">("tournament");
  const [showParams, setShowParams]   = useState(false);
  const [showDataset, setShowDataset] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (formRef.current) obs.observe(formRef.current);
    return () => obs.disconnect();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ anggaran_maks: anggaran, durasi_maks: durasi, ukuran_populasi: populasi, max_generasi: generasi, pc, pm, metode_seleksi: metode });
  }

  const anim = (delay: number): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.75s ${delay}ms cubic-bezier(0.16,1,0.3,1), transform 0.75s ${delay}ms cubic-bezier(0.16,1,0.3,1)`,
  });

  return (
    <section id="form-section" ref={formRef} style={{ minHeight: "100vh", scrollSnapAlign: "start", background: "#f0efe9", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ maxWidth: "30rem", margin: "0 auto" }}>

        <div style={{ ...anim(0), marginBottom: "40px", textAlign: "center" }}>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: "#1c1c14", lineHeight: 1.08, letterSpacing: "-0.02em", fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            Atur<br />Preferensi<br />Perjalanan.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Anggaran */}
          <div style={{ ...anim(120), padding: "20px", borderRadius: "16px", background: "#ffffff", border: "1px solid #c9c9bf" }}>
            <label style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9b9b94", display: "block", marginBottom: "14px" }}>Anggaran Maksimum</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {BUDGET_PRESETS.map(p => (
                <button key={p.value} type="button" onClick={() => setAnggaran(p.value)} style={{
                  flex: 1, padding: "12px 8px", borderRadius: "10px", cursor: "pointer", border: "none",
                  transition: "all 0.15s", textAlign: "center",
                  background: anggaran === p.value ? "#1c1c14" : "#e8e7e1",
                  color:      anggaran === p.value ? "#f0efe9"  : "#6b6b63",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: "Space Grotesk, sans-serif" }}>{p.label}</div>
                  <div style={{ fontSize: "11px", marginTop: "3px", opacity: 0.75 }}>{p.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Durasi */}
          <div style={{ ...anim(220), padding: "20px", borderRadius: "16px", background: "#ffffff", border: "1px solid #c9c9bf" }}>
            <label style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9b9b94", display: "block", marginBottom: "14px" }}>Durasi Maksimum</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {DURATION_PRESETS.map(p => (
                <button key={p.value} type="button" onClick={() => setDurasi(p.value)} style={{
                  flex: 1, padding: "12px 8px", borderRadius: "10px", cursor: "pointer", border: "none",
                  transition: "all 0.15s", textAlign: "center",
                  background: durasi === p.value ? "#1c1c14" : "#e8e7e1",
                  color:      durasi === p.value ? "#f0efe9"  : "#6b6b63",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: "Space Grotesk, sans-serif" }}>{p.label}</div>
                  <div style={{ fontSize: "11px", marginTop: "3px", opacity: 0.75 }}>{p.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameter GA */}
          <div style={anim(300)}>
            <div style={{ borderRadius: "16px", background: "#ffffff", border: "1px solid #c9c9bf", overflow: "hidden" }}>
              <button type="button" onClick={() => setShowParams(!showParams)}
                style={{ width: "100%", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "Space Grotesk, sans-serif", fontSize: "13px", fontWeight: 500, color: "#1c1c14" }}>
                <span>Parameter Algoritma Genetika</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9b9b94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: "transform 0.2s", transform: showParams ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div style={{
                display: "grid",
                gridTemplateRows: showParams ? "1fr" : "0fr",
                transition: "grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1)",
              }}>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px 20px", borderTop: "1px solid #e8e7e1", display: "flex", flexDirection: "column", gap: "14px" }}>

                    <SliderParam label="Ukuran Populasi" value={populasi} display={`${populasi} kromosom`}
                      min={10} max={200} step={10} onChange={setPopulasi} />

                    <SliderParam label="Jumlah Generasi" value={generasi} display={`${generasi} generasi`}
                      min={50} max={500} step={50} onChange={setGenerasi} />

                    <SliderParam label="Prob. Crossover (pc)" value={pc} display={pc.toFixed(2)}
                      min={0.4} max={1.0} step={0.05} onChange={setPc} />

                    <SliderParam label="Prob. Mutasi per-bit (pm)" value={pm} display={pm.toFixed(2)}
                      min={0.01} max={0.3} step={0.01} onChange={setPm} />

                    <div>
                      <p style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9b9b94", marginBottom: "8px" }}>Metode Seleksi</p>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {(["tournament", "roulette"] as const).map(m => (
                          <button key={m} type="button" onClick={() => setMetode(m)} style={{
                            flex: 1, padding: "8px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
                            cursor: "pointer", border: "none", transition: "all 0.15s", textTransform: "capitalize",
                            background: metode === m ? "#1c1c14" : "#e8e7e1",
                            color:      metode === m ? "#f0efe9"  : "#6b6b63",
                            fontFamily: "Space Grotesk, sans-serif",
                          }}>{m}</button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset */}
          <div style={anim(360)}>
            <button type="button" onClick={() => setShowDataset(!showDataset)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#6b6b63", fontSize: "12px", padding: "0", fontFamily: "DM Sans, sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: "transform 0.2s", transform: showDataset ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
              Lihat dataset paket wisata (20 paket)
            </button>

            <div style={{
              display: "grid",
              gridTemplateRows: showDataset ? "1fr" : "0fr",
              transition: "grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1)",
              marginTop: showDataset ? "12px" : "0",
            }}>
              <div style={{ overflow: "hidden" }}>
                <div style={{ borderRadius: "12px", border: "1px solid #c9c9bf", overflow: "hidden" }}>
                  <DatasetView />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={anim(440)}>
            <button type="submit" disabled={appState === "loading"} style={{
              width: "100%", padding: "15px", borderRadius: "12px",
              background: appState === "loading" ? "#c9c9bf" : "#1c1c14",
              color: "#f0efe9", fontWeight: 600, fontSize: "15px",
              cursor: appState === "loading" ? "not-allowed" : "pointer",
              border: "none", transition: "all 0.2s",
              fontFamily: "Space Grotesk, sans-serif",
            }}>
              {appState === "loading" ? "Menjalankan Evolusi..." : "Jalankan Optimasi"}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}

interface SliderParamProps {
  label:    string;
  value:    number;
  display:  string;
  min:      number;
  max:      number;
  step:     number;
  onChange: (v: number) => void;
}

function SliderParam({ label, value, display, min, max, step, onChange }: SliderParamProps) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
        <span style={{ fontSize: "11px", color: "#9b9b94" }}>{label}</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#1c1c14", fontFamily: "Space Grotesk, sans-serif" }}>{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#1c1c14" }}
      />
    </div>
  );
}

