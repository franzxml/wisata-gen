import type { OptimizeResult } from "@wisata-gen/shared";
import ResultsView from "./ResultsView";

type Props = {
  appState: "loading" | "done" | "error";
  result:   OptimizeResult | null;
  error:    string;
  onReset:  () => void;
};

export default function ResultSection({ appState, result, error, onReset }: Props) {
  return (
    <section id="result-section" className="min-h-screen snap-start bg-surface">

      {appState === "loading" && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5 animate-sec-fade-in">
          <div className="w-8 h-8 rounded-full border-2 border-dim border-t-dark animate-spinner" />
          <div className="text-center">
            <p className="font-display font-semibold text-dark">Menjalankan Evolusi</p>
            <p className="text-sm text-secondary mt-1">GA sedang mencari kombinasi optimal...</p>
          </div>
        </div>
      )}

      {appState === "done" && result && (
        <div className="animate-sec-fade-in-slow min-h-screen flex items-center justify-center">
          <ResultsView result={result} />
        </div>
      )}

      {appState === "error" && (
        <div className="min-h-screen flex items-center justify-center p-6 animate-sec-fade-in">
          <div className="max-w-[360px] w-full text-center">
            <p className="font-display text-xl font-bold text-dark mb-3">Optimasi Gagal</p>
            <p className="text-[13px] text-error bg-error-surface border border-error-dim rounded-[10px] p-3 text-left mb-4">{error}</p>
            <button onClick={onReset} className="w-full p-3 rounded-full bg-dark text-surface font-semibold border-0 cursor-pointer font-display">
              Coba Lagi
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
