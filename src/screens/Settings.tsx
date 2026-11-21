import React, { useContext, useState } from 'react';
import { Image, ImageSourcePropType, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AGES, ThemeCtx, ThemePref, Palette, usePalette } from '../theme';
import { Press, T, useCardShadow } from '../components/UI';
import { CustomQuestion, useApp } from '../state';
import { Sound } from '../sound';
import { Avatar, Creator, Library } from '../components/Characters';
import PinPad from '../components/PinPad';
import { MAX_FAVS, findChar } from '../data/characters';
import { APP_NAME, PRIVACY_LAST_UPDATED, PRIVACY_POLICY_URL, SUPPORT_EMAIL } from '../appInfo';
import { HOPE_BRIDGE_EMAIL, HOPE_BRIDGE_URL } from '../data/hopeBridge';
import type { Subj } from '../theme';

const THEMES: { k: ThemePref; ico: string; label: string; sub: string }[] = [
  { k: 'light', ico: '☀️', label: 'Light', sub: 'Bright cream' },
  { k: 'dark', ico: '🌙', label: 'Dark', sub: 'Night navy' },
  { k: 'auto', ico: '📱', label: 'Auto', sub: 'Like my phone' },
];

const SUBJ_LABEL: Record<Subj, string> = { E: 'English', M: 'Maths', S: 'Science' };
const SUBJ_CHIPS: [Subj, string][] = [['E', 'English'], ['M', 'Maths'], ['S', 'Science']];

const TYPE_CHIPS: { k: 'match' | 'balloon' | 'rescue' | 'quiz'; label: string; emoji: string; color: keyof Palette }[] = [
  { k: 'balloon', label: 'Balloon Pop', emoji: '🎈', color: 'sky' },
  { k: 'rescue', label: 'Rescue Quiz', emoji: '🦸', color: 'violet' },
  { k: 'quiz', label: 'Quick Quiz', emoji: '⚡', color: 'orange' },
  { k: 'match', label: 'Match it', emoji: '🔗', color: 'orange' },
];

const TYPE_BG: Record<'match' | 'balloon' | 'rescue' | 'quiz', string> = { match: 'orangeSoft', balloon: 'sky', rescue: 'violetSoft', quiz: 'orangeSoft' };
const TYPE_BORDER: Record<'match' | 'balloon' | 'rescue' | 'quiz', string> = { match: 'orange', balloon: 'sky', rescue: 'violet', quiz: 'orange' };

