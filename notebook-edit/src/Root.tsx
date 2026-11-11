import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {FPS} from './theme';
import {DURATION_SEC} from './timing';

export const RemotionRoot: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={Math.floor(DURATION_SEC * FPS)} fps={FPS} width={1080} height={1920} />
);
