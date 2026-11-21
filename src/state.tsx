import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Sound } from './sound';
import { Subj } from './theme';
import { ENG, MATH, SCI, RawQ } from './data/questions';
import { ENG_X, SCI_X } from './data/extras';
import { genMaths, wrongNums } from './data/mathsGen';
import { genMaths2 } from './data/mathsGen2';
import { ENG_Y, SCI_Y } from './data/pack2';
import { FIX } from './data/fixes';
import { EX_E, EX_S } from './data/examples';
import { DEFAULT_FAVS, MAX_FAVS, Custom, findChar } from './data/characters';
import { ENG_VIS, SCI_VIS } from './data/visuals';
import type { EngSpec, SciSpec } from './data/visualTypes';
import { emojiForOptions } from './data/optionEmoji';
import { PIC_FIX } from './data/pictureFixes';
import { STATE_KEY, dayKey, loadJSON, saveJSON, yesterdayKey } from './storage';

export const STICKERS = ['🌟', '🦁', '🚀', '🌈', '🐢', '🍎', '🔭', '🏅', '🦋', '🎨', '🧲', '🌻'];
// 50 questions per subject per year, split into three learning rounds
export const POOL_SIZE = 50;
export const ROUND_SIZES = [17, 17, 16] as const;
// 36 questions per subject per year: original 12 + 12 extras + 12 from the Cambridge-style pack
// (hand-written English/Science with reading passages and enquiry questions; generated Maths).
export function poolFor(subj: Subj, year: number): RawQ[] {
  let raw: RawQ[];
  if (subj === 'E') raw = [...ENG[year], ...ENG_X[year], ...ENG_Y[year]];
  else if (subj === 'S') raw = [...SCI[year], ...SCI_X[year], ...SCI_Y[year]];
  else raw = [...MATH[year], ...genMaths(year), ...genMaths2(year)];
  raw = padPool(raw);
  return raw.map((r, i) => {
    const fixed = FIX[`${subj}${year}.${i}`];
    if (fixed) return fixed;
    // original Maths answers: swap the "±1, ±2" options for more believable slips (skip conceptual/clock/prime questions)
    if (subj === 'M' && i < 12 && r.slice(1, 5).every((x) => /^\d+$/.test(x)) && !r[0].includes('prime') && !r[0].includes('half an hour')) {
      const w = wrongNums(Number(r[1]));
      const note = r[6] ?? (r[0].includes('= ?') ? `${r[0].replace('?', r[1])}.` : undefined);
      return [r[0], r[1], String(w[0]), String(w[1]), String(w[2]), r[5], note as string] as RawQ;
    }
    return r;
  });
}

function padPool(raw: RawQ[]): RawQ[] {
  if (raw.length >= POOL_SIZE) return raw.slice(0, POOL_SIZE);
  const padded = [...raw];
  let n = 1;
  while (padded.length < POOL_SIZE) {
    const base = raw[(padded.length - raw.length) % raw.length];
    const reviewPrefix = `Review ${n}: `;
    padded.push([reviewPrefix + base[0], base[1], base[2], base[3], base[4], base[5], base[6] ?? 'Try this again to practise the same skill.', ...base.slice(7)] as RawQ);
    n += 1;
  }
  return padded;
}

export function roundForCompleted(completed: number): number {
  if (completed < ROUND_SIZES[0]) return 0;
  if (completed < ROUND_SIZES[0] + ROUND_SIZES[1]) return 1;
  return 2;
}

export function roundLabel(completed: number): string {
  const round = roundForCompleted(completed);
  const start = round === 0 ? 0 : round === 1 ? ROUND_SIZES[0] : ROUND_SIZES[0] + ROUND_SIZES[1];
  return `Round ${round + 1} of 3 • ${Math.min(completed - start, ROUND_SIZES[round])}/${ROUND_SIZES[round]} in this round`;
}

