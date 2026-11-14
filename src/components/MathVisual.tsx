import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SText } from 'react-native-svg';
import { FONT, Palette, usePalette } from '../theme';
import type { Viz } from '../mathViz';

const W = 320;
const H = 170;

// ---------- small building blocks ----------
function Thing({ x, y, cell, e, color, faded, cross, p }: { x: number; y: number; cell: number; e?: string; color: string; faded?: boolean; cross?: boolean; p: Palette }) {
  return (
    <G opacity={faded ? 0.28 : 1}>
      {e ? (
        <SText x={x} y={y + cell * 0.3} fontSize={cell * 0.82} textAnchor="middle">{e}</SText>
      ) : (
        <Circle cx={x} cy={y} r={cell * 0.4} fill={color} />
      )}
      {cross ? (
        <G>
          <Line x1={x - cell * 0.38} y1={y - cell * 0.38} x2={x + cell * 0.38} y2={y + cell * 0.38} stroke={p.coral} strokeWidth={3} strokeLinecap="round" />
          <Line x1={x + cell * 0.38} y1={y - cell * 0.38} x2={x - cell * 0.38} y2={y + cell * 0.38} stroke={p.coral} strokeWidth={3} strokeLinecap="round" />
        </G>
      ) : null}
    </G>
  );
}

const emojiIf = (n: number, e: string) => (n <= 24 && e ? e : undefined);

// tens rods / ones cubes / hundreds flats, drawn in a 40px tall box
function Blocks({ n, color, p }: { n: number; color: string; p: Palette }) {
  const h = Math.floor(n / 100);
  const t = Math.floor(n / 10) % 10;
  const o = n % 10;
  const els: React.ReactNode[] = [];
  let x = 0;
  for (let i = 0; i < h; i++) {
    els.push(<Rect key={`h${i}`} x={x} y={0} width={40} height={40} rx={3} fill={color} opacity={0.9} stroke={p.ink} strokeOpacity={0.25} />);
    for (let k = 1; k < 5; k++) {
      els.push(<Line key={`hv${i}${k}`} x1={x + k * 8} y1={0} x2={x + k * 8} y2={40} stroke="#fff" strokeOpacity={0.5} />);
      els.push(<Line key={`hh${i}${k}`} x1={x} y1={k * 8} x2={x + 40} y2={k * 8} stroke="#fff" strokeOpacity={0.5} />);
    }
    x += 44;
  }
  for (let i = 0; i < t; i++) {
    els.push(<Rect key={`t${i}`} x={x} y={0} width={9} height={40} rx={2} fill={color} stroke={p.ink} strokeOpacity={0.25} />);
    for (let k = 1; k < 10; k++) els.push(<Line key={`tl${i}${k}`} x1={x} y1={k * 4} x2={x + 9} y2={k * 4} stroke="#fff" strokeOpacity={0.55} />);
    x += 13;
  }
  if (o > 0) {
    if (t > 0 || h > 0) x += 4;
    for (let i = 0; i < o; i++) {
      els.push(<Rect key={`o${i}`} x={x + (i % 3) * 11} y={40 - 10 - Math.floor(i / 3) * 11} width={9} height={9} rx={2} fill={color} stroke={p.ink} strokeOpacity={0.25} />);
    }
    x += Math.min(o, 3) * 11;
  }
  return <G>{els}</G>;
}
const blocksWidth = (n: number) => {
  const h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10;
  return Math.max(10, h * 44 + t * 13 + (o ? Math.min(o, 3) * 11 + (t || h ? 4 : 0) : 0));
};

