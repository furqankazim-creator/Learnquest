import React from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar } from '../components/Characters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AGES, SUBJECTS, Subj, usePalette } from '../theme';
import { Press, ProgressBar, T, useCardShadow } from '../components/UI';
import { GameKind, GameSubj, POOL_SIZE, STICKERS, Tab, useApp } from '../state';
import { Sound } from '../sound';
import Parent from './Parent';
import Settings from './Settings';
import { useLayout } from '../layout';
import AppIcon, { GAME_ICON, SUBJECT_ICON } from '../components/Icons';
import { SvgXml } from 'react-native-svg';
import { badgeSvg } from '../logo';

const SUBJ_KEYS: Subj[] = ['E', 'M', 'S'];

function Header() {
  const p = usePalette();
  const shadow = useCardShadow();
  const { name, buddyBg, buddy, year, stars, coins, streak, soundOn, toggleSound, settingsOpen, setSettingsOpen } = useApp();
  const gear = [{ width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: settingsOpen ? p.sky : p.violetSoft }, shadow] as any;
  const pill = [{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: p.card, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 }, shadow] as any;
  return (
    <View style={{ paddingTop: 16, paddingBottom: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Avatar e={buddy} bg={buddyBg ?? p.sunny} size={68} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <T w={700} size={19} numberOfLines={1}>{name}</T>
          <T w={700} size={13} color={p.muted}>Year {year} • {AGES[year]}</T>
        </View>
        <Press onPress={() => { Sound.tap(); setSettingsOpen(!settingsOpen); }} accessibilityLabel="Settings" style={gear}>
          <T size={26} style={{ lineHeight: 32 }}>⚙️</T>
        </Press>
        <Press onPress={toggleSound} accessibilityLabel="Sound on or off" style={[{ width: 52, height: 52, borderRadius: 26, backgroundColor: p.sunny, alignItems: 'center', justifyContent: 'center' }, shadow]}>
          <T size={25} style={{ lineHeight: 32 }}>{soundOn ? '🔊' : '🔇'}</T>
        </Press>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <View style={pill}><T size={26} style={{ lineHeight: 32 }}>⭐</T><T w={800} size={18}>{stars}</T></View>
        <View style={pill}><T size={26} style={{ lineHeight: 32 }}>🪙</T><T w={800} size={18}>{coins}</T></View>
        {streak > 0 ? <View style={pill}><T size={26} style={{ lineHeight: 32 }}>🔥</T><T w={800} size={18}>{streak}</T></View> : null}
      </View>
    </View>
  );
}

function SecTitle({ children }: { children: React.ReactNode }) {
  return <T w={800} size={20} style={{ marginTop: 22, marginBottom: 12 }}>{children}</T>;
}

function Home() {
  const p = usePalette();
  const { wide } = useLayout();
  const shadow = useCardShadow();
  const { startGame, right, setGameSubj, setTab } = useApp();
  return (
    <View>
      <Press
        onPress={() => startGame('mission')}
        style={[{ marginTop: 12, backgroundColor: p.navy, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }, shadow]}
      >
        <AppIcon name="mission" size={72} />
        <View style={{ flex: 1 }}>
          <T w={700} size={18} color="#fff">Daily Mission</T>
          <T w={600} size={13.5} color="#D9D6F5">A mix of English, Maths and Science — 6 questions</T>
        </View>
        <View style={{ backgroundColor: p.sunny, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 }}>
          <T w={800} size={15} color="#2D2A4A">Play</T>
        </View>
      </Press>

      <SecTitle>Pick an island 🏝️</SecTitle>
      <View style={wide ? { flexDirection: 'row', gap: 16 } : undefined}>
      {SUBJ_KEYS.map((s) => {
        const info = SUBJECTS[s];
        const done = Object.keys(right[s]).length;
        const c = (p as any)[info.color] as string;
        return (
          <Press
            key={s}
            onPress={() => { setGameSubj(s); Sound.tap(); setTab('games'); }}
            style={[{ flex: wide ? 1 : undefined, flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 20, padding: 16, marginBottom: 12, backgroundColor: p.card, minHeight: 116 }, shadow]}
          >
            <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: (p as any)[info.soft], alignItems: 'center', justifyContent: 'center' }}>
              <AppIcon name={SUBJECT_ICON[s]} size={58} />
            </View>
            <View style={{ flex: 1 }}>
              <T w={700} size={19}>{info.name} Island</T>
              <T w={700} size={13.5} color={p.muted}>{info.topics}</T>
              <ProgressBar pct={(done / POOL_SIZE) * 100} color={c} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <T w={700} size={17}>{done}/{POOL_SIZE}</T>
              <T w={700} size={11.5} color={p.muted}>done</T>
            </View>
          </Press>
        );
      })}
      </View>
      <T w={700} size={14} color={p.muted}>
        Questions get harder every year — Year 1 starts with sounds and counting, Year 6 reaches fractions, ratio, algebra, evolution and the heart.
      </T>
    </View>
  );
}

