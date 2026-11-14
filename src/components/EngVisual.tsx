import React from 'react';
import { Circle, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import { Palette, usePalette } from '../theme';
import type { EngSpec } from '../data/visualTypes';
import { Arrow, Em, L, Panel, VH, wrap } from './VizPanel';

const Tile = ({ x, y, w, text, fill, color, size = 18 }: { x: number; y: number; w: number; text: string; fill: string; color: string; size?: number }) => (
  <G>
    <Rect x={x} y={y} width={w} height={44} rx={12} fill={fill} />
    <L x={x + w / 2} y={y + 29} size={size} color={color}>{text}</L>
  </G>
);

function WordSum({ s, p }: { s: Extract<EngSpec, { t: 'wordsum' }>; p: Palette }) {
  const widths = s.parts.map((t) => Math.max(46, t.length * 12 + 22));
  const resW = Math.max(60, s.result.length * 12 + 26);
  const total = widths.reduce((a, b) => a + b, 0) + (s.parts.length - 1) * 30 + 38 + resW;
  const scale = Math.min(1, 300 / total);
  let x = 0;
  const els: React.ReactNode[] = [];
  s.parts.forEach((t, i) => {
    els.push(<Tile key={`t${i}`} x={x} y={0} w={widths[i]} text={t} fill={[p.sky, p.orange, p.violet][i % 3]} color="#fff" />);
    x += widths[i];
    if (i < s.parts.length - 1) { els.push(<L key={`p${i}`} x={x + 15} y={30} size={24} color={p.ink}>+</L>); x += 30; }
  });
  els.push(<L key="eq" x={x + 19} y={30} size={24} color={p.ink}>=</L>);
  x += 38;
  els.push(<Tile key="res" x={x} y={0} w={resW} text={s.result} fill={p.green} color="#fff" />);
  const tw = x + resW;
  return (
    <G>
      <G transform={`translate(${(320 - tw * scale) / 2} 52) scale(${scale})`}>{els}</G>
      {s.note ? <L x={160} y={140} size={12.5} color={p.muted}>{s.note}</L> : null}
    </G>
  );
}

function Position({ p }: { p: Palette }) {
  const names = ['on', 'in', 'under', 'behind'];
  return (
    <G>
      {names.map((n, i) => (
        <G key={n} transform={`translate(${12 + i * 77} 20)`}>
          <Rect x={0} y={0} width={70} height={100} rx={12} fill="#fff" fillOpacity={p.dark ? 0.12 : 0.8} />
          {n === 'on' ? <G><Rect x={16} y={58} width={38} height={30} rx={3} fill="#C79A6B" /><Circle cx={35} cy={46} r={11} fill={p.coral} /></G> : null}
          {n === 'in' ? <G><Rect x={14} y={48} width={42} height={40} rx={3} fill="#C79A6B" /><Circle cx={35} cy={52} r={11} fill={p.coral} /><Rect x={14} y={60} width={42} height={28} rx={3} fill="#C79A6B" /></G> : null}
          {n === 'under' ? <G><Rect x={8} y={30} width={54} height={8} rx={3} fill="#C79A6B" /><Rect x={12} y={38} width={6} height={50} fill="#C79A6B" /><Rect x={52} y={38} width={6} height={50} fill="#C79A6B" /><Circle cx={35} cy={72} r={11} fill={p.coral} /></G> : null}
          {n === 'behind' ? <G><Circle cx={46} cy={64} r={13} fill={p.coral} /><Rect x={14} y={42} width={32} height={46} rx={3} fill="#C79A6B" /></G> : null}
          <L x={35} y={116} size={14} color={p.ink}>{n}</L>
        </G>
      ))}
      <L x={160} y={160} size={11.5} color={p.muted}>words that tell us where something is</L>
    </G>
  );
}

function Boxes({ s, p }: { s: Extract<EngSpec, { t: 'boxes' }>; p: Palette }) {
  const n = s.parts.length;
  const w = Math.min(80, 280 / n - 6);
  const x0 = (320 - n * (w + 6) + 6) / 2;
  return (
    <G>
      {s.parts.map((t, i) => (
        <G key={i}>
          <Rect x={x0 + i * (w + 6)} y={44} width={w} height={56} rx={12} fill={[p.sky, p.orange, p.violet, p.green][i % 4]} />
          <L x={x0 + i * (w + 6) + w / 2} y={80} size={t.length > 4 ? 16 : 22} color="#fff">{t}</L>
        </G>
      ))}
      <L x={160} y={26} size={13} color={p.ink}>{s.label}</L>
      <L x={160} y={130} size={12.5} color={p.muted}>tap or clap once for each box</L>
    </G>
  );
}

function Timeline({ s, p }: { s: Extract<EngSpec, { t: 'timeline' }>; p: Palette }) {
  const items = [{ x: 56, k: 'past', t: 'yesterday', w: s.past, c: p.coral }, { x: 160, k: 'now', t: 'today', w: s.now, c: p.green }, { x: 264, k: 'future', t: 'tomorrow', w: s.future, c: p.sky }];
  return (
    <G>
      <Arrow x1={20} y1={78} x2={304} y2={78} color={p.ink} w={4} />
      {items.map((it) => (
        <G key={it.k}>
          <Circle cx={it.x} cy={78} r={11} fill={it.c} />
          <L x={it.x} y={52} size={13} color={it.c}>{it.t}</L>
          <L x={it.x} y={116} size={17} color={p.ink}>{it.w}</L>
        </G>
      ))}
      <L x={160} y={150} size={12} color={p.muted}>the verb changes with the time</L>
    </G>
  );
}

function OneMany({ s, p }: { s: Extract<EngSpec, { t: 'onemany' }>; p: Palette }) {
  return (
    <G>
      <Em x={64} y={66} size={50}>{s.e}</Em>
      <L x={64} y={120} size={15} color={p.ink}>{s.one}</L>
      <Arrow x1={110} y1={68} x2={146} y2={68} color={p.orange} w={4} />
      {[0, 1, 2].map((i) => <Em key={i} x={190 + (i % 3) * 38} y={52 + Math.floor(i / 3) * 40} size={34}>{s.e}</Em>)}
      {[3, 4, 5].map((i) => <Em key={i} x={190 + (i % 3) * 38} y={92} size={34}>{s.e}</Em>)}
      <L x={228} y={132} size={15} color={p.ink}>{s.many}</L>
    </G>
  );
}

function Pair({ s, p }: { s: Extract<EngSpec, { t: 'pair' }>; p: Palette }) {
  return (
    <G>
      <Em x={70} y={64} size={56}>{s.a.e}</Em><L x={70} y={116} size={16} color={p.ink}>{s.a.l}</L>
      <Em x={250} y={64} size={56}>{s.b.e}</Em><L x={250} y={116} size={16} color={p.ink}>{s.b.l}</L>
      <Arrow x1={122} y1={64} x2={198} y2={64} color={p.orange} w={4} />
      <Arrow x1={198} y1={78} x2={122} y2={78} color={p.orange} w={4} />
      <L x={160} y={150} size={12.5} color={p.muted}>{s.label}</L>
    </G>
  );
}

function Scene({ s, p }: { s: Extract<EngSpec, { t: 'scene' }>; p: Palette }) {
  const n = s.items.length;
  const gap = 290 / n;
  return (
    <G>
      {s.items.map((it, i) => (
        <G key={i}>
          <Em x={15 + gap * i + gap / 2} y={i % 2 ? 78 : 62} size={n <= 3 ? 54 : 44}>{it.e}</Em>
          {wrap(it.l, 12).map((line, k) => <L key={k} x={15 + gap * i + gap / 2} y={(i % 2 ? 78 : 62) + 40 + k * 13} size={11.5} color={p.ink}>{line}</L>)}
        </G>
      ))}
      {s.caption ? <L x={160} y={VH - 8} size={12} color={p.muted}>{s.caption}</L> : null}
    </G>
  );
}

function Bubble({ s, p }: { s: Extract<EngSpec, { t: 'bubble' }>; p: Palette }) {
  const lines = wrap(s.text, 20);
  return (
    <G>
      <Rect x={50} y={14} width={230} height={86} rx={22} fill="#fff" fillOpacity={p.dark ? 0.9 : 1} stroke={p.ink} strokeWidth={3} />
      <Polygon points="86,100 70,128 116,100" fill="#fff" stroke={p.ink} strokeWidth={3} />
      <Rect x={84} y={96} width={34} height={8} fill="#fff" />
      <L x={64} y={50} size={34} color={p.coral} anchor="start">“</L>
      {lines.map((ln, i) => <L key={i} x={165} y={50 + i * 22} size={17} color="#2D2A4A">{ln}</L>)}
      <L x={264} y={92} size={34} color={p.coral} anchor="end">”</L>
      <Em x={62} y={146} size={26}>{s.who}</Em>
      <L x={104} y={154} size={11} color={p.muted} anchor="start">speech marks go round spoken words</L>
    </G>
  );
}

function Marks({ p }: { p: Palette }) {
  const marks = [['.', 'full stop'], ['?', 'question'], ['!', 'exclamation'], [',', 'comma'], ['’', 'apostrophe'], ['“ ”', 'speech marks'], [':', 'colon'], [';', 'semi-colon']];
  return (
    <G>
      {marks.map(([m, n], i) => {
        const cx = 40 + (i % 4) * 80, cy = 40 + Math.floor(i / 4) * 66;
        return (
          <G key={n}>
            <Circle cx={cx} cy={cy} r={20} fill={[p.sky, p.orange, p.violet, p.green][i % 4]} />
            <L x={cx} y={cy + 9} size={m.length > 1 ? 18 : 26} color="#fff">{m}</L>
            <L x={cx} y={cy + 36} size={10.5} color={p.ink}>{n}</L>
          </G>
        );
      })}
    </G>
  );
}

function WordClass({ p }: { p: Palette }) {
  const cards = [{ e: '🐶', w: 'dog', n: 'noun', d: 'names a thing', c: p.sky }, { e: '🏃', w: 'run', n: 'verb', d: 'an action', c: p.coral }, { e: '🔴', w: 'red', n: 'adjective', d: 'describes', c: p.green }, { e: '🐢', w: 'slowly', n: 'adverb', d: 'how it is done', c: p.orange }];
  return (
    <G>
      {cards.map((c, i) => (
        <G key={c.n} transform={`translate(${10 + i * 76} 12)`}>
          <Rect x={0} y={0} width={70} height={138} rx={14} fill="#fff" fillOpacity={p.dark ? 0.12 : 0.85} stroke={c.c} strokeWidth={3} />
          <Em x={35} y={34} size={34}>{c.e}</Em>
          <L x={35} y={72} size={14} color={p.ink}>{c.w}</L>
          <Rect x={6} y={82} width={58} height={22} rx={11} fill={c.c} />
          <L x={35} y={98} size={11.5} color="#fff">{c.n}</L>
          {wrap(c.d, 10).map((l, k) => <L key={k} x={35} y={120 + k * 12} size={10} color={p.muted}>{l}</L>)}
        </G>
      ))}
    </G>
  );
}

function Clause({ s, p }: { s: Extract<EngSpec, { t: 'clause' }>; p: Palette }) {
  const box = (x: number, w: number, t: string, fill: string, tag: string) => (
    <G>
      <Rect x={x} y={44} width={w} height={54} rx={12} fill={fill} />
      <L x={x + w / 2} y={76} size={wrap(t, 12).length > 1 ? 12 : 14} color="#fff">{wrap(t, 12)[0]}</L>
      {wrap(t, 12)[1] ? <L x={x + w / 2} y={90} size={12} color="#fff">{wrap(t, 12)[1]}</L> : null}
      <L x={x + w / 2} y={124} size={11.5} color={p.muted}>{tag}</L>
    </G>
  );
  return (
    <G>
      {box(10, 130, s.a, p.sky, 'main clause')}
      {box(146, 60, s.c, p.orange, 'joiner')}
      {box(212, 98, s.b, p.violet, 'extra clause')}
    </G>
  );
}

function Voice({ s, p }: { s: Extract<EngSpec, { t: 'voice' }>; p: Palette }) {
  return (
    <G>
      <L x={20} y={30} size={12} color={p.sky} anchor="start">active: the doer comes first</L>
      <Rect x={14} y={38} width={292} height={36} rx={12} fill={p.sky} fillOpacity={0.9} />
      <L x={160} y={62} size={16} color="#fff">{s.active}</L>
      <L x={20} y={104} size={12} color={p.orange} anchor="start">passive: the thing it happens to comes first</L>
      <Rect x={14} y={112} width={292} height={36} rx={12} fill={p.orange} fillOpacity={0.9} />
      <L x={160} y={136} size={16} color="#fff">{s.passive}</L>
    </G>
  );
}

function Picture({ s, p }: { s: EngSpec; p: Palette }) {
  switch (s.t) {
    case 'wordsum': return <WordSum s={s} p={p} />;
    case 'position': return <Position p={p} />;
    case 'boxes': return <Boxes s={s} p={p} />;
    case 'timeline': return <Timeline s={s} p={p} />;
    case 'onemany': return <OneMany s={s} p={p} />;
    case 'pair': return <Pair s={s} p={p} />;
    case 'scene': return <Scene s={s} p={p} />;
    case 'bubble': return <Bubble s={s} p={p} />;
    case 'marks': return <Marks p={p} />;
    case 'wordclass': return <WordClass p={p} />;
    case 'clause': return <Clause s={s} p={p} />;
    case 'voice': return <Voice s={s} p={p} />;
  }
}

export default function EngVisual({ spec, wide, compact }: { spec: EngSpec; wide?: boolean; compact?: boolean }) {
  const p = usePalette();
  return (
    <Panel bg={p.violetSoft} wide={wide} compact={compact}>
      <Picture s={spec} p={p} />
    </Panel>
  );
}
void Line;
void Path;
