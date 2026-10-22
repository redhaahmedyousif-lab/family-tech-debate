// المشهد (stage): موشن جرافيك يشرح الجملة بأشياء مرسومة تتحرك، مو نص داخل بطاقات.
// كل ممثل (actor) شي مرسوم أو رقم أو كلمة، يدخل لحظة نطق كلمته، ويقدر يطير لغيره، ينربط فيه، ينبض، أو يطلع.
// والكاميرا تقرّب وتلحق مع الكلام. كل الأوقات تجي من word و xWord (plan.js يحوّلها لـ at و xAt).
import React from 'react';
import {rgba, clamp, lerp, ease, easeInOut, spring, prog, splitNumber, count, glass} from './kit.jsx';
import {Obj} from './objects.jsx';

const fitText = (text, width, max, ratio = 1.8) => Math.min(max, (width / Math.max(2, String(text ?? '').length)) * ratio);

// من وين يدخل الممثل: من حافة، أو من مكان ممثل ثاني
function startPos(a, base, pos, W, H) {
  const e = a.enter || 'pop';
  if (e === 'left') return {x: base.x - W * 0.75, y: base.y};
  if (e === 'right') return {x: base.x + W * 0.75, y: base.y};
  if (e === 'top' || e === 'drop') return {x: base.x, y: base.y - H * 0.8};
  if (e === 'bottom' || e === 'rise') return {x: base.x, y: base.y + H * 0.8};
  if (e.startsWith('from:') && pos[e.slice(5)]) return pos[e.slice(5)];
  return base;
}

// انفجار نقاط صغيرة: يطلع لما شي يوصل لشي أو ينبض
const Burst = ({x, y, t, at, th, r = 120}) => {
  const k = (t - at) / 0.7;
  if (k <= 0 || k >= 1) return null;
  return (
    <>
      {Array.from({length: 12}).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2 + 0.3;
        const d = r * ease(k);
        return <circle key={i} cx={x + Math.cos(ang) * d} cy={y + Math.sin(ang) * d} r={(1 - k) * (i % 2 ? 7 : 11)} fill={i % 2 ? th.acc2 || th.acc : th.acc} opacity={1 - k} />;
      })}
      <circle cx={x} cy={y} r={r * 0.4 + r * 0.6 * ease(k)} fill="none" stroke={th.acc} strokeWidth={6 * (1 - k)} opacity={1 - k} />
    </>
  );
};

// حالة الكاميرا بأي لحظة: تنتقل بين المحطات بنعومة
function cameraAt(cams, t) {
  let cur = {zoom: 1, x: 0.5, y: 0.5};
  for (const c of cams) {
    if (!Number.isFinite(c.at) || t < c.at) break;
    const k = easeInOut((t - c.at) / (c.dur ?? 0.9));
    const nx = {zoom: c.zoom ?? cur.zoom, x: c.x ?? cur.x, y: c.y ?? cur.y};
    cur = {zoom: lerp(cur.zoom, nx.zoom, k), x: lerp(cur.x, nx.x, k), y: lerp(cur.y, nx.y, k)};
  }
  return cur;
}

