// Hand-built illustration of the digital scene: a family side by side on a sofa, each walled off by a glowing screen.

type Device = "phone" | "landscape" | "tablet" | "remote";

type SitterProps = {
  x: number;
  s?: number;
  skin: string;
  outfit: string;
  pants: string;
  head: "short" | "hijab" | "headphones" | "kid";
  headColor: string;
  device: Device;
  glasses?: boolean;
  delay: number;
};

const SEAT_Y = 200;

const deviceShape: Record<Device, { w: number; h: number; y: number }> = {
  phone: { w: 9, h: 14, y: -22 },
  landscape: { w: 16, h: 9, y: -19 },
  tablet: { w: 22, h: 15, y: -22 },
  remote: { w: 5, h: 15, y: -22 },
};

function Sitter({ x, s = 1, skin, outfit, pants, head, headColor, device, glasses, delay }: SitterProps) {
  const d = deviceShape[device];
  const handX = Math.max(5, d.w / 2 + 1);
  return (
    <g transform={`translate(${x} ${SEAT_Y}) scale(${s})`}>
      {/* legs down to the floor */}
      <rect x="-11" y="4" width="9" height="40" rx="4" fill={pants} />
      <rect x="2" y="4" width="9" height="40" rx="4" fill={pants} />
      <ellipse cx="-7" cy="45" rx="6.5" ry="3" fill="#0b1120" />
      <ellipse cx="7" cy="45" rx="6.5" ry="3" fill="#0b1120" />
      <rect x="-15" y="-4" width="30" height="12" rx="6" fill={pants} />

      {/* torso and arms bent towards the device */}
      {head === "hijab" && <path d="M-15 -30 Q0 -26 15 -30 L19 2 L-19 2 Z" fill={headColor} />}
      <path d="M-17 2 Q-19 -26 -9 -32 L9 -32 Q19 -26 17 2 Z" fill={outfit} />
      {head === "headphones" && <path d="M-8 -32 Q0 -24 8 -32" stroke="#0f172a" strokeOpacity="0.4" strokeWidth="3" fill="none" />}
      <path d={`M-14 -27 Q-17 -14 -${handX} ${d.y + d.h - 2}`} stroke={outfit} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={`M14 -27 Q17 -14 ${handX} ${d.y + d.h - 2}`} stroke={outfit} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={`M-14 -27 Q-17 -14 -${handX} ${d.y + d.h - 2}`} stroke="#000" strokeOpacity="0.15" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* screen glow washing over the face */}
      <circle cx="0" cy={d.y + d.h / 2} r="30" fill="url(#df-glow)">
        <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2.2 + delay}s`} repeatCount="indefinite" />
      </circle>

      {/* neck and head, tilted down towards the screen */}
      <rect x="-3" y="-37" width="6" height="6" fill={skin} />
      {head === "hijab" && <path d="M-12 -42 Q-13 -59 0 -60 Q13 -59 12 -42 L15 -30 Q0 -26 -15 -30 Z" fill={headColor} />}
      <ellipse cx="0" cy="-44" rx="8.5" ry="10" fill={skin} />
      <ellipse cx="0" cy="-42" rx="8.5" ry="8.5" fill="url(#df-faceLight)" />
      {/* lowered eyes and flat mouth */}
      <path d="M-5.2 -43 h3 M2.2 -43 h3" stroke="#0f172a" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M-2 -37.5 h4" stroke="#0f172a" strokeWidth="0.9" strokeOpacity="0.55" strokeLinecap="round" />
      {glasses && (
        <g fill="#67e8f9" fillOpacity="0.25" stroke="#cbd5e1" strokeWidth="0.8">
          <rect x="-7" y="-46" width="5.5" height="4.5" rx="1.2" />
          <rect x="1.5" y="-46" width="5.5" height="4.5" rx="1.2" />
          <path d="M-1.5 -44 h3" fill="none" />
        </g>
      )}

      {head === "short" && (
        <path d="M-9 -46 Q-10 -56 0 -57 Q10 -56 9 -46 Q8 -51 0 -51 Q-8 -51 -9 -46 Z" fill={headColor} />
      )}
      {head === "kid" && (
        <path d="M-9 -45 Q-10 -57 0 -57 Q10 -57 9 -45 Q6 -52 1 -50 Q-4 -53 -9 -45 Z" fill={headColor} />
      )}
      {head === "hijab" && <path d="M-9.5 -48 Q0 -58 9.5 -48" stroke={headColor} strokeWidth="3.5" fill="none" />}
      {head === "headphones" && (
        <>
          <path d="M-9 -45 Q-10 -57 0 -57 Q10 -57 9 -45 Q4 -50 0 -49 Q-4 -50 -9 -45 Z" fill={headColor} />
          <path d="M-10.5 -44 Q-11 -61 0 -61 Q11 -61 10.5 -44" stroke="#e2e8f0" strokeWidth="2.2" fill="none" />
          <rect x="-13" y="-47" width="5" height="9" rx="2.5" fill="#22d3ee" />
          <rect x="8" y="-47" width="5" height="9" rx="2.5" fill="#22d3ee" />
        </>
      )}

      {/* the device itself */}
      <rect x={-d.w / 2} y={d.y} width={d.w} height={d.h} rx="1.8" fill="#0f172a" />
      <rect x={-d.w / 2 + 1} y={d.y + 1} width={d.w - 2} height={d.h - 2} rx="1.2" fill="#cffafe">
        <animate attributeName="fill" values="#cffafe;#a5f3fc;#cffafe" dur={`${1.6 + delay}s`} repeatCount="indefinite" />
      </rect>
      {device !== "remote" && (
        <path
          d={`M${-d.w / 2 + 2.5} ${d.y + 3.5} h${d.w - 6} M${-d.w / 2 + 2.5} ${d.y + 6} h${(d.w - 6) * 0.6}`}
          stroke="#0891b2"
          strokeWidth="0.9"
          strokeOpacity="0.7"
        />
      )}
      <circle cx={-handX} cy={d.y + d.h - 2} r="2.7" fill={skin} />
      <circle cx={handX} cy={d.y + d.h - 2} r="2.7" fill={skin} />
    </g>
  );
}

/** Translucent pane between two people. */
function GlassWall({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 7} 74 L${x + 7} 66 L${x + 7} 238 L${x - 7} 246 Z`} fill="url(#df-glass)" stroke="#67e8f9" strokeOpacity="0.4" />
      <path d={`M${x - 3} 92 L${x + 3} 88 M${x - 3} 104 L${x + 3} 100`} stroke="#fff" strokeOpacity="0.5" strokeLinecap="round" />
      <path d={`M${x - 7} 74 L${x - 7} 246`} stroke="#a5f3fc" strokeOpacity="0.55" />
      <rect x={x - 7} y="66" width="14" height="180" fill="#67e8f9" opacity="0">
        <animate attributeName="opacity" values="0;0.08;0" dur="4s" repeatCount="indefinite" />
      </rect>
    </g>
  );
}

