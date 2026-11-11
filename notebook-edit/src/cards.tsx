import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {T, FONT, L} from './theme';
import {at, f} from './timing';
import {CardShell, Check, Chip, Eyebrow, Highlight, Icon, Limit, Sparkles, SquareGrid, Strike, useCamera, useCount, useEnter, prog, ez, CamKey} from './parts';

const title: React.CSSProperties = {fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 16, lineHeight: 1.15};
const rowText: React.CSSProperties = {fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em'};

/* ---------- viewport: clips cards to the panel above the caption ---------- */
export const CardViewport: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: L.W, height: 600, overflow: 'hidden'}}>{children}</div>
);

/* A card concept placed at the locked card slot, with enter + camera */
export const Slot: React.FC<{start: number; h: number; cam?: CamKey[]; children: React.ReactNode}> = ({start, h, cam = [], children}) => {
  const enter = useEnter(start);
  const camT = useCamera(cam, h);
  return (
    <div style={{position: 'absolute', left: L.cardLeft, top: L.cardTop, width: L.cardW, height: h, ...enter}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: L.cardW, height: h, transform: camT.transform, transformOrigin: '0 0'}}>{children}</div>
    </div>
  );
};

/* Carousel: sibling cards on a strip, 40px gap, neighbours peek */
export const Carousel: React.FC<{switches: number[]; children: React.ReactNode[]}> = ({switches, children}) => {
  const frame = useCurrentFrame();
  // index advances by one card width at each switch
  const pos = switches.reduce((acc, s) => acc + prog(frame, s, 12, ez.out), 0);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, transform: `translateX(${-pos * (L.cardW + 40)}px)`}}>
      {children.map((c, i) => (
        <div key={i} style={{position: 'absolute', left: i * (L.cardW + 40), top: 0}}>
          {c}
        </div>
      ))}
    </div>
  );
};

/* ================= B1 · The master plan ================= */
const PLAN = [
  {n: 1, icon: 'calendar', t: 'Daily planning', w: ['planning', 6]},
  {n: 2, icon: 'wallet', t: 'Expense tracking', w: ['expense', 7]},
  {n: 3, icon: 'dumbbell', t: 'Gym routine', w: ['gym', 8]},
  {n: 4, icon: 'book', t: 'Reading habit', w: ['reading', 9]},
] as const;
export const PlanCard: React.FC = () => (
  <CardShell h={480}>
    <Eyebrow icon="list">New me · from Monday</Eyebrow>
    <div style={title}>
      <Highlight at={at('Monday')}>The master plan</Highlight>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18}}>
      {PLAN.map((r) => {
        const a = at(r.w[0], r.w[1]);
        return (
          <div key={r.n} style={{height: 64, border: `2px solid ${T.ink}`, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16, padding: '0 14px 0 9px', boxSizing: 'border-box'}}>
            <Chip n={r.n} at={a} />
            <Icon name={r.icon} size={26} color={T.ink} />
            <div style={{...rowText, flex: 1}}>{r.t}</div>
            <Check at={a + 2} filled />
          </div>
        );
      })}
    </div>
  </CardShell>
);
export const planCam: () => CamKey[] = () => [
  {t: at('planning'), s: 1.5, x: 421, y: 182},
  {t: at('expense'), s: 1.5, x: 421, y: 258},
  {t: at('gym'), s: 1.5, x: 421, y: 334},
  {t: at('reading'), s: 1.5, x: 421, y: 410},
  {t: at('habit'), s: 1, x: 421, y: 240},
];

/* ================= B1b · Organisation level ================= */
export const SystematicCard: React.FC = () => {
  const s = at('systematic');
  const n = useCount(0, 100, s, 24);
  return (
    <CardShell h={430}>
      <Eyebrow icon="gauge">Organisation level</Eyebrow>
      <div style={title}>
        Life: <Highlight at={at('ekdum')}>ekdum systematic</Highlight>
      </div>
      <div style={{fontSize: 120, fontWeight: 900, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginTop: 18}}>{Math.round(n)}%</div>
      <div style={{marginTop: 22}}>
        <Limit keys={[[0, 4], [at('kuch', 11.5), 22], [s, 100]]} labels={['0%', 'meh', '50%', 'new me', '100%']} />
      </div>
    </CardShell>
  );
};

