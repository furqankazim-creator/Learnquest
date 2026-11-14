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
// 36 questions per subject per year: original 12 + 12 extras + 12 from the Cambridge-style pack
// (hand-written English/Science with reading passages and enquiry questions; generated Maths).
export const POOL_SIZE = 36;
export function poolFor(subj: Subj, year: number): RawQ[] {
  let raw: RawQ[];
  if (subj === 'E') raw = [...ENG[year], ...ENG_X[year], ...ENG_Y[year]];
  else if (subj === 'S') raw = [...SCI[year], ...SCI_X[year], ...SCI_Y[year]];
  else raw = [...MATH[year], ...genMaths(year), ...genMaths2(year)];
  return raw.map((r, i) => {
    const fixed = FIX[`${subj}${year}.${i}`];
    if (fixed) return fixed;
    // original Maths answers: swap the "±1, ±2" options for more believable slips
    if (subj === 'M' && i < 12 && r.slice(1, 5).every((x) => /^\d+$/.test(x))) {
      const w = wrongNums(Number(r[1]));
      const note = r[6] ?? (r[0].includes('= ?') ? `${r[0].replace('?', r[1])}.` : undefined);
      return [r[0], r[1], String(w[0]), String(w[1]), String(w[2]), r[5], note as string] as RawQ;
    }
    return r;
  });
}

export type Q = { q: string; a: string; opts: string[]; e: string; subj: Subj; idx: number; x?: string; p?: string; ex?: string; sv?: SciSpec; ev?: EngSpec; oe?: (string | undefined)[] };

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
export function questionsFor(subj: Subj, year: number, count: number, noPassage = false): Q[] {
  const all = poolFor(subj, year).map((r, i) => toQ(r, subj, i, year)).filter((q) => !noPassage || !q.p);
  return shuffle(all).slice(0, count);
}
export function mixedQuestions(year: number, count: number, noPassage = false): Q[] {
  const all: Q[] = [];
  (['E', 'M', 'S'] as Subj[]).forEach((s) => poolFor(s, year).forEach((r, i) => all.push(toQ(r, s, i, year))));
  return shuffle(noPassage ? all.filter((q) => !q.p) : all).slice(0, count);
}

export type GameSubj = Subj | 'X';
export type GameKind = 'balloon' | 'rescue' | 'match' | 'quiz' | 'mission';
export type Tab = 'home' | 'games' | 'rewards' | 'parent';

type Right = Record<Subj, Record<number, boolean>>;
const emptyRight = (): Right => ({ E: {}, M: {}, S: {} });

type Ctx = {
  name: string; buddy: string; year: number;
  stars: number; coins: number; answered: number; correct: number;
  right: Right; stickers: number[];
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
};

type Saved = {
  name: string; buddy: string; year: number; stars: number; coins: number; answered: number; correct: number;
  right: Right; stickers: number[]; soundOn: boolean; pin: string | null; streak: number; lastDay: string | null; profile: boolean;
  buddyId?: string; buddyBg?: string | null; favs?: string[]; custom?: Custom[];
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
        setRight({ E: d.right?.E || {}, M: d.right?.M || {}, S: d.right?.S || {} });
        setStickers(d.stickers || []);
        if (d.soundOn === false) { Sound.on = false; setSoundOn(false); }
        setPin(d.pin || null); setStreakCount(d.streak || 0); setLastDay(d.lastDay || null);
        setProfile(!!d.profile);
        if (d.profile) setScreen('app');
      }
      setReady(true);
    });
    return () => { alive = false; };
  }, []);

  // save whenever progress changes
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      const data: Saved = { name, buddy, year, stars, coins, answered, correct, right, stickers, soundOn, pin, streak: streakCount, lastDay, profile, buddyId, buddyBg, favs, custom };
      saveJSON(STATE_KEY, data);
    }, 250);
    return () => clearTimeout(t);
  }, [ready, name, buddy, year, stars, coins, answered, correct, right, stickers, soundOn, pin, streakCount, lastDay, profile, buddyId, buddyBg, favs, custom]);

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
  }, [promoteFav]);

  const startGame = useCallback((k: GameKind) => {
    Sound.tap(); setGame(k); setGameRun((r) => r + 1); setScreen('game');
  }, []);
  const leaveGame = useCallback(() => {
    Sound.stopSpeak(); setGame(null); setScreen('app');
  }, []);

  const recordAnswer = useCallback((q: Q, ok: boolean) => {
    setAnswered((n) => n + 1);
    if (ok) {
      setCorrect((n) => n + 1);
      setRight((r) => ({ ...r, [q.subj]: { ...r[q.subj], [q.idx]: true } }));
    }
  }, []);

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
    name, buddy, year, stars, coins, answered, correct, right, stickers, soundOn, toggleSound,
    screen, tab, setTab, gameSubj, setGameSubj, game, gameRun, parentOpen, setParentOpen, settingsOpen, setSettingsOpen,
    enter, changePlayer, startGame, leaveGame, recordAnswer, finishGame, reset, resetNote, ready, pin, setPin, streak,
    buddyId, buddyBg, favs, custom, setBuddyChoice, promoteFav, addFav, removeFav, createCustom, deleteCustom,
  }), [name, buddy, year, stars, coins, answered, correct, right, stickers, soundOn, toggleSound, screen, tab, setTab,
    gameSubj, game, gameRun, parentOpen, settingsOpen, enter, changePlayer, startGame, leaveGame, recordAnswer, finishGame, reset, resetNote, ready, pin, streak, buddyId, buddyBg, favs, custom, setBuddyChoice, promoteFav, addFav, removeFav, createCustom, deleteCustom]);

  return <C.Provider value={value}>{children}</C.Provider>;
}
