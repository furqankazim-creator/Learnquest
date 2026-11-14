// Year-by-year Maths question generators: fresh numbers every game, difficulty rises each year.
import type { RawQ } from './questions';

export const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
export const pick = <T,>(arr: T[]): T => arr[rnd(0, arr.length - 1)];

// Believable wrong answers: an off-by-one slip, a tens/hundreds slip and a nearby miss.
export function wrongNums(ans: number, neg = false): number[] {
  const ok = (x: number) => x !== ans && (neg || x >= 0);
  const pickOne = (c: number[], used: number[]) => {
    const v = c.filter((x) => ok(x) && !used.includes(x));
    return v.length ? v[rnd(0, v.length - 1)] : null;
  };
  const big = ans >= 200;
  const groups: number[][] = [
    [ans + 1, ans - 1],
    ans >= 15 ? (big ? [ans + 10, ans - 10, ans + 100, ans - 100] : [ans + 10, ans - 10]) : [ans + 2, ans - 2],
    ans >= 15 ? [ans + 2, ans - 2, ans + 5, ans - 5] : [ans + 3, ans - 3],
  ];
  const out: number[] = [];
  for (const g of groups) { const v = pickOne(g, out); if (v !== null) out.push(v); }
  for (let k = 1; out.length < 3 && k < 50; k++) { for (const x of [ans + k, ans - k]) if (ok(x) && !out.includes(x) && out.length < 3) out.push(x); }
  return out;
}

export function num(q: string, ans: number, e: string, why: string, _spread: number[] = [], neg = false): RawQ {
  const w = wrongNums(ans, neg);
  return [q, String(ans), String(w[0]), String(w[1]), String(w[2]), e, why];
}
export function txt(q: string, ans: string, wrong: string[], e: string, why: string): RawQ {
  return [q, ans, wrong[0], wrong[1], wrong[2], e, why];
}
export const dp = (n: number, d = 2) => String(Number(n.toFixed(d)));

