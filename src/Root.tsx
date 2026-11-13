import React from 'react';
import {Composition} from 'remotion';
import {Episode,CharacterPreview} from './Episode';
import {EPISODE} from './config';
export const RemotionRoot:React.FC=()=><>
  <Composition id="TheLastWing-Episode1" component={Episode} durationInFrames={EPISODE.durationInFrames} fps={EPISODE.fps} width={EPISODE.width} height={EPISODE.height}/>
  <Composition id="CharacterPreview" component={CharacterPreview} durationInFrames={120} fps={30} width={1080} height={1350}/>
</>;
