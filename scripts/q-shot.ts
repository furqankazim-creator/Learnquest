// Screenshot of the first question of a Quick Quiz. Usage: npx tsx scripts/q-shot.ts <url> <out.png> <Subject> <Year> <w> <h> [Game]
import puppeteer from 'puppeteer-core';
const [, , URL, OUT, SUBJ = 'Science', YEAR = '1', W = '390', H = '800', GAME = 'Quick Quiz'] = process.argv;
const sl = (ms: number) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.setViewport({ width: Number(W), height: Number(H) });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'networkidle0' });
  const click = (l: string, st = false) => page.evaluate((x, s) => { const els = Array.from(document.querySelectorAll('div,span')) as HTMLElement[]; const a = els.filter((e) => { const t = (e.innerText || '').trim(); return s ? t.startsWith(x) : t === x; }); a.sort((p, q) => (p.innerText || '').length - (q.innerText || '').length); a[0]?.click(); }, l, st);
  await click(`Year ${YEAR}`, true); await sl(200); await click('Play now!', true); await sl(500);
  await click('Games'); await sl(300); await click(SUBJ); await sl(200); await click(GAME, true); await sl(1800);
  // open the real-life example with a real click, if present
  const box = await page.evaluate(() => { const els = Array.from(document.querySelectorAll('div')) as HTMLElement[]; const a = els.filter((e) => ['💡 Example', '💡 Real-life example'].includes((e.innerText || '').trim())).sort((x, y) => x.innerText.length - y.innerText.length); if (!a.length) return null; const r = a[a.length - 1].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (box && process.env.OPEN === '1') { await page.mouse.click(box.x, box.y); await sl(600); }
  await page.screenshot({ path: OUT });
  await b.close();
})();
