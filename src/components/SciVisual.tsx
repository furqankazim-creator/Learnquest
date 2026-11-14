import React from 'react';
import { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import { Palette, usePalette } from '../theme';
import type { SciSpec } from '../data/visualTypes';
import { Arrow, Em, L, Panel, VH, VW, wrap } from './VizPanel';

// ---------- strips: row / chain / cycle ----------
function Strip({ items, arrows, loop, hi, p }: { items: { e: string; l: string }[]; arrows?: boolean; loop?: boolean; hi?: number; p: Palette }) {
  const n = items.length;
  const gap = 280 / Math.max(1, n);
  const xs = items.map((_, i) => 20 + gap * i + gap / 2);
  const size = n <= 3 ? 46 : 38;
  const y = loop ? 60 : 72;
  return (
    <G>
      {items.map((it, i) => (
        <G key={i}>
          {hi === i ? <Rect x={xs[i] - gap / 2 + 4} y={y - 34} width={gap - 8} height={96} rx={14} fill={p.orange} fillOpacity={0.25} stroke={p.orange} strokeWidth={2.5} /> : null}
          <Em x={xs[i]} y={y} size={size}>{it.e}</Em>
          {wrap(it.l, n <= 3 ? 16 : 13).map((line, k) => <L key={k} x={xs[i]} y={y + 36 + k * 14} size={n <= 3 ? 12.5 : 11.5} color={p.ink}>{line}</L>)}
          {arrows && i < n - 1 ? <Arrow x1={xs[i] + size * 0.7} y1={y} x2={xs[i + 1] - size * 0.7} y2={y} color={p.orange} /> : null}
        </G>
      ))}
      {loop ? (
        <G>
          <Path d={`M ${xs[n - 1]} ${y + 70} Q ${(xs[0] + xs[n - 1]) / 2} ${y + 98} ${xs[0] + 6} ${y + 70}`} fill="none" stroke={p.orange} strokeWidth={3} strokeDasharray="6 4" strokeLinecap="round" />
          <Polygon points={`${xs[0] - 2},${y + 66} ${xs[0] + 14},${y + 68} ${xs[0] + 6},${y + 78}`} fill={p.orange} />
          <L x={160} y={VH - 6} size={11.5} color={p.orange}>and it starts again</L>
        </G>
      ) : null}
    </G>
  );
}

// ---------- plant ----------
function Plant({ s, p }: { s: Extract<SciSpec, { t: 'plant' }>; p: Palette }) {
  const hl = (part: string, cx: number, cy: number) => (s.hi === part ? <Circle cx={cx} cy={cy} r={22} fill="none" stroke={p.coral} strokeWidth={3} strokeDasharray="5 4" /> : null);
  const lab = (part: string, name: string, y: number, fromX: number, fromY: number) => (
    <G key={part}>
      <Line x1={fromX} y1={fromY} x2={205} y2={y - 4} stroke={p.ink} strokeOpacity={0.4} strokeWidth={1.5} />
      <L x={210} y={y} size={14} color={s.hi === part ? p.coral : p.ink} anchor="start">{name}</L>
    </G>
  );
  return (
    <G>
      <Rect x={20} y={112} width={170} height={50} rx={8} fill="#8D5A34" fillOpacity={0.9} />
      <Path d="M105 112 Q98 132 82 150 M105 112 L105 152 M105 112 Q114 132 130 150" fill="none" stroke="#D2A679" strokeWidth={3} strokeLinecap="round" />
      <Line x1={105} y1={112} x2={105} y2={54} stroke="#1DB954" strokeWidth={7} strokeLinecap="round" />
      <Ellipse cx={84} cy={86} rx={19} ry={8} fill="#1DB954" transform="rotate(-28 84 86)" />
      <Ellipse cx={127} cy={74} rx={19} ry={8} fill="#1DB954" transform="rotate(28 127 74)" />
      {[0, 60, 120, 180, 240, 300].map((a) => <Circle key={a} cx={105 + 14 * Math.cos((a * Math.PI) / 180)} cy={40 + 14 * Math.sin((a * Math.PI) / 180)} r={9} fill="#FF8FAB" />)}
      <Circle cx={105} cy={40} r={8} fill="#FFC93C" />
      {hl('flower', 105, 40)}{hl('leaf', 130, 76)}{hl('stem', 105, 96)}{hl('roots', 105, 138)}
      {lab('flower', 'flower', 36, 121, 40)}{lab('leaf', 'leaf', 70, 146, 72)}{lab('stem', 'stem', 100, 110, 98)}{lab('roots', 'roots', 142, 128, 140)}
      {s.needs ? (
        <G>
          <Em x={34} y={30} size={30}>☀️</Em>
          <Em x={36} y={84} size={22}>💧</Em><Em x={56} y={96} size={18}>💧</Em>
          <Arrow x1={52} y1={42} x2={86} y2={62} color="#FFC93C" />
        </G>
      ) : null}
    </G>
  );
}

// ---------- states of matter ----------
function States({ s, p }: { s: Extract<SciSpec, { t: 'states' }>; p: Palette }) {
  // fixed pseudo-random positions (same every render)
  const rndAt = (i: number) => { const v = Math.sin(i * 12.9898 + 7) * 43758.5453; return v - Math.floor(v); };
  const boxes = [
    { name: 'solid', sub: 'fixed shape', pts: Array.from({ length: 16 }, (_, i) => [14 + (i % 4) * 14, 78 + Math.floor(i / 4) * 14 - 28 + 10]) },
    { name: 'liquid', sub: 'flows', pts: Array.from({ length: 12 }, (_, k) => [10 + rndAt(k * 2) * 62, 74 + rndAt(k * 2 + 1) * 38]) },
    { name: 'gas', sub: 'fills the space', pts: Array.from({ length: 7 }, (_, k) => [10 + rndAt(k * 2 + 40) * 62, 40 + rndAt(k * 2 + 41) * 72]) },
  ];
  return (
    <G>
      {boxes.map((b, i) => (
        <G key={b.name} transform={`translate(${14 + i * 102} 12)`}>
          <Rect x={0} y={0} width={92} height={118} rx={12} fill="#fff" fillOpacity={p.dark ? 0.15 : 0.8} stroke={s.hi === i ? p.orange : p.ink} strokeOpacity={s.hi === i ? 1 : 0.3} strokeWidth={s.hi === i ? 4 : 2} />
          {b.pts.map((pt, k) => <Circle key={k} cx={pt[0]} cy={pt[1] - 12 + (i === 0 ? 4 : 12)} r={5.5} fill={[p.sky, p.violet, p.coral][i]} />)}
          <L x={46} y={136} size={14} color={p.ink}>{b.name}</L>
          <L x={46} y={150} size={10.5} color={p.muted}>{b.sub}</L>
        </G>
      ))}
    </G>
  );
}

// ---------- electric circuit ----------
function Circuit({ s, p }: { s: Extract<SciSpec, { t: 'circuit' }>; p: Palette }) {
  const lit = !s.gap && !s.open;
  const bulbs = s.bulbs ?? 1;
  const cells = s.cells ?? 1;
  const wire = { stroke: p.ink, strokeWidth: 4, fill: 'none', strokeLinecap: 'round' as const };
  const bx = bulbs === 2 ? [128, 192] : [160];
  return (
    <G>
      {/* wires */}
      <Path d={`M 60 78 L 60 40 L ${s.buzzer ? 130 : bulbs === 2 ? 106 : 140} 40`} {...wire} />
      {bulbs === 2 ? <Path d="M 150 40 L 170 40" {...wire} /> : null}
      <Path d={`M ${s.buzzer ? 190 : bulbs === 2 ? 214 : 180} 40 L 260 40 L 260 70`} {...wire} />
      <Path d={`M 260 100 L 260 130 L ${s.gap ? 190 : 60} 130`} {...wire} />
      {s.gap ? <Path d="M 130 130 L 60 130" {...wire} /> : null}
      <Path d="M 60 130 L 60 98" {...wire} />
      {s.gap ? <G><Line x1={134} y1={130} x2={186} y2={130} stroke={p.coral} strokeWidth={3} strokeDasharray="4 5" /><L x={160} y={152} size={12} color={p.coral}>gap!</L></G> : null}
      {/* battery */}
      {Array.from({ length: cells }, (_, i) => (
        <G key={i}>
          <Line x1={44} y1={78 + i * 12 - (cells - 1) * 6} x2={76} y2={78 + i * 12 - (cells - 1) * 6} stroke={p.ink} strokeWidth={4} />
          <Line x1={51} y1={84 + i * 12 - (cells - 1) * 6} x2={69} y2={84 + i * 12 - (cells - 1) * 6} stroke={p.ink} strokeWidth={4} />
        </G>
      ))}
      <L x={96} y={96} size={11} color={p.muted} anchor="start">cell</L>
      {/* bulbs or buzzer */}
      {s.buzzer ? (
        <G>
          <Rect x={130} y={26} width={60} height={28} rx={8} fill={lit ? p.orange : '#fff'} fillOpacity={lit ? 0.9 : 0.7} stroke={p.ink} strokeWidth={3} />
          <L x={160} y={45} size={12} color={p.ink}>buzzer</L>
          {lit ? <G><Path d="M 196 34 Q 206 40 196 46" fill="none" stroke={p.orange} strokeWidth={3} /><Path d="M 204 28 Q 220 40 204 52" fill="none" stroke={p.orange} strokeWidth={3} /></G> : null}
        </G>
      ) : bx.map((x) => (
        <G key={x}>
          {lit ? <Circle cx={x} cy={40} r={26} fill="#FFC93C" fillOpacity={0.4} /> : null}
          <Circle cx={x} cy={40} r={15} fill={lit ? '#FFE58A' : '#fff'} fillOpacity={lit ? 1 : 0.8} stroke={p.ink} strokeWidth={3} />
          <Path d={`M ${x - 7} ${40 - 7} L ${x + 7} ${40 + 7} M ${x + 7} ${40 - 7} L ${x - 7} ${40 + 7}`} stroke={p.ink} strokeWidth={2} />
        </G>
      ))}
      {/* switch */}
      <Circle cx={260} cy={72} r={4} fill={p.ink} /><Circle cx={260} cy={98} r={4} fill={p.ink} />
      {s.open ? <Line x1={260} y1={98} x2={284} y2={80} stroke={p.ink} strokeWidth={4} strokeLinecap="round" /> : <Line x1={260} y1={98} x2={260} y2={72} stroke={p.ink} strokeWidth={4} strokeLinecap="round" />}
      <L x={246} y={90} size={11} color={p.muted} anchor="end">switch</L>
      <L x={160} y={VH - 8} size={11.5} color={p.muted}>{lit ? 'the loop is complete, so current flows' : 'the loop is broken, so no current flows'}</L>
    </G>
  );
}

// ---------- space ----------
const PLANETS = [
  { n: 'Mercury', r: 4, c: '#A0A0A0' }, { n: 'Venus', r: 7, c: '#E8C27A' }, { n: 'Earth', r: 7.5, c: '#4D96FF' }, { n: 'Mars', r: 5.5, c: '#FF6B6B' },
  { n: 'Jupiter', r: 17, c: '#D9A066' }, { n: 'Saturn', r: 13, c: '#E6C98A' }, { n: 'Uranus', r: 9, c: '#7FDBDA' }, { n: 'Neptune', r: 9, c: '#4D6BFF' },
];
function Solar({ s, p }: { s: Extract<SciSpec, { t: 'solar' }>; p: Palette }) {
  const xs = [66, 90, 114, 138, 176, 220, 256, 292];
  return (
    <G>
      <Circle cx={-6} cy={85} r={52} fill="#FFC93C" /><Circle cx={-6} cy={85} r={64} fill="#FFC93C" fillOpacity={0.25} />
      <L x={26} y={152} size={12} color={p.ink}>Sun</L>
      {PLANETS.map((pl, i) => (
        <G key={pl.n}>
          {s.hi === pl.n ? <Circle cx={xs[i]} cy={85} r={pl.r + 8} fill="none" stroke={p.coral} strokeWidth={3} /> : null}
          <Circle cx={xs[i]} cy={85} r={pl.r} fill={pl.c} />
          {pl.n === 'Saturn' ? <Ellipse cx={xs[i]} cy={85} rx={pl.r + 8} ry={4} fill="none" stroke="#C9A64B" strokeWidth={2.5} /> : null}
          <L x={xs[i]} y={i % 2 ? 128 : 52} size={9.5} color={s.hi === pl.n ? p.coral : p.ink}>{pl.n}</L>
        </G>
      ))}
    </G>
  );
}

function DayNight({ p }: { p: Palette }) {
  return (
    <G>
      <Circle cx={36} cy={85} r={26} fill="#FFC93C" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <Line key={a} x1={36 + 32 * Math.cos((a * Math.PI) / 180)} y1={85 + 32 * Math.sin((a * Math.PI) / 180)} x2={36 + 42 * Math.cos((a * Math.PI) / 180)} y2={85 + 42 * Math.sin((a * Math.PI) / 180)} stroke="#FFC93C" strokeWidth={4} strokeLinecap="round" />)}
      {[70, 85, 100].map((y) => <Arrow key={y} x1={86} y1={y} x2={150} y2={y} color="#FFC93C" w={2} />)}
      <Path d="M 220 38 A 47 47 0 0 0 220 132 Z" fill="#4D96FF" />
      <Path d="M 220 38 A 47 47 0 0 1 220 132 Z" fill="#2D2A4A" />
      <Path d="M 196 60 q 8 -6 16 2 q -4 10 -14 8 z M 205 96 q 10 -4 12 8 q -8 8 -14 -2 z" fill="#1DB954" />
      <L x={180} y={30} size={13} color={p.ink}>day</L>
      <L x={262} y={30} size={13} color={p.ink}>night</L>
      <Path d="M 268 56 Q 282 85 268 114" fill="none" stroke={p.orange} strokeWidth={3} strokeDasharray="5 4" />
      <Polygon points="268,118 260,108 274,106" fill={p.orange} />
      <L x={220} y={156} size={12} color={p.muted}>the Earth spins</L>
    </G>
  );
}