// ---------- the different pictures ----------
function OpPicture({ v, p }: { v: Extract<Viz, { t: 'op' }>; p: Palette }) {
  const { op, a, b } = v;
  // times tables: an array of rows and columns
  if (op === 'x') {
    const rows = a, cols = b;
    const cell = Math.min(28, 290 / cols, 150 / rows);
    const x0 = (W - cols * cell) / 2, y0 = (H - rows * cell) / 2;
    const e = a * b <= 30 ? v.e : undefined;
    const out: React.ReactNode[] = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push(<Thing key={`${r}-${c}`} x={x0 + c * cell + cell / 2} y={y0 + r * cell + cell / 2} cell={cell} e={e} color={r % 2 ? p.violet : p.orange} p={p} />);
    return <G>{out}</G>;
  }
  const small = a <= 20 && b <= 20 && a + b <= 20 + (op === '-' ? 20 : 0) && v.e;
  if (op === '-' && a <= 20 && v.e) {
    const cols = a > 10 ? 10 : a;
    const cell = Math.min(30, 300 / cols);
    const rows = Math.ceil(a / cols);
    const x0 = (W - cols * cell) / 2, y0 = (H - rows * cell) / 2;
    const out: React.ReactNode[] = [];
    for (let i = 0; i < a; i++) out.push(<Thing key={i} x={x0 + (i % cols) * cell + cell / 2} y={y0 + Math.floor(i / cols) * cell + cell / 2} cell={cell} e={v.e} color={p.green} faded={i >= a - b} cross={i >= a - b} p={p} />);
    return <G>{out}</G>;
  }
  if (op === '+' && small) {
    const cell = 26;
    const group = (n: number, xMid: number, color: string) => {
      const cols = Math.min(n, 5), rows = Math.ceil(n / 5);
      const x0 = xMid - (cols * cell) / 2, y0 = (H - rows * cell) / 2;
      return Array.from({ length: n }, (_, i) => <Thing key={`${xMid}-${i}`} x={x0 + (i % 5) * cell + cell / 2} y={y0 + Math.floor(i / 5) * cell + cell / 2} cell={cell} e={emojiIf(n, v.e)} color={color} p={p} />);
    };
    return (
      <G>
        {group(a, 80, p.orange)}
        <SText x={160} y={H / 2 + 12} fontSize={38} fontWeight="bold" fontFamily={FONT.bold} fill={p.ink} textAnchor="middle">+</SText>
        {group(b, 240, p.violet)}
      </G>
    );
  }
  // bigger numbers: place-value blocks
  const wa = blocksWidth(a), wb = blocksWidth(b);
  const sign = 34;
  const total = wa + wb + sign;
  const s = Math.min(1.5, (W - 20) / total);
  const ox = (W - total * s) / 2;
  const oy = (H - 40 * s) / 2 - 8;
  return (
    <G>
      <G transform={`translate(${ox} ${oy}) scale(${s})`}><Blocks n={a} color={p.sky} p={p} /></G>
      <SText x={ox + (wa + sign / 2) * s} y={oy + 28 * s} fontSize={30 * s} fontWeight="bold" fontFamily={FONT.bold} fill={p.ink} textAnchor="middle">{op === '+' ? '+' : '−'}</SText>
      <G transform={`translate(${ox + (wa + sign) * s} ${oy}) scale(${s})`}><Blocks n={b} color={op === '+' ? p.orange : p.coral} p={p} /></G>
      <SText x={ox + (wa * s) / 2} y={oy + 40 * s + 18} fontSize={15} fontWeight="bold" fontFamily={FONT.bold} fill={p.ink} textAnchor="middle">{a}</SText>
      <SText x={ox + (wa + sign) * s + (wb * s) / 2} y={oy + 40 * s + 18} fontSize={15} fontWeight="bold" fontFamily={FONT.bold} fill={p.ink} textAnchor="middle">{b}</SText>
    </G>
  );
}

function GroupsPicture({ v, p }: { v: Extract<Viz, { t: 'groups' }>; p: Palette }) {
  const total = v.parts + (v.rem ? 1 : 0);
  const bc = Math.min(total, 5);
  const br = Math.ceil(total / bc);
  const gap = 8;
  const bw = (W - 16 - (bc - 1) * gap) / bc;
  const bh = (H - 16 - (br - 1) * gap) / br;
  const maxPer = Math.max(v.per, v.rem);
  // pick the number of columns that makes the items as big as possible
  let ic = 1;
  let cell = 0;
  for (let c = 1; c <= Math.max(1, Math.min(maxPer, 10)); c++) {
    const cs = Math.min(30, (bw - 8) / c, (bh - 8) / Math.ceil(maxPer / c));
    if (cs > cell) { cell = cs; ic = c; }
  }
  const e = v.parts * v.per <= 24 ? v.e : undefined;
  const boxes: React.ReactNode[] = [];
  for (let g = 0; g < total; g++) {
    const isRem = g >= v.parts;
    const n = isRem ? v.rem : v.per;
    const x = 8 + (g % bc) * (bw + gap);
    const y = 8 + Math.floor(g / bc) * (bh + gap);
    const shaded = !isRem && g < v.shade;
    const cols = Math.min(n, ic);
    const rows = Math.ceil(n / ic);
    const ix = x + (bw - cols * cell) / 2;
    const iy = y + (bh - rows * cell) / 2;
    boxes.push(
      <G key={g}>
        <Rect x={x} y={y} width={bw} height={bh} rx={10} fill={shaded ? p.orange : '#fff'} fillOpacity={shaded ? 0.35 : p.dark ? 0.12 : 0.75} stroke={shaded ? p.orange : p.violet} strokeWidth={2} strokeDasharray={isRem ? '5 4' : undefined} />
        {Array.from({ length: n }, (_, i) => (
          <Thing key={i} x={ix + (i % ic) * cell + cell / 2} y={iy + Math.floor(i / ic) * cell + cell / 2} cell={cell} e={e} color={shaded ? p.orange : p.violet} p={p} />
        ))}
      </G>,
    );
  }
  return <G>{boxes}</G>;
}

