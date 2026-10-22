// مكتبة الأشياء المرسومة: كل شي لوحة 200×200 بتدرّجات الباقة، وبعضها فيه حركة هادية (ترس يدور، لمبة تومض، عقرب يمشي).
// المشهد (stage) هو اللي يدخّلها ويحرّكها ويربطها ببعض، وهي ترسم نفسها بس.
import React from 'react';
import {rgba, mix} from './theme.js';

const lum = (hex) => {
  const h = String(hex).replace('#', '');
  const n = parseInt(h.slice(0, 6), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

// ألوان الرسم المشتقة من الباقة
export function paint(th) {
  const light = lum(th.bg) > 0.5;
  const dark = light ? '#232632' : mix(th.bg, th.ink, 0.14);
  return {A: th.acc, B: th.acc2 || th.acc, I: light ? '#FFFFFF' : th.ink, D: dark, D2: light ? '#3A3E4C' : mix(th.bg, th.ink, 0.24), S: th.soft, L: light ? '#E9E4DA' : mix(th.ink, th.bg, 0.12)};
}

// ——— الأشياء ———
// كل وحدة تاخذ {c, g, t}: c الألوان، g روابط التدرّجات، t الوقت للحركة الهادية

const Laptop = ({c, g}) => (
  <>
    <rect x={34} y={42} width={132} height={88} rx={10} fill={c.D} />
    <rect x={42} y={50} width={116} height={72} rx={5} fill={g.a} />
    <rect x={52} y={62} width={44} height={7} rx={3.5} fill={rgba('#FFFFFF', 0.85)} />
    <rect x={52} y={76} width={70} height={7} rx={3.5} fill={rgba('#FFFFFF', 0.5)} />
    <rect x={52} y={90} width={34} height={7} rx={3.5} fill={rgba('#FFFFFF', 0.5)} />
    <rect x={128} y={86} width={20} height={26} rx={4} fill={rgba('#FFFFFF', 0.25)} />
    <path d="M20 134h160l-10 16H30z" fill={c.L} />
    <rect x={84} y={134} width={32} height={5} rx={2.5} fill={c.D2} />
  </>
);

const Phone = ({c, g}) => (
  <>
    <rect x={62} y={18} width={76} height={164} rx={18} fill={c.D} />
    <rect x={68} y={26} width={64} height={148} rx={13} fill={g.a} />
    <rect x={88} y={30} width={24} height={6} rx={3} fill={c.D} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={76 + (i % 3) * 18} y={50 + Math.floor(i / 3) * 20} width={13} height={13} rx={4} fill={rgba('#FFFFFF', i === 4 ? 0.9 : 0.4)} />
    ))}
    <rect x={76} y={104} width={48} height={40} rx={8} fill={rgba('#FFFFFF', 0.22)} />
    <path d="M80 134l10-12l8 7l10-14l12 19z" fill={rgba('#FFFFFF', 0.7)} />
  </>
);

const Server = ({c, t}) => (
  <>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={42} y={28 + i * 50} width={116} height={42} rx={9} fill={i === 1 ? c.D2 : c.D} />
        <rect x={56} y={44 + i * 50} width={46} height={10} rx={5} fill={rgba(c.I, 0.18)} />
        {[0, 1, 2].map((j) => {
          const on = Math.sin(t * 6 + i * 2.1 + j * 1.3) > -0.2;
          return <circle key={j} cx={122 + j * 12} cy={49 + i * 50} r={4} fill={j === 0 ? c.A : c.B} opacity={on ? 1 : 0.25} />;
        })}
      </g>
    ))}
    <rect x={92} y={178} width={16} height={8} fill={c.D2} />
  </>
);

