// منطق الخطة المشترك بين الرندر والمحرّر: الطابع، شكل الكتابة، الأصوات، فحص الهدوء، وإعادة التوقيت.
// ملف جافاسكربت صافي بدون JSX عشان تقراه أدوات Node والمتصفح سوا.

export const W = 1080;
export const H = 1920;
// ارتفاع المتحدث لما الشاشة تنقسم، والباقي تحته للرسمة
export const SPLIT_H = 900;

// الطابع: قوة القربة عند كل قصّة، وحجم الكتابة وحركتها
export const STYLES = {
  calm: {zooms: [1, 1.05], capSize: 84, perPage: 3, chars: 18, reveal: false, pop: 0, tilt: 0},
  formal: {zooms: [1, 1.08], capSize: 92, perPage: 3, chars: 16, reveal: true, pop: 0.05, tilt: 0},
  hype: {zooms: [1, 1.16, 1.06, 1.2], capSize: 112, perPage: 2, chars: 12, reveal: true, pop: 0.12, tilt: -2},
};

export const styleOf = (plan) => STYLES[plan?.style] || STYLES.formal;
export const layoutOf = (sc) => (sc?.layout === 'split' ? 'split' : 'full');

// شكل الكتابة: الطابع يعطي الأساس، و plan.captions يبدّل اللي يبغاه صاحب المقطع
export function captionStyle(plan, th) {
  const st = styleOf(plan);
  const c = plan?.captions || {};
  const perPage = c.perPage ?? st.perPage;
  return {
    bg: c.bg || 'none', // none: حد حول الحروف · line: مربع ورا السطر · word: مربع ورا الكلمة اللي تنقال
    bgColor: c.bgColor || '#000000',
    bgOpacity: c.bgOpacity ?? 0.6,
    // الكتابة بيضا دايم إلا لو صاحب المقطع اختار غير كذا من المحرّر. الكلمة اللي تنقال تبان بالحجم والوضوح، مو باللون
    color: c.color || '#FFFFFF',
    activeColor: c.activeColor || '#FFFFFF',
    hotColor: c.hotColor || '#FFFFFF',
    size: c.size ?? st.capSize,
    weight: c.weight ?? 700,
    y: c.y ?? null, // مكانها كنسبة من طول الشاشة. null = تحت الذقن تلقائي
    perPage,
    chars: c.perPage ? perPage * 7 : st.chars,
    reveal: c.reveal ?? st.reveal,
    pop: c.pop ?? st.pop,
    tilt: st.tilt,
    outline: c.outline ?? true,
  };
}

// ——— الأصوات ———
// المؤثرات تتولّد بالكود (tools/sfx.mjs) وأسماؤها هنا. العلو مضبوط على كلام بقوة ‎-14 LUFS.
export const SFX = {
  whoosh: {label: 'نفخة', vol: 0.3, len: 0.5},
  pop: {label: 'طقّة', vol: 0.4, len: 0.2},
  tick: {label: 'تكّة', vol: 0.34, len: 0.1},
};
const SFX_GAP = 0.22; // أقل مسافة بين صوتين
const SFX_PER_30 = 12; // الحد الأعلى بكل ثلاثين ثانية

function sceneSounds(sc) {
  if (sc.sfx === false) return [];
  if (Array.isArray(sc.sfx)) return sc.sfx.filter((x) => x && SFX[x.name] && Number.isFinite(x.at));
  // التلقائي: نفخة عند دخول الرسمة، وصوت خفيف مع كل عنصر له وقت
  const out = [{at: sc.s, name: 'whoosh'}];
  // المشهد: طقّة مع كل شي يدخل، ونفخة مع كل شي يطير لغيره، وتكّة مع النبضة
  if (sc.type === 'stage') {
    for (const a of sc.actors || []) {
      if (Number.isFinite(a?.at)) out.push({at: a.at, name: 'pop'});
      if (Number.isFinite(a?.toAt)) out.push({at: a.toAt, name: 'whoosh'});
      if (Number.isFinite(a?.pulseAt)) out.push({at: a.pulseAt, name: 'tick'});
    }
    return out;
  }
  const each = sc.type === 'numbers' || sc.type === 'total' ? 'tick' : 'pop';
  for (const it of sc.items || []) if (Number.isFinite(it?.at)) out.push({at: it.at, name: each});
  if (sc.type === 'total' && sc.total != null && Number.isFinite(sc.totalAt)) out.push({at: sc.totalAt, name: 'pop'});
  if (sc.type === 'photo') out.push({at: sc.at ?? sc.s + 0.5, name: 'pop'});
  if (sc.type === 'stat') out.push({at: sc.at ?? sc.s + 0.5, name: 'pop'});
  if (sc.type === 'compare') for (const sd of [sc.right, sc.left]) if (Number.isFinite(sd?.at)) out.push({at: sd.at, name: 'pop'});
  if (sc.type === 'word') for (const at of sc.at || []) if (Number.isFinite(at)) out.push({at, name: 'pop'});
  return out;
}