function BarPicture({ v, p }: { v: Extract<Viz, { t: 'bar' }>; p: Palette }) {
  const bar = (parts: number, shade: number, y: number, label: string) => {
    const w = 280 / parts;
    return (
      <G key={y}>
        {Array.from({ length: parts }, (_, i) => (
          <Rect key={i} x={20 + i * w} y={y} width={w} height={46} fill={i < shade ? p.orange : '#fff'} fillOpacity={i < shade ? 0.85 : p.dark ? 0.15 : 0.8} stroke={p.ink} strokeOpacity={0.45} strokeWidth={2} rx={i === 0 || i === parts - 1 ? 8 : 0} />
        ))}
        <SText x={160} y={y + 64} fontSize={15} fontWeight="bold" fontFamily={FONT.bold} fill={p.ink} textAnchor="middle">{label}</SText>
      </G>
    );
  };
  if (v.second) return <G>{bar(v.parts, v.shade, 14, `${v.shade}/${v.parts}`)}{bar(v.second, 0, 96, `?/${v.second}`)}</G>;
  return <G>{bar(v.parts, v.shade, 55, `${v.parts} equal parts`)}</G>;
}

function StepsPicture({ v, p }: { v: Extract<Viz, { t: 'steps' }>; p: Palette }) {
  const pts = v.first ? [NaN, ...v.known] : [...v.known, NaN];
  const n = pts.length;
  const xs = pts.map((_, i) => 30 + (i * 260) / (n - 1));
  return (
    <G>
      <Line x1={14} y1={110} x2={306} y2={110} stroke={p.ink} strokeWidth={3} strokeLinecap="round" />
      {pts.map((val, i) => (
        <G key={i}>
          <Line x1={xs[i]} y1={102} x2={xs[i]} y2={118} stroke={p.ink} strokeWidth={3} />
          <Circle cx={xs[i]} cy={110} r={5} fill={Number.isNaN(val) ? p.coral : p.violet} />
          <SText x={xs[i]} y={140} fontSize={17} fontWeight="bold" fontFamily={FONT.bold} fill={Number.isNaN(val) ? p.coral : p.ink} textAnchor="middle">{Number.isNaN(val) ? '?' : String(val)}</SText>
          {i < n - 1 ? (
            <G>
              <Path d={`M ${xs[i]} 104 Q ${(xs[i] + xs[i + 1]) / 2} 40 ${xs[i + 1]} 104`} fill="none" stroke={p.orange} strokeWidth={3} strokeLinecap="round" />
              <SText x={(xs[i] + xs[i + 1]) / 2} y={52} fontSize={14} fontWeight="bold" fontFamily={FONT.bold} fill={p.orange} textAnchor="middle">{`+${v.step}`}</SText>
            </G>
          ) : null}
        </G>
      ))}
    </G>
  );
}

function PolygonPicture({ v, p }: { v: Extract<Viz, { t: 'polygon' }>; p: Palette }) {
  const cx = 160, cy = 85, r = 66;
  const pts = Array.from({ length: v.sides }, (_, i) => {
    const ang = (-90 + (360 / v.sides) * i + (v.sides === 4 ? 45 : 0)) * (Math.PI / 180);
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)] as const;
  });
  return (
    <G>
      <Polygon points={pts.map((q) => q.join(',')).join(' ')} fill={p.violet} fillOpacity={0.3} stroke={p.violet} strokeWidth={4} strokeLinejoin="round" />
      {pts.map((q, i) => <Circle key={i} cx={q[0]} cy={q[1]} r={6} fill={p.orange} />)}
    </G>
  );
}

