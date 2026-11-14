// Works out what picture best helps a child solve a Maths question, from the question text.
// Pure logic (no React) so it can be tested on its own.

export type Viz =
  | { t: 'op'; op: '+' | '-' | 'x'; a: number; b: number; e: string }
  | { t: 'groups'; parts: number; per: number; shade: number; rem: number; e: string }
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

export function parseViz(raw: string, e: string): Viz | null {
  const t = raw.trim();
  let m: RegExpMatchArray | null;

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
  m = t.match(/holds (\d+) [\w ]+?\.\s*How many [\w ]+? (?:are )?in (\d+) \w+\?/);
  if (m && Number(m[2]) <= 10 && Number(m[1]) * Number(m[2]) <= 60) return { t: 'groups', parts: Number(m[2]), per: Number(m[1]), shade: 0, rem: 0, e };
  m = t.match(/(\d+) [\w ]+? (?:are )?shared equally between (\d+) /);
  if (m && Number(m[1]) % Number(m[2]) === 0 && Number(m[1]) <= 60 && Number(m[2]) <= 10) return { t: 'groups', parts: Number(m[2]), per: Number(m[1]) / Number(m[2]), shade: 0, rem: 0, e };
  m = t.match(/There are (\d+) children\. They make teams of (\d+)\./);
  if (m && Number(m[1]) <= 60 && Number(m[1]) % Number(m[2]) === 0 && Number(m[1]) / Number(m[2]) <= 10) return { t: 'groups', parts: Number(m[1]) / Number(m[2]), per: Number(m[2]), shade: 0, rem: 0, e };

  const nums = t.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 2 && !UNITS.test(t) && nums[0] < 1000 && nums[1] < 1000) {
    if (/\b(more|gets|given|finds|altogether|in all)\b/i.test(t)) return { t: 'op', op: '+', a: nums[0], b: nums[1], e };
    if (/\b(left|away|sold|spent|eats|ate)\b/i.test(t) && nums[1] <= nums[0]) return { t: 'op', op: '-', a: nums[0], b: nums[1], e };
  }
  return null;
}
