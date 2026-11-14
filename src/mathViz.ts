// Works out what picture best helps a child solve a Maths question, from the question text.
// Pure logic (no React) so it can be tested on its own.

export type Viz =
  | { t: 'op'; op: '+' | '-' | 'x'; a: number; b: number; e: string; word?: boolean }
  | { t: 'groups'; parts: number; per: number; shade: number; rem: number; e: string; word?: boolean }
  | { t: 'steps'; step: number; known: number[]; first?: boolean }
  | { t: 'bar'; parts: number; shade: number; second?: number }
  | { t: 'polygon'; sides: number }
  | { t: 'clock'; h: number; m: number }
  | { t: 'rect'; l: number; w: number }
  | { t: 'place'; n: number }
  | { t: 'part'; kind: 'add' | 'sub' | 'div'; a: number; b: number }
  | { t: 'area'; a: number; b: number }
  | { t: 'percent'; p: number; n: number }
  | { t: 'balance'; dots: number; boxes: number; right: number }
  | { t: 'tri'; base: number; height: number; equal?: boolean }
  | { t: 'round'; n: number; unit: number }
  | { t: 'coins'; items: number[]; op: '+' | '-' | 'x' }
  | { t: 'compare'; a: number; b: number; la: string; lb: string }
  | { t: 'pictogram'; each: number; count: number }
  | { t: 'coord'; x: number; y: number; dx: number; dy: number };

const OPCHAR: Record<string, '+' | '-' | 'x' | '/'> = { '+': '+', '−': '-', '-': '-', '×': 'x', '÷': '/' };
const FRAC: Record<string, [number, number]> = { '½': [1, 2], '⅓': [1, 3], '¼': [1, 4], '⅔': [2, 3], '¾': [3, 4], '⅕': [1, 5], '⅗': [3, 5] };
const SIDES: Record<string, number> = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8 };
const UNITS = /(\d\s?(cm|mm|km|ml|kg|g|m|°)\b|\d+p\b|£|%|:)/;
const num = (s: string) => Number(s.replace(/,/g, ''));

// n things split into `parts` equal boxes; `shade` boxes highlighted
function fractionOf(parts: number, shade: number, n: number, e: string): Viz | null {
  if (parts < 2 || n <= 0) return null;
  if (n <= 60 && n % parts === 0 && parts <= 10) return { t: 'groups', parts, per: n / parts, shade, rem: 0, e };
  return { t: 'bar', parts, shade };
}

// Everyday things used to make a bare sum feel real. Chosen from the question text so it stays the same.
export const CONTEXTS = [
  { e: '⭐', many: 'stickers' }, { e: '🍎', many: 'apples' }, { e: '🍪', many: 'cookies' }, { e: '🚗', many: 'toy cars' },
  { e: '🎈', many: 'balloons' }, { e: '📚', many: 'books' }, { e: '🍬', many: 'sweets' }, { e: '✏️', many: 'pencils' },
  { e: '⚽', many: 'footballs' }, { e: '🍓', many: 'strawberries' },
];
export function contextFor(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return CONTEXTS[h % CONTEXTS.length];
}

