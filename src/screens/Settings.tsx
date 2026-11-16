import React, { useContext, useState } from 'react';
import { Image, ImageSourcePropType, Modal, ScrollView, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AGES, ThemeCtx, ThemePref, usePalette } from '../theme';
import { Press, T, useCardShadow } from '../components/UI';
import { useApp } from '../state';
import { Sound } from '../sound';
import { Avatar, Creator, Library } from '../components/Characters';
import PinPad from '../components/PinPad';
import { MAX_FAVS, findChar } from '../data/characters';
import { APP_NAME, PRIVACY_LAST_UPDATED, PRIVACY_POLICY_URL, SUPPORT_EMAIL } from '../appInfo';
import type { Subj } from '../theme';
import type { CustomQuestion } from '../state';

const THEMES: { k: ThemePref; ico: string; label: string; sub: string }[] = [
  { k: 'light', ico: '☀️', label: 'Light', sub: 'Bright cream' },
  { k: 'dark', ico: '🌙', label: 'Dark', sub: 'Night navy' },
  { k: 'auto', ico: '📱', label: 'Auto', sub: 'Like my phone' },
];

const SUBJ_LABEL: Record<Subj, string> = { E: 'English', M: 'Maths', S: 'Science' };
const SUBJ_CHIPS: [Subj, string][] = [['E', 'English'], ['M', 'Maths'], ['S', 'Science']];

