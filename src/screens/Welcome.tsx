import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AGES, FIXED, FONT, usePalette } from '../theme';
import { Press, T, useCardShadow } from '../components/UI';
import { useApp } from '../state';
import { useLayout } from '../layout';
import { SvgXml } from 'react-native-svg';
import { badgeSvg } from '../logo';

const BUDDIES = ['🦊', '🐼', '🦁', '🐰', '🐸', '🦄', '🐙', '🚀'];

export default function Welcome() {
  const p = usePalette();
  const { wide, mid } = useLayout();
  const shadow = useCardShadow();
  const { enter, soundOn, toggleSound, year: lastYear } = useApp();
  const [name, setName] = useState('');
  const [buddy, setBuddy] = useState('🦊');
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
                onPress={() => enter('Guest Explorer', '🦊', year, 'parent')}
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
            onPress={() => enter('Guest Explorer', '🦊', year)}
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

            <T w={800} size={15} style={{ marginTop: 16, marginBottom: 8 }}>Pick a buddy</T>
            <View style={{ gap: 10 }}>
              {[BUDDIES.slice(0, 4), BUDDIES.slice(4)].map((rowB, ri) => (
                <View key={ri} style={{ flexDirection: 'row', gap: 10 }}>
                  {rowB.map((b) => {
                    const sel = b === buddy;
                    return (
                      <Press
                        key={b}
                        onPress={() => { setBuddy(b); }}
                        style={{
                          flex: 1, minHeight: 78, borderRadius: 14, borderWidth: 3, alignItems: 'center', justifyContent: 'center',
                          backgroundColor: sel ? p.sunny : p.violetSoft, borderColor: sel ? FIXED.buddyBorder : 'transparent',
                        }}
                      >
                        <T size={44} style={{ lineHeight: 54 }}>{b}</T>
                      </Press>
                    );
                  })}
                </View>
              ))}
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
                enter(n || 'Guest Explorer', buddy, year);
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
    </SafeAreaView>
  );
}