const gens: Record<number, (() => RawQ)[]> = {
  1: [
    () => { const a = rnd(4, 11), b = rnd(3, 9); return num(`${a} + ${b} = ?`, a + b, '➕', `${a} + ${b} = ${a + b}. Count on from ${a}.`); },
    () => { const a = rnd(12, 20), b = rnd(2, 9); return num(`${a} − ${b} = ?`, a - b, '➖', `Count back ${b} from ${a}.`); },
    () => { const a = rnd(1, 9); return num(`${a} + ? = 10`, 10 - a, '🔟', `Number bond: ${a} and ${10 - a} make 10.`); },
    () => { const n = rnd(5, 19); return num(`What number comes after ${n}?`, n + 1, '👉', `${n} then ${n + 1}.`); },
    () => { const n = rnd(6, 20); return num(`What number comes before ${n}?`, n - 1, '👈', `${n - 1} then ${n}.`); },
    () => { const n = rnd(2, 9); return num(`Double ${n} is…`, n * 2, '👯', `${n} + ${n} = ${n * 2}.`); },
    () => { const n = rnd(2, 10) * 2; return num(`Half of ${n} is…`, n / 2, '🍰', `Share ${n} into 2 equal groups: ${n / 2} each.`); },
    () => { const s = rnd(1, 4) * 2; return num(`Count in 2s: ${s}, ${s + 2}, ${s + 4}, ?`, s + 6, '🔢', 'Add 2 each time.', [2, 4, 1]); },
    () => { const n = rnd(1, 9); return num(`10 more than ${n} is…`, n + 10, '🔟', `Add a ten: ${n} + 10 = ${n + 10}.`); },
    () => {
      const a = rnd(11, 19); let b = rnd(11, 19); while (b === a) b = rnd(11, 19); let c = rnd(11, 19); while (c === a || c === b) c = rnd(11, 19);
      return txt('Which number is the biggest?', String(Math.max(a, b, c)), [a, b, c].filter((x) => x !== Math.max(a, b, c)).map(String).concat(String(rnd(1, 9))).slice(0, 3), '📏', 'Compare the tens, then the ones.');
    },
    () => { const sh = pick([['triangle', 3], ['square', 4], ['pentagon', 5], ['hexagon', 6]] as [string, number][]); return num(`How many sides does a ${sh[0]} have?`, sh[1], '🔷', `A ${sh[0]} has ${sh[1]} straight sides.`, [1, 2, 3]); },
    () => { const h = rnd(1, 12); return txt(`The short hand points to ${h} and the long hand points to 12. What time is it?`, `${h} o'clock`, [`${h % 12 + 1} o'clock`, `half past ${h}`, `quarter past ${h}`], '🕐', 'Long hand on 12 means o\'clock.'); },
  ],
  2: [
    () => { const a = rnd(21, 59), b = rnd(11, 30); return num(`${a} + ${b} = ?`, a + b, '➕', `Add the tens then the ones: ${a + b}.`, [1, 10, 2]); },
    () => { const a = rnd(50, 99), b = rnd(11, 40); return num(`${a} − ${b} = ?`, a - b, '➖', `${a} − ${b} = ${a - b}.`, [1, 10, 2]); },
    () => { const n = rnd(3, 12); return num(`${n} × 2 = ?`, n * 2, '✖️', `2 groups of ${n} is ${n * 2}.`, [2, 1, 4]); },
    () => { const n = rnd(3, 12); return num(`${n} × 5 = ?`, n * 5, '✖️', `Count in 5s ${n} times.`, [5, 1, 10]); },
    () => { const n = rnd(3, 9); return num(`${n} × 10 = ?`, n * 10, '✖️', `Multiplying by 10 moves the digit one place: ${n * 10}.`, [10, 1, 100]); },
    () => { const n = rnd(2, 9) * 2; return num(`${n * 2} ÷ 2 = ?`, n, '➗', `Half of ${n * 2} is ${n}.`, [2, 1, 4]); },
    () => { const t = rnd(2, 9); let o = rnd(1, 9); while (o === t) o = rnd(1, 9); return txt(`In the number ${t}${o}, what is the digit ${t} worth?`, `${t * 10}`, [`${t}`, `${o}`, `${t + o}`], '🔟', `The ${t} is in the tens place, so it is worth ${t * 10}.`); },
    () => { const s = rnd(1, 6) * 5; return num(`Count in 5s: ${s}, ${s + 5}, ${s + 10}, ?`, s + 15, '🖐️', 'Add 5 each time.', [5, 10, 1]); },
    () => { const a = pick([10, 20, 50]), b = pick([5, 10, 20]); return txt(`${a}p + ${b}p = ?`, `${a + b}p`, [`${a + b + 5}p`, `${a + b - 5}p`, `${a + b + 10}p`], '🪙', `Add the pennies: ${a + b}p.`); },
    () => { const n = rnd(2, 12) * 4; return num(`A quarter of ${n} is…`, n / 4, '🍕', `Split ${n} into 4 equal parts: ${n / 4}.`, [1, 2, 4]); },
    () => { const m = pick([['quarter past', 15], ['half past', 30], ['quarter to', 45]] as [string, number][]); const h = rnd(1, 11); const hh = m[0] === 'quarter to' ? h + 1 : h; const wrong = ['quarter past', 'half past', 'quarter to'].filter((x) => x !== m[0]).map((x) => `${x} ${hh}`).concat(`${hh} o'clock`).slice(0, 3); return txt(`The short hand is near ${hh} and the long hand points to ${m[1] / 5}. What is the time?`, `${m[0]} ${hh}`, wrong, '🕑', 'Each number on the clock is 5 minutes.'); },
    () => { const n = rnd(21, 99); return num(`10 less than ${n} is…`, n - 10, '➖', `Take 1 off the tens digit: ${n - 10}.`, [10, 1, 2]); },
  ],
  3: [
    () => { const n = rnd(3, 12); return num(`${n} × 3 = ?`, n * 3, '✖️', `3 × ${n} = ${n * 3}.`, [3, 1, 10]); },
    () => { const n = rnd(3, 12); return num(`${n} × 4 = ?`, n * 4, '✖️', `Double, then double again: ${n * 4}.`, [4, 1, 10]); },
    () => { const n = rnd(3, 12); return num(`${n} × 8 = ?`, n * 8, '✖️', `Double 3 times: ${n * 8}.`, [8, 2, 10]); },
    () => { const a = rnd(120, 480), b = rnd(110, 300); return num(`${a} + ${b} = ?`, a + b, '➕', `Add hundreds, tens, ones: ${a + b}.`, [10, 100, 1]); },
    () => { const a = rnd(500, 900), b = rnd(110, 400); return num(`${a} − ${b} = ?`, a - b, '➖', `${a} − ${b} = ${a - b}.`, [10, 100, 1]); },
    () => { const d = rnd(3, 9), q = rnd(3, 12); return num(`${d * q} ÷ ${d} = ?`, q, '➗', `${d} × ${q} = ${d * q}, so ${d * q} ÷ ${d} = ${q}.`, [1, 2, 3]); },
    () => { const n = rnd(2, 8) * 4; return num(`¼ of ${n} is…`, n / 4, '🍕', `Divide ${n} by 4: ${n / 4}.`, [1, 2, 4]); },
    () => { const n = rnd(2, 8) * 3; return num(`⅓ of ${n} is…`, n / 3, '🍕', `Divide ${n} by 3: ${n / 3}.`, [1, 2, 3]); },
    () => { const l = rnd(3, 9), w = rnd(2, 6); return num(`A rectangle is ${l} cm long and ${w} cm wide. Its perimeter is…`, 2 * (l + w), '📐', `Add all four sides: ${l} + ${w} + ${l} + ${w} = ${2 * (l + w)} cm.`, [2, 4, l]); },
    () => { const n = rnd(11, 98); const r = Math.round(n / 10) * 10; return num(`${n} rounded to the nearest 10 is…`, r, '🎯', `Look at the ones digit: ${n % 10 >= 5 ? 'round up' : 'round down'}.`, [10, 20, 1]); },
    () => { const h = rnd(3, 9) * 100 + rnd(1, 9) * 10 + rnd(1, 9); return num(`What is the value of the tens digit in ${h}?`, Math.floor(h / 10) % 10 * 10, '🔢', 'Read the digit in the tens column.', [10, 100, 1]); },
    () => { const pr = pick([5, 10, 20]); return txt(`A pencil costs ${pr}p. How much do 3 pencils cost?`, `${pr * 3}p`, [`${pr * 2}p`, `${pr * 4}p`, `${pr * 5}p`], '✏️', `${pr}p × 3 = ${pr * 3}p.`); },
  ],
  4: [
    () => { const n = rnd(3, 12); return num(`${n} × 7 = ?`, n * 7, '✖️', `${n} × 7 = ${n * 7}.`, [7, 1, 10]); },
    () => { const n = rnd(3, 12); return num(`${n} × 9 = ?`, n * 9, '✖️', `Use ${n} × 10 − ${n} = ${n * 9}.`, [9, 1, 10]); },
    () => { const n = rnd(3, 12); return num(`${n} × 11 = ?`, n * 11, '✖️', `${n} × 10 + ${n} = ${n * 11}.`, [11, 1, 10]); },
    () => { const a = rnd(1200, 6800), b = rnd(1100, 2900); return num(`${a} + ${b} = ?`, a + b, '➕', `Add column by column: ${a + b}.`, [10, 100, 1000]); },
    () => { const a = rnd(5000, 9000), b = rnd(1100, 3900); return num(`${a} − ${b} = ?`, a - b, '➖', `${a} − ${b} = ${a - b}.`, [10, 100, 1000]); },
    () => { const d = rnd(6, 12), q = rnd(4, 12); return num(`${d * q} ÷ ${d} = ?`, q, '➗', `${d} × ${q} = ${d * q}.`, [1, 2, 3]); },
    () => { const l = rnd(4, 12), w = rnd(3, 9); return num(`A rectangle is ${l} cm by ${w} cm. Its area is…`, l * w, '📐', `Area = length × width = ${l * w} cm².`, [l, w, 2]); },
    () => { const n = rnd(2, 9); return txt(`What is ${n}/10 as a decimal?`, dp(n / 10, 1), [dp(n / 100), String(n), dp(n / 10 + 1, 1)], '🔢', `${n} tenths = 0.${n}.`); },
    () => { const n = rnd(120, 960); const r = Math.round(n / 100) * 100; return num(`${n} rounded to the nearest 100 is…`, r, '🎯', 'Look at the tens digit to decide.', [100, 200, 10]); },
    () => { const a = pick([12, 18, 24, 30, 36]); return txt(`Which of these is a factor of ${a}?`, '6', ['7', '11', '13'], '🧮', `${a} ÷ 6 = ${a / 6} exactly.`); },
    () => { const t = rnd(1, 5) * 10 + rnd(0, 9); return num(`How many minutes are in 1 hour and ${t} minutes?`, 60 + t, '⏰', `60 + ${t} = ${60 + t}.`, [10, 1, 5]); },
    () => { const a = rnd(2, 9), b = rnd(2, 9); return txt(`£${a}.50 + £${b}.50 = ?`, `£${a + b + 1}.00`, [`£${a + b}.50`, `£${a + b + 1}.50`, `£${a + b}.00`], '💷', 'The two 50p amounts make £1.'); },
  ],
  5: [
    () => { const p = pick([10, 20, 25, 50]); const n = pick([40, 80, 120, 200]); return num(`${p}% of ${n} is…`, (p * n) / 100, '💯', `${p}% means ${p} out of 100.`, [5, 10, 2]); },
    () => { const a = rnd(12, 29), b = rnd(11, 19); return num(`${a} × ${b} = ?`, a * b, '✖️', `Split ${b}: ${a} × ${b - (b % 10)} + ${a} × ${b % 10} = ${a * b}.`, [10, 20, 1]); },
    () => { const d = rnd(6, 12), q = rnd(15, 60); return num(`${d * q} ÷ ${d} = ?`, q, '➗', `${d} × ${q} = ${d * q}.`, [1, 10, 2]); },
    () => { const n = rnd(2, 12); return num(`${n} squared (${n} × ${n}) is…`, n * n, '🟦', `${n} × ${n} = ${n * n}.`, [n, 2, 10]); },
    () => txt('Which of these is a prime number?', pick(['11', '13', '17', '19']), ['9', '15', '21'], '🔢', 'A prime has exactly two factors: 1 and itself.'),
    () => { const a = rnd(11, 49) / 10, b = rnd(11, 39) / 10; return txt(`${dp(a, 1)} + ${dp(b, 1)} = ?`, dp(a + b, 1), [dp(a + b + 0.1, 1), dp(a + b - 0.1, 1), dp(a + b + 1, 1)], '🔢', 'Line up the decimal points.'); },
    () => { const k = rnd(2, 9); return num(`${k} km is how many metres?`, k * 1000, '📏', '1 km = 1000 m.', [100, 1000, 10]); },
    () => { const a = rnd(3, 9) * 2, b = rnd(3, 9) * 2 + 2, c = rnd(3, 9) * 2 + 4; const m = (a + b + c) / 3; return Number.isInteger(m) ? num(`The mean of ${a}, ${b} and ${c} is…`, m, '📊', 'Add them up and divide by 3.') : num(`The mean of ${a}, ${a + 2} and ${a + 4} is…`, a + 2, '📊', 'The mean of evenly spaced numbers is the middle one.'); },
    () => { const n = rnd(2, 9) * 4; const s = pick([['½', 2], ['¼', 4]] as [string, number][]); return num(`${s[0]} of ${n} is…`, n / s[1], '🍕', `Divide ${n} by ${s[1]}.`, [1, 2, 4]); },
    () => { const a = rnd(35, 80); return num(`Two angles of a triangle are ${a}° and ${a - 10}°. The third angle is…`, 180 - a - (a - 10), '📐', `Angles in a triangle add to 180°: 180 − ${a} − ${a - 10}.`, [10, 5, 20]); },
    () => { const n = rnd(20, 90) * 10 + 5; return num(`${n} rounded to the nearest 10 is…`, Math.round(n / 10) * 10, '🎯', 'A 5 in the ones place rounds up.', [10, 20, 5]); },
    () => { const l = rnd(3, 9), w = rnd(2, 6), h = rnd(2, 5); return num(`A cuboid is ${l} cm × ${w} cm × ${h} cm. Its volume is…`, l * w * h, '🧊', `Volume = l × w × h = ${l * w * h} cm³.`, [l, w, 10]); },
  ],
  6: [
    () => { const a = rnd(3, 12), b = rnd(a + 4, a + 18); return num(`n + ${a} = ${b}. What is n?`, b - a, '🔤', `Subtract ${a} from both sides: n = ${b - a}.`); },
    () => { const m = rnd(3, 9), x = rnd(2, 12); return num(`${m}x = ${m * x}. What is x?`, x, '🔤', `Divide both sides by ${m}.`, [1, 2, m]); },
    () => { const a = rnd(2, 5), b = rnd(3, 6), c = rnd(2, 5); return num(`${a} + ${b} × ${c} = ?`, a + b * c, '🧮', `Multiply first (BODMAS): ${b} × ${c} = ${b * c}, then add ${a}.`, [b, c, 10]); },
    () => { const p = pick([5, 10, 15, 20, 25, 30]); const n = pick([40, 60, 80, 120, 200, 300]); return num(`${p}% of ${n} is…`, (p * n) / 100, '💯', `${p}% = ${p}/100.`, [5, 10, 2]); },
    () => { const a = rnd(2, 5); let b = rnd(2, 5); while (b === a) b = rnd(2, 5); const tot = (a + b) * rnd(3, 9); return txt(`Share ${tot} in the ratio ${a} : ${b}. What is the larger share?`, String(Math.max(a, b) * (tot / (a + b))), [String(Math.min(a, b) * (tot / (a + b))), String(tot / (a + b)), String(tot - 1)], '⚖️', `${a + b} parts = ${tot}, so 1 part = ${tot / (a + b)}.`); },
    () => { const k = rnd(2, 5) * 3; return num(`⅔ of ${k * 3} is…`, k * 2, '🍕', `⅓ of ${k * 3} is ${k}, so ⅔ is ${k * 2}.`, [k, 3, 6]); },
    () => { const n = rnd(2, 5); return num(`${n}³ (${n} cubed) is…`, n ** 3, '🧊', `${n} × ${n} × ${n} = ${n ** 3}.`, [n, 9, 10]); },
    () => { const a = rnd(2, 9), b = rnd(a + 1, a + 9); return num(`${a} − ${b} = ?`, a - b, '🌡️', `${a} is less than ${b}, so the answer is negative.`, [1, 2, 10], true); },
    () => { const a = rnd(35, 80), b = rnd(35, 80); const c = 180 - a - b; return c > 5 ? num(`In a triangle two angles are ${a}° and ${b}°. The third angle is…`, c, '📐', 'Angles in a triangle add to 180°.', [10, 5, 20]) : num('Angles on a straight line add up to…', 180, '📐', 'A straight line is 180°.', [10, 90, 20]); },
    () => { const a = rnd(3, 9) * 2, b = rnd(3, 9) * 2, c = rnd(3, 9) * 2, d = rnd(3, 9) * 2; const m = (a + b + c + d) / 4; return Number.isInteger(m) ? num(`The mean of ${a}, ${b}, ${c} and ${d} is…`, m, '📊', 'Sum ÷ number of values.') : num(`The mean of ${a}, ${a}, ${a + 4} and ${a + 4} is…`, a + 2, '📊', 'Sum ÷ 4.'); },
    () => { const b = rnd(3, 9) * 2, h = rnd(3, 9); return num(`A triangle has base ${b} cm and height ${h} cm. Its area is…`, (b * h) / 2, '🔺', `Area = ½ × base × height = ${(b * h) / 2} cm².`, [b, h, 5]); },
    () => { const a = rnd(2, 4), b = rnd(2, 5); const n = rnd(2, 4); return txt(`${a}/${b * n} is the same as…`, `${a * 2}/${b * n * 2}`, [`${a + 2}/${b * n + 2}`, `${a}/${b * n * 2}`, `${a * 2}/${b * n}`], '🍕', 'Multiply the top and bottom by the same number.'); },
  ],
};

export function genMaths(year: number): RawQ[] {
  return gens[year].map((g) => g());
}
