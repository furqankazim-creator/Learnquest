// Shapes of the picture "recipes" used for Science and English questions.
// A picture should show the idea WITHOUT giving the answer away, so each one uses its own example.
export type Item = { e: string; l: string };

export type SciSpec =
  | { t: 'row'; items: Item[]; hi?: number }
  | { t: 'chain'; items: Item[] }
  | { t: 'cycle'; items: Item[]; hi?: number }
  | { t: 'plant'; hi?: 'roots' | 'stem' | 'leaf' | 'flower'; needs?: boolean }
  | { t: 'states'; hi?: 0 | 1 | 2 }
  | { t: 'circuit'; bulbs?: 1 | 2; cells?: 1 | 2; gap?: boolean; buzzer?: boolean; open?: boolean }
  | { t: 'solar'; hi?: string }
  | { t: 'daynight' }
  | { t: 'phases'; hi?: number }
  | { t: 'orbit' }
  | { t: 'digestive'; hi?: 'oesophagus' | 'stomach' | 'small' | 'large' }
  | { t: 'teeth'; hi?: 0 | 1 | 2 }
  | { t: 'skeleton'; hi?: 'skull' | 'ribs' | 'spine' | 'pelvis' }
  | { t: 'heart' }
  | { t: 'magnet'; mode: 'repel' | 'attract' }
  | { t: 'reflect' }
  | { t: 'refract' }
  | { t: 'shadow' }
  | { t: 'sound'; kind: 'vibration' | 'pitch' | 'volume' }
  | { t: 'thermo'; v: number; e: string; l: string }
  | { t: 'force'; kind: 'push' | 'pull' | 'gravity' | 'friction' | 'water' | 'air' }
  | { t: 'classify'; groups: { title: string; items: string[] }[] }
  | { t: 'legs'; n: number };

export type EngSpec =
  | { t: 'wordsum'; parts: string[]; result: string; note?: string }
  | { t: 'position' }
  | { t: 'boxes'; parts: string[]; label: string }
  | { t: 'timeline'; past: string; now: string; future: string }
  | { t: 'onemany'; e: string; one: string; many: string }
  | { t: 'pair'; a: Item; b: Item; label: string }
  | { t: 'scene'; items: Item[]; caption?: string }
  | { t: 'bubble'; text: string; who: string }
  | { t: 'marks' }
  | { t: 'wordclass' }
  | { t: 'clause'; a: string; c: string; b: string }
  | { t: 'voice'; active: string; passive: string };
