import React from 'react';
import {Composition} from 'remotion';
import {DURACAO_FRAMES as D001, Video001} from './videos/VIDEO_001/Video001';

export const FPS = 30;

// Uma <Composition> por vídeo (id = VIDEO-NNN: o Remotion não aceita "_" no id), com o código em src/videos/<video_id>/.
export const Root: React.FC = () => (
  <>
    <Composition id="VIDEO-001" component={Video001} durationInFrames={D001} fps={30} width={1080} height={1920} />
  </>
);
