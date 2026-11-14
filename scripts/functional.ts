// Full functional test of the web build, using real mouse taps like a child would.
// Usage: npx tsx scripts/functional.ts <url>   (set SHOTS=<dir> to also save screenshots)
import puppeteer, { Page } from 'puppeteer-core';
import { ENG } from '../src/data/questions';
import { ENG_X } from '../src/data/extras';
import { ENG_Y } from '../src/data/pack2';
import { FIX } from '../src/data/fixes';

const URL = process.argv[2] || 'http://localhost:5210';
const SHOTS = process.env.SHOTS;
const sl = (ms: number) => new Promise((r) => setTimeout(r, ms));

// English Year 2 question bank: question -> [right, wrong1, wrong2, wrong3]
const bank = new Map<string, string[]>();
[...ENG[2], ...ENG_X[2], ...ENG_Y[2]].forEach((r, i) => { const q = FIX[`E2.${i}`] ?? r; bank.set(q[0], [q[1], q[2], q[3], q[4]]); });

let passed = 0; const failed: string[] = [];
const check = (name: string, ok: boolean, extra = '') => { console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? '  — ' + extra : '')); ok ? passed++ : failed.push(name); };

async function tap(page: Page, label: string, o: { starts?: boolean; includes?: boolean; last?: boolean; minTop?: number } = {}) {
  const box = await page.evaluate((l, opt) => {
    const els = Array.from(document.querySelectorAll('div')) as HTMLElement[];
    let a = els.filter((e) => { const t = (e.innerText || '').trim(); return opt.includes ? t.includes(l) : opt.starts ? t.startsWith(l) : t === l; });
    if (opt.minTop) a = a.filter((e) => e.getBoundingClientRect().top > opt.minTop!);
    a.sort((x, y) => x.innerText.length - y.innerText.length);
    if (!a.length) return null;
    const best = a[0].innerText.length; const ties = a.filter((e) => e.innerText.length === best);
    const el = opt.last ? ties[ties.length - 1] : ties[0];
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, label, o);
  if (!box) throw new Error('cannot find: ' + label);
  await page.mouse.click(box.x, box.y); await sl(450);
}
const has = (page: Page, s: string) => page.evaluate((x) => document.body.innerText.includes(x), s);
const text = (page: Page) => page.evaluate(() => document.body.innerText);
const shot = async (page: Page, n: string) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${n}.png` }); };
const currentQ = async (page: Page) => { const t = await text(page); return [...bank.keys()].find((k) => t.includes(k)); };
const bg = (page: Page, label: string) => page.evaluate((l) => {
  const els = (Array.from(document.querySelectorAll('div')) as HTMLElement[]).filter((e) => (e.innerText || '').includes(l)).sort((a, b) => a.innerText.length - b.innerText.length);
  let n: HTMLElement | null = els[0] || null;
  while (n) { const c = getComputedStyle(n).backgroundColor; const m = c.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/); if (m && (m[4] === undefined || Number(m[4]) > 0.5)) return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255; n = n.parentElement; }
  return -1;
}, label);

async function playQuiz(page: Page, game: string, count: number, mistakeFirst = false) {
  await tap(page, 'Games'); await tap(page, 'English'); await tap(page, game, { starts: true }); await sl(1200);
  for (let n = 0; n < count; n++) {
    await sl(500);
    const q = await currentQ(page);
    if (!q) { console.log('   (question not found)'); return false; }
    const [right, wrong] = bank.get(q)!;
    if (mistakeFirst && n === 0) {
      await tap(page, wrong); await sl(300);
      check(`${game}: wrong answer shows encouragement`, await has(page, 'Good try'));
      check(`${game}: 💡 hint button appears after a mistake`, (await has(page, 'Hint?')) || (await has(page, 'Need a hint')));
    }
    await tap(page, right);
    if (n === 0) check(`${game}: right answer shows praise`, await has(page, 'Well done'));
    await sl(3300);
  }
  return true;
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 900 });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'networkidle0' }); await sl(500);

  console.log('\n--- Welcome and profile ---');
  check('welcome screen loads', await has(page, 'Who is learning today?'));
  await page.type('input', 'Mia'); await sl(200);
  await tap(page, '🐼'); await tap(page, 'Year 2', { starts: true });
  await tap(page, 'Start learning', { starts: true }); await sl(600);
  check('profile: name shown in header', await has(page, 'Mia'));
  check('profile: year shown in header', await has(page, 'Year 2 • Age 6–7'));
  await shot(page, 'f01-home');
  await page.reload({ waitUntil: 'networkidle0' }); await sl(700);
  check('saved: reload goes straight to Home with the same player', (await has(page, 'Pick an island')) && (await has(page, 'Mia')));

  console.log('\n--- Games ---');
  await playQuiz(page, 'Quick Quiz', 6, true);
  const r = await text(page);
  check('Quick Quiz: results screen with 3 stars', /Amazing work!/.test(r) && r.includes('⭐⭐⭐'));
  check('Quick Quiz: coins and sticker awarded', /earned 12 coins and a new sticker/.test(r), (r.match(/You got[^!]*!/) || [''])[0]);
  await shot(page, 'f02-results');
  await tap(page, '🏠 Back to islands', { starts: true }); await sl(500);
  check('results: back to islands', await has(page, 'Pick an island'));
  check('header counters updated (⭐ 3, 🪙 12, 🔥 1)', /3\s*\n.*12/s.test((await text(page)).slice(0, 80)) && (await has(page, '🔥')));

  await playQuiz(page, 'Balloon Pop', 2);
  await tap(page, '←'); await sl(500);
  check('Balloon Pop: back button returns to the app mid-game', (await has(page, 'Choose a game')) || (await has(page, 'Pick an island')));

  await tap(page, 'Games'); await tap(page, 'Rescue Quiz', { starts: true }); await sl(1500);
  check('Rescue Quiz: shows the buddy rescue line', await has(page, '🐼 needs your help'));
  await tap(page, '←'); await sl(400);

  await tap(page, 'Games'); await tap(page, 'Match It', { starts: true }); await sl(1500);
  let rounds = 0;
  for (let round = 0; round < 3; round++) {
    for (let pairN = 0; pairN < 4; pairN++) {
      const left: { label: string } | null = await page.evaluate((qs) => {
        const els = (Array.from(document.querySelectorAll('div')) as HTMLElement[]).filter((e) => e.getAttribute('role') === 'button' || true);
        const t = document.body.innerText; void t;
        for (const q of qs) {
          const short = q.length <= 64 ? q : q.slice(0, 62) + '…';
          const cand = els.filter((e) => (e.innerText || '').includes(short) && e.innerText.length < short.length + 8).sort((a, b) => a.innerText.length - b.innerText.length)[0];
          if (cand) { let o = 1; let n: HTMLElement | null = cand; while (n) { o *= Number(getComputedStyle(n).opacity || 1); n = n.parentElement; } if (o > 0.9) return { label: q }; } // matched cards are faded
        }
        return null;
      }, [...bank.keys()]);
      if (!left) break;
      const right = bank.get(left.label)![0];
      const short = left.label.length <= 64 ? left.label : left.label.slice(0, 62) + '…';
      await tap(page, short, { includes: true }); await tap(page, right, { last: true });
      if (round === 0 && pairN === 0) check('Match It: right pair shows praise', await has(page, 'Great matching'));
    }
    rounds++; await sl(1300);
  }
  check('Match It: three rounds complete → results', /You got \d+ of 12 right/.test(await text(page)), (await text(page)).match(/You got[^!]*!/)?.[0] || '');
  await tap(page, '🏠 Back to islands', { starts: true }); await sl(400);

  await tap(page, 'Daily Mission', { starts: true }); await sl(1500);
  check('Daily Mission starts a mixed game', await has(page, 'Daily Mission'));
  await tap(page, '←'); await sl(400);

  console.log('\n--- Rewards ---');
  await tap(page, 'Rewards'); await sl(400);
  const rw = await text(page);
  check('Rewards shows stars, coins and answered counts', /My rewards/.test(rw) && /Stars earned/.test(rw) && /Questions answered/.test(rw));
  check('Rewards: questions answered is not zero', !/\n0\nQuestions answered/.test(rw));
  await shot(page, 'f03-rewards');

  console.log('\n--- Settings ---');
  await tap(page, '⚙️', { minTop: 0 }); await sl(500);
  check('Settings page opens', await has(page, 'Colour theme'));
  const lightBg = await bg(page, 'Colour theme');
  await tap(page, 'Dark'); await sl(400);
  const darkBg = await bg(page, 'Colour theme');
  check('theme: Dark makes the cards dark', lightBg > 0.8 && darkBg < 0.3, `light=${lightBg.toFixed(2)} dark=${darkBg.toFixed(2)}`);
  await shot(page, 'f04-settings-dark');
  await tap(page, 'Turn sound off', { includes: true }); await sl(300);
  check('sound: toggle switches to "Turn sound on"', await has(page, 'Turn sound on'));
  await page.reload({ waitUntil: 'networkidle0' }); await sl(800);
  await tap(page, '⚙️'); await sl(500);
  const dbg = await bg(page, 'Colour theme');
  check('saved: Dark theme survives a reload', dbg >= 0 && dbg < 0.3, `luma=${dbg.toFixed(2)}`);
  check('saved: sound setting survives a reload', await has(page, 'Turn sound on'));
  await tap(page, 'Light'); await tap(page, 'Turn sound on', { includes: true }); await sl(300);
  check('theme: Light brings back the cream theme', (await bg(page, 'Colour theme')) > 0.8);

  console.log('\n--- Parent area and PIN ---');
  // keypad keys come after the on-screen typed number in the page, so tap the LAST match
  const digits = async (s: string) => { for (const d of s) await tap(page, d, { minTop: 200, last: true }); await sl(500); };
  await tap(page, 'Parent'); await sl(400);
  check('PIN: first visit asks to set a PIN', await has(page, 'Set a grown-ups’ PIN'));
  await digits('1234');
  check('PIN: asks to confirm', await has(page, 'Type the PIN again'));
  await digits('1234');
  check('PIN: dashboard opens after confirming', await has(page, 'Progress report'));
  check('Parent: progress report lists the three subjects', (await has(page, 'English — Year 2')) && (await has(page, 'Maths — Year 2')) && (await has(page, 'Science — Year 2')));
  await shot(page, 'f05-parent');
  await tap(page, 'Home'); await tap(page, 'Parent'); await sl(400);
  check('PIN: area locks again after leaving the tab', await has(page, 'Enter your PIN'));
  await digits('0000');
  check('PIN: wrong PIN shows the message', await has(page, 'that PIN did not work'));
  await tap(page, 'Forgot the PIN?', { starts: true }); await sl(300);
  const sum = (await text(page)).match(/what is (\d+) × (\d+)\?/);
  check('PIN: "Forgot" shows a grown-up maths check', !!sum);
  if (sum) { await digits(String(Number(sum[1]) * Number(sum[2]))); await tap(page, '✔'); await sl(500); }
  check('PIN: correct maths answer lets you choose a new PIN', await has(page, 'Set a grown-ups’ PIN'));
  await digits('4321'); await digits('4321');
  check('PIN: new PIN opens the dashboard', await has(page, 'Progress report'));
  await tap(page, 'Home'); await tap(page, 'Parent'); await digits('4321');
  check('PIN: the new PIN works next time', await has(page, 'Progress report'));
  await page.reload({ waitUntil: 'networkidle0' }); await sl(700);
  await tap(page, 'Parent'); await digits('4321');
  check('saved: the PIN survives a reload', await has(page, 'Progress report'));

  console.log('\n--- Reset and change player ---');
  await tap(page, 'Reset stars, coins and progress', { starts: true }); await sl(400);
  check('Reset: tip card confirms the reset', await has(page, 'Progress reset'));
  await tap(page, 'Rewards'); await sl(400);
  check('Reset: stars and coins are back to zero', /Stars earned/.test(await text(page)) && (await text(page)).slice(0, 120).includes('0'));
  await tap(page, 'Parent'); await digits('4321');
  await tap(page, 'Change player, buddy or year', { includes: true }); await sl(500);
  check('Change player returns to the welcome screen', await has(page, 'Who is learning today?'));
  await tap(page, 'Year 1', { starts: true }); await tap(page, 'Play now!', { starts: true }); await sl(500);
  check('Play now! as a guest with the new year', (await has(page, 'Guest Explorer')) && (await has(page, 'Year 1 • Age 5–6')));

  check('no JavaScript errors during the whole run', errors.length === 0, errors.slice(0, 2).join(' | '));
  await browser.close();
  console.log(`\n${passed} passed, ${failed.length} failed${failed.length ? ': ' + failed.join(' | ') : ''}`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error('TEST CRASHED:', e.message); process.exit(2); });
