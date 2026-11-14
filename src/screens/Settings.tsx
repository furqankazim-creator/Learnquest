import React, { useContext, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { AGES, ThemeCtx, ThemePref, usePalette } from '../theme';
import { Press, T, useCardShadow } from '../components/UI';
import { useApp } from '../state';
import { Sound } from '../sound';
import { Avatar, Creator, Library } from '../components/Characters';
import { MAX_FAVS, findChar } from '../data/characters';

const THEMES: { k: ThemePref; ico: string; label: string; sub: string }[] = [
  { k: 'light', ico: '☀️', label: 'Light', sub: 'Bright cream' },
  { k: 'dark', ico: '🌙', label: 'Dark', sub: 'Night navy' },
  { k: 'auto', ico: '📱', label: 'Auto', sub: 'Like my phone' },
];

export default function Settings() {
  const p = usePalette();
  const shadow = useCardShadow();
  const { pref, setPref } = useContext(ThemeCtx);
  const { name, buddy, buddyBg, year, soundOn, toggleSound, changePlayer, setSettingsOpen, favs, custom, addFav, removeFav, createCustom, deleteCustom } = useApp();
  const [lib, setLib] = useState<null | 'manage' | 'make'>(null);
  const [full, setFull] = useState(false);
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
          <Avatar e={buddy} bg={buddyBg ?? p.sunny} size={68} />
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
        <T w={700} size={17} style={{ marginBottom: 4 }}>🦸 My characters</T>
        <T w={600} size={13.5} color={p.muted} style={{ marginBottom: 12 }}>
          Choose your {MAX_FAVS} favourites — they show on the welcome page. {favs.length} of {MAX_FAVS} chosen.
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {favs.map((id) => findChar(id, custom)).filter((c): c is NonNullable<typeof c> => !!c).map((c) => (
            <Avatar key={c.id} e={c.e} bg={c.bg ?? (p.dark ? '#3A3666' : '#fff')} size={46} />
          ))}
        </View>
        <Press onPress={() => { setFull(false); setLib('manage'); }} accessibilityLabel="Choose favourite characters" style={{ backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 56, alignItems: 'center', justifyContent: 'center', padding: 12, marginBottom: 10 }}>
          <T w={800} size={16}>⭐ Choose favourites (50+ characters)</T>
        </Press>
        <Press onPress={() => setLib('make')} accessibilityLabel="Make my own character" style={{ backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 56, alignItems: 'center', justifyContent: 'center', padding: 12 }}>
          <T w={800} size={16}>🎨 Make my own character</T>
        </Press>
      </View>

      <Modal visible={lib !== null} transparent animationType="fade" onRequestClose={() => setLib(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 12 }}>
          <View style={{ width: '100%', maxWidth: 560, maxHeight: '92%', backgroundColor: p.card, borderRadius: 22, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <T w={800} size={20} style={{ flex: 1 }}>{lib === 'make' ? 'Make my own character' : `Favourites ${favs.length}/${MAX_FAVS}`}</T>
              <Press onPress={() => setLib(null)} accessibilityLabel="Close" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: p.violetSoft, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={18}>✕</T>
              </Press>
            </View>
            {lib === 'manage' ? (
              <T w={700} size={13} color={full ? p.dangerText : p.muted} style={{ marginBottom: 8 }}>
                {full ? `You already have ${MAX_FAVS}. Tap a ★ one to remove it first.` : 'Tap a character to add or remove it.'}
              </T>
            ) : null}
            <ScrollView keyboardShouldPersistTaps="handled">
              {lib === 'make' ? (
                <Creator onCreate={(e, nm, bg) => { createCustom(e, nm, bg); setLib('manage'); }} />
              ) : (
                <Library
                  custom={custom}
                  favs={favs}
                  mode="manage"
                  onToggleFav={(c) => { if (favs.includes(c.id)) { removeFav(c.id); setFull(false); } else setFull(!addFav(c.id)); }}
                  onDeleteCustom={(c) => deleteCustom(c.id)}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