function Phases({ s, p }: { s: Extract<SciSpec, { t: 'phases' }>; p: Palette }) {
  const names = ['new', 'crescent', 'half', 'gibbous', 'full'];
  const f = [0, 0.25, 0.5, 0.75, 1];
  return (
    <G>
      {f.map((fr, i) => {
        const cx = 40 + i * 60, cy = 72, r = 22, rx = r * Math.abs(1 - 2 * fr);
        const lit = fr === 0 ? '' : `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${fr > 0.5 ? 1 : 0} ${cx} ${cy - r} Z`;
        return (
          <G key={i}>
            {s.hi === i ? <Circle cx={cx} cy={cy} r={r + 7} fill="none" stroke={p.coral} strokeWidth={3} /> : null}
            <Circle cx={cx} cy={cy} r={r} fill="#3B3768" />
            {lit ? <Path d={lit} fill="#FFF3B0" /> : null}
            <L x={cx} y={122} size={12} color={s.hi === i ? p.coral : p.ink}>{names[i]}</L>
          </G>
        );
      })}
      <Arrow x1={40} y1={148} x2={280} y2={148} color={p.muted} w={2} />
      <L x={160} y={164} size={10.5} color={p.muted}>about a month, as the Moon goes round the Earth</L>
    </G>
  );
}

