import{FakeSOSFilm}from'./fakeSOS/Film';
import{Security as FakeSOSSecurity,MissingPortrait as FakeSOSPortrait}from'./fakeSOS/Security';
import{ExpressionGate as FakeSOSExpressions}from'./fakeSOS/ExpressionGate';
import{ThreeKnocksFilm}from'./threeKnocks/Film';
import{Security,SecurityFinale,MissingPortrait,ScoutLook}from'./threeKnocks/Security';
import {EmptyRoomFilm}from './emptyRoom/Film';
import {RoomCharacterGate}from './emptyRoom/CharacterGate';
import {RoomShipLive}from './emptyRoom/ShipLive';
import React from 'react';
import {ResetFilm}from './reset/Film';
import {ResetCharacterGate}from './reset/CharacterGate';
import {ResetShipLive}from './reset/ShipLive';
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
  <Composition id="Fake-SOS-Episode1" component={FakeSOSFilm} durationInFrames={2160} fps={30} width={1080} height={1920}/>
  <Composition id="Fake-SOS-Security" component={FakeSOSSecurity} durationInFrames={270} fps={30} width={960} height={720}/>
  <Composition id="Fake-SOS-Portrait" component={FakeSOSPortrait} durationInFrames={30} fps={30} width={960} height={1080}/>
  <Composition id="Fake-SOS-Expressions" component={FakeSOSExpressions} durationInFrames={180} fps={30} width={1080} height={1350}/>
  <Composition id="Three-Knocks-Episode1" component={ThreeKnocksFilm} durationInFrames={2160} fps={30} width={1080} height={1920}/>
  <Composition id="Three-Knocks-Security-Entry" component={Security} durationInFrames={300} fps={30} width={960} height={720}/>
  <Composition id="Three-Knocks-Security-Finale" component={SecurityFinale} durationInFrames={120} fps={30} width={960} height={720}/>
  <Composition id="Three-Knocks-Missing-Portrait" component={MissingPortrait} durationInFrames={30} fps={30} width={960} height={1080}/>
  <Composition id="Three-Knocks-Scout-Look" component={ScoutLook} durationInFrames={30} fps={30} width={1080} height={1350}/>

  <Composition id="Empty-Room-Episode1" component={EmptyRoomFilm} durationInFrames={2040} fps={30} width={1080} height={1920}/>
  <Composition id="Empty-Room-Characters" component={RoomCharacterGate} durationInFrames={120} fps={30} width={1080} height={1350}/>
  <Composition id="Empty-Room-Ship-Live" component={RoomShipLive} durationInFrames={300} fps={30} width={960} height={720}/>
  <Composition id="Reset-Episode1" component={ResetFilm} durationInFrames={2100} fps={30} width={1080} height={1920}/>
  <Composition id="Reset-Opening" component={ResetFilm} durationInFrames={450} fps={30} width={1080} height={1920}/>
  <Composition id="Reset-Character-Gate" component={ResetCharacterGate} durationInFrames={120} fps={30} width={1080} height={1350}/>
  <Composition id="Reset-Ship-Live" component={ResetShipLive} durationInFrames={180} fps={30} width={960} height={720}/>
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
