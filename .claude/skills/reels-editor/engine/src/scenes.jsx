import React from 'react';
import {rgba, clamp, ease, prog, spring, enter, pop, slide, focusOf, count, float, splitNumber, Card, Chip, glass, Icon, Art, Photo} from './kit.jsx';
import {scenes as CUSTOM} from './custom.generated.jsx';
import {SPLIT_H, layoutOf} from './plan.js';
import {Stage} from './stage.jsx';

// مساحة الرسمة المالية للشاشة: نص الشاشة تقريباً. الفيديو يتغبّش وراها، فالمساحة كلها لها
export const CANVAS = {x: 70, y: 300, w: 940, h: 960};
// ومساحتها لما الشاشة مقسومة: تحت المتحدث، وفوق أزرار التطبيقات
export const CANVAS_SPLIT = {x: 70, y: SPLIT_H + 50, w: 940, h: 600};
export const canvasOf = (scene) => (layoutOf(scene) === 'split' ? CANVAS_SPLIT : CANVAS);

const fill = {position: 'absolute', inset: 0, display: 'flex'};
// خط يصغر لين النص يدخل بعرضه
const fit = (text, width, max, ratio = 1.75) => Math.min(max, (width / Math.max(3, String(text ?? '').length)) * ratio);
// رقم يعدّ لين يوصل للي انقال، واللي مو رقم ينعرض زي ما هو
const Counted = ({text, t, at}) => {
  const p = splitNumber(text);
  return <>{p ? p.pre + count(t, at, p.n) + p.post : text}</>;
};
// بعد ما ينقال آخر عنصر بثانية، الرسمة تهدأ: كل العناصر ترجع بنفس الوضوح وما فيه تركيز
const settleOf = (t, ats) => {
  const last = Math.max(...ats.filter(Number.isFinite), -Infinity);
  return Number.isFinite(last) ? prog(t, last + 1.1, 0.5) : 1;
};

// عنوان الرسمة: نقطة مضيئة، العنوان، وتحته خط ينمد
const Heading = ({text, t, at, th, W, big, align = 'flex-start'}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: align, gap: big ? 16 : 12, direction: 'rtl', ...enter(t, at)}}>
    <div style={{display: 'flex', direction: 'rtl', alignItems: 'center', gap: 16}}>
      <div style={{width: 14, height: 14, borderRadius: 7, background: th.acc, boxShadow: `0 0 18px ${rgba(th.acc, 0.9)}`, transform: `scale(${clamp(spring(t, at + 0.12), 0, 1.4)})`}} />
      <div style={{fontSize: fit(text, W - 90, big ? 74 : 58, 1.9), fontWeight: 800, color: th.ink, whiteSpace: 'nowrap', letterSpacing: -0.5, lineHeight: 1.15}}>{text}</div>
    </div>
    <div style={{height: 4, borderRadius: 2, width: (big ? 260 : 200) * prog(t, at + 0.2, 0.5), background: `linear-gradient(270deg, ${th.acc}, ${rgba(th.acc, 0)})`}} />
  </div>
);