const Cloud = ({c, g}) => (
  <>
    <path d="M58 150a34 34 0 0 1-4-68a46 46 0 0 1 88-12a38 38 0 0 1 8 80z" fill={g.i} />
    <path d="M100 86v44M84 114l16 16l16-16" stroke={c.A} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const Shield = ({c, g}) => (
  <>
    <path d="M100 18l66 24v46c0 44-28 76-66 94c-38-18-66-50-66-94V42z" fill={g.a} />
    <path d="M100 34l50 18v36c0 34-21 59-50 74z" fill={rgba('#FFFFFF', 0.14)} />
    <path d="M70 100l22 22l40-44" stroke="#FFFFFF" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const gearPath = (cx, cy, r, teeth) => {
  let d = '';
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i * Math.PI) / teeth;
    const a1 = ((i + 1) * Math.PI) / teeth;
    const rr = i % 2 ? r * 0.8 : r;
    d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a0)).toFixed(1)} ${(cy + rr * Math.sin(a0)).toFixed(1)}L${(cx + rr * Math.cos(a1)).toFixed(1)} ${(cy + rr * Math.sin(a1)).toFixed(1)}`;
  }
  return d + 'Z';
};
const Gear = ({c, g, t}) => (
  <>
    <g transform={`rotate(${(t * 40) % 360} 100 100)`}>
      <path d={gearPath(100, 100, 74, 10)} fill={g.a} />
      <circle cx={100} cy={100} r={30} fill={c.D} />
      <circle cx={100} cy={100} r={14} fill={g.a} />
    </g>
  </>
);
const Gears = ({c, g, t}) => (
  <>
    <g transform={`rotate(${(t * 40) % 360} 78 108)`}>
      <path d={gearPath(78, 108, 56, 9)} fill={g.a} />
      <circle cx={78} cy={108} r={20} fill={c.D} />
    </g>
    <g transform={`rotate(${(-t * 56 + 20) % 360} 146 62)`}>
      <path d={gearPath(146, 62, 38, 7)} fill={g.i} />
      <circle cx={146} cy={62} r={13} fill={c.D} />
    </g>
  </>
);

const Globe = ({c, g, t}) => {
  const sh = (t * 18) % 40;
  return (
    <>
      <circle cx={100} cy={100} r={78} fill={g.a} />
      <clipPath id="globeclip">
        <circle cx={100} cy={100} r={78} />
      </clipPath>
      <g clipPath="url(#globeclip)" stroke={rgba('#FFFFFF', 0.45)} strokeWidth={3} fill="none">
        <ellipse cx={100} cy={100} rx={78} ry={28} />
        <line x1={22} y1={100} x2={178} y2={100} />
        {[-80, -40, 0, 40, 80].map((x) => (
          <ellipse key={x} cx={100 + ((x + sh + 100) % 200) - 100} cy={100} rx={30} ry={78} />
        ))}
      </g>
      <path d="M62 60c14-8 30-4 36 8c-8 6-22 6-24 16c-10-2-16-12-12-24zM112 112c14-6 30 0 32 14c-12 8-28 6-32-14z" fill={rgba('#FFFFFF', 0.55)} />
      <circle cx={100} cy={100} r={78} fill="none" stroke={rgba('#FFFFFF', 0.3)} strokeWidth={3} />
    </>
  );
};

const Person1 = ({x, y, s = 1, fill, head}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-46} r={20} fill={head} />
    <path d="M-36 20c0-30 16-46 36-46s36 16 36 46z" fill={fill} />
  </g>
);
const Person = ({c, g}) => <Person1 x={100} y={140} s={1.7} fill={g.a} head={c.I} />;
const Team = ({c, g}) => (
  <>
    <Person1 x={52} y={150} s={1.05} fill={c.D2} head={c.L} />
    <Person1 x={148} y={150} s={1.05} fill={c.D2} head={c.L} />
    <Person1 x={100} y={160} s={1.35} fill={g.a} head={c.I} />
  </>
);

const Building = ({c, g, t}) => (
  <>
    <rect x={44} y={30} width={76} height={152} rx={6} fill={g.a} />
    <rect x={120} y={78} width={44} height={104} rx={5} fill={c.D2} />
    {Array.from({length: 12}).map((_, i) => (
      <rect key={i} x={56 + (i % 3) * 20} y={44 + Math.floor(i / 3) * 30} width={12} height={16} rx={2} fill="#FFFFFF" opacity={Math.sin(t * 2 + i * 1.7) > 0.6 ? 0.95 : 0.5} />
    ))}
    {[0, 1, 2].map((i) => (
      <rect key={i} x={132} y={94 + i * 26} width={20} height={12} rx={2} fill={rgba(c.I, 0.4)} />
    ))}
    <rect x={72} y={158} width={20} height={24} rx={3} fill={c.D} />
    <rect x={30} y={180} width={140} height={6} rx={3} fill={c.D2} />
  </>
);

const Store = ({c, g}) => (
  <>
    <rect x={38} y={84} width={124} height={96} rx={6} fill={c.L} />
    <rect x={50} y={104} width={48} height={44} rx={5} fill={g.a} opacity={0.85} />
    <rect x={110} y={108} width={38} height={72} rx={5} fill={c.D} />
    <circle cx={117} cy={146} r={3} fill={c.A} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${30 + i * 28} 60h28v26a14 14 0 0 1-28 0z`} fill={i % 2 ? c.I : c.A} />
    ))}
    <rect x={26} y={50} width={148} height={12} rx={6} fill={c.D2} />
  </>
);