export type Q = { q: string; a: string; opts: string[]; e: string; subj: Subj; idx: number; x?: string; p?: string; ex?: string; sv?: SciSpec; ev?: EngSpec; oe?: (string | undefined)[]; imageUri?: string; custom?: boolean; customId?: string; type?: 'mcq' | 'tf' | 'typed' | 'image' | 'match' | 'balloon' | 'rescue' | 'quiz' };

export type CustomQuestion = {
  id: string;
  createdAt: number;
  subj: Subj;
  type: 'mcq' | 'tf' | 'typed' | 'image' | 'match' | 'balloon' | 'rescue' | 'quiz';
  q: string;
  a: string;
  wrong1: string;
  wrong2: string;
  wrong3: string;
  matchL1: string;
  matchL2: string;
  matchL3: string;
  matchL4: string;
  matchR1: string;
  matchR2: string;
  matchR3: string;
  matchR4: string;
  matchL1Img?: string;
  matchL2Img?: string;
  matchL3Img?: string;
  matchL4Img?: string;
  matchR1Img?: string;
  matchR2Img?: string;
  matchR3Img?: string;
  matchR4Img?: string;
  imageUri?: string;
  note?: string;
  passage?: string;
};
export type CustomLog = { id: string; questionId: string; question: string; subj: Subj; correct: boolean; at: number };

// what the voice reads aloud: the passage (if any) and then the question
export const spoken = (q: Q) => (q.p ? `${q.p} ${q.q}` : q.q);

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function toQ(raw: RawQ, subj: Subj, idx: number, year: number): Q {
  // English and Science carry a hand-written real-life example; Maths builds its own from the picture
  const ex = subj === 'E' ? EX_E[year]?.[idx] : subj === 'S' ? EX_S[year]?.[idx] : undefined;
  // textbook-style picture for many English and Science questions
  const sv = subj === 'S' ? SCI_VIS[year]?.[idx] : undefined;
  const ev = subj === 'E' ? ENG_VIS[year]?.[idx] : undefined;
  const opts = shuffle([raw[1], raw[2], raw[3], raw[4]]);
  // a small picture on each answer when most answers are things we can draw (English and Science only)
  const oe = subj === 'M' ? undefined : emojiForOptions(opts) ?? undefined;
  return { q: raw[0], a: raw[1], opts, e: PIC_FIX[`${subj}${year}.${idx}`] ?? raw[5], subj, idx, x: raw[6], p: raw[7], ex, sv, ev, oe };
}
// noPassage: Match It cannot show a reading passage, so it only uses stand-alone questions
function customToQ(c: CustomQuestion, idx: number): Q {
  let opts: string[];
  if (c.type === 'tf') {
    opts = ['True', 'False'];
  } else if (c.type === 'typed') {
    opts = [];
  } else if (c.type === 'match') {
    const left = c[`matchL${idx + 1}` as keyof CustomQuestion] as string;
    const right = c[`matchR${idx + 1}` as keyof CustomQuestion] as string;
    const leftImg = c[`matchL${idx + 1}Img` as keyof CustomQuestion] as string | undefined;
    const rightImg = c[`matchR${idx + 1}Img` as keyof CustomQuestion] as string | undefined;
    return { q: left, a: right, opts: [], e: '✨', subj: c.subj, idx, x: c.note, imageUri: leftImg, custom: true, customId: c.id, type: 'match', p: rightImg };
  } else {
    opts = shuffle([c.a, c.wrong1, c.wrong2, c.wrong3]);
  }
  // only MCQ / picture / balloon / rescue / quiz questions get a small emoji on each answer option
  const oe = (c.type === 'mcq' || c.type === 'image' || c.type === 'balloon' || c.type === 'rescue' || c.type === 'quiz') ? (emojiForOptions(opts) ?? undefined) : undefined;
  return { q: c.q, a: c.a, opts, e: '✨', subj: c.subj, idx, x: c.note, oe, imageUri: c.imageUri, p: c.passage, custom: true, customId: c.id, type: c.type };
}
function customVariantsForPlay(c: CustomQuestion, baseIdx: number, count: number): Q[] {
  const pool: Q[] = [];
  if (c.type === 'match') {
    for (let i = 0; i < 4; i++) {
      const left = c[`matchL${i + 1}` as keyof CustomQuestion] as string;
      const right = c[`matchR${i + 1}` as keyof CustomQuestion] as string;
      const leftImg = c[`matchL${i + 1}Img` as keyof CustomQuestion] as string | undefined;
      const rightImg = c[`matchR${i + 1}Img` as keyof CustomQuestion] as string | undefined;
      if (left && right) pool.push({ q: left, a: right, opts: [], e: '✨', subj: c.subj, idx: baseIdx * 10 + i, x: c.note, imageUri: leftImg, custom: true, customId: c.id, type: 'match', p: rightImg });
    }
    return pool;
  }
  const variants = Math.max(2, Math.ceil(count / Math.max(1, Math.min(4, count))));
  for (let v = 0; v < variants; v++) {
    pool.push(customToQ(c, baseIdx * 10 + v));
  }
  return pool;
}
export function questionsFor(subj: Subj, year: number, count: number, noPassage = false): Q[] {
  const all = poolFor(subj, year).map((r, i) => toQ(r, subj, i, year)).filter((q) => !noPassage || !q.p);
  return shuffle(all).slice(0, count);
}
export function mixedQuestions(year: number, count: number, noPassage = false): Q[] {
  const all: Q[] = [];
  (['E', 'M', 'S'] as Subj[]).forEach((s) => poolFor(s, year).forEach((r, i) => all.push(toQ(r, s, i, year))));
  return shuffle(noPassage ? all.filter((q) => !q.p) : all).slice(0, count);
}

