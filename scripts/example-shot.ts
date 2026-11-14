// Plays a Quick Quiz in a subject and screenshots a question with the real-life example open.
// Usage: npx tsx scripts/example-shot.ts <url> <out.png> <Subject> <width>
import puppeteer from 'puppeteer-core';
const [, , URL = 'http://localhost:5140', OUT = 'ex.png', SUBJ = 'Science', W = '390'] = process.argv;
const sl = (ms: number) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.setViewport({ width: Number(W), height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'networkidle0' });
  const click = (l: string, st = false) => page.evaluate((x, s) => { const els = Array.from(document.querySelectorAll('div,span')) as HTMLElement[]; const a = els.filter((e) => { const t = (e.innerText || '').trim(); return s ? t.startsWith(x) : t === x; }); a.sort((p, q) => (p.innerText || '').length - (q.innerText || '').length); a[0]?.click(); }, l, st);
  await click('Play now!', true); await sl(500); await click('Games'); await sl(300); await click(SUBJ); await sl(200); await click('Quick Quiz', true); await sl(1500);
  const box = await page.evaluate(() => { const els = Array.from(document.querySelectorAll('div')) as HTMLElement[]; const a = els.filter((e) => (e.innerText || '').trim() === '💡 Real-life example'); if (!a.length) return null; a.sort((p, q) => (p.innerText || '').length - (q.innerText || '').length); const r = a[a.length - 1].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (!box) { console.log('no example button on this question'); await b.close(); return; }
  await page.mouse.click(box.x, box.y); await sl(700);
  console.log('open:', await page.evaluate(() => document.body.innerText.includes('Hide the example')));
  await page.screenshot({ path: OUT });
  await b.close();
})();
