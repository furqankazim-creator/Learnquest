import React from 'react';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Polygon, Rect, Stop, Text as SText } from 'react-native-svg';
import { FONT } from '../theme';

export type IconName =
  | 'balloon' | 'rescue' | 'match' | 'quick' | 'mission'
  | 'home' | 'games' | 'rewards' | 'parent'
  | 'english' | 'maths' | 'science' | 'mixed';

const grad = (id: string, a: string, b: string) => (
  <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <Stop offset="0" stopColor={a} />
    <Stop offset="1" stopColor={b} />
  </LinearGradient>
);

// All icons are drawn on a 64 x 64 canvas in the same rounded, glossy style as the owl logo.
function Art({ name }: { name: IconName }) {
  switch (name) {
    case 'balloon':
      return (
        <G>
          <Defs>{grad('bR', '#FF8A8A', '#E83A3A')}{grad('bB', '#7DB4FF', '#3B7CE8')}</Defs>
          <Path d="M40 36 Q42 52 36 60" stroke="#6B6890" strokeWidth={2} fill="none" strokeLinecap="round" />
          <Ellipse cx={42} cy={22} rx={13} ry={16} fill="url(#bB)" />
          <Path d="M42 38 l-3 5 h6 z" fill="#3B7CE8" />
          <Path d="M24 40 Q22 54 28 62" stroke="#6B6890" strokeWidth={2} fill="none" strokeLinecap="round" />
          <Ellipse cx={24} cy={26} rx={16} ry={19} fill="url(#bR)" />
          <Path d="M24 45 l-4 6 h8 z" fill="#E83A3A" />
          <Ellipse cx={17} cy={19} rx={4} ry={7} fill="#fff" fillOpacity={0.45} transform="rotate(20 17 19)" />
          <Ellipse cx={37} cy={15} rx={2.5} ry={4.5} fill="#fff" fillOpacity={0.45} transform="rotate(20 37 15)" />
        </G>
      );
    case 'rescue':
      return (
        <G>
          <Defs>{grad('rS', '#6FA8FF', '#2F63D8')}{grad('rG', '#FFE27A', '#F5A800')}</Defs>
          <Path d="M10 22 L32 6 L54 22 L50 46 Q32 62 14 46 Z" fill="#E83A3A" />
          <Path d="M14 22 L32 9 L50 22 L47 44 Q32 58 17 44 Z" fill="url(#rS)" />
          <Path d="M32 9 L50 22 L47 44 Q41 49 32 54 Z" fill="#000" fillOpacity={0.12} />
          <Polygon points="32,20 36,29 46,30 38,36 41,46 32,40 23,46 26,36 18,30 28,29" fill="url(#rG)" stroke="#C98400" strokeWidth={1.5} strokeLinejoin="round" />
          <Path d="M20 14 Q26 11 30 11" stroke="#fff" strokeOpacity={0.5} strokeWidth={3} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'match':
      return (
        <G>
          <Defs>{grad('mG', '#5BEAA7', '#14B870')}{grad('mO', '#FFB46B', '#F57A1F')}</Defs>
          <Rect x={28} y={24} width={30} height={34} rx={6} fill="url(#mO)" />
          <Circle cx={43} cy={58} r={6} fill="url(#mO)" />
          <Rect x={32} y={28} width={10} height={5} rx={2.5} fill="#fff" fillOpacity={0.4} />
          <Rect x={6} y={12} width={30} height={34} rx={6} fill="url(#mG)" />
          <Circle cx={36} cy={29} r={7} fill="url(#mG)" />
          <Circle cx={21} cy={12} r={6} fill="url(#mG)" />
          <Rect x={10} y={17} width={10} height={5} rx={2.5} fill="#fff" fillOpacity={0.4} />
        </G>
      );
    case 'quick':
      return (
        <G>
          <Defs>{grad('qB', '#FFE27A', '#FF9A1F')}{grad('qC', '#8F7BFF', '#5B45E8')}</Defs>
          <Circle cx={32} cy={32} r={27} fill="url(#qC)" />
          <Circle cx={32} cy={32} r={22} fill="#fff" fillOpacity={0.12} />
          <Polygon points="36,6 16,36 29,36 25,58 48,26 34,26" fill="url(#qB)" stroke="#C26A00" strokeWidth={2} strokeLinejoin="round" />
          <Path d="M30 14 L21 30" stroke="#fff" strokeOpacity={0.6} strokeWidth={2.5} strokeLinecap="round" />
        </G>
      );
    case 'mission':
      return (
        <G>
          <Defs>{grad('xM', '#FFF3C4', '#F5D77A')}</Defs>
          <Path d="M4 14 L22 8 L42 14 L60 8 V50 L42 56 L22 50 L4 56 Z" fill="url(#xM)" stroke="#B98A2E" strokeWidth={2} strokeLinejoin="round" />
          <Line x1={22} y1={8} x2={22} y2={50} stroke="#B98A2E" strokeOpacity={0.5} strokeWidth={1.5} />
          <Line x1={42} y1={14} x2={42} y2={56} stroke="#B98A2E" strokeOpacity={0.5} strokeWidth={1.5} />
          <Path d="M10 44 Q18 28 28 36 T52 20" stroke="#4D96FF" strokeWidth={3} fill="none" strokeDasharray="5 4" strokeLinecap="round" />
          <Path d="M48 14 l8 8 M56 14 l-8 8" stroke="#E83A3A" strokeWidth={4} strokeLinecap="round" />
          <Circle cx={10} cy={44} r={3.5} fill="#4D96FF" />
        </G>
      );
    case 'home':
      return (
        <G>
          <Defs>{grad('hR', '#FF8A8A', '#E03C3C')}{grad('hW', '#FFF6E0', '#F7DFA8')}</Defs>
          <Rect x={13} y={28} width={38} height={28} rx={4} fill="url(#hW)" />
          <Polygon points="32,5 7,29 57,29" fill="url(#hR)" />
          <Rect x={42} y={9} width={7} height={14} rx={1.5} fill="#B8432F" />
          <Rect x={27} y={38} width={11} height={18} rx={3} fill="#4D96FF" />
          <Circle cx={35.5} cy={48} r={1.2} fill="#FFE27A" />
          <Rect x={16} y={34} width={8} height={8} rx={2} fill="#9ED8FF" stroke="#fff" strokeWidth={1.5} />
          <Rect x={42} y={34} width={6} height={8} rx={2} fill="#9ED8FF" stroke="#fff" strokeWidth={1.5} />
        </G>
      );
    case 'games':
      return (
        <G>
          <Defs>{grad('gP', '#A08CFF', '#6246E0')}</Defs>
          <Path d="M12 22 Q6 22 5 38 Q4 52 12 52 Q18 52 22 44 H42 Q46 52 52 52 Q60 52 59 38 Q58 22 52 22 Z" fill="url(#gP)" />
          <Path d="M12 25 H52" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
          <Rect x={16} y={32} width={14} height={5} rx={2} fill="#fff" />
          <Rect x={20.5} y={27.5} width={5} height={14} rx={2} fill="#fff" />
          <Circle cx={44} cy={30} r={3.4} fill="#FFC93C" /><Circle cx={51} cy={36} r={3.4} fill="#FF6B6B" />
          <Circle cx={44} cy={42} r={3.4} fill="#1DB954" /><Circle cx={37} cy={36} r={3.4} fill="#4D96FF" />
        </G>
      );
    case 'rewards':
      return (
        <G>
          <Defs>{grad('tG', '#FFE27A', '#F0A500')}</Defs>
          <Path d="M16 14 H8 Q8 30 22 32" stroke="#E09A00" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M48 14 H56 Q56 30 42 32" stroke="#E09A00" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M16 8 H48 V24 Q48 40 32 42 Q16 40 16 24 Z" fill="url(#tG)" />
          <Rect x={29} y={40} width={6} height={10} fill="#E09A00" />
          <Rect x={20} y={50} width={24} height={7} rx={3} fill="#8D5A34" />
          <Polygon points="32,15 34,21 40,21.5 35.5,25.5 37,31.5 32,28 27,31.5 28.5,25.5 24,21.5 30,21" fill="#fff" fillOpacity={0.85} />
          <Path d="M20 12 V26" stroke="#fff" strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" />
        </G>
      );
    case 'parent':
      return (
        <G>
          <Defs>{grad('pA', '#A08CFF', '#6246E0')}{grad('pC', '#FFB46B', '#F57A1F')}</Defs>
          <Circle cx={22} cy={16} r={9} fill="#FFD9B0" />
          <Path d="M6 56 Q6 30 22 30 Q38 30 38 56 Z" fill="url(#pA)" />
          <Circle cx={46} cy={30} r={7} fill="#FFD9B0" />
          <Path d="M34 56 Q34 40 46 40 Q58 40 58 56 Z" fill="url(#pC)" />
          <Path d="M13 13 Q22 5 31 13" stroke="#7A4B2A" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Circle cx={19} cy={17} r={1.2} fill="#2D2A4A" /><Circle cx={25} cy={17} r={1.2} fill="#2D2A4A" />
        </G>
      );
    case 'english':
      return (
        <G>
          <Rect x={6} y={44} width={52} height={12} rx={3} fill="#E83A3A" />
          <Rect x={10} y={30} width={46} height={12} rx={3} fill="#4D96FF" />
          <Rect x={4} y={16} width={48} height={12} rx={3} fill="#1DB954" />
          <Rect x={8} y={48} width={30} height={3} rx={1.5} fill="#fff" fillOpacity={0.6} />
          <Rect x={14} y={34} width={26} height={3} rx={1.5} fill="#fff" fillOpacity={0.6} />
          <Rect x={8} y={20} width={24} height={3} rx={1.5} fill="#fff" fillOpacity={0.6} />
          <SText x={61} y={13} fontSize={14} fontWeight="bold" fontFamily={FONT.bold} fill="#6C5CE7" textAnchor="end">Aa</SText>
        </G>
      );
    case 'maths':
      return (
        <G>
          <Defs>{grad('mA', '#4DC4FF', '#0A8FDB')}</Defs>
          <Rect x={6} y={6} width={52} height={52} rx={12} fill="url(#mA)" />
          <SText x={20} y={29} fontSize={21} fontWeight="bold" fontFamily={FONT.bold} fill="#fff" textAnchor="middle">1</SText>
          <SText x={44} y={29} fontSize={21} fontWeight="bold" fontFamily={FONT.bold} fill="#fff" textAnchor="middle">2</SText>
          <SText x={20} y={51} fontSize={21} fontWeight="bold" fontFamily={FONT.bold} fill="#fff" textAnchor="middle">3</SText>
          <SText x={44} y={51} fontSize={21} fontWeight="bold" fontFamily={FONT.bold} fill="#FFE27A" textAnchor="middle">+</SText>
        </G>
      );
    case 'mixed':
      return (
        <G>
          {['#FF6B6B', '#FF8A3D', '#FFC93C', '#1DB954', '#4D96FF', '#6C5CE7'].map((c, i) => (
            <Path key={c} d={`M ${4 + i * 4.2} 52 A ${28 - i * 4.2} ${28 - i * 4.2} 0 0 1 ${60 - i * 4.2} 52`} fill="none" stroke={c} strokeWidth={4.2} />
          ))}
          <Ellipse cx={11} cy={54} rx={9} ry={5} fill="#fff" /><Ellipse cx={53} cy={54} rx={9} ry={5} fill="#fff" />
          <Ellipse cx={17} cy={52} rx={7} ry={4.5} fill="#fff" /><Ellipse cx={47} cy={52} rx={7} ry={4.5} fill="#fff" />
        </G>
      );
    case 'science':
      return (
        <G>
          <Defs>{grad('sF', '#A8F0C6', '#1DB954')}</Defs>
          <Path d="M24 6 H40 V10 H37 V24 L56 52 Q60 58 54 58 H10 Q4 58 8 52 L27 24 V10 H24 Z" fill="#fff" fillOpacity={0.9} stroke="#6B6890" strokeWidth={3} strokeLinejoin="round" />
          <Path d="M17 42 H47 L55 54 Q58 56 54 56 H10 Q6 56 9 54 Z" fill="url(#sF)" />
          <Circle cx={26} cy={48} r={3} fill="#fff" fillOpacity={0.8} /><Circle cx={37} cy={44} r={2} fill="#fff" fillOpacity={0.8} />
          <Circle cx={33} cy={32} r={2.4} fill="#7BE0A8" /><Circle cx={36} cy={23} r={1.8} fill="#7BE0A8" />
        </G>
      );
  }
}

export default function AppIcon({ name, size = 48 }: { name: IconName; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Art name={name} />
    </Svg>
  );
}

export const GAME_ICON: Record<string, IconName> = { balloon: 'balloon', rescue: 'rescue', match: 'match', quiz: 'quick', mission: 'mission' };
export const SUBJECT_ICON: Record<string, IconName> = { E: 'english', M: 'maths', S: 'science' };