export type GameSubj = Subj | 'X' | 'C';
export type GameKind = 'balloon' | 'rescue' | 'match' | 'quiz' | 'mission';
export type Tab = 'home' | 'games' | 'rewards' | 'discover' | 'parent';

type Right = Record<Subj, Record<string, boolean>>;
const emptyRight = (): Right => ({ E: {}, M: {}, S: {} });

export const completedForYear = (right: Right, subj: Subj, year: number): number => {
  const prefix = `${year}:`;
  return Object.keys(right[subj] || {}).filter((key) => key.startsWith(prefix)).length;
};

export const isQuestionMastered = (right: Right, subj: Subj, year: number, idx: number): boolean =>
  !!right[subj]?.[`${year}:${idx}`];

type Ctx = {
  name: string; buddy: string; year: number;
  stars: number; coins: number; answered: number; correct: number;
  right: Right; stickers: number[];
  setSchoolYear: (year: number) => void;
  soundOn: boolean; toggleSound: () => void;
  screen: 'welcome' | 'app' | 'game'; tab: Tab; setTab: (t: Tab) => void;
  gameSubj: GameSubj; setGameSubj: (s: GameSubj) => void;
  game: GameKind | null; gameRun: number;
  parentOpen: boolean; setParentOpen: (b: boolean) => void;
  settingsOpen: boolean; setSettingsOpen: (b: boolean) => void;
  enter: (name: string, buddy: { id: string; e: string; bg?: string | null }, year: number, tab?: Tab, newPin?: string) => void;
  buddyId: string; buddyBg: string | null; favs: string[]; custom: Custom[];
  setBuddyChoice: (id: string) => void;
  promoteFav: (id: string) => void;
  addFav: (id: string) => boolean; removeFav: (id: string) => void;
  createCustom: (e: string, name: string, bg: string) => string; deleteCustom: (id: string) => void;
  changePlayer: () => void;
  startGame: (k: GameKind) => void; leaveGame: () => void;
  recordAnswer: (q: Q, ok: boolean) => void;
  finishGame: (right: number, total: number) => { stars: number; sticker: string | null };
  reset: () => void; resetNote: boolean;
  ready: boolean;
  pin: string | null; setPin: (p: string | null) => void;
  streak: number;
  customQuestions: CustomQuestion[];
  customLogs: CustomLog[];
  addCustomQuestion: (q: Omit<CustomQuestion, 'id' | 'createdAt'>) => boolean;
  deleteCustomQuestion: (id: string) => void;
  clearCustomLogs: () => void;
  questionsForPlay: (subj: GameSubj, count: number, noPassage?: boolean, gameKind?: GameKind) => Q[];
};

