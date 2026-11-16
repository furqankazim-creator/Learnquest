import React from 'react';
import { View } from 'react-native';
import { SUBJECTS, Subj, usePalette } from '../theme';
import { Press, ProgressBar, T, useCardShadow } from '../components/UI';
import { POOL_SIZE, useApp } from '../state';
import PinPad from '../components/PinPad';

const SUBJ_KEYS: Subj[] = ['E', 'M', 'S'];

function PinGate() {
  const { setParentOpen } = useApp();
  return <PinPad onUnlocked={() => setParentOpen(true)} />;
}

function Dashboard() {
  const p = usePalette();
  const shadow = useCardShadow();
  const { name, year, right, answered, soundOn, toggleSound, changePlayer, reset, resetNote, setPin, setParentOpen } = useApp();
  const { customQuestions } = useApp() as any;

  const pending: Subj[] = [];
  const counts: Record<Subj, number> = { E: 0, M: 0, S: 0 };
  SUBJ_KEYS.forEach((s) => {
    counts[s] = Object.keys(right[s]).length;
    if (counts[s] < POOL_SIZE) pending.push(s);
  });
  let tip: string;
  if (resetNote) tip = 'Progress reset. Play a first game together, then check back here for a tip.';
  else if (!pending.length) tip = `${name} has answered every Year ${year} question right — try the next year up for a stretch!`;
  else if (answered === 0) tip = 'Play a first game together, then check back here for a tip.';
  else {
    const s = pending[0];
    const game = s === 'M' ? 'Balloon Pop' : s === 'E' ? 'Match It' : 'Rescue Quiz';
    tip = `${name} is building ${SUBJECTS[s].name} in Year ${year} — play ${game} (${SUBJECTS[s].name}) for 5 minutes tonight.`;
  }

  const card = { backgroundColor: p.card, borderRadius: 20, padding: 18, marginBottom: 12 } as const;
  return (
    <View>
      <T w={800} size={20} style={{ marginTop: 22, marginBottom: 12 }}>Progress report 📊</T>

      <View style={{ backgroundColor: p.orangeSoft, borderRadius: 20, padding: 18, marginBottom: 12 }}>
        <T w={700} size={17} style={{ marginBottom: 6 }}>💡 Practise tonight</T>
        <T w={700} size={14.5} style={{ lineHeight: 21.75 }}>{tip}</T>
      </View>

      {SUBJ_KEYS.map((s) => {
        const info = SUBJECTS[s];
        return (
          <View key={s} style={[card, shadow]}>
            <T w={700} size={17} style={{ marginBottom: 8 }}>{info.emoji} {info.name} — Year {year}</T>
            <ProgressBar pct={(counts[s] / POOL_SIZE) * 100} color={(p as any)[info.color]} />
            <T w={600} size={14} color={p.muted} style={{ lineHeight: 21, marginTop: 8 }}>
              {counts[s]} of {POOL_SIZE} {info.name} questions answered right so far
            </T>
          </View>
        );
      })}

      {customQuestions.length > 0 ? (
        <View style={[card, shadow]}>
          <T w={700} size={17} style={{ marginBottom: 8 }}>📝 My Questions</T>
          <T w={600} size={14} color={p.muted} style={{ lineHeight: 21, marginBottom: 10 }}>
            {customQuestions.length} custom question{customQuestions.length === 1 ? '' : 's'} created. Child plays them in Games → My Qs.
          </T>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Press onPress={() => setParentOpen(false)} style={{ flex: 1, backgroundColor: p.violetSoft, borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} size={14}>Manage in Settings</T>
            </Press>
          </View>
        </View>
      ) : null}

      <View style={[card, shadow]}>
        <T w={700} size={17} style={{ marginBottom: 8 }}>⚙️ Settings</T>
        <T w={600} size={14} color={p.muted} style={{ lineHeight: 21, marginBottom: 12 }}>
          Sound is {soundOn ? 'on' : 'off'} — questions are read aloud and games play gentle sounds.
        </T>
        <Press onPress={toggleSound} style={{ backgroundColor: p.violetSoft, borderRadius: 14, padding: 15, minHeight: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <T w={800} size={16}>{soundOn ? '🔊' : '🔇'} Turn sound off / on</T>
        </Press>
        <Press onPress={changePlayer} style={{ backgroundColor: p.violetSoft, borderRadius: 14, padding: 15, minHeight: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <T w={800} size={16}>🦊 Change player, buddy or year</T>
        </Press>
        <Press onPress={() => { setPin(null); setParentOpen(false); }} style={{ backgroundColor: p.violetSoft, borderRadius: 14, padding: 15, minHeight: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <T w={800} size={16}>🔑 Change grown-ups’ PIN</T>
        </Press>
        <Press onPress={reset} style={{ backgroundColor: p.dangerBg, borderRadius: 14, padding: 15, minHeight: 56, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} size={16} color={p.dangerText}>Reset stars, coins and progress</T>
        </Press>
      </View>

      <View style={[card, shadow]}>
        <T w={700} size={17} style={{ marginBottom: 8 }}>About this app</T>
        <T w={600} size={14} color={p.muted} style={{ lineHeight: 21 }}>
          English, Maths and Science for Years 1–6 (ages 5–11), with topics inspired by the UK National Curriculum (Year N matches school Year N). No ads, no chat, no timers and no fail screens. Only a first name is used. Progress is saved on this device only and is never sent anywhere — no accounts, no tracking, no ads.
        </T>
      </View>
    </View>
  );
}

export default function Parent() {
  const { parentOpen } = useApp();
  return parentOpen ? <Dashboard /> : <PinGate />;
}
