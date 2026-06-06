import { useState } from "react";
import type { OptimizeRequest, OptimizeResult } from "@wisata-gen/shared";
import LandingView from "./components/LandingView";

type AppState = "idle" | "loading" | "done" | "error";

export default function App() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [result, setResult]     = useState<OptimizeResult | null>(null);
  const [error, setError]       = useState("");

  async function handleOptimize(req: OptimizeRequest) {
    setAppState("loading");
    setError("");
    try {
      const res  = await fetch("/api/optimize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail ?? "Terjadi kesalahan pada server");
      setResult(json.data as OptimizeResult);
      setAppState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error tidak diketahui");
      setAppState("error");
    }
  }

  return (
    <LandingView
      onSubmit={handleOptimize}
      appState={appState}
      result={result}
      error={error}
      onReset={() => setAppState("idle")}
    />
  );
}
