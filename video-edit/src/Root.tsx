import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {DURATION} from './data';
export const Root: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
);