export function resolveSounds(plan, meta, total = Infinity) {
  const cfg = plan?.sfx;
  if (cfg === false || cfg?.enabled === false) return [];
  const master = cfg?.volume ?? 1;
  // صوت المصدر غالباً أوطى من ‎-14، والمعايرة تجي بعد الرندر على الخليط كله، فنوطّي المؤثرات بنفس الفرق
  const lufs = Number.isFinite(meta?.sourceLufs) ? meta.sourceLufs : -14;
  const match = Math.max(0.05, Math.min(1, Math.pow(10, (lufs + 14) / 20)));
  const all = [];
  for (const sc of plan?.scenes || []) for (const s of sceneSounds(sc)) all.push(s);
  all.sort((a, b) => a.at - b.at);
  const cap = Math.max(4, Math.round((Math.min(total, 600) / 30) * SFX_PER_30));
  const out = [];
  for (const s of all) {
    if (s.at < 0 || s.at > total) continue;
    if (out.length && s.at - out[out.length - 1].at < SFX_GAP) continue;
    if (out.length >= cap) break;
    out.push({at: s.at, name: s.name, vol: Math.min(1, SFX[s.name].vol * (s.vol ?? 1) * master * match)});
  }
  return out;
}

export function musicOf(plan, meta) {
  const m = plan?.music;
  if (!m || !m.file) return null;
  const lufs = Number.isFinite(meta?.sourceLufs) ? meta.sourceLufs : -14;
  const match = Math.max(0.05, Math.min(1, Math.pow(10, (lufs + 14) / 20)));
  return {file: m.file, vol: Math.min(1, (m.volume ?? 0.12) * match)};
}

// ——— ربط التوقيت بالكلام ———
// بدل ما تُكتب الأوقات بالأرقام، أي عنصر فيه "word" ياخذ وقته من لحظة نطق هالكلمة بالضبط:
//   word → at · totalWord → totalAt · noteWord → noteAt · labelWord → labelAt … (أي xWord → xAt)
// والرسمة اللي ما لها s أو e تاخذهم من أول وآخر كلمة فيها. فالرسمة تمشي مع الكلام حتى لو تغيّر القص.
export const LEAD = 0.15; // العنصر يبدأ يطلع قبل الكلمة بشعرة، فيكتمل وهو ينقال
const PRE = 0.45; // الرسمة تفتح قبل أول عنصر فيها
const POST = 1.1; // وتبقى بعد آخر كلمة فيها

const AR_MARKS = /[ً-ْٰـ]/g;
export const normWord = (w) =>
  String(w ?? '')
    .toLowerCase()
    .replace(AR_MARKS, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}]/gu, '');
// السوابق اللي تلتصق بالكلمة بالعامية والفصحى: «والـ» «بال» «فـ» …
const bare = (w) => w.replace(/^(وبال|وال|بال|فال|كال|لل|ال|و|ف|ب|ل)(?=..)/, '');

