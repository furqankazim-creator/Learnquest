import React from 'react';
import { Platform, Pressable, PressableStateCallbackType, Text as RNText, TextProps, TextStyle, View, ViewStyle, StyleProp } from 'react-native';
import { FONT, Palette, usePalette } from '../theme';

// Text with the app font. weight >= 700 uses the bold face.
export function T({ style, w = 400, size = 18, color, ...rest }: TextProps & { w?: number; size?: number; color?: string }) {
  const p = usePalette();
  return (
    <RNText
      {...rest}
      style={[
        { fontFamily: w >= 700 ? FONT.bold : FONT.regular, fontSize: size, color: color ?? p.ink, lineHeight: size + 6 },
        Platform.OS === 'web' ? ({ fontWeight: String(w) } as TextStyle) : null,
        style,
      ]}
    />
  );
}

export function useCardShadow(): ViewStyle {
  const p = usePalette();
  return Platform.select<ViewStyle>({
    web: { boxShadow: `0 6px 18px ${p.shadow}` } as ViewStyle,
    default: { shadowColor: p.dark ? '#000' : '#2D2A4A', shadowOpacity: p.dark ? 0.35 : 0.1, shadowRadius: 9, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  })!;
}

export function cardSurface(p: Palette, radius = 20): ViewStyle {
  return { backgroundColor: p.card, borderRadius: radius };
}

export function Press({ style, children, onPress, disabled, ...rest }: {
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
  children?: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode);
  onPress?: () => void; disabled?: boolean;
} & Record<string, any>) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      android_ripple={Platform.OS === 'android' ? { color: 'rgba(0,0,0,0.08)', foreground: true } : undefined}
      style={(state) => [
        { opacity: disabled ? 0.45 : state.pressed && Platform.OS !== 'android' ? 0.84 : 1 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

export function ProgressBar({ pct, color, height = 10 }: { pct: number; color: string; height?: number }) {
  const p = usePalette();
  return (
    <View style={{ height, borderRadius: 99, backgroundColor: p.line, overflow: 'hidden', marginTop: 6 }}>
      <View style={{ height: '100%', width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: color, borderRadius: 99 }} />
    </View>
  );
}
