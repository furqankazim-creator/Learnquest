import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { Avatar } from '../components/Characters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AGES, SUBJECTS, Subj, usePalette } from '../theme';
import { Press, ProgressBar, T, useCardShadow } from '../components/UI';
import { completedForYear, GameKind, GameSubj, POOL_SIZE, roundLabel, STICKERS, Tab, useApp } from '../state';
import { Sound } from '../sound';
import Parent from './Parent';
import Settings from './Settings';
import { useLayout } from '../layout';
import AppIcon, { GAME_ICON, SUBJECT_ICON, TAB_ICON } from '../components/Icons';
import { SvgXml } from 'react-native-svg';
import { badgeSvg } from '../logo';
import HopeBridgePromo from './HopeBridgePromo';
import { HOPE_BRIDGE_URL } from '../data/hopeBridge';

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

function Home({ onOpenBloomLearn, onOpenPublisher }: { onOpenBloomLearn: () => void; onOpenPublisher: () => void }) {
  const p = usePalette();
  const { wide } = useLayout();
  const shadow = useCardShadow();
  const { startGame, right, setGameSubj, setTab, year } = useApp();
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
        const done = completedForYear(right, s, year);
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

      <View style={[{ backgroundColor: '#F1F4FF', borderRadius: 24, padding: 16, marginTop: 18, marginBottom: 12, borderWidth: 1, borderColor: '#DDE3FF' }, shadow]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#DDE6FF', alignItems: 'center', justifyContent: 'center' }}>
            <T size={28}>🌱</T>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <T w={800} size={20} color="#34316A">BloomLearn</T>
              <View style={{ backgroundColor: '#D9F3E6', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 }}>
                <T w={700} size={11} color="#1B7F4A">AI</T>
              </View>
            </View>
            <T w={700} size={13} color="#6862A1">Say it. See it. Learn it.</T>
          </View>
        </View>
        <T w={600} size={13.5} color="#50527A" style={{ marginTop: 10, lineHeight: 20 }}>
          Turn spoken or typed sentences into visual learning scenes with interactive maths and science practice.
        </T>
        <Press
          onPress={() => { Sound.tap(); onOpenBloomLearn(); }}
          style={{ marginTop: 14, backgroundColor: '#CFE0FF', borderRadius: 16, minHeight: 52, alignItems: 'center', justifyContent: 'center' }}
        >
          <T w={800} size={16} color="#34316A">Meet BloomLearn ›</T>
        </Press>
      </View>

      <View style={[{ backgroundColor: '#FFF7E1', borderRadius: 24, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1E4B8' }, shadow]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#FFEAAD', alignItems: 'center', justifyContent: 'center' }}>
            <T size={28}>🌉</T>
          </View>
          <View style={{ flex: 1 }}>
            <T w={800} size={20} color="#34316A">Hope Bridge Digital</T>
            <T w={600} size={13.5} color="#6862A1">Calm, family-first learning and communication apps</T>
          </View>
        </View>
        <Press
          onPress={() => { Sound.tap(); onOpenPublisher(); }}
          style={{ marginTop: 14, backgroundColor: '#FFCF68', borderRadius: 16, minHeight: 52, alignItems: 'center', justifyContent: 'center' }}
        >
          <T w={800} size={16} color="#34316A">Explore Our Apps & Mission ›</T>
        </Press>
      </View>
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
  const { gameSubj, setGameSubj, startGame, year, customQuestions } = useApp();
  const chips: { s: GameSubj; label: string; border: string; bg: string }[] = [
    { s: 'E', label: 'English', border: p.violet, bg: p.violetSoft },
    { s: 'M', label: 'Maths', border: p.orange, bg: p.orangeSoft },
    { s: 'S', label: 'Science', border: p.green, bg: p.greenSoft },
    { s: 'X', label: 'Mixed', border: p.sky, bg: p.selSoft },
    { s: 'C', label: 'My Qs', border: p.pink, bg: p.card },
  ];
  return (
    <View>
      <SecTitle>Choose a subject</SecTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: -8, marginBottom: 14 }}>
        {chips.map((c) => {
          const sel = gameSubj === c.s;
          const iconName = ({ E: 'english', M: 'maths', S: 'science', X: 'mixed', C: 'mission' } as const)[c.s];
          return (
            <Press
              key={c.s}
              onPress={() => { setGameSubj(c.s); Sound.tap(); }}
              style={[{
                width: wide ? '18.5%' : '31%', flexGrow: 1, minHeight: 60, borderRadius: 14, borderWidth: 3, paddingVertical: 10, paddingHorizontal: 4,
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                backgroundColor: sel ? c.bg : p.card, borderColor: sel ? c.border : 'transparent',
              }, shadow]}
            >
              <AppIcon name={iconName} size={30} />
              <T w={800} size={13} numberOfLines={1}>{c.label}</T>
              {c.s === 'C' ? <T w={700} size={10.5} color={p.muted}>{customQuestions.length} made</T> : null}
            </Press>
          );
        })}
      </View>

      {gameSubj === 'C' ? (
        <View style={[{ backgroundColor: p.violetSoft, borderRadius: 16, padding: 14, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: p.violet }, shadow]}>
          <T w={800} size={15}>My Questions mode</T>
          <T w={700} size={13.5} color={p.muted} style={{ marginTop: 4, lineHeight: 19 }}>
            {customQuestions.length > 0
              ? `Play ${customQuestions.length} question${customQuestions.length === 1 ? '' : 's'} created by a grown-up. Only you can see them here.`
              : 'No custom questions yet. A grown-up can add them in Settings (PIN required).'}
          </T>
        </View>
      ) : null}

      <T w={800} size={20} style={{ marginBottom: 12 }}>Choose a game</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {GAMES.map((g) => {
          const disabled = gameSubj === 'C' && customQuestions.length === 0;
          return (
          <Press
            key={g.k}
            onPress={() => { if (!disabled) startGame(g.k); }}
            style={[{ width: wide ? '23.5%' : '47.5%', flexGrow: 1, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 14, backgroundColor: p.card, minHeight: 184, opacity: disabled ? 0.45 : 1 }, shadow]}
          >
            <View style={{ marginBottom: 8 }}><AppIcon name={GAME_ICON[g.k]} size={78} /></View>
            <T w={700} size={16.5}>{g.name}</T>
            <T w={700} size={12.5} color={p.muted}>{g.desc}</T>
          </Press>
        ); })}
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
  const card = { backgroundColor: p.card, borderRadius: 20, padding: 16, marginBottom: 12 } as const;
  const { name, buddy, buddyBg, year, stars, coins, answered, correct, stickers, streak, right, setTab } = useApp();
  const pct = answered ? Math.round((correct / answered) * 100) : 0;
  const nextSticker = STICKERS.findIndex((_, i) => !stickers.includes(i));
  const stickerCount = stickers.length;
  const islandDone = (s: Subj) => completedForYear(right, s, year);

  const milestones = [
    { id: 'q10', title: 'Curious Starter', desc: 'Answer 10 questions', done: answered >= 10, icon: '🌱' },
    { id: 'q50', title: 'Question Hero', desc: 'Answer 50 questions', done: answered >= 50, icon: '🧠' },
    { id: 's20', title: 'Star Collector', desc: 'Earn 20 stars', done: stars >= 20, icon: '⭐' },
    { id: 'c50', title: 'Coin Saver', desc: 'Bank 50 coins', done: coins >= 50, icon: '🪙' },
    { id: 'st3', title: 'On a Roll', desc: 'Reach a 3-day streak', done: streak >= 3, icon: '🔥' },
    { id: 'st5', title: '5-Day Champion', desc: 'Reach a 5-day streak', done: streak >= 5, icon: '🏅' },
    { id: 'st6', title: 'Sticker Star', desc: 'Collect 6 stickers', done: stickerCount >= 6, icon: '🎖️' },
    { id: 'acc', title: 'Sharp Thinker', desc: '80% right (10+ answers)', done: answered >= 10 && pct >= 80, icon: '🎯' },
  ];
  const earnedMilestones = milestones.filter((m) => m.done).length;

  let cheer = 'Play a game to earn your first star and sticker!';
  if (answered === 0) cheer = 'Your treasure chest is ready. Play a game to earn stars, coins and stickers!';
  else if (nextSticker === -1) cheer = 'Amazing! You collected every sticker. Keep playing to grow your stars and coins!';
  else if (pct >= 80) cheer = 'Brilliant work! Your answers are shining bright today.';
  else if (streak >= 2) cheer = `You are on a ${streak}-day streak. Come back tomorrow to keep it going!`;
  else cheer = 'Every game makes you stronger. Finish games to unlock more stickers!';

  const stat = (big: React.ReactNode, label: string, tint: string) => (
    <View style={[{ width: wide ? '23.5%' : '47.5%', flexGrow: 1, backgroundColor: p.card, borderRadius: 20, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: tint }, shadow]}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>{big}</View>
      <T w={700} size={13.5} color={p.muted} style={{ marginTop: 4, textAlign: 'center' }}>{label}</T>
    </View>
  );
  const num = (v: number | string, color?: string) => <T w={800} size={34} color={color} style={{ lineHeight: 42 }}>{v}</T>;

  return (
    <View>
      <SecTitle>My rewards</SecTitle>
      <View style={[{ backgroundColor: p.navy, borderRadius: 22, padding: 18, flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'flex-start', gap: 14 }, shadow]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <Avatar e={buddy} bg={buddyBg ?? p.sunny} size={74} />
          <View style={{ flex: 1 }}>
            <T w={800} size={22} color="#fff" numberOfLines={1}>{name}&apos;s treasure</T>
            <T w={700} size={14} color="#D9D6F5" style={{ marginTop: 2 }}>Year {year} • {stickerCount}/{STICKERS.length} stickers • {earnedMilestones}/{milestones.length} badges</T>
            <T w={700} size={14.5} color="#fff" style={{ marginTop: 8, lineHeight: 21 }}>{cheer}</T>
          </View>
        </View>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', minWidth: wide ? 150 : undefined, alignSelf: wide ? 'auto' : 'stretch' }}>
          <T size={30} style={{ lineHeight: 36 }}>🔥</T>
          <T w={800} size={28} color="#fff" style={{ lineHeight: 34 }}>{streak}</T>
          <T w={700} size={13} color="#D9D6F5">day streak</T>
          <T w={700} size={12.5} color="#D9D6F5" style={{ marginTop: 4, textAlign: 'center' }}>{streak > 0 ? 'Keep it going!' : 'Play today to start'}</T>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
        {stat(<><T size={46} style={{ lineHeight: 54 }}>⭐</T>{num(stars, p.ink)}</>, 'Stars earned', p.orangeSoft)}
        {stat(<><T size={46} style={{ lineHeight: 54 }}>🪙</T>{num(coins, p.ink)}</>, 'Coins banked', p.sunny + '55')}
        {stat(<><T size={40} style={{ lineHeight: 48 }}>🧩</T>{num(answered, p.ink)}</>, 'Questions answered', p.violetSoft)}
        {stat(<><T size={40} style={{ lineHeight: 48 }}>🎯</T>{num(`${pct}%`, p.ink)}</>, 'Answered right', p.greenSoft)}
      </View>

      <SecTitle>Next sticker</SecTitle>
      <View style={[{ backgroundColor: p.card, borderRadius: 20, padding: 16 }, shadow]}>
        {nextSticker === -1 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <T size={52} style={{ lineHeight: 62 }}>🏆</T>
            <View style={{ flex: 1 }}>
              <T w={800} size={18}>Sticker wall complete!</T>
              <T w={700} size={14} color={p.muted} style={{ marginTop: 4 }}>You earned all {STICKERS.length} stickers. Every sticker stays with you forever.</T>
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: p.violetSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: p.violet }}>
              <T size={44} style={{ lineHeight: 54 }}>{STICKERS[nextSticker]}</T>
            </View>
            <View style={{ flex: 1 }}>
              <T w={800} size={18}>Finish a game to unlock this sticker</T>
              <T w={700} size={14} color={p.muted} style={{ marginTop: 4 }}>Get at least one answer right in a game and a new sticker will join your wall.</T>
              <ProgressBar pct={(stickerCount / STICKERS.length) * 100} color={p.violet} />
              <T w={700} size={13} color={p.muted} style={{ marginTop: 4 }}>{stickerCount} of {STICKERS.length} stickers collected</T>
            </View>
          </View>
        )}
      </View>

      <SecTitle>Island progress</SecTitle>
      <View style={wide ? { flexDirection: 'row', gap: 12 } : { gap: 12 }}>
        {SUBJ_KEYS.map((s) => {
          const info = SUBJECTS[s];
          const done = islandDone(s);
          const c = (p as any)[info.color] as string;
          const soft = (p as any)[info.soft] as string;
          return (
            <View key={s} style={[{ flex: wide ? 1 : undefined, backgroundColor: p.card, borderRadius: 20, padding: 16 }, shadow]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: soft, alignItems: 'center', justifyContent: 'center' }}>
                  <AppIcon name={SUBJECT_ICON[s]} size={32} />
                </View>
                <View style={{ flex: 1 }}>
                  <T w={800} size={17}>{info.name}</T>
                  <T w={700} size={13} color={p.muted}>{done} of {POOL_SIZE} questions mastered</T>
                </View>
                <T w={800} size={16} color={c}>{Math.round((done / POOL_SIZE) * 100)}%</T>
              </View>
              <ProgressBar pct={(done / POOL_SIZE) * 100} color={c} />
              <T w={800} size={12} color={c} style={{ marginTop: 5 }}>{done >= POOL_SIZE ? 'All 3 rounds complete' : roundLabel(done)}</T>
            </View>
          );
        })}
      </View>

      <SecTitle>My badges</SecTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {milestones.map((m) => (
          <View
            key={m.id}
            style={[{
              width: wide ? '23.5%' : '47.5%', flexGrow: 1, backgroundColor: m.done ? p.card : p.bg, borderRadius: 18, padding: 14,
              borderWidth: 2, borderColor: m.done ? p.green : p.line, opacity: m.done ? 1 : 0.72,
            }, m.done ? shadow : null]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <T size={28} style={{ lineHeight: 34 }}>{m.icon}</T>
              <View style={{ flex: 1 }}>
                <T w={800} size={15} numberOfLines={1}>{m.title}</T>
                <T w={700} size={12.5} color={m.done ? p.green : p.muted}>{m.done ? 'Earned' : 'Keep going'}</T>
              </View>
            </View>
            <T w={700} size={13} color={p.muted} style={{ marginTop: 6, lineHeight: 18 }}>{m.desc}</T>
          </View>
        ))}
      </View>

      <SecTitle>Sticker wall</SecTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {STICKERS.map((s, i) => {
          const got = stickers.includes(i);
          return (
            <View
              key={i}
              style={[{
                width: wide ? 84 : 76, height: wide ? 84 : 76, borderRadius: (wide ? 84 : 76) / 2, backgroundColor: got ? p.card : p.bg,
                alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: got ? p.sunny : p.line, opacity: got ? 1 : 0.55,
              }, got ? shadow : null]}
            >
              <T size={got ? 46 : 40} style={got ? null : ({ filter: 'grayscale(1)' } as any)}>{s}</T>
            </View>
          );
        })}
      </View>
      <T w={700} size={14} color={p.muted} style={{ marginTop: 12, marginBottom: 8 }}>Stars and coins always grow, never shrink. Stickers stay on your wall forever. Every question you try helps you learn!</T>

      <View style={[card, shadow, { marginTop: 14 }]}>
        <T w={700} size={17} style={{ marginBottom: 8 }}>🎁 Grown-ups: Make custom questions</T>
        <T w={600} size={13.5} color={p.muted} style={{ lineHeight: 21, marginBottom: 10 }}>
          Create your own spelling, maths or science questions with pictures. Child plays them in Games → My Qs, and you can see their answers in Settings → My Questions → Answer log.
        </T>
        <Press onPress={() => setTab('parent')} style={{ backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 52, alignItems: 'center', justifyContent: 'center', padding: 14 }}>
          <T w={800} size={16}>Open Grown-ups Area</T>
        </Press>
      </View>
    </View>
  );
}

