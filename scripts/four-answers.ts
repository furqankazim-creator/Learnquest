// Plays a Balloon Pop / Quick Quiz and checks that EVERY question shows four visible answers.
import puppeteer, { Page } from 'puppeteer-core';
import { ENG, SCI } from '../src/data/questions';
import { ENG_X, SCI_X } from '../src/data/extras';
import { ENG_Y, SCI_Y } from '../src/data/pack2';
import { FIX } from '../src/data/fixes';
const [, , URL = 'http://localhost:5150', GAME = 'Balloon Pop', SUBJ = 'English'] = process.argv;
const YEAR = Number(process.env.YEAR || 2);
const sl = (ms: number) => new Promise((r) => setTimeout(r, ms));
const bank = new Map<string, string[]>();
const isS = SUBJ === 'Science';
(isS ? [...SCI[YEAR], ...SCI_X[YEAR], ...SCI_Y[YEAR]] : [...ENG[YEAR], ...ENG_X[YEAR], ...ENG_Y[YEAR]]).forEach((r, i) => { const q = FIX[`${isS ? 'S' : 'E'}${YEAR}.${i}`] ?? r; bank.set(q[0], [q[1], q[2], q[3], q[4]]); });

async function visibleOptions(page: Page, opts: string[], minOpacity = 0.6) {
  return page.evaluate((list, minO) => list.filter((label) => {
    const els = Array.from(document.querySelectorAll('div')) as HTMLElement[];
    const el = els.filter((e) => (e.innerText || '').trim() === label).sort((a, b) => a.innerText.length - b.innerText.length)[0];
    if (!el) return false;
    let o = 1; let n: HTMLElement | null = el;
    while (n) { o *= Number(getComputedStyle(n).opacity); n = n.parentElement; }
    const r = el.getBoundingClientRect();
    return o > minO && r.top >= 0 && r.bottom <= window.innerHeight;
  }), opts, minOpacity);
}

(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.setViewport({ width: Number(process.env.VW || 390), height: Number(process.env.VH || 760) });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'networkidle0' });
  const click = (l: string, st = false) => page.evaluate((x, s) => { const els = Array.from(document.querySelectorAll('div,span')) as HTMLElement[]; const a = els.filter((e) => { const t = (e.innerText || '').trim(); return s ? t.startsWith(x) : t === x; }); a.sort((p, q) => (p.innerText || '').length - (q.innerText || '').length); a[0]?.click(); }, l, st);
  const tap = async (label: string) => {
    const box = await page.evaluate((l) => { const els = Array.from(document.querySelectorAll('div')) as HTMLElement[]; const a = els.filter((e) => (e.innerText || '').trim() === l).sort((x, y) => x.innerText.length - y.innerText.length); if (!a.length) return null; const r = a[0].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, label);
    if (box) await page.mouse.click(box.x, box.y);
  };
  await click(`Year ${YEAR}`, true); await sl(200);
  await click('Play now!', true); await sl(500); await click('Games'); await sl(300); await click(SUBJ); await sl(200); await click(GAME, true); await sl(1200);
  let allGood = true;
  for (let n = 0; n < 6; n++) {
    await sl(700);
    const t: string = await page.evaluate(() => document.body.innerText);
    const q = [...bank.keys()].find((k) => t.includes(k));
    if (!q) { console.log('question not found'); break; }
    const [right, w1] = bank.get(q)!;
    if (t.includes('🔊 Story')) { console.log(`Q${n + 1}: reading passage (scrolls by design) – skipped`); await tap(right); await sl(3300); continue; }
    const all = bank.get(q)!;
    const vis = await visibleOptions(page, all);
    console.log(`Q${n + 1}: ${vis.length}/4 answers visible`, vis.length === 4 ? 'OK' : '<-- PROBLEM');
    if (vis.length !== 4) { allGood = false; if (process.env.FAILSHOT) await page.screenshot({ path: process.env.FAILSHOT }); console.log('   question:', q); }
    if (n % 2 === 0) { await tap(w1); await sl(500); const v2 = await visibleOptions(page, all, 0.3); const fbOk = await page.evaluate(() => { const e = Array.from(document.querySelectorAll('div')).filter((x) => (x as HTMLElement).innerText?.includes('Good try')).sort((a, b) => a.innerText.length - b.innerText.length)[0] as HTMLElement | undefined; if (!e) return false; const r = e.getBoundingClientRect(); return r.bottom <= window.innerHeight; }); console.log(`   after a wrong tap: ${v2.length}/4 answers still visible, message on screen: ${fbOk}`); if (v2.length !== 4 || !fbOk) allGood = false; }
    await tap(right); await sl(3300);
  }
  console.log(allGood ? 'ALL QUESTIONS SHOWED 4 ANSWERS' : 'BUG: some question showed fewer than 4');
  await b.close();
})();
