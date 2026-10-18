// Stylised SVG stand-ins shown when the real photos in public/images are missing.

type Props = { variant: "traditional" | "digital"; className?: string };

function Person({
  x,
  y,
  s = 1,
  fill,
  head,
}: {
  x: number;
  y: number;
  s?: number;
  fill: string;
  head: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-58" r="16" fill={head} />
      <path d="M-26 0 C-26 -30 -18 -40 0 -40 C18 -40 26 -30 26 0 Z" fill={fill} />
    </g>
  );
}

export default function SceneIllustration({ variant, className }: Props) {
  if (variant === "traditional") {
    return (
      <svg viewBox="0 0 400 300" className={className} role="img" aria-label="رسم توضيحي لعائلة متحلّقة حول الجدّ">
        <defs>
          <radialGradient id="warmGlow" cx="50%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#f6d98b" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#b07d24" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1f140c" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="rug" x1="0" x2="1">
            <stop offset="0%" stopColor="#7a3b1d" />
            <stop offset="50%" stopColor="#a4532a" />
            <stop offset="100%" stopColor="#7a3b1d" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="#1f140c" />
        <rect width="400" height="300" fill="url(#warmGlow)" />
        {/* arched window */}
        <path d="M170 30 h60 v70 h-60z M170 30 a30 30 0 0 1 60 0" fill="#2e1e12" stroke="#d9a23a" strokeOpacity="0.4" />
        {/* lantern */}
        <line x1="200" y1="0" x2="200" y2="40" stroke="#d9a23a" strokeOpacity="0.6" />
        <circle cx="200" cy="52" r="10" fill="#f6d98b">
          <animate attributeName="opacity" values="0.75;1;0.75" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* rug */}
        <ellipse cx="200" cy="250" rx="180" ry="38" fill="url(#rug)" opacity="0.9" />
        <ellipse cx="200" cy="250" rx="150" ry="28" fill="none" stroke="#eec15b" strokeOpacity="0.45" strokeDasharray="6 6" />
        {/* grandfather in the centre */}
        <Person x={200} y={225} s={1.25} fill="#e8dcc4" head="#c89a6b" />
        <path d="M186 158 q14 18 28 0 v8 q-14 16 -28 0z" fill="#f5f0e6" />
        {/* family circle */}
        <Person x={90} y={262} fill="#8a4b2a" head="#b98258" />
        <Person x={140} y={272} s={0.8} fill="#4a7c59" head="#c08f63" />
        <Person x={262} y={272} s={0.8} fill="#2f5d7c" head="#b98258" />
        <Person x={312} y={262} fill="#9b6a2f" head="#c89a6b" />
        {/* speech / story arcs */}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${150 - i * 18} ${150 - i * 10} Q200 ${110 - i * 14} ${250 + i * 18} ${150 - i * 10}`}
            fill="none"
            stroke="#f6d98b"
            strokeOpacity={0.5 - i * 0.14}
            strokeWidth="2"
          >
            <animate attributeName="stroke-opacity" values={`${0.15};${0.55 - i * 0.14};0.15`} dur="3.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </path>
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="رسم توضيحي لعائلة على أريكة وكلّ فرد منشغل بشاشته">
      <defs>
        <linearGradient id="coolBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1424" />
          <stop offset="100%" stopColor="#16213a" />
        </linearGradient>
        <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#coolBg)" />
      <g stroke="#ffffff" strokeOpacity="0.04">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} />
        ))}
      </g>
      {/* couch */}
      <rect x="40" y="170" width="320" height="70" rx="18" fill="#334155" />
      <rect x="28" y="150" width="34" height="100" rx="14" fill="#475569" />
      <rect x="338" y="150" width="34" height="100" rx="14" fill="#475569" />
      <rect x="40" y="120" width="320" height="60" rx="16" fill="#3b4a63" />
      {/* four people each with a glowing screen and an invisible "glass wall" between them */}
      {[90, 160, 240, 310].map((x, i) => (
        <g key={x}>
          <Person x={x} y={200} s={0.95} fill={["#64748b", "#475569", "#52627a", "#5b6b85"][i]} head="#94a3b8" />
          <circle cx={x} cy={168} r="26" fill="url(#screenGlow)">
            <animate attributeName="r" values="22;28;22" dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          <rect x={x - 9} y={160} width="18" height="26" rx="3" fill="#a5f3fc" />
        </g>
      ))}
      {[125, 200, 275].map((x) => (
        <rect key={x} x={x - 1} y="70" width="2" height="160" fill="#67e8f9" opacity="0.25" />
      ))}
      {/* notification dots */}
      {[60, 150, 230, 330].map((x, i) => (
        <circle key={x} cx={x} cy={60 + (i % 2) * 20} r="5" fill="#f87171">
          <animate attributeName="opacity" values="0;1;0" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <rect x="0" y="240" width="400" height="60" fill="#0d1424" />
    </svg>
  );
}