function Orbit({ p }: { p: Palette }) {
  return (
    <G>
      <Ellipse cx={120} cy={85} rx={86} ry={58} fill="none" stroke={p.ink} strokeOpacity={0.4} strokeWidth={2} strokeDasharray="6 5" />
      <Circle cx={120} cy={85} r={22} fill="#FFC93C" /><L x={120} y={90} size={11} color="#5A3E00">Sun</L>
      <Circle cx={206} cy={85} r={9} fill="#4D96FF" />
      <Circle cx={206} cy={85} r={20} fill="none" stroke={p.ink} strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="3 3" />
      <Circle cx={223} cy={74} r={4} fill="#C9C9C9" />
      <L x={206} y={116} size={12} color={p.ink}>Earth</L>
      <L x={248} y={66} size={12} color={p.muted} anchor="start">Moon</L>
      <Arrow x1={112} y1={30} x2={160} y2={34} color={p.orange} w={2.5} />
      <L x={290} y={154} size={11} color={p.orange} anchor="end">1 trip = 1 year</L>
    </G>
  );
}

// ---------- the body ----------
function Digestive({ s, p }: { s: Extract<SciSpec, { t: 'digestive' }>; p: Palette }) {
  const c = (part: string, base: string) => (s.hi === part ? p.coral : base);
  const lab = (part: string, name: string, y: number, x: number) => (
    <G key={part}><Line x1={x} y1={y - 4} x2={176} y2={y - 4} stroke={p.ink} strokeOpacity={0.35} strokeWidth={1.5} /><L x={182} y={y} size={13} color={s.hi === part ? p.coral : p.ink} anchor="start">{name}</L></G>
  );
  return (
    <G>
      <Em x={112} y={14} size={22}>👄</Em>
      <Line x1={112} y1={28} x2={112} y2={60} stroke={c('oesophagus', '#FF8FAB')} strokeWidth={9} strokeLinecap="round" />
      <Ellipse cx={122} cy={72} rx={26} ry={14} fill={c('stomach', '#FF8FAB')} transform="rotate(-22 122 72)" />
      <Rect x={82} y={92} width={66} height={64} rx={10} fill="none" stroke={c('large', '#1DB954')} strokeWidth={7} />
      <Path d="M 96 102 q 18 6 0 14 q -18 6 0 14 q 18 6 0 14 q -18 6 0 14" fill="none" stroke={c('small', '#FF8A3D')} strokeWidth={7} strokeLinecap="round" />
      {lab('oesophagus', 'oesophagus', 44, 118)}{lab('stomach', 'stomach', 76, 148)}{lab('small', 'small intestine', 116, 130)}{lab('large', 'large intestine', 148, 150)}
    </G>
  );
}

