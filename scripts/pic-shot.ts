// Starts Quick Quizzes until a question with a picture appears, then screenshots it.
// Usage: npx tsx scripts/pic-shot.ts <url> <out.png> <Subject> <Year> <width> <height>
import puppeteer from 'puppeteer-core';
const [, , URL, OUT, SUBJ = 'Science', YEAR = '4', W = '390', H = '800'] = process.argv;
const sl = (ms: number) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.setViewport({ width: Number(W), height: Number(H) });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'networkidle0' });
  const click = (l: string, st = false) => page.evaluate((x, s) => { const els = Array.from(document.querySelectorAll('div,span')) as HTMLElement[]; const a = els.filter((e) => { const t = (e.innerText || '').trim(); return s ? t.startsWith(x) : t === x; }); a.sort((p, q) => (p.innerText || '').length - (q.innerText || '').length); a[0]?.click(); }, l, st);
  await click(`Year ${YEAR}`, true); await sl(200); await click('Play now!', true); await sl(500);
  await click('Games'); await sl(300); await click(SUBJ); await sl(200);
  for (let i = 0; i < 14; i++) {
    await click('Quick Quiz', true); await sl(1600);
    const has = await page.evaluate(() => document.querySelectorAll('svg').length > 0);
    if (has) { await page.screenshot({ path: OUT }); console.log('captured'); break; }
    await page.evaluate(() => { const e = Array.from(document.querySelectorAll('div')).find((x) => (x as HTMLElement).innerText?.trim() === '←') as HTMLElement; e?.click(); });
    await sl(400); await click('Games'); await sl(300);
  }
  await b.close();
})();
