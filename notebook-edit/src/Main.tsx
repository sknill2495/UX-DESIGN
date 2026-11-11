import React, {useEffect, useState} from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender} from 'remotion';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import {T, FONT, L} from './theme';
import {W, at, f, MODE_B_START, MODE_C_START} from './timing';
import {Sfx, prog, ez} from './parts';
import {Sticker} from './stickers';
import {CardViewport, Carousel, Slot, PlanCard, SystematicCard, planCam, ProblemCard, problemCam, ReviewCard, NodesCard, OwnedCard, PagesCard, ownedCam, BarsCard, barsCam} from './cards';

const B0 = f(MODE_B_START);
const C0 = f(MODE_C_START) - 1;

/* ---------------- footage ---------------- */
const Footage: React.FC = () => {
  const frame = useCurrentFrame();
  const inB = frame >= B0 && frame < C0;
  return (
    <AbsoluteFill style={{background: T.panel}}>
      <OffthreadVideo src={staticFile('SOURCE.mp4')} style={{width: L.W, height: L.H, transform: `translateY(${inB ? L.footageOffsetB : 0}px)`}} />
    </AbsoluteFill>
  );
};

/* ---------------- Mode B panel ---------------- */
const Panel: React.FC = () => {
  const dots = `radial-gradient(circle, ${T.dot} 1.5px, transparent 1.6px)`;
  const mask = `linear-gradient(to bottom, #000 0px, #000 ${L.panelH}px, transparent ${L.fadeEnd}px)`;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: L.W, height: L.fadeEnd, WebkitMaskImage: mask, maskImage: mask, background: T.panel}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: dots, backgroundSize: '28px 28px'}} />
    </div>
  );
};

