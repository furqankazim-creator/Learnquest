import { createContext, useContext } from 'react';
import { Platform, useColorScheme } from 'react-native';

export type Palette = {
  bg: string; card: string; ink: string; muted: string;
  violet: string; violetSoft: string; orange: string; orangeSoft: string;
  green: string; greenSoft: string; sky: string; pink: string; coral: string;
  sunny: string; teal: string; navy: string; line: string;
  selSoft: string; dangerBg: string; dangerText: string;
  skyTop: string; skyBottom: string; dark: boolean; shadow: string;
};

const base = {
  violet: '#6C5CE7', orange: '#FF8A3D', green: '#1DB954', sky: '#4D96FF', pink: '#FF8FAB',
  coral: '#FF6B6B', sunny: '#FFC93C', teal: '#00B8A9', navy: '#2D2A4A',
};

export const light: Palette = {
  ...base, bg: '#FFF9F0', card: '#FFFFFF', ink: '#2D2A4A', muted: '#6B6890',
  violetSoft: '#ECE9FF', orangeSoft: '#FFEFDF', greenSoft: '#E2F8EA', line: '#EFE7D8',
  selSoft: '#E3EFFF', dangerBg: '#FFE3E3', dangerText: '#B02A2A',
  skyTop: '#BFE9FF', skyBottom: '#E8F8FF', dark: false, shadow: 'rgba(45,42,74,0.10)',
};

export const dark: Palette = {
  ...base, bg: '#191730', card: '#242144', ink: '#F4F2FF', muted: '#B9B5D9',
  violetSoft: '#322C5E', orangeSoft: '#4A3421', greenSoft: '#1E4030', line: '#3A3666',
  selSoft: '#2C3A5E', dangerBg: '#4A2424', dangerText: '#FFB3B3',
  skyTop: '#27345E', skyBottom: '#33477A', dark: true, shadow: 'rgba(0,0,0,0.35)',
};

// Automatic light/dark following the phone setting (no toggle), like the HTML app.
export type ThemePref = 'auto' | 'light' | 'dark';
export const ThemeCtx = createContext<{ pref: ThemePref; setPref: (p: ThemePref) => void }>({ pref: 'light', setPref: () => {} });
export function usePalette(): Palette {
  const { pref } = useContext(ThemeCtx);
  const scheme = useColorScheme();
  if (pref === 'light') return light;
  if (pref === 'dark') return dark;
  return scheme === 'light' ? light : dark;
}

// Fixed colours from the spec
export const FIXED = {
  owlBadge: '#BFE6FB', playIcon: '#00AEEF', lavender: '#D9D6F5',
  buddyBorder: '#F0A500', yearBorder: '#2F6FD0', yearAge: '#E3EFFF',
  balloons: ['#FF6B6B', '#4D96FF', '#1DB954', '#FF8A3D'],
};

// Font: Comic Sans MS stack on web; Chalkboard SE on iOS; bundled Comic Neue (the
// free Comic Sans look-alike) on Android so every phone gets the same rounded look.
export const FONT = Platform.select({
  web: { regular: '"Comic Sans MS","Chalkboard SE","Segoe UI Rounded",ui-rounded,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif', bold: '"Comic Sans MS","Chalkboard SE","Segoe UI Rounded",ui-rounded,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif' },
  default: { regular: 'ComicNeue_400Regular', bold: 'ComicNeue_700Bold' },
})!;

export const SUBJECTS = {
  E: { name: 'English', emoji: '📚', topics: 'Phonics, words & grammar', color: 'violet', soft: 'violetSoft' },
  M: { name: 'Maths', emoji: '🔢', topics: 'Numbers, sums & shapes', color: 'orange', soft: 'orangeSoft' },
  S: { name: 'Science', emoji: '🔬', topics: 'Animals, plants & space', color: 'green', soft: 'greenSoft' },
} as const;
export type Subj = keyof typeof SUBJECTS;

export const AGES: Record<number, string> = {
  1: 'Age 5–6', 2: 'Age 6–7', 3: 'Age 7–8', 4: 'Age 8–9', 5: 'Age 9–10', 6: 'Age 10–11',
};