export function parseViz(raw: string, emoji: string): Viz | null {
  const t = raw.trim();
  let m: RegExpMatchArray | null;
  const ctx = contextFor(t);
  let e = ctx.e; // symbolic questions get an everyday object; word problems use the question's own emoji

  // 47 + 12 = ?   9 − 4 = ?   7 × 4 = ?   48 ÷ 6 = ?
  m = t.match(/^(\d+)\s*([+−\-×÷])\s*(\d+)\s*=\s*\?/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[3]);
    const op = OPCHAR[m[2]];
    if (op === '+' || op === '-') {
      if (a < 1000 && b < 1000) return { t: 'op', op, a, b, e };
      return { t: 'part', kind: op === '+' ? 'add' : 'sub', a, b };
    }
    if (op === 'x') {
      if (a <= 12 && b <= 12) return { t: 'op', op, a, b, e };
      return a <= 999 && b <= 30 ? { t: 'area', a, b } : null;
    }
    if (op === '/') {
      if (b >= 1 && a <= 100 && a / b <= 12) return { t: 'groups', parts: Math.floor(a / b), per: b, shade: 0, rem: a % b, e };
      return b >= 2 && b <= 12 ? { t: 'part', kind: 'div', a, b } : null;
    }
  }

  // Double 9 is…
  m = t.match(/^Double (\d+)/i);
  if (m) return { t: 'op', op: '+', a: Number(m[1]), b: Number(m[1]), e };

  // Half of 12 / Quarter of 8 / ¼ of 24 / 3/5 of 25 / One tenth of 50
  m = t.match(/^(Half|Quarter) of (\d+)/i);
  if (m) return fractionOf(m[1].toLowerCase() === 'half' ? 2 : 4, 1, Number(m[2]), e);
  m = t.match(/^A quarter of (\d+)/i);
  if (m) return fractionOf(4, 1, Number(m[1]), e);
  m = t.match(/^([½⅓¼⅔¾⅕⅗])\s*of\s*(\d+)/);
  if (m) return fractionOf(FRAC[m[1]][1], FRAC[m[1]][0], Number(m[2]), e);
  m = t.match(/^(\d+)\/(\d+) of (\d+)/);
  if (m) return fractionOf(Number(m[2]), Number(m[1]), Number(m[3]), e);
  m = t.match(/^One tenth of (\d+)/i);
  if (m) return fractionOf(10, 1, Number(m[1]), e);
  m = t.match(/has (\d+) [\w ]+?\.\s*(\d+)\/(\d+) of them/);
  if (m) return fractionOf(Number(m[3]), Number(m[2]), Number(m[1]), e);

  // percentages
  m = t.match(/^(\d+)% of (\d+)/);
  if (m) return { t: 'percent', p: Number(m[1]), n: Number(m[2]) };

  // missing-number sums → balance scales:  n + 7 = 15 · ? + 4 = 9 · 6 + ? = 10 · 3x = 27
  m = t.match(/^(?:n|\?)\s*\+\s*(\d+)\s*=\s*(\d+)/);
  if (m && Number(m[1]) <= 16) return { t: 'balance', dots: Number(m[1]), boxes: 1, right: Number(m[2]) };
  m = t.match(/^(\d+)\s*\+\s*\?\s*=\s*(\d+)/);
  if (m && Number(m[1]) <= 16) return { t: 'balance', dots: Number(m[1]), boxes: 1, right: Number(m[2]) };
  m = t.match(/^(\d+)x\s*=\s*(\d+)/);
  if (m && Number(m[1]) <= 8) return { t: 'balance', dots: 0, boxes: Number(m[1]), right: Number(m[2]) };

  // Count in 5s: 5, 10, 15, ?
  m = t.match(/Count (?:on )?in (\d+)s:\s*((?:\d+,\s*)+)(?:\?|_+)/);
  if (m) {
    const known = m[2].split(',').map((x) => x.trim()).filter(Boolean).map(Number);
    return { t: 'steps', step: Number(m[1]), known };
  }
  m = t.match(/^What number comes after (\d+)/i);
  if (m) return { t: 'steps', step: 1, known: [Number(m[1])] };
  m = t.match(/^What number comes before (\d+)/i);
  if (m) return { t: 'steps', step: 1, known: [Number(m[1])], first: true };
  m = t.match(/(?:What number is |What is |^)(\d+) more than (\d+)/i);
  if (m) return { t: 'steps', step: Number(m[1]), known: [Number(m[2])] };
  m = t.match(/(?:What number is |What is |^)(\d+) less than (\d+)/i);
  if (m) return { t: 'steps', step: Number(m[1]), known: [Number(m[2])], first: true };

  // rounding
  m = t.match(/(?:Round )?([\d,]+)(?: rounded)? to the nearest ([\d,]+)/);
  if (m && num(m[2]) >= 10) return { t: 'round', n: num(m[1]), unit: num(m[2]) };

  // A shape is split into 3 equal parts. 2 parts are shaded.
  m = t.match(/split into (\d+) equal parts\.\s*(\d+) parts? (?:is|are) shaded/);
  if (m) return { t: 'bar', parts: Number(m[1]), shade: Number(m[2]) };
  m = t.match(/^(\d+)\/(\d+)\s*=\s*\?\/(\d+)/);
  if (m) return { t: 'bar', parts: Number(m[2]), shade: Number(m[1]), second: Number(m[3]) };

  // shapes
  m = t.match(/How many sides does an? (\w+) have/i);
  if (m && SIDES[m[1].toLowerCase()]) return { t: 'polygon', sides: SIDES[m[1].toLowerCase()] };
  m = t.match(/triangle has base (\d+) cm and height (\d+) cm/);
  if (m) return { t: 'tri', base: Number(m[1]), height: Number(m[2]) };
  m = t.match(/equilateral triangle has sides of (\d+) cm/);
  if (m) return { t: 'tri', base: Number(m[1]), height: 0, equal: true };

  // place value
  m = t.match(/(\d+) tens? and (\d+) ones?/);
  if (m) return { t: 'place', n: Number(m[1]) * 10 + Number(m[2]) };
  m = t.match(/In the number (\d\d), what is the digit/);
  if (m) return { t: 'place', n: Number(m[1]) };
  m = t.match(/tens digit in (\d{2,3})/);
  if (m) return { t: 'place', n: Number(m[1]) };

  // clocks
  m = t.match(/short hand (?:points to|is near) (\d+) and the long hand points to (\d+)/);
  if (m) return { t: 'clock', h: Number(m[1]), m: (Number(m[2]) % 12) * 5 };
  m = t.match(/(?:starts|leaves) at (\d{1,2}):(\d{2})/);
  if (m) return { t: 'clock', h: Number(m[1]) % 12, m: Number(m[2]) };
  m = t.match(/What is (\d{1,2}):(\d{2}) in 12-hour/);
  if (m) return { t: 'clock', h: Number(m[1]) % 12, m: Number(m[2]) };
  m = t.match(/starts at (\d{1,2}) o'clock/);
  if (m) return { t: 'clock', h: Number(m[1]), m: 0 };

  // rectangles and squares
  m = t.match(/rectangle is (\d+) cm by (\d+) cm/) || t.match(/rectangle is (\d+) cm long and (\d+) cm wide/);
  if (m && Number(m[1]) <= 12 && Number(m[2]) <= 12) return { t: 'rect', l: Number(m[1]), w: Number(m[2]) };
  m = t.match(/square has (?:a side|sides) of (\d+) cm/);
  if (m && Number(m[1]) <= 12) return { t: 'rect', l: Number(m[1]), w: Number(m[1]) };

  // coordinates: a point moves right and up
  m = t.match(/(?:point is at|corner at) \((\d+), (\d+)\)\.[^.]*? (\d+) right and (\d+) up/);
  if (m) return { t: 'coord', x: Number(m[1]), y: Number(m[2]), dx: Number(m[3]), dy: Number(m[4]) };

  // money
  m = t.match(/^(\d+)p \+ (\d+)p = \?/);
  if (m) return { t: 'coins', items: [Number(m[1]), Number(m[2])], op: '+' };
  m = t.match(/costs (\d+)p and a [\w ]+? costs (\d+)p/);
  if (m) return { t: 'coins', items: [Number(m[1]), Number(m[2])], op: '+' };
  m = t.match(/costs (\d+)p\. How much do (\d+) [\w ]+? cost/);
  if (m && Number(m[2]) <= 6) return { t: 'coins', items: Array(Number(m[2])).fill(Number(m[1])), op: 'x' };
  m = t.match(/costs (\d+)p\. You pay with a (\d+)p coin/);
  if (m) return { t: 'coins', items: [Number(m[2]), Number(m[1])], op: '-' };

  // data
  m = t.match(/(\w+) ribbon is (\d+) cm long\. A (\w+) ribbon is (\d+) cm long/);
  if (m) return { t: 'compare', a: Number(m[2]), b: Number(m[4]), la: `${m[1]}`.toLowerCase(), lb: m[3] };
  m = t.match(/bar chart shows (\d+) (\w+) and (\d+) (\w+)/);
  if (m) return { t: 'compare', a: Number(m[1]), b: Number(m[3]), la: m[2], lb: m[4] };
  m = t.match(/each star ⭐ stands for (\d+) children\. There are (\d+) stars/);
  if (m && Number(m[2]) <= 10) return { t: 'pictogram', each: Number(m[1]), count: Number(m[2]) };

  // ---- word problems (no units or money, so the picture is just counting things) ----
  e = emoji;
  m = t.match(/holds (\d+) [\w ]+?\.\s*How many [\w ]+? (?:are )?in (\d+) \w+\?/);
  if (m && Number(m[2]) <= 10 && Number(m[1]) * Number(m[2]) <= 60) return { t: 'groups', parts: Number(m[2]), per: Number(m[1]), shade: 0, rem: 0, e, word: true };
  m = t.match(/(\d+) [\w ]+? (?:are )?shared equally between (\d+) /);
  if (m && Number(m[1]) % Number(m[2]) === 0 && Number(m[1]) <= 60 && Number(m[2]) <= 10) return { t: 'groups', parts: Number(m[2]), per: Number(m[1]) / Number(m[2]), shade: 0, rem: 0, e, word: true };
  m = t.match(/There are (\d+) children\. They make teams of (\d+)\./);
  if (m && Number(m[1]) <= 60 && Number(m[1]) % Number(m[2]) === 0 && Number(m[1]) / Number(m[2]) <= 10) return { t: 'groups', parts: Number(m[1]) / Number(m[2]), per: Number(m[2]), shade: 0, rem: 0, e, word: true };

  const nums = t.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 2 && !UNITS.test(t) && nums[0] < 1000 && nums[1] < 1000) {
    if (/\b(more|gets|given|finds|altogether|in all)\b/i.test(t)) return { t: 'op', op: '+', a: nums[0], b: nums[1], e, word: true };
    if (/\b(left|away|sold|spent|eats|ate)\b/i.test(t) && nums[1] <= nums[0]) return { t: 'op', op: '-', a: nums[0], b: nums[1], e, word: true };
  }
  return null;
}

