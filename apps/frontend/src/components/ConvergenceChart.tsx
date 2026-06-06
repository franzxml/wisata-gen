import { useState, useRef } from "react";

interface Props {
  terbaik:  number[];
  rata:     number[];
  terburuk: number[];
}

const SERIES = [
  { key: "terbaik"  as const, label: "Terbaik",  color: "#3d3d22", dash: ""      },
  { key: "rata"     as const, label: "Rata-rata", color: "#6b6b63", dash: "5 3"  },
  { key: "terburuk" as const, label: "Terburuk",  color: "#9b6b5a", dash: "3 3"  },
];

export default function ConvergenceChart({ terbaik, rata, terburuk }: Props) {
  const W   = 600;
  const H   = 240;
  const pad = { t: 16, r: 24, b: 52, l: 52 };
  const iw  = W - pad.l - pad.r;
  const ih  = H - pad.t - pad.b;

  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const n = terbaik.length;
  if (n < 2) return null;

  const allVals = [...terbaik, ...rata, ...terburuk];
  const dataMin = Math.min(...allVals);
  const dataMax = Math.max(...allVals);
  const flat    = dataMax - dataMin < 0.001;
  const minVal  = flat ? Math.max(0, dataMin - 0.05) : dataMin;
  const maxVal  = flat ? dataMax + 0.05 : dataMax;
  const range   = maxVal - minVal;

  const toX = (i: number) => pad.l + (i / (n - 1)) * iw;
  const toY = (v: number) => pad.t + ih - ((v - minVal) / range) * ih;

  const series = { terbaik, rata, terburuk };
  const points = (key: keyof typeof series) =>
    series[key].map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  const yTicks = Array.from({ length: 5 }, (_, i) => minVal + (range * i) / 4);
  const xLabels = [0, Math.floor(n/4), Math.floor(n/2), Math.floor(n*3/4), n-1];

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect   = svgRef.current.getBoundingClientRect();
    const scaleX = W / rect.width;
    const relX   = (e.clientX - rect.left) * scaleX - pad.l;
    const idx    = Math.round((relX / iw) * (n - 1));
    setHoverIdx(Math.max(0, Math.min(n - 1, idx)));
  }

  const hx = hoverIdx !== null ? toX(hoverIdx) : null;
  const tooltipRight = hoverIdx !== null && hoverIdx > n * 0.65;

  return (
    <>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* Grid + Y ticks */}
        {yTicks.map((tick, i) => {
          const y = toY(tick);
          return (
            <g key={i}>
              <line x1={pad.l} y1={y} x2={pad.l + iw} y2={y} stroke="#e8e7e1" strokeWidth="1" />
              <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9b9b94">
                {tick.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + ih} stroke="#c9c9bf" strokeWidth="1.5" />
        <line x1={pad.l} y1={pad.t + ih} x2={pad.l + iw} y2={pad.t + ih} stroke="#c9c9bf" strokeWidth="1.5" />

        {/* X labels */}
        {xLabels.map(i => (
          <text key={i} x={toX(i)} y={pad.t + ih + 16} textAnchor="middle" fontSize="10" fill="#9b9b94">{i + 1}</text>
        ))}

        {/* Axis labels */}
        <text x={pad.l + iw / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#9b9b94">Generasi</text>
        <text x={12} y={pad.t + ih / 2} textAnchor="middle" fontSize="10" fill="#9b9b94"
          transform={`rotate(-90,12,${pad.t + ih / 2})`}>Fitness</text>

        {/* 3 Lines */}
        {SERIES.map(s => (
          <polyline key={s.key}
            points={points(s.key)}
            fill="none"
            stroke={s.color}
            strokeWidth={s.key === "terbaik" ? 2.5 : 1.5}
            strokeDasharray={s.dash}
            strokeLinejoin="round"
          />
        ))}

        {/* Hover crosshair */}
        {hoverIdx !== null && hx !== null && (
          <g>
            <line x1={hx} y1={pad.t} x2={hx} y2={pad.t + ih}
              stroke="#1c1c14" strokeWidth="1" strokeDasharray="4 3" opacity="0.3" />

            {/* Dots on each series */}
            {SERIES.map(s => (
              <circle key={s.key}
                cx={hx} cy={toY(series[s.key][hoverIdx])}
                r="4" fill={s.color}
              />
            ))}

            {/* Tooltip */}
            <g transform={`translate(${tooltipRight ? hx - 124 : hx + 12},${pad.t + 4})`}>
              <rect x="0" y="0" width="112" height="72" rx="8" fill="#1c1c14" opacity="0.92" />
              <text x="10" y="16" fontSize="10" fill="#9b9b94">Generasi {hoverIdx + 1}</text>
              {SERIES.map((s, i) => (
                <g key={s.key}>
                  <circle cx="14" cy={30 + i * 16} r="3" fill={s.color} />
                  <text x="22" y={34 + i * 16} fontSize="11" fill="#f0efe9">
                    {s.label}: <tspan fontWeight="700">{series[s.key][hoverIdx].toFixed(4)}</tspan>
                  </text>
                </g>
              ))}
            </g>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "8px" }}>
        {SERIES.map(s => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: s.color }}>
            <svg width="20" height="10">
              <line x1="0" y1="5" x2="20" y2="5"
                stroke={s.color} strokeWidth={s.key === "terbaik" ? 2.5 : 1.5}
                strokeDasharray={s.dash} />
            </svg>
            {s.label}
          </div>
        ))}
      </div>
    </>
  );
}