const House = ({c, g}) => (
  <>
    <path d="M100 26l78 64h-18v90H40V90H22z" fill={g.a} />
    <path d="M100 26l78 64h-18L100 42L40 90H22z" fill={rgba('#FFFFFF', 0.2)} />
    <rect x={84} y={128} width={32} height={52} rx={4} fill={c.D} />
    <rect x={54} y={104} width={22} height={22} rx={3} fill="#FFFFFF" opacity={0.8} />
    <rect x={124} y={104} width={22} height={22} rx={3} fill="#FFFFFF" opacity={0.8} />
  </>
);

const Factory = ({c, g, t}) => (
  <>
    <path d="M24 180V96l40 24V96l40 24V96l40 24V40h28v140z" fill={c.D2} />
    <rect x={144} y={40} width={28} height={140} fill={g.a} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={36 + i * 40} y={140} width={20} height={16} rx={2} fill={c.A} opacity={0.85} />
    ))}
    {[0, 1, 2].map((i) => {
      const k = ((t * 0.6 + i / 3) % 1);
      return <circle key={i} cx={158 + k * 18} cy={32 - k * 30} r={8 + k * 10} fill={rgba(c.I, 0.35 * (1 - k))} />;
    })}
  </>
);

const Bank = ({c, g}) => (
  <>
    <path d="M100 22l78 40H22z" fill={g.a} />
    <rect x={26} y={62} width={148} height={12} fill={c.D2} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={42 + i * 34} y={78} width={18} height={76} rx={3} fill={c.L} />
    ))}
    <rect x={22} y={156} width={156} height={12} fill={c.D2} />
    <rect x={14} y={170} width={172} height={12} rx={3} fill={g.a} />
  </>
);

const Money = ({c, g}) => (
  <>
    {[2, 1, 0].map((i) => (
      <g key={i} transform={`rotate(${-12 + i * 8} 100 110) translate(0 ${i * -10})`}>
        <rect x={30} y={72} width={140} height={74} rx={10} fill={i ? c.D2 : g.a} />
        <rect x={40} y={82} width={120} height={54} rx={6} fill="none" stroke={rgba('#FFFFFF', 0.35)} strokeWidth={3} />
        <circle cx={100} cy={109} r={18} fill={rgba('#FFFFFF', i ? 0.15 : 0.35)} />
      </g>
    ))}
  </>
);

const Coins = ({c, g}) => (
  <>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={52} y={150 - i * 22} width={96} height={20} rx={4} fill={i % 2 ? c.B : c.A} />
        <ellipse cx={100} cy={150 - i * 22} rx={48} ry={12} fill={g.a} />
        <ellipse cx={100} cy={150 - i * 22} rx={30} ry={6} fill="none" stroke={rgba('#FFFFFF', 0.4)} strokeWidth={2} />
      </g>
    ))}
  </>
);

const Wallet = ({c, g}) => (
  <>
    <rect x={40} y={46} width={110} height={56} rx={8} fill={c.L} transform="rotate(-10 95 74)" />
    <rect x={26} y={70} width={150} height={104} rx={18} fill={g.a} />
    <rect x={124} y={104} width={60} height={38} rx={12} fill={c.D} />
    <circle cx={146} cy={123} r={7} fill={c.A} />
  </>
);

