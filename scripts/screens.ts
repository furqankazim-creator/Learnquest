// Captures every screen of the app (phone + desktop, light + dark) for a visual review.
// Usage: npx tsx scripts/screens.ts <url> <outDir>
import puppeteer, { Page } from 'puppeteer-core';
const [, , URL = 'http://localhost:5200', OUT = '.'] = process.argv;
const sl = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function tap(page: Page, label: string, starts = false) {
  const box = await page.evaluate((l, st) => {
    const els = Array.from(document.querySelectorAll('div')) as HTMLElement[];
    const a = els.filter((e) => { const t = (e.innerText || '').trim(); return st ? t.startsWith(l) : t === l; }).sort((x, y) => x.innerText.length - y.innerText.length);
    if (!a.length) return null; a[0].scrollIntoView({ block: 'center' }); const r = a[0].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, label, starts);
  if (!box) throw new Error('cannot find ' + label);
  await page.mouse.click(box.x, box.y); await sl(450);
}
async function run(name: string, w: number, h: number) {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.setViewport({ width: w, height: Number(process.env.VH || h) });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'networkidle0' }); await sl(500);
  const shot = (n: string) => page.screenshot({ path: `${OUT}/${name}-${n}.png` });
  await shot('01-welcome');
  await tap(page, 'Play now!', true); await shot('02-home');
  await tap(page, 'Games'); await shot('03-games');
  await tap(page, 'Rewards'); await shot('04-rewards');
  await tap(page, 'Parent'); await shot('05-pin-setup');
  for (const d of ['1', '2', '3', '4', '1', '2', '3', '4']) { const box = await page.evaluate((l) => { const e = (Array.from(document.querySelectorAll('div')) as HTMLElement[]).filter((x) => (x.innerText || '').trim() === l && x.getBoundingClientRect().top > 150).sort((a, c) => a.innerText.length - c.innerText.length)[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, d); if (box) { await page.mouse.click(box.x, box.y); await sl(250); } }
  await sl(500); await shot('06-parent-dashboard');
  // settings (gear is the 52px round button near the top right)
  const gear = await page.evaluate(() => { const e = (Array.from(document.querySelectorAll('div')) as HTMLElement[]).filter((x) => (x.innerText || '').trim() === '⚙️' && x.getBoundingClientRect().top < 120)[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (gear) { await page.mouse.click(gear.x, gear.y); await sl(500); await shot('07-settings'); await tap(page, 'Dark'); await sl(300); await shot('08-settings-dark'); }
  await tap(page, 'Home'); await shot('09-home-dark');
  await tap(page, 'Games'); await tap(page, 'Match It', true); await sl(1200); await shot('10-match-dark');
  await b.close();
}
(async () => { await run('phone', 390, 1500); await run('desktop', 1280, 900); console.log('done'); })().catch((e) => { console.error(e); process.exit(1); });
