import { useState, useEffect, useRef } from "react";
import type { CSSProperties, FormEvent } from "react";
import type { OptimizeRequest } from "@wisata-gen/shared";
import DatasetView from "./DatasetView";

const BUDGET_PRESETS   = [{ label: "Hemat",      sub: "Rp 3.000.000",  value: 3000  },
                          { label: "Menengah",   sub: "Rp 8.000.000",  value: 8000  },
                          { label: "Premium",    sub: "Rp 15.000.000", value: 15000 }];
const DURATION_PRESETS = [{ label: "Weekend",    sub: "2–3 hari",      value: 3  },
                          { label: "Seminggu",   sub: "7 hari",        value: 7  },
                          { label: "Dua Minggu", sub: "14 hari",       value: 14 }];

type Props = {
  onSubmit: (req: OptimizeRequest) => void;
  appState: "idle" | "loading" | "done" | "error";
};

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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ anggaran_maks: anggaran, durasi_maks: durasi, ukuran_populasi: populasi, max_generasi: generasi, pc, pm, metode_seleksi: metode });
  }

  const anim = (delay: number): CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.75s ${delay}ms cubic-bezier(0.16,1,0.3,1), transform 0.75s ${delay}ms cubic-bezier(0.16,1,0.3,1)`,
  });

  return (
    <section id="form-section" ref={formRef} className="min-h-screen snap-start bg-surface flex items-center justify-center py-12 px-6">
      <div className="max-w-[30rem] mx-auto w-full">

        <div style={anim(0)} className="mb-10 text-center">
          <p className="font-display font-bold text-dark leading-[1.08] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5rem)]">
            Atur<br />Preferensi<br />Perjalanan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

          {/* Anggaran */}
          <div style={anim(120)} className="p-5 rounded-2xl bg-white border border-dim">
            <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted block mb-3.5">Anggaran Maksimum</label>
            <div className="flex gap-2">
              {BUDGET_PRESETS.map(p => (
                <button key={p.value} type="button" onClick={() => setAnggaran(p.value)}
                  className={`flex-1 py-3 px-2 rounded-[10px] cursor-pointer border-0 transition-all text-center ${
                    anggaran === p.value ? "bg-dark text-surface" : "bg-subtle text-secondary"
                  }`}>
                  <div className="text-[13px] font-semibold font-display">{p.label}</div>
                  <div className="text-[11px] mt-[3px] opacity-75">{p.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Durasi */}
          <div style={anim(220)} className="p-5 rounded-2xl bg-white border border-dim">
            <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted block mb-3.5">Durasi Maksimum</label>
            <div className="flex gap-2">
              {DURATION_PRESETS.map(p => (
                <button key={p.value} type="button" onClick={() => setDurasi(p.value)}
                  className={`flex-1 py-3 px-2 rounded-[10px] cursor-pointer border-0 transition-all text-center ${
                    durasi === p.value ? "bg-dark text-surface" : "bg-subtle text-secondary"
                  }`}>
                  <div className="text-[13px] font-semibold font-display">{p.label}</div>
                  <div className="text-[11px] mt-[3px] opacity-75">{p.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameter GA */}
          <div style={anim(300)}>
            <div className="rounded-2xl bg-white border border-dim overflow-hidden">
              <button type="button" onClick={() => setShowParams(!showParams)}
                className="w-full py-4 px-5 bg-transparent border-0 cursor-pointer flex items-center justify-between font-display text-[13px] font-medium text-dark">
                <span>Parameter Algoritma Genetika</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9b9b94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="transition-transform duration-200"
                  style={{ transform: showParams ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div
                className="grid transition-[grid-template-rows] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ gridTemplateRows: showParams ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <div className="pt-4 px-5 pb-5 border-t border-subtle flex flex-col gap-3.5">

                    <SliderParam label="Ukuran Populasi" value={populasi} display={`${populasi} kromosom`}
                      min={10} max={200} step={10} onChange={setPopulasi} />

                    <SliderParam label="Jumlah Generasi" value={generasi} display={`${generasi} generasi`}
                      min={50} max={500} step={50} onChange={setGenerasi} />

                    <SliderParam label="Prob. Crossover (pc)" value={pc} display={pc.toFixed(2)}
                      min={0.4} max={1.0} step={0.05} onChange={setPc} />

                    <SliderParam label="Prob. Mutasi per-bit (pm)" value={pm} display={pm.toFixed(2)}
                      min={0.01} max={0.3} step={0.01} onChange={setPm} />

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">Metode Seleksi</p>
                      <div className="flex gap-2">
                        {(["tournament", "roulette"] as const).map(m => (
                          <button key={m} type="button" onClick={() => setMetode(m)}
                            className={`flex-1 p-2 rounded-lg text-[13px] font-medium cursor-pointer border-0 transition-all capitalize font-display ${
                              metode === m ? "bg-dark text-surface" : "bg-subtle text-secondary"
                            }`}>{m}</button>
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
              className="bg-transparent border-0 cursor-pointer flex items-center gap-1.5 text-secondary text-xs p-0 font-sans">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform duration-200 flex-shrink-0"
                style={{ transform: showDataset ? "rotate(90deg)" : "rotate(0deg)" }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
              Lihat dataset paket wisata (20 paket)
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${showDataset ? "mt-3" : "mt-0"}`}
              style={{ gridTemplateRows: showDataset ? "1fr" : "0fr" }}>
              <div className="overflow-hidden">
                <div className="rounded-xl border border-dim overflow-hidden">
                  <DatasetView />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={anim(440)}>
            <button type="submit" disabled={appState === "loading"}
              className={`w-full p-[15px] rounded-xl text-surface font-semibold text-[15px] border-0 transition-all font-display ${
                appState === "loading" ? "bg-dim cursor-not-allowed" : "bg-dark cursor-pointer"
              }`}>
              {appState === "loading" ? "Menjalankan Evolusi..." : "Jalankan Optimasi"}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}

type SliderParamProps = {
  label:    string;
  value:    number;
  display:  string;
  min:      number;
  max:      number;
  step:     number;
  onChange: (v: number) => void;
};

function SliderParam({ label, value, display, min, max, step, onChange }: SliderParamProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[11px] text-muted">{label}</span>
        <span className="text-xs font-bold text-dark font-display">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-dark"
      />
    </div>
  );
}
