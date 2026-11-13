import React from 'react';
import {Composition} from 'remotion';
import {Episode,CharacterPreview} from './Episode';
import {EPISODE} from './config';
import {WangdooLookdev} from './episode2/WangdooLookdev';
import {Episode2} from './episode2/Episode2';
import {EPISODE2} from './episode2/config';
export const RemotionRoot:React.FC=()=><>
  <Composition id="TheLastWing-Episode1" component={Episode} durationInFrames={EPISODE.durationInFrames} fps={EPISODE.fps} width={EPISODE.width} height={EPISODE.height}/>
  <Composition id="CharacterPreview" component={CharacterPreview} durationInFrames={120} fps={30} width={1080} height={1350}/>
  <Composition id="Wangdoo-Episode2" component={WangdooLookdev} durationInFrames={120} fps={30} width={1080} height={1350}/>
  <Composition id="TheLastWing-Episode2" component={Episode2} durationInFrames={EPISODE2.durationInFrames} fps={EPISODE2.fps} width={EPISODE2.width} height={EPISODE2.height}/>
</>;