/* ---------------- one-word captions ---------------- */
const EMPH = new Set(['planning', 'expense', 'gym', 'reading', 'systematic', 'problem', 'page', 'khoobsurat', 'notebook', 'rough', 'important', 'organised']);
const clean = (w: string) => w.replace(/[.,!?…]+$/g, '');
const currentWord = (frame: number, from: number, to: number) => {
  for (let i = 0; i < W.length; i++) {
    const s = f(W[i].start) - 1;
    const next = i + 1 < W.length ? f(W[i + 1].start) - 1 : Infinity;
    const e = Math.min(next, f(W[i].end) + 8);
    if (frame >= s && frame < e && frame >= from && frame < to) return {w: W[i], s};
  }
  return null;
};
const Caption: React.FC<{from: number; to: number; y: number; size: number; shadow?: boolean; pop?: boolean}> = ({from, to, y, size, shadow, pop}) => {
  const frame = useCurrentFrame();
  const c = currentWord(frame, from, to);
  if (!c) return null;
  const word = clean(c.w.word);
  const emph = pop && EMPH.has(word.toLowerCase());
  const sc = emph ? interpolate(frame, [c.s, c.s + 4], [0.92, 1], {extrapolateRight: 'clamp'}) : 1;
  const fit = Math.min(1, (L.W * 0.86) / (word.length * size * 0.6));
  return (
    <div style={{position: 'absolute', left: 0, width: L.W, top: y - size, height: size * 1.2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
      <span
        style={{
          fontFamily: FONT, fontWeight: 800, fontSize: size * fit, letterSpacing: shadow ? '-0.02em' : '-0.03em', color: '#fff', lineHeight: 1,
          transform: `scale(${sc})`, textShadow: shadow ? '0 4px 18px rgba(0,0,0,.55)' : 'none', whiteSpace: 'nowrap',
        }}
      >
        {word}
      </span>
    </div>
  );
};

/* ---------------- Mode A: hook ---------------- */
const Streak: React.FC<{at: number; y: number; x?: number; w?: number}> = ({at, y, x = 0, w = 500}) => {
  const frame = useCurrentFrame();
  if (frame < at - 4 || frame > at + 1) return null;
  const p = interpolate(frame, [at - 4, at], [0, 1]);
  return <div style={{position: 'absolute', top: y, left: x - w + p * (L.W + w), width: w, height: 5, background: '#fff', borderRadius: 3, boxShadow: '0 0 12px rgba(255,255,255,.8)'}} />;
};
const SnapIn: React.FC<{at: number; children: React.ReactNode; from?: number; style?: React.CSSProperties}> = ({at, children, from = -60, style}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = prog(frame, at, 4, ez.out);
  const moving = frame < at + 2;
  return (
    <div style={{position: 'absolute', ...style, transform: `${style?.transform ?? ''} translateX(${(1 - p) * from}px)`, filter: moving ? 'blur(3px)' : 'none'}}>
      {children}
    </div>
  );
};
const FloatChips: React.FC<{until: number}> = ({until}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const chips = [
    {x: 40, y: 1000, w: 140, d: 0}, {x: 880, y: 960, w: 150, d: 2}, {x: 60, y: 1560, w: 120, d: 4},
    {x: 900, y: 1600, w: 130, d: 6}, {x: 920, y: 1180, w: 110, d: 3},
  ];
  return (
    <>
      {chips.map((c, i) => {
        const o = Math.min(1, Math.max(0, (frame - c.d * 2) / 6));
        return (
          <div key={i} style={{position: 'absolute', left: c.x, top: c.y + Math.sin((frame + i * 13) / 14) * 6, width: c.w, height: 58, borderRadius: 14, background: 'rgba(20,18,16,.75)', border: '1px solid rgba(255,255,255,.15)', filter: 'blur(1px)', opacity: o, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', boxSizing: 'border-box'}}>
            <div style={{width: 22, height: 22, borderRadius: 6, border: '2px solid rgba(255,255,255,.7)', background: i % 2 ? T.accent : 'transparent', flexShrink: 0}} />
            <div style={{flex: 1}}>
              <div style={{height: 6, borderRadius: 3, background: 'rgba(255,255,255,.7)', width: '85%'}} />
              <div style={{height: 6, borderRadius: 3, background: 'rgba(255,255,255,.35)', width: '55%', marginTop: 7}} />
            </div>
          </div>
        );
      })}
    </>
  );
};
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame >= B0) return null;
  const tileS = spring({frame, fps, config: {damping: 9, stiffness: 240}, durationInFrames: 12});
  const aLife = at('life');
  const aOrg = at('organised');
  const aIs = at('is');
  const aSab = at('sab');
  const aLikh = at('likhunga');
  const firstBlock = frame < aIs;
  const display: React.CSSProperties = {fontFamily: FONT, fontWeight: 900, lineHeight: 0.85, whiteSpace: 'nowrap'};
  return (
    <AbsoluteFill>
      <FloatChips until={B0} />
      {/* DAY 1 tile */}
      <div style={{position: 'absolute', left: 52, top: 800, width: 190, height: 190, borderRadius: 26, background: T.accent, border: `3px solid ${T.ink}`, boxShadow: `8px 8px 0 ${T.shadowHard}`, transform: `rotate(-6deg) scale(${tileS})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>
        <div style={{...display, fontSize: 40, color: T.ink, letterSpacing: '0.04em'}}>DAY</div>
        <div style={{...display, fontSize: 116, color: T.ink, letterSpacing: '-0.05em'}}>1</div>
      </div>
      {/* lower kinetic block */}
      {firstBlock ? (
        <>
          <Streak at={aLife} y={1210} />
          <SnapIn at={aLife} style={{left: 0, width: L.W, top: 1180, textAlign: 'center'}}>
            <span style={{...display, fontSize: 60, color: '#fff', textShadow: '0 4px 18px rgba(0,0,0,.6)'}}>ab life</span>
          </SnapIn>
          <Streak at={aOrg} y={1320} />
          <SnapIn at={aOrg} style={{left: 0, width: L.W, top: 1260, display: 'flex', justifyContent: 'center'}}>
            <span style={{...display, fontSize: 148, letterSpacing: '-0.04em', color: T.accent, background: T.ink, padding: '6px 16px 10px', borderRadius: 8, textShadow: '0 0 18px rgba(242,194,48,0.45)'}}>organised</span>
          </SnapIn>
          <SnapIn at={at('hone')} from={-30} style={{left: 110, top: 1416}}>
            <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 38, color: '#fff', textShadow: '0 3px 12px rgba(0,0,0,.7)'}}>hone wali hai.</span>
          </SnapIn>
        </>
      ) : (
        <>
          <SnapIn at={aIs} from={-30} style={{left: 0, width: L.W, top: 1190, textAlign: 'center'}}>
            <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: '#fff', textShadow: '0 3px 12px rgba(0,0,0,.7)'}}>is baar</span>
          </SnapIn>
          <Streak at={aSab} y={1310} />
          <SnapIn at={aSab} style={{left: 0, width: L.W, top: 1250, textAlign: 'center'}}>
            <span style={{...display, fontSize: 168, letterSpacing: '-0.04em', color: '#fff', WebkitTextStroke: `4px ${T.ink}`, textShadow: `6px 8px 0 ${T.shadowHard}`}}>sab kuch</span>
          </SnapIn>
          <SnapIn at={aLikh} from={40} style={{left: 0, width: L.W, top: 1420, display: 'flex', justifyContent: 'center'}}>
            <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: T.ink, background: T.accent, border: `3px solid ${T.ink}`, padding: '4px 18px', borderRadius: 10}}>likhunga.</span>
          </SnapIn>
        </>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- Mode C: outro ---------------- */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < C0) return null;
  const k = at('collection');
  const kw = '‘notebook collector’';
  const size = 120;
  const fit = Math.min(1, (L.W * 0.9) / (kw.length * size * 0.56));
  const pop = interpolate(frame, [k, k + 4, k + 8], [0.7, 1.06, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      {/* one-word captions only until the burned-in Hindi caption appears (~35.2s) */}
      <Caption from={C0} to={f(35.2)} y={1190} size={84} shadow />
      {frame >= k && (
        <div style={{position: 'absolute', left: 0, width: L.W, top: 1080, display: 'flex', justifyContent: 'center'}}>
          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: size * fit, letterSpacing: '-0.03em', color: T.accent, transform: `scale(${pop})`, textShadow: `4px 6px 0 ${T.shadowHard}, 0 0 18px rgba(242,194,48,0.45)`, whiteSpace: 'nowrap'}}>{kw}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- Mode B: split explainer ---------------- */
const ModeB: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B0 || frame >= C0) return null;
  const b2 = f(13.5), b3 = f(17.6), b4 = f(21.6), b5 = f(26.45), b6 = f(30.1);
  return (
    <AbsoluteFill>
      <Panel />
      <CardViewport>
        {frame < b2 && (
          <Slot start={B0} h={480} cam={planCam()}>
            <Carousel switches={[at('sab', 11)]}>{[<PlanCard key="a" />, <SystematicCard key="b" />]}</Carousel>
          </Slot>
        )}
        {frame >= b2 && frame < b3 && (
          <Slot start={b2} h={480} cam={problemCam()}>
            <ProblemCard />
          </Slot>
        )}
        {frame >= b3 && frame < b4 && (
          <Slot start={b3} h={460}>
            <ReviewCard />
          </Slot>
        )}
        {frame >= b4 && frame < b5 && (
          <Slot start={b4} h={480}>
            <NodesCard />
          </Slot>
        )}
        {frame >= b5 && frame < b6 && (
          <Slot start={b5} h={470} cam={ownedCam()}>
            <Carousel switches={[f(29.0)]}>{[<OwnedCard key="a" />, <PagesCard key="b" />]}</Carousel>
          </Slot>
        )}
        {frame >= b6 && (
          <Slot start={b6} h={480} cam={barsCam()}>
            <BarsCard />
          </Slot>
        )}
      </CardViewport>
      <Caption from={B0} to={C0} y={L.captionBaseline} size={96} pop />
    </AbsoluteFill>
  );
};

/* ---------------- stickers ---------------- */
const STICKERS = [
  // Mode A
  {at: 8, x: 160, y: 640, rot: 8, kind: 'heart', label: 'new me', size: 150, hold: 40},
  {at: f(3.0), x: 840, y: 1500, rot: -6, kind: 'money', label: 'haul', size: 170, hold: 36},
  // Mode B (footage zone, alternating sides, clear of face)
  {at: f(7.4), x: 820, y: 1000, rot: 6, kind: 'heart', label: 'aesthetic', hold: 46},
  {at: f(10.7), x: 30, y: 1540, rot: -5, kind: 'side', label: 'sure…', hold: 44},
  {at: at('problem'), x: 820, y: 1250, rot: 7, kind: 'shock', label: 'uh oh', hold: 44},
  {at: at('khoobsurat'), x: 30, y: 1180, rot: -7, kind: 'sweat', label: 'too pretty', hold: 46},
  {at: at('important'), x: 820, y: 1000, rot: 5, kind: 'think', label: 'one more?', hold: 44},
  {at: f(27.0), x: 30, y: 1540, rot: -6, kind: 'facepalm', label: 'bro.', hold: 46},
  // Mode C
  {at: at('toh', 34), x: 820, y: 960, rot: 6, kind: 'same', label: 'same', hold: 34},
] as const;

/* ---------------- SFX map ---------------- */
const SFX: {at: number; name: string; vol?: number}[] = [
  {at: at('life') - 4, name: 'whoosh', vol: 0.12},
  {at: at('organised') - 4, name: 'whoosh', vol: 0.12},
  {at: at('sab') - 4, name: 'whoosh', vol: 0.12},
  {at: 0, name: 'pop', vol: 0.1},
  ...STICKERS.map((s) => ({at: s.at, name: 'pop', vol: 0.1})),
  ...['planning', 'expense', 'gym', 'reading'].map((w, i) => ({at: at(w, 6 + i) + 2, name: 'click', vol: 0.08})),
  ...['kharab', 'nahi', 'chahiye'].map((w) => ({at: at(w, 16), name: 'click', vol: 0.08})),
  ...Array.from({length: 8}).map((_, i) => ({at: at('systematic') + i * 3, name: 'tick', vol: 0.06})),
  ...Array.from({length: 10}).map((_, i) => ({at: f(26.5) + i * 3, name: 'tick', vol: 0.06})),
  {at: f(20.3), name: 'thud', vol: 0.12},
  {at: f(31.0), name: 'thud', vol: 0.16},
  {at: at('collection'), name: 'pop', vol: 0.12},
];

export const Main: React.FC = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([500, 600, 700, 800, 900].map((w) => document.fonts.load(`${w} 40px Inter`))).then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{background: T.panel, fontFamily: FONT}}>
      <Footage />
      <ModeB />
      <Hook />
      <Outro />
      {STICKERS.map((s, i) => (
        <Sticker key={i} {...s} />
      ))}
      {SFX.map((s, i) => (
        <Sfx key={i} {...s} />
      ))}
    </AbsoluteFill>
  );
};