const Card = ({c, g}) => (
  <>
    <rect x={20} y={50} width={160} height={104} rx={14} fill={g.a} />
    <rect x={20} y={70} width={160} height={18} fill={c.D} opacity={0.8} />
    <rect x={36} y={104} width={30} height={22} rx={4} fill={rgba('#FFFFFF', 0.75)} />
    <rect x={36} y={134} width={70} height={7} rx={3.5} fill={rgba('#FFFFFF', 0.5)} />
    <circle cx={148} cy={128} r={12} fill={rgba('#FFFFFF', 0.4)} />
    <circle cx={162} cy={128} r={12} fill={rgba('#FFFFFF', 0.25)} />
  </>
);

const Doc = ({c, g}) => (
  <>
    <path d="M50 20h72l32 32v128H50z" fill={c.L} />
    <path d="M122 20v32h32z" fill={c.S} opacity={0.6} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={66} y={70 + i * 20} width={i === 3 ? 40 : 72} height={8} rx={4} fill={rgba(c.D, 0.35)} />
    ))}
    <circle cx={128} cy={154} r={22} fill={g.a} />
    <path d="M118 154l7 7l14-14" stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const Code = ({c, g}) => (
  <>
    <rect x={22} y={36} width={156} height={128} rx={14} fill={c.D} />
    <rect x={22} y={36} width={156} height={24} rx={12} fill={c.D2} />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={40 + i * 14} cy={48} r={4.5} fill={i === 0 ? c.A : rgba(c.I, 0.4)} />
    ))}
    <path d="M78 86l-24 22l24 22M122 86l24 22l-24 22" stroke={g.a} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M108 80l-16 56" stroke={c.I} strokeWidth={8} strokeLinecap="round" opacity={0.8} />
  </>
);

const Database = ({c, g}) => (
  <>
    {[2, 1, 0].map((i) => (
      <g key={i}>
        <path d={`M44 ${56 + i * 40}v34c0 10 25 18 56 18s56-8 56-18v-34`} fill={i === 1 ? c.D2 : c.D} />
        <ellipse cx={100} cy={56 + i * 40} rx={56} ry={18} fill={i === 0 ? g.a : c.D2} />
      </g>
    ))}
    <circle cx={140} cy={110} r={4} fill={c.A} />
    <circle cx={140} cy={150} r={4} fill={c.B} />
  </>
);

const Chart = ({c, g, t}) => (
  <>
    <rect x={20} y={28} width={160} height={150} rx={16} fill={c.D} />
    {[40, 66, 54, 100].map((h, i) => (
      <rect key={i} x={40 + i * 34} y={160 - h} width={22} height={h} rx={6} fill={i === 3 ? g.a : c.D2} />
    ))}
    <path d="M42 120l34-22l34 10l46-50" stroke={c.I} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M140 56h18v18" stroke={c.I} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const TrendUp = ({c, g}) => (
  <>
    <path d="M24 156l48-48l30 30l58-70" stroke={g.a} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M128 52h40v40z" fill={c.B} />
  </>
);
const TrendDown = ({c, g}) => (
  <>
    <path d="M24 48l48 48l30-30l58 70" stroke={g.a} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M128 152h40v-40z" fill={c.B} />
  </>
);

const Bulb = ({c, g, t}) => {
  const glow = 0.5 + 0.5 * Math.sin(t * 3);
  return (
    <>
      <circle cx={100} cy={82} r={78} fill={rgba(c.A, 0.12 + 0.12 * glow)} />
      <path d="M100 22a56 56 0 0 0-34 100c8 7 12 15 12 24h44c0-9 4-17 12-24a56 56 0 0 0-34-100z" fill={g.a} />
      <path d="M86 112l14-30l14 30" stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
      <rect x={78} y={150} width={44} height={12} rx={6} fill={c.L} />
      <rect x={82} y={166} width={36} height={12} rx={6} fill={c.S} />
    </>
  );
};

