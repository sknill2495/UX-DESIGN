import {loadFont} from '@remotion/fonts';
import {Easing, staticFile} from 'remotion';

export const fontFamily = 'InterLocal';
for (const w of ['500', '600', '700', '800', '900']) {
  loadFont({family: fontFamily, url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w});
}

// Palette sampled from SOURCE: espresso shadows, cream collar, sweater mustard.
export const T = {
  panel: '#16110D',
  dot: 'rgba(255,240,220,0.07)',
  card: '#F5EEE2',
  cardStroke: '#0D0B09',
  ink: '#14110E',
  muted: '#7D7266',
  hairline: '#DDD3C4',
  accent: '#E8B23A',
  accentSoft: '#F7E3AE',
  accentStroke: '#0D0B09',
  white: '#FFFFFF',
  shadowHard: '#16110D',
};

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_SLIDE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_CAM = Easing.bezier(0.65, 0, 0.35, 1);

export const CARD = {x: 119, y: 110, w: 842, pad: 34, radius: 28};
export const PANEL_SOLID = 710;
export const PANEL_FADE_END = 920;
