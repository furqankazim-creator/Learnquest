import React, { useState } from 'react';
import { View } from 'react-native';
import { usePalette } from '../theme';
import { Press, T, useCardShadow } from './UI';
import { useApp } from '../state';
import { Sound } from '../sound';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'go'];

type Mode = 'create' | 'confirm' | 'enter' | 'forgot';

export default function PinPad({ onUnlocked, intro }: { onUnlocked: () => void; intro?: string }) {
  const p = usePalette();
  const shadow = useCardShadow();
  const { pin, setPin } = useApp();
  const [mode, setMode] = useState<Mode>(pin ? 'enter' : 'create');
  const [buf, setBuf] = useState('');
  const [first, setFirst] = useState('');
  const [msg, setMsg] = useState('');
  const [sum] = useState(() => { const a = 6 + Math.floor(Math.random() * 6); const b = 6 + Math.floor(Math.random() * 6); return { a, b }; });

  const maxLen = mode === 'forgot' ? 3 : 4;
  const title = mode === 'create' ? 'Set a grown-ups’ PIN 🔒' : mode === 'confirm' ? 'Type the PIN again 🔒' : mode === 'forgot' ? 'Grown-up check 🔒' : 'Grown-ups’ Area 🔒';
  const sub = mode === 'create' ? (intro || 'Choose a 4-digit PIN that only a grown-up knows.')
    : mode === 'confirm' ? 'Enter the same 4 digits to confirm.'
    : mode === 'forgot' ? `To reset the PIN, what is ${sum.a} × ${sum.b}? Then press ✔.`
    : 'Enter your PIN to open.';

  const submit = (val: string) => {
    if (mode === 'create') { setFirst(val); setBuf(''); setMode('confirm'); setMsg(''); return; }
    if (mode === 'confirm') {
      if (val === first) { setPin(val); setBuf(''); setMsg(''); onUnlocked(); }
      else { setMsg('Those PINs did not match. Start again.'); setBuf(''); setFirst(''); setMode('create'); }
      return;
    }
    if (mode === 'forgot') {
      if (Number(val) === sum.a * sum.b) { setPin(null); setBuf(''); setMsg(''); setMode('create'); }
      else { setMsg('Not quite — try again, grown-up!'); setBuf(''); }
      return;
    }
    if (val === pin) { setBuf(''); setMsg(''); onUnlocked(); }
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