const Rocket = ({c, g, t}) => {
  const f = 0.8 + 0.2 * Math.sin(t * 20);
  return (
    <g transform="rotate(35 100 100)">
      <path d={`M88 150q12 ${30 * f} 12 ${40 * f}q0 ${-10 * f} 12 ${-40 * f}z`} fill={c.B} />
      <path d="M100 18c26 22 34 60 26 132H74c-8-72 0-110 26-132z" fill={c.L} />
      <path d="M100 18c12 10 20 24 24 40H76c4-16 12-30 24-40z" fill={g.a} />
      <circle cx={100} cy={84} r={14} fill={c.D} stroke={g.a} strokeWidth={5} />
      <path d="M74 112l-24 34l26-4zM126 112l24 34l-26-4z" fill={g.a} />
    </g>
  );
};

const Target = ({c, g}) => (
  <>
    <circle cx={92} cy={108} r={72} fill={c.L} />
    <circle cx={92} cy={108} r={52} fill={g.a} />
    <circle cx={92} cy={108} r={32} fill={c.L} />
    <circle cx={92} cy={108} r={14} fill={g.a} />
    <path d="M92 108L170 30" stroke={c.D} strokeWidth={7} strokeLinecap="round" />
    <path d="M160 22l22 0l-12 14zM178 40l0-22l-14 12z" fill={c.B} />
  </>
);

const Lock = ({c, g}) => (
  <>
    <path d="M62 92V66a38 38 0 0 1 76 0v26" stroke={c.L} strokeWidth={16} fill="none" />
    <rect x={40} y={88} width={120} height={94} rx={18} fill={g.a} />
    <circle cx={100} cy={126} r={12} fill={c.D} />
    <rect x={95} y={130} width={10} height={24} rx={5} fill={c.D} />
  </>
);

const Key = ({c, g}) => (
  <g transform="rotate(-35 100 100)">
    <circle cx={60} cy={100} r={36} fill={g.a} />
    <circle cx={60} cy={100} r={13} fill={c.D} />
    <rect x={90} y={92} width={92} height={16} rx={6} fill={g.a} />
    <rect x={150} y={106} width={12} height={22} rx={3} fill={c.B} />
    <rect x={168} y={106} width={12} height={16} rx={3} fill={c.B} />
  </g>
);

const Truck = ({c, g}) => (
  <>
    <rect x={14} y={60} width={110} height={84} rx={10} fill={g.a} />
    <path d="M124 82h34l26 30v32h-60z" fill={c.L} />
    <path d="M132 90h22l16 20h-38z" fill={c.D} opacity={0.7} />
    {[50, 150].map((x) => (
      <g key={x}>
        <circle cx={x} cy={150} r={20} fill={c.D} />
        <circle cx={x} cy={150} r={8} fill={c.S} />
      </g>
    ))}
  </>
);

const Box = ({c, g}) => (
  <>
    <path d="M100 30l70 32v78l-70 32l-70-32V62z" fill={c.D2} />
    <path d="M100 94l70-32v78l-70 32z" fill={g.a} />
    <path d="M100 30l70 32l-70 32l-70-32z" fill={c.L} />
    <path d="M65 46l70 32v26" stroke={c.S} strokeWidth={10} fill="none" opacity={0.7} />
  </>
);

const Cart = ({c, g}) => (
  <>
    <path d="M18 40h26l20 96h96l18-70H52" stroke={c.L} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M60 76h108l-14 50H70z" fill={g.a} />
    <circle cx={76} cy={160} r={13} fill={c.D2} />
    <circle cx={146} cy={160} r={13} fill={c.D2} />
  </>
);

const Chat = ({c, g}) => (
  <>
    <path d="M20 44a18 18 0 0 1 18-18h86a18 18 0 0 1 18 18v52a18 18 0 0 1-18 18H64l-28 24v-24a16 16 0 0 1-16-16z" fill={g.a} />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={56 + i * 26} cy={70} r={8} fill="#FFFFFF" />
    ))}
    <path d="M180 100a16 16 0 0 0-16-16h-14v20a28 28 0 0 1-28 28H96v12a16 16 0 0 0 16 16h40l22 18v-18a16 16 0 0 0 6-12z" fill={c.L} />
  </>
);

