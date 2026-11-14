import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, ComicNeue_400Regular, ComicNeue_700Bold } from '@expo-google-fonts/comic-neue';
import { AppProvider, useApp } from './src/state';
import { ThemeCtx, ThemePref, usePalette } from './src/theme';
import Welcome from './src/screens/Welcome';
import Shell from './src/screens/Shell';
import Game from './src/screens/Game';
import VizGallery from './src/VizGallery';
import { THEME_KEY, loadJSON, saveJSON } from './src/storage';

function Root() {
  const p = usePalette();
  const { screen, gameRun, ready } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <StatusBar style={p.dark ? 'light' : 'dark'} />
      {!ready ? null : screen === 'welcome' ? <Welcome /> : null}
      {ready && screen === 'app' && <Shell />}
      {ready && screen === 'game' && <Game key={gameRun} />}
    </View>
  );
}

const GALLERY_MODE = process.env.EXPO_PUBLIC_VIZ_GALLERY;
const SHOW_GALLERY = !!GALLERY_MODE && Platform.OS === 'web';

export default function App() {
  const [pref, setPrefState] = useState<ThemePref>('light');
  useEffect(() => {
    loadJSON<ThemePref>(THEME_KEY).then((v) => { if (v === 'light' || v === 'dark' || v === 'auto') setPrefState(v); });
  }, []);
  const setPref = (v: ThemePref) => { setPrefState(v); saveJSON(THEME_KEY, v); };
  const [loaded] = useFonts({ ComicNeue_400Regular, ComicNeue_700Bold });
  if (!loaded && Platform.OS !== 'web') {
    return <View style={{ flex: 1, backgroundColor: '#191730', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#FFC93C" /></View>;
  }
  if (SHOW_GALLERY) return <SafeAreaProvider><ThemeCtx.Provider value={{ pref, setPref }}><VizGallery mode={GALLERY_MODE} /></ThemeCtx.Provider></SafeAreaProvider>;
  return (
    <SafeAreaProvider>
      <ThemeCtx.Provider value={{ pref, setPref }}>
        <AppProvider>
          <Root />
        </AppProvider>
      </ThemeCtx.Provider>
    </SafeAreaProvider>
  );
}