/* ================= B2 · One small problem ================= */
export const ProblemCard: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    {t: 'Scribbles', a: at('kharab')},
    {t: 'Cutting', a: at('nahi', 16)},
    {t: 'Messy writing', a: at('chahiye')},
  ];
  return (
    <CardShell h={480}>
      <Eyebrow icon="alert">One small problem</Eyebrow>
      <div style={title}>
        Par ek <Highlight at={at('problem')}>problem</Highlight> hai…
      </div>
      <div style={{display: 'flex', gap: 30, marginTop: 22}}>
        {/* the sacred first page */}
        <div style={{width: 330, height: 280, border: `2.5px solid ${T.ink}`, borderRadius: 14, background: '#FFFDF7', position: 'relative', boxSizing: 'border-box', padding: '18px 22px', flexShrink: 0}}>
          <div style={{fontSize: 30, fontWeight: 900, letterSpacing: '-0.02em'}}>
            <Highlight at={at('first')}>PAGE 1</Highlight>
          </div>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{position: 'absolute', left: 22, right: 22, top: 84 + i * 30, height: 2, background: T.hairline}} />
          ))}
          <div style={{position: 'absolute', left: 22, bottom: 16, fontSize: 22, fontWeight: 500, color: T.muted}}>must stay perfect</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 22}}>
          {rows.map((r) => (
            <div key={r.t} style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <Check at={r.a} cross />
              <span style={{...rowText, color: frame >= r.a ? T.muted : T.ink}}>
                <Strike at={r.a}>{r.t}</Strike>
              </span>
            </div>
          ))}
          <div style={{fontSize: 22, fontWeight: 500, color: T.muted, marginTop: 6}}>zero mistakes allowed</div>
        </div>
      </div>
    </CardShell>
  );
};
export const problemCam: () => CamKey[] = () => [
  {t: at('first'), s: 1.7, x: 150, y: 196},
  {t: at('kharab'), s: 1.35, x: 560, y: 290},
  {t: f(17.15), s: 1, x: 421, y: 240},
];