function ClockPicture({ v, p }: { v: Extract<Viz, { t: 'clock' }>; p: Palette }) {
  const cx = 160, cy = 85, r = 72;
  const pos = (deg: number, len: number) => [cx + len * Math.sin((deg * Math.PI) / 180), cy - len * Math.cos((deg * Math.PI) / 180)] as const;
  const hAng = ((v.h % 12) + v.m / 60) * 30;
  const mAng = v.m * 6;
  const hp = pos(hAng, 36), mp = pos(mAng, 56);
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} fill="#fff" fillOpacity={p.dark ? 0.9 : 1} stroke={p.ink} strokeWidth={5} />
      {Array.from({ length: 12 }, (_, i) => {
        const q = pos((i + 1) * 30, r - 14);
        return <SText key={i} x={q[0]} y={q[1] + 5} fontSize={14} fontWeight="bold" fontFamily={FONT.bold} fill="#2D2A4A" textAnchor="middle">{i + 1}</SText>;
      })}
      <Line x1={cx} y1={cy} x2={hp[0]} y2={hp[1]} stroke="#2D2A4A" strokeWidth={6} strokeLinecap="round" />
      <Line x1={cx} y1={cy} x2={mp[0]} y2={mp[1]} stroke={p.coral} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={cx} cy={cy} r={5} fill="#2D2A4A" />
    </G>
  );
}

function RectPicture({ v, p }: { v: Extract<Viz, { t: 'rect' }>; p: Palette }) {
  const cell = Math.min(24, 230 / v.l, 100 / v.w);
  const w = v.l * cell, h = v.w * cell;
  const x0 = (W - w) / 2, y0 = (H - h) / 2 - 4;
  const out: React.ReactNode[] = [];
  for (let r = 0; r < v.w; r++) for (let c = 0; c < v.l; c++) out.push(<Rect key={`${r}-${c}`} x={x0 + c * cell} y={y0 + r * cell} width={cell} height={cell} fill={p.green} fillOpacity={0.35} stroke={p.green} strokeWidth={1.5} />);
  return (
    <G>
      {out}
      <SText x={x0 + w / 2} y={y0 - 6} fontSize={14} fontWeight="bold" fontFamily={FONT.bold} fill={p.ink} textAnchor="middle">{`${v.l} cm`}</SText>
      <SText x={x0 + w + 8} y={y0 + h / 2 + 5} fontSize={14} fontWeight="bold" fontFamily={FONT.bold} fill={p.ink} textAnchor="start">{`${v.w} cm`}</SText>
    </G>
  );
}

