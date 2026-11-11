// Palette derived from SOURCE: warm walnut bookstore/study, bottle-green rugby shirt
// with mustard + maroon stripes, cream paper, tungsten practicals.
// Panel is dark espresso (matches footage shadows); cards are warm paper.
export const T = {
  panel: '#15110E',
  dot: 'rgba(255,240,220,0.07)',
  card: '#F6F0E4',
  cardStroke: '#0B0B0C',
  ink: '#121212',
  muted: '#7A726B',
  hairline: '#D8D0C4',
  accent: '#F2C230', // mustard from the shirt stripe, pushed brighter
  accentSoft: '#FBEDB0',
  accentStroke: '#0B0B0C',
  captionOnPanel: '#FFFFFF',
  captionOnFootage: '#FFFFFF',
  shadowHard: '#15110E',
};
export const FONT = 'Inter, sans-serif';
export const FPS = 30;
// Layout (1080x1920), locked for all of Mode B
export const L = {
  W: 1080,
  H: 1920,
  panelH: 710,
  fadeEnd: 920,
  cardTop: 110,
  cardW: 842,
  cardLeft: (1080 - 842) / 2,
  captionBaseline: 690,
  footageOffsetB: 560, // Mode B: footage translated down so faces sit at ~y1180
};
