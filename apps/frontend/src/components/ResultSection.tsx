import type { OptimizeResult } from "@wisata-gen/shared";
import ResultsView from "./ResultsView";

interface Props {
  appState: "loading" | "done" | "error";
  result:   OptimizeResult | null;
  error:    string;
  onReset:  () => void;
}

export default function ResultSection({ appState, result, error, onReset }: Props) {
  return (
    <section id="result-section" style={{ minHeight: "100vh", scrollSnapAlign: "start", background: "#f0efe9" }}>

      {appState === "loading" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", animation: "secFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #c9c9bf", borderTopColor: "#1c1c14", animation: "spin 0.8s linear infinite" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, color: "#1c1c14" }}>Menjalankan Evolusi</p>
            <p style={{ fontSize: "14px", color: "#6b6b63", marginTop: "4px" }}>GA sedang mencari kombinasi optimal...</p>
          </div>
        </div>
      )}

      {appState === "done" && result && (
        <div style={{ animation: "secFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) both", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ResultsView result={result} />
        </div>
      )}

      {appState === "error" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", animation: "secFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
          <div style={{ maxWidth: "360px", width: "100%", textAlign: "center" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "20px", fontWeight: 700, color: "#1c1c14", marginBottom: "12px" }}>Optimasi Gagal</p>
            <p style={{ fontSize: "13px", color: "#6b3333", background: "#f5e8e8", border: "1px solid #e8c9c9", borderRadius: "10px", padding: "12px", textAlign: "left", marginBottom: "16px" }}>{error}</p>
            <button onClick={onReset} style={{ width: "100%", padding: "12px", borderRadius: "50px", background: "#1c1c14", color: "#f0efe9", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "Space Grotesk, sans-serif" }}>
              Coba Lagi
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