function Notification({ x, y, kind, begin }: { x: number; y: number; kind: "heart" | "chat" | "bell" | "play"; begin: string }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.7;1" dur="3.6s" begin={begin} repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values={`${x} ${y + 6};${x} ${y};${x} ${y - 4}`} dur="3.6s" begin={begin} repeatCount="indefinite" />
      <rect x="-11" y="-9" width="22" height="16" rx="6" fill="#1e293b" stroke="#67e8f9" strokeOpacity="0.5" />
      <path d="M-3 7 L0 11 L3 7 Z" fill="#1e293b" />
      {kind === "heart" && <path d="M0 3 L-4.5 -1.5 Q-6 -5 -3 -5.5 Q-1 -5.8 0 -3.5 Q1 -5.8 3 -5.5 Q6 -5 4.5 -1.5 Z" fill="#f87171" />}
      {kind === "chat" && (
        <g fill="#a5f3fc">
          <circle cx="-4.5" cy="-1" r="1.6" />
          <circle cx="0" cy="-1" r="1.6" />
          <circle cx="4.5" cy="-1" r="1.6" />
        </g>
      )}
      {kind === "bell" && <path d="M-4 2 Q-4 -6 0 -6 Q4 -6 4 2 Z M-1.5 3 h3" fill="#fcd34d" stroke="#fcd34d" />}
      {kind === "play" && <path d="M-3 -5 L4.5 -1 L-3 3 Z" fill="#c4b5fd" />}
      <circle cx="10" cy="-8" r="3.2" fill="#ef4444" />
    </g>
  );
}