const Megaphone = ({c, g, t}) => (
  <>
    <path d="M40 80l90-44v128l-90-44z" fill={g.a} />
    <rect x={20} y={76} width={30} height={48} rx={10} fill={c.L} />
    <path d="M56 124l14 44h22l-10-38z" fill={c.D2} />
    {[0, 1, 2].map((i) => {
      const k = (t * 0.9 + i / 3) % 1;
      return <path key={i} d={`M${146 + k * 30} ${70 - k * 16}q${14 + k * 8} 30 0 ${60 + k * 32}`} stroke={c.A} strokeWidth={7} fill="none" strokeLinecap="round" opacity={1 - k} />;
    })}
  </>
);

const Clock = ({c, g, t}) => (
  <>
    <circle cx={100} cy={100} r={80} fill={g.a} />
    <circle cx={100} cy={100} r={64} fill={c.L} />
    {Array.from({length: 12}).map((_, i) => {
      const a = (i * Math.PI) / 6;
      return <circle key={i} cx={100 + 52 * Math.sin(a)} cy={100 - 52 * Math.cos(a)} r={i % 3 ? 2.5 : 5} fill={c.D} />;
    })}
    <path d={`M100 100L${100 + 30 * Math.sin(t * 0.5)} ${100 - 30 * Math.cos(t * 0.5)}`} stroke={c.D} strokeWidth={8} strokeLinecap="round" />
    <path d={`M100 100L${100 + 46 * Math.sin(t * 4)} ${100 - 46 * Math.cos(t * 4)}`} stroke={c.A} strokeWidth={5} strokeLinecap="round" />
    <circle cx={100} cy={100} r={7} fill={c.D} />
  </>
);

const Hourglass = ({c, g, t}) => {
  const k = (t * 0.25) % 1;
  return (
    <>
      <rect x={46} y={20} width={108} height={14} rx={7} fill={c.D2} />
      <rect x={46} y={166} width={108} height={14} rx={7} fill={c.D2} />
      <path d="M58 34h84c0 40-30 50-30 66s30 26 30 66H58c0-40 30-50 30-66s-30-26-30-66z" fill={rgba(c.L, 0.5)} />
      <path d={`M${70 + 14 * k} ${50 + 40 * k}h${60 - 28 * k}l-30 ${46 - 40 * k}z`} fill={g.a} />
      <path d={`M100 ${166 - 46 * k}l${36 * Math.sqrt(k) + 4} ${46 * k}h${-72 * Math.sqrt(k) - 8}z`} fill={g.a} />
    </>
  );
};

const Search = ({c, g}) => (
  <>
    <circle cx={84} cy={84} r={56} fill={rgba(c.L, 0.25)} stroke={g.a} strokeWidth={18} />
    <path d="M126 126l46 46" stroke={c.L} strokeWidth={22} strokeLinecap="round" />
    <path d="M60 70a28 28 0 0 1 22-16" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.8} />
  </>
);

const Trophy = ({c, g}) => (
  <>
    <path d="M60 30h80v40a40 40 0 0 1-80 0z" fill={g.a} />
    <path d="M60 44H34c0 30 16 40 30 40M140 44h26c0 30-16 40-30 40" stroke={c.B} strokeWidth={9} fill="none" />
    <rect x={90} y={108} width={20} height={34} fill={c.B} />
    <rect x={60} y={142} width={80} height={16} rx={4} fill={c.L} />
    <rect x={50} y={158} width={100} height={20} rx={6} fill={c.D2} />
    <path d="M100 46l6 12l13 2l-9 9l2 13l-12-6l-12 6l2-13l-9-9l13-2z" fill="#FFFFFF" />
  </>
);

const Warning = ({c, g}) => (
  <>
    <path d="M100 20l86 150H14z" fill={g.a} strokeLinejoin="round" />
    <rect x={92} y={70} width={16} height={56} rx={8} fill="#FFFFFF" />
    <circle cx={100} cy={146} r={10} fill="#FFFFFF" />
  </>
);