/* ================= B3 · Too pretty to use ================= */
export const ReviewCard: React.FC = () => {
  const frame = useCurrentFrame();
  const k = at('khoobsurat');
  const stamp = f(20.3);
  const sp = interpolate(frame, [stamp, stamp + 6], [1.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shake = frame >= stamp + 6 && frame < stamp + 10 ? Math.sin(frame * 3) * 3 : 0;
  return (
    <CardShell h={460}>
      <Eyebrow icon="sparkle">Notebook review</Eyebrow>
      <div style={{position: 'absolute', left: 34, right: 34, top: 84, height: 300, background: T.accentSoft, border: `2.5px solid ${T.ink}`, borderRadius: 22, display: 'flex', alignItems: 'center', gap: 34, padding: '0 34px', boxSizing: 'border-box'}}>
        {/* notebook illustration */}
        <svg width="170" height="220" viewBox="0 0 170 220" style={{flexShrink: 0}}>
          <rect x="6" y="6" width="158" height="208" rx="12" fill={T.ink} />
          <rect x="6" y="6" width="26" height="208" rx="6" fill={T.accent} stroke={T.ink} strokeWidth="3" />
          <rect x="56" y="60" width="86" height="40" rx="6" fill="none" stroke={T.card} strokeWidth="3" />
          <path d="M150 6v60l-10-8-10 8V6" fill={T.accent} />
        </svg>
        <div>
          <div style={{fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1}}>
            <Highlight at={at('notebook', 18.9)}>Too pretty</Highlight>
            <br />
            to use
          </div>
          <div style={{display: 'flex', gap: 6, marginTop: 18}}>
            {[0, 1, 2, 3, 4].map((i) => {
              const on = frame >= k + i * 3;
              const s = on ? interpolate(frame, [k + i * 3, k + i * 3 + 3, k + i * 3 + 6], [0.6, 1.25, 1], {extrapolateRight: 'clamp'}) : 1;
              return (
                <svg key={i} width="40" height="40" viewBox="0 0 24 24" style={{transform: `scale(${s})`}}>
                  <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" fill={on ? T.accent : 'none'} stroke={T.ink} strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              );
            })}
          </div>
          <div style={{fontSize: 22, fontWeight: 500, color: T.muted, marginTop: 10}}>khoobsurat · 10/10</div>
        </div>
      </div>
      <Sparkles start={f(17.7)} pts={[[60, 100], [700, 96], [250, 330], [740, 330], [440, 90]]} />
      {frame >= stamp && (
        <div style={{position: 'absolute', right: 40, bottom: 26, transform: `translateX(${shake}px) rotate(-8deg) scale(${sp})`, border: `4px solid ${T.ink}`, borderRadius: 12, padding: '6px 18px', fontSize: 34, fontWeight: 900, letterSpacing: '0.06em', background: T.card}}>
          PAGES USED: 0
        </div>
      )}
    </CardShell>
  );
};

/* ================= B4 · One person, many notebooks ================= */
const SATS = [
  {t: 'Rough work', side: -1, y: 170, a: () => at('rough')},
  {t: 'Important', side: 1, y: 170, a: () => at('important')},
  {t: 'Planning', side: -1, y: 290, a: () => at('planning', 25)},
  {t: 'Ideas', side: 1, y: 290, a: () => at('liye', 26) + 4},
  {t: 'Doodles', side: -1, y: 410, a: () => at('liye', 26) + 8},
  {t: 'Maybe later', side: 1, y: 410, a: () => at('liye', 26) + 12},
];
export const NodesCard: React.FC = () => {
  const frame = useCurrentFrame();
  const cx = 421, cy = 290;
  return (
    <CardShell h={480}>
      <Eyebrow icon="nodes">One person · many notebooks</Eyebrow>
      <svg width={842} height={480} style={{position: 'absolute', left: 0, top: 0}}>
        {SATS.map((s) => {
          const a = s.a();
          if (frame < a) return null;
          const x1 = s.side < 0 ? 34 + 210 : 842 - 34 - 210;
          const x2 = s.side < 0 ? cx - 110 : cx + 110;
          return <line key={s.t} x1={x1} y1={s.y} x2={x2} y2={cy} stroke={T.ink} strokeWidth="2" strokeDasharray="7 7" strokeDashoffset={-(frame - a) * 1.2} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: cx - 110, top: cy - 62, width: 220, height: 124, background: T.accentSoft, border: `2.5px solid ${T.ink}`, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, boxSizing: 'border-box'}}>
        <Icon name="pen" size={30} color={T.ink} />
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em'}}>
          <Highlight at={at('alag', 23)}>Just me</Highlight>
        </div>
        <div style={{fontSize: 20, fontWeight: 500, color: T.muted}}>1 brain</div>
      </div>
      {SATS.map((s) => {
        const a = s.a();
        const p = prog(frame, a, 7);
        if (frame < a) return null;
        return (
          <div key={s.t} style={{position: 'absolute', top: s.y - 29, left: s.side < 0 ? 34 : 842 - 34 - 210, width: 210, height: 58, borderRadius: 29, border: `2.5px solid ${T.ink}`, background: T.card, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', boxSizing: 'border-box', transform: `scale(${0.6 + 0.4 * p})`, opacity: p}}>
            <Icon name="book" size={22} color={T.ink} />
            <span style={{fontSize: 24, fontWeight: 700, whiteSpace: 'nowrap'}}>{s.t}</span>
          </div>
        );
      })}
    </CardShell>
  );
};

/* ================= B5 · Notebooks owned → pages written ================= */
export const OwnedCard: React.FC = () => {
  const s = f(26.5);
  const n = useCount(0, 12, s, 30);
  return (
    <CardShell h={470}>
      <Eyebrow icon="book">Notebooks owned</Eyebrow>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, marginTop: 14}}>
        <div style={{fontSize: 150, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.95, fontVariantNumeric: 'tabular-nums'}}>
          <Highlight at={f(27.5)} pad={10}>{Math.round(n)}</Highlight>
        </div>
        <div style={{fontSize: 30, fontWeight: 600, paddingBottom: 18}}>notebooks</div>
      </div>
      <div style={{marginTop: 30}}>
        <SquareGrid total={12} filled={n} cols={6} size={56} gap={14} />
      </div>
    </CardShell>
  );
};
export const ownedCam: () => CamKey[] = () => [
  {t: f(27.7), s: 1.6, x: 150, y: 150},
  {t: f(28.45), s: 1, x: 421, y: 235},
];

export const PagesCard: React.FC = () => {
  const frame = useCurrentFrame();
  const w0 = f(29.45);
  const shake = frame >= w0 && frame < w0 + 8 ? Math.sin((frame - w0) * 2.4) * 2 : 0;
  return (
    <CardShell h={470}>
      <Eyebrow icon="pen">Pages actually written</Eyebrow>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, marginTop: 14, transform: `translateX(${shake}px)`}}>
        <div style={{fontSize: 150, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.95}}>1</div>
        <div style={{fontSize: 30, fontWeight: 600, paddingBottom: 18}}>
          page <span style={{color: T.muted, fontWeight: 500}}>(it's perfect)</span>
        </div>
      </div>
      <div style={{marginTop: 30}}>
        <SquareGrid total={12} filled={frame >= w0 ? 1 : 0} cols={6} size={56} gap={14} />
      </div>
    </CardShell>
  );
};

/* ================= B6 · Organised: +0% (turning point) ================= */
export const BarsCard: React.FC = () => {
  const frame = useCurrentFrame();
  const s = f(30.1);
  const line = f(32.2);
  const lp = prog(frame, line, 14, ez.inOut);
  const barH = 70, base = 400, bw = 66, gap = 26, x0 = 60;
  return (
    <CardShell h={480}>
      <Eyebrow icon="bars">Organised · last 8 weeks</Eyebrow>
      <div style={title}>
        <Highlight at={s + 6}>Organised</Highlight> level
      </div>
      <svg width={842} height={480} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={40} y1={base} x2={800} y2={base} stroke={T.ink} strokeWidth="2.5" />
        {Array.from({length: 8}).map((_, i) => {
          const p = prog(frame, s + 2 + i * 2, 9);
          const h = barH * p;
          const x = x0 + i * (bw + gap);
          return (
            <g key={i}>
              <rect x={x} y={base - h} width={bw} height={h} rx={8} fill={i === 7 ? T.accent : 'none'} stroke={T.ink} strokeWidth="2.5" />
              <text x={x + bw / 2} y={base + 32} textAnchor="middle" fontFamily={FONT} fontSize="22" fontWeight={500} fill={T.muted}>
                W{i + 1}
              </text>
            </g>
          );
        })}
        {frame >= s + 18 && (
          <text x={x0 + 7 * (bw + gap) + bw / 2} y={base - barH - 18} textAnchor="middle" fontFamily={FONT} fontSize="30" fontWeight={900} fill={T.ink}>
            +0%
          </text>
        )}
        <line x1={40} y1={base - barH - 2} x2={40 + 760 * lp} y2={base - barH - 2} stroke={T.ink} strokeWidth="3" strokeDasharray="10 8" />
      </svg>
    </CardShell>
  );
};
export const barsCam: () => CamKey[] = () => [
  {t: f(31.0), s: 1.7, x: 60 + 7 * 92 + 33, y: 330},
  {t: f(32.6), s: 1, x: 421, y: 240},
];
