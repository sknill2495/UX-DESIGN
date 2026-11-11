import React from 'react';
import {interpolate, spring, Easing} from 'remotion';
import {T, FPS, EASE_OUT, EASE_CAM, EASE_SLIDE, CARD, fontFamily} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const lerp = (fr: number, a: number, b: number, from: number, to: number, ease = EASE_OUT) =>
  interpolate(fr, [a, b], [from, to], {...clamp, easing: ease});

/* ---------- Card shell + enter ---------- */
export const enterScale = (fr: number, start: number) => {
  const s = spring({frame: fr - start, fps: FPS, config: {damping: 14, stiffness: 220}});
  return {
    transform: `scale(${0.86 + 0.14 * s})`,
    opacity: interpolate(fr, [start, start + 7], [0, 1], clamp),
  };
};

export const CardShell: React.FC<{h: number; children: React.ReactNode; style?: React.CSSProperties}> = ({h, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: CARD.w,
      height: h,
      background: T.card,
      border: `3px solid ${T.cardStroke}`,
      borderRadius: CARD.radius,
      boxShadow: '0 18px 50px rgba(0,0,0,0.5)',
      padding: CARD.pad,
      boxSizing: 'border-box',
      fontFamily,
      color: T.ink,
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- Camera push-in inside the card ---------- */
export type CamKey = {f: number; s: number; x: number; y: number; dur?: number};
export const camTransform = (fr: number, keys: CamKey[], w: number, h: number) => {
  // keys: focus point in card-local coords; first key is the resting state
  let s = 1, x = w / 2, y = h / 2;
  for (const k of keys) {
    const d = k.dur ?? 18;
    const p = interpolate(fr, [k.f, k.f + d], [0, 1], {...clamp, easing: EASE_CAM});
    s = s + (k.s - s) * p;
    x = x + (k.x - x) * p;
    y = y + (k.y - y) * p;
  }
  const tx = w / 2 - s * x;
  const ty = h / 2 - s * y;
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};

/* Places a card (or carousel strip) at the locked card slot, clipped to the panel */
export const CardSlot: React.FC<{
  fr: number; start: number; h: number; cam?: CamKey[]; children: React.ReactNode;
}> = ({fr, start, h, cam = [], children}) => {
  const e = enterScale(fr, start);
  return (
    <div style={{position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: h, ...e, transformOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: '0 0', transform: camTransform(fr, cam, CARD.w, h)}}>
        {children}
      </div>
    </div>
  );
};

/* ---------- Text bits ---------- */
export const Eyebrow: React.FC<{icon: string; text: string; right?: React.ReactNode}> = ({icon, text, right}) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 30}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 700, letterSpacing: '0.12em', color: T.muted}}>
      <span style={{fontSize: 22, width: 22, textAlign: 'center'}}>{icon}</span>
      {text}
    </div>
    {right}
  </div>
);

export const HL: React.FC<{fr: number; start: number; children: React.ReactNode; dur?: number}> = ({fr, start, children, dur = 9}) => {
  const p = interpolate(fr, [start, start + dur], [0, 1], {...clamp, easing: EASE_OUT});
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span
        style={{
          position: 'absolute',
          left: -8,
          right: -8,
          top: '8%',
          bottom: '2%',
          background: T.accentSoft,
          border: `2px solid ${T.accentStroke}`,
          borderRadius: 6,
          transformOrigin: '0 50%',
          transform: `scaleX(${p})`,
          opacity: p > 0 ? 1 : 0,
        }}
      />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

export const Check: React.FC<{fr: number; start: number; kind?: 'tick' | 'x'; size?: number}> = ({fr, start, kind = 'tick', size = 28}) => {
  const p = interpolate(fr, [start, start + 6], [0, 1], clamp);
  const len = 40;
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={{flex: 'none'}}>
      <rect x="1.5" y="1.5" width="25" height="25" rx="7" fill={p > 0 && kind === 'tick' ? T.accent : T.card} stroke={T.ink} strokeWidth="2.5" />
      {kind === 'tick' ? (
        <path d="M7 14.5 L12 19.5 L21 9" fill="none" stroke={T.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      ) : (
        <>
          <path d="M8.5 8.5 L19.5 19.5" fill="none" stroke={T.ink} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={len / 2} strokeDashoffset={(len / 2) * (1 - Math.min(1, p * 2))} />
          <path d="M19.5 8.5 L8.5 19.5" fill="none" stroke={T.ink} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={len / 2} strokeDashoffset={(len / 2) * (1 - Math.max(0, p * 2 - 1))} />
        </>
      )}
    </svg>
  );
};

export const Strike: React.FC<{fr: number; start: number; children: React.ReactNode}> = ({fr, start, children}) => {
  const p = interpolate(fr, [start + 2, start + 9], [0, 1], {...clamp, easing: EASE_OUT});
  return (
    <span style={{position: 'relative', display: 'inline-block', color: p > 0.5 ? T.muted : T.ink}}>
      {children}
      <span style={{position: 'absolute', left: -4, right: -4, top: '52%', height: 4, background: T.ink, transformOrigin: '0 50%', transform: `scaleX(${p})`}} />
    </span>
  );
};

export const TypeOn: React.FC<{fr: number; start: number; text: string; cps?: number; caret?: boolean}> = ({fr, start, text, cps = 28, caret = true}) => {
  const n = Math.max(0, Math.floor(((fr - start) / FPS) * cps));
  const shown = text.slice(0, n);
  const done = n >= text.length;
  const blink = Math.floor((fr - start) / 10) % 2 === 0;
  return (
    <span>
      {fr >= start ? shown : ''}
      {caret && fr >= start && (!done || blink) ? (
        <span style={{display: 'inline-block', width: 2, height: '0.95em', background: 'currentColor', marginLeft: 3, verticalAlign: '-0.12em'}} />
      ) : null}
    </span>
  );
};

export const countUp = (fr: number, start: number, dur: number, from: number, to: number) =>
  Math.round(interpolate(fr, [start, start + dur], [from, to], {...clamp, easing: EASE_OUT}));

export const SquareGrid: React.FC<{cols: number; rows: number; filled: number; size?: number; gap?: number}> = ({cols, rows, filled, size = 40, gap = 10}) => (
  <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap}}>
    {Array.from({length: cols * rows}).map((_, i) => (
      <div key={i} style={{width: size, height: size, borderRadius: 8, border: `2px solid ${T.ink}`, boxSizing: 'border-box', background: i < filled ? T.accentSoft : 'transparent'}} />
    ))}
  </div>
);

