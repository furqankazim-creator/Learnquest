// Starts a Maths Quick Quiz and screenshots the first question (shows the picture panel in the real game).
import puppeteer from 'puppeteer-core';
const [, , URL = 'http://localhost:5120', OUT = 'maths.png', W = '390'] = process.argv;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.setViewport({ width: Number(W), height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  const click = (label: string, starts = false) => page.evaluate((l, st) => {
    const els = Array.from(document.querySelectorAll('div,span')) as HTMLElement[];
    const all = els.filter((e) => { const t = (e.innerText || '').trim(); return st ? t.startsWith(l) : t === l; });
    all.sort((a, c) => (a.innerText || '').length - (c.innerText || '').length);
    all[0]?.click();
  }, label, starts);
  await click('Play now!', true); await sleep(500);
  await click('Games'); await sleep(300);
  await click('Maths'); await sleep(200);
  for (let i = 0; i < 12; i++) {
    await click('Rescue Quiz', true); await sleep(1800);
    const has = await page.evaluate(() => document.querySelectorAll('svg').length > 0);
    if (has) break;
    await page.evaluate(() => { const b = Array.from(document.querySelectorAll('div')).find((e) => (e as HTMLElement).innerText?.trim() === '←') as HTMLElement; b?.click(); });
    await sleep(400); await click('Games'); await sleep(300);
  }
  await click('💡 Real-life example'); await sleep(600);
  await page.screenshot({ path: OUT });
  await b.close();
})();
