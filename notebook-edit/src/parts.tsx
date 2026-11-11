import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence, Audio, staticFile} from 'remotion';
import {T, FONT} from './theme';

export const ez = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  count: Easing.bezier(0.16, 1, 0.3, 1),
};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const prog = (frame: number, start: number, dur: number, e = ez.out) =>
  interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: e});

/* ---------- SFX ---------- */
export const Sfx: React.FC<{at: number; name: string; vol?: number}> = ({at, name, vol = 0.1}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={30} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
  </Sequence>
);

/* ---------- Icons (line, 2px) ---------- */
export const Icon: React.FC<{name: string; size?: number; color?: string; sw?: number}> = ({name, size = 22, color = T.muted, sw = 2.2}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const paths: Record<string, React.ReactNode> = {
    list: <><path d="M8 6h13M8 12h13M8 18h13" {...p} /><circle cx="4" cy="6" r="1" {...p} /><circle cx="4" cy="12" r="1" {...p} /><circle cx="4" cy="18" r="1" {...p} /></>,
    alert: <><path d="M12 3 2 21h20L12 3z" {...p} /><path d="M12 10v5M12 18v.5" {...p} /></>,
    sparkle: <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" {...p} />,
    nodes: <><circle cx="12" cy="12" r="3" {...p} /><circle cx="4" cy="5" r="2" {...p} /><circle cx="20" cy="5" r="2" {...p} /><circle cx="4" cy="19" r="2" {...p} /><circle cx="20" cy="19" r="2" {...p} /><path d="M6 6l4 4M18 6l-4 4M6 18l4-4M18 18l-4-4" {...p} /></>,
    book: <><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" {...p} /><path d="M4 17a3 3 0 0 1 3-3h11" {...p} /></>,
    bars: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" {...p} />,
    gauge: <><path d="M3 16a9 9 0 0 1 18 0" {...p} /><path d="M12 16l4-5" {...p} /></>,
    pen: <><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" {...p} /><path d="M14 6l3 3" {...p} /></>,
    wallet: <><rect x="3" y="6" width="18" height="13" rx="2" {...p} /><path d="M16 12h3" {...p} /></>,
    dumbbell: <path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12" {...p} />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" {...p} /><path d="M3 10h18M8 3v4M16 3v4" {...p} /></>,
    star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" {...p} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', flexShrink: 0}}>
      {paths[name]}
    </svg>
  );
};

/* ---------- Highlighter wipe ---------- */
export const Highlight: React.FC<{at: number; children: React.ReactNode; pad?: number}> = ({at, children, pad = 8}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 9);
  return (
    <span style={{position: 'relative', display: 'inline-block', whiteSpace: 'nowrap'}}>
      <span
        style={{
          position: 'absolute',
          left: -pad,
          top: -2,
          bottom: -2,
          width: `calc(${p * 100}% + ${2 * pad * p}px)`,
          background: T.accentSoft,
          border: p > 0 ? `2px solid ${T.accentStroke}` : 'none',
          borderRadius: 6,
          boxSizing: 'border-box',
        }}
      />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

/* ---------- Check / Cross ---------- */
export const Check: React.FC<{at: number; cross?: boolean; size?: number; filled?: boolean}> = ({at, cross, size = 34, filled}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 6);
  const on = frame >= at;
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={{flexShrink: 0, display: 'block'}}>
      <rect x="1.5" y="1.5" width="25" height="25" rx="7" fill={on && filled ? T.accent : 'none'} stroke={T.ink} strokeWidth="2.4" />
      {cross ? (
        <>
          <path d="M8 8l12 12" stroke={T.ink} strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 2)} fill="none" />
          <path d="M20 8 8 20" stroke={T.ink} strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, p * 2 - 1)} fill="none" />
        </>
      ) : (
        <path d="M7.5 14.5l4.2 4.2 8.8-9.4" stroke={T.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      )}
    </svg>
  );
};

/* ---------- Strike-through ---------- */
export const Strike: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 7);
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      {children}
      <span style={{position: 'absolute', left: -4, top: '52%', height: 4, background: T.ink, width: `calc(${p * 100}% + 8px)`, borderRadius: 2, opacity: p > 0 ? 1 : 0}} />
    </span>
  );
};