/* Generic poster tile – no real titles, no brand colours */
export const Poster: React.FC<{label: string; w?: number; h?: number; variant?: number; dim?: boolean}> = ({label, w = 104, h = 150, variant = 0, dim}) => (
  <div style={{width: w, height: h, borderRadius: 12, border: `2.5px solid ${T.ink}`, background: T.hairline, boxSizing: 'border-box', overflow: 'hidden', position: 'relative', opacity: dim ? 0.4 : 1, flex: 'none'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: '64%', background: variant % 2 ? T.muted : T.ink}} />
    <div style={{position: 'absolute', left: '50%', top: '30%', width: w * 0.32, height: w * 0.32, marginLeft: -w * 0.16, borderRadius: '50%', background: variant % 3 === 2 ? T.accent : T.accentSoft}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', fontSize: Math.round(w * 0.14), fontWeight: 800, letterSpacing: '0.06em', color: T.ink}}>{label}</div>
  </div>
);

export const Limit: React.FC<{p: number; w?: number}> = ({p, w = 760}) => (
  <div style={{width: w, height: 48, borderRadius: 24, border: `3px solid ${T.ink}`, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: T.card}}>
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: T.accent, borderRight: p > 0.01 && p < 0.99 ? `3px solid ${T.ink}` : 'none'}} />
  </div>
);

/* ---------- Mode A helpers ---------- */
export const StreakIn: React.FC<{fr: number; start: number; y: number; h: number; children: React.ReactNode; x: number; fromLeft?: boolean}> = ({fr, start, y, h, children, x, fromLeft = true}) => {
  const lineP = interpolate(fr, [start - 4, start], [0, 1], clamp);
  const wordP = interpolate(fr, [start, start + 5], [0, 1], {...clamp, easing: EASE_OUT});
  const dir = fromLeft ? -1 : 1;
  const blurOn = fr >= start && fr < start + 3;
  return (
    <>
      {fr >= start - 4 && fr < start + 1 ? (
        <div style={{position: 'absolute', top: y + h / 2 - 3, left: fromLeft ? -500 + 1700 * lineP : 1080 - 1700 * lineP, width: 460, height: 6, background: T.white, borderRadius: 3, opacity: 0.95}} />
      ) : null}
      {fr >= start ? (
        <div style={{position: 'absolute', left: x + dir * 60 * (1 - wordP), top: y, opacity: Math.min(1, wordP * 2)}}>
          {blurOn ? (
            <div style={{position: 'absolute', inset: 0, transform: `scaleX(1.25) translateX(${dir * 20}px)`, opacity: 0.35, filter: 'blur(5px)'}}>{children}</div>
          ) : null}
          <div style={{position: 'relative'}}>{children}</div>
        </div>
      ) : null}
    </>
  );
};

