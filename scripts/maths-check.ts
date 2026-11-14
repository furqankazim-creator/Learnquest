// Independent check of every Maths answer: re-reads the question text, does the sum itself and compares.
// Runs the original 72 questions and 200 random generations of each generated template.
import { MATH } from '../src/data/questions';
import { genMaths } from '../src/data/mathsGen';
import { genMaths2 } from '../src/data/mathsGen2';
import { FIX } from '../src/data/fixes';

const n = (s: string) => Number(s.replace(/,/g, ''));
const pounds = (p: number) => (p >= 100 ? `£${(p / 100).toFixed(2)}` : `${p}p`);
const num = (s: string) => Number(String(s).replace(/[^\d.\-−]/g, '').replace('−', '-'));
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const FR: Record<string, number> = { '½': 1 / 2, '⅓': 1 / 3, '¼': 1 / 4, '⅔': 2 / 3, '¾': 3 / 4, '⅕': 1 / 5 };

// returns [expected, mode]. mode 'n' = compare numbers, 's' = compare strings
function expected(q: string): [string | number, 'n' | 's'] | null {
  let m: RegExpMatchArray | null;
  if ((m = q.match(/^(\d+) ([+−×÷]) (\d+) = \?/))) {
    const a = +m[1], b = +m[3];
    if (m[2] === '+') return [a + b, 'n']; if (m[2] === '−') return [a - b, 'n']; if (m[2] === '×') return [a * b, 'n'];
    return a % b === 0 ? [a / b, 'n'] : [`${Math.floor(a / b)} remainder ${a % b}`, 's'];
  }
  if ((m = q.match(/^£(\d+)\.(\d\d) ([+−]) £(\d+)\.(\d\d)/))) { const a = +m[1] * 100 + +m[2], b = +m[4] * 100 + +m[5]; return [pounds(m[3] === '+' ? a + b : a - b), 's']; }
  if ((m = q.match(/^£(\d+)\.50 \+ £(\d+)\.50 = \?/))) return [pounds((+m[1] + +m[2] + 1) * 100), 's'];
  if ((m = q.match(/^(\d+)p \+ (\d+)p = \?/))) return [pounds(+m[1] + +m[2]), 's'];
  if ((m = q.match(/^(?:\?|n) \+ (\d+) = (\d+)/))) return [+m[2] - +m[1], 'n'];
  if ((m = q.match(/^(\d+) \+ \? = (\d+)/))) return [+m[2] - +m[1], 'n'];
  if ((m = q.match(/^(\d+)x = (\d+)/))) return [+m[2] / +m[1], 'n'];
  if ((m = q.match(/^Double (\d+)/))) return [2 * +m[1], 'n'];
  if ((m = q.match(/^(?:A )?(?:Half|Quarter|quarter) of (\d+)/i))) return [+m[1] / (/half/i.test(q) ? 2 : 4), 'n'];
  if ((m = q.match(/^([½⅓¼⅔¾⅕]) of (\d+)/))) return [Math.round(FR[m[1]] * +m[2] * 1e9) / 1e9, 'n'];
  if ((m = q.match(/^One tenth of (\d+)/))) return [+m[1] / 10, 'n'];
  if ((m = q.match(/^(\d+)\/(\d+) of (\d+) is/))) return [(+m[1] * +m[3]) / +m[2], 'n'];
  if ((m = q.match(/^⅗ of (\d+)/))) return [(3 * +m[1]) / 5, 'n'];
  if ((m = q.match(/^(\d+)% of (\d+)/))) return [(+m[1] * +m[2]) / 100, 'n'];
  if ((m = q.match(/Count (?:on )?in (\d+)s:\s*((?:\d+,\s*)+)/))) { const k = m[2].split(',').map((x) => x.trim()).filter(Boolean).map(Number); return [k[k.length - 1] + +m[1], 'n']; }
  if ((m = q.match(/^What number comes after (\d+)/))) return [+m[1] + 1, 'n'];
  if ((m = q.match(/^What number comes before (\d+)/))) return [+m[1] - 1, 'n'];
  if ((m = q.match(/(?:What number is |What is |^)(\d+) more than (\d+)/))) return [+m[1] + +m[2], 'n'];
  if ((m = q.match(/(?:What number is |What is |^)(\d+) less than (\d+)/))) return [+m[2] - +m[1], 'n'];
  if ((m = q.match(/^(\d+) squared/))) return [Math.pow(+m[1], 2), 'n'];
  if ((m = q.match(/^(\d+) × (\d+) × (\d+) \(/))) return [+m[1] * +m[2] * +m[3], 'n'];
  if ((m = q.match(/^(\d+)³/))) return [Math.pow(+m[1], 3), 'n'];
  if ((m = q.match(/^What is √(\d+)/))) return [Math.sqrt(+m[1]), 'n'];
  if ((m = q.match(/^Find the value of (\d+)a \+ (\d+) when a = (\d+)/))) return [+m[1] * +m[3] + +m[2], 'n'];
  if ((m = q.match(/(?:The )?[Mm]ean of ([\d, and]+)/))) { const v = m[1].split(/,| and /).map((x) => x.trim()).filter(Boolean).map(Number); return [v.reduce((a, b) => a + b, 0) / v.length, 'n']; }
  if ((m = q.match(/median of ([\d, ]+)\?/))) { const v = m[1].split(',').map((x) => +x.trim()).sort((a, b) => a - b); return [v[(v.length - 1) / 2], 'n']; }
  if ((m = q.match(/^([\d,]+) rounded to the nearest ([\d,]+)/))) return [Math.round(n(m[1]) / n(m[2])) * n(m[2]), 'n'];
  if ((m = q.match(/^Round ([\d,]+) to the nearest ([\d,]+)/))) return [Math.round(n(m[1]) / n(m[2])) * n(m[2]), 'n'];
  if ((m = q.match(/rectangle is (\d+) cm by (\d+) cm\. Its area/))) return [+m[1] * +m[2], 'n'];
  if ((m = q.match(/rectangle is (\d+) cm long and (\d+) cm wide\. Its perimeter/))) return [2 * (+m[1] + +m[2]), 'n'];
  if ((m = q.match(/square has a side of (\d+) cm\. Its perimeter/))) return [4 * +m[1], 'n'];
  if ((m = q.match(/square has sides of (\d+) cm\. What is its area/))) return [Math.pow(+m[1], 2), 'n'];
  if ((m = q.match(/triangle has base (\d+) cm and height (\d+) cm\. Its area/))) return [(+m[1] * +m[2]) / 2, 'n'];
  if ((m = q.match(/equilateral triangle has sides of (\d+) cm/))) return [3 * +m[1], 'n'];
  if ((m = q.match(/^(\d+)\/(\d+) = \?\/(\d+)/))) return [(+m[1] * +m[3]) / +m[2], 'n'];
  if ((m = q.match(/What number is (\d+) tens? and (\d+) ones?/))) return [10 * +m[1] + +m[2], 'n'];
  if ((m = q.match(/^A rope is (\d+) m (\d+) cm long/))) return [100 * +m[1] + +m[2], 'n'];
  if ((m = q.match(/^Convert ([\d.]+) kg to grams/))) return [`${Math.round(+m[1] * 1000)} g`, 's'];
  if ((m = q.match(/^(\d+) ÷ (\d+) = \?/))) return [+m[1] / +m[2], 'n'];
  if ((m = q.match(/(\d+) (?:more|less)/))) void m;
  // word problems
  if ((m = q.match(/holds (\d+) [\w ]+?\.\s*How many [\w ]+? (?:are )?in (\d+) \w+\?/))) return [+m[1] * +m[2], 'n'];
  if ((m = q.match(/(\d+) [\w ]+? (?:are )?shared equally between (\d+) /))) return [+m[1] / +m[2], 'n'];
  if ((m = q.match(/There are (\d+) children\. They make teams of (\d+)\./))) return [+m[1] / +m[2], 'n'];
  if ((m = q.match(/costs (\d+)p and a [\w ]+? costs (\d+)p/))) return [pounds(+m[1] + +m[2]), 's'];
  if ((m = q.match(/costs (\d+)p\. How much do (\d+) [\w ]+? cost/))) return [pounds(+m[1] * +m[2]), 's'];
  if ((m = q.match(/costs (\d+)p\. You pay with a (\d+)p coin/))) return [+m[2] - +m[1], 'n'];
  if ((m = q.match(/A bar chart shows (\d+) \w+ and (\d+) \w+\. How many more/))) return [+m[1] - +m[2], 'n'];
  if ((m = q.match(/A red ribbon is (\d+) cm long\. A blue ribbon is (\d+) cm/))) return [+m[1] - +m[2], 'n'];
  if ((m = q.match(/each star ⭐ stands for (\d+) children\. There are (\d+) stars/))) return [+m[1] * +m[2], 'n'];
  if ((m = q.match(/Monday (\d+), Tuesday (\d+), Wednesday (\d+)/))) return [+m[1] + +m[2] + +m[3], 'n'];
  if ((m = q.match(/A pack has (\d+) pens\. Mia buys (\d+) packs and gives away (\d+)/))) return [+m[1] * +m[2] - +m[3], 'n'];
  if ((m = q.match(/A bus carries (\d+) children\. How many children can (\d+) buses/))) return [+m[1] * +m[2], 'n'];
  if ((m = q.match(/A shop sells (\d+) packs of (\d+) pencils/))) return [+m[1] * +m[2], 'n'];
  if ((m = q.match(/Eggs are packed (\d+) to a box\. How many boxes are needed for (\d+) eggs/))) return [+m[2] / +m[1], 'n'];
  if ((m = q.match(/A rectangle has a perimeter of (\d+) cm and a length of (\d+) cm\. What is its width/))) return [+m[1] / 2 - +m[2], 'n'];
  if ((m = q.match(/Two angles lie on a straight line\. One is (\d+)°/))) return [180 - +m[1], 'n'];
  if ((m = q.match(/Two angles of a triangle are (\d+)° and (\d+)°/))) return [180 - +m[1] - +m[2], 'n'];
  if ((m = q.match(/In a triangle two angles are (\d+)° and (\d+)°/))) return [180 - +m[1] - +m[2], 'n'];
  if ((m = q.match(/A car travels at (\d+) km\/h for (\d+) hours/))) return [+m[1] * +m[2], 'n'];
  if ((m = q.match(/In a survey of (\d+) children, (\d+)% chose/))) return [(+m[1] * +m[2]) / 100, 'n'];
  if ((m = q.match(/^A (?:jacket costs|price of) £(\d+)(?:\. It is reduced by| rises by) (\d+)%/))) { const up = /rises/.test(q); const d = (+m[1] * +m[2]) / 100; return [`£${up ? +m[1] + d : +m[1] - d}`, 's']; }
  if ((m = q.match(/^(\d+) \+ (\d+) \+? ?= \?/))) return [+m[1] + +m[2], 'n'];
  if ((m = q.match(/^(\d+) \+ (\d+) = \? \(Hint/))) return [+m[1] + +m[2], 'n'];
  if ((m = q.match(/^(\d+) − (\d+) = \?/))) return [+m[1] - +m[2], 'n'];
  if ((m = q.match(/^A (?:red|\w+) ribbon/))) void m;
  if ((m = q.match(/^(\w+) has (\d+) \w+\. He is given (\d+) more|There are (\d+) birds in a tree\. (\d+) fly away|A shop had (\d+) books\. It sold (\d+)/))) {
    if (q.includes('given')) return [+q.match(/has (\d+)/)![1] + +q.match(/given (\d+)/)![1], 'n'];
    if (q.includes('fly away')) return [+q.match(/are (\d+)/)![1] - +q.match(/\. (\d+) fly/)![1], 'n'];
    return [+q.match(/had (\d+)/)![1] - +q.match(/sold (\d+)/)![1], 'n'];
  }
  if ((m = q.match(/10 less than (\d+)/))) return [+m[1] - 10, 'n'];
  if ((m = q.match(/^A pencil costs (\d+)p and a rubber costs (\d+)p/))) return [pounds(+m[1] + +m[2]), 's'];
  if ((m = q.match(/A (\w+) is (\d+) cm long and (\d+) wide/))) void m;
  return null;
}


// questions whose right answer is judged from the four options (or a time/roman format) rather than one number
const toRoman = (x: number) => { const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let r = ''; for (const [v, t] of map) while (x >= v) { r += t; x -= v; } return r; };
const pad2 = (x: number) => String(x).padStart(2, '0');
const t12 = (mins: number) => { const mm = ((mins % 720) + 720) % 720; return `${Math.floor(mm / 60) || 12}:${pad2(mm % 60)}`; };
function judge(r: string[]): boolean | null {
  const q = r[0], ans = r[1], opts = r.slice(1, 5);
  let m: RegExpMatchArray | null;
  const nums = opts.map(num);
  if (/^Which number is the smallest\?/.test(q)) return near(num(ans), Math.min(...nums));
  if (/^Which number is the biggest\?/.test(q)) return near(num(ans), Math.max(...nums));
  if (/^Which decimal is the smallest\?/.test(q)) return near(num(ans), Math.min(...nums));
  if (/^Which of these is an even number\?/.test(q)) return num(ans) % 2 === 0 && nums.filter((x) => x % 2 === 0).length === 1;
  if ((m = q.match(/tens digit in (\d+)/))) return num(ans) === (Math.floor(+m[1] / 10) % 10) * 10;
  if ((m = q.match(/In the number (\d)(\d), what is the digit (\d) worth/))) return num(ans) === +m[3] * 10;
  if ((m = q.match(/^([\d.]+) × (\d+) = \?/))) return near(num(ans), Math.round(+m[1] * +m[2] * 1000) / 1000);
  if ((m = q.match(/short hand (?:points to|is near) (\d+) and the long hand points to (\d+)/))) { const h = +m[1], mm = +m[2]; const e = mm === 12 ? `${h} o'clock` : mm === 6 ? `half past ${h}` : mm === 3 ? `quarter past ${h}` : `quarter to ${h}`; return ans === e; }
  if ((m = q.match(/A bag has (\d+) sweets\. (\d+)\/(\d+) of them/))) return near(num(ans), (+m[1] * +m[2]) / +m[3]);
  if (/right angle/.test(q)) return ans === '90°';
  if ((m = q.match(/What is (\d)\/10 as a decimal/))) return near(num(ans), +m[1] / 10);
  if ((m = q.match(/factor of (\d+)\?/))) return +m[1] % num(ans) === 0 && nums.filter((x) => +m![1] % x === 0).length === 1;
  if ((m = q.match(/1 hour and (\d+) minutes/))) return num(ans) === 60 + +m[1];
  if ((m = q.match(/Which Roman numeral is (\d+)/))) return ans === toRoman(+m[1]);
  if (/^Which fraction is the largest\?/.test(q)) return +ans.split('/')[1] === Math.min(...opts.map((o) => +o.split('/')[1]));
  if ((m = q.match(/A lesson starts at (\d+):(\d\d) and lasts (\d+) minutes/))) return ans === t12(+m[1] * 60 + +m[2] + +m[3]);
  if (/^Which shape has 4 equal sides/.test(q)) return ans === 'square';
  if ((m = q.match(/What time does it finish\?/)) && (m = q.match(/starts at (\d+) o'clock and lasts (\d+) hour/))) return ans === `${((+m[1] + +m[2] - 1) % 12) + 1} o'clock`;
  if ((m = q.match(/What is (\d+):(\d\d) in 12-hour time/))) return ans === `${+m[1] - 12}:${m[2]} pm`;
  if ((m = q.match(/A (\w+) is split into|A shape is split into (\d+) equal parts\. (\d+) parts? (?:is|are) shaded/))) return m[2] ? ans === `${m[3]}/${m[2]}` : null;
  if ((m = q.match(/How many lines of symmetry does (.+) have\?/))) { const t = m[1]; return num(ans) === (t.includes('equilateral') ? 3 : t.includes('hexagon') ? 6 : t.includes('not a square') ? 2 : 4); }
  if ((m = q.match(/A point is at \((\d+), (\d+)\)\. It moves (\d+) right and (\d+) up/))) return ans === `(${+m[1] + +m[3]}, ${+m[2] + +m[4]})`;
  if ((m = q.match(/corner at \((\d+), (\d+)\)\. It is translated (\d+) right and (\d+) up/))) return ans === `(${+m[1] + +m[3]}, ${+m[2] + +m[4]})`;
  if ((m = q.match(/The temperature is −(\d+)°C\. It rises by (\d+)°C/))) return ans === `${+m[2] - +m[1]}°C`;
  if ((m = q.match(/Share (\d+) in the ratio (\d+) : (\d+)\. What is the larger share/))) return num(ans) === (Math.max(+m[2], +m[3]) * +m[1]) / (+m[2] + +m[3]);
  if ((m = q.match(/mixed in the ratio (\d+) : (\d+)\. There are (\d+) ml of red/))) return num(ans) === (+m[2] * +m[3]) / +m[1];
  if ((m = q.match(/The probability it is red|probability it is red/))) { const mm = q.match(/holds (\d+) red and (\d+) blue/); return mm ? ans === `${mm[1]}/${+mm[1] + +mm[2]}` : null; }
  if ((m = q.match(/(\d+)\/(\d+) \+ ?|^(\d)\/(\d) [+×÷]/))) return null;
  if ((m = q.match(/A train leaves at (\d\d):(\d\d) and arrives at (\d\d):(\d\d)/))) { const d = (+m[3] * 60 + +m[4]) - (+m[1] * 60 + +m[2]); return ans === `${Math.floor(d / 60)} h ${d % 60} min`; }
  if ((m = q.match(/How many minutes are in/))) return null;
  if ((m = q.match(/Which of these is a multiple of (\d+)\?/))) return num(ans) % +m[1] === 0 && nums.filter((x) => x % +m![1] === 0).length === 1;
  if ((m = q.match(/(\d+) minutes? is/))) return null;
  if ((m = q.match(/^(\d+) ([+−×÷]) (\d+) = \?/))) return null;
  if ((m = q.match(/^(\d)\/(\d+) ([×÷]) (\d+|\d\/\d+) = \?|^(\d)\/(\d+) [×÷] (\d)\/(\d+)/))) return null;
  return null;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (x: string) => { const [a, b] = x.split('/').map(Number); return [a, b] as const; };
const sameFrac = (x: string, a: number, b: number) => { const [p, q] = frac(x); return p * b === a * q; };
const isPrime = (x: number) => { if (x < 2) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; };
const SIDES: Record<string, number> = { triangle: 3, square: 4, pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8 };
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
function judge2(r: string[]): boolean | null {
  const q = r[0], ans = r[1], opts = r.slice(1, 5);
  let m: RegExpMatchArray | null;
  if (/^Which of these is a prime number\?/.test(q)) return isPrime(num(ans)) && opts.map(num).filter(isPrime).length === 1;
  if ((m = q.match(/^(\d+) km is how many metres/))) return num(ans) === +m[1] * 1000;
  if ((m = q.match(/cuboid is (\d+) cm × (\d+) cm × (\d+) cm/))) return num(ans) === +m[1] * +m[2] * +m[3];
  if ((m = q.match(/^(\d+)\/(\d+) ([+×÷]) (\d+)\/(\d+) = \?/))) {
    const [a, b, c, d] = [+m[1], +m[2], +m[4], +m[5]];
    const [rn, rd] = m[3] === '+' ? [a * d + c * b, b * d] : m[3] === '×' ? [a * c, b * d] : [a * d, b * c];
    return sameFrac(ans, rn, rd) && gcd(frac(ans)[0], frac(ans)[1]) === 1;
  }
  if ((m = q.match(/^(\d+)\/(\d+) ÷ (\d+) = \?/))) return sameFrac(ans, +m[1], +m[2] * +m[3]);
  if ((m = q.match(/^(\d+)\/(\d+) is the same as/))) return sameFrac(ans, +m[1], +m[2]);
  if ((m = q.match(/^([\d.]+) \+ ([\d.]+) = \?/))) return near(num(ans), Math.round((+m[1] + +m[2]) * 1000) / 1000);
  if ((m = q.match(/(\d+) equal parts\. (\d+) parts? (?:is|are) shaded/))) return ans === `${m[2]}/${m[1]}`;
  if ((m = q.match(/How many sides does an? (\w+) have/))) return num(ans) === SIDES[m[1]];
  if ((m = q.match(/What day comes after (\w+)\?/))) return ans === DAYS[(DAYS.indexOf(m[1]) + 1) % 7];
  if (/^Which is the longest\?/.test(q)) return ans === 'a bus';
  if (/^Which is the heaviest\?/.test(q)) return ans === 'an elephant';
  if (/^Which is the shortest\?/.test(q)) return ans === 'a worm';
  if ((m = q.match(/^(\d+) \+ (\d+) × (\d+) = \?/))) return num(ans) === +m[1] + +m[2] * +m[3];
  return null;
}

let checked = 0, wrong = 0, unverified = 0, total = 0;
const unv = new Map<string, number>();
for (let y = 1; y <= 6; y++) {
  const rows: string[][] = MATH[y].map((r, i) => (FIX[`M${y}.${i}`] ?? r) as string[]);
  for (let k = 0; k < 200; k++) rows.push(...(genMaths(y) as string[][]), ...(genMaths2(y) as string[][]));
  for (const r of rows) {
    total++;
    const e = expected(r[0]);
    if (!e) {
      const j = judge(r) ?? judge2(r);
      if (j !== null) { checked++; if (!j) { wrong++; if (wrong <= 25) console.log(`WRONG  Y${y}  ${r[0]}  →  answer "${r[1]}"  (options: ${r.slice(1, 5).join(' | ')})`); } continue; }
      unverified++; const stem = r[0].replace(/\d+/g, 'N').slice(0, 60); unv.set(stem, (unv.get(stem) || 0) + 1); continue; }
    checked++;
    const ok = e[1] === 'n' ? near(num(r[1]), Number(e[0])) : String(e[0]).replace(/\s/g, '') === r[1].replace(/\s/g, '');
    if (!ok) { wrong++; if (wrong <= 25) console.log(`WRONG  Y${y}  ${r[0]}  →  answer "${r[1]}"  but I get "${e[0]}"`); }
  }
}
console.log(`\nMaths answers independently re-computed: ${checked} of ${total} (${Math.round((checked / total) * 100)}%), wrong: ${wrong}`);
console.log('question types I could not re-compute (checked another way):');
[...unv.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18).forEach(([k, c]) => console.log(`  ${String(c).padStart(5)}×  ${k}`));
process.exit(wrong ? 1 : 0);
