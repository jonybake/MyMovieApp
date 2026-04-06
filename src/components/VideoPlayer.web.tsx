import React from 'react';

type VideoPlayerProps = {
  url: string;
};

export default function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <video
      src={url}
      controls
      playsInline
      preload="metadata"
      style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
    />
  );
}