function TabBar() {
  const p = usePalette();
  const shadow = useCardShadow();
  const insets = useSafeAreaInsets();
  const { tab, setTab } = useApp();
  const tabs: { t: Tab; label: string }[] = [
    { t: 'home', label: 'Home' },
    { t: 'games', label: 'Games' },
    { t: 'rewards', label: 'Rewards' },
    { t: 'discover', label: 'Discover' },
    { t: 'parent', label: 'Parent' },
  ];
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, 10) + 8, pointerEvents: 'box-none' }}>
      <View
        style={[{
          flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 420, backgroundColor: p.card, borderRadius: 28,
          paddingVertical: 8, paddingHorizontal: 8, gap: 6, borderWidth: 1, borderColor: p.line,
        }, shadow]}
      >
        {tabs.map((x) => {
          const on = tab === x.t;
          return (
            <Press
              key={x.t}
              onPress={() => { Sound.tap(); setTab(x.t); }}
              accessibilityLabel={x.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={{
                flex: 1, minHeight: 54, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 6, paddingHorizontal: 4,
                backgroundColor: on ? p.violetSoft : 'transparent', borderWidth: on ? 1.5 : 0, borderColor: on ? p.violet : 'transparent',
              }}
            >
              <AppIcon name={TAB_ICON[x.t]} size={28} />
              <T w={800} size={11} color={on ? p.violet : p.muted} numberOfLines={1}>{x.label}</T>
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
    { t: 'discover', ico: '🌉', label: 'Discover' },
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
  const { tab, settingsOpen, setTab } = useApp();
  const { wide, contentMax } = useLayout();
  const [discoverView, setDiscoverView] = React.useState<'portfolio' | 'bloom'>('portfolio');
  const openBloomLearn = () => { setDiscoverView('bloom'); setTab('discover'); };
  const openPublisher = () => { setDiscoverView('portfolio'); setTab('discover'); };
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
            {tab === 'home' && <Home onOpenBloomLearn={openBloomLearn} onOpenPublisher={openPublisher} />}
            {tab === 'games' && <Games />}
            {tab === 'rewards' && <Rewards />}
            {tab === 'discover' && <HopeBridgePromo view={discoverView} />}
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