function Teeth({ s, p }: { s: Extract<SciSpec, { t: 'teeth' }>; p: Palette }) {
  const names = ['incisor', 'canine', 'molar'];
  const jobs = ['cuts', 'tears', 'grinds'];
  return (
    <G>
      {[0, 1, 2].map((i) => (
        <G key={i} transform={`translate(${30 + i * 96} 0)`}>
          {s.hi === i ? <Rect x={-12} y={10} width={80} height={130} rx={14} fill={p.orange} fillOpacity={0.2} stroke={p.orange} strokeWidth={2.5} /> : null}
          {i === 0 ? <Path d="M 8 30 L 48 30 L 44 100 Q 28 108 12 100 Z" fill="#fff" stroke={p.ink} strokeWidth={3} /> : null}
          {i === 1 ? <Path d="M 8 30 L 48 30 L 44 80 L 28 112 L 12 80 Z" fill="#fff" stroke={p.ink} strokeWidth={3} /> : null}
          {i === 2 ? <G><Path d="M 0 34 L 56 34 L 56 84 Q 56 100 40 98 L 28 92 L 16 98 Q 0 100 0 84 Z" fill="#fff" stroke={p.ink} strokeWidth={3} /><Path d="M 14 60 L 42 60" stroke={p.ink} strokeOpacity={0.4} strokeWidth={2} /></G> : null}
          <L x={28} y={132} size={13} color={p.ink}>{names[i]}</L>
          <L x={28} y={148} size={11} color={p.muted}>{jobs[i]}</L>
        </G>
      ))}
    </G>
  );
}

