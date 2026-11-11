import React from 'react';
import {interpolate} from 'remotion';
import {T, CARD, EASE_SLIDE} from './theme';
import {A} from './data';
import {CardShell, CardSlot, Eyebrow, HL, Check, Strike, TypeOn, countUp, SquareGrid, Poster, Limit, lerp, clamp} from './parts';

const title: React.CSSProperties = {fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 14};
const rowText: React.CSSProperties = {fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em'};
const meta: React.CSSProperties = {fontSize: 22, fontWeight: 500, color: T.muted};

const Pill: React.FC<{children: React.ReactNode; active?: boolean}> = ({children, active}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, height: 70, borderRadius: 35, border: `2px solid ${T.ink}`, padding: '0 22px', boxSizing: 'border-box', background: active ? T.card : 'transparent'}}>
    {children}
  </div>
);

/* B1 — 3.90–6.54 s: scrolling begins (S3 comedy row, S4 remote) */
export const CardBrowse: React.FC<{fr: number}> = ({fr}) => {
  const start = 117, h = 440;
  const seen = countUp(fr, start + 4, 70, 0, 24);
  const tiles = ['COMEDY', 'COMEDY', 'COMEDY', 'COMEDY', 'COMEDY', 'COMEDY'];
  return (
    <CardSlot fr={fr} start={start} h={h} cam={[{f: 160, s: 1.5, x: 300, y: 270, dur: 20}]}>
      <CardShell h={h}>
        <Eyebrow icon="▦" text="TONIGHT · BROWSING" right={
          <div style={{...meta, color: T.ink, fontWeight: 700, border: `2px solid ${T.ink}`, borderRadius: 18, padding: '4px 14px'}}>
            Titles seen <span style={{fontVariantNumeric: 'tabular-nums', fontWeight: 900}}>{seen}</span>
          </div>
        } />
        <div style={title}><HL fr={fr} start={start + 5}>Find something good</HL></div>
        <div style={{display: 'flex', gap: 22, marginTop: 34}}>
          {tiles.map((t, i) => {
            const d = start + 8 + i * 2;
            const y = lerp(fr, d, d + 8, -60, 0);
            const o = interpolate(fr, [d, d + 4], [0, 1], clamp);
            const rejected = i === 0 && fr >= A.nahi1;
            return (
              <div key={i} style={{transform: `translateY(${y}px) rotate(${(i % 2 ? 3 : -3)}deg)`, opacity: o, position: 'relative'}}>
                <Poster label={t} variant={i} dim={rejected} />
                {i === 0 ? <div style={{position: 'absolute', left: 30, top: 50}}><Check fr={fr} start={A.nahi1} kind="x" size={44} /></div> : null}
              </div>
            );
          })}
        </div>
        <div style={{...meta, marginTop: 26}}>Row 1 of 38 · Comedy</div>
      </CardShell>
    </CardSlot>
  );
};

/* B2 — 6.54–9.92 s: rejecting ("pehle dekh chuka", "boring") */
export const CardRejected: React.FC<{fr: number}> = ({fr}) => {
  const start = 196, h = 420;
  const rows: {t: string; m: string; at?: number}[] = [
    {t: 'Already seen it', m: 'watched', at: A.chuka},
    {t: 'Looks boring', m: 'skip', at: A.boring},
    {t: 'Something else?', m: '…'},
  ];
  const rowY = (i: number) => 34 + 30 + 14 + 46 + 28 + i * 84 + 35;
  return (
    <CardSlot fr={fr} start={start} h={h} cam={[{f: A.chuka, s: 1.45, x: 330, y: rowY(0)}, {f: A.boring, s: 1.45, x: 330, y: rowY(1)}]}>
      <CardShell h={h}>
        <Eyebrow icon="✕" text="TONIGHT'S PICK" />
        <div style={title}><HL fr={fr} start={start + 5}>Rejected</HL> so far</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28}}>
          {rows.map((r, i) => (
            <Pill key={i} active={r.at !== undefined && fr >= r.at}>
              <div style={{width: 40, height: 40, borderRadius: 10, background: r.at !== undefined && fr >= r.at ? T.ink : T.hairline, color: T.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900}}>{i + 1}</div>
              <div style={{...rowText, flex: 1}}>{r.at !== undefined ? <Strike fr={fr} start={r.at}>{r.t}</Strike> : r.t}</div>
              <div style={meta}>{r.m}</div>
              {r.at !== undefined ? <Check fr={fr} start={r.at} kind="x" /> : <Check fr={fr} start={99999} />}
            </Pill>
          ))}
        </div>
      </CardShell>
    </CardSlot>
  );
};

