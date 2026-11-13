// Takes screenshots of the web build at desktop and phone sizes. Usage: npx tsx scripts/shots.ts <url> <outDir>
import puppeteer, { Page } from 'puppeteer-core';

const URL = process.argv[2] || 'http://localhost:5101';
const OUT = process.argv[3] || '.';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function clickText(page: Page, label: string) {
  const ok = await page.evaluate((l) => {
    const els = Array.from(document.querySelectorAll('div,span')) as HTMLElement[];
    const all = els.filter((e) => (e.innerText || '').trim().includes(l));
    if (!all.length) return false;
    all.sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
    all[0].click();
    return true;
  }, label);
  if (!ok) throw new Error('missing ' + label);
}

async function run(name: string, w: number, h: number) {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(400);
  const shot = (n: string) => page.screenshot({ path: `${OUT}/${name}-${n}.png` });
  await shot('1-welcome');
  await clickText(page, 'Play now!');
  await sleep(500);
  await shot('2-home');
  await clickText(page, 'Games');
  await sleep(300);
  await shot('3-games');
  await clickText(page, 'Balloon Pop');
  await sleep(900);
  await shot('4-balloon');
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('div')).find((e) => (e as HTMLElement).innerText?.trim() === '←') as HTMLElement; b?.click(); });
  await sleep(400);
  await clickText(page, 'Games');
  await clickText(page, 'Match It');
  await sleep(900);
  await shot('5-match');
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('div')).find((e) => (e as HTMLElement).innerText?.trim() === '←') as HTMLElement; b?.click(); });
  await sleep(400);
  await clickText(page, 'Rewards');
  await sleep(300);
  await shot('6-rewards');
  await browser.close();
}

(async () => {
  await run('desktop', 1280, 800);
  await run('phone', 390, 800);
  console.log('shots done');
})();