function Skeleton({ s, p }: { s: Extract<SciSpec, { t: 'skeleton' }>; p: Palette }) {
  const col = (part: string) => (s.hi === part ? p.coral : '#fff');
  const lab = (part: string, name: string, y: number, x: number) => (
    <G key={part}><Line x1={x} y1={y - 4} x2={190} y2={y - 4} stroke={p.ink} strokeOpacity={0.35} strokeWidth={1.5} /><L x={196} y={y} size={13} color={s.hi === part ? p.coral : p.ink} anchor="start">{name}</L></G>
  );
  return (
    <G>
      <Circle cx={120} cy={24} r={15} fill={col('skull')} stroke={p.ink} strokeWidth={3} />
      <Line x1={120} y1={40} x2={120} y2={104} stroke={s.hi === 'spine' ? p.coral : p.ink} strokeWidth={5} strokeLinecap="round" />
      {[52, 64, 76].map((y) => <Path key={y} d={`M 120 ${y} Q 96 ${y + 4} 94 ${y + 14} M 120 ${y} Q 144 ${y + 4} 146 ${y + 14}`} fill="none" stroke={s.hi === 'ribs' ? p.coral : p.ink} strokeWidth={4} strokeLinecap="round" />)}
      <Path d="M 100 104 L 140 104 L 134 124 L 106 124 Z" fill={col('pelvis')} stroke={p.ink} strokeWidth={3} />
      <Path d="M 100 56 L 70 84 M 140 56 L 170 84 M 110 124 L 100 160 M 130 124 L 140 160" stroke={p.ink} strokeWidth={4} strokeLinecap="round" />
      {lab('skull', 'skull', 28, 136)}{lab('ribs', 'ribs', 72, 148)}{lab('spine', 'backbone', 100, 124)}{lab('pelvis', 'pelvis', 120, 142)}
    </G>
  );
}

function Heart({ p }: { p: Palette }) {
  return (
    <G>
      <Em x={150} y={80} size={64}>❤️</Em>
      <Em x={46} y={80} size={40}>🫁</Em>
      <Arrow x1={190} y1={62} x2={270} y2={44} color="#FF6B6B" w={4} />
      <Arrow x1={270} y1={118} x2={190} y2={100} color="#4D96FF" w={4} />
      <L x={274} y={38} size={11.5} color="#FF6B6B" anchor="end">blood out to the body</L>
      <L x={274} y={140} size={11.5} color="#4D96FF" anchor="end">blood back to the heart</L>
      <Arrow x1={86} y1={70} x2={112} y2={74} color="#4D96FF" w={3} />
      <L x={46} y={120} size={11.5} color={p.ink}>lungs</L>
    </G>
  );
}

