import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { File, Paths } from 'expo-file-system';

type Seg = { f: number; d: number; type: 'sine' | 'triangle' | 'square'; v: number; at: number };

// Same tones as the HTML app (frequency / length / wave / volume / start time)
const SOUNDS: Record<string, Seg[]> = {
  tap: [{ f: 520, d: 0.08, type: 'triangle', v: 0.08, at: 0 }],
  pop: [
    { f: 300, d: 0.05, type: 'square', v: 0.12, at: 0 },
    { f: 880, d: 0.12, type: 'sine', v: 0.14, at: 0.03 },
  ],
  right: [
    { f: 660, d: 0.12, type: 'sine', v: 0.14, at: 0 },
    { f: 880, d: 0.16, type: 'sine', v: 0.14, at: 0.1 },
  ],
  tryAgain: [
    { f: 330, d: 0.15, type: 'sine', v: 0.08, at: 0 },
    { f: 262, d: 0.2, type: 'sine', v: 0.08, at: 0.12 },
  ],
  match: [
    { f: 784, d: 0.1, type: 'triangle', v: 0.12, at: 0 },
    { f: 1047, d: 0.14, type: 'triangle', v: 0.12, at: 0.08 },
  ],
  fanfare: [523, 659, 784, 1047].map((f, i) => ({ f, d: 0.22, type: 'triangle' as const, v: 0.14, at: i * 0.13 })),
};

const RATE = 22050;
function wave(type: Seg['type'], ph: number) {
  const s = Math.sin(2 * Math.PI * ph);
  if (type === 'sine') return s;
  if (type === 'square') return s >= 0 ? 1 : -1;
  return (2 / Math.PI) * Math.asin(s);
}

// Build a tiny 16-bit mono WAV in memory (no audio files shipped with the app)
function makeWav(segs: Seg[]): Uint8Array {
  const total = Math.max(...segs.map((s) => s.at + s.d + 0.05));
  const n = Math.ceil(total * RATE);
  const mix = new Float32Array(n);
  for (const s of segs) {
    const start = Math.floor(s.at * RATE);
    const len = Math.floor(s.d * RATE);
    for (let i = 0; i < len && start + i < n; i++) {
      const t = i / RATE;
      // 20ms attack then exponential decay, like the WebAudio gain ramps
      const env =
        t < 0.02 ? (t / 0.02) * s.v : s.v * Math.pow(0.0001 / s.v, (t - 0.02) / Math.max(0.001, s.d - 0.02));
      mix[start + i] += wave(s.type, s.f * t) * env;
    }
  }
  const bytes = new Uint8Array(44 + n * 2);
  const dv = new DataView(bytes.buffer);
  const w = (o: number, str: string) => {
    for (let i = 0; i < str.length; i++) dv.setUint8(o + i, str.charCodeAt(i));
  };
  w(0, 'RIFF');
  dv.setUint32(4, 36 + n * 2, true);
  w(8, 'WAVE');
  w(12, 'fmt ');
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true);
  dv.setUint16(22, 1, true);
  dv.setUint32(24, RATE, true);
  dv.setUint32(28, RATE * 2, true);
  dv.setUint16(32, 2, true);
  dv.setUint16(34, 16, true);
  w(36, 'data');
  dv.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) dv.setInt16(44 + i * 2, Math.max(-1, Math.min(1, mix[i] * 2.5)) * 32767, true);
  return bytes;
}

const players: Record<string, AudioPlayer | null> = {};
let audioReady = false;
let webCtx: any = null;

function playWeb(segs: Seg[]) {
  try {
    const AC = (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;
    if (!AC) return;
    if (!webCtx) webCtx = new AC();
    if (webCtx.state === 'suspended') webCtx.resume();
    for (const s of segs) {
      const t = webCtx.currentTime + s.at;
      const o = webCtx.createOscillator();
      const g = webCtx.createGain();
      o.type = s.type;
      o.frequency.setValueAtTime(s.f, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(s.v, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + s.d);
      o.connect(g);
      g.connect(webCtx.destination);
      o.start(t);
      o.stop(t + s.d + 0.05);
    }
  } catch {}
}

function playNative(name: string) {
  try {
    if (!audioReady) {
      audioReady = true;
      setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    }
    let p = players[name];
    if (p === undefined) {
      const file = new File(Paths.cache, `kl-${name}.wav`);
      if (!file.exists) {
        file.create({ overwrite: true });
        file.write(makeWav(SOUNDS[name]));
      }
      p = createAudioPlayer(file.uri);
      players[name] = p;
    }
    if (p) {
      p.seekTo(0);
      p.play();
    }
  } catch {
    players[name] = null;
  }
}

export const Sound = {
  on: true,
  play(name: keyof typeof SOUNDS) {
    if (!this.on) return;
    if (Platform.OS === 'web') playWeb(SOUNDS[name]);
    else playNative(name);
  },
  tap() { this.play('tap'); },
  pop() { this.play('pop'); },
  right() { this.play('right'); },
  tryAgain() { this.play('tryAgain'); },
  match() { this.play('match'); },
  fanfare() { this.play('fanfare'); },
  speak(text: string) {
    if (!this.on) return;
    try {
      Speech.stop();
      // strip emoji before speaking
      const clean = String(text)
        .replace(/[\p{Extended_Pictographic}‍️]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (clean) Speech.speak(clean, { rate: 0.92, pitch: 1.05, language: 'en-GB' });
    } catch {}
  },
  stopSpeak() {
    try { Speech.stop(); } catch {}
  },
};