// شي يتحوّل لشي: بطاقات من اليمين لليسار وبينها مسار تمشي عليه نقطة مضيئة
function Flow({scene, t, th, W, H}) {
  const items = (scene.items || []).slice(0, 3);
  const n = Math.max(1, items.length);
  const big = H >= 900;
  const gap = n === 3 ? 90 : 140;
  const bw = Math.min(360, (W - (n - 1) * gap) / n);
  const ch = big ? 440 : 380;
  const artSize = Math.min(bw - 40, ch - 150);
  const ats = items.map((it) => it.at);
  const settle = settleOf(t, ats);
  return (
    <div style={{...fill, flexDirection: 'row', direction: 'rtl', alignItems: 'center', justifyContent: 'center'}}>
      {items.map((it, i) => {
        const hot = it.hot ?? i === n - 1;
        const f = Math.max(focusOf(t, ats, i) * (1 - settle), hot ? settle : 0);
        const ak = i > 0 ? prog(t, it.at - 0.4, 0.4) : 0;
        const dot = i > 0 ? prog(t, it.at - 0.4, 0.55) : 0;
        return (
          <React.Fragment key={i}>
            {i > 0 ? (
              <svg width={gap} height={40} viewBox={`0 0 ${gap} 40`} style={{flexShrink: 0, overflow: 'visible', marginBottom: it.note || items[i - 1].note ? 80 : 0}}>
                <line x1={gap - 8} y1={20} x2={gap - 8 - (gap - 16) * ak} y2={20} stroke={rgba(th.ink, 0.4)} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 12" strokeDashoffset={-t * 40} />
                {ak > 0.95 ? <polyline points="22,8 8,20 22,32" fill="none" stroke={th.acc} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
                {dot > 0 && dot < 1 ? <circle cx={gap - 8 - (gap - 16) * dot} cy={20} r={8} fill={th.acc} style={{filter: `drop-shadow(0 0 10px ${th.acc})`}} /> : null}
              </svg>
            ) : null}
            <div style={{width: bw, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, ...pop(t, it.at)}}>
              <Card th={th} glow={f} style={{width: bw, height: ch, flexDirection: 'column', gap: 14, padding: 20, transform: `scale(${1 + 0.03 * f})`}}>
                {it.art ? (
                  <div style={{transform: `translateY(${float(t, 5, 1, i)}px)`, filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.35))'}}>
                    <Art name={it.art} size={artSize} th={th} k={prog(t, it.at, 0.9)} />
                  </div>
                ) : (
                  <Chip icon={it.icon} n={i + 1} size={Math.min(artSize * 0.75, big ? 190 : 160)} th={th} t={t} at={it.at} ghost={f < 0.5 && !hot} />
                )}
                <div style={{fontSize: fit(it.text, bw - 40, 70, 2), fontWeight: 800, whiteSpace: 'nowrap', marginTop: 6}}>{it.text}</div>
              </Card>
              {it.note ? (
                <div style={{height: 60, padding: '0 26px', display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 700, whiteSpace: 'nowrap', ...glass(th, {radius: 30, glow: hot ? 0.6 : 0}), color: hot ? th.acc : th.soft, ...enter(t, it.noteAt ?? it.at + 0.4)}}>
                  {it.note}
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// أرقام تنقال: كل رقم عمود يطلع بطوله، فالفرق بينها ينشاف قبل ما ينقرا
function Numbers({scene, t, th, W, H}) {
  const items = (scene.items || []).slice(0, 4);
  const n = Math.max(1, items.length);
  const big = H >= 900;
  const parsed = items.map((it) => splitNumber(it.text));
  const bars = n > 1 && parsed.every(Boolean);
  const top = bars ? Math.max(1, ...parsed.map((p) => p.n)) : 1;
  const barMax = big ? 440 : 290;
  const colW = Math.min(n <= 2 ? 280 : 230, (W - (n - 1) * 40) / n);
  const ats = items.map((it) => it.at);
  const settle = settleOf(t, ats);
  return (
    <div style={{...fill, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: big ? 44 : 22}}>
      {scene.label ? <Heading text={scene.label} t={t} at={scene.labelAt ?? scene.s + 0.3} th={th} W={W} big={big} align="center" /> : null}
      <div style={{display: 'flex', flexDirection: 'row', direction: 'rtl', alignItems: 'flex-end', gap: 40}}>
        {items.map((it, i) => {
          const hot = it.hot ?? i === n - 1;
          const f = Math.max(focusOf(t, ats, i) * (1 - settle), hot ? settle : 0);
          const grow = clamp(spring(t, it.at, {freq: 1.2, damp: 0.7}), 0, 1.06);
          const num = (
            <div style={{fontSize: fit(it.text, colW, big ? 120 : 92, 1.5), fontWeight: 800, lineHeight: 1.1, direction: 'ltr', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: f > 0.5 || hot ? th.acc : th.ink}}>
              <Counted text={it.text} t={t} at={it.at} />
            </div>
          );
          return (
            <div key={i} style={{width: colW, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, ...enter(t, it.at)}}>
              {bars ? (
                <>
                  {num}
                  <div
                    style={{
                      width: colW,
                      height: Math.max(30, (barMax * parsed[i].n) / top) * grow,
                      borderRadius: '28px 28px 10px 10px',
                      background: hot || f > 0.5 ? `linear-gradient(180deg, ${th.acc}, ${rgba(th.acc, 0.35)})` : `linear-gradient(180deg, ${rgba(th.ink, 0.32)}, ${rgba(th.ink, 0.08)})`,
                      boxShadow: `inset 0 2px 0 ${rgba('#FFFFFF', 0.3)}` + (hot ? `, 0 0 60px ${rgba(th.acc, 0.4)}` : ''),
                    }}
                  />
                </>
              ) : (
                <Card hot={hot} glow={f} th={th} style={{width: colW, height: big ? 220 : 180}}>
                  {num}
                </Card>
              )}
              {it.sub ? <div style={{fontSize: 36, fontWeight: 700, color: th.soft, whiteSpace: 'nowrap'}}>{it.sub}</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// نقاط ورا بعض: كل نقطة صف زجاجي يدخل من الجنب، وبينها خط يوصلها، واللي ينقال الحين يتوهّج
function List({scene, t, th, W, H}) {
  const items = (scene.items || []).slice(0, 4);
  const n = Math.max(1, items.length);
  const big = H >= 900;
  const titleH = scene.title ? (big ? 130 : 96) : 0;
  const gap = big ? 22 : 14;
  const rowH = Math.min(big ? 150 : 126, (H - titleH - 10) / n - gap);
  const chip = rowH * 0.66;
  const longest = Math.max(6, ...items.map((it) => String(it.text || '').length));
  const fs = Math.min(rowH * 0.46, ((W - chip - 170) / longest) * 2.2);
  const ats = items.map((it) => it.at);
  const settle = settleOf(t, ats);
  return (
    <div style={{...fill, flexDirection: 'column', direction: 'rtl', justifyContent: 'center', gap, padding: '0 10px'}}>
      {scene.title ? (
        <div style={{height: titleH - gap, display: 'flex', alignItems: 'center'}}>
          <Heading text={scene.title} t={t} at={scene.titleAt ?? scene.s + 0.25} th={th} W={W} big={big} />
        </div>
      ) : null}
      {items.map((it, i) => {
        const f = focusOf(t, ats, i) * (1 - settle);
        const next = ats.slice(i + 1).find(Number.isFinite);
        const passed = next != null && t >= next ? prog(t, next, 0.3) * (1 - settle) : 0;
        return (
          <div key={i} style={{position: 'relative', height: rowH}}>
            {i > 0 ? (
              <div style={{position: 'absolute', right: 24 + chip / 2 - 2, top: -gap - rowH / 2 + chip / 2, width: 4, height: rowH + gap - chip, borderRadius: 2, background: rgba(th.acc, 0.5), transformOrigin: 'top', transform: `scaleY(${prog(t, it.at - 0.15, 0.3)})`}} />
            ) : null}
            <div style={slide(t, it.at, 140)}>
              <Card th={th} glow={f} hot={it.hot === true} style={{height: rowH, justifyContent: 'flex-start', gap: 26, padding: '0 24px', borderRadius: rowH * 0.32, transform: `scale(${1 + 0.025 * f})`, transformOrigin: 'right center'}}>
                <Chip icon={it.icon} n={i + 1} size={chip} th={th} t={t} at={it.at} />
                <div style={{fontSize: fs, fontWeight: 800, whiteSpace: 'nowrap', flex: 1, opacity: 1 - 0.45 * passed}}>{it.text}</div>
                <div style={{fontSize: rowH * 0.22, fontWeight: 700, color: f > 0.5 ? th.acc : rgba(th.ink, 0.35), direction: 'ltr', fontVariantNumeric: 'tabular-nums'}}>{String(i + 1).padStart(2, '0')}</div>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// عبارة بحجم الشاشة: الكلمات تطلع وحدة وحدة من ضباب، والملوّنة ينمسح وراها لون الباقة زي القلم
function Word({scene, t, th, W, H}) {
  const words = String(scene.text || '').split(/\s+/).filter(Boolean);
  const at = scene.at || [];
  const hot = scene.hot || [];
  const fs = Math.min(H >= 900 ? 170 : 128, (W / Math.max(4, String(scene.text || '').length)) * 2.1);
  return (
    <div style={{...fill, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30}}>
      <div style={{display: 'flex', flexDirection: 'row', direction: 'rtl', flexWrap: 'wrap', justifyContent: 'center', gap: `14px ${fs * 0.24}px`, fontSize: fs, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1}}>
        {words.map((w, i) => {
          const wa = at[i] ?? scene.s + 0.4 + i * 0.12;
          const isHot = hot.includes(i);
          const mark = isHot ? prog(t, wa + 0.12, 0.35) : 0;
          return (
            <span key={i} style={{position: 'relative', display: 'inline-block', padding: `0 ${fs * 0.12}px`, color: mark > 0.5 ? th.onAcc : th.ink, ...pop(t, wa)}}>
              <span style={{position: 'absolute', left: 0, right: 0, top: '12%', bottom: '6%', borderRadius: fs * 0.16, background: `linear-gradient(150deg, ${th.acc}, ${rgba(th.acc, 0.75)})`, boxShadow: `0 0 50px ${rgba(th.acc, 0.4)}`, transformOrigin: 'right', transform: `scaleX(${mark})`, zIndex: -1}} />
              {w}
            </span>
          );
        })}
      </div>
      {scene.sub ? <div style={{fontSize: H >= 900 ? 56 : 44, fontWeight: 700, color: th.soft, ...enter(t, scene.subAt ?? scene.s + 0.9)}}>{scene.sub}</div> : null}
    </div>
  );
}

// فاتورة: بنود التكلفة تنزل سطر سطر داخل لوح زجاجي، وتحتها المجموع يعدّ لين يوصل
function Total({scene, t, th, W, H}) {
  const items = (scene.items || []).slice(0, 4);
  const n = Math.max(1, items.length);
  const big = H >= 900;
  const hasTotal = scene.total != null && scene.total !== '';
  const titleH = scene.title ? (big ? 120 : 90) : 0;
  const totalH = hasTotal ? (big ? 190 : 130) : 0;
  const rowH = Math.min(big ? 130 : 108, (H - titleH - totalH - 50) / n - 8);
  const longest = Math.max(6, ...items.map((it) => String(it.text || '').length + String(it.amount ?? '').length + 4));
  const fs = Math.min(rowH * 0.5, ((W - 190) / longest) * 2.5);
  const totalAt = scene.totalAt ?? (items.length ? items[items.length - 1].at + 0.8 : scene.s + 0.6);
  const ats = items.map((it) => it.at);
  return (
    <div style={{...fill, flexDirection: 'column', direction: 'rtl', justifyContent: 'center', gap: 8, padding: '0 10px'}}>
      {scene.title ? (
        <div style={{height: titleH, display: 'flex', alignItems: 'center'}}>
          <Heading text={scene.title} t={t} at={scene.titleAt ?? scene.s + 0.25} th={th} W={W} big={big} />
        </div>
      ) : null}
      <div style={{...glass(th, {radius: 40}), padding: '10px 28px', ...enter(t, (ats[0] ?? scene.s + 0.4) - 0.2)}}>
        {items.map((it, i) => {
          const f = focusOf(t, ats, i) * (1 - prog(t, totalAt, 0.3));
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, height: rowH, borderBottom: i < n - 1 ? `1.5px solid ${rgba(th.ink, 0.12)}` : 'none', ...slide(t, it.at, 100)}}>
              <Chip icon={it.icon} n={i + 1} size={rowH * 0.6} th={th} t={t} at={it.at} ghost={f < 0.5} />
              <div style={{fontSize: fs, fontWeight: 700, color: th.ink, whiteSpace: 'nowrap', flex: 1}}>{it.text}</div>
              {it.amount != null ? (
                <div style={{fontSize: fs * 1.08, fontWeight: 800, color: f > 0.5 ? th.acc : th.ink, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
                  <Counted text={it.amount} t={t} at={it.at} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {hasTotal ? (
        <div style={{marginTop: 14, ...pop(t, totalAt)}}>
          <Card hot th={th} style={{height: totalH - 30, justifyContent: 'space-between', padding: '0 36px', borderRadius: 36}}>
            <div style={{fontSize: big ? 62 : 50, whiteSpace: 'nowrap'}}>{scene.totalLabel || 'المجموع'}</div>
            <div style={{fontSize: fit(scene.total, W * 0.5, big ? 108 : 84, 1.9), fontWeight: 800, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
              <Counted text={scene.total} t={t} at={totalAt} />
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

// مقارنة: جهتين زجاجيتين جنب بعض وبينهم شارة تبديل، كل جهة لها رسمتها ونقاطها
function Compare({scene, t, th, W, H}) {
  const sides = [scene.right, scene.left].filter(Boolean);
  const big = H >= 900;
  const colW = (W - 60) / 2;
  const headH = big ? 360 : 220;
  const startAt = scene.s + 0.5;
  const maxRows = Math.max(0, ...sides.map((sd) => Math.min(3, (sd.items || []).length)));
  const rowFs = big ? 56 : 42;
  const blockH = headH + maxRows * (rowFs * 1.5 + (big ? 22 : 12)) + 40;
  const ats = sides.map((sd, i) => sd.at ?? startAt + i * 0.8);
  const settle = settleOf(t, [...ats, ...sides.flatMap((sd) => (sd.items || []).map((x) => x.at))]);
  return (
    <div style={{...fill, flexDirection: 'row', direction: 'rtl', alignItems: 'center', justifyContent: 'center', gap: 60}}>
      {sides.map((sd, i) => {
        const hot = sd.hot ?? i === sides.length - 1;
        const at = ats[i];
        const f = Math.max(focusOf(t, ats, i) * (1 - settle), hot ? settle : 0);
        const rows = (sd.items || []).slice(0, 3);
        return (
          <div key={i} style={{width: colW, height: Math.min(H, blockH), boxSizing: 'border-box', ...glass(th, {glow: f, radius: 44}), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: big ? 18 : 10, padding: big ? '26px 22px' : '14px 16px', ...pop(t, at)}}>
            <div style={{height: headH - 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8}}>
              {sd.art ? (
                <div style={{filter: 'drop-shadow(0 16px 22px rgba(0,0,0,0.35))', transform: `translateY(${float(t, 4, 1, i)}px)`}}>
                  <Art name={sd.art} size={big ? 220 : 120} th={th} k={prog(t, at, 0.9)} />
                </div>
              ) : sd.icon ? (
                <Chip icon={sd.icon} size={big ? 150 : 96} th={th} t={t} at={at} ghost={!hot && f < 0.5} />
              ) : null}
              <div style={{fontSize: fit(sd.title, colW - 40, big ? 74 : 56, 2), fontWeight: 800, color: hot ? th.acc : th.ink, whiteSpace: 'nowrap'}}>{sd.title}</div>
            </div>
            {rows.map((it, j) => (
              <div key={j} style={{display: 'flex', direction: 'rtl', alignItems: 'center', gap: 14, width: '100%', ...enter(t, it.at)}}>
                <div style={{width: rowFs * 1.05, height: rowFs * 1.05, borderRadius: rowFs * 0.35, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: sd.mark === 'cross' ? rgba(th.ink, 0.12) : rgba(th.acc, 0.22)}}>
                  <Icon name={sd.mark === 'cross' ? 'cross' : 'check'} size={rowFs * 0.7} color={sd.mark === 'cross' ? th.soft : th.acc} stroke={3} draw={prog(t, it.at + 0.1, 0.3)} />
                </div>
                <div style={{fontSize: fit(it.text, colW - 110, rowFs, 2.1), fontWeight: 700, color: th.ink, whiteSpace: 'nowrap'}}>{it.text}</div>
              </div>
            ))}
          </div>
        );
      })}
      {sides.length === 2 ? (
        <div style={{position: 'absolute', left: W / 2 - 42, top: H / 2 - 42, width: 84, height: 84, borderRadius: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: th.acc, boxShadow: `0 0 0 8px ${rgba(th.bg, 0.9)}, 0 0 40px ${rgba(th.acc, 0.5)}`, ...pop(t, ats[1] - 0.15)}}>
          <Icon name="swap" size={46} color={th.onAcc} stroke={2.6} />
        </div>
      ) : null}
    </div>
  );
}

// رقم واحد كبير: يعدّ لين يوصل، بتدرّج وتوهّج، وفوقه رسمته
function Stat({scene, t, th, W, H}) {
  const big = H >= 900;
  const at = scene.at ?? scene.s + 0.5;
  const ring = big ? 240 : 150;
  const r = ring / 2 - 8;
  const k = prog(t, at - 0.1, 0.8);
  return (
    <div style={{...fill, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: big ? 26 : 10}}>
      {scene.art ? (
        <div style={{transform: `translateY(${float(t, 7)}px)`, filter: 'drop-shadow(0 20px 28px rgba(0,0,0,0.4))'}}>
          <Art name={scene.art} size={big ? 340 : 200} th={th} k={prog(t, at - 0.3, 1)} />
        </div>
      ) : scene.icon ? (
        <div style={{position: 'relative', width: ring, height: ring, display: 'flex', alignItems: 'center', justifyContent: 'center', color: th.ink, ...enter(t, at - 0.2)}}>
          <svg width={ring} height={ring} style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)', overflow: 'visible'}}>
            <circle cx={ring / 2} cy={ring / 2} r={r} fill={rgba(th.ink, 0.05)} stroke={rgba(th.ink, 0.14)} strokeWidth={8} />
            <circle cx={ring / 2} cy={ring / 2} r={r} fill="none" stroke={th.acc} strokeWidth={8} strokeLinecap="round" strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - k)} style={{filter: `drop-shadow(0 0 12px ${th.acc})`}} />
          </svg>
          <Icon name={scene.icon} size={ring * 0.46} stroke={1.9} draw={prog(t, at, 0.5)} />
        </div>
      ) : null}
      <div style={{display: 'flex', direction: 'rtl', alignItems: 'baseline', justifyContent: 'center', gap: 24, ...pop(t, at)}}>
        <div
          style={{
            fontSize: fit(scene.value, W * (scene.unit ? 0.55 : 0.9), big ? 300 : 190, 1.5),
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -4,
            direction: 'ltr',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
            background: `linear-gradient(180deg, ${th.ink} 10%, ${th.acc} 95%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: `drop-shadow(0 0 40px ${rgba(th.acc, 0.35)})`,
          }}
        >
          <Counted text={scene.value} t={t} at={at} />
        </div>
        {scene.unit ? <div style={{fontSize: big ? 80 : 56, fontWeight: 800, color: th.acc, whiteSpace: 'nowrap'}}>{scene.unit}</div> : null}
      </div>
      {scene.label ? (
        <div style={{...glass(th, {radius: 40}), padding: big ? '16px 40px' : '10px 30px', fontSize: fit(scene.label, W - 120, big ? 56 : 44, 1.9), fontWeight: 700, color: th.ink, whiteSpace: 'nowrap', ...enter(t, scene.labelAt ?? at + 0.35)}}>{scene.label}</div>
      ) : null}
    </div>
  );
}

// صورة حقيقية لشي انذكر بالاسم (مكان، شخص معروف، شعار) وتحتها اسمه
function Picture({scene, t, th, W, H}) {
  const big = H >= 900;
  const at = scene.at ?? scene.s + 0.5;
  const logo = scene.fit === 'logo';
  const titleH = scene.title ? (big ? 150 : 100) : 0;
  const gap = scene.title ? (big ? 26 : 12) : 0;
  const ph = H - titleH - gap - (big ? 40 : 12);
  const pw = logo ? Math.min(W - 40, ph * 1.25) : W - 40;
  return (
    <div style={{...fill, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap}}>
      <div style={{transform: `translateY(${float(t, 4)}px)`}}>
        <Photo file={scene.file} w={pw} h={ph} th={th} t={t} at={at} fit={logo ? 'logo' : 'cover'} pos={scene.pos || 'center'} />
      </div>
      {scene.title ? (
        <div style={{height: titleH, display: 'flex', alignItems: 'center', direction: 'rtl', fontSize: fit(scene.title, W - 60, big ? 96 : 70, 1.9), fontWeight: 800, color: th.ink, whiteSpace: 'nowrap', ...pop(t, scene.titleAt ?? at + 0.35)}}>{scene.title}</div>
      ) : null}
    </div>
  );
}

// ورا الرسمة: شبكة نقاط ناعمة تتلاشى عند الأطراف، وضوء واحد يتحرك ببطء. عمق بدون ما يسحب العين
function Backdrop({t, th, W, H}) {
  const r = H * 0.55;
  const x = W * 0.5 + Math.sin(t * 0.4) * W * 0.22;
  const y = H * 0.45 + Math.cos(t * 0.33) * H * 0.12;
  const mask = 'radial-gradient(ellipse 60% 55% at 50% 50%, black 20%, transparent 75%)';
  return (
    <>
      <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${rgba(th.acc, 0.16)}, ${rgba(th.acc, 0)} 65%)`}} />
      <div
        style={{
          position: 'absolute',
          inset: -60,
          backgroundImage: `radial-gradient(${rgba(th.ink, 0.13)} 1.6px, transparent 2px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: `0 ${(t * 8) % 36}px`,
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      />
    </>
  );
}

const TYPES = {stage: Stage, flow: Flow, numbers: Numbers, list: List, word: Word, total: Total, compare: Compare, stat: Stat, photo: Picture};

// دخول الرسمة كاملة: تطلع من تحت بزنبرك وتوضح من ضباب. وخروجها: تصغر شعرة وتتلاشى بضباب
function panelMotion(scene, t) {
  const kin = clamp(spring(t, scene.s + 0.05, {freq: 1.4, damp: 0.8}), 0, 1.03);
  const kout = ease((t - (scene.e - 0.3)) / 0.3);
  const vis = clamp((t - scene.s - 0.05) / 0.2) * (1 - kout);
  const blur = (1 - clamp(kin)) * 14 + kout * 12;
  return {opacity: vis, transform: `translateY(${((1 - kin) * 50).toFixed(2)}px) scale(${(1 - 0.04 * kout).toFixed(4)})`, filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : 'none'};
}

// shiftY: وقت القسمة الرسمة تطلع وتنزل مع الخط الفاصل، فما تركب على صورة المتحدث
export function ScenePanel({scene, t, th, shiftY = 0}) {
  const cv = canvasOf(scene);
  const base = {position: 'absolute', left: cv.x, top: cv.y + shiftY, width: cv.w, height: cv.h, ...panelMotion(scene, t)};
  if (scene.type === 'custom') {
    const C = CUSTOM[scene.name];
    if (!C) return <div style={{...base, color: '#ff5555', fontSize: 50, fontWeight: 700, direction: 'rtl'}}>الرسمة مو موجودة بـcustom.jsx: {String(scene.name)}</div>;
    return (
      <div style={base}>
        <Backdrop t={t} th={th} W={cv.w} H={cv.h} />
        <C t={t} local={t - scene.s} scene={scene} th={th} W={cv.w} H={cv.h} layout={layoutOf(scene)} />
      </div>
    );
  }
  const C = TYPES[scene.type];
  if (!C) return null;
  return (
    <div style={base}>
      <Backdrop t={t} th={th} W={cv.w} H={cv.h} />
      <C scene={scene} t={t} th={th} W={cv.w} H={cv.h} />
    </div>
  );
}