/* B3 — 9.92–12.06 s: "kuch aur dekhte hain" → titles scrolled counter */
export const CardScrolled: React.FC<{fr: number}> = ({fr}) => {
  const start = 298, h = 450;
  const n = countUp(fr, start + 4, 30, 0, 140);
  const filled = Math.round((n / 140) * 36);
  return (
    <CardSlot fr={fr} start={start} h={h} cam={[{f: A.aur, s: 1.6, x: 230, y: 150}]}>
      <CardShell h={h}>
        <Eyebrow icon="⌕" text="TITLES SCROLLED" />
        <div style={{fontSize: 150, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, marginTop: 12, fontVariantNumeric: 'tabular-nums'}}>
          <HL fr={fr} start={A.aur}>{n}+</HL>
        </div>
        <div style={{...meta, fontSize: 26, marginTop: 10, color: T.ink, fontWeight: 600}}>
          <TypeOn fr={fr} start={start + 30} text="…and still nothing to watch" />
        </div>
        <div style={{marginTop: 22}}><SquareGrid cols={12} rows={3} filled={filled} size={44} gap={11} /></div>
      </CardShell>
    </CardSlot>
  );
};

/* B4 — 12.06–17.64 s: genre hopping carousel (comedy → thriller → action) */
const GenreCard: React.FC<{fr: number; i: number; name: string; hlAt: number; xAt: number; verdict: string}> = ({fr, i, name, hlAt, xAt, verdict}) => (
  <CardShell h={440} style={{left: i * (CARD.w + 40)}}>
    <Eyebrow icon="◇" text={`GENRE HOPPING · ${i + 1} / 3`} />
    <div style={{...title, fontSize: 56, fontWeight: 900, letterSpacing: '-0.03em'}}><HL fr={fr} start={hlAt}>{name}?</HL></div>
    <div style={{display: 'flex', gap: 18, marginTop: 24}}>
      {[0, 1, 2, 3, 4].map((k) => <Poster key={k} label={name.toUpperCase()} variant={k + i} w={128} h={150} dim={fr >= xAt} />)}
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 24}}>
      <Check fr={fr} start={xAt} kind="x" />
      <div style={rowText}>{fr >= xAt ? <Strike fr={fr} start={xAt}>{verdict}</Strike> : <span style={{color: T.muted}}>{verdict}</span>}</div>
    </div>
  </CardShell>
);

export const CardGenres: React.FC<{fr: number}> = ({fr}) => {
  const start = 362;
  const idx = interpolate(fr, [A.thriller, A.thriller + 12], [0, 1], {...clamp, easing: EASE_SLIDE}) +
    interpolate(fr, [A.action, A.action + 12], [0, 1], {...clamp, easing: EASE_SLIDE});
  return (
    <CardSlot fr={fr} start={start} h={440}>
      <div style={{position: 'absolute', left: -idx * (CARD.w + 40), top: 0}}>
        <GenreCard fr={fr} i={0} name="Comedy" hlAt={start + 3} xAt={400} verdict="Not in the mood" />
        <GenreCard fr={fr} i={1} name="Thriller" hlAt={A.thriller + 8} xAt={456} verdict="Too dark tonight" />
        <GenreCard fr={fr} i={2} name="Action" hlAt={A.action + 8} xAt={512} verdict="Too loud" />
      </div>
    </CardSlot>
  );
};

/* B5 — 17.64–20.33 s: "arre yaar, decide nahi ho raha" → decision fatigue (heaviest beat) */
export const CardFatigue: React.FC<{fr: number}> = ({fr}) => {
  const start = 529, h = 420;
  const p = lerp(fr, start + 4, start + 40, 0, 1);
  return (
    <CardSlot fr={fr} start={start} h={h} cam={[{f: A.decide, s: 1.6, x: 640, y: 210, dur: 16}, {f: A.nahi3, s: 1.5, x: 300, y: 330, dur: 14}]}>
      <CardShell h={h}>
        <Eyebrow icon="▮" text="DECISION FATIGUE" />
        <div style={title}>Brain status</div>
        <div style={{marginTop: 28}}><Limit p={p} w={770} /></div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 26, fontWeight: 700, color: T.muted}}>
          <span>fine</span><span>tired</span><span style={{color: T.ink, fontWeight: 900}}><HL fr={fr} start={A.decide}>done</HL></span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 30}}>
          <div style={{...rowText, fontWeight: 800}}>Decided:</div>
          <Check fr={fr} start={A.nahi3} kind="x" />
          <div style={{...rowText, color: fr >= A.nahi3 ? T.ink : T.muted}}>{fr >= A.nahi3 ? 'nope' : '…'}</div>
          <div style={{...meta, marginLeft: 'auto'}}>{Math.min(100, Math.round(p * 100))}%</div>
        </div>
      </CardShell>
    </CardSlot>
  );
};
