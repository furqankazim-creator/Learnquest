import { useWindowDimensions } from 'react-native';

// Phone (< 600px): single column, bottom tabs.
// Tablet / small browser (600-899px): wider single column, bottom tabs.
// Desktop browser / big tablet (>= 900px): sidebar navigation + multi-column content.
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const wide = width >= 900;
  const mid = width >= 600;
  return {
    width,
    height,
    wide,
    mid,
    compact: !wide && height < 860,
    contentMax: wide ? 1040 : mid ? 680 : 480,
    gameMax: wide ? 980 : mid ? 680 : 480,
  };
}
