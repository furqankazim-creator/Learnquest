// Prints each picture next to the question it is attached to, so a human can check they match.
import { ENG, SCI } from '../src/data/questions';
import { ENG_X, SCI_X } from '../src/data/extras';
import { ENG_Y, SCI_Y } from '../src/data/pack2';
import { FIX } from '../src/data/fixes';
import { ENG_VIS, SCI_VIS } from '../src/data/visuals';
let n = 0;
for (let y = 1; y <= 6; y++) {
  const S = [...SCI[y], ...SCI_X[y], ...SCI_Y[y]].map((r, i) => FIX[`S${y}.${i}`] ?? r);
  const E = [...ENG[y], ...ENG_X[y], ...ENG_Y[y]].map((r, i) => FIX[`E${y}.${i}`] ?? r);
  for (const [i, v] of Object.entries(SCI_VIS[y] || {})) { n++; console.log(`S${y}.${i}`.padEnd(6), (v as any).t.padEnd(10), '|', S[Number(i)]?.[0]?.slice(0, 66) ?? '!!! NO QUESTION'); }
  for (const [i, v] of Object.entries(ENG_VIS[y] || {})) { n++; console.log(`E${y}.${i}`.padEnd(6), (v as any).t.padEnd(10), '|', E[Number(i)]?.[0]?.slice(0, 66) ?? '!!! NO QUESTION'); }
}
console.log('total pictures:', n);
