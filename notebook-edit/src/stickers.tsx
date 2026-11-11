import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {T, FONT} from './theme';

export type Face = 'heart' | 'side' | 'shock' | 'sweat' | 'think' | 'facepalm' | 'money' | 'same';

/* Original illustrated reaction faces (no third-party characters). */
const FaceArt: React.FC<{kind: Face; t: number}> = ({kind, t}) => {
  const blink = t % 54 > 50 ? 0.15 : 1;
  const ink = {stroke: T.ink, strokeWidth: 5, strokeLinecap: 'round' as const, fill: 'none'};
  const eye = (cx: number, dx = 0) => <ellipse cx={cx + dx} cy={70} rx={7} ry={9 * blink} fill={T.ink} />;
  let eyes: React.ReactNode = <>{eye(70)}{eye(110)}</>;
  let mouth: React.ReactNode = <path d="M68 108q22 20 44 0" {...ink} />;
  let extra: React.ReactNode = null;
  switch (kind) {
    case 'heart':
      eyes = (
        <>
          {[70, 110].map((x) => (
            <path key={x} d={`M${x} 82l-12-12a7 7 0 0 1 12-8 7 7 0 0 1 12 8z`} fill={T.ink} transform={`translate(0 ${Math.sin(t / 5) * 2})`} />
          ))}
        </>
      );
      mouth = <path d="M64 104q26 28 52 0z" fill={T.ink} />;
      break;
    case 'side':
      eyes = <>{eye(70, 6)}{eye(110, 6)}<path d="M58 54l22 4M98 58l22-4" {...ink} strokeWidth={4} /></>;
      mouth = <path d="M72 112h34" {...ink} />;
      break;
    case 'shock':
      eyes = <><circle cx={70} cy={70} r={11} {...ink} strokeWidth={4} /><circle cx={110} cy={70} r={11} {...ink} strokeWidth={4} /></>;
      mouth = <ellipse cx={90} cy={114} rx={11} ry={14 + Math.sin(t / 4) * 2} fill={T.ink} />;
      break;
    case 'sweat':
      mouth = <path d="M66 112q6-6 12 0t12 0 12 0 12 0" {...ink} strokeWidth={4} />;
      extra = <path d={`M140 ${44 + (t % 30) * 0.6}q8 12 0 18q-8-6 0-18z`} fill="#8EC5E8" stroke={T.ink} strokeWidth={3} />;
      break;
    case 'think':
      eyes = <>{eye(70, 4)}{eye(110, 4)}<path d="M96 50l26-6" {...ink} strokeWidth={4} /></>;
      mouth = <path d="M74 114l30-6" {...ink} />;
      break;
    case 'facepalm':
      eyes = <><path d="M60 72h20M100 72h20" {...ink} /></>;
      mouth = <path d="M72 116q18-12 36 0" {...ink} />;
      extra = <rect x={40} y={50} width={46} height={58} rx={20} fill={T.card} stroke={T.ink} strokeWidth={4} transform="rotate(-18 63 79)" />;
      break;
    case 'money':
      eyes = (
        <>
          {[70, 110].map((x) => (
            <text key={x} x={x} y={82} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={T.ink}>
              ₹
            </text>
          ))}
        </>
      );
      mouth = <path d="M64 104q26 28 52 0z" fill={T.ink} />;
      break;
    case 'same':
      eyes = <><path d="M60 72q10-10 20 0M100 72q10-10 20 0" {...ink} /></>;
      mouth = <path d="M66 106q24 22 48 0" {...ink} />;
      break;
  }
  return (
    <svg width="180" height="160" viewBox="0 0 180 160">
      <circle cx={90} cy={86} r={64} fill={T.accent} stroke={T.ink} strokeWidth={5} />
      {eyes}
      {mouth}
      {extra}
    </svg>
  );
};

export const Sticker: React.FC<{at: number; x: number; y: number; rot: number; kind: Face; label: string; size?: number; hold?: number}> = ({at, x, y, rot, kind, label, size = 230, hold = 50}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at || frame > at + 10 + hold + 6) return null;
  const sIn = spring({frame: frame - at, fps, config: {damping: 9, stiffness: 260}, durationInFrames: 10});
  const out = interpolate(frame, [at + 10 + hold, at + 10 + hold + 6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const t = frame - at;
  const k = size / 230;
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: 28 * k, border: `${8 * k}px solid #fff`, background: T.card,
        boxShadow: '0 12px 30px rgba(0,0,0,.45)', boxSizing: 'border-box', overflow: 'hidden',
        transform: `rotate(${rot + Math.sin(t / 9) * 1.5}deg) scale(${sIn * out})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{transform: `scale(${k}) translateY(${Math.sin(t / 6) * 3}px)`, marginBottom: -8 * k}}>
        <FaceArt kind={kind} t={t} />
      </div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30 * k, letterSpacing: '-0.02em', color: T.ink, lineHeight: 1}}>{label}</div>
    </div>
  );
};
