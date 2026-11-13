import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Sound } from './sound';
import { Subj } from './theme';
import { ENG, MATH, SCI, RawQ } from './data/questions';
import { ENG_X, SCI_X } from './data/extras';
import { genMaths, wrongNums } from './data/mathsGen';
import { FIX } from './data/fixes';
import { STATE_KEY, dayKey, loadJSON, saveJSON, yesterdayKey } from './storage';

export const STICKERS = ['🌟', '🦁', '🚀', '🌈', '🐢', '🍎', '🔭', '🏅', '🦋', '🎨', '🧲', '🌻'];
// 24 questions per subject per year: the original 12 + 12 more (hand-written English/Science, generated Maths)
export const POOL_SIZE = 24;
export function poolFor(subj: Subj, year: number): RawQ[] {
  let raw: RawQ[];
  if (subj === 'E') raw = [...ENG[year], ...ENG_X[year]];
  else if (subj === 'S') raw = [...SCI[year], ...SCI_X[year]];
  else raw = [...MATH[year], ...genMaths(year)];
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

export type Q = { q: string; a: string; opts: string[]; e: string; subj: Subj; idx: number; x?: string };

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function toQ(raw: RawQ, subj: Subj, idx: number): Q {
  return { q: raw[0], a: raw[1], opts: shuffle([raw[1], raw[2], raw[3], raw[4]]), e: raw[5], subj, idx, x: raw[6] };
}
export function questionsFor(subj: Subj, year: number, count: number): Q[] {
  return shuffle(poolFor(subj, year).map((r, i) => toQ(r, subj, i))).slice(0, count);
}
export function mixedQuestions(year: number, count: number): Q[] {
  const all: Q[] = [];
  (['E', 'M', 'S'] as Subj[]).forEach((s) => poolFor(s, year).forEach((r, i) => all.push(toQ(r, s, i))));
  return shuffle(all).slice(0, count);
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
  enter: (name: string, buddy: string, year: number, tab?: Tab) => void;
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
};

const C = createContext<Ctx>(null as any);
export const useApp = () => useContext(C);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('Guest Explorer');
  const [buddy, setBuddy] = useState('🦊');
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
      const data: Saved = { name, buddy, year, stars, coins, answered, correct, right, stickers, soundOn, pin, streak: streakCount, lastDay, profile };
      saveJSON(STATE_KEY, data);
    }, 250);
    return () => clearTimeout(t);
  }, [ready, name, buddy, year, stars, coins, answered, correct, right, stickers, soundOn, pin, streakCount, lastDay, profile]);

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

  const enter = useCallback((n: string, b: string, y: number, t: Tab = 'home') => {
    setName(n); setBuddy(b); setYear(y); setProfile(true); setParentOpen(false); setTabState(t); setScreen('app'); setSettingsOpen(false); Sound.tap();
  }, []);

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
  }), [name, buddy, year, stars, coins, answered, correct, right, stickers, soundOn, toggleSound, screen, tab, setTab,
    gameSubj, game, gameRun, parentOpen, settingsOpen, enter, changePlayer, startGame, leaveGame, recordAnswer, finishGame, reset, resetNote, ready, pin, streak]);

  return <C.Provider value={value}>{children}</C.Provider>;
}
