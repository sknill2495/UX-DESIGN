import words from './transcript.json';
import {FPS} from './theme';
export type Word = {word: string; start: number; end: number};
export const W: Word[] = words as Word[];
export const f = (sec: number) => Math.round(sec * FPS);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
/** frame of the onset (minus 1 frame) of the first occurrence of `word` at or after `afterSec` */
export const at = (word: string, afterSec = 0): number => {
  const w = W.find((x) => norm(x.word) === norm(word) && x.start >= afterSec - 0.001);
  if (!w) throw new Error(`word not found: ${word} after ${afterSec}`);
  return Math.max(0, f(w.start) - 1);
};
// Mode boundaries (seconds)
export const MODE_B_START = 4.967; // first visual cut after hook line
export const MODE_C_START = 33.84; // "Organised toh nahi hua"
export const DURATION_SEC = 40.18;
