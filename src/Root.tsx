import React from 'react';
import {Composition} from 'remotion';
import {Episode,CharacterPreview} from './Episode';
import {EPISODE} from './config';
import {WangdooLookdev} from './episode2/WangdooLookdev';
import {Episode2} from './episode2/Episode2';
import {EPISODE2} from './episode2/config';
import {CinematicEpisode1,CinematicEpisode2} from './cinematic/Film';
import {PlushLookdev} from './rescue/Lookdev';
import {RescueEpisode1,RescueEpisode2,RescueEpisode3} from './rescue/Film';
import {PlushMemory,TrainingMemory,SecurityFeed,WarningFeed} from './rescue/Assets';
export const RemotionRoot:React.FC=()=><>
  <Composition id="Rescue-Episode1" component={RescueEpisode1} durationInFrames={2160} fps={30} width={1080} height={1920}/>
  <Composition id="Rescue-Episode2" component={RescueEpisode2} durationInFrames={2160} fps={30} width={1080} height={1920}/>
  <Composition id="Rescue-Episode3" component={RescueEpisode3} durationInFrames={2190} fps={30} width={1080} height={1920}/>
  <Composition id="Rescue-Memory-Plush" component={PlushMemory} durationInFrames={30} fps={30} width={960} height={720}/>
  <Composition id="Rescue-Memory-Training" component={TrainingMemory} durationInFrames={30} fps={30} width={960} height={720}/>
  <Composition id="Rescue-Security-Feed" component={SecurityFeed} durationInFrames={60} fps={15} width={720} height={720}/>
  <Composition id="Rescue-Warning-Feed" component={WarningFeed} durationInFrames={60} fps={15} width={720} height={720}/>
  <Composition id="Wangdoo-Plush-Master" component={PlushLookdev} durationInFrames={90} fps={30} width={1080} height={1350}/>
  <Composition id="Cinematic-Episode1" component={CinematicEpisode1} durationInFrames={1740} fps={30} width={1080} height={1920}/>
  <Composition id="Cinematic-Episode2" component={CinematicEpisode2} durationInFrames={1770} fps={30} width={1080} height={1920}/>
  <Composition id="TheLastWing-Episode2" component={Episode2} durationInFrames={EPISODE2.durationInFrames} fps={EPISODE2.fps} width={EPISODE2.width} height={EPISODE2.height}/>
  <Composition id="Wangdoo-Episode2" component={WangdooLookdev} durationInFrames={120} fps={30} width={1080} height={1350}/>
  <Composition id="TheLastWing-Episode1" component={Episode} durationInFrames={EPISODE.durationInFrames} fps={EPISODE.fps} width={EPISODE.width} height={EPISODE.height}/>
  <Composition id="CharacterPreview" component={CharacterPreview} durationInFrames={120} fps={30} width={1080} height={1350}/>
</>;
