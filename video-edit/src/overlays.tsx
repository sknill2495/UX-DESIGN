import React from 'react';
import {interpolate, spring} from 'remotion';
import {T, FPS, fontFamily, EASE_SLIDE} from './theme';
import {A, WORDS, modeAt} from './data';
import {StreakIn, FloatChips, Sticker, TypeOn, lerp, clamp, Check} from './parts';

const shadowText = '0 4px 18px rgba(0,0,0,.55)';

/* ---------- One-word captions ---------- */
export const Captions: React.FC<{fr: number}> = ({fr}) => {
  const w = WORDS.find((x) => fr >= x.s && fr < x.e);
  if (!w) return null;
  const mode = modeAt(w.s + 1);
  const size = mode === 'B' ? 96 : mode === 'A' ? 88 : 84;
  const centerY = mode === 'B' ? 655 : mode === 'A' ? 1700 : 1180;
  const est = w.w.length * size * 0.6;
  const fit = Math.min(1, (1080 * 0.86) / est);
  const pop = w.emph ? interpolate(fr, [w.s, w.s + 4], [0.92, 1], clamp) : 1;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: centerY - 60, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily, fontWeight: 800, fontSize: size * fit, letterSpacing: mode === 'B' ? '-0.03em' : '-0.02em', color: T.white, transform: `scale(${pop})`, textShadow: mode === 'B' ? 'none' : shadowText, whiteSpace: 'nowrap'}}>
        {w.w}
      </div>
    </div>
  );
};

