import { ENG, SCI } from '../src/data/questions';
import { ENG_X, SCI_X } from '../src/data/extras';
import { ENG_Y, SCI_Y } from '../src/data/pack2';
import { FIX } from '../src/data/fixes';
import { EX_E, EX_S } from '../src/data/examples';
const show = (tag: 'E' | 'S', y: number, i: number, q: string, ex: string) => console.log(`${tag}${y}.${i}`.padEnd(6), q.slice(0, 52).padEnd(52), '|', ex.slice(0, 62));
const idxs = (process.argv[2] || '0,11,12,23,24,35').split(',').map(Number);
for (let y = 1; y <= 6; y++) {
  const E = [...ENG[y], ...ENG_X[y], ...ENG_Y[y]].map((r, i) => FIX[`E${y}.${i}`] ?? r);
  const S = [...SCI[y], ...SCI_X[y], ...SCI_Y[y]].map((r, i) => FIX[`S${y}.${i}`] ?? r);
  for (const i of idxs) { show('E', y, i, E[i][0], EX_E[y][i]); }
  for (const i of idxs) { show('S', y, i, S[i][0], EX_S[y][i]); }
}