export const FloatChips: React.FC<{fr: number; chips: {x: number; y: number; w: number; d: number}[]; start?: number}> = ({fr, chips, start = 0}) => (
  <>
    {chips.map((c, i) => {
      const inP = spring({frame: fr - start - c.d, fps: FPS, config: {damping: 12, stiffness: 180}});
      const dy = Math.sin((fr + i * 17) / 14) * 6;
      return (
        <div key={i} style={{position: 'absolute', left: c.x, top: c.y + dy, width: c.w, height: 58, borderRadius: 16, background: 'rgba(22,17,13,0.75)', border: '1px solid rgba(255,255,255,0.15)', filter: 'blur(0.8px)', transform: `scale(${inP})`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', boxSizing: 'border-box'}}>
          <div style={{width: 26, height: 26, borderRadius: 8, background: i % 2 ? T.accent : 'rgba(255,255,255,0.75)', flex: 'none'}} />
          <div style={{flex: 1}}>
            <div style={{height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.7)', width: '85%', marginBottom: 7}} />
            <div style={{height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.35)', width: '55%'}} />
          </div>
        </div>
      );
    })}
  </>
);

/* ---------- Reaction sticker (original illustrations) ---------- */
type Face = 'popcorn' | 'eyeroll' | 'yawn' | 'shock';
const FaceSvg: React.FC<{kind: Face; fr: number}> = ({kind, fr}) => {
  const wob = Math.sin(fr / 4) * 2;
  if (kind === 'popcorn') {
    return (
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {[[70, 52], [100, 40], [130, 52], [85, 30], [118, 28], [58, 72], [142, 72]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y + (i % 2 ? wob : -wob)} r="20" fill={T.card} stroke={T.ink} strokeWidth="5" />
        ))}
        <path d="M45 75 L155 75 L140 180 L60 180 Z" fill={T.card} stroke={T.ink} strokeWidth="6" strokeLinejoin="round" />
        <path d="M72 75 L78 180 M100 75 L100 180 M128 75 L122 180" stroke={T.accent} strokeWidth="12" />
        <path d="M45 75 L155 75 L140 180 L60 180 Z" fill="none" stroke={T.ink} strokeWidth="6" strokeLinejoin="round" />
      </svg>
    );
  }
  const head = <circle cx="100" cy="100" r="78" fill={T.accent} stroke={T.ink} strokeWidth="6" />;
  if (kind === 'eyeroll') {
    return (
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {head}
        <circle cx="70" cy="82" r="20" fill={T.card} stroke={T.ink} strokeWidth="5" />
        <circle cx="130" cy="82" r="20" fill={T.card} stroke={T.ink} strokeWidth="5" />
        <circle cx={72 + wob} cy="69" r="8" fill={T.ink} />
        <circle cx={132 + wob} cy="69" r="8" fill={T.ink} />
        <path d="M72 140 Q100 128 130 138" fill="none" stroke={T.ink} strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'yawn') {
    const m = 22 + Math.abs(Math.sin(fr / 9)) * 10;
    return (
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {head}
        <path d="M52 86 Q70 96 88 86 M112 86 Q130 96 148 86" fill="none" stroke={T.ink} strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="100" cy="138" rx="20" ry={m} fill={T.ink} />
        <text x="150" y="48" fontFamily={fontFamily} fontWeight={900} fontSize="34" fill={T.card} stroke={T.ink} strokeWidth="2">z</text>
        <text x="168" y="24" fontFamily={fontFamily} fontWeight={900} fontSize="24" fill={T.card} stroke={T.ink} strokeWidth="2">z</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      {head}
      <circle cx="70" cy="84" r="22" fill={T.card} stroke={T.ink} strokeWidth="5" />
      <circle cx="130" cy="84" r="22" fill={T.card} stroke={T.ink} strokeWidth="5" />
      <circle cx="70" cy="86" r="7" fill={T.ink} />
      <circle cx="130" cy="86" r="7" fill={T.ink} />
      <ellipse cx="100" cy="142" rx="16" ry={20 + wob} fill={T.ink} />
      <path d="M160 60 Q170 80 160 88 Q150 80 160 60 Z" fill={T.card} stroke={T.ink} strokeWidth="4" />
    </svg>
  );
};

export const Sticker: React.FC<{fr: number; start: number; hold?: number; x: number; y: number; rot: number; kind: Face; label?: string; size?: number}> = ({fr, start, hold = 45, x, y, rot, kind, label, size = 230}) => {
  if (fr < start || fr > start + 10 + hold + 6) return null;
  const s = spring({frame: fr - start, fps: FPS, config: {damping: 9, stiffness: 240}});
  const out = interpolate(fr, [start + 10 + hold, start + 10 + hold + 6], [1, 0], {...clamp, easing: Easing.in(Easing.quad)});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: size, height: size, transform: `rotate(${rot}deg) scale(${s * out})`, borderRadius: 28, background: T.accentSoft, border: '8px solid #fff', boxShadow: '0 12px 30px rgba(0,0,0,.45)', boxSizing: 'border-box', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: label ? '6px 18px 46px 18px' : 14}}>
        <FaceSvg kind={kind} fr={fr} />
      </div>
      {label ? (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', fontFamily, fontWeight: 900, fontSize: size * 0.12, color: T.ink, letterSpacing: '-0.01em'}}>{label}</div>
      ) : null}
    </div>
  );
};

export {clamp, EASE_SLIDE};