// ---------- forces, magnets, light, sound, heat ----------
function Magnet({ s, p }: { s: Extract<SciSpec, { t: 'magnet' }>; p: Palette }) {
  const bar = (x: number, left: 'N' | 'S') => {
    const right = left === 'N' ? 'S' : 'N';
    return (
      <G>
        <Rect x={x} y={64} width={42} height={36} fill={left === 'N' ? '#FF6B6B' : '#4D96FF'} /><Rect x={x + 42} y={64} width={42} height={36} fill={right === 'N' ? '#FF6B6B' : '#4D96FF'} />
        <Rect x={x} y={64} width={84} height={36} fill="none" stroke={p.ink} strokeWidth={3} rx={4} />
        <L x={x + 21} y={88} size={20} color="#fff">{left}</L><L x={x + 63} y={88} size={20} color="#fff">{right}</L>
      </G>
    );
  };
  const repel = s.mode === 'repel';
  return (
    <G>
      {repel ? <G>{bar(30, 'S')}{bar(206, 'N')}</G> : <G>{bar(30, 'N')}{bar(206, 'N')}</G>}
      {repel ? <G><Arrow x1={150} y1={82} x2={124} y2={82} color={p.orange} w={4} /><Arrow x1={170} y1={82} x2={196} y2={82} color={p.orange} w={4} /></G> : <G><Arrow x1={124} y1={82} x2={150} y2={82} color={p.green} w={4} /><Arrow x1={196} y1={82} x2={170} y2={82} color={p.green} w={4} /></G>}
      <L x={160} y={36} size={13} color={p.ink}>{repel ? 'two magnets facing each other…' : 'two magnets facing each other…'}</L>
      <L x={160} y={140} size={13} color={repel ? p.orange : p.green}>{repel ? 'the same poles: push apart' : 'different poles: pull together'}</L>
    </G>
  );
}

function Reflect({ p }: { p: Palette }) {
  return (
    <G>
      <Line x1={60} y1={132} x2={260} y2={132} stroke={p.ink} strokeWidth={6} strokeLinecap="round" />
      {Array.from({ length: 11 }, (_, i) => <Line key={i} x1={66 + i * 18} y1={134} x2={58 + i * 18} y2={146} stroke={p.ink} strokeOpacity={0.4} strokeWidth={2} />)}
      <Line x1={160} y1={132} x2={160} y2={40} stroke={p.ink} strokeOpacity={0.4} strokeWidth={1.5} strokeDasharray="4 4" />
      <Arrow x1={92} y1={46} x2={156} y2={128} color="#FFB800" w={4} /><Arrow x1={164} y1={128} x2={228} y2={46} color="#FFB800" w={4} />
      <Em x={78} y={34} size={26}>🔦</Em>
      <L x={160} y={160} size={12} color={p.muted}>a torch shining on a mirror</L>
    </G>
  );
}

function Refract({ p }: { p: Palette }) {
  return (
    <G>
      <Rect x={100} y={60} width={110} height={88} rx={8} fill="#4D96FF" fillOpacity={0.3} stroke={p.ink} strokeWidth={3} />
      <Line x1={104} y1={60} x2={206} y2={60} stroke="#4D96FF" strokeWidth={3} />
      <Line x1={190} y1={14} x2={163} y2={60} stroke="#FF6B6B" strokeWidth={7} strokeLinecap="round" />
      <Line x1={163} y1={60} x2={143} y2={140} stroke="#FF6B6B" strokeWidth={7} strokeLinecap="round" />
      <L x={225} y={62} size={12} color={p.ink} anchor="start">water</L>
      <L x={225} y={40} size={12} color={p.ink} anchor="start">air</L>
      <L x={40} y={100} size={12} color={p.coral}>looks bent!</L>
    </G>
  );
}

function Shadow({ p }: { p: Palette }) {
  return (
    <G>
      <Em x={34} y={82} size={34}>🔦</Em>
      <Polygon points="56,78 250,40 250,126 56,90" fill="#FFE58A" fillOpacity={0.5} />
      <Circle cx={130} cy={84} r={18} fill="#2D2A4A" />
      <Rect x={248} y={20} width={10} height={130} fill={p.ink} fillOpacity={0.5} />
      <Ellipse cx={254} cy={84} rx={7} ry={32} fill="#000" fillOpacity={0.55} />
      <L x={130} y={122} size={12} color={p.ink}>object</L>
      <L x={228} y={160} size={12} color={p.ink}>wall</L>
    </G>
  );
}

