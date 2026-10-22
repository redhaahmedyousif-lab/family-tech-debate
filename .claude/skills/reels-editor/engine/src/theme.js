// باقات الألوان. كل باقة لونين بارزين (acc و acc2) يتدرّجون مع بعض، وهذا اللي يعطي الرسمات عمقها.
// bg خلفية اللوحات · ink النص والأشياء الفاتحة · acc البارز · acc2 البارز الثاني · onAcc النص فوق البارز · soft الثانوي
export const PALETTES = {
  midnight: {name: 'ليلي كهربائي', bg: '#070B16', ink: '#F4F6FF', acc: '#4F7CFF', acc2: '#A66BFF', onAcc: '#FFFFFF', soft: '#8A93B2'},
  ocean: {name: 'بحر فيروزي', bg: '#04141E', ink: '#ECFAFF', acc: '#22D3EE', acc2: '#3B82F6', onAcc: '#04141E', soft: '#7FA5B8'},
  sunset: {name: 'غروب', bg: '#140A10', ink: '#FFF5EF', acc: '#FF7A45', acc2: '#FF3D81', onAcc: '#FFFFFF', soft: '#B79C9E'},
  emerald: {name: 'زمرّدي', bg: '#04130E', ink: '#EEFFF7', acc: '#34D399', acc2: '#B8F35A', onAcc: '#04130E', soft: '#80A99A'},
  gold: {name: 'ذهبي فاخر', bg: '#0D0B08', ink: '#FFF9EC', acc: '#F5B841', acc2: '#FF8A3D', onAcc: '#1A1205', soft: '#A99B80'},
  neon: {name: 'أسود ونيون', bg: '#0A0A0A', ink: '#FFFFFF', acc: '#C8FF3D', acc2: '#3DFFC0', onAcc: '#0A0A0A', soft: '#8C8C8C'},
  mono: {name: 'أسود وأبيض', bg: '#0B0B0C', ink: '#FFFFFF', acc: '#FFFFFF', acc2: '#9A9AA2', onAcc: '#0B0B0C', soft: '#8E8E93'},
  paper: {name: 'ورقي فاتح', bg: '#F5F1EA', ink: '#17161A', acc: '#FF5A36', acc2: '#FFB020', onAcc: '#FFFFFF', soft: '#7A756C'},
};

// أسماء الباقات القديمة: الإعدادات المحفوظة من قبل تبقى تشتغل
export const ALIASES = {bahr: 'ocean', nakheel: 'emerald', fajr: 'sunset', annabi: 'sunset', ramli: 'paper', thalj: 'paper'};

export function resolveTheme(plan) {
  const key = ALIASES[plan?.palette] || plan?.palette;
  const base = PALETTES[key] || PALETTES.midnight;
  const th = {...base, ...(plan?.colors || {})};
  if (!th.acc2) th.acc2 = th.acc;
  return th;
}

const rgb = (hex) => {
  const h = String(hex).replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const rgba = (hex, a) => {
  const [r, g, b] = rgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

// يخلط لونين: k=0 الأول، k=1 الثاني
export const mix = (a, b, k) => {
  const x = rgb(a);
  const y = rgb(b);
  return '#' + x.map((u, i) => Math.round(u + (y[i] - u) * k).toString(16).padStart(2, '0')).join('');
};
