// Hand-built illustration of the traditional scene: a family gathered around the grandfather in a courtyard majlis.

type Look = [number, number];

type ListenerProps = {
  x: number;
  y: number;
  s: number;
  skin: string;
  outfit: string;
  head: "hijab" | "ghutra" | "boy" | "girl";
  headColor: string;
  look: Look; // eye offset toward the grandfather
};

function Listener({ x, y, s, skin, outfit, head, headColor, look: [dx, dy] }: ListenerProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* behind-the-face headwear */}
      {head === "hijab" && (
        <path d="M-12 -44 Q-13 -61 0 -62 Q13 -61 12 -44 L16 -28 Q0 -24 -16 -28 Z" fill={headColor} />
      )}
      {head === "ghutra" && <path d="M-12 -46 Q-12 -62 0 -63 Q12 -62 12 -46 L17 -28 L-17 -28 Z" fill="#f4efe4" />}
      {head === "girl" && (
        <>
          <circle cx="-10" cy="-44" r="4.5" fill={headColor} />
          <circle cx="10" cy="-44" r="4.5" fill={headColor} />
        </>
      )}

      {/* seated body with crossed legs */}
      <ellipse cx="0" cy="0" rx="24" ry="6.5" fill={outfit} />
      <ellipse cx="0" cy="0" rx="24" ry="6.5" fill="#000" opacity="0.18" />
      <path d="M-20 0 Q-22 -26 -11 -32 L11 -32 Q22 -26 20 0 Z" fill={outfit} />
      <path d="M-3 -32 L0 -14 L3 -32 Z" fill="#000" opacity="0.12" />
      <rect x="-3" y="-37" width="6" height="6" fill={skin} />
      {/* hands resting on knees */}
      <circle cx="-15" cy="-3" r="3" fill={skin} />
      <circle cx="15" cy="-3" r="3" fill={skin} />

      {/* face */}
      <ellipse cx="0" cy="-46" rx="8.5" ry="10" fill={skin} />
      <circle cx="-5.5" cy="-42" r="1.7" fill="#e07a5f" opacity="0.35" />
      <circle cx="5.5" cy="-42" r="1.7" fill="#e07a5f" opacity="0.35" />
      <circle cx={-3.4 + dx} cy={-46.5 + dy} r="1.25" fill="#2a1a10" />
      <circle cx={3.4 + dx} cy={-46.5 + dy} r="1.25" fill="#2a1a10" />
      <path d="M-3 -41 Q0 -38.6 3 -41" stroke="#7a3b2a" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* front-of-face headwear */}
      {head === "hijab" && <path d="M-9.5 -50 Q0 -60 9.5 -50" stroke={headColor} strokeWidth="3.5" fill="none" />}
      {head === "ghutra" && (
        <>
          <path d="M-9.5 -50 Q0 -59 9.5 -50 Q0 -54 -9.5 -50 Z" fill="#fff" />
          <ellipse cx="0" cy="-55.5" rx="9.5" ry="2.4" fill="none" stroke="#1c1c1c" strokeWidth="2" />
          <path d="M-7 -40 Q0 -33 7 -40 Q4 -37 0 -37 Q-4 -37 -7 -40 Z" fill="#2a1a10" />
        </>
      )}
      {(head === "boy" || head === "girl") && (
        <path d="M-9 -48 Q-9 -58 0 -58 Q9 -58 9 -48 Q5 -53 0 -52 Q-5 -53 -9 -48 Z" fill={headColor} />
      )}
    </g>
  );
}

function Lantern({ x }: { x: number }) {
  return (
    <g>
      <line x1={x} y1="18" x2={x} y2="74" stroke="#b07d24" strokeWidth="1.2" />
      <circle cx={x} cy="92" r="34" fill="url(#tf-lanternGlow)">
        <animate attributeName="opacity" values="0.65;1;0.65" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <path d={`M${x - 6} 78 L${x} 72 L${x + 6} 78 Z`} fill="#d9a23a" />
      <path d={`M${x - 8} 79 H${x + 8} L${x + 6} 104 H${x - 6} Z`} fill="#fde7a8" stroke="#b07d24" strokeWidth="1.5" />
      <line x1={x} y1="79" x2={x} y2="104" stroke="#b07d24" strokeWidth="1" />
      <path d={`M${x - 7} 104 H${x + 7} L${x} 110 Z`} fill="#d9a23a" />
    </g>
  );
}