function Wave({ y, amp, cycles, color }: { y: number; amp: number; cycles: number; color: string }) {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) { const x = 20 + (i / 120) * 280; pts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y + amp * Math.sin((i / 120) * cycles * 2 * Math.PI)}`); }
  return <Path d={pts.join(' ')} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" />;
}
function Sound({ s, p }: { s: Extract<SciSpec, { t: 'sound' }>; p: Palette }) {
  if (s.kind === 'vibration') {
    return (
      <G>
        <Rect x={20} y={100} width={64} height={12} fill="#8D5A34" /><Rect x={20} y={112} width={30} height={40} fill="#8D5A34" />
        <Line x1={26} y1={100} x2={84} y2={78} stroke="#FFC93C" strokeWidth={8} strokeLinecap="round" /><Line x1={26} y1={100} x2={84} y2={104} stroke="#FFC93C" strokeOpacity={0.4} strokeWidth={8} strokeLinecap="round" />
        {[0, 1, 2].map((i) => <Path key={i} d={`M ${110 + i * 30} ${60 - i * 4} Q ${126 + i * 30} 88 ${110 + i * 30} ${116 + i * 4}`} fill="none" stroke={p.violet} strokeWidth={3.5} strokeLinecap="round" />)}
        <Em x={262} y={88} size={40}>👂</Em>
        <L x={160} y={150} size={12} color={p.ink}>a ruler on a desk, and an ear</L>
      </G>
    );
  }
  if (s.kind === 'pitch') {
    return (<G><Wave y={46} amp={20} cycles={9} color={p.coral} /><Wave y={126} amp={20} cycles={3} color={p.sky} /><L x={160} y={16} size={12} color={p.coral}>fast vibrations = high pitch</L><L x={160} y={163} size={12} color={p.sky}>slow vibrations = low pitch</L></G>);
  }
  return (<G><Wave y={46} amp={28} cycles={4} color={p.orange} /><Wave y={124} amp={8} cycles={4} color={p.green} /><L x={160} y={14} size={12} color={p.orange}>big vibrations = loud</L><L x={160} y={160} size={12} color={p.green}>small vibrations = quiet</L></G>);
}

function Thermo({ s, p }: { s: Extract<SciSpec, { t: 'thermo' }>; p: Palette }) {
  const top = 24, bottom = 128;
  const y = bottom - ((bottom - top) * Math.max(0, Math.min(110, s.v))) / 110;
  return (
    <G>
      <Rect x={76} y={top - 6} width={20} height={bottom - top + 12} rx={10} fill="#fff" fillOpacity={0.85} stroke={p.ink} strokeWidth={3} />
      <Circle cx={86} cy={140} r={15} fill="#FF6B6B" stroke={p.ink} strokeWidth={3} />
      <Rect x={82} y={y} width={8} height={140 - y} fill="#FF6B6B" />
      {[0, 50, 100].map((v) => { const yy = bottom - ((bottom - top) * v) / 110; return <G key={v}><Line x1={96} y1={yy} x2={112} y2={yy} stroke={p.ink} strokeWidth={2.5} /><L x={118} y={yy + 4} size={13} color={p.ink} anchor="start">{`${v}°C`}</L></G>; })}
      <Em x={246} y={70} size={56}>{s.e}</Em>
      <L x={246} y={130} size={13} color={p.ink}>{s.l}</L>
      <Arrow x1={190} y1={y} x2={214} y2={y} color={p.coral} w={3} />
    </G>
  );
}

function Force({ s, p }: { s: Extract<SciSpec, { t: 'force' }>; p: Palette }) {
  switch (s.kind) {
    case 'push': return <G><Em x={50} y={86} size={44}>🧍</Em><Arrow x1={84} y1={86} x2={150} y2={86} color={p.orange} w={5} /><Em x={190} y={88} size={48}>📦</Em><L x={118} y={72} size={13} color={p.orange}>push</L></G>;
    case 'pull': return <G><Em x={266} y={86} size={44}>🧍</Em><Arrow x1={230} y1={86} x2={166} y2={86} color={p.orange} w={5} /><Em x={130} y={88} size={48}>📦</Em><L x={198} y={72} size={13} color={p.orange}>pull</L></G>;
    case 'gravity': return <G><Em x={160} y={34} size={40}>⚽</Em><Arrow x1={160} y1={62} x2={160} y2={118} color={p.coral} w={5} /><Rect x={80} y={130} width={160} height={14} rx={6} fill="#1DB954" /><L x={190} y={96} size={13} color={p.coral} anchor="start">pulled down</L></G>;
    case 'friction': return <G><Em x={120} y={72} size={46}>📦</Em><Arrow x1={170} y1={72} x2={250} y2={72} color={p.green} w={4} /><L x={212} y={58} size={12} color={p.green}>moving</L><Path d="M 40 118 l 12 -10 l 12 10 l 12 -10 l 12 10 l 12 -10 l 12 10 l 12 -10 l 12 10 l 12 -10 l 12 10 l 12 -10 l 12 10 l 12 -10 l 12 10 l 12 -10 l 12 10" fill="none" stroke="#8D5A34" strokeWidth={4} /><Arrow x1={140} y1={128} x2={90} y2={128} color={p.coral} w={4} /><L x={116} y={152} size={12} color={p.coral}>friction slows it down</L></G>;
    case 'water': return <G><Em x={150} y={68} size={52}>⛵</Em><Path d="M 20 114 q 20 -12 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0" fill="none" stroke="#4D96FF" strokeWidth={5} /><Arrow x1={210} y1={70} x2={280} y2={70} color={p.green} w={4} /><Arrow x1={110} y1={92} x2={50} y2={92} color={p.coral} w={4} /><L x={80} y={84} size={11.5} color={p.coral}>water pushes back</L></G>;
    case 'air': return <G><Em x={160} y={56} size={56}>🪂</Em><Arrow x1={112} y1={118} x2={112} y2={74} color={p.coral} w={4} /><Arrow x1={210} y1={74} x2={210} y2={118} color={p.green} w={4} /><L x={90} y={140} size={11.5} color={p.coral}>air pushes up</L><L x={232} y={140} size={11.5} color={p.green} anchor="middle">gravity pulls down</L></G>;
  }
}

function Classify({ s, p }: { s: Extract<SciSpec, { t: 'classify' }>; p: Palette }) {
  const n = s.groups.length;
  const w = 296 / n;
  return (
    <G>
      {s.groups.map((g, i) => (
        <G key={g.title}>
          <Rect x={12 + i * w + 3} y={10} width={w - 6} height={150} rx={12} fill="#fff" fillOpacity={p.dark ? 0.12 : 0.75} stroke={p.ink} strokeOpacity={0.25} strokeWidth={2} />
          <L x={12 + i * w + w / 2} y={30} size={12.5} color={p.ink}>{g.title}</L>
          {g.items.map((e, k) => <Em key={k} x={12 + i * w + w / 2} y={62 + k * 38} size={28}>{e}</Em>)}
        </G>
      ))}
    </G>
  );
}

function Legs({ s, p }: { s: Extract<SciSpec, { t: 'legs' }>; p: Palette }) {
  const per = s.n / 2;
  const legs: React.ReactNode[] = [];
  for (let side = 0; side < 2; side++) for (let i = 0; i < per; i++) {
    const dir = side ? 1 : -1;
    const y0 = 70 + i * (30 / Math.max(1, per - 1 || 1));
    const x1 = 160 + dir * 78, y1 = 40 + i * 28;
    legs.push(<Path key={`${side}${i}`} d={`M ${160 + dir * 14} ${y0 + 8} Q ${160 + dir * 50} ${y0 - 24} ${x1} ${y1 + 40}`} fill="none" stroke={p.ink} strokeWidth={3.5} strokeLinecap="round" />);
    legs.push(<Circle key={`c${side}${i}`} cx={x1} cy={y1 + 40} r={8} fill={p.orange} />);
    legs.push(<L key={`n${side}${i}`} x={x1} y={y1 + 44} size={10} color="#fff">{String(side * per + i + 1)}</L>);
  }
  return (
    <G>
      {legs}
      <Ellipse cx={160} cy={84} rx={20} ry={16} fill={p.ink} /><Circle cx={160} cy={62} r={10} fill={p.ink} />
      <Circle cx={156} cy={60} r={2.5} fill="#fff" /><Circle cx={164} cy={60} r={2.5} fill="#fff" />
      <L x={160} y={160} size={12} color={p.muted}>count the legs</L>
    </G>
  );
}

function Picture({ s, p }: { s: SciSpec; p: Palette }) {
  switch (s.t) {
    case 'row': return <Strip items={s.items} hi={s.hi} p={p} />;
    case 'chain': return <Strip items={s.items} arrows p={p} />;
    case 'cycle': return <Strip items={s.items} arrows loop hi={s.hi} p={p} />;
    case 'plant': return <Plant s={s} p={p} />;
    case 'states': return <States s={s} p={p} />;
    case 'circuit': return <Circuit s={s} p={p} />;
    case 'solar': return <Solar s={s} p={p} />;
    case 'daynight': return <DayNight p={p} />;
    case 'phases': return <Phases s={s} p={p} />;
    case 'orbit': return <Orbit p={p} />;
    case 'digestive': return <Digestive s={s} p={p} />;
    case 'teeth': return <Teeth s={s} p={p} />;
    case 'skeleton': return <Skeleton s={s} p={p} />;
    case 'heart': return <Heart p={p} />;
    case 'magnet': return <Magnet s={s} p={p} />;
    case 'reflect': return <Reflect p={p} />;
    case 'refract': return <Refract p={p} />;
    case 'shadow': return <Shadow p={p} />;
    case 'sound': return <Sound s={s} p={p} />;
    case 'thermo': return <Thermo s={s} p={p} />;
    case 'force': return <Force s={s} p={p} />;
    case 'classify': return <Classify s={s} p={p} />;
    case 'legs': return <Legs s={s} p={p} />;
  }
}

export default function SciVisual({ spec, wide, compact }: { spec: SciSpec; wide?: boolean; compact?: boolean }) {
  const p = usePalette();
  return (
    <Panel bg={p.greenSoft} wide={wide} compact={compact}>
      <Picture s={spec} p={p} />
    </Panel>
  );
}
void VW;
