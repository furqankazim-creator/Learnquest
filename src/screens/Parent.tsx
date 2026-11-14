import React, { useState } from 'react';
import { View } from 'react-native';
import { SUBJECTS, Subj, usePalette } from '../theme';
import { Press, ProgressBar, T, useCardShadow } from '../components/UI';
import { POOL_SIZE, useApp } from '../state';
import { Sound } from '../sound';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'go'];
const SUBJ_KEYS: Subj[] = ['E', 'M', 'S'];

type Mode = 'create' | 'confirm' | 'enter' | 'forgot';

function PinGate() {
  const p = usePalette();
  const shadow = useCardShadow();
  const { pin, setPin, setParentOpen } = useApp();
  const [mode, setMode] = useState<Mode>(pin ? 'enter' : 'create');
  const [buf, setBuf] = useState('');
  const [first, setFirst] = useState('');
  const [msg, setMsg] = useState('');
  const [sum] = useState(() => { const a = 6 + Math.floor(Math.random() * 6); const b = 6 + Math.floor(Math.random() * 6); return { a, b }; });

  const maxLen = mode === 'forgot' ? 3 : 4;
  const title = mode === 'create' ? 'Set a grown-ups’ PIN 🔒' : mode === 'confirm' ? 'Type the PIN again 🔒' : mode === 'forgot' ? 'Grown-up check 🔒' : 'Grown-ups’ Area 🔒';
  const sub = mode === 'create' ? 'Choose a 4-digit PIN that only a grown-up knows.'
    : mode === 'confirm' ? 'Enter the same 4 digits to confirm.'
    : mode === 'forgot' ? `To reset the PIN, what is ${sum.a} × ${sum.b}? Then press ✔.`
    : 'Enter your PIN to open.';

  const submit = (val: string) => {
    if (mode === 'create') { setFirst(val); setBuf(''); setMode('confirm'); setMsg(''); return; }
    if (mode === 'confirm') {
      if (val === first) { setPin(val); setBuf(''); setMsg(''); setParentOpen(true); }
      else { setMsg('Those PINs did not match. Start again.'); setBuf(''); setFirst(''); setMode('create'); }
      return;
    }
    if (mode === 'forgot') {
      if (Number(val) === sum.a * sum.b) { setPin(null); setBuf(''); setMsg(''); setMode('create'); }
      else { setMsg('Not quite — try again, grown-up!'); setBuf(''); }
      return;
    }
    if (val === pin) { setBuf(''); setMsg(''); setParentOpen(true); }
    else { setMsg('Oops — that PIN did not work. Try again, grown-up!'); setBuf(''); }
  };

  const press = (k: string) => {
    Sound.tap();
    if (k === 'clear') { setBuf((x) => x.slice(0, -1)); return; }
    if (k === 'go') { if (buf.length) submit(buf); return; }
    if (buf.length >= maxLen) return;
    const next = buf + k;
    setBuf(next);
    if (mode !== 'forgot' && next.length === 4) submit(next);
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <T w={800} size={20} style={{ marginTop: 22, marginBottom: 6, textAlign: 'center' }}>{title}</T>
      <T w={700} size={14} color={p.muted} style={{ textAlign: 'center', paddingHorizontal: 12 }}>{sub}</T>
      <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center', marginVertical: 18, minHeight: 28, alignItems: 'center' }}>
        {mode === 'forgot'
          ? <T w={800} size={26}>{buf || ' '}</T>
          : [0, 1, 2, 3].map((i) => (
              <View key={i} style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: i < buf.length ? p.violet : p.line }} />
            ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '100%', maxWidth: 280, justifyContent: 'center' }}>
        {KEYS.map((k) => (
          <Press
            key={k}
            onPress={() => press(k)}
            accessibilityLabel={k === 'clear' ? 'Delete' : k === 'go' ? 'Enter' : k}
            style={[{ width: '30.5%', flexGrow: 1, minHeight: 58, borderRadius: 16, backgroundColor: p.card, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 }, shadow]}
          >
            <T w={800} size={22}>{k === 'clear' ? '⌫' : k === 'go' ? '✔' : k}</T>
          </Press>
        ))}
      </View>
      <T w={800} size={15} color={p.coral} style={{ marginTop: 14, textAlign: 'center', minHeight: 22 }}>{msg}</T>
      {mode === 'enter' ? (
        <Press onPress={() => { setMode('forgot'); setBuf(''); setMsg(''); }} style={{ marginTop: 8, padding: 10 }}>
          <T w={700} size={14} color={p.muted}>Forgot the PIN?</T>
        </Press>
      ) : null}
      {mode === 'forgot' ? (
        <Press onPress={() => { setMode('enter'); setBuf(''); setMsg(''); }} style={{ marginTop: 8, padding: 10 }}>
          <T w={700} size={14} color={p.muted}>← Back</T>
        </Press>
      ) : null}
    </View>
  );
}

function Dashboard() {
  const p = usePalette();
  const shadow = useCardShadow();
  const { name, year, right, answered, soundOn, toggleSound, changePlayer, reset, resetNote, setPin, setParentOpen } = useApp();

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