function PlacePicture({ v, p }: { v: Extract<Viz, { t: 'place' }>; p: Palette }) {
  const w = blocksWidth(v.n);
  const s = Math.min(2.2, 280 / w);
  return (
    <G transform={`translate(${(W - w * s) / 2} ${(H - 40 * s) / 2}) scale(${s})`}>
      <Blocks n={v.n} color={p.sky} p={p} />
    </G>
  );
}

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const Label = ({ x, y, size = 16, color, children, anchor = 'middle' }: { x: number; y: number; size?: number; color: string; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end' }) => (
  <SText x={x} y={y} fontSize={size} fontWeight="bold" fontFamily={FONT.bold} fill={color} textAnchor={anchor}>{children}</SText>
);

// bar models: part-whole for big sums, subtractions and divisions
function PartPicture({ v, p }: { v: Extract<Viz, { t: 'part' }>; p: Palette }) {
  const box = (x: number, y: number, w: number, label: string, fill: string, unknown = false) => (
    <G key={`${x}-${y}`}>
      <Rect x={x} y={y} width={w} height={44} rx={8} fill={fill} fillOpacity={unknown ? 0.15 : 0.9} stroke={unknown ? p.coral : p.ink} strokeOpacity={unknown ? 1 : 0.3} strokeWidth={unknown ? 3 : 1.5} strokeDasharray={unknown ? '6 4' : undefined} />
      <Label x={x + w / 2} y={y + 29} size={label.length > 7 ? 14 : 19} color={unknown ? p.coral : '#fff'}>{label}</Label>
    </G>
  );
  const X0 = 20, TW = 280;
  if (v.kind === 'add') {
    const wa = Math.max(70, Math.min(TW - 70, (TW * v.a) / (v.a + v.b)));
    return (
      <G>
        {box(X0, 16, wa - 3, fmt(v.a), p.sky)}{box(X0 + wa, 16, TW - wa, fmt(v.b), p.orange)}
        <Path d={`M ${X0} 74 L ${X0} 84 L ${X0 + TW} 84 L ${X0 + TW} 74`} fill="none" stroke={p.ink} strokeOpacity={0.5} strokeWidth={3} />
        {box(X0, 98, TW, '?', p.coral, true)}
        <Label x={160} y={162} size={13} color={p.muted}>put the parts together</Label>
      </G>
    );
  }
  if (v.kind === 'sub') {
    const wb = Math.max(70, Math.min(TW - 70, (TW * v.b) / v.a));
    return (
      <G>
        {box(X0, 16, TW, fmt(v.a), p.sky)}
        <Path d={`M ${X0} 74 L ${X0} 84 L ${X0 + TW} 84 L ${X0 + TW} 74`} fill="none" stroke={p.ink} strokeOpacity={0.5} strokeWidth={3} />
        {box(X0, 98, wb - 3, fmt(v.b), p.orange)}{box(X0 + wb, 98, TW - wb, '?', p.coral, true)}
        <Label x={160} y={162} size={13} color={p.muted}>whole − known part = missing part</Label>
      </G>
    );
  }
  const d = v.b;
  const w = TW / d;
  return (
    <G>
      {box(X0, 16, TW, fmt(v.a), p.sky)}
      {Array.from({ length: d }, (_, i) => (
        <G key={i}>
          <Rect x={X0 + i * w + 1} y={98} width={w - 2} height={44} rx={7} fill={p.coral} fillOpacity={0.15} stroke={p.coral} strokeWidth={2.5} strokeDasharray="5 3" />
          <Label x={X0 + i * w + w / 2} y={126} size={d > 8 ? 13 : 18} color={p.coral}>?</Label>
        </G>
      ))}
      <Label x={160} y={163} size={13} color={p.muted}>{`share into ${d} equal parts`}</Label>
    </G>
  );
}

// area model for multiplying
function AreaPicture({ v, p }: { v: Extract<Viz, { t: 'area' }>; p: Palette }) {
  const digits: number[] = [];
  const h = Math.floor(v.a / 100), t = Math.floor(v.a / 10) % 10, o = v.a % 10;
  if (h) digits.push(h * 100);
  if (t) digits.push(t * 10);
  if (o) digits.push(o);
  const raw = digits.map((d) => Math.max(0.35, d / v.a));
  const sum = raw.reduce((x, y) => x + y, 0);
  const widths = raw.map((r) => (r / sum) * 270);
  const colors = [p.sky, p.orange, p.green];
  let x = 25;
  return (
    <G>
      {digits.map((d, i) => {
        const w = widths[i];
        const el = (
          <G key={i}>
            <Label x={x + w / 2} y={30} size={15} color={p.ink}>{String(d)}</Label>
            <Rect x={x} y={40} width={w - 2} height={84} rx={8} fill={colors[i % 3]} fillOpacity={0.85} />
            <Label x={x + w / 2} y={88} size={w < 55 ? 13 : 16} color="#fff">{`${d}×${v.b}`}</Label>
          </G>
        );
        x += w;
        return el;
      })}
      <Label x={14} y={86} size={16} color={p.ink} anchor="middle">{String(v.b)}</Label>
      <Label x={160} y={152} size={13} color={p.muted}>split the number, multiply each part, add</Label>
    </G>
  );
}

function PercentPicture({ v, p }: { v: Extract<Viz, { t: 'percent' }>; p: Palette }) {
  const X0 = 20, TW = 280;
  return (
    <G>
      <Label x={160} y={34} size={17} color={p.ink}>{`100% = ${fmt(v.n)}`}</Label>
      <Rect x={X0} y={56} width={TW} height={44} rx={8} fill="#fff" fillOpacity={p.dark ? 0.15 : 0.85} stroke={p.ink} strokeOpacity={0.4} strokeWidth={2} />
      <Rect x={X0} y={56} width={(TW * v.p) / 100} height={44} rx={8} fill={p.orange} fillOpacity={0.9} />
      {Array.from({ length: 9 }, (_, i) => <Line key={i} x1={X0 + ((i + 1) * TW) / 10} y1={56} x2={X0 + ((i + 1) * TW) / 10} y2={100} stroke={p.ink} strokeOpacity={0.3} />)}
      <Label x={X0} y={124} size={13} color={p.muted} anchor="start">0%</Label>
      <Label x={X0 + TW} y={124} size={13} color={p.muted} anchor="end">100%</Label>
      <Label x={Math.min(X0 + TW - 20, Math.max(X0 + 22, X0 + (TW * v.p) / 100))} y={146} size={16} color={p.orange}>{`${v.p}% = ?`}</Label>
    </G>
  );
}

// balance scale for missing-number sums
function BalancePicture({ v, p }: { v: Extract<Viz, { t: 'balance' }>; p: Palette }) {
  const pan = (cx: number) => (
    <G key={cx}>
      <Path d={`M ${cx - 52} 112 Q ${cx} 142 ${cx + 52} 112 Z`} fill={p.ink} fillOpacity={0.55} />
      <Line x1={cx - 52} y1={112} x2={160} y2={50} stroke={p.ink} strokeOpacity={0.4} strokeWidth={2} />
      <Line x1={cx + 52} y1={112} x2={160} y2={50} stroke={p.ink} strokeOpacity={0.4} strokeWidth={2} />
    </G>
  );
  const items = (cx: number, boxes: number, dots: number) => {
    const out: React.ReactNode[] = [];
    const total = boxes + dots;
    const cols = total <= 8 ? Math.min(4, Math.max(1, total)) : 6;
    const cell = total <= 8 ? 22 : 17;
    const rows = Math.ceil(total / cols);
    const x0 = cx - (cols * cell) / 2, y0 = 108 - rows * cell;
    for (let i = 0; i < total; i++) {
      const x = x0 + (i % cols) * cell + cell / 2, y = y0 + Math.floor(i / cols) * cell + cell / 2;
      out.push(i < boxes
        ? <G key={i}><Rect x={x - 9} y={y - 9} width={18} height={18} rx={4} fill={p.coral} /><Label x={x} y={y + 5} size={12} color="#fff">{v.boxes > 1 ? 'x' : '?'}</Label></G>
        : <Circle key={i} cx={x} cy={y} r={total <= 8 ? 8 : 6.5} fill={p.violet} />);
    }
    return out;
  };
  const rightIsDots = v.right <= 18;
  return (
    <G>
      <Path d="M 160 50 L 144 148 L 176 148 Z" fill={p.ink} fillOpacity={0.35} />
      <Line x1={60} y1={52} x2={260} y2={52} stroke={p.ink} strokeWidth={5} strokeLinecap="round" />
      {pan(80)}{pan(240)}
      {items(80, v.boxes, v.dots)}
      {rightIsDots ? items(240, 0, v.right) : null}
      {!rightIsDots ? <Label x={240} y={96} size={26} color={p.ink}>{String(v.right)}</Label> : null}
      <Label x={160} y={30} size={13} color={p.muted}>both sides are equal</Label>
    </G>
  );
}

function TriPicture({ v, p }: { v: Extract<Viz, { t: 'tri' }>; p: Palette }) {
  if (v.equal) {
    return (
      <G>
        <Polygon points="160,24 244,134 76,134" fill={p.green} fillOpacity={0.3} stroke={p.green} strokeWidth={4} strokeLinejoin="round" />
        <Label x={160} y={156} size={15} color={p.ink}>{`${v.base} cm`}</Label>
        <Label x={96} y={72} size={15} color={p.ink}>{`${v.base} cm`}</Label>
        <Label x={226} y={72} size={15} color={p.ink}>{`${v.base} cm`}</Label>
      </G>
    );
  }
  return (
    <G>
      <Polygon points="190,24 250,134 70,134" fill={p.green} fillOpacity={0.3} stroke={p.green} strokeWidth={4} strokeLinejoin="round" />
      <Line x1={190} y1={24} x2={190} y2={134} stroke={p.ink} strokeWidth={2} strokeDasharray="5 4" />
      <Path d="M 190 122 L 202 122 L 202 134" fill="none" stroke={p.ink} strokeWidth={2} />
      <Label x={160} y={158} size={15} color={p.ink}>{`base ${v.base} cm`}</Label>
      <Label x={196} y={84} size={15} color={p.ink} anchor="start">{`height ${v.height} cm`}</Label>
    </G>
  );
}

function RoundPicture({ v, p }: { v: Extract<Viz, { t: 'round' }>; p: Palette }) {
  const lo = Math.floor(v.n / v.unit) * v.unit, hi = lo + v.unit;
  const frac = (v.n - lo) / v.unit;
  const x = 30 + 260 * frac;
  const nearHi = frac >= 0.5;
  return (
    <G>
      <Line x1={30} y1={100} x2={290} y2={100} stroke={p.ink} strokeWidth={4} strokeLinecap="round" />
      {[0, 0.5, 1].map((f) => <Line key={f} x1={30 + 260 * f} y1={90} x2={30 + 260 * f} y2={110} stroke={p.ink} strokeWidth={3} />)}
      <Label x={30} y={134} size={16} color={!nearHi ? p.green : p.ink}>{fmt(lo)}</Label>
      <Label x={290} y={134} size={16} color={nearHi ? p.green : p.ink}>{fmt(hi)}</Label>
      <Label x={160} y={134} size={12} color={p.muted}>halfway</Label>
      <Path d={`M ${x} 92 L ${x - 8} 70 L ${x + 8} 70 Z`} fill={p.coral} />
      <Label x={Math.min(260, Math.max(60, x))} y={56} size={17} color={p.coral}>{fmt(v.n)}</Label>
      <Label x={160} y={24} size={14} color={p.muted}>which end is it closer to?</Label>
    </G>
  );
}

function CoinsPicture({ v, p }: { v: Extract<Viz, { t: 'coins' }>; p: Palette }) {
  const n = v.items.length;
  const r = Math.min(30, 118 / n);
  const gap = v.op === 'x' ? 6 : 52;
  const total = n * 2 * r + (n - 1) * gap;
  let x = (W - total) / 2 + r;
  const out: React.ReactNode[] = [];
  v.items.forEach((amt, i) => {
    out.push(
      <G key={i}>
        <Circle cx={x} cy={85} r={r} fill="#F5B301" stroke="#B07D00" strokeWidth={3} />
        <Circle cx={x} cy={85} r={r - 6} fill="none" stroke="#B07D00" strokeOpacity={0.5} strokeWidth={1.5} />
        <Label x={x} y={90} size={Math.max(12, r * 0.6)} color="#5A3E00">{`${amt}p`}</Label>
      </G>,
    );
    if (i < n - 1 && v.op !== 'x') out.push(<Label key={`o${i}`} x={x + r + gap / 2} y={96} size={32} color={p.ink}>{v.op === '+' ? '+' : '−'}</Label>);
    x += 2 * r + gap;
  });
  return <G>{out}</G>;
}

function ComparePicture({ v, p }: { v: Extract<Viz, { t: 'compare' }>; p: Palette }) {
  const max = Math.max(v.a, v.b);
  const bar = (y: number, val: number, label: string, color: string) => (
    <G key={y}>
      <Label x={20} y={y - 6} size={14} color={p.ink} anchor="start">{`${label}: ${val}`}</Label>
      <Rect x={20} y={y} width={(280 * val) / max} height={34} rx={8} fill={color} fillOpacity={0.9} />
    </G>
  );
  return (
    <G>
      {bar(34, v.a, v.la, p.coral)}
      {bar(106, v.b, v.lb, p.sky)}
      <Label x={160} y={162} size={13} color={p.muted}>how much longer is the longer bar?</Label>
    </G>
  );
}

function PictogramPicture({ v, p }: { v: Extract<Viz, { t: 'pictogram' }>; p: Palette }) {
  const cell = 40;
  const cols = Math.min(5, v.count);
  const rows = Math.ceil(v.count / 5);
  const x0 = (W - cols * cell) / 2, y0 = 20;
  return (
    <G>
      {Array.from({ length: v.count }, (_, i) => (
        <SText key={i} x={x0 + (i % 5) * cell + cell / 2} y={y0 + Math.floor(i / 5) * cell + 30} fontSize={32} textAnchor="middle">⭐</SText>
      ))}
      <Label x={160} y={Math.min(156, y0 + rows * cell + 28)} size={15} color={p.ink}>{`each ⭐ = ${v.each} children`}</Label>
    </G>
  );
}

function CoordPicture({ v, p }: { v: Extract<Viz, { t: 'coord' }>; p: Palette }) {
  const ex = v.x + v.dx, ey = v.y + v.dy;
  const maxX = ex + 1, maxY = ey + 1;
  const cell = Math.min(240 / maxX, 128 / maxY, 26);
  const ox = 44, oy = 148; // origin (bottom-left)
  const px = (x: number) => ox + x * cell;
  const py = (y: number) => oy - y * cell;
  return (
    <G>
      {Array.from({ length: maxX + 1 }, (_, i) => <Line key={`x${i}`} x1={px(i)} y1={py(0)} x2={px(i)} y2={py(maxY)} stroke={p.ink} strokeOpacity={i === 0 ? 0.8 : 0.15} strokeWidth={i === 0 ? 2.5 : 1} />)}
      {Array.from({ length: maxY + 1 }, (_, i) => <Line key={`y${i}`} x1={px(0)} y1={py(i)} x2={px(maxX)} y2={py(i)} stroke={p.ink} strokeOpacity={i === 0 ? 0.8 : 0.15} strokeWidth={i === 0 ? 2.5 : 1} />)}
      {Array.from({ length: maxX + 1 }, (_, i) => <Label key={`lx${i}`} x={px(i)} y={oy + 14} size={10} color={p.muted}>{String(i)}</Label>)}
      {Array.from({ length: maxY + 1 }, (_, i) => <Label key={`ly${i}`} x={ox - 9} y={py(i) + 4} size={10} color={p.muted}>{String(i)}</Label>)}
      <Path d={`M ${px(v.x)} ${py(v.y)} L ${px(ex)} ${py(v.y)} L ${px(ex)} ${py(ey)}`} fill="none" stroke={p.orange} strokeWidth={3} strokeDasharray="6 4" strokeLinecap="round" />
      <Circle cx={px(v.x)} cy={py(v.y)} r={7} fill={p.violet} />
      <Circle cx={px(ex)} cy={py(ey)} r={8} fill={p.coral} />
      <Label x={px(ex) + 14} y={py(ey) + 5} size={15} color={p.coral} anchor="start">?</Label>
      <Label x={(px(v.x) + px(ex)) / 2} y={py(v.y) - 8} size={12} color={p.orange}>{`${v.dx} right`}</Label>
      <Label x={px(ex) + 8} y={(py(v.y) + py(ey)) / 2} size={12} color={p.orange} anchor="start">{`${v.dy} up`}</Label>
    </G>
  );
}

function Picture({ v, p }: { v: Viz; p: Palette }) {
  switch (v.t) {
    case 'op': return <OpPicture v={v} p={p} />;
    case 'groups': return <GroupsPicture v={v} p={p} />;
    case 'bar': return <BarPicture v={v} p={p} />;
    case 'steps': return <StepsPicture v={v} p={p} />;
    case 'polygon': return <PolygonPicture v={v} p={p} />;
    case 'clock': return <ClockPicture v={v} p={p} />;
    case 'rect': return <RectPicture v={v} p={p} />;
    case 'place': return <PlacePicture v={v} p={p} />;
    case 'part': return <PartPicture v={v} p={p} />;
    case 'area': return <AreaPicture v={v} p={p} />;
    case 'percent': return <PercentPicture v={v} p={p} />;
    case 'balance': return <BalancePicture v={v} p={p} />;
    case 'tri': return <TriPicture v={v} p={p} />;
    case 'round': return <RoundPicture v={v} p={p} />;
    case 'coins': return <CoinsPicture v={v} p={p} />;
    case 'compare': return <ComparePicture v={v} p={p} />;
    case 'pictogram': return <PictogramPicture v={v} p={p} />;
    case 'coord': return <CoordPicture v={v} p={p} />;
  }
}

// The animated panel that replaces the plain emoji on Maths questions
export default function MathVisual({ viz, wide, compact }: { viz: Viz; wide?: boolean; compact?: boolean }) {
  const p = usePalette();
  const [pop] = useState(() => new Animated.Value(0));
  const [bob] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Animated.View
      style={{
        alignSelf: wide ? 'center' : 'stretch', width: wide ? 320 : undefined, maxWidth: 380, height: compact ? 128 : 170, borderRadius: 22,
        backgroundColor: p.orangeSoft, overflow: 'hidden', opacity: pop,
        transform: [
          { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
          { translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) },
        ],
      }}
    >
      <View style={{ flex: 1 }}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <Picture v={viz} p={p} />
        </Svg>
      </View>
    </Animated.View>
  );
}
