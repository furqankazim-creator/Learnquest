// Takes a few tall screenshots of a gallery page. Usage: npx tsx scripts/gallery-full.ts <url> <prefix> <parts>
import puppeteer from 'puppeteer-core';
const [, , URL, PREFIX, PARTS = '3'] = process.argv;
const sl = (ms: number) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.setViewport({ width: 1240, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await sl(2500);
  const total: number = await page.evaluate(() => Math.max(...Array.from(document.querySelectorAll('div')).map((d) => (d as HTMLElement).scrollHeight)));
  const n = Number(PARTS);
  for (let i = 0; i < n; i++) {
    await page.evaluate((frac, tot) => { document.querySelectorAll('div').forEach((d) => { const e = d as HTMLElement; if (e.scrollHeight > e.clientHeight + 50) e.scrollTop = (e.scrollHeight - e.clientHeight) * frac; }); }, n === 1 ? 0 : i / (n - 1), total);
    await sl(1200);
    await page.screenshot({ path: `${PREFIX}-${i + 1}.png` });
  }
  await b.close();
})();