export default function TraditionalFamilySVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="رسم توضيحي: أسرة تتحلّق حول الجدّ في فناء بيت تقليدي تحت ضوء الفوانيس"
    >
      <defs>
        <linearGradient id="tf-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2f1b" />
          <stop offset="1" stopColor="#24170c" />
        </linearGradient>
        <linearGradient id="tf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2645" />
          <stop offset="0.55" stopColor="#6b3f22" />
          <stop offset="1" stopColor="#e0a64a" />
        </linearGradient>
        <linearGradient id="tf-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4526" />
          <stop offset="1" stopColor="#2e1e12" />
        </linearGradient>
        <linearGradient id="tf-rug" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e2016" />
          <stop offset="0.5" stopColor="#a8382a" />
          <stop offset="1" stopColor="#6e2016" />
        </linearGradient>
        <linearGradient id="tf-bisht" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a4a22" />
          <stop offset="1" stopColor="#3e2410" />
        </linearGradient>
        <radialGradient id="tf-warm" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#f6d98b" stopOpacity="0.38" />
          <stop offset="1" stopColor="#f6d98b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tf-lanternGlow">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="#f2b84b" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f2b84b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tf-vignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
        <pattern id="tf-frieze" width="20" height="18" patternUnits="userSpaceOnUse">
          <rect width="20" height="18" fill="#2e1e12" />
          <path d="M10 3 L18 9 L10 15 L2 9 Z" fill="#d9a23a" opacity="0.55" />
          <circle cx="10" cy="9" r="1.6" fill="#f6d98b" />
        </pattern>
        <clipPath id="tf-archClip">
          <path d="M137 200 V88 Q137 36 200 22 Q263 36 263 88 V200 Z" />
        </clipPath>
        <clipPath id="tf-floorClip">
          <rect x="0" y="200" width="400" height="100" />
        </clipPath>
      </defs>

      {/* walls */}
      <rect width="400" height="300" fill="url(#tf-wall)" />
      <rect width="400" height="18" fill="url(#tf-frieze)" />
      <rect y="18" width="400" height="2" fill="#d9a23a" opacity="0.6" />

      {/* central arch opening onto the evening courtyard */}
      <g clipPath="url(#tf-archClip)">
        <rect x="130" y="15" width="140" height="190" fill="url(#tf-sky)" />
        {[
          [160, 50],
          [182, 38],
          [248, 72],
          [172, 78],
          [214, 44],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.1" fill="#fff6d8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + i * 0.6}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <circle cx="232" cy="56" r="10" fill="#f8e7b0" />
        <circle cx="237" cy="52" r="9" fill="#26304f" />
        {/* palm silhouette */}
        <path d="M168 200 Q166 150 176 112" stroke="#2a1a0e" strokeWidth="5" fill="none" />
        <g fill="#2a1a0e">
          <path d="M176 112 Q154 100 140 112 Q158 104 176 116 Z" />
          <path d="M176 112 Q160 88 146 90 Q164 96 176 114 Z" />
          <path d="M176 112 Q186 88 204 88 Q188 98 178 114 Z" />
          <path d="M176 112 Q198 104 212 116 Q194 110 177 116 Z" />
          <path d="M176 112 Q174 92 180 82 Q180 98 178 112 Z" />
        </g>
        <rect x="130" y="176" width="140" height="30" fill="#3a2614" />
        <path d="M130 176 h140" stroke="#d9a23a" strokeOpacity="0.35" />
      </g>
      <path d="M137 200 V88 Q137 36 200 22 Q263 36 263 88 V200" fill="none" stroke="#d9a23a" strokeWidth="4" />
      <path d="M143 200 V90 Q143 44 200 30 Q257 44 257 90 V200" fill="none" stroke="#f6d98b" strokeOpacity="0.35" />
      <rect x="124" y="84" width="14" height="116" fill="#5a3a20" />
      <rect x="262" y="84" width="14" height="116" fill="#5a3a20" />
      <rect x="121" y="80" width="20" height="6" rx="1" fill="#d9a23a" />
      <rect x="259" y="80" width="20" height="6" rx="1" fill="#d9a23a" />

      {/* side niches */}
      <path d="M26 200 V112 Q26 78 66 70 Q106 78 106 112 V200 Z" fill="#2a1a0e" stroke="#d9a23a" strokeOpacity="0.5" strokeWidth="2" />
      <path d="M294 200 V112 Q294 78 334 70 Q374 78 374 112 V200 Z" fill="#2a1a0e" stroke="#d9a23a" strokeOpacity="0.5" strokeWidth="2" />
      <Lantern x={66} />
      <Lantern x={334} />

      {/* tiled courtyard floor */}
      <rect y="200" width="400" height="100" fill="url(#tf-floor)" />
      <g clipPath="url(#tf-floorClip)" stroke="#000" strokeOpacity="0.16">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1="200" y1="150" x2={-400 + i * 100} y2="300" />
        ))}
        {[212, 230, 256, 290].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>

      {/* rug */}
      <ellipse cx="200" cy="258" rx="178" ry="40" fill="url(#tf-rug)" />
      <ellipse cx="200" cy="258" rx="164" ry="33" fill="none" stroke="#eec15b" strokeOpacity="0.55" strokeDasharray="5 5" />
      <ellipse cx="200" cy="258" rx="122" ry="23" fill="none" stroke="#f6d98b" strokeOpacity="0.25" strokeWidth="2" />

      <rect width="400" height="300" fill="url(#tf-warm)" />

      {/* grandfather on his cushion */}
      <rect x="156" y="146" width="88" height="76" rx="14" fill="#7a2418" stroke="#eec15b" strokeOpacity="0.45" />
      <rect x="148" y="214" width="104" height="26" rx="8" fill="#8a2f22" />
      <path d="M152 222 h96" stroke="#eec15b" strokeOpacity="0.6" strokeDasharray="3 3" />
      <path d="M176 182 L170 228 L230 228 L224 182 Z" fill="#000" opacity="0.15" />
      <path d="M162 232 Q160 192 178 178 L200 174 L222 178 Q240 192 238 232 Z" fill="url(#tf-bisht)" />
      <path d="M189 178 L200 175 L211 178 L214 232 L186 232 Z" fill="#f2ede2" />
      <path d="M189 178 L186 232 M211 178 L214 232" stroke="#eec15b" strokeWidth="1.6" />
      <ellipse cx="200" cy="233" rx="46" ry="9" fill="#ece5d6" />
      <ellipse cx="200" cy="233" rx="46" ry="9" fill="none" stroke="#000" strokeOpacity="0.1" />
      {/* storytelling hand raised */}
      <path d="M226 196 Q242 192 241 172" stroke="#5e3818" strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="241" cy="167" r="4.6" fill="#c8956a" />
      {/* misbaha in the resting hand */}
      <circle cx="184" cy="216" r="4.4" fill="#c8956a" />
      <path d="M184 220 q-2 8 4 10" fill="none" stroke="#7a2418" strokeWidth="2.2" strokeDasharray="0.1 3.2" strokeLinecap="round" />
      {/* head with ghutra, agal and white beard */}
      <path d="M182 148 Q180 128 200 125 Q220 128 218 148 L226 182 L174 182 Z" fill="#f4efe4" />
      <path d="M218 148 L226 182 L214 182 Z" fill="#000" opacity="0.08" />
      <ellipse cx="200" cy="152" rx="12.5" ry="14.5" fill="#c8956a" />
      <path d="M186 146 Q186 132 200 131 Q214 132 214 146 Q200 140 186 146 Z" fill="#fff" />
      <ellipse cx="200" cy="136.5" rx="13.5" ry="3.4" fill="none" stroke="#1c1c1c" strokeWidth="2.6" />
      <path d="M193 147.5 h4.5 M203 147.5 h4.5" stroke="#f1efe9" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="195.2" cy="151.2" r="1.3" fill="#2a1a10" />
      <circle cx="204.8" cy="151.2" r="1.3" fill="#2a1a10" />
      <path d="M188.5 154 Q189 171 200 174 Q211 171 211.5 154 Q206 161 200 160.5 Q194 161 188.5 154 Z" fill="#f1efe9" />
      <path d="M194 158 Q200 155.5 206 158" stroke="#e6e2d8" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="200" cy="163" rx="2.4" ry="1.4" fill="#6b3a2a" />

      {/* threads of connection from the storyteller to every listener */}
      <g fill="none" stroke="#f6d98b" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 5">
        {[
          "M186 160 Q140 150 104 188",
          "M214 160 Q262 150 298 188",
          "M192 172 Q158 186 148 222",
          "M208 172 Q244 186 254 222",
        ].map((d, i) => (
          <path key={i} d={d} opacity="0.75">
            <animate attributeName="stroke-dashoffset" values="14;0" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.85;0.35" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </path>
        ))}
      </g>
      <circle cx="200" cy="152" r="28" fill="none" stroke="#f6d98b" strokeOpacity="0.25">
        <animate attributeName="r" values="24;34;24" dur="4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.35;0;0.35" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* family gathered closely on the floor */}
      <Listener x={94} y={250} s={1.15} skin="#c08a5e" outfit="#7d4b2a" head="hijab" headColor="#2f4a3a" look={[1.3, -0.6]} />
      <Listener x={308} y={250} s={1.15} skin="#b98258" outfit="#e8e0cf" head="ghutra" headColor="#fff" look={[-1.3, -0.6]} />
      <Listener x={146} y={276} s={0.9} skin="#d1a074" outfit="#3d6b8a" head="boy" headColor="#2a1a10" look={[0.9, -1.4]} />
      <Listener x={256} y={276} s={0.9} skin="#c8956a" outfit="#a8462f" head="girl" headColor="#3a2416" look={[-0.9, -1.4]} />

      {/* coffee, tea and dates */}
      <ellipse cx="201" cy="284" rx="36" ry="8" fill="#b07d24" stroke="#f6d98b" strokeOpacity="0.7" />
      <g transform="translate(183 280)">
        <path d="M-7 0 Q-9 -10 -4 -16 L4 -16 Q9 -10 7 0 Z" fill="#d9a23a" stroke="#8a5a14" strokeWidth="0.8" />
        <path d="M-4 -16 L-2 -21 L2 -21 L4 -16 Z" fill="#eec15b" />
        <circle cx="0" cy="-23" r="1.8" fill="#eec15b" />
        <path d="M6 -10 Q14 -14 16 -20" stroke="#d9a23a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M-6 -12 Q-12 -8 -7 -2" stroke="#8a5a14" strokeWidth="1.4" fill="none" />
      </g>
      {[200, 210].map((cx, i) => (
        <g key={cx}>
          <path d={`M${cx - 3} 278 h6 l-1 5 h-4 Z`} fill="#fbf6ea" stroke="#d9a23a" strokeWidth="0.6" />
          <path d={`M${cx} 275 q-2 -4 0 -7 q2 -3 0 -6`} stroke="#fff" strokeWidth="0.9" fill="none" opacity="0.6">
            <animate attributeName="opacity" values="0;0.7;0" dur="2.6s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}
      <ellipse cx="225" cy="284" rx="9" ry="3" fill="#f3e3c3" />
      {[219, 223, 227, 231, 225].map((cx, i) => (
        <ellipse key={i} cx={cx} cy={i === 4 ? 281 : 283} rx="2.4" ry="1.4" fill="#5a2d14" />
      ))}

      <rect width="400" height="300" fill="url(#tf-vignette)" />
    </svg>
  );
}
