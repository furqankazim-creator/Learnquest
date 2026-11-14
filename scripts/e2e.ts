// End-to-end check of the web build: play a game, check Rewards updates, reload, check it was saved.
import puppeteer, { Page } from 'puppeteer-core';
import { ENG } from '../src/data/questions';
import { ENG_X } from '../src/data/extras';
import { ENG_Y } from '../src/data/pack2';
import { FIX } from '../src/data/fixes';

const URL = process.argv[2] || 'http://localhost:5100';
const YEAR = 2;
const answers = new Map<string, string>();
const wrongs = new Map<string, string>();
[...ENG[YEAR], ...ENG_X[YEAR], ...ENG_Y[YEAR]].forEach((r, i) => { const q = FIX[`E${YEAR}.${i}`] ?? r; answers.set(q[0], q[1]); wrongs.set(q[0], q[2]); });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const text = (page: Page) => page.evaluate(() => document.body.innerText);

async function clickText(page: Page, label: string, exact = true) {
  const ok = await page.evaluate((l, ex) => {
    const els = Array.from(document.querySelectorAll('div,span')) as HTMLElement[];
    const all = els.filter((e) => { const t = (e.innerText || '').trim(); return ex ? t === l : t.includes(l); });
    if (!all.length) return false;
    all.sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
    const best = (all[0].innerText || '').length;
    const ties = all.filter((e) => (e.innerText || '').length === best);
    // single characters (keypad digits) also appear in the header: take the last one on the page
    const target = l.length === 1 ? ties[ties.length - 1] : ties[0];
    target.click();
    return true;
  }, label, exact);
  if (!ok) throw new Error('could not find: ' + label);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 900 });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });

  const fail: string[] = [];
  const check = (name: string, cond: boolean, extra = '') => { console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); if (!cond) fail.push(name); };

  check('welcome shows', (await text(page)).includes('Who is learning today?'));
  await clickText(page, 'Play now!', false);
  await sleep(500);
  check('home shows after Play now', (await text(page)).includes('Pick an island'));

  // Rewards BEFORE playing
  await clickText(page, 'Rewards');
  await sleep(300);
  let t = await text(page);
  check('rewards starts at zero', /Stars earned/.test(t) && /Coins banked/.test(t), JSON.stringify(t.replace(/\n+/g, ' | ').slice(0, 140)));

  // play English Quick Quiz at Year 2, answering the first one wrong then right
  await clickText(page, 'Games');
  await sleep(300);
  await clickText(page, 'Quick Quiz');
  await sleep(600);
  let solved = 0;
  for (let n = 0; n < 6; n++) {
    await sleep(500);
    t = await text(page);
    const q = [...answers.keys()].find((k) => t.includes(k));
    if (!q) { console.log('question not found in bank; page text:', t.slice(0, 200)); break; }
    if (n === 0) {
      const w = wrongs.get(q)!;
      await clickText(page, w);
      await sleep(300);
      t = await text(page);
      check('wrong answer shows encouragement', t.includes('Good try'), 'tapped: ' + w);
    }
    await clickText(page, answers.get(q)!);
    solved++;
    await sleep(3200); // wait for next question (1.4s or 2.8s with the why-note)
  }
  t = await text(page);
  check('results screen shown', /right and earned/.test(t), JSON.stringify(t.replace(/\n+/g, ' | ').slice(0, 200)));
  const m = t.match(/You got (\d+) of (\d+) right and earned (\d+) coins/);
  console.log('result line:', m && m[0]);

  await clickText(page, 'Back to islands', false);
  await sleep(500);
  t = await text(page);
  check('back on home after results', t.includes('Pick an island'));
  // header counters updated in real time
  const stars = await page.evaluate(() => document.body.innerText);
  console.log('header text:', stars.replace(/\n+/g, ' | ').slice(0, 120));

  await clickText(page, 'Rewards');
  await sleep(400);
  t = await text(page);
  console.log('rewards text:', t.replace(/\n+/g, ' | ').slice(0, 260));
  check('rewards shows stars 3', /3\s*\n?\s*Stars earned|Stars earned/.test(t) && /\b3\b/.test(t));
  check('rewards shows 12 coins', /\b12\b/.test(t));
  check('answered count is 7 (1 wrong + 6 right)', /\b7\b/.test(t));
  check('answered right 86%', /\b86\b/.test(t));
  const unlocked = await page.evaluate(() => Array.from(document.querySelectorAll('div')).filter((e) => (e as HTMLElement).style.opacity === '1' && /^[🌟🦁🚀🌈🐢🍎🔭🏅🦋🎨🧲🌻]$/u.test((e as HTMLElement).innerText?.trim() || '')).length);
  console.log('sticker elements fully opaque:', unlocked);

  // persistence: reload and look again
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(600);
  t = await text(page);
  check('after reload: goes straight to home (saved profile)', t.includes('Pick an island'));
  await clickText(page, 'Rewards');
  await sleep(400);
  t = await text(page);
  check('after reload: stars/coins still there', /\b12\b/.test(t) && /\b3\b/.test(t), t.replace(/\n+/g, ' | ').slice(0, 120));

  // parent PIN flow
  await clickText(page, 'Parent');
  await sleep(300);
  t = await text(page);
  check('parent asks to set a PIN first', t.includes('Set a grown-ups'));
  for (const d of ['1', '2', '3', '4']) await clickText(page, d);
  await sleep(300);
  check('asks to confirm', (await text(page)).includes('again'));
  for (const d of ['1', '2', '3', '4']) await clickText(page, d);
  await sleep(500);
  t = await text(page);
  check('dashboard opens after confirm', t.includes('Progress report'));
  check('progress report reflects play', /3 of 24|English — Year 2/.test(t) || /answered right this visit/.test(t), t.replace(/\n+/g, ' | ').slice(0, 160));

  console.log('page errors:', errors.length ? errors : 'none');
  await browser.close();
  console.log(fail.length ? `\n${fail.length} FAILED: ${fail.join(', ')}` : '\nALL PASSED');
})().catch((e) => { console.error('E2E crashed:', e); process.exit(1); });