function lev(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  let prev = Array.from({length: n + 1}, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
// تشابه كلمتين من 0 لـ1
export function wordSim(x, y) {
  const a = normWord(x);
  const b = normWord(y);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (bare(a) === bare(b)) return 0.92;
  const s = 1 - lev(a, b) / Math.max(a.length, b.length);
  const short = Math.min(a.length, b.length);
  return short >= 2 && (a.includes(b) || b.includes(a)) ? Math.max(s, 0.78) : s;
}

const flatWords = (sentences) => (sentences || []).flatMap((sen) => sen.words || []);

// كل الأماكن اللي انقالت فيها العبارة (كلمة أو أكثر): [{s, e}]
export function findPhrase(words, phrase) {
  const toks = String(phrase ?? '').trim().split(/\s+/).filter(Boolean);
  if (!toks.length) return [];
  const out = [];
  for (let i = 0; i + toks.length <= words.length; i++) {
    let ok = true;
    for (let j = 0; j < toks.length && ok; j++) ok = wordSim(words[i + j].t, toks[j]) >= 0.72;
    if (ok) out.push({s: words[i].s, e: words[i + toks.length - 1].e});
  }
  return out;
}

const r2 = (x) => Math.round(x * 100) / 100;

// يرجّع نسخة من الخطة كل أوقاتها محسوبة من الكلام، ومعها _issues للي ما انلقى
export function resolvePlan(plan, sentences, total = Infinity) {
  if (!plan) return plan;
  const words = flatWords(sentences);
  const issues = [];
  let prevEnd = 0;
  const scenes = (plan.scenes || []).map((orig, idx) => {
    const sc = JSON.parse(JSON.stringify(orig));
    const n = idx + 1;
    // نبدأ ندوّر من بداية الرسمة (لو مكتوبة) أو من نهاية اللي قبلها، والعناصر تمشي بترتيب الكلام
    let cursor = Number.isFinite(sc.s) ? sc.s - 1.5 : prevEnd;
    const floor = cursor;
    const hits = [];
    const visit = (obj) => {
      if (Array.isArray(obj)) return obj.forEach(visit);
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        if (key !== 'word' && !/Word$/.test(key)) continue;
        const phrase = obj[key];
        if (typeof phrase !== 'string' || !phrase.trim()) continue;
        const target = key === 'word' ? 'at' : key.replace(/Word$/, 'At');
        const all = findPhrase(words, phrase);
        let hit = null;
        if (Number.isInteger(obj.nth) && key === 'word') hit = all[obj.nth - 1] || null;
        else hit = all.find((h) => h.s >= cursor - 0.05) || all.find((h) => h.s >= floor - 0.05) || all[all.length - 1] || null;
        if (!hit) {
          issues.push(`الرسمة ${n}: الكلمة «${phrase}» ما انقالت بالكلام. انسخها بحروفها من الكلام المصحّح`);
          continue;
        }
        obj[target] = r2(Math.max(0, hit.s - LEAD));
        hits.push(hit);
        cursor = hit.s;
      }
      for (const key of Object.keys(obj)) if (obj[key] && typeof obj[key] === 'object') visit(obj[key]);
    };
    visit(sc);
    // قالب العبارة: كل كلمة فيه تنبض لحظة نطقها
    if (sc.type === 'word' && !Array.isArray(sc.at) && sc.text) {
      let c = Number.isFinite(sc.s) ? sc.s - 1.5 : prevEnd;
      sc.at = String(sc.text)
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => {
          const h = findPhrase(words, w).find((x) => x.s >= c - 0.05);
          if (!h) return null;
          hits.push(h);
          c = h.s;
          return r2(Math.max(0, h.s - LEAD));
        });
      if (sc.at.some((x) => x == null)) {
        const first = sc.at.find((x) => x != null) ?? (sc.s ?? 0) + 0.4;
        sc.at = sc.at.map((x, i) => x ?? r2(first + i * 0.12));
      }
    }
    if (hits.length) {
      const first = Math.min(...hits.map((h) => h.s));
      const last = Math.max(...hits.map((h) => h.e));
      if (!Number.isFinite(sc.s)) sc.s = r2(Math.max(0, first - LEAD - PRE));
      if (!Number.isFinite(sc.e)) sc.e = r2(Math.min(total, Math.max(sc.s + 2, last + POST)));
    }
    if (Number.isFinite(sc.e)) prevEnd = sc.e;
    return sc;
  });
  return {...plan, scenes, _issues: issues};
}