export default function Settings() {
  const p = usePalette();
  const shadow = useCardShadow();
  const { pref, setPref } = useContext(ThemeCtx);
  const { name, buddy, buddyBg, year, soundOn, toggleSound, setSettingsOpen, favs, custom, addFav, removeFav, createCustom, deleteCustom } = useApp();
  const { customQuestions, addCustomQuestion, deleteCustomQuestion, customLogs } = useApp() as any;
  const [lib, setLib] = useState<null | 'manage' | 'make'>(null);
  const [full, setFull] = useState(false);
  const [askPin, setAskPin] = useState(false);
  const [studio, setStudio] = useState<'closed' | 'create' | 'list' | 'logs'>('closed');
  const [imgUri, setImgUri] = useState<string | null>(null);
  const [cqSubj, setCqSubj] = useState<Subj | null>(null);
  const [cqQ, setCqQ] = useState('');
  const [cqA, setCqA] = useState('');
  const [cqW1, setCqW1] = useState('');
  const [cqW2, setCqW2] = useState('');
  const [cqW3, setCqW3] = useState('');
  const card = { backgroundColor: p.card, borderRadius: 20, padding: 16, marginBottom: 10 } as const;

  const openStudio = (view: 'create' | 'list' | 'logs') => {
    if (!askPin) { setAskPin(true); return; }
    setStudio(view);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled && result.assets?.[0]?.uri) setImgUri(result.assets[0].uri);
  };

  const subjPress = (s: Subj) => {
    const sel = cqSubj === s;
    return (
      <Press
        key={s}
        onPress={() => setCqSubj(sel ? null : s)}
        style={{
          width: '24%', minWidth: 78, minHeight: 64, borderRadius: 14, borderWidth: 2,
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          backgroundColor: sel ? (p as any)[{ E: 'violetSoft', M: 'orangeSoft', S: 'greenSoft' }[s]] : p.card,
          borderColor: sel ? (p as any)[{ E: 'violet', M: 'orange', S: 'green' }[s]] : p.line,
        }}
      >
        <T size={30} style={{ lineHeight: 36 }}>{s === 'E' ? '📚' : s === 'M' ? '🔢' : '🔬'}</T>
        <T w={800} size={12} color={sel ? (p as any)[{ E: 'violet', M: 'orange', S: 'green' }[s]] : p.ink}>{SUBJ_LABEL[s]}</T>
      </Press>
    );
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
        <T w={600} size={12.5} color={p.muted} style={{ marginTop: 6, lineHeight: 18 }}>
          Before release, replace placeholder values in `src/appInfo.ts`, `app.json` (bundle/package ID), and host `docs/PRIVACY_POLICY.md` at a public URL.
        </T>
      </View>

      <Modal visible={askPin} transparent animationType="fade" onRequestClose={() => setAskPin(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 12 }}>
          <View style={{ width: '100%', maxWidth: 400, backgroundColor: p.card, borderRadius: 22, padding: 16, paddingBottom: 20 }}>
            <T w={800} size={17} style={{ marginBottom: 10 }}>Grown-ups PIN</T>
            <PinPad onUnlocked={() => { setAskPin(false); }} />
            <Press onPress={() => setAskPin(false)} style={{ alignSelf: 'center', padding: 10 }}>
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
            <View style={{ backgroundColor: p.card, borderRadius: 24, margin: 16, marginBottom: 20, paddingBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 }}>
                <Press onPress={() => setStudio('closed')} accessibilityLabel="Close" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: p.violetSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <T size={26}>←</T>
                </Press>
                <T w={800} size={19} style={{ flex: 1 }}>
                  {studio === 'create' ? 'Add a custom question' : studio === 'list' ? 'My questions' : 'Answer log'}
                </T>
              </View>

              {studio === 'create' ? (
                <View style={{ paddingHorizontal: 20 }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    {SUBJ_CHIPS.map(([s]) => subjPress(s))}
                  </View>
                  <TextInput
                    value={cqQ}
                    onChangeText={setCqQ}
                    placeholder="Question text"
                    placeholderTextColor={p.muted}
                    style={{ fontSize: 16, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: p.line, backgroundColor: p.bg, color: p.ink, marginBottom: 10 }}
                  />
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                    <View style={{ flex: 1, backgroundColor: imgUri ? 'transparent' : p.card, borderRadius: 14, borderWidth: 2, borderColor: p.line, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', minHeight: 110 }}>
                      {imgUri ? <Image source={{ uri: imgUri } as ImageSourcePropType} style={{ width: '100%', height: 110, borderRadius: 12 }} /> : <T size={34}>📷</T>}
                      <Press onPress={pickImage} style={{ position: 'absolute', bottom: 8, right: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: p.violet, alignItems: 'center', justifyContent: 'center' }}>
                        <T size={20} color="#fff">+</T>
                      </Press>
                    </View>
                  </View>
                  <T w={600} size={13} color={p.muted} style={{ marginBottom: 10 }}>Optional image</T>
                  <T w={700} size={14} style={{ marginBottom: 4 }}>Answer (correct)</T>
                  <TextInput
                    value={cqA}
                    onChangeText={setCqA}
                    placeholder="Correct answer"
                    placeholderTextColor={p.muted}
                    style={{ fontSize: 16, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: p.line, backgroundColor: p.bg, color: p.ink, marginBottom: 10 }}
                  />
                  <T w={700} size={14} style={{ marginBottom: 4 }}>Wrong answer 1</T>
                  <TextInput
                    value={cqW1}
                    onChangeText={setCqW1}
                    placeholder="Wrong answer"
                    placeholderTextColor={p.muted}
                    style={{ fontSize: 16, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: p.line, backgroundColor: p.bg, color: p.ink, marginBottom: 10 }}
                  />
                  <T w={700} size={14} style={{ marginBottom: 4 }}>Wrong answer 2</T>
                  <TextInput
                    value={cqW2}
                    onChangeText={setCqW2}
                    placeholder="Wrong answer"
                    placeholderTextColor={p.muted}
                    style={{ fontSize: 16, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: p.line, backgroundColor: p.bg, color: p.ink, marginBottom: 10 }}
                  />
                  <T w={700} size={14} style={{ marginBottom: 4 }}>Wrong answer 3</T>
                  <TextInput
                    value={cqW3}
                    onChangeText={setCqW3}
                    placeholder="Wrong answer"
                    placeholderTextColor={p.muted}
                    style={{ fontSize: 16, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: p.line, backgroundColor: p.bg, color: p.ink, marginBottom: 14 }}
                  />
                  <Press onPress={() => {
                    if (!cqSubj) return;
                    const ok = addCustomQuestion({ subj: cqSubj, q: cqQ, a: cqA, wrong1: cqW1, wrong2: cqW2, wrong3: cqW3, imageUri: imgUri });
                    if (ok) {
                      setCqSubj(null); setCqQ(''); setCqA(''); setCqW1(''); setCqW2(''); setCqW3(''); setImgUri(null);
                      setStudio('list');
                    }
                  }} style={{ backgroundColor: p.green, borderRadius: 16, minHeight: 52, alignItems: 'center', justifyContent: 'center', padding: 14 }}>
                    <T w={800} size={17} color="#fff">Save question</T>
                  </Press>
                </View>
              ) : studio === 'list' ? (
                <View style={{ paddingHorizontal: 20 }}>
                  {customQuestions.length === 0 ? (
                    <T w={700} size={15} color={p.muted} style={{ marginTop: 20, textAlign: 'center' }}>No questions yet.</T>
                  ) : (
                    customQuestions.map((q: CustomQuestion) => (
                      <View key={q.id} style={{ backgroundColor: p.bg, borderRadius: 16, padding: 12, marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <T size={20}>{q.subj === 'E' ? '📚' : q.subj === 'M' ? '🔢' : '🔬'}</T>
                          <T w={800} size={14}>{SUBJ_LABEL[q.subj]}</T>
                          <T w={600} size={11} color={p.muted}>{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ''}</T>
                        </View>
                        <T w={700} size={14} style={{ marginBottom: 6 }}>{q.q}</T>
                        {q.imageUri ? <Image source={{ uri: q.imageUri } as ImageSourcePropType} style={{ width: 80, height: 80, borderRadius: 12, marginBottom: 6 }} /> : null}
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                          <T w={700} size={12.5} color={p.green}>{q.a}</T>
                          <T w={700} size={11.5} color={p.muted}>{q.wrong1}</T>
                          <T w={700} size={11.5} color={p.muted}>{q.wrong2}</T>
                          <T w={700} size={11.5} color={p.muted}>{q.wrong3}</T>
                        </View>
                        <Press onPress={() => { Sound.tap(); deleteCustomQuestion(q.id); }} style={{ marginTop: 8, backgroundColor: p.dangerBg, borderRadius: 12, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                          <T w={800} size={13} color={p.dangerText}>Delete</T>
                        </Press>
                      </View>
                    ))
                  )}
                </View>
              ) : (
                <View style={{ paddingHorizontal: 20 }}>
                  {customLogs.length === 0 ? (
                    <T w={700} size={15} color={p.muted} style={{ marginTop: 20, textAlign: 'center' }}>No answers yet.</T>
                  ) : (
                    customLogs.slice().reverse().map((l: any) => (
                      <View key={l.id} style={{ backgroundColor: p.bg, borderRadius: 16, padding: 12, marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <T w={700} size={13.5}>{l.question}</T>
                          <T w={700} size={13.5} color={l.correct ? p.green : p.coral}>{l.correct ? '✓' : '✗'}</T>
                        </View>
                        <T w={600} size={12} color={p.muted} style={{ marginTop: 4 }}>{new Date(l.at).toLocaleDateString()} • {l.subj ? SUBJ_LABEL[l.subj as Subj] : ''}</T>
                      </View>
                    ))
                  )}
                </View>
              )}
              <Press onPress={() => setStudio('closed')} style={{ marginTop: 14, backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                <T w={800} size={16}>Done</T>
              </Press>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
