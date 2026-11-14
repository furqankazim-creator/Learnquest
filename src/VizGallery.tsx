import React from 'react';
import { ScrollView, View } from 'react-native';
import MathVisual from './components/MathVisual';
import { T } from './components/UI';
import { parseViz } from './mathViz';
import { usePalette } from './theme';

const SAMPLES: [string, string][] = [
  ['47 + 12 = ?', '🍎'], ['3 + 2 = ?', '🎈'], ['9 − 4 = ?', '⭐'], ['7 × 4 = ?', '🍎'], ['48 ÷ 6 = ?', '🍪'], ['56 ÷ 9 = ?', '🍪'],
  ['Half of 12 is…', '🍰'], ['⅓ of 15 is…', '🍰'], ['Double 9 is…', '👯'], ['Count in 5s: 5, 10, 15, ___', '🖐️'],
  ['What number comes before 9?', '👈'], ['A shape is split into 3 equal parts. 2 parts are shaded. What fraction is shaded?', '🍕'],
  ['3/5 = ?/10', '🍕'], ['How many sides does a pentagon have?', '🔷'], ['What number is 3 tens and 5 ones?', '🔟'],
  ['The short hand points to 8 and the long hand points to 12. What time is it?', '🕐'], ['A rectangle is 6 cm by 4 cm. Its area is…', '📐'],
  ['13 × 7 = ?', '✖️'], ['234 × 3 = ?', '✖️'], ['4326 ÷ 6 = ?', '➗'], ['5000 − 2750 = ?', '➖'], ['1250 + 1375 = ?', '➕'],
  ['25% of 80 is…', '💯'], ['n + 7 = 15. What is n?', '🔤'], ['3x = 27. What is x?', '🔤'], ['6 + ? = 10', '❓'],
  ['A triangle has base 8 cm and height 5 cm. Its area is…', '🔺'], ['An equilateral triangle has sides of 5 cm. What is its perimeter?', '🔺'],
  ['94 rounded to the nearest 10 is…', '🎯'], ['Round 4,672 to the nearest 1,000.', '🎯'], ['20p + 10p = ?', '🪙'], ['A pen costs 45p. How much do 3 pens cost?', '🖊️'],
  ['A red ribbon is 54 cm long. A blue ribbon is 35 cm long. How much longer is the red ribbon?', '🎀'],
  ['In a pictogram, each star ⭐ stands for 2 children. There are 5 stars. How many children is that?', '📊'],
  ['A point is at (3, 5). It moves 3 right and 4 up. Where is it now?', '📍'],
  ['Each bag holds 5 apples. How many apples are in 4 bags?', '🛍️'], ['Sam has 5 apples. He is given 3 more. How many apples does Sam have now?', '🍎'],
  ['There are 14 birds in a tree. 5 fly away. How many birds are left?', '🐦'],
];

export default function VizGallery() {
  const p = usePalette();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: p.bg }} contentContainerStyle={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
      {SAMPLES.map(([q, e]) => {
        const v = parseViz(q, e);
        return (
          <View key={q} style={{ width: 360 }}>
            <T w={700} size={13} color={p.muted} numberOfLines={2} style={{ marginBottom: 4 }}>{q}</T>
            {v ? <MathVisual viz={v} /> : <T color={p.coral}>NO PICTURE</T>}
          </View>
        );
      })}
    </ScrollView>
  );
}