// كل الأوقات اللي بالرسمة (at و xAt) مع مكانها، للفحص
function sceneTimes(sc) {
  const out = [];
  const visit = (obj, label) => {
    if (Array.isArray(obj)) return obj.forEach((x, i) => (typeof x === 'number' ? out.push({at: x, label}) : visit(x, label)));
    if (!obj || typeof obj !== 'object') return;
    for (const [k, v] of Object.entries(obj)) {
      if ((k === 'at' || /At$/.test(k)) && typeof v === 'number') out.push({at: v, label: obj.word || obj.text || obj.title || k});
      else if ((k === 'at' || /At$/.test(k)) && Array.isArray(v)) visit(v, k);
      else if (v && typeof v === 'object') visit(v, obj.text || obj.title || k);
    }
  };
  visit(sc);
  return out;
}

// ——— فحص الهدوء ———
// المقطع ما يصدّع: الرسمات قليلة، بينها نفَس، ووجه المتحدث له أغلب الوقت.
export const LIMITS = {min: 2, maxFull: 6, maxSplit: 9, gap: 2, firstAt: 1.5, per30: 5, fullPer30: 3, cover: 0.7};

export function validatePlan(plan, total) {
  const problems = [...(plan?._issues || [])];
  const scenes = (plan?.scenes || []).map((sc, i) => ({...sc, n: i + 1}));
  for (const sc of scenes) {
    // كل عنصر لازم يطلع وهو ينقال: لا قبل ما تفتح الرسمة ولا بعد ما تتسكّر
    if (sc.type !== 'custom' && Number.isFinite(sc.s) && Number.isFinite(sc.e)) {
      for (const x of sceneTimes(sc)) {
        if (x.at < sc.s + 0.2) problems.push(`الرسمة ${sc.n}: «${x.label}» انقالت (${x.at.toFixed(2)}) قبل ما تفتح الرسمة (${sc.s}). قدّم بداية الرسمة أو احذف s وخلّها تنحسب من الكلام`);
        else if (x.at > sc.e - 0.5) problems.push(`الرسمة ${sc.n}: «${x.label}» تطلع (${x.at.toFixed(2)}) والرسمة تتسكّر (${sc.e}). أخّر نهايتها`);
      }
    }
    const len = sc.e - sc.s;
    const split = layoutOf(sc) === 'split';
    if (!['stage', 'flow', 'numbers', 'list', 'word', 'total', 'compare', 'stat', 'photo', 'custom'].includes(sc.type)) problems.push(`الرسمة ${sc.n}: نوع مو معروف "${sc.type}"`);
    if (sc.type === 'photo' && !sc.file) problems.push(`الرسمة ${sc.n}: نوعها photo وناقصها file (مثل images/name.jpg)`);
    if (sc.type === 'custom' && !sc.name) problems.push(`الرسمة ${sc.n}: نوعها custom وناقصها name`);
    if (sc.layout && !['full', 'split'].includes(sc.layout)) problems.push(`الرسمة ${sc.n}: layout يا full يا split`);
    if (!(sc.e > sc.s)) problems.push(`الرسمة ${sc.n}: النهاية لازم تكون بعد البداية`);
    else if (len < LIMITS.min) problems.push(`الرسمة ${sc.n}: أقصر من ثانيتين وما تلحق تنقرا`);
    if (!split && len > LIMITS.maxFull) problems.push(`الرسمة ${sc.n}: مالية الشاشة أكثر من ${LIMITS.maxFull} ثواني والمتحدث محجوب، فقصّرها أو خلّها split`);
    if (split && len > LIMITS.maxSplit) problems.push(`الرسمة ${sc.n}: الشاشة مقسومة أكثر من ${LIMITS.maxSplit} ثواني، فقصّرها أو اقسمها`);
    if (sc.s < 0 || sc.e > total + 0.05) problems.push(`الرسمة ${sc.n}: برّا مدة الفيديو (${total} ث)`);
    if (sc.s < LIMITS.firstAt) problems.push(`الرسمة ${sc.n}: بداية المقطع لوجهه، فلا رسمة قبل الثانية ${LIMITS.firstAt}`);
  }
  const sorted = scenes.slice().sort((a, b) => a.s - b.s);
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].s - sorted[i - 1].e;
    if (gap < LIMITS.gap - 0.001) problems.push(`الرسمة ${sorted[i - 1].n} والرسمة ${sorted[i].n}: بينهم ${Math.max(0, gap).toFixed(1)} ث، والمطلوب ${LIMITS.gap} ثواني يرتاح فيها المشاهد`);
  }
  const units = Math.max(1, total / 30);
  const maxAll = Math.max(1, Math.round(units * LIMITS.per30));
  const maxFull = Math.max(1, Math.round(units * LIMITS.fullPer30));
  const nFull = scenes.filter((s) => layoutOf(s) === 'full').length;
  if (scenes.length > maxAll) problems.push(`الرسمات ${scenes.length} والحد لهالطول ${maxAll}: احذف الأضعف`);
  if (nFull > maxFull) problems.push(`الرسمات المالية للشاشة ${nFull} والحد ${maxFull}: حوّل وحدة لـsplit أو احذفها`);
  const covered = scenes.reduce((n, s) => n + Math.max(0, s.e - s.s), 0);
  if (total > 0 && covered / total > LIMITS.cover) problems.push(`الرسمات ماخذة ${Math.round((covered / total) * 100)}٪ من المقطع والحد ${LIMITS.cover * 100}٪`);
  return problems;
}