export function Stage({scene, t, th, W, H}) {
  const actors = (scene.actors || []).slice(0, 7);
  const unit = Math.min(W, H);
  const s0 = scene.s ?? 0;

  // مكان كل ممثل الأساسي
  const base = {};
  actors.forEach((a, i) => {
    base[a.id || 'a' + i] = {x: (a.x ?? 0.5) * W, y: (a.y ?? 0.5) * H};
  });

  // حالة كل ممثل: مكانه، حجمه، وضوحه
  const state = {};
  const hits = []; // لحظات الوصول والنبض: تطلع فيها نقاط
  actors.forEach((a, i) => {
    const id = a.id || 'a' + i;
    const at = a.at ?? s0 + 0.4 + i * 0.5;
    const b = base[id];
    const st0 = startPos(a, b, base, W, H);
    const fly = a.enter && a.enter !== 'pop';
    const kin = fly ? clamp(spring(t, at, {freq: 1.3, damp: 0.78}), 0, 1.04) : 1;
    let x = lerp(st0.x, b.x, kin);
    let y = lerp(st0.y, b.y, kin);
    let sc = fly ? 0.6 + 0.4 * clamp(kin) : clamp(spring(t, at, {freq: 1.6, damp: 0.55}), 0, 1.2);
    let op = clamp((t - at) / 0.15);
    let blur = (1 - ease((t - at) / 0.35)) * 12;
    if (Number.isFinite(a.moveAt)) {
      const k = easeInOut((t - a.moveAt) / 0.8);
      x = lerp(x, (a.moveX ?? a.x ?? 0.5) * W, k);
      y = lerp(y, (a.moveY ?? a.y ?? 0.5) * H, k);
      if (a.moveSize != null) sc *= lerp(1, a.moveSize / (a.size ?? 0.34), k);
    }
    if (a.to && Number.isFinite(a.toAt) && base[a.to]) {
      const k = easeInOut((t - a.toAt) / 0.75);
      const tgt = base[a.to];
      // يطير بقوس مو بخط مستقيم
      const arc = Math.sin(Math.PI * k) * -H * 0.12;
      x = lerp(x, tgt.x, k);
      y = lerp(y, tgt.y, k) + arc;
      sc *= 1 - 0.7 * k;
      op *= 1 - ease((k - 0.75) / 0.25);
      hits.push({id: a.to, at: a.toAt + 0.72});
    }
    if (Number.isFinite(a.outAt)) {
      const k = ease((t - a.outAt) / 0.35);
      sc *= 1 - 0.5 * k;
      op *= 1 - k;
      blur += 10 * k;
    }
    if (Number.isFinite(a.pulseAt)) hits.push({id, at: a.pulseAt});
    state[id] = {x, y, sc, op, blur, at};
  });
  // النبضة: الشي اللي يوصله شي أو ينبض يكبر لحظة
  for (const h of hits) {
    const s = state[h.id];
    if (!s) continue;
    const k = (t - h.at) / 0.45;
    if (k > 0 && k < 1) s.sc *= 1 + 0.16 * Math.sin(Math.PI * k);
  }

  const cam = cameraAt(scene.camera || [], t);
  const camT = `translate(${W / 2 - cam.x * W * cam.zoom}px, ${H / 2 - cam.y * H * cam.zoom}px) scale(${cam.zoom})`;

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: camT}}>
        {/* الخطوط: روابط بين الأشياء، ومسار اللي يطير */}
        <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {actors.map((a, i) => {
            const id = a.id || 'a' + i;
            const out = [];
            const links = [].concat(a.link || []);
            links.forEach((lk, j) => {
              const o = state[lk];
              const me = state[id];
              if (!o || !me) return;
              const la = a.linkAt ?? Math.max(me.at, o.at) + 0.2;
              const k = prog(t, la, 0.5);
              if (k <= 0) return;
              const fade = Math.min(me.op, o.op);
              const ex = lerp(me.x, o.x, k);
              const ey = lerp(me.y, o.y, k);
              out.push(<line key={'l' + j} x1={me.x} y1={me.y} x2={ex} y2={ey} stroke={th.acc} strokeOpacity={0.55 * fade} strokeWidth={5} strokeDasharray="3 16" strokeDashoffset={-t * 50} strokeLinecap="round" />);
              if (k > 0 && k < 1) out.push(<circle key={'d' + j} cx={ex} cy={ey} r={9} fill={th.acc} style={{filter: `drop-shadow(0 0 10px ${th.acc})`}} />);
            });
            if (a.to && Number.isFinite(a.toAt) && base[a.to]) {
              const k = (t - a.toAt + 0.1) / 1.1;
              if (k > 0 && k < 1) {
                const b = base[id];
                const g = base[a.to];
                const mx = (b.x + g.x) / 2;
                const my = (b.y + g.y) / 2 - H * 0.12;
                out.push(<path key="trail" d={`M${b.x} ${b.y}Q${mx} ${my} ${g.x} ${g.y}`} fill="none" stroke={th.acc2 || th.acc} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" opacity={Math.sin(Math.PI * k) * 0.7} />);
              }
            }
            return <React.Fragment key={id}>{out}</React.Fragment>;
          })}
          {hits.map((h, i) => (state[h.id] ? <Burst key={i} x={state[h.id].x} y={state[h.id].y} t={t} at={h.at} th={th} r={unit * 0.22} /> : null))}
        </svg>
        {actors.map((a, i) => {
          const id = a.id || 'a' + i;
          const s = state[id];
          if (s.op <= 0.001) return null;
          const px = (a.size ?? 0.34) * unit;
          const bob = Math.sin(t * 1.3 + i * 1.7) * px * 0.02;
          const lblAt = a.labelAt ?? s.at + 0.25;
          const common = {position: 'absolute', left: s.x, top: s.y + bob, transform: `translate(-50%, -50%) scale(${s.sc})`, opacity: s.op, filter: s.blur > 0.2 ? `blur(${s.blur.toFixed(1)}px)` : 'none'};
          let body = null;
          if (a.obj) {
            body = (
              <div style={{position: 'relative', width: px, height: px}}>
                {a.hot ? <div style={{position: 'absolute', inset: '-18%', borderRadius: '50%', background: `radial-gradient(circle, ${rgba(th.acc, 0.35)}, ${rgba(th.acc, 0)} 65%)`}} /> : null}
                <Obj name={a.obj} size={px} th={th} t={t} />
              </div>
            );
          } else if (a.value != null) {
            const p = splitNumber(a.value);
            body = (
              <div style={{display: 'flex', direction: 'rtl', alignItems: 'baseline', gap: px * 0.08, whiteSpace: 'nowrap'}}>
                <span style={{fontSize: px * 0.62, fontWeight: 800, lineHeight: 1, letterSpacing: -px * 0.015, direction: 'ltr', fontVariantNumeric: 'tabular-nums', background: `linear-gradient(160deg, ${th.ink} 15%, ${th.acc} 60%, ${th.acc2 || th.acc})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 30px ${rgba(th.acc, 0.35)})`}}>
                  {p ? p.pre + count(t, s.at, p.n, 0.9) + p.post : a.value}
                </span>
                {a.unit ? <span style={{fontSize: px * 0.24, fontWeight: 800, color: th.ink}}>{a.unit}</span> : null}
              </div>
            );
          } else if (a.text) {
            body = (
              <div style={{fontSize: fitText(a.text, px * 2.6, px * 0.42), fontWeight: 800, color: a.hot ? th.acc : th.ink, whiteSpace: 'nowrap', letterSpacing: -1, textShadow: `0 8px 40px ${rgba('#000000', 0.5)}`}}>{a.text}</div>
            );
          }
          return (
            <div key={id} style={common}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: px * 0.04}}>
                {body}
                {a.label ? (
                  <div style={{...glass(th, {radius: 999, glow: a.hot ? 0.5 : 0}), padding: `${Math.max(6, px * 0.03)}px ${Math.max(18, px * 0.09)}px`, fontSize: clamp(px * 0.16, 34, 64), fontWeight: 800, color: th.ink, whiteSpace: 'nowrap', opacity: prog(t, lblAt, 0.25), transform: `translateY(${(1 - prog(t, lblAt, 0.3)) * 16}px)`}}>
                    {a.label}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
