import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import Svg, { G, Line, Polygon, Text as SText } from 'react-native-svg';
import { FONT, usePalette } from '../theme';

export const VW = 320;
export const VH = 170;

// The animated card that every picture sits in (pops in, then floats gently)
export function Panel({ bg, wide, compact, children }: { bg: string; wide?: boolean; compact?: boolean; children: React.ReactNode }) {
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
        backgroundColor: bg, overflow: 'hidden', opacity: pop,
        transform: [
          { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
          { translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) },
        ],
      }}
    >
      <View style={{ flex: 1 }}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet">{children}</Svg>
      </View>
    </Animated.View>
  );
}

export function L({ x, y, size = 13, color, children, anchor = 'middle' }: { x: number; y: number; size?: number; color: string; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end' }) {
  return <SText x={x} y={y} fontSize={size} fontWeight="bold" fontFamily={FONT.bold} fill={color} textAnchor={anchor}>{children}</SText>;
}

// An emoji centred on (x, y)
export function Em({ x, y, size, children, opacity = 1 }: { x: number; y: number; size: number; children: string; opacity?: number }) {
  return <SText x={x} y={y + size * 0.34} fontSize={size} textAnchor="middle" opacity={opacity}>{children}</SText>;
}

export function Arrow({ x1, y1, x2, y2, color, w = 3 }: { x1: number; y1: number; x2: number; y2: number; color: string; w?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 9;
  const p1 = `${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)}`;
  const p2 = `${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)}`;
  return (
    <G>
      <Line x1={x1} y1={y1} x2={x2 - 5 * Math.cos(a)} y2={y2 - 5 * Math.sin(a)} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <Polygon points={`${x2},${y2} ${p1} ${p2}`} fill={color} />
    </G>
  );
}

// split a label over at most two lines
export function wrap(text: string, max = 14): string[] {
  if (text.length <= max) return [text];
  const words = text.split(' ');
  let best = [text, ''];
  let diff = 1e9;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
    const d = Math.abs(a.length - b.length);
    if (d < diff) { diff = d; best = [a, b]; }
  }
  return best[1] ? best : [text];
}

export function useInk() {
  const p = usePalette();
  return p;
}