type Saved = {
  name: string; buddy: string; year: number; stars: number; coins: number; answered: number; correct: number;
  right: Right; stickers: number[]; soundOn: boolean; pin: string | null; streak: number; lastDay: string | null; profile: boolean;
  buddyId?: string; buddyBg?: string | null; favs?: string[]; custom?: Custom[];
  customQuestions?: CustomQuestion[]; customLogs?: CustomLog[];
};

const C = createContext<Ctx>(null as any);
export const useApp = () => useContext(C);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('Guest Explorer');
  const [buddy, setBuddy] = useState('🦊');
  const [buddyId, setBuddyId] = useState('fox');
  const [buddyBg, setBuddyBg] = useState<string | null>(null);
  const [favs, setFavs] = useState<string[]>(DEFAULT_FAVS);
  const [custom, setCustom] = useState<Custom[]>([]);
  const [year, setYear] = useState(2);
  const [stars, setStars] = useState(0);
  const [coins, setCoins] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [right, setRight] = useState<Right>(emptyRight());
  const [stickers, setStickers] = useState<number[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const [screen, setScreen] = useState<'welcome' | 'app' | 'game'>('welcome');
  const [tab, setTabState] = useState<Tab>('home');
  const [gameSubj, setGameSubj] = useState<GameSubj>('E');
  const [game, setGame] = useState<GameKind | null>(null);
  const [gameRun, setGameRun] = useState(0);
  const [parentOpen, setParentOpen] = useState(false);
  const [resetNote, setResetNote] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [lastDay, setLastDay] = useState<string | null>(null);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [customLogs, setCustomLogs] = useState<CustomLog[]>([]);
  const [profile, setProfile] = useState(false);

  // load saved progress once, on start
  useEffect(() => {
    let alive = true;
    loadJSON<Saved>(STATE_KEY).then((d) => {
      if (!alive) return;
      if (d) {
        setName(d.name || 'Guest Explorer'); setBuddy(d.buddy || '🦊'); setYear(d.year || 2);
        const cu = Array.isArray(d.custom) ? d.custom.filter((x) => x && x.id && x.e) : [];
        setCustom(cu);
        setBuddyId(d.buddyId || 'fox'); setBuddyBg(d.buddyBg ?? null);
        const fv = (Array.isArray(d.favs) ? d.favs : DEFAULT_FAVS).filter((id) => !!findChar(id, cu)).slice(0, MAX_FAVS);
        setFavs(fv.length ? fv : DEFAULT_FAVS);
        setStars(d.stars || 0); setCoins(d.coins || 0); setAnswered(d.answered || 0); setCorrect(d.correct || 0);
        setRight(migrateRight(d.right, d.year || 2));
        setStickers(d.stickers || []);
        if (d.soundOn === false) { Sound.on = false; setSoundOn(false); }
        setPin(d.pin || null); setStreakCount(d.streak || 0); setLastDay(d.lastDay || null);
        const cq = Array.isArray(d.customQuestions) ? d.customQuestions.filter((q) => {
          if (!q || !q.id) return false;
          const t = q.type ?? 'mcq';
          if (t === 'match') return q.matchL1 && q.matchR1 && q.matchL2 && q.matchR2;
          if (t === 'tf' || t === 'typed') return q.q && q.a;
          return q.q && q.a && q.wrong1 && q.wrong2 && q.wrong3;
        }) : [];
        const cl = Array.isArray(d.customLogs) ? d.customLogs.filter((l) => l && l.id && l.questionId) : [];
        setCustomQuestions(cq);
        setCustomLogs(cl.slice(-100));
        setProfile(!!d.profile);
        if (d.profile) {
          setScreen('app');
          const greetName = d.name || 'Guest Explorer';
          setTimeout(() => Sound.greet(greetName), 700);
        }
      }
      setReady(true);
    });
    return () => { alive = false; };
  }, []);

  // save whenever progress changes
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      const data: Saved = { name, buddy, year, stars, coins, answered, correct, right, stickers, soundOn, pin, streak: streakCount, lastDay, profile, buddyId, buddyBg, favs, custom, customQuestions, customLogs };
      saveJSON(STATE_KEY, data);
    }, 250);
    return () => clearTimeout(t);
  }, [ready, name, buddy, year, stars, coins, answered, correct, right, stickers, soundOn, pin, streakCount, lastDay, profile, buddyId, buddyBg, favs, custom, customQuestions, customLogs]);

  const toggleSound = useCallback(() => {
    const next = !Sound.on;
    Sound.on = next;
    setSoundOn(next);
    if (next) Sound.tap();
    else Sound.stopSpeak();
  }, []);

  const setTab = useCallback((t: Tab) => {
    setTabState(t); setSettingsOpen(false);
    if (t !== 'parent') { setResetNote(false); setParentOpen(false); } // grown-ups area locks again when you leave it
  }, []);

  // newest pick goes to the front of the favourites; the list never holds more than MAX_FAVS
  const promoteFav = useCallback((id: string) => {
    setFavs((f) => [id, ...f.filter((x) => x !== id)].slice(0, MAX_FAVS));
  }, []);
  const addFav = useCallback((id: string) => {
    let ok = true;
    setFavs((f) => { if (f.includes(id)) return f; if (f.length >= MAX_FAVS) { ok = false; return f; } return [...f, id]; });
    return ok;
  }, []);
  const removeFav = useCallback((id: string) => setFavs((f) => (f.length > 1 ? f.filter((x) => x !== id) : f)), []);
  const setBuddyChoice = useCallback((id: string) => {
    const ch = findChar(id, custom);
    if (!ch) return;
    setBuddyId(ch.id); setBuddy(ch.e); setBuddyBg(ch.bg ?? null); promoteFav(ch.id);
  }, [custom, promoteFav]);
  const createCustom = useCallback((e: string, nm: string, bg: string) => {
    const id = 'my' + Date.now().toString(36);
    setCustom((c) => [{ id, e, name: nm.trim() || 'My hero', bg }, ...c]);
    promoteFav(id);
    return id;
  }, [promoteFav]);
  const deleteCustom = useCallback((id: string) => {
    setCustom((c) => c.filter((x) => x.id !== id));
    setFavs((f) => { const n = f.filter((x) => x !== id); return n.length ? n : DEFAULT_FAVS; });
    setBuddyId((cur) => { if (cur === id) { setBuddy('🦊'); setBuddyBg(null); return 'fox'; } return cur; });
  }, []);

  const enter = useCallback((n: string, b: { id: string; e: string; bg?: string | null }, y: number, t: Tab = 'home', newPin?: string) => {
    setName(n); setBuddy(b.e); setBuddyId(b.id); setBuddyBg(b.bg ?? null); promoteFav(b.id);
    if (newPin) setPin(newPin);
    setYear(y); setProfile(true); setParentOpen(false); setTabState(t); setScreen('app'); setSettingsOpen(false); Sound.tap();
    if (t !== 'parent') setTimeout(() => Sound.greet(n), 450);
  }, [promoteFav]);

  const startGame = useCallback((k: GameKind) => {
    Sound.tap(); setGame(k); setGameRun((r) => r + 1); setScreen('game');
  }, []);
  const leaveGame = useCallback(() => {
    Sound.stopSpeak(); setGame(null); setScreen('app');
  }, []);

  const addCustomQuestion = useCallback((q: Omit<CustomQuestion, 'id' | 'createdAt'>) => {
    const clean = (s?: string) => (s || '').replace(/\s+/g, ' ').trim();
    const type = q.type ?? 'mcq';
    const base: Omit<CustomQuestion, 'id' | 'createdAt'> = {
      subj: q.subj,
      type,
      q: clean(q.q),
      a: clean(q.a),
      wrong1: clean(q.wrong1),
      wrong2: clean(q.wrong2),
      wrong3: clean(q.wrong3),
      matchL1: clean(q.matchL1), matchL2: clean(q.matchL2), matchL3: clean(q.matchL3), matchL4: clean(q.matchL4),
      matchR1: clean(q.matchR1), matchR2: clean(q.matchR2), matchR3: clean(q.matchR3), matchR4: clean(q.matchR4),
      matchL1Img: q.matchL1Img ?? undefined, matchL2Img: q.matchL2Img ?? undefined, matchL3Img: q.matchL3Img ?? undefined, matchL4Img: q.matchL4Img ?? undefined,
      matchR1Img: q.matchR1Img ?? undefined, matchR2Img: q.matchR2Img ?? undefined, matchR3Img: q.matchR3Img ?? undefined, matchR4Img: q.matchR4Img ?? undefined,
      imageUri: q.imageUri ?? undefined,
      note: clean(q.note),
      passage: clean(q.passage),
    };
    if (type === 'match') {
      const pairs = [[base.matchL1, base.matchR1], [base.matchL2, base.matchR2], [base.matchL3, base.matchR3], [base.matchL4, base.matchR4]];
      const filled = pairs.filter(([l, r]) => l && r);
      if (filled.length < 2) return false;
      const allSides = filled.flat();
      if (new Set(allSides.map((s) => s.toLowerCase())).size !== allSides.length) return false;
      base.q = ''; base.a = ''; base.wrong1 = ''; base.wrong2 = ''; base.wrong3 = '';
    } else {
      if (!base.q || !base.a) return false;
      if (type === 'mcq' || type === 'image' || type === 'balloon' || type === 'rescue' || type === 'quiz') {
        if (!base.wrong1 || !base.wrong2 || !base.wrong3) return false;
        const opts = [base.a, base.wrong1, base.wrong2, base.wrong3].map((x) => x.toLowerCase());
        if (new Set(opts).size !== 4) return false;
      }
      if (type === 'tf') {
        const tl = base.a.toLowerCase();
        if (tl !== 'true' && tl !== 'false') return false;
        base.a = tl === 'true' ? 'True' : 'False';
        base.wrong1 = base.wrong2 = base.wrong3 = '';
      }
    }
    setCustomQuestions((arr) => [{ id: 'cq' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), createdAt: Date.now(), ...base }, ...arr]);
    return true;
  }, []);
  const deleteCustomQuestion = useCallback((id: string) => setCustomQuestions((arr) => arr.filter((q) => q.id !== id)), []);
  const clearCustomLogs = useCallback(() => setCustomLogs([]), []);

  const questionsForPlay = useCallback((subj: GameSubj, count: number, noPassage = false, gameKind?: GameKind): Q[] => {
    if (subj === 'C') {
      let all = customQuestions.flatMap((c, i) => customVariantsForPlay(c, i, count));
      if (gameKind === 'match') {
        all = all.filter((q) => q.type === 'match');
      } else if (gameKind === 'balloon') {
        all = all.filter((q) => q.type !== 'match' && q.type !== 'rescue' && q.type !== 'quiz');
      } else if (gameKind === 'rescue') {
        all = all.filter((q) => q.type !== 'match' && q.type !== 'balloon' && q.type !== 'quiz');
      } else {
        // quiz - exclude match and other game-specific questions
        all = all.filter((q) => q.type !== 'match' && q.type !== 'balloon' && q.type !== 'rescue');
      }
      return shuffle(all).slice(0, count);
    }
    if (subj === 'X') {
      const all = mixedQuestions(year, count * 4, noPassage).filter((q) => !isQuestionMastered(right, q.subj, year, q.idx));
      return all.slice(0, count);
    }
    const all = questionsFor(subj, year, count * 4, noPassage)
      .filter((q) => {
        const completed = completedForYear(right, subj, year);
        const round = roundForCompleted(completed);
        const start = round === 0 ? 0 : round === 1 ? ROUND_SIZES[0] : ROUND_SIZES[0] + ROUND_SIZES[1];
        const end = start + ROUND_SIZES[round];
        return q.idx >= start && q.idx < end;
      })
      .filter((q) => !isQuestionMastered(right, subj, year, q.idx));
    return all.slice(0, count);
  }, [customQuestions, year, right]);

  const setSchoolYear = useCallback((nextYear: number) => {
    if (nextYear >= 1 && nextYear <= 6) setYear(nextYear);
  }, []);

  const recordAnswer = useCallback((q: Q, ok: boolean) => {
    setAnswered((n) => n + 1);
    if (ok) {
      setCorrect((n) => n + 1);
      if (!q.custom) setRight((r) => ({ ...r, [q.subj]: { ...r[q.subj], [`${year}:${q.idx}`]: true } }));
    }
    if (q.custom && q.customId) {
      setCustomLogs((logs) => [...logs.slice(-99), { id: 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), questionId: q.customId!, question: q.q, subj: q.subj, correct: ok, at: Date.now() }]);
    }
  }, [year]);

  const finishGame = useCallback((r: number, total: number) => {
    // stars and coins only ever go up
    const s = r >= Math.ceil(total * 0.8) ? 3 : r >= Math.ceil(total * 0.5) ? 2 : r > 0 ? 1 : 0;
    setStars((x) => x + s);
    setCoins((x) => x + r * 2);
    // daily streak: finishing a game on consecutive days
    const today = dayKey();
    if (lastDay !== today) {
      setStreakCount(lastDay === yesterdayKey() ? streakCount + 1 : 1);
      setLastDay(today);
    }
    let sticker: string | null = null;
    if (r > 0) {
      const next = STICKERS.findIndex((_, i) => !stickers.includes(i));
      if (next >= 0) { sticker = STICKERS[next]; setStickers((x) => [...x, next]); }
    }
    return { stars: s, sticker };
  }, [stickers, lastDay, streakCount]);

  const reset = useCallback(() => {
    setStars(0); setCoins(0); setAnswered(0); setCorrect(0);
    setRight(emptyRight()); setStickers([]); setResetNote(true);
  }, []);

  const changePlayer = useCallback(() => setScreen('welcome'), []);
  const streak = lastDay === dayKey() || lastDay === yesterdayKey() ? streakCount : 0;

  const value = useMemo<Ctx>(() => ({
    name, buddy, year, stars, coins, answered, correct, right, stickers, setSchoolYear, soundOn, toggleSound,
    screen, tab, setTab, gameSubj, setGameSubj, game, gameRun, parentOpen, setParentOpen, settingsOpen, setSettingsOpen,
    enter, changePlayer, startGame, leaveGame, recordAnswer, finishGame, reset, resetNote, ready, pin, setPin, streak,
    buddyId, buddyBg, favs, custom, setBuddyChoice, promoteFav, addFav, removeFav, createCustom, deleteCustom,
    customQuestions, customLogs, addCustomQuestion, deleteCustomQuestion, clearCustomLogs, questionsForPlay,
  }), [name, buddy, year, stars, coins, answered, correct, right, stickers, setSchoolYear, soundOn, toggleSound, screen, tab, setTab,
    gameSubj, game, gameRun, parentOpen, settingsOpen, enter, changePlayer, startGame, leaveGame, recordAnswer, finishGame, reset, resetNote, ready, pin, streak, buddyId, buddyBg, favs, custom, setBuddyChoice, promoteFav, addFav, removeFav, createCustom, deleteCustom, customQuestions, customLogs, addCustomQuestion, deleteCustomQuestion, clearCustomLogs, questionsForPlay]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

const migrateRight = (raw: any, year: number): Right => {
  const out: Right = emptyRight();
  (['E', 'M', 'S'] as Subj[]).forEach((subj) => {
    const source = raw?.[subj] || {};
    Object.entries(source).forEach(([key, value]) => {
      if (value) out[subj][key.includes(':') ? key : `${year}:${key}`] = true;
    });
  });
  return out;
};
