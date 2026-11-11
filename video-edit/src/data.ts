import {sec} from './theme';

// Shot-cut frames from scene detection (threshold 0.25) on the 30 fps source.
export const CUTS = [0, 57, 117, 160, 205, 248, 297, 361, 405, 450, 510, 610, 845, 1085];
export const DURATION = 1085;

export type Mode = 'A' | 'B' | 'A2' | 'C';
export const modeAt = (fr: number): Mode =>
  fr < 117 ? 'A' : fr < 610 ? 'B' : fr < 845 ? 'A2' : 'C';

export const shotAt = (fr: number) => {
  for (let i = CUTS.length - 2; i >= 0; i--) if (fr >= CUTS[i]) return i;
  return 0;
};

// Mode B vertical reframe per shot (px, canvas). Face shots: face centre -> y≈1200.
// Over-shoulder TV shots: TV centre -> y≈1250. Remote POV: thumb -> y≈1300.
export const DY: Record<number, number> = {
  2: 597, // S3 OTS comedy row
  3: 150, // S4 remote POV
  4: 674, // S5 OTS thriller/action
  5: 398, // S6 close-up face
  6: 616, // S7 OTS trending
  7: 488, // S8 wide smile
  8: 501, // S9 frown
  9: 414, // S10 wince
  10: 524, // S11 hand on head
};

// Word timestamps from faster-whisper (small, Hindi), romanised to Hinglish.
// [word, start s, end s, emphasis]
const RAW: [string, number, number, boolean?][] = [
  ['aaj', 0.8, 0.94], ['kuch', 0.94, 1.14], ['accha', 1.14, 1.44, true], ['dekhte', 1.44, 1.78], ['hain', 1.78, 2.3],
  ['ye', 4.64, 5.26], ['nahi', 5.26, 5.88, true],
  ['ye', 6.54, 7.16], ['toh', 7.16, 7.28], ['pehle', 7.28, 7.56], ['dekh', 7.56, 7.78], ['chuka', 7.78, 8.06], ['hoon', 8.06, 8.32],
  ['ye', 8.32, 9.18], ['boring', 9.18, 9.54, true], ['lag', 9.54, 9.66], ['rahi', 9.66, 9.8], ['hai', 9.8, 9.92],
  ['kuch', 9.92, 11.16], ['aur', 11.16, 11.32], ['dekhte', 11.32, 11.66], ['hain', 11.66, 12.06],
  ['comedy', 12.06, 12.56, true], ['dekhun?', 12.56, 12.95],
  ['thriller?', 14.02, 14.7, true],
  ['action?', 15.92, 16.6, true],
  ['arre', 17.64, 18.26], ['yaar', 18.26, 18.88],
  ['decide', 18.88, 19.7, true], ['nahi', 19.7, 19.86], ['ho', 19.86, 19.98], ['raha', 19.98, 20.3],
  ['tees', 22.7, 23.32, true], ['minute', 23.32, 23.6], ['se', 23.6, 23.74], ['movie', 23.74, 24.02], ['choose', 24.02, 24.22],
  ['kar', 24.22, 24.38], ['raha', 24.38, 24.5], ['hoon', 24.5, 24.62],
  ['aur', 24.62, 25.26], ['movie', 25.26, 25.66], ['dekhne', 25.66, 25.96], ['ka', 25.96, 26.06], ['mood', 26.06, 26.36, true],
  ['nahi', 26.36, 26.62], ['hai', 26.62, 26.95],
  ['chalo', 28.08, 28.6], ['ek', 28.6, 29.0], ['reel', 29.0, 29.24, true], ['dekh', 29.24, 29.44], ['leta', 29.44, 29.7], ['hoon', 29.7, 30.05],
];

export type Word = {w: string; s: number; e: number; emph: boolean};
// Captions switch on word onset minus one frame.
export const WORDS: Word[] = RAW.map(([w, s, e, emph]) => ({
  w,
  s: sec(s) - 1,
  e: sec(e) - 1,
  emph: !!emph,
}));

// Key anchors (frames)
export const A = {
  nahi1: sec(5.26),
  chuka: sec(7.78),
  boring: sec(9.18),
  kuchAur: sec(9.92),
  aur: sec(11.16),
  comedy: sec(12.06),
  thriller: sec(14.02),
  action: sec(15.92),
  arre: sec(17.64),
  decide: sec(18.88),
  nahi3: sec(19.7),
  tees: sec(22.7),
  minute: sec(23.32),
  mood: sec(26.06),
  reel: sec(29.0),
  firstTap: sec(29.66),
  chime: sec(33.7),
};
