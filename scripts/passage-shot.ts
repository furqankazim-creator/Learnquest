// Plays English Year 2 Quick Quizzes until a reading-passage question appears, then screenshots it.
// Usage: npx tsx scripts/passage-shot.ts <url> <outDir> <width> <height>
import puppeteer, { Page } from 'puppeteer-core';
import { ENG } from '../src/data/questions';
import { ENG_X } from '../src/data/extras';
import { ENG_Y } from '../src/data/pack2';
import { FIX } from '../src/data/fixes';

const [, , URL = 'http://localhost:5103', OUT = '.', W = '390', H = '900'] = process.argv;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const answers = new Map<string, string>();
[...ENG[2], ...ENG_X[2], ...ENG_Y[2]].forEach((r, i) => { const q = FIX[`E2.${i}`] ?? r; answers.set(q[0], q[1]); });

async function clickText(page: Page, label: string) {
  const ok = await page.evaluate((l) => {
    const els = Array.from(document.querySelectorAll('div,span')) as HTMLElement[];
    const all = els.filter((e) => (e.innerText || '').trim() === l);
    if (!all.length) return false;
    all.sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
    all[0].click();
    return true;
  }, label);
  if (!ok) throw new Error('missing ' + label);
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: Number(W), height: Number(H) });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await page.evaluate(() => { const el = Array.from(document.querySelectorAll('div')).find((e) => (e as HTMLElement).innerText?.trim().startsWith('Play now!')) as HTMLElement; el?.click(); });
  await sleep(500);
  let got = false;
  for (let g = 0; g < 8 && !got; g++) {
    await clickText(page, 'Games'); await sleep(250);
    await page.evaluate(() => { const el = Array.from(document.querySelectorAll('div')).find((e) => (e as HTMLElement).innerText?.trim().startsWith('Quick Quiz')) as HTMLElement; el?.click(); });
    await sleep(600);
    for (let n = 0; n < 6; n++) {
      await sleep(400);
      const t: string = await page.evaluate(() => document.body.innerText);
      const q = [...answers.keys()].find((k) => t.includes(k));
      if (!q) break;
      if (t.includes('Hear the story')) {
        await page.screenshot({ path: `${OUT}/passage-${W}.png` });
        console.log('passage question:', q);
        got = true; break;
      }
      await clickText(page, answers.get(q)!);
      await sleep(3000);
    }
    if (!got) { await page.evaluate(() => { const el = Array.from(document.querySelectorAll('div')).find((e) => (e as HTMLElement).innerText?.trim() === '🏠 Back to islands') as HTMLElement; el?.click(); }); await sleep(400); }
  }
  console.log(got ? 'captured' : 'no passage question appeared in 8 games');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