// A short real-life story that explains the picture. Returns null when the question is already a story.
export function exampleText(v: Viz, text: string): string | null {
  const n = contextFor(text.trim()).many;
  switch (v.t) {
    case 'op':
      if (v.word) return null;
      if (v.op === '+') return `Imagine you have ${v.a} ${n} and a friend gives you ${v.b} more. Put them all together and count how many you have now.`;
      if (v.op === '-') return `Imagine you have ${v.a} ${n} and you give ${v.b} away to your friends. Count how many you still have.`;
      return `Picture ${v.a} rows with ${v.b} ${n} in every row. Count them all, or count in ${v.b}s to go faster.`;
    case 'groups': {
      if (v.word) return null;
      const total = v.parts * v.per + v.rem;
      if (v.shade === 0) return `Imagine you have ${total} ${n} and put ${v.per} in each bag. How many full bags can you fill?${v.rem ? ' A few are left over!' : ''}`;
      if (v.parts === 2) return `Share ${total} ${n} fairly between 2 friends. Each friend gets half.`;
      return `Put ${total} ${n} into ${v.parts} equal piles. The coloured pile${v.shade > 1 ? 's are' : ' is'} ${v.shade} out of ${v.parts} of them.`;
    }
    case 'steps':
      if (v.first) return v.step === 1 ? 'Like the house number just before yours on the street: count back one.' : `Hop back ${v.step} to find the starting number, like going back down the stairs.`;
      if (v.step === 1) return 'Like the next house number along your street: just count on one.';
      return ({ 2: 'Counting in 2s is like counting socks in pairs.', 3: 'Counting in 3s is like counting the wheels on tricycles.', 4: 'Counting in 4s is like counting the legs on dogs.', 5: 'Counting in 5s is like counting the fingers on each hand.', 10: 'Counting in 10s is like counting a pile of 10p coins.' } as Record<number, string>)[v.step] ?? `Each hop adds ${v.step}, like climbing stairs that are all the same size.`;
    case 'place': {
      const h = Math.floor(v.n / 100), t = Math.floor(v.n / 10) % 10, o = v.n % 10;
      return `Think of ${v.n} stickers: ${h ? `${h} big ${h === 1 ? 'sheet' : 'sheets'} of 100, ` : ''}${t} ${t === 1 ? 'strip' : 'strips'} of ten and ${o} single ${o === 1 ? 'sticker' : 'stickers'}.`;
    }
    case 'bar':
      return v.second ? 'Equivalent fractions are like cutting the same chocolate bar into more, smaller pieces: it is still the same amount of chocolate.' : `Like a chocolate bar snapped into ${v.parts} equal pieces. The orange pieces are the ones you eat.`;
    case 'polygon':
      return ({ 3: 'A triangle has 3 sides, like a warning sign on the road.', 4: 'A four-sided shape is like a window or a book cover.', 5: 'A pentagon has 5 sides, like a child’s drawing of a house.', 6: 'A hexagon has 6 sides, like each cell in a honeycomb.', 7: 'A heptagon has 7 sides, like some coins.', 8: 'An octagon has 8 sides, like a stop sign.' } as Record<number, string>)[v.sides] ?? null;
    case 'clock':
      return 'The short hand tells the hour and the long hand tells the minutes, just like the clock on your classroom wall.';
    case 'rect':
      return 'Imagine covering the floor with square tiles. Counting the tiles gives the area. Walking round the edge gives the perimeter.';
    case 'part':
      if (v.kind === 'add') return `Two piggy banks hold ${v.a} and ${v.b} coins. Tip them into one box to find out how many you have altogether.`;
      if (v.kind === 'sub') return `You are saving up for a toy that costs ${v.a}. You already have ${v.b}. How much more do you need?`;
      return `Share ${v.a} sweets equally between ${v.b} friends. How many does each friend get?`;
    case 'area':
      return 'Imagine tiling a floor in two or three sections. Work out each section, then add the areas together.';
    case 'percent':
      return `Like a shop sign saying "${v.p}% off": the coloured part of the bar shows how much of the whole you are looking at.`;
    case 'balance':
      return 'Like a seesaw: both sides must weigh the same. Work out what the mystery box must be to keep it level.';
    case 'tri':
      return v.equal ? 'An equilateral triangle has three sides that are all the same length, like a road sign.' : 'Like a triangular sandwich slice: the base runs along the bottom and the height goes straight up.';
    case 'round':
      return 'Like rounding a price in a shop: is it closer to the lower number or the higher one? Halfway or more rounds up.';
    case 'coins':
      return v.op === '+' ? 'At the shop, put the coins together to see how much you need to pay.' : v.op === '-' ? 'You pay with a bigger coin and the shopkeeper gives you change back.' : 'Buying the same thing again and again: count all the coins you will spend.';
    case 'compare':
      return 'Like comparing the height of two friends: take away the shorter bar from the longer bar to see the difference.';
    case 'pictogram':
      return 'Each star stands for a group, like one tally mark for every pair of children.';
    case 'coord':
      return 'Like moving a toy along a treasure map: go across first, then go up.';
  }
}
