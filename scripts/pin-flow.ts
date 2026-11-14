// Repeats the "forgot PIN" flow several times with fresh state to see whether it is reliable.
import puppeteer, { Page } from 'puppeteer-core';
const URL = process.argv[2] || 'http://localhost:5221';
const sl = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function tap(page: Page, label: string, o: { starts?: boolean; minTop?: number; last?: boolean } = {}) {
  const box = await page.evaluate((l, opt) => { const els = Array.from(document.querySelectorAll('div')) as HTMLElement[]; let a = els.filter((e) => { const t = (e.innerText || '').trim(); return opt.starts ? t.startsWith(l) : t === l; }); if (opt.minTop) a = a.filter((e) => e.getBoundingClientRect().top > opt.minTop!); a.sort((x, y) => x.innerText.length - y.innerText.length); if (!a.length) return null; const best = a[0].innerText.length; const ties = a.filter((e) => e.innerText.length === best); const el = opt.last ? ties[ties.length - 1] : ties[0]; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, label, o);
  if (!box) throw new Error('cannot find: ' + label);
  await page.mouse.click(box.x, box.y); await sl(350);
}
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  let ok = 0;
  for (let run = 1; run <= 6; run++) {
    const page = await b.newPage(); await page.setViewport({ width: 390, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' }); await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'networkidle0' }); await sl(400);
    const body = () => page.evaluate(() => document.body.innerText);
    await tap(page, 'Play now!', { starts: true }); await sl(300); await tap(page, 'Parent'); await sl(300);
    for (const d of '12341234') await tap(page, d, { minTop: 200, last: true });
    await sl(400); await tap(page, 'Home'); await tap(page, 'Parent'); await sl(300);
    await tap(page, 'Forgot the PIN?', { starts: true }); await sl(300);
    const t = await body(); const m = t.match(/what is (\d+) × (\d+)\?/);
    if (!m) { console.log(`run ${run}: no maths question found`); await page.close(); continue; }
    const prod = String(+m[1] * +m[2]);
    for (const d of prod) await tap(page, d, { minTop: 200, last: true });
    const typed = await body();
    await tap(page, '✔'); await sl(500);
    const after = await body();
    const good = after.includes('Set a grown-ups’ PIN');
    console.log(`run ${run}: ${m[1]} × ${m[2]} = ${prod}  →  ${good ? 'OK' : 'FAILED'}${good ? '' : '   page now says: ' + JSON.stringify(after.replace(/\n+/g, ' | ').slice(60, 260)) + ' | typed-state: ' + JSON.stringify(typed.replace(/\n+/g, ' | ').slice(60, 200))}`);
    if (good) ok++;
    await page.close();
  }
  console.log(`${ok}/6 OK`);
  await b.close();
})();
