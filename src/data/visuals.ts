// Which picture goes with which English / Science question (key = year, then index in the 36-question pool).
// A picture shows the idea like a textbook figure, using its own example, never highlighting the answer.
import type { EngSpec, Item, SciSpec } from './visualTypes';

const it = (e: string, l: string): Item => ({ e, l });
const row = (...items: Item[]): SciSpec => ({ t: 'row', items });
const chain = (...items: Item[]): SciSpec => ({ t: 'chain', items });
const cycle = (...items: Item[]): SciSpec => ({ t: 'cycle', items });

const PLANT: SciSpec = { t: 'plant' };
const STATES: SciSpec = { t: 'states' };
const SOLAR: SciSpec = { t: 'solar' };
const DAYNIGHT: SciSpec = { t: 'daynight' };
const PHASES: SciSpec = { t: 'phases' };
const ORBIT: SciSpec = { t: 'orbit' };
const DIGEST: SciSpec = { t: 'digestive' };
const TEETH: SciSpec = { t: 'teeth' };
const SKELETON: SciSpec = { t: 'skeleton' };
const HEART: SciSpec = { t: 'heart' };
const SHADOW: SciSpec = { t: 'shadow' };
const REFLECT: SciSpec = { t: 'reflect' };
const REFRACT: SciSpec = { t: 'refract' };
const CIRCUIT: SciSpec = { t: 'circuit' };
const WATER = cycle(it('☀️', 'sun warms the water'), it('☁️', 'clouds form'), it('🌧️', 'rain falls'), it('🌊', 'water collects'));
const SEASONS = cycle(it('🌸', 'spring'), it('☀️', 'summer'), it('🍂', 'autumn'), it('❄️', 'winter'));

export const SCI_VIS: Record<number, Record<number, SciSpec>> = {
  1: {
    3: PLANT, 7: PLANT, 14: PLANT,
    10: row(it('🧥', 'plastic coat'), it('📄', 'paper'), it('🧽', 'sponge')),
    13: chain(it('🥚', 'egg'), it('🐥', 'chick'), it('🐔', 'hen')),
    17: row(it('🍎', 'food'), it('💧', 'water'), it('🌬️', 'air'), it('🏠', 'shelter')),
    28: WATER,
    31: row(it('☀️', 'sunny'), it('🌧️', 'rainy'), it('💨', 'windy'), it('❄️', 'snowy')),
    34: row(it('🥕', 'vegetables'), it('🍎', 'fruit'), it('🍞', 'bread'), it('🥛', 'milk')),
    35: chain(it('❓', 'ask'), it('🔬', 'test'), it('👀', 'look'), it('📝', 'tell')),
  },
  2: {
    0: chain(it('🌿', 'grass'), it('🐇', 'rabbit'), it('❓', 'what eats the rabbit?')),
    2: PLANT,
    6: row(it('🌳', 'tree: a bird’s home'), it('🌊', 'pond: a fish’s home'), it('🪨', 'stone: a beetle’s home')),
    8: cycle(it('🌰', 'seed'), it('🌱', 'seedling'), it('🌻', 'plant'), it('🌼', 'flower')),
    12: SEASONS,
    13: { t: 'legs', n: 6 },
    21: STATES, 32: STATES,
    27: PLANT,
    34: chain(it('❓', 'ask'), it('🔬', 'test'), it('📏', 'measure'), it('📝', 'results')),
  },
  3: {
    2: PLANT, 13: PLANT,
    3: SHADOW, 15: SHADOW, 29: SHADOW,
    7: { t: 'force', kind: 'gravity' }, 12: { t: 'force', kind: 'push' }, 25: { t: 'force', kind: 'push' }, 20: { t: 'force', kind: 'friction' },
    17: SKELETON, 35: SKELETON,
    21: REFLECT,
    27: chain(it('🌰', 'seed'), it('💧', 'water and warmth'), it('🌱', 'new shoot')),
    32: row(it('🪟', 'window glass'), it('🛍️', 'tissue paper'), it('🚪', 'wooden door')),
  },
  4: {
    0: DIGEST, 12: DIGEST, 25: DIGEST,
    1: CIRCUIT, 5: CIRCUIT, 13: CIRCUIT, 35: { t: 'circuit', buzzer: true },
    2: WATER, 18: WATER,
    3: { t: 'sound', kind: 'pitch' }, 8: { t: 'sound', kind: 'vibration' }, 15: { t: 'sound', kind: 'vibration' }, 21: { t: 'sound', kind: 'volume' },
    4: TEETH, 19: TEETH, 28: TEETH,
    6: STATES, 22: STATES, 24: STATES, 31: STATES,
    14: { t: 'thermo', v: 100, e: '♨️', l: 'water boils' }, 32: { t: 'thermo', v: 100, e: '♨️', l: 'water boils' },
    29: chain(it('☀️', 'sun'), it('🌿', 'plant'), it('🐛', 'caterpillar'), it('🐦', 'bird')),
  },
  5: {
    0: DAYNIGHT, 30: DAYNIGHT,
    1: { t: 'force', kind: 'air' }, 5: { t: 'force', kind: 'gravity' }, 18: { t: 'force', kind: 'friction' }, 28: { t: 'force', kind: 'water' },
    4: SOLAR, 12: SOLAR, 13: SOLAR, 14: SOLAR, 20: SOLAR,
    8: ORBIT, 15: ORBIT,
    11: PHASES, 31: PHASES,
    27: STATES,
  },
  6: {
    0: HEART, 6: HEART, 8: HEART, 12: HEART, 13: HEART, 23: HEART,
    2: REFLECT, 15: REFLECT, 9: SHADOW, 27: REFRACT,
    3: { t: 'circuit', cells: 2 }, 25: { t: 'circuit', bulbs: 2 }, 26: { t: 'circuit', bulbs: 2 }, 33: { t: 'circuit', buzzer: true, cells: 2 },
    28: { t: 'classify', groups: [{ title: 'mammals', items: ['🐕', '🐋'] }, { title: 'birds', items: ['🦜', '🐧'] }, { title: 'fish', items: ['🐟', '🦈'] }, { title: 'reptiles', items: ['🦎', '🐍'] }] },
  },
};

