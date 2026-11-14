import { ENG, SCI } from '../src/data/questions';
import { ENG_X, SCI_X } from '../src/data/extras';
import { ENG_Y, SCI_Y } from '../src/data/pack2';
import { FIX } from '../src/data/fixes';
import { emojiForOptions } from '../src/data/optionEmoji';
let hit = 0, total = 0; const miss = new Map<string, number>(); const examples: string[] = [];
for (const [tag, B, X, Y] of [['E', ENG, ENG_X, ENG_Y], ['S', SCI, SCI_X, SCI_Y]] as const) for (let y = 1; y <= 6; y++) {
  [...B[y], ...X[y], ...Y[y]].map((r, i) => FIX[`${tag}${y}.${i}`] ?? r).forEach((q, i) => {
    total++;
    const o = [q[1], q[2], q[3], q[4]];
    const e = emojiForOptions(o);
    if (e) { hit++; if (examples.length < 14 && i % 5 === 0) examples.push(`${tag}${y}.${i} ${q[0].slice(0, 40)} → ${o.map((x, k) => (e[k] || '·') + x).join(' | ')}`); }
    else o.forEach((x) => { const k = x.toLowerCase(); miss.set(k, (miss.get(k) || 0) + 1); });
  });
}
console.log(`questions whose answers get pictures: ${hit} / ${total}`);
examples.forEach((x) => console.log('  ' + x));
console.log('--- most common answer words with no picture (single words) ---');
console.log([...miss.entries()].filter(([k]) => /^[a-z’' -]{2,14}$/.test(k) && k.split(' ').length <= 2).sort((a, b) => b[1] - a[1]).slice(0, 150).map(([k, n]) => k + (n > 1 ? '×' + n : '')).join(', '));
