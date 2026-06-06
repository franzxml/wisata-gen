import { useEffect, useRef } from "react";
import type { OptimizeRequest, OptimizeResult } from "@wisata-gen/shared";
import HeroSection   from "./HeroSection";
import FormSection   from "./FormSection";
import ResultSection from "./ResultSection";

interface Props {
  onSubmit: (req: OptimizeRequest) => void;
  appState: "idle" | "loading" | "done" | "error";
  result:   OptimizeResult | null;
  error:    string;
  onReset:  () => void;
}

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
    <>
      <div data-snap-container style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
        <HeroSection />
        <FormSection onSubmit={onSubmit} appState={appState} />
        {appState !== "idle" && (
          <ResultSection appState={appState} result={result} error={error} onReset={onReset} />
        )}
      </div>

      <style>{`
        @keyframes secFadeIn {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes chevronBounce {
          0%, 100% { transform: translateY(0);   opacity: 0.75; }
          50%       { transform: translateY(5px); opacity: 1;    }
        }
        div[style*="scroll-snap-type"]::-webkit-scrollbar { display: none; }
        div[style*="scroll-snap-type"] { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
