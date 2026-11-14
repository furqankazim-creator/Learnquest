import { ENG, MATH, SCI } from '../src/data/questions';
import { ENG_X, SCI_X } from '../src/data/extras';
import { genMaths, wrongNums } from '../src/data/mathsGen';
import { genMaths2 } from '../src/data/mathsGen2';
import { ENG_Y, SCI_Y } from '../src/data/pack2';
import { FIX } from '../src/data/fixes';

let bad = 0, total = 0;
const chk = (q: any[], tag: string) => {
  total++;
  const o = q.slice(1, 5).map((x: string) => x.trim());
  if (o.length !== 4 || new Set(o).size !== 4 || o.some((x: string) => !x || x === 'nan' || x.includes('undefined') || x.startsWith('-0'))) { bad++; console.log('BAD', tag, JSON.stringify(q)); }
  if (!q[5]) { bad++; console.log('NOEMOJI', tag, q[0]); }
  if (/[⅒⅗]/.test(q.join(''))) { bad++; console.log('RARE GLYPH', tag, q[0]); }
};
const pools: Record<string, any[][]> = {};
for (let y = 1; y <= 6; y++) {
  const apply = (s: string, arr: any[][]) => arr.map((r, i) => FIX[`${s}${y}.${i}`] ?? r);
  pools['E' + y] = apply('E', [...ENG[y], ...ENG_X[y], ...ENG_Y[y]]);
  pools['S' + y] = apply('S', [...SCI[y], ...SCI_X[y], ...SCI_Y[y]]);
  pools['M' + y] = apply('M', [...MATH[y]]);
}
for (const k of Object.keys(FIX)) { const [id] = k.split('.'); if (!pools[id]) console.log('FIX key for unknown pool', k); }
for (const [tag, arr] of Object.entries(pools)) {
  arr.forEach((q) => chk(q, tag));
  const seenQ = new Map<string, number>(), seenA = new Map<string, string>();
  arr.forEach((q, i) => {
    const nq = q[0].toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (seenQ.has(nq)) { bad++; console.log('DUP QUESTION', tag, q[0]); }
    seenQ.set(nq, i);
    if (tag[0] !== 'M') {
      const na = String(q[1]).toLowerCase();
      if (seenA.has(na)) console.log('same answer twice', tag, '"' + q[1] + '"', '|', seenA.get(na), '|', q[0]);
      seenA.set(na, q[0]);
    }
  });
}
for (let y = 1; y <= 6; y++) {
  if (genMaths(y).length !== 12 || genMaths2(y).length !== 12) console.log('GEN COUNT', y);
  if (ENG_Y[y].length !== 12 || SCI_Y[y].length !== 12) console.log('PACK2 COUNT', y);
  for (let n = 0; n < 500; n++) { genMaths(y).forEach((q) => chk(q, 'G' + y)); genMaths2(y).forEach((q) => chk(q, 'H' + y)); }
}
for (const a of [0, 1, 3, 8, 12, 25, 99, 144, 365, 1000, 2250, 4326]) for (let n = 0; n < 200; n++) {
  const w = wrongNums(a);
  if (w.length !== 3 || new Set([a, ...w]).size !== 4 || w.some((x) => x < 0)) { bad++; console.log('WRONGNUMS', a, w); break; }
}
let passages = 0; for (const arr of Object.values(pools)) arr.forEach((q) => { if (q[7]) passages++; });
console.log('reading-passage questions:', passages);
console.log('checked', total, 'bad', bad);
