import { ENG, SCI } from '../src/data/questions';
import { ENG_X, SCI_X } from '../src/data/extras';
import { ENG_Y, SCI_Y } from '../src/data/pack2';
import { FIX } from '../src/data/fixes';
const [, , TAG = 'S', YEARS = '1,2,3'] = process.argv;
for (const y of YEARS.split(',').map(Number)) {
  const B: any = TAG === 'S' ? [SCI, SCI_X, SCI_Y] : [ENG, ENG_X, ENG_Y];
  [...B[0][y], ...B[1][y], ...B[2][y]].map((r: any, i: number) => FIX[`${TAG}${y}.${i}`] ?? r).forEach((q: any, i: number) => console.log(`${TAG}${y}.${i} ${q[5]} ${q[0].slice(0, 58)} => ${q[1].slice(0, 30)}`));
}
