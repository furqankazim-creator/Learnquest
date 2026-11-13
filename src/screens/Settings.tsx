import React, { useContext } from 'react';
import { View } from 'react-native';
import { AGES, ThemeCtx, ThemePref, usePalette } from '../theme';
import { Press, T, useCardShadow } from '../components/UI';
import { useApp } from '../state';
import { Sound } from '../sound';

const THEMES: { k: ThemePref; ico: string; label: string; sub: string }[] = [
  { k: 'light', ico: '☀️', label: 'Light', sub: 'Bright cream' },
  { k: 'dark', ico: '🌙', label: 'Dark', sub: 'Night navy' },
  { k: 'auto', ico: '📱', label: 'Auto', sub: 'Like my phone' },
];

export default function Settings() {
  const p = usePalette();
  const shadow = useCardShadow();
  const { pref, setPref } = useContext(ThemeCtx);
  const { name, buddy, year, soundOn, toggleSound, changePlayer, setSettingsOpen } = useApp();
  const card = { backgroundColor: p.card, borderRadius: 20, padding: 18, marginBottom: 12 } as const;

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, marginBottom: 6 }}>
        <Press
          onPress={() => { Sound.tap(); setSettingsOpen(false); }}
          accessibilityLabel="Back"
          style={[{ width: 48, height: 48, borderRadius: 24, backgroundColor: p.card, alignItems: 'center', justifyContent: 'center' }, shadow]}
        >
          <T size={26}>←</T>
        </Press>
        <T w={800} size={24} style={{ flex: 1 }}>Settings ⚙️</T>
      </View>

      <View style={[card, shadow, { marginTop: 14 }]}>
        <T w={700} size={17} style={{ marginBottom: 4 }}>🎨 Colour theme</T>
        <T w={600} size={13.5} color={p.muted} style={{ marginBottom: 12 }}>Pick how the app looks.</T>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {THEMES.map((t) => {
            const sel = pref === t.k;
            return (
              <Press
                key={t.k}
                onPress={() => { setPref(t.k); Sound.tap(); }}
                style={{
                  flex: 1, minHeight: 112, borderRadius: 16, borderWidth: 3, paddingVertical: 12, paddingHorizontal: 4,
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: sel ? p.sky : p.violetSoft, borderColor: sel ? '#2F6FD0' : 'transparent',
                }}
              >
                <T size={44} style={{ lineHeight: 54 }}>{t.ico}</T>
                <T w={800} size={16} color={sel ? '#fff' : p.ink}>{t.label}</T>
                <T w={700} size={11.5} color={sel ? '#E3EFFF' : p.muted} style={{ textAlign: 'center' }}>{t.sub}</T>
              </Press>
            );
          })}
        </View>
      </View>

      <View style={[card, shadow]}>
        <T w={700} size={17} style={{ marginBottom: 4 }}>{soundOn ? '🔊' : '🔇'} Sound</T>
        <T w={600} size={13.5} color={p.muted} style={{ marginBottom: 12 }}>
          Sound is {soundOn ? 'on' : 'off'} — questions are read aloud and games play gentle sounds.
        </T>
        <Press onPress={toggleSound} style={{ backgroundColor: soundOn ? p.sunny : p.violetSoft, borderRadius: 14, minHeight: 60, alignItems: 'center', justifyContent: 'center', padding: 14 }}>
          <T w={800} size={16} color={soundOn ? '#2D2A4A' : p.ink}>{soundOn ? '🔊 Turn sound off' : '🔇 Turn sound on'}</T>
        </Press>
      </View>

      <View style={[card, shadow]}>
        <T w={700} size={17} style={{ marginBottom: 10 }}>👤 Player</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <View style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: p.sunny, alignItems: 'center', justifyContent: 'center' }}>
            <T size={42} style={{ lineHeight: 50 }}>{buddy}</T>
          </View>
          <View style={{ flex: 1 }}>
            <T w={700} size={18} numberOfLines={1}>{name}</T>
            <T w={700} size={13.5} color={p.muted}>Year {year} • {AGES[year]}</T>
          </View>
        </View>
        <Press onPress={() => { setSettingsOpen(false); changePlayer(); }} style={{ backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 60, alignItems: 'center', justifyContent: 'center', padding: 14 }}>
          <T w={800} size={16}>{buddy} Change player, buddy or year</T>
        </Press>
      </View>

      <View style={[card, shadow]}>
        <T w={700} size={17} style={{ marginBottom: 8 }}>🔒 Privacy</T>
        <T w={600} size={14} color={p.muted} style={{ lineHeight: 21 }}>
          This app has no accounts, no ads, no chat and no tracking. It never asks for an email, birthday or location. The first name, buddy, school year, stars and stickers are saved only on this device and are never sent anywhere. Grown-ups can erase everything from the Parent tab → Reset, or by deleting the app.
        </T>
      </View>

      <View style={[card, shadow]}>
        <T w={700} size={17} style={{ marginBottom: 8 }}>About this app</T>
        <T w={600} size={14} color={p.muted} style={{ lineHeight: 21 }}>
          English, Maths and Science for Years 1–6 (ages 5–11). No ads, no chat, no timers and no fail screens. Only a first name is used. Progress is saved on this device only.
        </T>
      </View>
    </View>
  );
}