// تنبيهات ما تمنع الرندر: المقطع يطلع، بس الخطة تستاهل مراجعة
export function advisePlan(plan, total) {
  const notes = [];
  const n = (plan?.scenes || []).length;
  const want = Math.max(1, Math.round((total / 30) * 3));
  if (total >= 12 && n < want) notes.push(`الرسمات ${n} والمقطع ${Math.round(total)} ث: المتوقع ${want} على الأقل. ارجع للكلام ودوّر أي رقم أو تكلفة أو مقارنة أو تعداد ما انرسم.`);
  // التنويع: الرسمات اللي تشرح بأشياء مرسومة (stage والخاصة والصور) لازم تكون الأغلب، والقوالب النصية ما تتوالى
  const scenes = (plan?.scenes || []).slice().sort((x, y) => (x.s ?? 0) - (y.s ?? 0));
  const drawn = scenes.filter((sc) => ['stage', 'custom', 'photo'].includes(sc.type)).length;
  if (n >= 2 && drawn / n < 2 / 3) notes.push(`المشاهد المرسومة ${drawn} من ${n}: خلّ ثلثين الرسمات على الأقل stage. القوالب النصية للضرورة بس`);
  const TEXTY = ['list', 'flow', 'numbers', 'word', 'total', 'compare', 'stat'];
  for (let i = 1; i < scenes.length; i++) if (TEXTY.includes(scenes[i].type) && TEXTY.includes(scenes[i - 1].type)) notes.push(`الرسمة ${i} و${i + 1} قالبين نصيين ورا بعض. حوّل وحدة منهم مشهد stage`);
  return notes;
}

// ——— الكلام ———
const r3 = (x) => Math.round(x * 1000) / 1000;

// يطابق كلمات الجملة المصحّحة على الكلمات المسموعة: اللي تقابل كلمة مسموعة تاخذ وقتها بالضبط،
// واللي انضافت أو اندمجت تاخذ الوقت اللي بين جيرانها. كذا التصحيح ما يزحزح توقيت باقي الجملة.
function alignWords(toks, sen) {
  const old = sen.words || [];
  const m = toks.length;
  const n = old.length;
  const sim = toks.map((tk) => old.map((w) => wordSim(tk, w.t)));
  // أطول تطابق مرتّب (زي diff) بأعلى مجموع تشابه
  const dp = Array.from({length: m + 1}, () => new Float64Array(n + 1));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--) dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1], sim[i][j] >= 0.5 ? dp[i + 1][j + 1] + sim[i][j] : -1);
  const match = new Array(m).fill(-1);
  for (let i = 0, j = 0; i < m && j < n; ) {
    if (sim[i][j] >= 0.5 && dp[i][j] === dp[i + 1][j + 1] + sim[i][j]) match[i++] = j++;
    else if (dp[i][j] === dp[i + 1][j]) i++;
    else j++;
  }
  // الكلمة المسموعة اللي ما قابلها شي (مثل «و» اندمجت بالكلمة اللي بعدها) تعطي وقتها للي بعدها
  const words = toks.map((t, i) => (match[i] >= 0 ? {t, s: old[match[i]].s, e: old[match[i]].e} : {t, s: null, e: null}));
  for (let i = 0; i < m; i++) {
    if (match[i] < 0) continue;
    const j = match[i];
    if (j > 0 && (i === 0 || match[i - 1] < j - 1) && old[j - 1] && normWord(old[j - 1].t).length <= 2) {
      const prevMatchedEnd = i > 0 && match[i - 1] >= 0 ? old[match[i - 1]].e : -1;
      if (old[j - 1].s >= prevMatchedEnd) words[i].s = old[j - 1].s;
    }
  }
  // الفراغات: نوزّع الوقت بين الكلمتين المعروفتين بحسب طول الحروف
  for (let i = 0; i < m; ) {
    if (words[i].s != null) {
      i++;
      continue;
    }
    let k = i;
    while (k < m && words[k].s == null) k++;
    const from = i > 0 ? words[i - 1].e : sen.s;
    const to = k < m ? words[k].s : sen.e;
    const span = Math.max(0.08 * (k - i), to - from);
    const len = toks.slice(i, k).reduce((a, x) => a + x.length, 0) || 1;
    let c = 0;
    for (let x = i; x < k; x++) {
      words[x].s = r3(from + (span * c) / len);
      c += toks[x].length;
      words[x].e = r3(from + (span * c) / len);
    }
    i = k;
  }
  return words;
}

