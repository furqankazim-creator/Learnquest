import { MATH } from '../src/data/questions';
import { genMaths } from '../src/data/mathsGen';
import { genMaths2 } from '../src/data/mathsGen2';
import { parseViz } from '../src/mathViz';

const byYear: Record<number, { yes: number; no: number }> = {};
const kinds: Record<string, number> = {};
const unmatched = new Map<string, number>();
for (let y = 1; y <= 6; y++) {
  byYear[y] = { yes: 0, no: 0 };
  const rows = [...MATH[y]];
  for (let n = 0; n < 200; n++) rows.push(...genMaths(y), ...genMaths2(y));
  for (const r of rows) {
    const v = parseViz(r[0], r[5]);
    if (v) { byYear[y].yes++; kinds[v.t] = (kinds[v.t] || 0) + 1; }
    else { byYear[y].no++; const stem = r[0].replace(/\d+/g, 'N').replace(/£N(\.N+)?/g, '£N').slice(0, 70); unmatched.set(y + ': ' + stem, (unmatched.get(y + ': ' + stem) || 0) + 1); }
  }
}
for (const y of [1, 2, 3, 4, 5, 6]) { const { yes, no } = byYear[y]; console.log('Year', y, 'with picture:', Math.round((yes / (yes + no)) * 100) + '%'); }
console.log('picture kinds:', kinds);
console.log('--- question types with NO picture yet (sample) ---');
[...unmatched.entries()].sort((a, b) => b[1] - a[1]).slice(0, 28).forEach(([k]) => console.log(' ', k));