const Check = ({c, g}) => (
  <>
    <circle cx={100} cy={100} r={80} fill={g.a} />
    <path d="M62 102l26 26l52-56" stroke="#FFFFFF" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);
const Cross = ({c}) => (
  <>
    <circle cx={100} cy={100} r={80} fill={c.D2} />
    <path d="M70 70l60 60M130 70l-60 60" stroke="#FF5A5A" strokeWidth={18} strokeLinecap="round" />
  </>
);

const Heart = ({g}) => <path d="M100 172C30 120 18 90 26 64c8-26 40-38 74-6c34-32 66-20 74 6c8 26-4 56-74 108z" fill={g.a} />;
const Star = ({g}) => <path d="M100 18l24 50l54 8l-40 38l10 54l-48-26l-48 26l10-54l-40-38l54-8z" fill={g.a} strokeLinejoin="round" />;

const Plane = ({c, g}) => (
  <g transform="rotate(-30 100 100)">
    <path d="M20 100c0-8 8-12 20-12h120c14 0 24 6 24 12s-10 12-24 12H40c-12 0-20-4-20-12z" fill={c.L} />
    <path d="M90 92L60 30h22l50 62zM90 108L60 170h22l50-62z" fill={g.a} />
    <path d="M30 96l-10-26h14l16 26z" fill={c.B} />
  </g>
);

const Car = ({c, g}) => (
  <>
    <path d="M20 128c0-14 6-22 20-24l26-34h70l28 34c14 2 20 10 20 24v18H20z" fill={g.a} />
    <path d="M74 78h26v26H56zM110 78h22l20 26h-42z" fill={c.D} opacity={0.75} />
    {[56, 146].map((x) => (
      <g key={x}>
        <circle cx={x} cy={148} r={20} fill={c.D} />
        <circle cx={x} cy={148} r={8} fill={c.S} />
      </g>
    ))}
  </>
);

const Flag = ({c, g, t}) => {
  const w = Math.sin(t * 3) * 6;
  return (
    <>
      <rect x={44} y={20} width={10} height={164} rx={5} fill={c.L} />
      <path d={`M54 28c30 ${-10 + w} 60 ${10 - w} 100 0v70c-40 ${10 + w} -70 ${-10 - w} -100 0z`} fill={g.a} />
    </>
  );
};

const Puzzle = ({c, g}) => (
  <>
    <path d="M30 60h40a16 16 0 1 1 30 0h40v40a16 16 0 1 1 0 30v40H30z" fill={g.a} />
    <path d="M100 100h40v70h-40v-26a14 14 0 1 0 0-22z" fill={rgba('#FFFFFF', 0.18)} />
  </>
);

const Scale = ({c, g, t}) => {
  const tilt = Math.sin(t * 1.5) * 8;
  return (
    <>
      <rect x={94} y={40} width={12} height={130} rx={6} fill={c.L} />
      <rect x={60} y={168} width={80} height={14} rx={7} fill={c.D2} />
      <g transform={`rotate(${tilt} 100 50)`}>
        <rect x={24} y={44} width={152} height={10} rx={5} fill={g.a} />
        <path d="M30 54l-18 44h36zM170 54l-18 44h36z" fill="none" stroke={c.S} strokeWidth={3} />
        <path d="M8 98a22 12 0 0 0 44 0zM148 98a22 12 0 0 0 44 0z" fill={g.a} />
      </g>
    </>
  );
};

const Percent = ({c, g}) => (
  <>
    <circle cx={100} cy={100} r={82} fill={g.a} />
    <path d="M62 140l76-80" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" />
    <circle cx={70} cy={72} r={16} fill="none" stroke="#FFFFFF" strokeWidth={10} />
    <circle cx={130} cy={128} r={16} fill="none" stroke="#FFFFFF" strokeWidth={10} />
  </>
);

