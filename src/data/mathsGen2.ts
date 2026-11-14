// Second Maths pack: word problems, measures, geometry, data, probability and algebra,
// following the Cambridge Primary strands (Number, Geometry & Measure, Statistics & Probability,
// problem solving). Original questions; fresh numbers every game. 12 per year.
import type { RawQ } from './questions';
import { num, pick, rnd, txt, wrongNums } from './mathsGen';

const pad = (n: number) => String(n).padStart(2, '0');
const commas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const pounds = (pence: number) => (pence >= 100 ? `£${(pence / 100).toFixed(2)}` : `${pence}p`);
const t12 = (mins: number) => {
  const m = ((mins % 720) + 720) % 720;
  const h = Math.floor(m / 60) || 12;
  return `${h}:${pad(m % 60)}`;
};
const fmtDur = (m: number) => `${Math.floor(m / 60)} h ${m % 60} min`;

// first 3 distinct candidates that differ from the answer, topping up if needed
function distinct(ans: string, cands: string[], fallback: () => string): string[] {
  const out: string[] = [];
  for (const c of cands) if (c !== ans && !out.includes(c)) out.push(c);
  let guard = 0;
  while (out.length < 3 && guard++ < 50) { const f = fallback(); if (f !== ans && !out.includes(f)) out.push(f); }
  return out.slice(0, 3);
}
const toRoman = (n: number) => {
  const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let r = '';
  for (const [v, s] of map) while (n >= v) { r += s; n -= v; }
  return r;
};
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const gens2: Record<number, (() => RawQ)[]> = {
  1: [
    () => { const a = rnd(4, 10), b = rnd(3, 9); return num(`Sam has ${a} apples. He is given ${b} more. How many apples does Sam have now?`, a + b, '🍎', `${a} + ${b} = ${a + b}.`); },
    () => { const a = rnd(10, 18), b = rnd(3, 8); return num(`There are ${a} birds in a tree. ${b} fly away. How many birds are left?`, a - b, '🐦', `${a} − ${b} = ${a - b}.`); },
    () => { const b = rnd(2, 8), c = rnd(b + 2, 15); return num(`? + ${b} = ${c}. What is the missing number?`, c - b, '❓', `${c} − ${b} = ${c - b}.`); },
    () => { const k = rnd(1, 9); return num(`What number is 1 ten and ${k} ones?`, 10 + k, '🔟', `10 + ${k} = ${10 + k}.`); },
    () => {
      const set = new Set<number>(); while (set.size < 4) set.add(rnd(1, 20));
      const arr = [...set]; const m = Math.min(...arr);
      return txt('Which number is the smallest?', String(m), arr.filter((x) => x !== m).map(String), '🔢', `${m} is the smallest.`);
    },
    () => {
      const s = pick([
        { q: 'Which is the longest?', a: 'a bus', w: ['a pencil', 'a spoon', 'a coin'], e: '🚌' },
        { q: 'Which is the heaviest?', a: 'an elephant', w: ['a mouse', 'a cat', 'a duck'], e: '🐘' },
        { q: 'Which is the shortest?', a: 'a worm', w: ['a tree', 'a giraffe', 'a bus'], e: '🪱' },
      ]);
      return txt(s.q, s.a, s.w, s.e, 'Think about the real size of each thing.');
    },
    () => { const a = rnd(2, 9); return num(`A sweet costs ${a}p. You pay with a 10p coin. How much change do you get?`, 10 - a, '🪙', `10 − ${a} = ${10 - a}.`); },
    () => { const i = rnd(0, 5); const next = DAYS[i + 1]; return txt(`What day comes after ${DAYS[i]}?`, next, distinct(next, [DAYS[i], DAYS[(i + 2) % 7], DAYS[(i + 3) % 7]], () => DAYS[rnd(0, 6)]), '📅', `After ${DAYS[i]} comes ${next}.`); },
    () => { const s = pick([5, 10]); return num(`Count in ${s}s: ${s}, ${s * 2}, ${s * 3}, ?`, s * 4, '🖐️', `Add ${s} each time.`); },
    () => txt('Which shape has 4 equal sides and 4 corners?', 'square', ['triangle', 'circle', 'rectangle'], '🟦', 'A square has 4 sides that are all the same length.'),
    () => { const a = rnd(2, 10) * 2; return num(`${a} sweets are shared equally between 2 children. How many sweets does each child get?`, a / 2, '🍬', `Half of ${a} is ${a / 2}.`); },
    () => { const n = rnd(3, 17); return num(`What number is 2 more than ${n}?`, n + 2, '➕', `${n} → ${n + 1} → ${n + 2}.`); },
  ],
  2: [
    () => { const a = rnd(40, 90), b = rnd(11, 39); return num(`A shop had ${a} books. It sold ${b}. How many books are left?`, a - b, '📚', `${a} − ${b} = ${a - b}.`); },
    () => { const g = pick([2, 5, 10]), k = rnd(3, 9); return num(`Each bag holds ${g} apples. How many apples are in ${k} bags?`, g * k, '🛍️', `${k} groups of ${g} = ${g * k}.`); },
    () => { const d = pick([2, 5, 10]), q = rnd(3, 9); return num(`${d * q} stickers are shared equally between ${d} children. How many does each child get?`, q, '⭐', `${d * q} ÷ ${d} = ${q}.`); },
    () => { const t = rnd(2, 9), o = rnd(1, 9); return num(`What number is ${t} tens and ${o} ones?`, t * 10 + o, '🔟', `${t} tens = ${t * 10}, plus ${o} = ${t * 10 + o}.`); },
    () => {
      const set = new Set<number>(); while (set.size < 4) set.add(rnd(21, 99));
      const arr = [...set]; const big = Math.random() < 0.5; const ans = big ? Math.max(...arr) : Math.min(...arr);
      return txt(`Which number is the ${big ? 'biggest' : 'smallest'}?`, String(ans), arr.filter((x) => x !== ans).map(String), '🔢', 'Compare the tens first, then the ones.');
    },
    () => { const a = pick([10, 20, 30]), b = pick([5, 10, 15, 20]); return txt(`A pencil costs ${a}p and a rubber costs ${b}p. How much for both?`, pounds(a + b), distinct(pounds(a + b), [pounds(a + b + 5), pounds(a + b - 5), pounds(a + b + 10)], () => pounds(a + b + 15)), '🪙', `${a}p + ${b}p = ${a + b}p.`); },
    () => { const h = rnd(1, 9), d = rnd(1, 3); const end = ((h + d - 1) % 12) + 1; return txt(`A film starts at ${h} o'clock and lasts ${d} hour${d > 1 ? 's' : ''}. What time does it finish?`, `${end} o'clock`, distinct(`${end} o'clock`, [`${end + 1} o'clock`, `${h} o'clock`, `${Math.max(1, end - 1)} o'clock`], () => `${rnd(1, 12)} o'clock`), '🎬', `${h} + ${d} = ${end}.`); },
    () => { const a = rnd(40, 90), b = rnd(10, a - 10); return num(`A red ribbon is ${a} cm long. A blue ribbon is ${b} cm long. How much longer is the red ribbon?`, a - b, '🎀', `${a} − ${b} = ${a - b} cm.`); },
    () => { const [k, n] = pick([[1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]); const a = `${k}/${n}`; return txt(`A shape is split into ${n} equal parts. ${k} part${k > 1 ? 's are' : ' is'} shaded. What fraction is shaded?`, a, distinct(a, [`${n - k}/${n}`, `${n}/${k}`, `${k}/${n + 1}`], () => `${rnd(1, 3)}/${rnd(4, 9)}`), '🍕', `${k} out of ${n} equal parts is ${a}.`); },
    () => { const v = pick([2, 5, 10]), k = rnd(3, 8); return num(`In a pictogram, each star ⭐ stands for ${v} children. There are ${k} stars. How many children is that?`, v * k, '📊', `${k} × ${v} = ${v * k}.`); },
    () => { const a = rnd(5, 9); return num(`${a} + ${a + 1} = ? (Hint: double ${a}, then add 1.)`, 2 * a + 1, '🧠', `Double ${a} is ${2 * a}, plus 1 is ${2 * a + 1}.`); },
    () => {
      const evens = pick([12, 24, 36, 48, 62, 74, 86]); const odds = new Set<number>(); while (odds.size < 3) odds.add(rnd(5, 49) | 1);
      return txt('Which of these is an even number?', String(evens), [...odds].map(String), '2️⃣', 'Even numbers end in 0, 2, 4, 6 or 8.');
    },
  ],
  3: [
    () => { const g = pick([3, 4, 8]), k = rnd(3, 9); return num(`A box holds ${g} pencils. How many pencils are in ${k} boxes?`, g * k, '✏️', `${k} × ${g} = ${g * k}.`); },
    () => { const d = pick([3, 4, 8]), q = rnd(3, 9); return num(`There are ${d * q} children. They make teams of ${d}. How many teams are there?`, q, '🏅', `${d * q} ÷ ${d} = ${q}.`); },
    () => { const d = pick([2, 4, 5, 10]), k = rnd(2, 5); const n = d * k * (d === 2 ? 3 : 1); const q = n / d; return num(`A bag has ${n} sweets. 1/${d} of them are red. How many are red?`, q, '🍬', `${n} ÷ ${d} = ${q}.`); },
    () => { const s = rnd(4, 12); return num(`An equilateral triangle has sides of ${s} cm. What is its perimeter?`, 3 * s, '🔺', `3 × ${s} = ${3 * s} cm.`); },
    () => {
      const st = rnd(1, 11) * 60 + pick([0, 15, 30, 45]); const d = pick([15, 30, 45]); const end = st + d; const a = t12(end);
      return txt(`A lesson starts at ${t12(st)} and lasts ${d} minutes. What time does it end?`, a, distinct(a, [t12(end + 15), t12(end - 15), t12(end + 30)], () => t12(end + rnd(1, 5) * 5)), '⏰', `${t12(st)} + ${d} minutes = ${a}.`);
    },
    () => { const p = pick([25, 35, 45, 55]), k = rnd(3, 6); const tot = p * k; return txt(`A pen costs ${p}p. How much do ${k} pens cost?`, pounds(tot), distinct(pounds(tot), [pounds(tot + 10), pounds(tot - 10), pounds(tot + p)], () => pounds(tot + 5)), '🖊️', `${k} × ${p}p = ${tot}p.`); },
    () => { const m = rnd(1, 5), c = pick([20, 30, 40, 50, 60, 75]); return num(`A rope is ${m} m ${c} cm long. How many centimetres is that?`, m * 100 + c, '📏', `${m} m = ${m * 100} cm, plus ${c} cm.`, [10, 100]); },
    () => { const n = rnd(2, 8) * 100 + rnd(1, 9) * 10 + rnd(1, 9); const by = pick([10, 100]); return num(`What is ${by} more than ${n}?`, n + by, '🔢', `Add ${by} to ${n}.`, [10, 100]); },
    () => {
      const ds = new Set<number>(); while (ds.size < 4) ds.add(pick([2, 3, 4, 5, 6, 8, 10]));
      const arr = [...ds]; const m = Math.min(...arr);
      return txt('Which fraction is the largest?', `1/${m}`, arr.filter((x) => x !== m).map((x) => `1/${x}`), '🍕', `The smaller the bottom number, the bigger each part: 1/${m}.`);
    },
    () => { const a = rnd(3, 8), c = a + rnd(2, 5); return num(`A bar chart shows ${c} plums and ${a} pears. How many more plums than pears?`, c - a, '📊', `${c} − ${a} = ${c - a}.`); },
    () => txt('How many degrees are there in a right angle?', '90°', ['45°', '180°', '360°'], '📐', 'A right angle is a quarter turn: 90°.'),
    () => { const s = pick([3, 4, 8, 50]), st = rnd(1, 4) * s; return num(`Count on in ${s}s: ${st}, ${st + s}, ${st + 2 * s}, ?`, st + 3 * s, '🔢', `Add ${s} each time.`, [s, 10, 1]); },
  ],
  4: [
    () => { const p = pick([6, 8, 10, 12]), k = rnd(3, 5), g = rnd(3, 9); return num(`A pack has ${p} pens. Mia buys ${k} packs and gives away ${g} pens. How many pens does she have left?`, p * k - g, '🖊️', `${k} × ${p} = ${p * k}, then ${p * k} − ${g} = ${p * k - g}.`); },
    () => { const c = rnd(21, 48), b = rnd(3, 6); return num(`A bus carries ${c} children. How many children can ${b} buses carry?`, c * b, '🚌', `${c} × ${b} = ${c * b}.`); },
    () => {
      const d = rnd(3, 9), q = rnd(5, 12), r = rnd(1, d - 1); const a = d * q + r; const ans = `${q} remainder ${r}`;
      return txt(`${a} ÷ ${d} = ?`, ans, distinct(ans, [`${q + 1} remainder ${r}`, `${q - 1} remainder ${r}`, `${q} remainder ${r === 1 ? 2 : r - 1}`], () => `${q + rnd(2, 3)} remainder ${r}`), '➗', `${d} × ${q} = ${d * q}, and ${a} − ${d * q} = ${r} left over.`);
    },
    () => {
      const pool = [0.3, 0.35, 0.5, 0.05, 0.4, 0.6, 0.09, 0.45, 0.9, 0.15]; const set = new Set<number>(); while (set.size < 4) set.add(pick(pool));
      const arr = [...set]; const m = Math.min(...arr);
      return txt('Which decimal is the smallest?', String(m), arr.filter((x) => x !== m).map(String), '🔢', 'Compare tenths first, then hundredths: 0.05 is less than 0.3.');
    },
    () => { const pairs: [number, number, number][] = [[1, 2, 8], [3, 4, 8], [1, 3, 9], [2, 3, 12], [1, 4, 12], [3, 5, 10]]; const [a, b, d] = pick(pairs); const k = d / b; return num(`${a}/${b} = ?/${d}`, a * k, '🍕', `Multiply the top and bottom by ${k}: ${a * k}/${d}.`); },
    () => { const s = rnd(3, 9); return txt(`A square has sides of ${s} cm. What is its area?`, `${s * s} cm²`, distinct(`${s * s} cm²`, [`${4 * s} cm²`, `${2 * s} cm²`, `${s * s + s} cm²`, `${s * s - s} cm²`, `${s * s + 4} cm²`], () => `${s * s + rnd(5, 9)} cm²`), '🟦', `Area = ${s} × ${s} = ${s * s} cm².`); },
    () => { const n = rnd(4, 39); const a = toRoman(n); return txt(`Which Roman numeral is ${n}?`, a, distinct(a, [toRoman(n + 1), toRoman(n - 1), toRoman(n + 5), toRoman(n - 5 > 0 ? n - 5 : n + 2)], () => toRoman(rnd(4, 39))), '🏛️', `${n} is written ${a}.`); },
    () => { const a = pick([550, 600, 750, 850, 900, 950]), b = pick([125, 175, 225, 275, 325, 375]); const ans = a - b; return txt(`${pounds(a)} − ${pounds(b)} = ?`, pounds(ans), distinct(pounds(ans), [pounds(ans + 10), pounds(ans - 10), pounds(ans + 100), pounds(ans - 100)], () => pounds(ans + 5)), '💷', `${a}p − ${b}p = ${ans}p.`); },
    () => { const h = rnd(13, 22), m = pick(['00', '15', '30', '45']); const a = `${h - 12}:${m} pm`; return txt(`What is ${h}:${m} in 12-hour time?`, a, distinct(a, [`${h - 12}:${m} am`, `${h - 11}:${m} pm`, `${h - 12}:${m === '00' ? '30' : '00'} pm`], () => `${rnd(1, 11)}:${m} pm`), '🕒', `Take 12 off the hour and write pm: ${a}.`); },
    () => { const s = pick([['a square', 4], ['a rectangle (not a square)', 2], ['an equilateral triangle', 3], ['a regular hexagon', 6]] as [string, number][]); return num(`How many lines of symmetry does ${s[0]} have?`, s[1], '🪞', `${s[0]} has ${s[1]} lines of symmetry.`); },
    () => { const a = rnd(5, 20), b = rnd(5, 20), c = rnd(5, 20); return num(`A table shows books read: Monday ${a}, Tuesday ${b}, Wednesday ${c}. How many books in total?`, a + b + c, '📚', `${a} + ${b} + ${c} = ${a + b + c}.`); },
    () => { const x = rnd(1, 6), y = rnd(1, 6), dx = rnd(1, 4), dy = rnd(1, 4); const a = `(${x + dx}, ${y + dy})`; return txt(`A point is at (${x}, ${y}). It moves ${dx} right and ${dy} up. Where is it now?`, a, distinct(a, [`(${y + dy}, ${x + dx})`, `(${x + dy}, ${y + dx})`, `(${x + dx + 1}, ${y + dy})`, `(${x + dx}, ${y + dy + 1})`], () => `(${rnd(1, 9)}, ${rnd(1, 9)})`), '📍', 'Right changes x (across); up changes y (up).'); },
  ],
  5: [
    () => { const p = pick([20, 40, 60, 80]), off = pick([10, 20, 25, 50]); const a = p * (100 - off) / 100; return txt(`A jacket costs £${p}. It is reduced by ${off}%. What is the new price?`, `£${a}`, distinct(`£${a}`, [p - off > 0 ? `£${p - off}` : `£${a + 5}`, `£${p * off / 100}`, `£${a + 5}`, `£${a - 5}`, `£${a + 10}`], () => `£${a + rnd(2, 9)}`), '🧥', `${off}% of £${p} is £${p * off / 100}, so £${p} − £${p * off / 100} = £${a}.`); },
    () => {
      const t = pick([
        ['1/2', '1/4', '3/4', ['2/6', '1/4', '4/4']], ['1/3', '1/6', '1/2', ['2/9', '1/4', '2/3']], ['2/5', '1/10', '1/2', ['3/15', '3/10', '1/5']],
        ['3/4', '1/8', '7/8', ['4/12', '4/8', '3/8']], ['1/4', '1/8', '3/8', ['2/12', '1/2', '5/8']], ['2/3', '1/6', '5/6', ['3/9', '3/6', '7/6']],
      ] as [string, string, string, string[]][]);
      return txt(`${t[0]} + ${t[1]} = ?`, t[2], t[3], '🍕', 'Change to the same denominator first, then add the numerators.');
    },
    () => { const a = rnd(12, 25), b = rnd(11, 19); return num(`A shop sells ${a} packs of ${b} pencils. How many pencils is that altogether?`, a * b, '✏️', `${a} × ${b} = ${a * b}.`, [10, 20, a]); },
    () => { const d = pick([6, 8, 9, 12]), q = rnd(30, 90); return num(`Eggs are packed ${d} to a box. How many boxes are needed for ${d * q} eggs?`, q, '🥚', `${d * q} ÷ ${d} = ${q}.`, [1, 10, 2]); },
    () => { const n = pick([2.4, 3.5, 4.7, 6.2, 8.9]), by = pick([10, 100]); const a = Number((n * by).toFixed(1)); return txt(`${n} × ${by} = ?`, String(a), distinct(String(a), [String(Number((n * by / 10).toFixed(2))), String(Number((n * by * 10).toFixed(1))), String(Number((n + by).toFixed(1)))], () => String(rnd(2, 99))), '🔢', `Multiplying by ${by} moves each digit ${by === 10 ? 'one' : 'two'} place${by === 10 ? '' : 's'} to the left.`); },
    () => { const k = rnd(2, 9), r = rnd(k + 1, k + 10); const v = r - k; return txt(`The temperature is −${k}°C. It rises by ${r}°C. What is the new temperature?`, `${v}°C`, distinct(`${v}°C`, [`${-(k + r)}°C`, `${v + 2}°C`, `${r + k}°C`], () => `${v + rnd(3, 6)}°C`), '🌡️', `−${k} + ${r} = ${v}.`); },
    () => { const P = pick([20, 24, 28, 32, 36]), l = rnd(6, P / 2 - 3); return num(`A rectangle has a perimeter of ${P} cm and a length of ${l} cm. What is its width?`, P / 2 - l, '📐', `Half the perimeter is ${P / 2}; ${P / 2} − ${l} = ${P / 2 - l} cm.`); },
    () => { const a = rnd(35, 145); return num(`Two angles lie on a straight line. One is ${a}°. What is the other?`, 180 - a, '📐', `Angles on a straight line add to 180°: 180 − ${a} = ${180 - a}.`, [10, 20, 90]); },
    () => {
      const k = pick([6, 7, 8, 9]); const ans = k * rnd(4, 14); const w = new Set<number>();
      while (w.size < 3) { const c = rnd(20, 120); if (c % k !== 0 && c !== ans) w.add(c); }
      return txt(`Which of these is a multiple of ${k}?`, String(ans), [...w].map(String), '✖️', `${ans} ÷ ${k} = ${ans / k} exactly.`);
    },
    () => { const kg = pick([2.5, 3.5, 4.2, 1.8, 6.4]); const a = Math.round(kg * 1000); return txt(`Convert ${kg} kg to grams.`, `${a} g`, distinct(`${a} g`, [`${a / 10} g`, `${a * 10} g`, `${a + 100} g`, `${a - 100} g`], () => `${a + rnd(2, 9) * 10} g`), '⚖️', `1 kg = 1000 g, so ${kg} × 1000 = ${a} g.`); },
    () => { const h = rnd(7, 11), m = pick([5, 10, 15, 20, 35, 40, 45, 50]), dur = rnd(65, 175); const st = h * 60 + m, en = st + dur; const fmt = (x: number) => `${pad(Math.floor(x / 60))}:${pad(x % 60)}`; return txt(`A train leaves at ${fmt(st)} and arrives at ${fmt(en)}. How long is the journey?`, fmtDur(dur), distinct(fmtDur(dur), [fmtDur(dur + 10), fmtDur(dur - 10), fmtDur(dur + 60), fmtDur(dur - 60)], () => fmtDur(dur + rnd(2, 9) * 5)), '🚆', 'Count on to the next hour, then add the minutes.'); },
    () => { const n = rnd(1200, 9800); const a = Math.round(n / 1000) * 1000; return txt(`Round ${commas(n)} to the nearest 1,000.`, commas(a), distinct(commas(a), [commas(Math.round(n / 100) * 100), commas(Math.round(n / 10) * 10), commas(a + 1000), commas(a - 1000)], () => commas(a + rnd(2, 5) * 1000)), '🎯', 'Look at the hundreds digit: 5 or more rounds up.'); },
  ],
  6: [
    () => { const a = rnd(2, 4); let b = a + rnd(1, 2); while (b % a === 0) b = a + rnd(1, 3); const k = rnd(3, 6); return num(`Red and blue paint are mixed in the ratio ${a} : ${b}. There are ${a * k} ml of red paint. How much blue paint is needed?`, b * k, '🎨', `${a} parts = ${a * k} ml, so 1 part = ${k} ml; ${b} parts = ${b * k} ml.`, [k, a, 10]); },
    () => { const p = pick([40, 50, 60, 80, 120]), r = pick([10, 20, 25, 50]); const a = p + p * r / 100; return txt(`A price of £${p} rises by ${r}%. What is the new price?`, `£${a}`, distinct(`£${a}`, [`£${p - p * r / 100}`, `£${p * r / 100}`, `£${a + 5}`, `£${a - 5}`], () => `£${a + rnd(2, 9)}`), '📈', `${r}% of £${p} is £${p * r / 100}; add it on: £${a}.`); },
    () => { const k = rnd(2, 6), c = rnd(1, 9), a = rnd(2, 9); return num(`Find the value of ${k}a + ${c} when a = ${a}.`, k * a + c, '🔤', `${k} × ${a} = ${k * a}, then add ${c}: ${k * a + c}.`); },
    () => {
      const t = pick([
        ['1/2', '1/3', '1/6', ['2/5', '5/6', '1/5']], ['2/3', '3/4', '1/2', ['5/7', '6/7', '5/12']], ['3/5', '5/6', '1/2', ['8/11', '18/25', '5/6']],
        ['1/4', '2/3', '1/6', ['3/7', '2/7', '1/12']], ['3/4', '2/5', '3/10', ['5/9', '2/3', '1/4']],
      ] as [string, string, string, string[]][]);
      return txt(`${t[0]} × ${t[1]} = ?`, t[2], t[3], '🍕', 'Multiply the numerators, multiply the denominators, then simplify.');
    },
    () => {
      const t = pick([
        ['1/2', '3', '1/6', ['3/2', '1/5', '2/3']], ['1/3', '2', '1/6', ['2/3', '1/5', '3/2']], ['1/2', '4', '1/8', ['1/6', '2', '1/4']],
        ['1/4', '2', '1/8', ['1/2', '1/6', '1/16']], ['2/3', '2', '1/3', ['4/3', '2/5', '3/2']],
      ] as [string, string, string, string[]][]);
      return txt(`${t[0]} ÷ ${t[1]} = ?`, t[2], t[3], '🍕', `Dividing by ${t[1]} makes each part ${t[1]} times smaller.`);
    },
    () => { const set = new Set<number>(); while (set.size < 5) set.add(rnd(2, 19)); const arr = [...set]; const med = [...arr].sort((a, b) => a - b)[2]; return num(`What is the median of ${arr.join(', ')}?`, med, '📊', `Put them in order; the middle number is ${med}.`, [1, 2, 3]); },
    () => {
      const t = pick([5, 10]); const r = pick(t === 5 ? [1, 2, 3, 4] : [1, 3, 7, 9]); const b = t - r; const a = `${r}/${t}`;
      return txt(`A bag holds ${r} red and ${b} blue counters. One is picked without looking. What is the probability it is red?`, a, distinct(a, [`${b}/${t}`, `${r}/${b}`, `${r + 1}/${t}`, `1/${t}`], () => `${rnd(1, 9)}/${t + 1}`), '🎲', `${r} red out of ${t} counters = ${a}.`);
    },
    () => { const p = pick([10, 15, 20, 30, 35, 45]), n = pick([100, 200, 400, 500]); return num(`In a survey of ${n} children, ${p}% chose pizza. How many children is that?`, p * n / 100, '🍕', `${p}% of ${n} = ${p * n / 100}.`, [10, 20, 5]); },
    () => { const n = rnd(1000000, 9899999); const a = Math.round(n / 100000) * 100000; return txt(`Round ${commas(n)} to the nearest 100,000.`, commas(a), distinct(commas(a), [commas(Math.round(n / 10000) * 10000), commas(Math.round(n / 1000000) * 1000000), commas(a + 100000), commas(a - 100000)], () => commas(a + rnd(2, 5) * 100000)), '🎯', 'Look at the ten-thousands digit to decide.'); },
    () => { const s = rnd(6, 15); return num(`What is √${s * s}? (the square root)`, s, '√', `${s} × ${s} = ${s * s}.`, [1, 2, 3]); },
    () => { const x = rnd(1, 5), y = rnd(1, 5), dx = rnd(2, 5), dy = rnd(1, 4); const a = `(${x + dx}, ${y + dy})`; return txt(`A triangle has a corner at (${x}, ${y}). It is translated ${dx} right and ${dy} up. Where is that corner now?`, a, distinct(a, [`(${y + dy}, ${x + dx})`, `(${x + dy}, ${y + dx})`, `(${x + dx}, ${y})`, `(${x}, ${y + dy})`], () => `(${rnd(1, 9)}, ${rnd(1, 9)})`), '📍', 'Translation moves every point the same way.'); },
    () => { const s = pick([30, 40, 50, 60, 70, 80]), t = rnd(2, 5); return num(`A car travels at ${s} km/h for ${t} hours. How far does it travel?`, s * t, '🚗', `Distance = speed × time = ${s} × ${t} = ${s * t} km.`, [s, 10, t]); },
  ],
};

export function genMaths2(year: number): RawQ[] {
  return gens2[year].map((g) => g());
}
export { wrongNums };