const GAMES: { k: GameKind; ico: string; name: string; desc: string }[] = [
  { k: 'balloon', ico: '🎈', name: 'Balloon Pop', desc: 'Tap the balloon with the right answer' },
  { k: 'rescue', ico: '🦸', name: 'Rescue Quiz', desc: 'Answer to free your buddy, step by step' },
  { k: 'match', ico: '🧩', name: 'Match It', desc: 'Match each picture or word to its answer' },
  { k: 'quiz', ico: '⚡', name: 'Quick Quiz', desc: 'Six questions, four big answers' },
];

function Games() {
  const p = usePalette();
  const { wide } = useLayout();
  const shadow = useCardShadow();
  const { gameSubj, setGameSubj, startGame, year } = useApp();
  const chips: { s: GameSubj; emoji: string; label: string; border: string; bg: string }[] = [
    { s: 'E', emoji: '📚', label: 'English', border: p.violet, bg: p.violetSoft },
    { s: 'M', emoji: '🔢', label: 'Maths', border: p.orange, bg: p.orangeSoft },
    { s: 'S', emoji: '🔬', label: 'Science', border: p.green, bg: p.greenSoft },
    { s: 'X', emoji: '🌈', label: 'Mixed', border: p.sky, bg: p.selSoft },
  ];
  return (
    <View>
      <SecTitle>Choose a subject</SecTitle>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: -8, marginBottom: 14 }}>
        {chips.map((c) => {
          const sel = gameSubj === c.s;
          return (
            <Press
              key={c.s}
              onPress={() => { setGameSubj(c.s); Sound.tap(); }}
              style={[{
                flex: 1, minHeight: 52, borderRadius: 14, borderWidth: 3, paddingVertical: 12, paddingHorizontal: 2,
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                backgroundColor: sel ? c.bg : p.card, borderColor: sel ? c.border : 'transparent',
              }, shadow]}
            >
              <AppIcon name={({ E: 'english', M: 'maths', S: 'science', X: 'mixed' } as const)[c.s]} size={34} />
              <T w={800} size={14} numberOfLines={1}>{c.label}</T>
            </Press>
          );
        })}
      </View>

      <T w={800} size={20} style={{ marginBottom: 12 }}>Choose a game</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {GAMES.map((g) => (
          <Press
            key={g.k}
            onPress={() => startGame(g.k)}
            style={[{ width: wide ? '23.5%' : '47.5%', flexGrow: 1, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 14, backgroundColor: p.card, minHeight: 184 }, shadow]}
          >
            <View style={{ marginBottom: 8 }}><AppIcon name={GAME_ICON[g.k]} size={78} /></View>
            <T w={700} size={16.5}>{g.name}</T>
            <T w={700} size={12.5} color={p.muted}>{g.desc}</T>
          </Press>
        ))}
      </View>
      <T w={700} size={14} color={p.muted} style={{ marginTop: 14 }}>
        Games use your school year: Year {year}. Change it any time on the first screen or in the Grown-ups&apos; Area.
      </T>
    </View>
  );
}