const Calendar = ({c, g}) => (
  <>
    <rect x={26} y={40} width={148} height={140} rx={18} fill={c.L} />
    <path d="M26 58a18 18 0 0 1 18-18h112a18 18 0 0 1 18 18v20H26z" fill={g.a} />
    <rect x={58} y={24} width={12} height={34} rx={6} fill={c.D2} />
    <rect x={130} y={24} width={12} height={34} rx={6} fill={c.D2} />
    {Array.from({length: 9}).map((_, i) => (
      <rect key={i} x={46 + (i % 3) * 40} y={92 + Math.floor(i / 3) * 28} width={28} height={18} rx={5} fill={i === 4 ? c.A : rgba(c.D, 0.18)} />
    ))}
  </>
);

const Brain = ({c, g}) => (
  <>
    <path d="M100 36c-10-14-38-12-44 6c-22 0-32 22-22 38c-14 12-10 36 8 42c0 18 18 30 36 22c6 10 16 14 22 10z" fill={g.a} />
    <path d="M100 36c10-14 38-12 44 6c22 0 32 22 22 38c14 12 10 36-8 42c0 18-18 30-36 22c-6 10-16 14-22 10z" fill={c.L} />
    <path d="M100 40v114" stroke={c.D} strokeWidth={4} />
    <path d="M60 80c10 0 16 8 16 16M140 80c-10 0-16 8-16 16M64 124c8-6 18-4 22 4M136 124c-8-6-18-4-22 4" stroke={rgba(c.D, 0.5)} strokeWidth={5} fill="none" strokeLinecap="round" />
  </>
);

export const OBJECTS = {
  laptop: Laptop, phone: Phone, server: Server, cloud: Cloud, shield: Shield, gear: Gear, gears: Gears, globe: Globe,
  person: Person, team: Team, building: Building, store: Store, shop: Store, house: House, factory: Factory, bank: Bank,
  money: Money, coins: Coins, wallet: Wallet, card: Card, doc: Doc, code: Code, database: Database, chart: Chart,
  up: TrendUp, down: TrendDown, bulb: Bulb, rocket: Rocket, target: Target, lock: Lock, key: Key, truck: Truck,
  box: Box, cart: Cart, chat: Chat, megaphone: Megaphone, clock: Clock, hourglass: Hourglass, search: Search,
  trophy: Trophy, warning: Warning, check: Check, cross: Cross, heart: Heart, star: Star, plane: Plane, car: Car,
  flag: Flag, puzzle: Puzzle, scale: Scale, percent: Percent, calendar: Calendar, brain: Brain,
};

// شي مرسوم بإضاءة: يتلوّن بتدرّج الباقة، وعليه لمعة من فوق وظل تحت
const WHITE = {bg: '#000000', ink: '#FFFFFF', acc: '#FFFFFF', acc2: '#FFFFFF', soft: '#FFFFFF', onAcc: '#FFFFFF'};
export const Obj = ({name, size = 200, th, t = 0, shadow = true}) => {
  const id = React.useId().replace(/:/g, '');
  const O = OBJECTS[name];
  if (!O) return null;
  const c = paint(th);
  const g = {a: `url(#a${id})`, i: `url(#i${id})`};
  const cw = {A: '#FFF', B: '#FFF', I: '#FFF', D: '#FFF', D2: '#FFF', S: '#FFF', L: '#FFF'};
  const gw = {a: '#FFF', i: '#FFF'};
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{display: 'block', flexShrink: 0, overflow: 'visible'}}>
      <defs>
        <linearGradient id={'a' + id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.A} />
          <stop offset="1" stopColor={c.B} />
        </linearGradient>
        <linearGradient id={'i' + id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.I} />
          <stop offset="1" stopColor={c.L} />
        </linearGradient>
        <linearGradient id={'l' + id} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.28" />
        </linearGradient>
        <mask id={'m' + id} maskUnits="userSpaceOnUse" x="-60" y="-60" width="320" height="320">
          <O c={cw} g={gw} t={t} th={WHITE} />
        </mask>
        <filter id={'s' + id} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter={shadow ? `url(#s${id})` : undefined}>
        <O c={c} g={g} t={t} th={th} />
        <rect x="-60" y="-60" width="320" height="320" fill={`url(#l${id})`} mask={`url(#m${id})`} />
      </g>
    </svg>
  );
};