export default function Settings() {
  const p = usePalette();
  const shadow = useCardShadow();
  const { pref, setPref } = useContext(ThemeCtx);
  const {
    name, buddy, buddyBg, year, soundOn, toggleSound, setSettingsOpen, favs, custom, addFav, removeFav, createCustom, deleteCustom,
    customQuestions, addCustomQuestion, deleteCustomQuestion, clearCustomLogs, customLogs,
  } = useApp();
  const [lib, setLib] = useState<null | 'manage' | 'make'>(null);
  const [full, setFull] = useState(false);
  const [askPin, setAskPin] = useState(false);
  const [pendingStudio, setPendingStudio] = useState<null | 'create' | 'list' | 'logs'>(null);
  const [authed, setAuthed] = useState(false);
  const [studio, setStudio] = useState<'closed' | 'create' | 'list' | 'logs'>('closed');
  const [imgUri, setImgUri] = useState<string | null>(null);
  const [cqSubj, setCqSubj] = useState<Subj | null>(null);
  const [cqQ, setCqQ] = useState('');
  const [cqA, setCqA] = useState('');
  const [cqW1, setCqW1] = useState('');
  const [cqW2, setCqW2] = useState('');
  const [cqW3, setCqW3] = useState('');
  const [matchL1, setMatchL1] = useState('');
  const [matchL2, setMatchL2] = useState('');
  const [matchL3, setMatchL3] = useState('');
  const [matchL4, setMatchL4] = useState('');
  const [matchR1, setMatchR1] = useState('');
  const [matchR2, setMatchR2] = useState('');
  const [matchR3, setMatchR3] = useState('');
  const [matchR4, setMatchR4] = useState('');
  const [matchL1Img, setMatchL1Img] = useState<string | null>(null);
  const [matchL2Img, setMatchL2Img] = useState<string | null>(null);
  const [matchL3Img, setMatchL3Img] = useState<string | null>(null);
  const [matchL4Img, setMatchL4Img] = useState<string | null>(null);
  const [matchR1Img, setMatchR1Img] = useState<string | null>(null);
  const [matchR2Img, setMatchR2Img] = useState<string | null>(null);
  const [matchR3Img, setMatchR3Img] = useState<string | null>(null);
  const [matchR4Img, setMatchR4Img] = useState<string | null>(null);
  const [cqPassage, setCqPassage] = useState('');
  const [formErr, setFormErr] = useState<string | null>(null);
  const [cqType, setCqType] = useState<'match' | 'balloon' | 'rescue' | 'quiz'>('balloon');
  const card = { backgroundColor: p.card, borderRadius: 20, padding: 16, marginBottom: 10 } as const;

  const openStudio = (view: 'create' | 'list' | 'logs') => {
    setFormErr(null);
    if (!authed) {
      setPendingStudio(view);
      setAskPin(true);
      return;
    }
    setStudio(view);
  };

  const persistImage = async (uri: string) => {
    try {
      const FS: any = await import('expo-file-system');
      const dir = FS.documentDirectory ?? FS.Paths?.document?.uri ?? FS.Paths?.document;
      if (!dir) return uri;
      const base = typeof dir === 'string' ? dir : String(dir);
      const ext = (uri.split('.').pop() || 'jpg').split('?')[0].replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
      const dest = `${base.endsWith('/') ? base : base + '/'}custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      if (typeof FS.copyAsync === 'function') {
        await FS.copyAsync({ from: uri, to: dest });
        return dest;
      }
      if (FS.File) {
        try {
          const src = new FS.File(uri);
          const dst = new FS.File(dest);
          src.copy(dst);
          return dst.uri ?? dest;
        } catch {
          // fall through
        }
      }
      return uri;
    } catch {
      return uri;
    }
  };

  const pickImage = async () => {
    try {
      const ImagePicker = await import('expo-image-picker');
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) setImgUri(await persistImage(result.assets[0].uri));
    } catch {
      // image picker unavailable
    }
  };

  const pickMatchImage = async (setUri: (uri: string | null) => void) => {
    try {
      const ImagePicker = await import('expo-image-picker');
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) setUri(await persistImage(result.assets[0].uri));
    } catch {
      // image picker unavailable
    }
  };

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
        <T w={800} size={24} style={{ flex: 1 }}>Settings</T>
      </View>

      <View style={[card, shadow, { marginTop: 14 }]}>
        <T w={700} size={17} style={{ marginBottom: 4 }}>Colour theme</T>
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
          <T w={800} size={16} color={soundOn ? '#2D2A4A' : p.ink}>{soundOn ? 'Turn sound off' : 'Turn sound on'}</T>
        </Press>
      </View>

      <View style={[card, shadow]}>
        <T w={700} size={17} style={{ marginBottom: 10 }}>Player</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <Avatar e={buddy} bg={buddyBg ?? p.sunny} size={68} />
          <View style={{ flex: 1 }}>
            <T w={700} size={18} numberOfLines={1}>{name}</T>
            <T w={700} size={13.5} color={p.muted}>Year {year} • {AGES[year]}</T>
          </View>
        </View>
        <Press onPress={() => { setAskPin(true); }} style={{ backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 60, alignItems: 'center', justifyContent: 'center', padding: 14 }}>
          <T w={800} size={16}>{buddy} Change player, buddy or year</T>
        </Press>
      </View>

      <View style={[card, shadow]}>
        <T w={700} size={17} style={{ marginBottom: 4 }}>My characters</T>
        <T w={600} size={13.5} color={p.muted} style={{ marginBottom: 12 }}>
          Choose your {MAX_FAVS} favourites — they show on the welcome page. {favs.length} of {MAX_FAVS} chosen.
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {favs.map((id) => findChar(id, custom)).filter((c): c is NonNullable<typeof c> => !!c).map((c) => (
            <Avatar key={c.id} e={c.e} bg={c.bg ?? (p.dark ? '#3A3666' : '#fff')} size={46} />
          ))}
        </View>
        <Press onPress={() => { setFull(false); setLib('manage'); }} accessibilityLabel="Choose favourite characters" style={{ backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 56, alignItems: 'center', justifyContent: 'center', padding: 12, marginBottom: 10 }}>
          <T w={800} size={16}>Choose favourites (50+ characters)</T>
        </Press>
        <Press onPress={() => setLib('make')} accessibilityLabel="Make my own character" style={{ backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 56, alignItems: 'center', justifyContent: 'center', padding: 12 }}>
          <T w={800} size={16}>Make my own character</T>
        </Press>
      </View>

      <View style={[card, shadow]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <T w={700} size={17} style={{ marginBottom: 4 }}>My Questions (custom)</T>
          <Press onPress={() => openStudio('create')} style={{ backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 }}>
            <T w={800} size={14}>+ Add question</T>
          </Press>
        </View>
        <T w={600} size={13.5} color={p.muted} style={{ marginBottom: 10 }}>
          {customQuestions.length > 0 ? `${customQuestions.length} question${customQuestions.length === 1 ? '' : 's'} made by grown-ups. Child plays them in Games → My Qs.` : 'No custom questions yet. Add your own spelling, maths or science questions.'}
        </T>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Press onPress={() => openStudio('list')} style={{ flex: 1, backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}>
            <T w={800} size={13}>View all questions</T>
          </Press>
          <Press onPress={() => openStudio('logs')} style={{ flex: 1, backgroundColor: p.card, borderRadius: 14, minHeight: 52, borderWidth: 1, borderColor: p.line, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}>
            <T w={800} size={13}>Answer log</T>
          </Press>
        </View>
      </View>

      <View style={[card, shadow]}>
        <T w={700} size={17} style={{ marginBottom: 8 }}>Privacy</T>
        <T w={600} size={14} color={p.muted} style={{ lineHeight: 21 }}>
          This app has no accounts, no ads, no chat and no tracking. It never asks for an email, birthday or location. The first name, buddy, school year, stars and stickers are saved only on this device and are never sent anywhere. Grown-ups can erase everything from the Parent tab → Reset, or by deleting the app.
        </T>
        <T w={700} size={13.5} style={{ marginTop: 10 }}>Policy last updated: {PRIVACY_LAST_UPDATED}</T>
        <T w={600} size={13.5} color={p.muted} style={{ marginTop: 4, lineHeight: 20 }}>Privacy policy URL: {PRIVACY_POLICY_URL}</T>
      </View>

      <View style={[card, shadow]}>
        <T w={700} size={17} style={{ marginBottom: 8 }}>About & support</T>
        <T w={600} size={14} color={p.muted} style={{ lineHeight: 21 }}>
          {APP_NAME} for Years 1–6 (ages 5–11). No ads, no chat, no timers and no fail screens. Only a first name is used. Progress is saved on this device only.
        </T>
        <T w={700} size={13.5} style={{ marginTop: 10 }}>Support: {SUPPORT_EMAIL}</T>
        <Press onPress={() => Linking.openURL(HOPE_BRIDGE_URL)} style={{ marginTop: 12, backgroundColor: p.violetSoft, borderRadius: 12, paddingVertical: 10, alignItems: 'center' }}>
          <T w={800} size={14}>🌟 About Hope Bridge Digital</T>
        </Press>
        <Press onPress={() => Linking.openURL(`mailto:${HOPE_BRIDGE_EMAIL}`)} style={{ marginTop: 8, backgroundColor: p.card, borderRadius: 12, borderWidth: 1, borderColor: p.line, paddingVertical: 10, alignItems: 'center' }}>
          <T w={800} size={14}>{HOPE_BRIDGE_EMAIL}</T>
        </Press>
        <T w={600} size={12.5} color={p.muted} style={{ marginTop: 8, lineHeight: 18 }}>
          Before release, replace placeholder values in `src/appInfo.ts`, `app.json` (bundle/package ID), and host `docs/PRIVACY_POLICY.md` at a public URL.
        </T>
      </View>

      <Modal visible={askPin} transparent animationType="fade" onRequestClose={() => { setAskPin(false); setPendingStudio(null); }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 12 }}>
          <View style={{ width: '100%', maxWidth: 400, backgroundColor: p.card, borderRadius: 22, padding: 16, paddingBottom: 20 }}>
            <T w={800} size={17} style={{ marginBottom: 10 }}>Grown-ups PIN</T>
            <PinPad onUnlocked={() => {
              setAskPin(false);
              setAuthed(true);
              if (pendingStudio) {
                setStudio(pendingStudio);
                setPendingStudio(null);
              }
            }} />
            <Press onPress={() => { setAskPin(false); setPendingStudio(null); }} style={{ alignSelf: 'center', padding: 10 }}>
              <T w={700} size={14} color={p.muted}>Cancel</T>
            </Press>
          </View>
        </View>
      </Modal>

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

      {studio !== 'closed' && (
        <Modal transparent animationType="fade" onRequestClose={() => setStudio('closed')}>
          <View style={{ flex: 1, backgroundColor: p.bg }}>
            <View style={{ backgroundColor: p.card, borderRadius: 26, margin: 12, marginBottom: 16, paddingBottom: 22, maxHeight: '97%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 }}>
                <Press onPress={() => setStudio('closed')} accessibilityLabel="Close" style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: p.violetSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <T size={28}>←</T>
                </Press>
                <T w={800} size={20} style={{ flex: 1 }}>
                  {studio === 'create' ? 'Add a custom question' : studio === 'list' ? 'My questions' : 'Answer log'}
                </T>
              </View>

              {studio === 'create' ? (
                <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}>
                  <View style={{ marginBottom: 18 }}>
                    <View style={{ backgroundColor: p.bg, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: p.line }}>
                      <T w={700} size={15} style={{ marginBottom: 10 }}>Pick a subject</T>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {SUBJ_CHIPS.map(([s]) => {
                          const sel = cqSubj === s;
                          return (
                            <Press key={s} onPress={() => setCqSubj(sel ? null : s)} style={{ width: '32%', borderRadius: 14, borderWidth: 2, backgroundColor: sel ? (p as any)[{ E: 'violetSoft', M: 'orangeSoft', S: 'greenSoft' }[s]] : p.card, borderColor: sel ? (p as any)[{ E: 'violet', M: 'orange', S: 'green' }[s]] : 'transparent', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                              <T size={24} style={{ lineHeight: 28 }}>{s === 'E' ? '📚' : s === 'M' ? '🔢' : '🔬'}</T>
                              <T w={800} size={12} color={sel ? (p as any)[{ E: 'violet', M: 'orange', S: 'green' }[s]] : p.muted} numberOfLines={1} style={{ textAlign: 'center' }}>{SUBJ_LABEL[s]}</T>
                            </Press>
                          );
                        })}
                      </View>
                    </View>
                  </View>

                  <View style={{ marginBottom: 18 }}>
                    <View style={{ backgroundColor: p.bg, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: p.line }}>
                      <T w={700} size={15} style={{ marginBottom: 10 }}>Question type</T>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {TYPE_CHIPS.map((t) => {
                          const sel = cqType === t.k;
                          return (
                            <Press key={t.k} onPress={() => setCqType(t.k)} style={{ width: '48%', minHeight: 72, borderRadius: 16, borderWidth: 2, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: sel ? (p as any)[TYPE_BG[t.k]] : p.card, borderColor: sel ? (p as any)[TYPE_BORDER[t.k]] : p.line }}>
                              <T size={30} style={{ lineHeight: 36 }}>{t.emoji}</T>
                              <T w={800} size={12.5} color={sel ? (p as any)[TYPE_BORDER[t.k]] : p.ink} numberOfLines={2} style={{ textAlign: 'center', fontWeight: '700' }}>{t.label}</T>
                            </Press>
                          );
                        })}
                      </View>
                    </View>
                  </View>

                  {cqType !== 'match' && (
                    <>
                      <View style={{ marginBottom: 18 }}>
                        <View style={{ backgroundColor: p.bg, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: p.line }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <T size={24}>📝</T>
                            <T w={700} size={15} style={{ flex: 1 }}>Question</T>
                          </View>
                          <TextInput
                            value={cqQ}
                            onChangeText={(v) => { setFormErr(null); setCqQ(v); }}
                            placeholder="Write your question here…"
                            placeholderTextColor={p.muted}
                            style={{ fontSize: 17, paddingVertical: 16, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderColor: p.line, backgroundColor: p.card, color: p.ink, marginBottom: 12, textAlignVertical: 'top', minHeight: 110 }}
                          />
                          <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ flex: 1, backgroundColor: imgUri ? 'transparent' : p.card, borderRadius: 16, borderWidth: 2, borderColor: p.line, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>
                              {imgUri ? <Image source={{ uri: imgUri } as ImageSourcePropType} style={{ width: '100%', height: 100, borderRadius: 14 }} /> : <T size={30}>🖼️</T>}
                              <Press onPress={pickImage} style={{ position: 'absolute', bottom: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: p.violet, alignItems: 'center', justifyContent: 'center' }}>
                                <T size={18} color="#fff">+</T>
                              </Press>
                            </View>
                          </View>
                          <T w={700} size={12.5} color={p.muted} style={{ marginTop: 8, lineHeight: 18 }}>Optional picture shown with the question</T>
                        </View>
                      </View>

                      <View style={{ marginBottom: 18 }}>
                        <View style={{ backgroundColor: p.bg, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: p.line }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <T size={24}>📖</T>
                            <T w={700} size={15} style={{ flex: 1 }}>Story / passage</T>
                          </View>
                          <TextInput
                            value={cqPassage}
                            onChangeText={(v) => { setFormErr(null); setCqPassage(v); }}
                            placeholder="Story shown above the question (optional)"
                            placeholderTextColor={p.muted}
                            style={{ fontSize: 17, paddingVertical: 16, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderColor: p.line, backgroundColor: p.card, color: p.ink, marginBottom: 12, textAlignVertical: 'top', minHeight: 110 }}
                          />
                          <T w={700} size={12.5} color={p.muted} style={{ lineHeight: 18 }}>{`Shown at the top of the ${cqType === 'balloon' ? 'Balloon Pop' : cqType === 'rescue' ? 'Rescue Quiz' : 'Quick Quiz'} question.`}</T>
                        </View>
                      </View>
                    </>
                  )}

                  {cqType === 'balloon' || cqType === 'rescue' || cqType === 'quiz' ? (
                    <View style={{ marginBottom: 18 }}>
                      <View style={{ backgroundColor: p.bg, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: p.line }}>
                        <T w={700} size={15} style={{ marginBottom: 12 }}>Answer (correct)</T>
                        <TextInput
                          value={cqA}
                          onChangeText={(v) => { setFormErr(null); setCqA(v); }}
                          placeholder="Correct answer"
                          placeholderTextColor={p.muted}
                          style={{ fontSize: 17, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderColor: p.line, backgroundColor: p.card, color: p.ink, marginBottom: 10 }}
                        />
                        <View style={{ marginBottom: 10 }}>
                          <T w={700} size={14.5} style={{ marginBottom: 8 }}>Wrong answers</T>
                          <TextInput
                            value={cqW1}
                            onChangeText={(v) => { setFormErr(null); setCqW1(v); }}
                            placeholder="Wrong answer 1"
                            placeholderTextColor={p.muted}
                            style={{ fontSize: 16, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderColor: p.line, backgroundColor: p.card, color: p.ink, marginBottom: 8 }}
                          />
                          <TextInput
                            value={cqW2}
                            onChangeText={(v) => { setFormErr(null); setCqW2(v); }}
                            placeholder="Wrong answer 2"
                            placeholderTextColor={p.muted}
                            style={{ fontSize: 16, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderColor: p.line, backgroundColor: p.card, color: p.ink, marginBottom: 8 }}
                          />
                          <TextInput
                            value={cqW3}
                            onChangeText={(v) => { setFormErr(null); setCqW3(v); }}
                            placeholder="Wrong answer 3"
                            placeholderTextColor={p.muted}
                            style={{ fontSize: 16, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderColor: p.line, backgroundColor: p.card, color: p.ink, marginBottom: 0 }}
                          />
                        </View>
                      </View>
                    </View>
                  ) : cqType === 'match' ? (
                    <View style={{ marginBottom: 18 }}>
                      <View style={{ backgroundColor: p.bg, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: p.line }}>
                        <T w={700} size={15} style={{ marginBottom: 10 }}>Match pairs</T>
                        <T w={700} size={13} color={p.muted} style={{ marginBottom: 10, lineHeight: 18 }}>Enter pairs your child matches together. For example, Dog matches dog icon. At least 2 pairs required.</T>
                        {[1, 2, 3, 4].map((n) => {
                          const lImg = n === 1 ? matchL1Img : n === 2 ? matchL2Img : n === 3 ? matchL3Img : matchL4Img;
                          const rImg = n === 1 ? matchR1Img : n === 2 ? matchR2Img : n === 3 ? matchR3Img : matchR4Img;
                          const setLImg = (uri: string | null) => { if (n === 1) setMatchL1Img(uri); else if (n === 2) setMatchL2Img(uri); else if (n === 3) setMatchL3Img(uri); else setMatchL4Img(uri); };
                          const setRImg = (uri: string | null) => { if (n === 1) setMatchR1Img(uri); else if (n === 2) setMatchR2Img(uri); else if (n === 3) setMatchR3Img(uri); else setMatchR4Img(uri); };
                          return (
                            <View key={n} style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                              <View style={{ flex: 1, gap: 6 }}>
                                <T w={700} size={13} color={p.muted} style={{ marginBottom: 4 }}>Left {n}</T>
                                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                                  <TextInput
                                    value={n === 1 ? matchL1 : n === 2 ? matchL2 : n === 3 ? matchL3 : matchL4}
                                    onChangeText={(v) => { setFormErr(null); if (n === 1) setMatchL1(v); else if (n === 2) setMatchL2(v); else if (n === 3) setMatchL3(v); else setMatchL4(v); }}
                                    placeholder="Left item"
                                    placeholderTextColor={p.muted}
                                    style={{ flex: 1, fontSize: 15, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: p.line, backgroundColor: p.card, color: p.ink }}
                                  />
                                  {lImg ? (
                                    <Press onPress={() => setLImg(null)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: p.coral, alignItems: 'center', justifyContent: 'center' }}>
                                      <T size={16} color="#fff">✕</T>
                                    </Press>
                                  ) : (
                                    <Press onPress={() => pickMatchImage(setLImg)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: p.sunny, alignItems: 'center', justifyContent: 'center' }}>
                                      <T size={16}>🖼️</T>
                                    </Press>
                                  )}
                                </View>
                                {lImg ? <Image source={{ uri: lImg }} style={{ width: 44, height: 44, borderRadius: 10, marginTop: 4 }} resizeMode="cover" /> : null}
                              </View>
                              <View style={{ flex: 1, gap: 6 }}>
                                <T w={700} size={13} color={p.muted} style={{ marginBottom: 4 }}>Right {n}</T>
                                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                                  <TextInput
                                    value={n === 1 ? matchR1 : n === 2 ? matchR2 : n === 3 ? matchR3 : matchR4}
                                    onChangeText={(v) => { setFormErr(null); if (n === 1) setMatchR1(v); else if (n === 2) setMatchR2(v); else if (n === 3) setMatchR3(v); else setMatchR4(v); }}
                                    placeholder="Right match"
                                    placeholderTextColor={p.muted}
                                    style={{ flex: 1, fontSize: 15, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: p.line, backgroundColor: p.card, color: p.ink }}
                                  />
                                  {rImg ? (
                                    <Press onPress={() => setRImg(null)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: p.coral, alignItems: 'center', justifyContent: 'center' }}>
                                      <T size={16} color="#fff">✕</T>
                                    </Press>
                                  ) : (
                                    <Press onPress={() => pickMatchImage(setRImg)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: p.sunny, alignItems: 'center', justifyContent: 'center' }}>
                                      <T size={16}>🖼️</T>
                                    </Press>
                                  )}
                                </View>
                                {rImg ? <Image source={{ uri: rImg }} style={{ width: 44, height: 44, borderRadius: 10, marginTop: 4 }} resizeMode="cover" /> : null}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}

                  {formErr ? <T w={700} size={13.5} color={p.dangerText} style={{ marginTop: 10, textAlign: 'center' }}>{formErr}</T> : null}

                  <Press onPress={() => {
                    if (!cqSubj) return;
                    const ok = addCustomQuestion({ subj: cqSubj, type: cqType, q: cqQ, a: cqA, wrong1: cqW1, wrong2: cqW2, wrong3: cqW3, matchL1, matchL2, matchL3, matchL4, matchR1, matchR2, matchR3, matchR4, matchL1Img: matchL1Img ?? undefined, matchL2Img: matchL2Img ?? undefined, matchL3Img: matchL3Img ?? undefined, matchL4Img: matchL4Img ?? undefined, matchR1Img: matchR1Img ?? undefined, matchR2Img: matchR2Img ?? undefined, matchR3Img: matchR3Img ?? undefined, matchR4Img: matchR4Img ?? undefined, imageUri: imgUri ?? undefined, passage: cqPassage });
                    if (ok) {
                      setCqSubj(null); setCqType('balloon'); setCqQ(''); setCqA(''); setCqW1(''); setCqW2(''); setCqW3(''); setMatchL1(''); setMatchL2(''); setMatchL3(''); setMatchL4(''); setMatchR1(''); setMatchR2(''); setMatchR3(''); setMatchR4(''); setMatchL1Img(null); setMatchL2Img(null); setMatchL3Img(null); setMatchL4Img(null); setMatchR1Img(null); setMatchR2Img(null); setMatchR3Img(null); setMatchR4Img(null); setImgUri(null); setCqPassage('');
                      setFormErr(null);
                      setStudio('list');
                    } else {
                      setFormErr(cqType === 'match'
                        ? 'Pick a subject and fill at least 2 match pairs (left and right must be unique).'
                        : 'Pick a subject and fill the question, correct answer, and 3 different wrong answers.');
                    }
                  }} style={{ backgroundColor: p.green, borderRadius: 20, minHeight: 64, alignItems: 'center', justifyContent: 'center', padding: 16, marginTop: 8 }}>
                    <T w={800} size={18} color="#fff" style={{ fontWeight: '700' }}>💾 Save question</T>
                  </Press>
                </ScrollView>
              ) : studio === 'list' ? (
                <View style={{ paddingHorizontal: 18, paddingBottom: 24 }}>
                  {customQuestions.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingTop: 30 }}>
                      <T size={60} style={{ lineHeight: 72, marginBottom: 12 }}>📝</T>
                      <T w={700} size={17} color={p.muted} style={{ textAlign: 'center' }}>No questions yet.</T>
                      <T w={700} size={13} color={p.muted} style={{ textAlign: 'center', marginTop: 4 }}>Create your first custom question above.</T>
                    </View>
                  ) : (
                    customQuestions.map((q: CustomQuestion) => (
                      <View key={q.id} style={{ backgroundColor: p.card, borderRadius: 18, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: p.line }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: (p as any)[{ E: 'violetSoft', M: 'orangeSoft', S: 'greenSoft' }[q.subj]], alignItems: 'center', justifyContent: 'center' }}>
                            <T size={20}>{q.subj === 'E' ? '📚' : q.subj === 'M' ? '🔢' : '🔬'}</T>
                          </View>
                          <T w={800} size={13.5} color={p.muted}>{SUBJ_LABEL[q.subj]}</T>
                          <T w={600} size={11} color={p.muted}>• {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ''}</T>
                          <View style={{ backgroundColor: p.selSoft, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                            <T w={800} size={10} color={p.navy}>{TYPE_CHIPS.find((t) => t.k === q.type)?.label ?? 'Multiple Choice'}</T>
                          </View>
                        </View>
                        {q.type === 'match' ? (
                          <View style={{ marginBottom: 8 }}>
                            <T w={700} size={13.5} color={p.muted} style={{ marginBottom: 6 }}>Match pairs</T>
                            {[[q.matchL1, q.matchL1Img, q.matchR1, q.matchR1Img], [q.matchL2, q.matchL2Img, q.matchR2, q.matchR2Img], [q.matchL3, q.matchL3Img, q.matchR3, q.matchR3Img], [q.matchL4, q.matchL4Img, q.matchR4, q.matchR4Img]].filter(([l]) => l).map(([l, lImg, r, rImg], i) => (
                              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                                  {lImg ? <Image source={{ uri: lImg }} style={{ width: 30, height: 30, borderRadius: 8 }} resizeMode="cover" /> : null}
                                  <T w={800} size={12.5} color={p.ink}>{l}</T>
                                </View>
                                <T size={18} color={p.muted}>↔</T>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                                  <T w={800} size={12.5} color="#1B7F4A" style={{ fontWeight: '700' }}>{r}</T>
                                  {rImg ? <Image source={{ uri: rImg }} style={{ width: 30, height: 30, borderRadius: 8 }} resizeMode="cover" /> : null}
                                </View>
                              </View>
                            ))}
                          </View>
                        ) : q.type === 'balloon' || q.type === 'rescue' || q.type === 'quiz' ? (
                          <>
                            {q.passage ? <T w={700} size={13} color={p.muted} style={{ marginBottom: 6, fontStyle: 'italic' }}>📖 {q.passage}</T> : null}
                            <T w={700} size={15} style={{ marginBottom: 8 }}>{q.q}</T>
                            {q.imageUri ? <Image source={{ uri: q.imageUri } as ImageSourcePropType} style={{ width: 80, height: 80, borderRadius: 12, marginBottom: 8 }} /> : null}
                            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                              <View style={{ backgroundColor: p.greenSoft, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 }}>
                                <T w={800} size={12.5} color="#1B7F4A" style={{ fontWeight: '700' }}>✓ {q.a}</T>
                              </View>
                              {[q.wrong1, q.wrong2, q.wrong3].map((w, i) => (
                                <View key={i} style={{ backgroundColor: p.card, borderRadius: 12, borderWidth: 1, borderColor: p.line, paddingHorizontal: 10, paddingVertical: 6 }}>
                                  <T w={800} size={12.5} color={p.muted}>✗ {w}</T>
                                </View>
                              ))}
                            </View>
                          </>
                        ) : (
                          <>
                            <T w={700} size={15} style={{ marginBottom: 8 }}>{q.q}</T>
                            {q.imageUri ? <Image source={{ uri: q.imageUri } as ImageSourcePropType} style={{ width: 80, height: 80, borderRadius: 12, marginBottom: 8 }} /> : null}
                            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                              <View style={{ backgroundColor: p.greenSoft, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 }}>
                                <T w={800} size={12.5} color="#1B7F4A" style={{ fontWeight: '700' }}>✓ {q.a}</T>
                              </View>
                              {[q.wrong1, q.wrong2, q.wrong3].map((w, i) => (
                                <View key={i} style={{ backgroundColor: p.card, borderRadius: 12, borderWidth: 1, borderColor: p.line, paddingHorizontal: 10, paddingVertical: 6 }}>
                                  <T w={800} size={12.5} color={p.muted}>✗ {w}</T>
                                </View>
                              ))}
                            </View>
                          </>
                        )}
                        <Press onPress={() => { Sound.tap(); deleteCustomQuestion(q.id); }} style={{ marginTop: 10, backgroundColor: p.dangerBg, borderRadius: 14, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
                          <T w={800} size={14} color={p.dangerText}>Delete question</T>
                        </Press>
                      </View>
                    ))
                  )}
                </View>
              ) : (
                <View style={{ paddingHorizontal: 18, paddingBottom: 24 }}>
                  {customLogs.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingTop: 30 }}>
                      <T size={60} style={{ lineHeight: 72, marginBottom: 12 }}>📊</T>
                      <T w={700} size={17} color={p.muted} style={{ textAlign: 'center' }}>No answers yet.</T>
                      <T w={700} size={13} color={p.muted} style={{ textAlign: 'center', marginTop: 4 }}>Custom answers appear here.</T>
                    </View>
                  ) : (
                    customLogs.slice().reverse().map((l: any) => (
                      <View key={l.id} style={{ backgroundColor: p.card, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: p.line }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <T w={700} size={14}>{l.question}</T>
                          <T w={700} size={14} color={l.correct ? p.green : p.coral} style={{ fontWeight: '700' }}>{l.correct ? '✓' : '✗'}</T>
                        </View>
                        <T w={600} size={12} color={p.muted} style={{ marginTop: 4 }}>{new Date(l.at).toLocaleDateString()} • {l.subj ? SUBJ_LABEL[l.subj as Subj] : ''}</T>
                      </View>
                    ))
                  )}
                </View>
              )}
              <Press onPress={() => setStudio('closed')} style={{ backgroundColor: p.violetSoft, borderRadius: 20, minHeight: 60, alignItems: 'center', justifyContent: 'center', padding: 16, marginBottom: 8 }}>
                <T w={800} size={17} color="#2D2A4A">Done</T>
              </Press>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