/* ---------- Mode A: hook 0–3.9 s ---------- */
export const Hook: React.FC<{fr: number}> = ({fr}) => {
  if (fr >= 117) return null;
  const tile = spring({frame: fr, fps: FPS, config: {damping: 9, stiffness: 200}});
  return (
    <>
      <FloatChips fr={fr} chips={[{x: 36, y: 560, w: 150, d: 2}, {x: 890, y: 520, w: 140, d: 5}, {x: 920, y: 860, w: 120, d: 8}, {x: 40, y: 1560, w: 130, d: 11}, {x: 880, y: 1560, w: 150, d: 14}]} />
      <div style={{position: 'absolute', left: 90, top: 990, width: 170, height: 170, borderRadius: 26, background: T.accent, border: `3px solid ${T.ink}`, boxShadow: `8px 8px 0 ${T.shadowHard}`, transform: `rotate(-6deg) scale(${tile})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="80" height="80" viewBox="0 0 80 80"><path d="M24 14 L66 40 L24 66 Z" fill={T.ink} strokeLinejoin="round" stroke={T.ink} strokeWidth="6" /></svg>
      </div>
      <StreakIn fr={fr} start={6} x={292} y={1020} h={110}>
        <div style={{fontFamily, fontWeight: 900, fontSize: 92, letterSpacing: '-0.04em', color: T.white, textShadow: `4px 6px 0 ${T.shadowHard}`, lineHeight: 1}}>MOVIE<br />NIGHT</div>
      </StreakIn>
      <StreakIn fr={fr} start={16} x={90} y={1196} h={190}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <div style={{fontFamily, fontWeight: 900, fontSize: 44, color: T.white, textShadow: shadowText}}>spent</div>
          <div style={{fontFamily, fontWeight: 900, fontSize: 176, letterSpacing: '-0.05em', lineHeight: 0.9, color: T.accent, background: T.ink, padding: '6px 22px 12px', borderRadius: 14, textShadow: '0 0 18px rgba(232,178,58,0.45)'}}>30 MIN</div>
        </div>
      </StreakIn>
      <StreakIn fr={fr} start={26} x={96} y={1420} h={60}>
        <div style={{fontFamily, fontWeight: 800, fontSize: 42, letterSpacing: '-0.01em', color: T.white, textShadow: shadowText}}>choosing a movie. <span style={{color: T.accent}}>0 min</span> watching.</div>
      </StreakIn>
      <Sticker fr={fr} start={57} hold={48} x={205} y={890} rot={8} kind="popcorn" size={170} />
    </>
  );
};

/* ---------- Mode A′: clock counter 20.33–28.17 s ---------- */
export const ClockCounter: React.FC<{fr: number}> = ({fr}) => {
  if (fr < 610 || fr >= 845) return null;
  const n = Math.round(interpolate(fr, [612, A.minute], [0, 30], clamp));
  const pop = fr >= A.minute ? interpolate(fr, [A.minute, A.minute + 6], [1.14, 1], clamp) : 1;
  const inP = spring({frame: fr - 610, fps: FPS, config: {damping: 14, stiffness: 220}});
  return (
    <div style={{position: 'absolute', left: 64, top: 1360, fontFamily, transform: `scale(${0.86 + 0.14 * inP})`, opacity: Math.min(1, (fr - 610) / 6), transformOrigin: '0 100%'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
        <div style={{fontSize: 220, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9, color: T.accent, textShadow: `5px 7px 0 ${T.shadowHard}, 0 0 18px rgba(232,178,58,0.45)`, fontVariantNumeric: 'tabular-nums', transform: `scale(${pop})`, transformOrigin: '0 100%'}}>{n}</div>
        <div style={{fontSize: 64, fontWeight: 900, color: T.white, textShadow: shadowText}}>MIN</div>
      </div>
      <div style={{fontSize: 44, fontWeight: 800, color: T.white, textShadow: shadowText, marginTop: 14, letterSpacing: '-0.01em'}}>choosing a movie</div>
      <div style={{fontSize: 44, fontWeight: 800, color: T.accent, textShadow: shadowText, marginTop: 6, letterSpacing: '-0.01em', height: 54}}>
        <TypeOn fr={fr} start={A.mood} text="0 min watching" cps={22} />
      </div>
    </div>
  );
};

/* ---------- Mode C: reels phone card + persistent keyword 28.17–end ---------- */
const SWIPES = [900, 930, 958, 984, 1008, 1030, 1050, 1068, 1083];
export const ReelsCard: React.FC<{fr: number}> = ({fr}) => {
  if (fr < 845) return null;
  const start = 845;
  const s = spring({frame: fr - start, fps: FPS, config: {damping: 14, stiffness: 220}});
  let idx = 0;
  for (const sw of SWIPES) idx += interpolate(fr, [sw, sw + 8], [0, 1], {...clamp, easing: EASE_SLIDE});
  const count = SWIPES.filter((sw) => fr >= sw + 4).length + 1;
  const VH = 420;
  const fills = [T.ink, T.muted, T.panel];
  const heart = fr >= A.firstTap;
  return (
    <div style={{position: 'absolute', left: 36, top: 130, width: 330, height: 610, borderRadius: 40, background: T.card, border: `3px solid ${T.cardStroke}`, boxShadow: '0 18px 50px rgba(0,0,0,0.5)', transform: `scale(${0.86 + 0.14 * s}) rotate(-2deg)`, opacity: Math.min(1, (fr - start) / 7), fontFamily, color: T.ink, overflow: 'hidden'}}>
      <div style={{height: 54, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', fontSize: 22, fontWeight: 800}}>
        <span style={{display: 'inline-flex', width: 26, height: 26, borderRadius: 8, background: T.accent, border: `2px solid ${T.ink}`, alignItems: 'center', justifyContent: 'center', fontSize: 12}}>▶</span>
        Reels
        <span style={{marginLeft: 'auto', fontSize: 18, color: T.muted, fontWeight: 600}}>for you</span>
      </div>
      <div style={{position: 'absolute', left: 14, top: 56, width: 296, height: VH, borderRadius: 20, overflow: 'hidden', border: `2.5px solid ${T.ink}`}}>
        <div style={{position: 'absolute', left: 0, top: -idx * VH, width: '100%'}}>
          {Array.from({length: 11}).map((_, k) => (
            <div key={k} style={{height: VH, background: fills[k % 3], position: 'relative'}}>
              <div style={{position: 'absolute', left: 22, top: 150, fontSize: 40, fontWeight: 900, color: T.white, letterSpacing: '-0.03em'}}>reel #{k + 1}</div>
              <div style={{position: 'absolute', left: 22, bottom: 30, width: 170}}>
                <div style={{height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.75)', marginBottom: 9}} />
                <div style={{height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.4)', width: '60%'}} />
              </div>
              <div style={{position: 'absolute', right: 16, bottom: 30, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center'}}>
                <svg width="34" height="32" viewBox="0 0 24 22"><path d="M12 20 C5 14 2 11 2 7 A5 5 0 0 1 12 5 A5 5 0 0 1 22 7 C22 11 19 14 12 20 Z" fill={k === 0 && heart ? T.accent : 'none'} stroke="#fff" strokeWidth="2" /></svg>
                <div style={{width: 30, height: 26, borderRadius: 8, border: '2.5px solid #fff'}} />
                <svg width="30" height="28" viewBox="0 0 24 22"><path d="M3 11 L21 3 L14 20 L11 13 Z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 22, right: 22, top: 56 + VH + 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontSize: 20, fontWeight: 700, letterSpacing: '0.1em', color: T.muted}}>REELS WATCHED</div>
        <div style={{fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', background: fr >= SWIPES[3] ? T.accentSoft : 'transparent', border: fr >= SWIPES[3] ? `2px solid ${T.ink}` : '2px solid transparent', borderRadius: 8, padding: '0 10px'}}>{count}</div>
      </div>
      <div style={{position: 'absolute', left: 22, right: 22, top: 56 + VH + 92, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 600}}>
        <Check fr={fr} start={A.firstTap} />
        <span>movie chosen</span>
        <span style={{marginLeft: 'auto', color: T.muted}}>never</span>
      </div>
    </div>
  );
};

export const Keyword: React.FC<{fr: number}> = ({fr}) => {
  if (fr < A.reel) return null;
  const s = spring({frame: fr - A.reel, fps: FPS, config: {damping: 10, stiffness: 220}});
  const ul = lerp(fr, 1085 - 30, 1085 - 20, 0, 1);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1560, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily}}>
      <div style={{position: 'relative', fontSize: 120, fontWeight: 900, letterSpacing: '-0.03em', color: T.accent, textShadow: `4px 6px 0 ${T.shadowHard}, 0 0 18px rgba(232,178,58,0.45)`, transform: `scale(${s})`, lineHeight: 1}}>
        ‘ek reel’
        <div style={{position: 'absolute', left: 10, right: 10, bottom: -14, height: 6, borderRadius: 3, background: T.white, transformOrigin: '0 50%', transform: `scaleX(${ul})`}} />
      </div>
      <div style={{fontSize: 46, fontWeight: 800, color: T.white, textShadow: shadowText, marginTop: 34, height: 60, letterSpacing: '-0.01em'}}>
        <TypeOn fr={fr} start={A.chime} text="…famous last words" cps={20} />
      </div>
    </div>
  );
};

export const Stickers: React.FC<{fr: number}> = ({fr}) => (
  <>
    <Sticker fr={fr} start={A.chuka} hold={40} x={800} y={1640} rot={6} kind="eyeroll" label="seen it" />
    <Sticker fr={fr} start={A.kuchAur + 2} hold={46} x={90} y={1500} rot={-7} kind="yawn" label="boring" />
    <Sticker fr={fr} start={A.action} hold={36} x={800} y={1200} rot={5} kind="shock" label="too loud" />
  </>
);