// يطبّق تصحيح الجمل {"رقم الجملة": "النص الصحيح"} على التفريغ الخام ويوزّع التوقيت على الكلمات
export function applyFix(rawSentences, fix = {}) {
  return rawSentences.map((sen) => {
    const txt = fix[String(sen.id)];
    if (typeof txt !== 'string' || !txt.trim()) return sen;
    const toks = txt.trim().split(/\s+/);
    return {...sen, text: toks.join(' '), words: alignWords(toks, sen)};
  });
}

// ——— تغيير القص ———
// أي وقت بالمقطع المقصوص نرجّعه لوقته بالتسجيل الأصلي، ثم نحسبه على القص الجديد.
const starts = (keep) => {
  const out = [];
  let acc = 0;
  for (const k of keep) {
    out.push(acc);
    acc += k[1] - k[0];
  }
  return out;
};
export const keepTotal = (keep) => r3(keep.reduce((n, k) => n + (k[1] - k[0]), 0));

export function toSource(t, keep) {
  const st = starts(keep);
  for (let i = 0; i < keep.length; i++) {
    const len = keep[i][1] - keep[i][0];
    if (t <= st[i] + len || i === keep.length - 1) return keep[i][0] + Math.max(0, Math.min(len, t - st[i]));
  }
  return 0;
}

export function fromSource(src, keep) {
  const st = starts(keep);
  for (let i = 0; i < keep.length; i++) {
    if (src < keep[i][0]) return st[i];
    if (src <= keep[i][1]) return st[i] + (src - keep[i][0]);
  }
  return keepTotal(keep);
}

export const retime = (t, oldKeep, newKeep) => r3(fromSource(toSource(t, oldKeep), newKeep));

// يعيد توقيت كل شي له وقت: الكلام والرسمات وعناصرها
export function retimeProject({raw, plan}, oldKeep, newKeep) {
  const f = (t) => retime(t, oldKeep, newKeep);
  const inNew = (src) => newKeep.some((k) => src >= k[0] - 0.05 && src <= k[1] + 0.05);
  const isTime = (key) => key === 'at' || /At$/.test(key || '');
  const sentences = raw.sentences
    .map((sen) => {
      // الكلمة اللي وقتها الأصلي طاح برّا القص الجديد تروح
      const words = sen.words
        .filter((w) => inNew(toSource((w.s + w.e) / 2, oldKeep)))
        .map((w) => ({...w, s: f(w.s), e: r3(Math.max(f(w.s) + 0.08, f(w.e)))}));
      if (!words.length) return null;
      return {...sen, s: words[0].s, e: words[words.length - 1].e, text: words.map((w) => w.t).join(' '), words};
    })
    .filter(Boolean);
  const deep = (v, key) => {
    if (Array.isArray(v)) return v.map((x) => (typeof x === 'number' && isTime(key) ? f(x) : deep(x, key)));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x, k)]));
    if (typeof v === 'number' && (key === 's' || key === 'e' || isTime(key))) return f(v);
    return v;
  };
  const scenes = (plan.scenes || []).map((sc) => deep(sc));
  return {raw: {...raw, total: keepTotal(newKeep), sentences}, plan: {...plan, scenes}};
}
