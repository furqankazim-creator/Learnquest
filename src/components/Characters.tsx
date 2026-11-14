import React, { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { FONT, usePalette } from '../theme';
import { Press, T, useCardShadow } from './UI';
import { CHARACTERS, CHAR_COLORS, Char, Custom, GROUPS, allChars } from '../data/characters';

// A round character picture: the emoji on its own colour
export function Avatar({ e, bg, size = 52 }: { e: string; bg?: string | null; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg || '#FFC93C', alignItems: 'center', justifyContent: 'center' }}>
      <T size={size * 0.58} style={{ lineHeight: size * 0.72 }}>{e}</T>
    </View>
  );
}

// ---------- the library: every character, in groups ----------
export function Library({ custom, favs, selectedId, mode, onPick, onToggleFav, onDeleteCustom }: {
  custom: Custom[]; favs: string[]; selectedId?: string; mode: 'pick' | 'manage';
  onPick?: (c: Char) => void; onToggleFav?: (c: Char) => void; onDeleteCustom?: (c: Char) => void;
}) {
  const p = usePalette();
  const groups = [...(custom.length ? ['My characters'] : []), ...GROUPS];
  const [group, setGroup] = useState<string>(groups[0]);
  const list = allChars(custom).filter((c) => c.group === group);
  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {groups.map((g) => (
          <Press key={g} onPress={() => setGroup(g)} style={{ borderRadius: 999, paddingVertical: 9, paddingHorizontal: 14, backgroundColor: group === g ? p.violet : p.violetSoft }}>
            <T w={800} size={13.5} color={group === g ? '#fff' : p.ink}>{g}</T>
          </Press>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {list.map((c) => {
          const fav = favs.includes(c.id);
          const sel = selectedId === c.id;
          return (
            <Press
              key={c.id}
              onPress={() => (mode === 'pick' ? onPick?.(c) : onToggleFav?.(c))}
              accessibilityLabel={c.name}
              style={{ width: '22.5%', flexGrow: 1, minWidth: 66, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 2, borderRadius: 16, borderWidth: 3, borderColor: sel ? '#F0A500' : fav && mode === 'manage' ? p.green : 'transparent', backgroundColor: sel ? p.sunny : p.violetSoft }}
            >
              <Avatar e={c.e} bg={c.bg ?? (p.dark ? '#3A3666' : '#fff')} size={50} />
              <T w={700} size={11} color={p.ink} numberOfLines={1} style={{ marginTop: 4 }}>{c.name}</T>
              {mode === 'manage' ? (
                <View style={{ position: 'absolute', top: 2, right: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: fav ? p.green : p.card, alignItems: 'center', justifyContent: 'center' }}>
                  <T w={800} size={13} color={fav ? '#fff' : p.muted}>{fav ? '★' : '☆'}</T>
                </View>
              ) : null}
              {c.custom && mode === 'manage' ? (
                <Press onPress={() => onDeleteCustom?.(c)} accessibilityLabel={`Delete ${c.name}`} style={{ position: 'absolute', top: 2, left: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: p.dangerBg, alignItems: 'center', justifyContent: 'center' }}>
                  <T w={800} size={12} color={p.dangerText}>✕</T>
                </Press>
              ) : null}
            </Press>
          );
        })}
      </View>
    </View>
  );
}

// ---------- make your own character ----------
export function Creator({ onCreate }: { onCreate: (e: string, name: string, bg: string) => void }) {
  const p = usePalette();
  const shadow = useCardShadow();
  const [e, setE] = useState('🦸');
  const [name, setName] = useState('');
  const [bg, setBg] = useState(CHAR_COLORS[0]);
  const [focus, setFocus] = useState(false);
  return (
    <View>
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <Avatar e={e} bg={bg} size={96} />
        <T w={800} size={16} style={{ marginTop: 6 }}>{name.trim() || 'My hero'}</T>
      </View>
      <T w={800} size={14} style={{ marginBottom: 6 }}>Name</T>
      <TextInput
        value={name}
        onChangeText={setName}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="e.g. Captain Star"
        placeholderTextColor={p.muted}
        maxLength={14}
        autoCorrect={false}
        style={[{ fontSize: 16, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: focus ? p.sky : p.line, backgroundColor: p.bg, color: p.ink, fontFamily: FONT.regular }, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null]}
      />
      <T w={800} size={14} style={{ marginTop: 14, marginBottom: 6 }}>Pick a face</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {CHARACTERS.map((c) => (
          <Press key={c.id} onPress={() => setE(c.e)} accessibilityLabel={`Face ${c.name}`} style={{ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: e === c.e ? p.sunny : p.violetSoft, borderWidth: 2, borderColor: e === c.e ? '#F0A500' : 'transparent' }}>
            <T size={26} style={{ lineHeight: 32 }}>{c.e}</T>
          </Press>
        ))}
      </View>
      <T w={800} size={14} style={{ marginTop: 14, marginBottom: 6 }}>Pick a colour</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {CHAR_COLORS.map((c) => (
          <Press key={c} onPress={() => setBg(c)} accessibilityLabel={`Colour ${c}`} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: c, borderWidth: 3, borderColor: bg === c ? p.ink : 'transparent' }}>
            <View />
          </Press>
        ))}
      </View>
      <Press onPress={() => onCreate(e, name, bg)} style={[{ marginTop: 18, backgroundColor: p.green, borderRadius: 16, minHeight: 56, alignItems: 'center', justifyContent: 'center' }, shadow]}>
        <T w={800} size={17} color="#fff">Save my character</T>
      </Press>
    </View>
  );
}
