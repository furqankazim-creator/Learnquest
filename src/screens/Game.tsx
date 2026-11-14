import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIXED, SUBJECTS, usePalette } from '../theme';
import { Press, T, useCardShadow } from '../components/UI';
import { GameKind, Q, mixedQuestions, questionsFor, shuffle, spoken, useApp } from '../state';
import { Sound } from '../sound';
import { useLayout } from '../layout';
import MathVisual from '../components/MathVisual';
import { exampleText, parseViz } from '../mathViz';

const TITLES: Record<GameKind, string> = {
  balloon: '🎈 Balloon Pop', rescue: '🦸 Rescue Quiz', match: '🧩 Match It', quiz: '⚡ Quick Quiz', mission: '🗺️ Daily Mission',
};

const shortQ = (q: string) => (q.length <= 64 ? q : q.slice(0, 62) + '…');

type Feedback = { text: string; good: boolean; note?: string } | null;

function QuestionCard({ q, extra, help, onHelp }: { q: Q; extra?: string; help: boolean; onHelp: () => void }) {
  const p = usePalette();
  const shadow = useCardShadow();
  const { year } = useApp();
  const { wide } = useLayout();
  const s = SUBJECTS[q.subj];
  const al = wide ? 'flex-start' : 'center';
  // Maths questions get a picture of the actual problem (blocks, groups, number line, clock…)
  const viz = q.subj === 'M' ? parseViz(q.q, q.e) : null;
  const example = viz ? exampleText(viz, q.q) : q.ex ?? null;
  return (
    <View style={[{ backgroundColor: p.card, borderRadius: 22, paddingVertical: 22, paddingHorizontal: wide ? 32 : 18, alignItems: 'center', flexDirection: wide ? 'row' : 'column', gap: wide ? 36 : 0 }, shadow]}>
      {viz ? (
        <MathVisual key={q.q} viz={viz} wide={wide} />
      ) : (
        <View style={{ width: wide ? 170 : 168, height: wide ? 170 : 168, borderRadius: 85, backgroundColor: (p as any)[s.soft], alignItems: 'center', justifyContent: 'center', marginBottom: wide ? 0 : 4 }}>
          <T size={110} style={{ lineHeight: 134 }}>{q.e}</T>
        </View>
      )}
      <View style={{ flex: wide ? 1 : undefined, alignItems: al }}>
        {extra ? <T w={800} size={15} color={p.muted} style={{ textAlign: wide ? 'left' : 'center' }}>{extra}</T> : null}
        {q.p ? (
          <View style={{ alignSelf: 'stretch', backgroundColor: p.violetSoft, borderRadius: 16, padding: 14, marginTop: 10, borderLeftWidth: 5, borderLeftColor: p.violet }}>
            <T w={700} size={wide ? 18 : 16} style={{ lineHeight: wide ? 27 : 24, textAlign: 'left' }}>{q.p}</T>
          </View>
        ) : null}
        <T w={800} size={wide ? 28 : 22} style={{ lineHeight: wide ? 37 : 29.7, textAlign: wide ? 'left' : 'center', marginTop: 10, marginBottom: 4 }}>{q.q}</T>
        <T w={700} size={13.5} color={p.muted}>{s.emoji} {s.name} • Year {year}</T>
        <Press onPress={() => Sound.speak(spoken(q))} style={{ marginTop: 10, backgroundColor: p.sunny, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20, minHeight: 50, justifyContent: 'center' }}>
          <T w={800} size={15} color="#2D2A4A">{q.p ? '🔊 Hear the story and question' : '🔊 Hear the question'}</T>
        </Press>
        {example ? (
          <View style={{ alignSelf: 'stretch', marginTop: 10, alignItems: wide ? 'flex-start' : 'center' }}>
            <Press
              onPress={() => { onHelp(); if (!help) Sound.speak(example); else Sound.stopSpeak(); }}
              style={{ backgroundColor: help ? p.greenSoft : p.violetSoft, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 18, minHeight: 46, justifyContent: 'center', borderWidth: 2, borderColor: help ? p.green : 'transparent' }}
            >
              <T w={800} size={14.5}>{help ? '💡 Hide the example' : '💡 Real-life example'}</T>
            </Press>
            {help ? (
              <View style={{ alignSelf: 'stretch', marginTop: 10, backgroundColor: p.greenSoft, borderRadius: 16, padding: 14, borderLeftWidth: 5, borderLeftColor: p.green }}>
                <T w={700} size={wide ? 17 : 15.5} style={{ lineHeight: wide ? 26 : 23, textAlign: 'left' }}>{example}</T>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function FeedbackLine({ fb }: { fb: Feedback }) {
  const p = usePalette();
  return (
    <View style={{ minHeight: 30, marginTop: 14, alignItems: 'center', justifyContent: 'center' }}>
      {fb ? <T w={800} size={17} color={fb.good ? p.green : p.orange} style={{ textAlign: 'center' }}>{fb.text}</T> : null}
      {fb?.note ? (
        <View style={{ marginTop: 10, backgroundColor: p.card, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14, alignSelf: 'stretch' }}>
          <T w={700} size={14.5} color={p.muted} style={{ textAlign: 'center', lineHeight: 21 }}>💡 {fb.note}</T>
        </View>
      ) : null}
    </View>
  );
}

function MatchCard({ label, emoji, state, onPress }: { label: string; emoji?: string; state: 'idle' | 'sel' | 'done' | 'wrong'; onPress: () => void }) {
  const p = usePalette();
  const shadow = useCardShadow();
  return (
    <Press
      onPress={onPress}
      style={[{
        borderWidth: 3, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 8, flex: 1, minHeight: 130, alignItems: 'center', justifyContent: 'center',
        backgroundColor: state === 'sel' ? p.selSoft : state === 'done' ? p.greenSoft : p.card,
        borderColor: state === 'sel' ? p.sky : state === 'done' ? p.green : state === 'wrong' ? p.coral : p.line,
        opacity: state === 'done' ? 0.75 : 1,
      }, shadow]}
    >
      {emoji ? <T size={56} style={{ lineHeight: 68 }}>{emoji}</T> : null}
      <T w={800} size={emoji ? 14 : 19} numberOfLines={emoji ? 4 : 5} style={{ textAlign: 'center', marginTop: emoji ? 2 : 0 }}>{label}</T>
    </Press>
  );
}

function Balloon({ label, color, popped, onPress, w = 76, long = false }: { label: string; color: string; popped: boolean; onPress: () => void; w?: number; long?: boolean }) {
  const h = long ? Math.round(w * 1.1) : Math.round(w * 1.26);
  const fs = !long ? (label.length > 5 ? 17 : 24) : label.length <= 12 ? 20 : label.length <= 24 ? 17 : label.length <= 40 ? 15 : 13;
  const [scale] = useState(() => new Animated.Value(1));
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (popped) {
      Animated.parallel([
        Animated.timing(scale, { toValue: 1.5, duration: 250, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popped]);
  return (
    <Animated.View style={{ transform: [{ scale }], opacity: fade, alignItems: 'center', height: h + 28 }}>
      <Press onPress={onPress}>
        <View
          style={{
            width: w, height: h, borderRadius: w / 2, borderBottomLeftRadius: w * 0.45, borderBottomRightRadius: w * 0.45,
            backgroundColor: color, alignItems: 'center', justifyContent: 'center', paddingHorizontal: long ? w * 0.14 : 4, paddingBottom: long ? 6 : 0,
          }}
        >
          <View style={{ position: 'absolute', top: 12, left: w * 0.18, width: 14, height: 22, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.25)', transform: [{ rotate: '20deg' }] }} />
          <T w={800} size={fs} color="#fff" numberOfLines={long ? 6 : 1} adjustsFontSizeToFit minimumFontScale={0.7} style={{ textAlign: 'center', lineHeight: long ? fs * 1.2 : undefined }}>{label}</T>
        </View>
        <View style={{ alignSelf: 'center', width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color, marginTop: -2 }} />
        <View style={{ alignSelf: 'center', width: 2, height: 16, backgroundColor: 'rgba(45,42,74,0.35)' }} />
      </Press>
    </Animated.View>
  );
}

export default function Game() {
  const p = usePalette();
  const { width: winW, wide, gameMax } = useLayout();
  // wide balloons (2 per row on phones, 4 per row on desktop) when any answer is longer than a word or two
  const balloonCols = wide ? 4 : 2;
  const balloonAvail = Math.min(winW, gameMax) - 32 - 24;
  const balloonW = Math.min(210, Math.floor((balloonAvail - (balloonCols - 1) * 14) / balloonCols));
  const shadow = useCardShadow();
  const app = useApp();
  const { game: kind, year, buddy, gameSubj, soundOn, toggleSound, leaveGame, recordAnswer, finishGame, startGame, setTab } = app;
  const k = kind as GameKind;

  // questions are built once per game run
  const qs = useMemo<Q[]>(() => {
    if (k === 'mission' || gameSubj === 'X') return mixedQuestions(year, k === 'match' ? 12 : 6, k === 'match');
    return questionsFor(gameSubj, year, k === 'match' ? 12 : 6, k === 'match');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.gameRun]);

  const [i, setI] = useState(0);
  const [right, setRight] = useState(0);
  const [locked, setLocked] = useState(false);
  const [help, setHelp] = useState(false);
  const [fb, setFb] = useState<Feedback>(null);
  const [wrongSet, setWrongSet] = useState<Record<number, boolean>>({});
  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<{ stars: number; sticker: string | null; right: number; total: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // match state
  const [round, setRound] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [doneL, setDoneL] = useState<Record<number, boolean>>({});
  const [doneR, setDoneR] = useState<Record<number, boolean>>({});
  const [flash, setFlash] = useState<number | null>(null);
  const roundQs = useMemo(() => qs.slice(round * 4, round * 4 + 4), [qs, round]);
  const rightCol = useMemo(() => shuffle(roundQs.map((q, idx) => ({ idx, label: q.a }))), [roundQs]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); Sound.stopSpeak(); }, []);

  // read each new question aloud
  useEffect(() => {
    if (result) return;
    if (k !== 'match' && qs[i]) Sound.speak(spoken(qs[i]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, result]);

  const finish = useCallback((r: number, total: number) => {
    Sound.stopSpeak();
    const res = finishGame(r, total);
    setResult({ ...res, right: r, total });
    Sound.fanfare();
    setTimeout(() => Sound.speak(`Well done! You got ${r} of ${total} right!`), 500);
  }, [finishGame]);

  const answer = (q: Q, optIdx: number) => {
    if (locked || result) return;
    const picked = q.opts[optIdx];
    if (picked === q.a) {
      setLocked(true); setChosen(optIdx);
      const nr = right + 1; setRight(nr);
      recordAnswer(q, true);
      if (k === 'balloon') { Sound.pop(); setTimeout(() => Sound.right(), 180); } else Sound.right();
      setFb({ text: "🎉 Well done! That's right!", good: true, note: q.x });
      Sound.speak('Well done! That is right!');
      timer.current = setTimeout(() => {
        if (i + 1 >= qs.length) finish(nr, qs.length);
        else { setI(i + 1); setLocked(false); setFb(null); setWrongSet({}); setChosen(null); setHelp(false); }
      }, q.x ? 2800 : 1400);
    } else {
      setWrongSet((w) => ({ ...w, [optIdx]: true }));
      recordAnswer(q, false); Sound.tryAgain();
      setFb({ text: '💪 Good try! Have another go.', good: false });
      setHelp(true); // a wrong answer opens the real-life example to help
    }
  };

  const tapLeft = (idx: number) => {
    if (doneL[idx]) return;
    setSel(idx); Sound.tap(); Sound.speak(roundQs[idx].q);
  };
  const tapRight = (idx: number) => {
    if (doneR[idx]) return;
    if (sel === null) { setFb({ text: '👉 Start with a card on the left.', good: false }); return; }
    const q = roundQs[sel];
    if (idx === sel) {
      const nl = { ...doneL, [sel]: true }; const nrr = { ...doneR, [idx]: true };
      setDoneL(nl); setDoneR(nrr); setSel(null);
      recordAnswer(q, true); Sound.match();
      setFb({ text: '✨ Great matching!', good: true });
      const nr = right + 1; setRight(nr);
      if (Object.keys(nrr).length >= 4) {
        timer.current = setTimeout(() => {
          if (round + 1 >= 3) finish(nr, 12);
          else { setRound(round + 1); setDoneL({}); setDoneR({}); setSel(null); setFb(null); }
        }, 900);
      }
    } else {
      recordAnswer(q, false); Sound.tryAgain();
      setFb({ text: '💪 Not that one — try another match.', good: false });
      setFlash(idx); setTimeout(() => setFlash(null), 500);
    }
  };

  const total = k === 'match' ? 3 : qs.length;
  const done = result ? total : k === 'match' ? round : i;

  const header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16, paddingBottom: 4 }}>
      <Press onPress={leaveGame} accessibilityLabel="Back" style={[{ width: 48, height: 48, borderRadius: 24, backgroundColor: p.card, alignItems: 'center', justifyContent: 'center' }, shadow]}>
        <T size={26}>←</T>
      </Press>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T size={40} style={{ lineHeight: 48 }}>{TITLES[k].split(' ')[0]}</T>
        <View style={{ flex: 1 }}>
          <T w={700} size={19}>{TITLES[k].split(' ').slice(1).join(' ')}</T>
          <T w={700} size={13} color={p.muted}>Year {year}</T>
        </View>
      </View>
      <Press onPress={toggleSound} accessibilityLabel="Sound on or off" style={[{ width: 46, height: 46, borderRadius: 23, backgroundColor: p.sunny, alignItems: 'center', justifyContent: 'center' }, shadow]}>
        <T size={21}>{soundOn ? '🔊' : '🔇'}</T>
      </Press>
    </View>
  );
  const progress = (
    <View style={{ height: 12, borderRadius: 99, backgroundColor: p.line, overflow: 'hidden', marginTop: 12, marginBottom: 16 }}>
      <View style={{ height: '100%', width: `${Math.round((done / total) * 100)}%`, backgroundColor: p.teal, borderRadius: 99 }} />
    </View>
  );

  let body: React.ReactNode;
  if (result) {
    const s = result.stars;
    const starStr = '⭐'.repeat(s) + '☆'.repeat(3 - s);
    body = (
      <View style={[{ backgroundColor: p.card, borderRadius: 22, paddingVertical: 26, paddingHorizontal: 20, alignItems: 'center', marginTop: 18 }, shadow]}>
        <T size={48} style={{ letterSpacing: 6, lineHeight: 60 }}>🎉 🎊 🎉</T>
        <T size={64} style={{ letterSpacing: 4, lineHeight: 80 }}>{starStr}</T>
        <T w={700} size={24} style={{ marginTop: 8, marginBottom: 4 }}>
          {s === 3 ? 'Amazing work!' : s === 2 ? 'Great job!' : s === 1 ? 'Good trying!' : 'Good effort!'}
        </T>
        <T w={700} size={16} color={p.muted} style={{ textAlign: 'center', marginBottom: 18 }}>
          You got {result.right} of {result.total} right and earned {result.right * 2} coins{result.sticker ? ` and a new sticker ${result.sticker}` : ''}!
        </T>
        <Press onPress={() => startGame(k)} style={[{ width: '100%', backgroundColor: p.sky, borderRadius: 16, minHeight: 60, alignItems: 'center', justifyContent: 'center', padding: 16 }, shadow]}>
          <T w={800} size={18} color="#fff">▶ Play again</T>
        </Press>
        <Press onPress={() => { leaveGame(); setTab('home'); }} style={{ width: '100%', marginTop: 10, backgroundColor: p.violetSoft, borderRadius: 14, minHeight: 56, alignItems: 'center', justifyContent: 'center', padding: 15 }}>
          <T w={800} size={16}>🏠 Back to islands</T>
        </Press>
      </View>
    );
  } else if (k === 'match') {
    body = (
      <View>
        <View style={[{ backgroundColor: p.card, borderRadius: 22, paddingVertical: 22, paddingHorizontal: wide ? 32 : 18, alignItems: 'center', flexDirection: wide ? 'row' : 'column', gap: wide ? 36 : 0 }, shadow]}>
          <View style={{ width: 170, height: 170, borderRadius: 85, backgroundColor: p.violetSoft, alignItems: 'center', justifyContent: 'center', marginBottom: wide ? 0 : 4 }}>
            <T size={110} style={{ lineHeight: 134 }}>🧩</T>
          </View>
          <View style={{ flex: wide ? 1 : undefined, alignItems: wide ? 'flex-start' : 'center' }}>
            <T w={800} size={wide ? 28 : 22} style={{ lineHeight: wide ? 37 : 29.7, textAlign: wide ? 'left' : 'center', marginTop: 10, marginBottom: 4 }}>Match each one to its answer!</T>
            <T w={700} size={13.5} color={p.muted}>Round {round + 1} of 3 • tap a card, then tap its match</T>
            <Press onPress={() => Sound.speak('Match each one to its answer. Tap a card, then tap its match.')} style={{ marginTop: 10, backgroundColor: p.sunny, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20, minHeight: 50, justifyContent: 'center' }}>
              <T w={800} size={15} color="#2D2A4A">🔊 Hear how to play</T>
            </Press>
          </View>
        </View>
        <View style={{ gap: 10, marginTop: 16 }}>
          {roundQs.map((q, idx) => {
            const r = rightCol[idx];
            return (
              <View key={idx} style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
                <MatchCard emoji={q.e} label={shortQ(q.q)} state={doneL[idx] ? 'done' : sel === idx ? 'sel' : 'idle'} onPress={() => tapLeft(idx)} />
                <MatchCard label={r.label} state={doneR[r.idx] ? 'done' : flash === r.idx ? 'wrong' : 'idle'} onPress={() => tapRight(r.idx)} />
              </View>
            );
          })}
        </View>
        <FeedbackLine fb={fb} />
      </View>
    );
  } else {
    const q = qs[i];
    const longBalloons = k === 'balloon' && q.opts.some((o) => o.length > 6);
    body = (
      <View>
        <QuestionCard q={q} help={help} onHelp={() => setHelp((h) => !h)} extra={k === 'rescue' ? `${buddy} needs your help — rescue step ${i + 1} of ${qs.length} 🔓` : undefined} />
        {k === 'balloon' ? (
          <View style={{ backgroundColor: p.dark ? '#2D3C69' : '#D6F0FF', borderRadius: 22, paddingTop: 18, paddingBottom: 14, paddingHorizontal: 12, marginTop: 14, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {q.opts.map((o, oi) => (
                <View key={oi} style={{ opacity: wrongSet[oi] ? 0.35 : 1 }} pointerEvents={wrongSet[oi] ? 'none' : 'auto'}>
                  <Balloon label={o} long={longBalloons} w={longBalloons ? balloonW : wide ? 110 : 76} color={FIXED.balloons[oi % 4]} popped={chosen === oi} onPress={() => answer(q, oi)} />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
            {q.opts.map((o, oi) => {
              const ok = chosen === oi; const bad = !!wrongSet[oi];
              return (
                <Press
                  key={oi}
                  disabled={bad}
                  onPress={() => answer(q, oi)}
                  style={[{
                    width: '47.5%', flexGrow: 1, minHeight: 80, borderRadius: 18, borderWidth: 3, paddingVertical: 18, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: ok ? p.greenSoft : p.card, borderColor: ok ? p.green : bad ? p.coral : p.line, opacity: bad ? 0.75 : 1,
                  }, shadow]}
                >
                  <T w={800} size={21} style={{ textAlign: 'center' }}>{o}</T>
                </Press>
              );
            })}
          </View>
        )}
        <FeedbackLine fb={fb} />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ width: '100%', maxWidth: gameMax, alignSelf: 'center', paddingHorizontal: wide ? 32 : 16, paddingBottom: 40 }}>
        {header}
        {progress}
        {body}
      </ScrollView>
    </SafeAreaView>
  );
}