function Rewards() {
  const p = usePalette();
  const { wide } = useLayout();
  const shadow = useCardShadow();
  const { stars, coins, answered, correct, stickers } = useApp();
  const pct = answered ? Math.round((correct / answered) * 100) : 0;
  const stat = (big: React.ReactNode, label: string) => (
    <View style={[{ width: wide ? '23.5%' : '47.5%', flexGrow: 1, backgroundColor: p.card, borderRadius: 20, padding: 18, alignItems: 'center' }, shadow]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{big}</View>
      <T w={700} size={13.5} color={p.muted} style={{ marginTop: 2 }}>{label}</T>
    </View>
  );
  const num = (v: number | string) => <T w={800} size={36} style={{ lineHeight: 46 }}>{v}</T>;
  return (
    <View>
      <SecTitle>My rewards 🏆</SecTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {stat(<><T size={64} style={{ lineHeight: 76 }}>⭐</T>{num(stars)}</>, 'Stars earned')}
        {stat(<><T size={64} style={{ lineHeight: 76 }}>🪙</T>{num(coins)}</>, 'Coins banked')}
        {stat(num(answered), 'Questions answered')}
        {stat(<>{num(pct)}<T w={800} size={36} style={{ lineHeight: 46 }}>%</T></>, 'Answered right')}
      </View>
      <SecTitle>Sticker wall</SecTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {STICKERS.map((s, i) => {
          const got = stickers.includes(i);
          return (
            <View
              key={i}
              style={[{ width: 80, height: 80, borderRadius: 40, backgroundColor: p.card, alignItems: 'center', justifyContent: 'center', opacity: got ? 1 : 0.28 }, shadow]}
            >
              <T size={52} style={got ? null : ({ filter: 'grayscale(1)' } as any)}>{s}</T>
            </View>
          );
        })}
      </View>
      <T w={700} size={14} color={p.muted} style={{ marginTop: 12 }}>Finish a game to earn a sticker. Stickers are never taken away.</T>
    </View>
  );
}

function TabBar() {
  const p = usePalette();
  const { contentMax } = useLayout();
  const insets = useSafeAreaInsets();
  const { tab, setTab } = useApp();
  const tabs: { t: Tab; ico: string; label: string }[] = [
    { t: 'home', ico: '🏠', label: 'Home' },
    { t: 'games', ico: '🎮', label: 'Games' },
    { t: 'rewards', ico: '🏆', label: 'Rewards' },
    { t: 'parent', ico: '👨‍👩‍👧', label: 'Parent' },
  ];
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', pointerEvents: 'box-none' }}>
      <View
        style={{
          flexDirection: 'row', width: '100%', maxWidth: contentMax, backgroundColor: p.card, borderTopWidth: 2, borderTopColor: p.line,
          paddingTop: 8, paddingHorizontal: 8, paddingBottom: 8 + insets.bottom,
        }}
      >
        {tabs.map((x) => {
          const on = tab === x.t;
          return (
            <Press
              key={x.t}
              onPress={() => { Sound.tap(); setTab(x.t); }}
              style={{ flex: 1, minHeight: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 8, backgroundColor: on ? p.violetSoft : 'transparent' }}
            >
              <AppIcon name={x.t} size={36} />
              <T w={800} size={12} color={on ? p.ink : p.muted}>{x.label}</T>
            </Press>
          );
        })}
      </View>
    </View>
  );
}

function Sidebar() {
  const p = usePalette();
  const { tab, setTab } = useApp();
  const tabs: { t: Tab; ico: string; label: string }[] = [
    { t: 'home', ico: '🏠', label: 'Home' },
    { t: 'games', ico: '🎮', label: 'Games' },
    { t: 'rewards', ico: '🏆', label: 'Rewards' },
    { t: 'parent', ico: '👨‍👩‍👧', label: 'Parent' },
  ];
  return (
    <View style={{ width: 240, backgroundColor: p.card, borderRightWidth: 2, borderRightColor: p.line, paddingVertical: 24, paddingHorizontal: 14 }}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <SvgXml xml={badgeSvg()} width={96} height={96} />
        <T w={800} size={18} style={{ marginTop: 10, textAlign: 'center' }}>Kids Learning</T>
        <T w={700} size={12.5} color={p.muted}>English • Maths • Science</T>
      </View>
      {tabs.map((x) => {
        const on = tab === x.t;
        return (
          <Press
            key={x.t}
            onPress={() => { Sound.tap(); setTab(x.t); }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 68, borderRadius: 16, paddingHorizontal: 16, marginBottom: 8, backgroundColor: on ? p.violetSoft : 'transparent' }}
          >
            <AppIcon name={x.t} size={36} />
            <T w={800} size={18} color={on ? p.ink : p.muted}>{x.label}</T>
          </Press>
        );
      })}
    </View>
  );
}

export default function Shell() {
  const p = usePalette();
  const { tab, settingsOpen } = useApp();
  const { wide, contentMax } = useLayout();
  const narrowCol = wide && (settingsOpen || tab === 'parent') ? { maxWidth: 760, alignSelf: 'center', width: '100%' } as const : undefined;
  const content = (
    <ScrollView
      key={tab + (settingsOpen ? 's' : '')}
      style={{ flex: 1 }}
      contentContainerStyle={{ width: '100%', maxWidth: contentMax, alignSelf: 'center', paddingHorizontal: wide ? 32 : 16, paddingBottom: wide ? 40 : 110 }}
    >
      <Header />
      <View style={narrowCol}>
        {settingsOpen ? <Settings /> : (
          <>
            {tab === 'home' && <Home />}
            {tab === 'games' && <Games />}
            {tab === 'rewards' && <Rewards />}
            {tab === 'parent' && <Parent />}
          </>
        )}
      </View>
    </ScrollView>
  );
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: p.bg }}>
      {wide ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Sidebar />
          {content}
        </View>
      ) : (
        <>
          {content}
          <TabBar />
        </>
      )}
    </SafeAreaView>
  );
}
