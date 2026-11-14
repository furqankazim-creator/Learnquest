import React, { useContext, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AGES, FIXED, FONT, ThemeCtx, usePalette } from '../theme';
import { Press, T, useCardShadow } from '../components/UI';
import { useApp } from '../state';
import { useLayout } from '../layout';
import { SvgXml } from 'react-native-svg';
import { badgeSvg } from '../logo';
import { Avatar, Creator, Library } from '../components/Characters';
import { findChar } from '../data/characters';

export default function Welcome() {
  const p = usePalette();
  const { wide, mid } = useLayout();
  const shadow = useCardShadow();
  const { enter, soundOn, toggleSound, year: lastYear, favs, custom, pin, buddyId, createCustom } = useApp();
  const { pref, setPref } = useContext(ThemeCtx);
  const [name, setName] = useState('');
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [err, setErr] = useState('');
  const [chosen, setChosen] = useState(buddyId || 'fox');
  const [more, setMore] = useState<null | 'pick' | 'make'>(null);
  const cur = findChar(chosen, custom) ?? findChar('fox', custom)!;
  const me = { id: cur.id, e: cur.e, bg: cur.bg ?? null };
  const favList = favs.map((id) => findChar(id, custom)).filter((x): x is NonNullable<typeof x> => !!x);
  const [year, setYear] = useState(lastYear || 2);
  const [focus, setFocus] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: p.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ width: '100%', maxWidth: wide ? 1100 : mid ? 560 : 480, alignSelf: 'center', paddingHorizontal: wide ? 32 : 16, paddingBottom: 32, paddingTop: wide ? 24 : 0 }}
        >
          <View style={wide ? { flexDirection: 'row', gap: 40, alignItems: 'flex-start' } : undefined}>
          <View style={wide ? { flex: 1 } : undefined}>
          {/* top: owl + corner buttons */}
          <View style={{ alignItems: 'center', paddingTop: 26 }}>
            <View style={{ position: 'absolute', top: 22, right: 0, gap: 10, zIndex: 2 }}>
              <Press
                onPress={toggleSound}
                accessibilityLabel="Sound on or off"
                style={[{ width: 60, height: 60, borderRadius: 30, backgroundColor: p.sunny, alignItems: 'center', justifyContent: 'center' }, shadow]}
              >
                <T size={28}>{soundOn ? '🔊' : '🔇'}</T>
              </Press>
              <Press
                onPress={() => setPref(pref === 'dark' ? 'light' : 'dark')}
                accessibilityLabel="Light or dark theme"
                style={[{ width: 60, height: 60, borderRadius: 30, backgroundColor: p.violetSoft, alignItems: 'center', justifyContent: 'center' }, shadow]}
              >
                <T size={28}>{pref === 'dark' ? '☀️' : '🌙'}</T>
              </Press>
              <Press
                onPress={() => enter('Guest Explorer', me, year, 'parent')}
                accessibilityLabel="Grown-ups area"
                style={[{ width: 60, height: 60, borderRadius: 30, backgroundColor: p.violetSoft, alignItems: 'center', justifyContent: 'center' }, shadow]}
              >
                <T size={30}>👨‍👩‍👧</T>
              </Press>
            </View>
            <SvgXml xml={badgeSvg()} width={160} height={160} />
            <T w={800} size={30} style={{ lineHeight: 34.5, textAlign: 'center', marginTop: 18, marginBottom: 6 }}>
              Who is learning today?
            </T>
            <T w={700} size={15} color={p.muted} style={{ textAlign: 'center', marginBottom: 20 }}>
              English • Maths • Science — Years 1 to 6
            </T>
          </View>

          {/* Play now */}
          <Press
            onPress={() => enter('Guest Explorer', me, year)}
            style={[{ backgroundColor: p.navy, borderRadius: 20, padding: 18, flexDirection: 'row', gap: 14, alignItems: 'flex-start', minHeight: 64 }, shadow]}
          >
            <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: FIXED.playIcon, alignItems: 'center', justifyContent: 'center' }}>
              <T size={30} color="#fff">▶</T>
            </View>
            <View style={{ flex: 1 }}>
              <T w={700} size={21} color="#fff" style={{ marginBottom: 4 }}>Play now!</T>
              <T w={600} size={14} color={FIXED.lavender} style={{ lineHeight: 20.3 }}>
                Jump straight into the games — no name, no waiting. Save a player profile below only if you want to keep a name and buddy for next time.
              </T>
            </View>
          </Press>

          </View>
          <View style={wide ? { flex: 1 } : undefined}>
          {/* profile card */}
          <View style={[{ backgroundColor: p.card, borderRadius: 20, paddingVertical: 20, paddingHorizontal: 18, marginTop: wide ? 26 : 18 }, shadow]}>
            <T w={700} size={16} style={{ marginBottom: 4 }}>⭐ Save a player profile</T>
            <T w={600} size={12.5} color={p.muted}>Optional — Play now! above works without it.</T>

            <T w={800} size={15} style={{ marginTop: 16, marginBottom: 8 }}>First name</T>
            <TextInput
              value={name}
              onChangeText={setName}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              placeholder="e.g. Aisha"
              placeholderTextColor={p.muted}
              maxLength={20}
              autoCorrect={false}
              style={[
                {
                  fontSize: 17, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, borderWidth: 2,
                  borderColor: focus ? p.sky : p.line, backgroundColor: p.bg, color: p.ink,
                },
                { fontFamily: FONT.regular },
                Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null,
              ]}
            />
            <T w={600} size={12.5} color={p.muted} style={{ marginTop: 6 }}>First name only — no email or birthday is ever asked for.</T>

            {!pin ? (
              <View style={{ marginTop: 16 }}>
                <T w={800} size={15} style={{ marginBottom: 4 }}>🔒 Parent PIN</T>
                <T w={600} size={12.5} color={p.muted} style={{ marginBottom: 8 }}>A parent chooses 4 numbers. It protects the Grown-ups area, Change player and Reset.</T>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {[['Choose PIN', pin1, setPin1], ['Repeat PIN', pin2, setPin2]].map(([ph, v, set]: any) => (
                    <TextInput
                      key={ph}
                      value={v}
                      onChangeText={(x: string) => { set(x.replace(/\D/g, '').slice(0, 4)); setErr(''); }}
                      placeholder={ph}
                      placeholderTextColor={p.muted}
                      keyboardType="number-pad"
                      secureTextEntry
                      maxLength={4}
                      accessibilityLabel={ph}
                      style={[{ flex: 1, minWidth: 0, width: '48%', fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderRadius: 14, borderWidth: 2, borderColor: p.line, backgroundColor: p.bg, color: p.ink, fontFamily: FONT.regular }, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null]}
                    />
                  ))}
                </View>
                {err ? <T w={700} size={13} color={p.dangerText} style={{ marginTop: 6 }}>{err}</T> : null}
              </View>
            ) : (
              <View style={{ marginTop: 16, backgroundColor: p.violetSoft, borderRadius: 14, padding: 12 }}>
                <T w={800} size={14}>🔒 Parent PIN is set ✓</T>
                <T w={600} size={12.5} color={p.muted}>Asked for the Grown-ups area, Change player and Reset.</T>
              </View>
            )}

            <T w={800} size={15} style={{ marginTop: 16, marginBottom: 8 }}>Pick a buddy</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {favList.map((c) => {
                const sel = c.id === chosen;
                return (
                  <Press
                    key={c.id}
                    onPress={() => setChosen(c.id)}
                    accessibilityLabel={`Buddy ${c.name}`}
                    style={{ width: '22%', flexGrow: 1, minHeight: 78, borderRadius: 14, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: sel ? p.sunny : p.violetSoft, borderColor: sel ? FIXED.buddyBorder : 'transparent' }}
                  >
                    <Avatar e={c.e} bg={c.bg ?? (p.dark ? '#3A3666' : '#fff')} size={52} />
                  </Press>
                );
              })}
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Press onPress={() => setMore('pick')} accessibilityLabel="More characters" style={{ flex: 1, minHeight: 48, borderRadius: 14, backgroundColor: p.violetSoft, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={14} color={p.ink}>＋ More characters</T>
              </Press>
              <Press onPress={() => setMore('make')} accessibilityLabel="Make my own character" style={{ flex: 1, minHeight: 48, borderRadius: 14, backgroundColor: p.violetSoft, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={14} color={p.ink}>🎨 Make my own</T>
              </Press>
            </View>

            <T w={800} size={15} style={{ marginTop: 16, marginBottom: 8 }}>School year</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {[1, 2, 3, 4, 5, 6].map((y) => {
                const sel = y === year;
                return (
                  <Press
                    key={y}
                    onPress={() => setYear(y)}
                    style={{
                      width: '30%', flexGrow: 1, minHeight: 60, borderRadius: 14, borderWidth: 3, paddingVertical: 9, paddingHorizontal: 4,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: sel ? p.sky : p.violetSoft, borderColor: sel ? FIXED.yearBorder : 'transparent',
                    }}
                  >
                    <T w={700} size={16} color={sel ? '#fff' : p.ink}>Year {y}</T>
                    <T w={700} size={12} color={sel ? FIXED.yearAge : p.muted}>{AGES[y]}</T>
                  </Press>
                );
              })}
            </View>

            <Press
              onPress={() => {
                const n = name.replace(/\s+/g, ' ').trim();
                if (!pin) {
                  if (pin1.length !== 4) { setErr('Please choose a 4-number PIN.'); return; }
                  if (pin1 !== pin2) { setErr('The two PINs do not match.'); return; }
                }
                enter(n || 'Guest Explorer', me, year, 'home', pin ? undefined : pin1);
              }}
              style={[{ marginTop: 20, backgroundColor: p.sky, borderRadius: 16, minHeight: 60, alignItems: 'center', justifyContent: 'center', padding: 16 }, shadow]}
            >
              <T w={800} size={18} color="#fff">Start learning →</T>
            </Press>
            <T w={700} size={13} color={p.muted} style={{ textAlign: 'center', marginTop: 14, marginBottom: 4 }}>
              No timers • No ads • Stars and coins are only ever earned, never lost
            </T>
          </View>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={more !== null} transparent animationType="fade" onRequestClose={() => setMore(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 12 }}>
          <View style={{ width: '100%', maxWidth: 560, maxHeight: '92%', backgroundColor: p.card, borderRadius: 22, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <T w={800} size={20} style={{ flex: 1 }}>{more === 'make' ? 'Make my own character' : 'Choose a character'}</T>
              <Press onPress={() => setMore(null)} accessibilityLabel="Close" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: p.violetSoft, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={18}>✕</T>
              </Press>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {more === 'make' ? (
                <Creator onCreate={(e, nm, bg) => { const id = createCustom(e, nm, bg); setChosen(id); setMore(null); }} />
              ) : (
                <Library custom={custom} favs={favs} selectedId={chosen} mode="pick" onPick={(c) => { setChosen(c.id); setMore(null); }} />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
