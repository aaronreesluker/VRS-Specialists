"use client";

interface VrsDrawLoaderProps {
  title?: string;
  subtitle?: string;
  /** 0..1 */
  progress?: number;
  className?: string;
}

export function VrsDrawLoader({
  title = "V.R.S",
  subtitle = "Vehicle Rejuvenation Specialists",
  progress,
  className = "",
}: VrsDrawLoaderProps) {
  const pct =
    typeof progress === "number" && Number.isFinite(progress)
      ? Math.max(0, Math.min(1, progress))
      : null;

  return (
    <div
      className={[
        "absolute inset-0 z-40 flex items-center justify-center bg-black",
        "px-6 text-center text-white",
        className,
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 1200 380"
          width="min(980px, 92vw)"
          height="auto"
          className="select-none"
          aria-hidden="true"
        >
          {/* Stroke (draw-on) layer */}
          <text
            x="50%"
            y="44%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="vrs-stroke"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.15em",
            }}
          >
            {title}
          </text>

          {/* Fill layer */}
          <text
            x="50%"
            y="44%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="vrs-fill"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.15em",
            }}
          >
            {title}
          </text>

          {/* Subtitle */}
          <text
            x="50%"
            y="74%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="vrs-subtitle"
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 300,
              letterSpacing: "0.22em",
            }}
          >
            {subtitle.toUpperCase()}
          </text>
        </svg>

        {pct !== null && (
          <div className="mt-8 w-[min(360px,82vw)]">
            <div className="h-[2px] w-full bg-white/20">
              <div
                className="h-full bg-white transition-[width] duration-150 ease-linear"
                style={{ width: `${Math.round(pct * 100)}%` }}
              />
            </div>
            <div className="mt-3 text-xs tracking-[0.22em] text-white/70">
              Loading {Math.round(pct * 100)}%
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .vrs-stroke {
          font-size: clamp(120px, 18vw, 260px);
          fill: transparent;
          stroke: rgba(255, 255, 255, 0.98);
          stroke-width: 10;
          paint-order: stroke;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1800;
          stroke-dashoffset: 1800;
          animation: vrs-draw 2.2s ease forwards;
        }

        .vrs-fill {
          font-size: clamp(120px, 18vw, 260px);
          fill: rgba(255, 255, 255, 0.98);
          opacity: 0;
          animation: vrs-fill 0.6s ease forwards, vrs-glow 2.2s ease-in-out 0.8s
              infinite;
          animation-delay: 1.45s, 2.2s;
        }

        .vrs-subtitle {
          font-size: clamp(14px, 2.4vw, 34px);
          fill: rgba(255, 255, 255, 0.7);
          opacity: 0;
          animation: vrs-sub 0.7s ease forwards;
          animation-delay: 1.6s;
        }

        @keyframes vrs-draw {
          0% {
            stroke-dashoffset: 1800;
            opacity: 1;
          }
          55% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.9;
          }
        }

        @keyframes vrs-fill {
          to {
            opacity: 1;
          }
        }

        @keyframes vrs-sub {
          to {
            opacity: 1;
          }
        }

        @keyframes vrs-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
          }
          50% {
            filter: drop-shadow(0 0 22px rgba(255, 255, 255, 0.16));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vrs-stroke,
          .vrs-fill,
          .vrs-subtitle {
            animation: none !important;
          }
          .vrs-stroke {
            stroke-dashoffset: 0;
            opacity: 0.85;
          }
          .vrs-fill,
          .vrs-subtitle {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

