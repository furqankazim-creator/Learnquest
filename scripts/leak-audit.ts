// Finds English/Science questions where the big picture or the real-life example gives the answer away.
import { ENG, SCI } from '../src/data/questions';
import { ENG_X, SCI_X } from '../src/data/extras';
import { ENG_Y, SCI_Y } from '../src/data/pack2';
import { FIX } from '../src/data/fixes';
import { EX_E, EX_S } from '../src/data/examples';
import { emojiForOptions } from '../src/data/optionEmoji';
import { PIC_FIX } from '../src/data/pictureFixes';

const norm = (s: string) => s.toLowerCase().replace(/[“”‘’"'.,!?()]/g, '').replace(/\s+/g, ' ').trim();
const STOP = new Set(['the', 'and', 'with', 'that', 'this', 'from', 'when', 'what', 'which', 'into', 'they', 'them', 'have', 'there', 'their', 'your', 'you', 'for', 'are', 'was', 'can', 'its', 'more', 'than', 'only', 'one', 'two', 'not', 'but', 'then']);
let picBad = 0, exBad = 0; const picList: string[] = [], exList: string[] = [];
for (const [tag, B, X, Y, EX] of [['E', ENG, ENG_X, ENG_Y, EX_E], ['S', SCI, SCI_X, SCI_Y, EX_S]] as const) for (let y = 1; y <= 6; y++) {
  [...B[y], ...X[y], ...Y[y]].map((r, i) => FIX[`${tag}${y}.${i}`] ?? r).forEach((q, i) => {
    const opts = [q[1], q[2], q[3], q[4]];
    // 1) the big emoji must not be the picture of ANY answer
    const oe = emojiForOptions(opts);
    const bigE = PIC_FIX[`${tag}${y}.${i}`] ?? q[5];
    const wordsEmoji = opts.map((o) => (oe ? oe[opts.indexOf(o)] : undefined));
    if (oe && wordsEmoji.includes(bigE)) { picBad++; picList.push(`${tag}${y}.${i} ${bigE}  ${q[0].slice(0, 50)} → ${q[1]}`); }
    // 2) the real-life example must not contain the correct answer
    const ex = norm(EX[y][i] || '');
    const ans = norm(q[1]);
    const keyWords = ans.split(' ').filter((w) => w.length >= 4 && !STOP.has(w));
    const leaks = ans.length >= 3 && (ex.includes(ans) || (keyWords.length > 0 && keyWords.every((w) => ex.includes(w))));
    if (leaks) { exBad++; exList.push(`${tag}${y}.${i} A="${q[1].slice(0, 28)}"  ex="${(EX[y][i] || '').slice(0, 70)}"`); }
  });
}
console.log('big picture shows an answer:', picBad); picList.slice(0, 30).forEach((x) => console.log('  ' + x));
console.log('real-life example states the answer:', exBad); exList.slice(0, 40).forEach((x) => console.log('  ' + x));