export default function DigitalFamilySVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="رسم توضيحي: أسرة على أريكة واحدة، كلّ فرد منكبّ على جهازه وبينهم جدران زجاجية شفافة"
    >
      <defs>
        <linearGradient id="df-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="df-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020617" />
          <stop offset="1" stopColor="#1e3a5f" />
        </linearGradient>
        <linearGradient id="df-sofa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#52627a" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="df-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset="1" stopColor="#060a14" />
        </linearGradient>
        <linearGradient id="df-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0f2fe" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#e0f2fe" stopOpacity="0.06" />
          <stop offset="1" stopColor="#e0f2fe" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="df-faceLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#67e8f9" stopOpacity="0" />
          <stop offset="1" stopColor="#67e8f9" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="df-glow">
          <stop offset="0" stopColor="#67e8f9" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="#22d3ee" stopOpacity="0.22" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="df-vignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill="url(#df-wall)" />

      {/* night window with city lights */}
      <rect x="22" y="26" width="94" height="90" rx="4" fill="url(#df-window)" />
      <g fill="#0b1324">
        <rect x="26" y="70" width="16" height="46" />
        <rect x="44" y="56" width="14" height="60" />
        <rect x="60" y="78" width="18" height="38" />
        <rect x="80" y="62" width="12" height="54" />
        <rect x="94" y="84" width="18" height="32" />
      </g>
      <g fill="#fde68a" opacity="0.65">
        {[
          [30, 76],
          [36, 90],
          [48, 62],
          [52, 80],
          [64, 86],
          [84, 70],
          [86, 94],
          [100, 90],
          [104, 102],
        ].map(([cx, cy], i) => (
          <rect key={i} x={cx} y={cy} width="2.5" height="2.5" />
        ))}
      </g>
      <circle cx="98" cy="40" r="5" fill="#e2e8f0" opacity="0.8" />
      <rect x="22" y="26" width="94" height="90" rx="4" fill="none" stroke="#64748b" strokeWidth="3" />
      <path d="M69 26 V116 M22 71 H116" stroke="#64748b" strokeWidth="2" />

      {/* clock showing it is late */}
      <g transform="translate(200 44)">
        <circle r="15" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="0" y1="-12" x2="0" y2="-10" stroke="#94a3b8" transform={`rotate(${i * 30})`} />
        ))}
        <line x1="0" y1="0" x2="-1.2" y2="-7.5" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="0" x2="-5.5" y2="-9.8" stroke="#f87171" strokeWidth="1.3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0;6;0" dur="6s" repeatCount="indefinite" />
        </line>
        <circle r="1.5" fill="#e2e8f0" />
      </g>

      {/* switched-off television nobody is watching */}
      <rect x="284" y="30" width="96" height="56" rx="3" fill="#020617" stroke="#334155" strokeWidth="2" />
      <path d="M292 36 L318 36 L298 80 L290 80 Z" fill="#fff" opacity="0.04" />
      <circle cx="374" cy="82" r="1.3" fill="#ef4444" />

      {/* floor and rug */}
      <rect y="238" width="400" height="62" fill="url(#df-floor)" />
      <rect x="60" y="262" width="280" height="32" rx="14" fill="#1e293b" stroke="#334155" />

      {/* sofa */}
      <rect x="36" y="128" width="328" height="74" rx="18" fill="url(#df-sofa)" />
      <rect x="40" y="190" width="320" height="34" rx="10" fill="#3b4a63" />
      <rect x="44" y="218" width="312" height="14" rx="5" fill="#2b3648" />
      <rect x="20" y="152" width="32" height="80" rx="14" fill="#475569" />
      <rect x="348" y="152" width="32" height="80" rx="14" fill="#475569" />
      <rect x="40" y="232" width="6" height="8" fill="#0f172a" />
      <rect x="354" y="232" width="6" height="8" fill="#0f172a" />

      {/* the family, each in their own screen */}
      <Sitter x={82} skin="#c99874" outfit="#3b5b8c" pants="#1f2937" head="short" headColor="#1f2937" device="phone" glasses delay={0} />
      <Sitter x={160} skin="#d4a37c" outfit="#4b3f6b" pants="#2e2748" head="hijab" headColor="#6d5a8a" device="phone" delay={0.4} />
      <Sitter x={240} skin="#c08a5e" outfit="#0f766e" pants="#1e293b" head="headphones" headColor="#111827" device="landscape" delay={0.8} />
      <Sitter x={318} s={0.85} skin="#d9a982" outfit="#9f4f6f" pants="#334155" head="kid" headColor="#3f2a1d" device="tablet" delay={1.2} />

      <GlassWall x={121} />
      <GlassWall x={200} />
      <GlassWall x={279} />

      {/* coffee table: closed board game and cold, untouched tea */}
      <rect x="138" y="252" width="124" height="8" rx="3" fill="#334155" />
      <rect x="146" y="260" width="4" height="22" fill="#1e293b" />
      <rect x="250" y="260" width="4" height="22" fill="#1e293b" />
      <rect x="150" y="242" width="38" height="10" rx="1.5" fill="#7c2d12" />
      <path d="M150 246 h38" stroke="#fdba74" strokeOpacity="0.4" />
      <path d="M204 244 h8 l-1 8 h-6 Z M216 244 h8 l-1 8 h-6 Z" fill="#cbd5e1" />
      <rect x="234" y="246" width="18" height="5" rx="2" fill="#0f172a" />
      <circle cx="249" cy="248.5" r="1.2" fill="#ef4444">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" />
      </circle>

      {/* notifications competing for attention */}
      <Notification x={82} y={104} kind="heart" begin="0s" />
      <Notification x={160} y={100} kind="chat" begin="0.9s" />
      <Notification x={240} y={104} kind="play" begin="1.8s" />
      <Notification x={318} y={112} kind="bell" begin="2.7s" />

      <rect width="400" height="300" fill="url(#df-vignette)" />
    </svg>
  );
}
