// صور حقيقية للرسمات: مكان، شخص معروف، شعار.
//   node tools/image.mjs search "<كلمات البحث>" [عدد] [--wiki ar|en]   ← يدوّر بويكيميديا ويطبع المرشّحين
//   node tools/image.mjs get "<مجلد الشغل>" "<رابط الصورة>" <اسم-انجليزي>   ← ينزّلها لـ images/ ويتأكد إنها صورة
import fs from 'node:fs';
import path from 'node:path';

const UA = 'reels-editor/1.0 (image lookup)';
const [cmd, ...rest] = process.argv.slice(2);
const flag = (name) => (rest.includes(name) ? rest[rest.indexOf(name) + 1] : null);
const args = rest.filter((a, i) => !a.startsWith('--') && rest[i - 1] !== '--wiki');
let done = false;
const fail = (code) => {
  process.exitCode = code;
  throw new Error('stop');
};
const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

try {
if (cmd === 'search') {
  const query = args[0];
  const limit = Number(args[1] || 8);
  if (!query) {
    console.error('❌ اكتب كلمات البحث');
    fail(1);
  }
  const wiki = flag('--wiki');
  const api = wiki ? `https://${wiki}.wikipedia.org/w/api.php` : 'https://commons.wikimedia.org/w/api.php';
  const params = new URLSearchParams({action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1400', generator: 'search', gsrnamespace: '6', gsrlimit: String(limit), gsrsearch: query});
  const res = await fetch(`${api}?${params}`, {headers: {'User-Agent': UA}});
  const pages = Object.values((await res.json()).query?.pages || {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  if (!pages.length) {
    console.log('ما لقيت شي. جرّب كلمات ثانية أو --wiki en أو --wiki ar، أو دوّر بالمتصفح.');
    done = true;
  }
  pages.forEach((p, n) => {
    const i = p.imageinfo?.[0];
    if (!i) return;
    console.log(`${n + 1}. ${p.title.replace(/^File:|^ملف:/, '')}`);
    console.log(`   ${i.width}×${i.height} · ${strip(i.extmetadata?.ImageDescription?.value).slice(0, 110)}`);
    // الرابط المصغّر يرجّع PNG حتى لو الأصل SVG، وحجمه معقول
    console.log(`   ${i.thumburl || i.url}`);
  });
  done = true;
}

if (cmd === 'get') {
  const [work, url, name] = args;
  if (!work || !url || !/^[a-z0-9-]+$/.test(name || '')) {
    console.error('❌ الصيغة: get "<مجلد الشغل>" "<رابط الصورة>" <اسم بحروف انجليزية صغيرة وشرطات>');
    fail(1);
  }
  const KINDS = [
    ['.jpg', (b) => b[0] === 0xff && b[1] === 0xd8],
    ['.png', (b) => b[0] === 0x89 && b.toString('latin1', 1, 4) === 'PNG'],
    ['.webp', (b) => b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP'],
    ['.gif', (b) => b.toString('latin1', 0, 3) === 'GIF'],
    ['.svg', (b) => /<svg[\s>]/i.test(b.toString('utf8', 0, 2000))],
  ];
  let buf = null;
  for (let tries = 0; tries < 3 && !buf; tries++) {
    const res = await fetch(url, {headers: {'User-Agent': UA}, redirect: 'follow'});
    if (res.ok) buf = Buffer.from(await res.arrayBuffer());
    else await new Promise((r) => setTimeout(r, 1500));
  }
  const kind = buf && KINDS.find(([, test]) => test(buf));
  if (!kind) {
    console.error('❌ الرابط ما رجّع صورة. افتحه بالمتصفح وخذ رابط الصورة نفسها مو رابط صفحتها.');
    fail(2);
  }
  if (buf.length > 12 * 1024 * 1024) {
    console.error('❌ الصورة أكبر من 12 ميقا. خذ نسخة أصغر منها.');
    fail(2);
  }
  if (kind[0] === '.svg') {
    // بعض ملفات SVG لها عرض وطول بدون viewBox، فتنقص بدل ما تتمدد
    let svg = buf.toString('utf8');
    const head = /<svg[^>]*>/i.exec(svg)?.[0] || '';
    const w = /\swidth="([\d.]+)/.exec(head)?.[1];
    const h = /\sheight="([\d.]+)/.exec(head)?.[1];
    if (!/viewBox/i.test(head) && w && h) svg = svg.replace(/<svg/i, `<svg viewBox="0 0 ${w} ${h}"`);
    buf = Buffer.from(svg, 'utf8');
  }
  const dir = path.join(path.resolve(work), 'images');
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, name + kind[0]), buf);
  console.log(`✅ images/${name}${kind[0]} · ${Math.round(buf.length / 1024)} ك.ب\nافتح الملف وتأكد بعينك إنه اللي انذكر بالكلام قبل ما تحطه بالخطة.`);
  done = true;
}

if (!done) {
  console.error('الأوامر: search "<كلمات>" [عدد] [--wiki ar|en]  ·  get "<مجلد الشغل>" "<رابط>" <اسم>');
  process.exitCode = 1;
}
} catch (e) {
  if (e.message !== 'stop') throw e;
}