/* ---------- Number chip ---------- */
export const Chip: React.FC<{n: number | string; at: number}> = ({n, at}) => {
  const frame = useCurrentFrame();
  const on = frame >= at;
  const s = on ? interpolate(frame, [at, at + 3, at + 6], [1, 1.18, 1], clamp) : 1;
  return (
    <div
      style={{
        width: 46, height: 46, borderRadius: 12, border: `2.5px solid ${T.ink}`, background: on ? T.accent : T.card,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24, color: T.ink,
        transform: `scale(${s})`, flexShrink: 0, boxSizing: 'border-box',
      }}
    >
      {n}
    </div>
  );
};

/* ---------- Eyebrow ---------- */
export const Eyebrow: React.FC<{icon: string; children: React.ReactNode}> = ({icon, children}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 700, letterSpacing: '0.12em', color: T.muted, textTransform: 'uppercase'}}>
    <Icon name={icon} size={22} />
    {children}
  </div>
);

/* ---------- CountUp ---------- */
export const useCount = (from: number, to: number, start: number, dur = 26) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [from, to], {...clamp, easing: ez.count});
};

/* ---------- Square grid that fills with a count ---------- */
export const SquareGrid: React.FC<{total: number; filled: number; cols: number; size?: number; gap?: number}> = ({total, filled, cols, size = 30, gap = 8}) => (
  <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap}}>
    {Array.from({length: total}).map((_, i) => (
      <div key={i} style={{width: size, height: size, borderRadius: 7, border: `2px solid ${T.ink}`, background: i < Math.round(filled) ? T.accentSoft : 'transparent', boxSizing: 'border-box'}} />
    ))}
  </div>
);

/* ---------- Limit slider ---------- */
export const Limit: React.FC<{keys: [number, number][]; labels: string[]; width?: number}> = ({keys, labels, width = 760}) => {
  const frame = useCurrentFrame();
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t, val] = keys[i];
    const prev = keys[i - 1][1];
    v = frame < t ? v : prev + (val - prev) * prog(frame, t, 14, ez.inOut);
  }
  return (
    <div style={{width}}>
      <div style={{height: 54, borderRadius: 27, border: `3px solid ${T.ink}`, position: 'relative', overflow: 'hidden', boxSizing: 'border-box'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v}%`, background: T.accent, borderRight: v > 0 ? `3px solid ${T.ink}` : 'none'}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 22, fontWeight: 500, color: T.muted}}>
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
};

/* ---------- Sparkles ---------- */
export const Sparkles: React.FC<{pts: [number, number][]; start: number}> = ({pts, start}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {pts.map(([x, y], i) => {
        const t = (frame - start - i * 5) % 30;
        const s = frame < start + i * 5 ? 0 : Math.sin((t / 30) * Math.PI);
        return (
          <svg key={i} width={34} height={34} viewBox="0 0 24 24" style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`}}>
            <path d="M12 2v20M2 12h20" stroke={T.ink} strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      })}
    </>
  );
};

/* ---------- Card shell ---------- */
export const CardShell: React.FC<{h: number; children: React.ReactNode; style?: React.CSSProperties}> = ({h, children, style}) => (
  <div
    style={{
      width: 842, height: h, borderRadius: 28, background: T.card, border: `3px solid ${T.cardStroke}`, boxSizing: 'border-box',
      boxShadow: '0 18px 50px rgba(0,0,0,0.45)', padding: 34, fontFamily: FONT, color: T.ink, position: 'relative', overflow: 'hidden', ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- Card enter (spring scale + opacity) ---------- */
export const useEnter = (start: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - start, fps, config: {damping: 14, stiffness: 220}, durationInFrames: 9});
  return {transform: `scale(${0.86 + 0.14 * s})`, opacity: Math.min(1, (frame - start) / 6)};
};

/* ---------- Camera inside the card ---------- */
export type CamKey = {t: number; s: number; x: number; y: number}; // x,y = card-local focus point
export const useCamera = (keys: CamKey[], h: number) => {
  const frame = useCurrentFrame();
  const base: CamKey = {t: 0, s: 1, x: 421, y: h / 2};
  let cur = {...base};
  let prev = {...base};
  for (const k of keys) {
    if (frame < k.t) break;
    const p = prog(frame, k.t, 20, ez.inOut);
    cur = {t: k.t, s: prev.s + (k.s - prev.s) * p, x: prev.x + (k.x - prev.x) * p, y: prev.y + (k.y - prev.y) * p};
    prev = {...k};
    if (p < 1) break;
  }
  // focus point lands where the card centre sits at rest
  const dx = 421 - cur.s * cur.x;
  const dy = h / 2 - cur.s * cur.y;
  return {transform: `translate(${dx}px, ${dy}px) scale(${cur.s})`, transformOrigin: '0 0', scale: cur.s};
};
