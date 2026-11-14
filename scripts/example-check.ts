import { MATH } from '../src/data/questions';
import { genMaths } from '../src/data/mathsGen';
import { genMaths2 } from '../src/data/mathsGen2';
import { exampleText, parseViz } from '../src/mathViz';
let withViz = 0, withEx = 0, bad = 0;
const sample = new Map<string, string>();
for (let y = 1; y <= 6; y++) {
  const rows = [...MATH[y]];
  for (let n = 0; n < 100; n++) rows.push(...genMaths(y), ...genMaths2(y));
  for (const r of rows) {
    const v = parseViz(r[0], r[5]);
    if (!v) continue;
    withViz++;
    const ex = exampleText(v, r[0]);
    if (ex) {
      withEx++;
      if (/undefined|NaN|null|\[object/.test(ex)) { bad++; console.log('BAD', r[0], '→', ex); }
      if (!sample.has(v.t)) sample.set(v.t, r[0] + '\n      → ' + ex);
    }
  }
}
console.log({ withViz, withExample: withEx, bad });
sample.forEach((x, k) => console.log(' ', k.padEnd(10), x));
