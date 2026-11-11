import React from 'react';
import {AbsoluteFill, OffthreadVideo, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {T, PANEL_SOLID, PANEL_FADE_END} from './theme';
import {DY, modeAt, shotAt, A} from './data';
import {CardBrowse, CardRejected, CardScrolled, CardGenres, CardFatigue} from './cards';
import {Captions, Hook, ClockCounter, ReelsCard, Keyword, Stickers} from './overlays';

const Panel: React.FC = () => {
  const mask = `linear-gradient(to bottom, #000 0px, #000 ${PANEL_SOLID}px, transparent ${PANEL_FADE_END}px)`;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: PANEL_FADE_END, background: T.panel, WebkitMaskImage: mask, maskImage: mask}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${T.dot} 1.5px, transparent 1.6px)`, backgroundSize: '28px 28px', backgroundPosition: '14px 14px'}} />
    </div>
  );
};

const Sfx: React.FC<{at: number; src: string; vol: number}> = ({at, src, vol}) => (
  <Sequence from={at} durationInFrames={20} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);
const db = (d: number) => Math.pow(10, d / 20);

export const Main: React.FC = () => {
  const fr = useCurrentFrame();
  const mode = modeAt(fr);
  const dy = mode === 'B' ? DY[shotAt(fr)] ?? 0 : 0;
  return (
    <AbsoluteFill style={{background: T.panel}}>
      <OffthreadVideo src={staticFile('source.mp4')} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${dy}px)`}} />
      {mode === 'B' ? (
        <>
          <Panel />
          <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 598, overflow: 'hidden'}}>
            {fr >= 117 && fr < 196 ? <CardBrowse fr={fr} /> : null}
            {fr >= 196 && fr < 298 ? <CardRejected fr={fr} /> : null}
            {fr >= 298 && fr < 362 ? <CardScrolled fr={fr} /> : null}
            {fr >= 362 && fr < 529 ? <CardGenres fr={fr} /> : null}
            {fr >= 529 && fr < 610 ? <CardFatigue fr={fr} /> : null}
          </div>
          <Stickers fr={fr} />
        </>
      ) : null}
      <Hook fr={fr} />
      <ClockCounter fr={fr} />
      <ReelsCard fr={fr} />
      <Keyword fr={fr} />
      <Captions fr={fr} />

      {/* sound layer — added only on top of the source mix */}
      <Sfx at={2} src="whoosh" vol={db(-18)} />
      <Sfx at={12} src="whoosh" vol={db(-18)} />
      <Sfx at={22} src="whoosh" vol={db(-20)} />
      <Sfx at={57} src="pop" vol={db(-20)} />
      <Sfx at={A.chuka} src="pop" vol={db(-20)} />
      <Sfx at={A.kuchAur + 2} src="pop" vol={db(-20)} />
      <Sfx at={A.action} src="pop" vol={db(-20)} />
      <Sfx at={400} src="click" vol={db(-22)} />
      <Sfx at={456} src="click" vol={db(-22)} />
      <Sfx at={A.thriller} src="swipe" vol={db(-22)} />
      <Sfx at={A.action} src="swipe" vol={db(-22)} />
      {Array.from({length: 15}).map((_, i) => <Sfx key={i} at={612 + i * 6} src="tick" vol={db(-24)} />)}
      <Sfx at={A.reel} src="pop" vol={db(-20)} />
    </AbsoluteFill>
  );
};
