import { useEffect, useRef } from "react";
import type { OptimizeRequest, OptimizeResult } from "@wisata-gen/shared";
import HeroSection   from "./HeroSection";
import FormSection   from "./FormSection";
import ResultSection from "./ResultSection";

type Props = {
  onSubmit: (req: OptimizeRequest) => void;
  appState: "idle" | "loading" | "done" | "error";
  result:   OptimizeResult | null;
  error:    string;
  onReset:  () => void;
};

export default function LandingView({ onSubmit, appState, result, error, onReset }: Props) {
  const prevAppState = useRef(appState);

  useEffect(() => {
    if (prevAppState.current === appState) return;
    const prev = prevAppState.current;
    prevAppState.current = appState;
    if (appState !== "idle") {
      document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (prev !== "idle") {
      document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [appState]);

  return (
    <div data-snap-container className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <HeroSection />
      <FormSection onSubmit={onSubmit} appState={appState} />
      {appState !== "idle" && (
        <ResultSection appState={appState} result={result} error={error} onReset={onReset} />
      )}
    </div>
  );
}
