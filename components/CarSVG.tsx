"use client";

/**
 * Photorealistic premium sports car SVG component
 * Professional-grade rendering with 3D depth, realistic lighting, and metallic finish
 * Transforms from dirty to clean with cinematic effects
 */

interface CarSVGProps {
  progress: number; // 0 = dirty, 1 = clean
  className?: string;
}

export default function CarSVG({ progress, className = "" }: CarSVGProps) {
  // Calculate dirty/clean states with dramatic transitions
  const dirtOpacity = Math.max(0, 1 - progress);
  const shineOpacity = Math.min(1, progress);
  // More dramatic blur when dirty
  const blurAmount = dirtOpacity * 5;
  // More dramatic brightness change
  const brightness = 0.35 + progress * 0.65;
  const contrast = 0.55 + progress * 0.45;
  const saturation = 0.35 + progress * 0.65;

  // Unique IDs for filters
  const filterId = `dirtyFilter-${Math.random().toString(36).substr(2, 9)}`;
  const patternId = `dirtPattern-${Math.random().toString(36).substr(2, 9)}`;
  const shineGradientId = `shineGradient-${Math.random().toString(36).substr(2, 9)}`;
  const reflectionGradientId = `reflectionGradient-${Math.random().toString(36).substr(2, 9)}`;
  const highlightGradientId = `highlightGradient-${Math.random().toString(36).substr(2, 9)}`;
  const bodyGradientId = `bodyGradient-${Math.random().toString(36).substr(2, 9)}`;
  const bodyShadowId = `bodyShadow-${Math.random().toString(36).substr(2, 9)}`;
  const metallicGradientId = `metallicGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      viewBox="0 0 1400 700"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Professional dirty effect filter */}
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurAmount} />
          <feColorMatrix
            type="matrix"
            values={`${brightness} 0 0 0 0
                     0 ${brightness} 0 0 0
                     0 0 ${brightness} 0 0
                     0 0 0 ${contrast} 0`}
          />
          <feColorMatrix type="saturate" values={String(saturation)} />
        </filter>

        {/* Realistic dirt particles - subtle and professional */}
        <pattern
          id={patternId}
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
          opacity={dirtOpacity * 0.6}
        >
          {/* Subtle, varied dirt particles */}
          <circle cx="25" cy="30" r="3" fill="#1a1a15" opacity="0.7" />
          <circle cx="70" cy="45" r="2.5" fill="#2a2a20" opacity="0.6" />
          <circle cx="120" cy="35" r="3.5" fill="#1a1a15" opacity="0.8" />
          <circle cx="40" cy="90" r="2.8" fill="#2a2a20" opacity="0.65" />
          <circle cx="95" cy="110" r="3" fill="#1a1a15" opacity="0.7" />
          <circle cx="150" cy="75" r="2.5" fill="#2a2a20" opacity="0.6" />
          <circle cx="55" cy="140" r="3.2" fill="#1a1a15" opacity="0.75" />
          <circle cx="110" cy="160" r="2.8" fill="#2a2a20" opacity="0.65" />
          <circle cx="20" cy="70" r="2.5" fill="#2a2a20" opacity="0.6" />
          <circle cx="85" cy="20" r="3" fill="#1a1a15" opacity="0.7" />
          <circle cx="135" cy="125" r="2.8" fill="#2a2a20" opacity="0.65" />
          <circle cx="60" cy="5" r="2.5" fill="#1a1a15" opacity="0.7" />
        </pattern>

        {/* Professional metallic body gradient - 3D depth */}
        <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1f" />
          <stop offset="15%" stopColor="#0f0f14" />
          <stop offset="50%" stopColor="#050509" />
          <stop offset="85%" stopColor="#0a0a0f" />
          <stop offset="100%" stopColor="#15151a" />
        </linearGradient>

        {/* Realistic shadow for depth */}
        <radialGradient id={bodyShadowId} cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.3)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Premium metallic shine gradient */}
        <linearGradient id={metallicGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="15%" stopColor="rgba(255,255,255,0.08)" stopOpacity={shineOpacity * 0.08} />
          <stop offset="35%" stopColor="rgba(255,255,255,0.25)" stopOpacity={shineOpacity * 0.25} />
          <stop offset="50%" stopColor="rgba(255,255,255,0.4)" stopOpacity={shineOpacity * 0.4} />
          <stop offset="65%" stopColor="rgba(255,255,255,0.3)" stopOpacity={shineOpacity * 0.3} />
          <stop offset="85%" stopColor="rgba(255,255,255,0.12)" stopOpacity={shineOpacity * 0.12} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Premium shine gradient */}
        <linearGradient id={shineGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="20%" stopColor="rgba(255,255,255,0.1)" stopOpacity={shineOpacity * 0.1} />
          <stop offset="40%" stopColor="rgba(255,255,255,0.35)" stopOpacity={shineOpacity * 0.35} />
          <stop offset="50%" stopColor="rgba(255,255,255,0.5)" stopOpacity={shineOpacity * 0.5} />
          <stop offset="60%" stopColor="rgba(255,255,255,0.45)" stopOpacity={shineOpacity * 0.45} />
          <stop offset="80%" stopColor="rgba(255,255,255,0.2)" stopOpacity={shineOpacity * 0.2} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Realistic sky reflection gradient */}
        <linearGradient id={reflectionGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(250,255,255,0.7)" stopOpacity={shineOpacity * 0.7} />
          <stop offset="20%" stopColor="rgba(220,240,250,0.5)" stopOpacity={shineOpacity * 0.5} />
          <stop offset="40%" stopColor="rgba(180,200,220,0.35)" stopOpacity={shineOpacity * 0.35} />
          <stop offset="60%" stopColor="rgba(140,160,180,0.25)" stopOpacity={shineOpacity * 0.25} />
          <stop offset="80%" stopColor="rgba(100,120,140,0.15)" stopOpacity={shineOpacity * 0.15} />
          <stop offset="100%" stopColor="rgba(60,80,100,0.08)" stopOpacity={shineOpacity * 0.08} />
        </linearGradient>

        {/* Professional highlight gradient */}
        <linearGradient id={highlightGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.3)" stopOpacity={shineOpacity * 0.3} />
          <stop offset="50%" stopColor="rgba(255,255,255,0.6)" stopOpacity={shineOpacity * 0.6} />
          <stop offset="70%" stopColor="rgba(255,255,255,0.4)" stopOpacity={shineOpacity * 0.4} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Professional Sports Car with 3D Depth */}
      <g filter={progress < 0.95 ? `url(#${filterId})` : undefined}>
        {/* Main body - photorealistic proportions */}
        <path
          d="M 180 480 Q 200 340 260 260 L 340 220 Q 420 200 520 210 L 720 225 Q 840 245 920 300 L 960 360 Q 970 420 950 480 L 920 540 Q 860 580 780 590 L 520 600 Q 340 595 260 580 L 200 560 Q 170 530 180 500 Z"
          fill={`url(#${bodyGradientId})`}
          stroke="rgba(5,5,9,0.8)"
          strokeWidth="2"
        />

        {/* Body shadow for depth */}
        <path
          d="M 180 480 Q 200 340 260 260 L 340 220 Q 420 200 520 210 L 720 225 Q 840 245 920 300 L 960 360 Q 970 420 950 480 L 920 540 Q 860 580 780 590 L 520 600 Q 340 595 260 580 L 200 560 Q 170 530 180 500 Z"
          fill={`url(#${bodyShadowId})`}
          opacity="0.4"
        />

        {/* Lower body section - darker for depth */}
        <path
          d="M 260 260 L 340 220 L 920 300 L 950 480 L 780 590 L 260 580 L 200 560 Z"
          fill="#030305"
          stroke="rgba(8,8,12,0.6)"
          strokeWidth="1.5"
        />

        {/* Hood section - with realistic curve */}
        <path
          d="M 340 220 Q 420 210 520 215 L 720 230 Q 840 250 920 300 L 880 340 Q 720 330 520 325 L 340 310 Z"
          fill="#0a0a0f"
          stroke="rgba(15,15,20,0.5)"
          strokeWidth="1.5"
        />

        {/* Windshield - realistic glass with reflection */}
        <path
          d="M 380 240 Q 440 230 520 235 L 720 250 Q 800 265 860 290 L 880 320 Q 875 350 860 370 L 720 380 L 520 375 Q 440 365 380 355 Z"
          fill="rgba(180,220,255,0.15)"
          stroke="rgba(120,160,200,0.3)"
          strokeWidth="1.5"
        >
          {shineOpacity > 0.5 && (
            <animate
              attributeName="fill-opacity"
              values="0.15;0.25;0.15"
              dur="5s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Side windows - premium tinted glass */}
        <path
          d="M 520 375 L 720 380 L 860 395 Q 890 420 885 460 L 860 500 Q 820 520 780 530 L 720 535 L 520 530 Q 460 520 430 500 Z"
          fill="rgba(40,60,80,0.4)"
          stroke="rgba(20,40,60,0.6)"
          strokeWidth="1.5"
        />

        {/* Front grille - aggressive but refined */}
        <path
          d="M 180 480 Q 190 440 220 400 L 260 380 Q 300 370 340 380 L 260 420 Z"
          fill="#010103"
          stroke="rgba(10,10,15,0.8)"
          strokeWidth="2"
        />
        {/* Refined grille slats */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1={200 + i * 15}
            y1={385 + i * 3}
            x2={200 + i * 15}
            y2={415 - i * 3}
            stroke="rgba(30,30,40,0.6)"
            strokeWidth="1.5"
          />
        ))}

        {/* Premium LED headlights - realistic design */}
        <g>
          {/* Main headlight housing */}
          <ellipse cx="300" cy="420" rx="28" ry="20" fill="#1a1a1f" />
          <ellipse cx="300" cy="420" rx="25" ry="18" fill="#0a0a0f" />
          {/* LED light */}
          <ellipse cx="300" cy="420" rx="20" ry="14" fill="#ffffe8" opacity={0.98 + shineOpacity * 0.02} />
          <ellipse cx="300" cy="420" rx="14" ry="10" fill="#ffffff" opacity={1} />
          <ellipse cx="300" cy="420" rx="8" ry="6" fill="#ffffff" opacity={1} />
          {/* LED accent strip */}
          <path
            d="M 282 410 Q 300 405 318 410"
            fill="none"
            stroke="#b8ffff"
            strokeWidth="3"
            opacity={0.85 + shineOpacity * 0.15}
          />
        </g>

        {/* Premium alloy wheels - photorealistic */}
        <g>
          {/* Front wheel */}
          <circle cx="400" cy="560" r="65" fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="6" />
          <circle cx="400" cy="560" r="58" fill="#1a1a1a" />
          <circle cx="400" cy="560" r="50" fill="#2a2a2a" />
          <circle cx="400" cy="560" r="42" fill="#1a1a1a" />
          {/* Multi-spoke premium design */}
          {[0, 18, 36, 54, 72, 90, 108, 126, 144, 162].map((angle) => (
            <g key={angle}>
              <line
                x1={400}
                y1={560}
                x2={400 + 38 * Math.cos((angle * Math.PI) / 180)}
                y2={560 + 38 * Math.sin((angle * Math.PI) / 180)}
                stroke="#3a3a3a"
                strokeWidth="3.5"
              />
              <circle
                cx={400 + 33 * Math.cos((angle * Math.PI) / 180)}
                cy={560 + 33 * Math.sin((angle * Math.PI) / 180)}
                r="5"
                fill="#4a4a4a"
              />
            </g>
          ))}
          <circle cx="400" cy="560" r="22" fill="#2a2a2a" />
          <circle cx="400" cy="560" r="16" fill="#1a1a1a" />
          {/* Center cap */}
          <circle cx="400" cy="560" r="12" fill="#3a3a3a" />
          <circle cx="400" cy="560" r="6" fill="#5a5a5a" />
        </g>

        {/* Premium alloy wheels - rear */}
        <g>
          <circle cx="1000" cy="560" r="65" fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="6" />
          <circle cx="1000" cy="560" r="58" fill="#1a1a1a" />
          <circle cx="1000" cy="560" r="50" fill="#2a2a2a" />
          <circle cx="1000" cy="560" r="42" fill="#1a1a1a" />
          {/* Multi-spoke premium design */}
          {[0, 18, 36, 54, 72, 90, 108, 126, 144, 162].map((angle) => (
            <g key={angle}>
              <line
                x1={1000}
                y1={560}
                x2={1000 + 38 * Math.cos((angle * Math.PI) / 180)}
                y2={560 + 38 * Math.sin((angle * Math.PI) / 180)}
                stroke="#3a3a3a"
                strokeWidth="3.5"
              />
              <circle
                cx={1000 + 33 * Math.cos((angle * Math.PI) / 180)}
                cy={560 + 33 * Math.sin((angle * Math.PI) / 180)}
                r="5"
                fill="#4a4a4a"
              />
            </g>
          ))}
          <circle cx="1000" cy="560" r="22" fill="#2a2a2a" />
          <circle cx="1000" cy="560" r="16" fill="#1a1a1a" />
          {/* Center cap */}
          <circle cx="1000" cy="560" r="12" fill="#3a3a3a" />
          <circle cx="1000" cy="560" r="6" fill="#5a5a5a" />
        </g>

        {/* Side body lines - subtle and professional */}
        <path
          d="M 360 400 Q 460 390 560 395 L 760 410 Q 860 425 920 450"
          fill="none"
          stroke="rgba(80,90,110,0.5)"
          strokeWidth="2"
          strokeDasharray={dirtOpacity > 0.3 ? "10,6" : "0"}
        />

        {/* Secondary body line */}
        <path
          d="M 380 460 Q 480 450 580 455 L 780 470 Q 880 485 940 510"
          fill="none"
          stroke="rgba(70,80,100,0.4)"
          strokeWidth="1.5"
          strokeDasharray={dirtOpacity > 0.3 ? "8,5" : "0"}
        />

        {/* Door handle - premium flush design */}
        <ellipse cx="640" cy="440" rx="35" ry="8" fill="#2a2a2f" />
        <ellipse cx="640" cy="440" rx="30" ry="7" fill="#3a3a3f" />
        <line x1="610" y1="440" x2="670" y2="440" stroke="#4a4a4f" strokeWidth="2" />
        {/* Handle indentation */}
        <ellipse cx="640" cy="440" rx="26" ry="6" fill="#1a1a1f" />

        {/* Side mirrors - aerodynamic premium design */}
        <g>
          <ellipse cx="360" cy="300" rx="18" ry="28" fill="#1a1a1f" />
          <ellipse cx="360" cy="300" rx="14" ry="22" fill="#2a2a2f" />
          <ellipse cx="360" cy="300" rx="10" ry="16" fill="#3a3a3f" />
        </g>
        <g>
          <ellipse cx="1040" cy="320" rx="18" ry="28" fill="#1a1a1f" />
          <ellipse cx="1040" cy="320" rx="14" ry="22" fill="#2a2a2f" />
          <ellipse cx="1040" cy="320" rx="10" ry="16" fill="#3a3a3f" />
        </g>

        {/* Rear spoiler - aggressive but refined */}
        <path
          d="M 920 300 Q 960 260 1000 280 L 1040 320 Q 1050 360 1040 400"
          fill="#1a1a1f"
          stroke="#0a0a0f"
          strokeWidth="3"
        />
        <path
          d="M 1000 280 L 1040 320 L 1040 400 L 1000 360 Z"
          fill="#0f0f14"
          stroke="#080810"
          strokeWidth="2"
        />

        {/* Exhaust tips - dual premium design */}
        <g>
          <ellipse cx="1060" cy="520" rx="16" ry="24" fill="#2a2a2a" />
          <ellipse cx="1060" cy="520" rx="12" ry="18" fill="#1a1a1a" />
          <ellipse cx="1080" cy="520" rx="16" ry="24" fill="#2a2a2a" />
          <ellipse cx="1080" cy="520" rx="12" ry="18" fill="#1a1a1a" />
        </g>

        {/* Metallic finish overlay */}
        {shineOpacity > 0.1 && (
          <rect
            x="180"
            y="260"
            width="780"
            height="340"
            fill={`url(#${metallicGradientId})`}
            opacity={shineOpacity * 0.6}
          />
        )}

        {/* Dirt overlay pattern - subtle and professional */}
        {dirtOpacity > 0.15 && (
          <rect
            x="180"
            y="260"
            width="780"
            height="340"
            fill={`url(#${patternId})`}
            opacity={dirtOpacity * 0.7}
          />
        )}

        {/* Water spots - realistic and varied */}
        {dirtOpacity > 0.25 && (
          <g opacity={dirtOpacity * 0.8}>
            <ellipse cx="480" cy="380" rx="40" ry="28" fill="rgba(90,90,100,0.25)" />
            <ellipse cx="720" cy="440" rx="35" ry="24" fill="rgba(90,90,100,0.25)" />
            <ellipse cx="880" cy="400" rx="32" ry="22" fill="rgba(90,90,100,0.25)" />
            <ellipse cx="600" cy="480" rx="38" ry="26" fill="rgba(90,90,100,0.25)" />
            <ellipse cx="800" cy="500" rx="30" ry="20" fill="rgba(90,90,100,0.25)" />
            <ellipse cx="540" cy="460" rx="35" ry="24" fill="rgba(90,90,100,0.2)" />
          </g>
        )}

        {/* Premium clean shine effect */}
        {shineOpacity > 0.2 && (
          <rect
            x="180"
            y="260"
            width="780"
            height="340"
            fill={`url(#${shineGradientId})`}
            opacity={shineOpacity * 0.7}
          />
        )}

        {/* Realistic sky reflection on clean surface */}
        {shineOpacity > 0.35 && (
          <path
            d="M 360 320 Q 460 310 560 315 L 760 340 Q 860 365 920 400 L 760 420 L 560 410 Q 460 400 360 390 Z"
            fill={`url(#${reflectionGradientId})`}
            opacity={shineOpacity * 0.85}
          />
        )}

        {/* Professional highlight lines when clean */}
        {shineOpacity > 0.55 && (
          <>
            <path
              d="M 360 400 Q 460 390 560 395 L 760 410 Q 860 425 920 450"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="3"
              opacity={shineOpacity}
            />
            <path
              d="M 380 460 Q 480 450 580 455 L 780 470 Q 880 485 940 510"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2.5"
              opacity={shineOpacity * 0.9}
            />
          </>
        )}

        {/* Premium highlight gradient */}
        {shineOpacity > 0.65 && (
          <rect
            x="180"
            y="260"
            width="780"
            height="340"
            fill={`url(#${highlightGradientId})`}
            opacity={shineOpacity * 0.45}
          />
        )}
      </g>
    </svg>
  );
}