const MARKS: EngSpec = { t: 'marks' };
const WORDCLASS: EngSpec = { t: 'wordclass' };
const POSITION: EngSpec = { t: 'position' };
const tl = (past: string, now: string, future: string): EngSpec => ({ t: 'timeline', past, now, future });
const ws = (parts: string[], result: string, note?: string): EngSpec => ({ t: 'wordsum', parts, result, note });
const pair = (a: Item, b: Item, label: string): EngSpec => ({ t: 'pair', a, b, label });
const many = (e: string, one: string, manyW: string): EngSpec => ({ t: 'onemany', e, one, many: manyW });
const scene = (caption: string, ...items: Item[]): EngSpec => ({ t: 'scene', items, caption });

export const ENG_VIS: Record<number, Record<number, EngSpec>> = {
  1: {
    2: { t: 'boxes', parts: ['s', 'u', 'n'], label: 'a CVC word: consonant – vowel – consonant' },
    5: pair(it('🐝', 'bee'), it('🌳', 'tree'), 'rhyming words end with the same sound'),
    12: pair(it('⭐', 'star'), it('🚗', 'car'), 'rhyming words end with the same sound'),
    31: pair(it('🌙', 'moon'), it('🥄', 'spoon'), 'rhyming words end with the same sound'),
    6: pair(it('🔥', 'hot'), it('❄️', 'cold'), 'opposites mean the reverse'),
    34: pair(it('🔥', 'hot'), it('❄️', 'cold'), 'opposites mean the reverse'),
    7: WORDCLASS, 33: WORDCLASS,
    11: MARKS, 17: MARKS,
    18: many('🍎', 'one apple', 'many apples'),
    24: scene('Pip and his dog', it('🧒', 'Pip'), it('🐕', 'a dog')),
    25: scene('Pip and his dog', it('🧒', 'Pip'), it('🐕', 'a dog')),
    35: tl('jumped', 'jump', 'will jump'),
  },
  2: {
    1: ws(['jump', 'ing'], 'jumping', 'a root word + a suffix'),
    2: WORDCLASS, 4: WORDCLASS, 12: WORDCLASS, 28: WORDCLASS,
    3: many('🚗', 'one car', 'many cars'),
    6: tl('played', 'play', 'will play'), 27: tl('walked', 'walk', 'will walk'),
    9: MARKS, 14: MARKS, 34: MARKS,
    15: pair(it('⬆️', 'up'), it('⬇️', 'down'), 'opposites mean the reverse'),
    16: ws(['can', 'not'], 'can’t', 'the apostrophe replaces a letter'),
    19: ws(['un', 'tidy'], 'untidy', 'a prefix + a root word'),
    21: many('🐭', 'one mouse', 'many mice'),
    24: scene('a windy day at the park', it('🪁', 'a red kite'), it('💨', 'strong wind'), it('🌧️', 'rain'), it('🏠', 'home')),
    25: scene('a windy day at the park', it('🪁', 'a red kite'), it('💨', 'strong wind'), it('🌧️', 'rain'), it('🏠', 'home')),
    32: { t: 'clause', a: 'We stayed in', c: 'because', b: 'it rained' },
  },
  3: {
    0: WORDCLASS, 2: WORDCLASS,
    1: ws(['un', 'kind'], 'unkind', 'a prefix + a root word'),
    3: { t: 'bubble', text: 'Look at that!', who: '👧' },
    6: many('🏖️', 'one beach', 'many beaches'),
    7: pair(it('☀️', 'sun'), it('👦', 'son'), 'same sound, different meaning'),
    9: ws(['re', 'do'], 'redo', 'a prefix + a root word'),
    10: tl('jumped', 'jump', 'will jump'), 17: tl('swam', 'swim', 'will swim'),
    11: POSITION, 12: POSITION,
    18: { t: 'clause', a: 'We played', c: 'and', b: 'we sang' },
    24: scene('the giant oak tree', it('🌳', 'a giant oak'), it('🐦', 'nests'), it('🐿️', 'acorns'), it('🧒', 'children')),
    25: scene('the giant oak tree', it('🌳', 'a giant oak'), it('🐦', 'nests'), it('🐿️', 'acorns'), it('🧒', 'children')),
    29: ws(['do', 'not'], 'don’t', 'the apostrophe replaces a letter'),
    30: ws(['mis', 'spell'], 'misspell', 'a prefix + a root word'),
    34: many('🐺', 'one wolf', 'many wolves'),
  },
  4: {
    11: ws(['help', 'ful'], 'helpful', 'a root word + a suffix'),
    13: WORDCLASS, 19: WORDCLASS,
    14: pair(it('☀️', 'sun'), it('👦', 'son'), 'same sound, different meaning'),
    15: ws(['anti', 'social'], 'antisocial', 'a prefix + a root word'),
    24: scene('Zara’s letter to Gran', it('💌', 'a letter'), it('📖', 'a space book'), it('🪐', 'Mars'), it('🔭', 'planetarium')),
    25: scene('Zara’s letter to Gran', it('💌', 'a letter'), it('📖', 'a space book'), it('🪐', 'Mars'), it('🔭', 'planetarium')),
    35: tl('played', 'play', 'will play'),
  },
  5: {
    8: ws(['music', 'ian'], 'musician', 'a root word + a suffix'),
    13: MARKS, 15: MARKS,
    20: ws(['dis', 'like'], 'dislike', 'a prefix + a root word'),
    21: { t: 'voice', active: 'Mia kicked the ball', passive: 'The ball was kicked by Mia' },
    24: scene('the first balloon flight', it('🎈', 'a hot-air balloon'), it('🐑', 'a sheep'), it('🦆', 'a duck'), it('🐓', 'a rooster')),
    25: scene('the first balloon flight', it('🎈', 'a hot-air balloon'), it('🐑', 'a sheep'), it('🦆', 'a duck'), it('🐓', 'a rooster')),
    32: ws(['inform', 'ation'], 'information', 'a root word + a suffix'),
  },
  6: {
    0: { t: 'voice', active: 'Mia kicked the ball', passive: 'The ball was kicked by Mia' },
    4: { t: 'voice', active: 'Mia kicked the ball', passive: 'The ball was kicked by Mia' },
    9: MARKS, 20: MARKS,
    14: { t: 'clause', a: 'She smiled', c: 'when', b: 'he waved' },
    17: ws(['they', 'are'], 'they’re', 'the apostrophe replaces a letter'),
    21: ws(['trans', 'late'], 'translate', 'a prefix + a root word'),
    32: ws(['inter', 'act'], 'interact', 'a prefix + a root word'),
    24: scene('Marie Curie’s story', it('👩‍🔬', 'a scientist'), it('🧪', 'a laboratory'), it('☢️', 'radioactivity'), it('🏅', 'a Nobel Prize')),
    25: scene('Marie Curie’s story', it('👩‍🔬', 'a scientist'), it('🧪', 'a laboratory'), it('☢️', 'radioactivity'), it('🏅', 'a Nobel Prize')),
  },
};

// Pictures that would simply state the answer to their own question are left out on purpose.
const NO_PICTURE_SCI: Record<number, number[]> = {
  1: [13],
  4: [3, 4, 6, 14, 19, 24, 25, 32],
  5: [1, 4, 5, 12, 13, 18, 20, 28, 31],
  6: [0],
};
const NO_PICTURE_ENG: Record<number, number[]> = { 3: [18, 30] };
for (const [y, list] of Object.entries(NO_PICTURE_SCI)) for (const i of list) delete SCI_VIS[Number(y)]?.[i];
for (const [y, list] of Object.entries(NO_PICTURE_ENG)) for (const i of list) delete ENG_VIS[Number(y)]?.[i];
