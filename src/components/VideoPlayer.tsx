import React from 'react';
import Video from 'react-native-video';
import { StyleSheet } from 'react-native';

type VideoPlayerProps = {
  url: string;
};

export default function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <Video
      source={{ uri: url }}
      style={styles.fullScreen}
      controls={true}
      resizeMode="contain"
    />
  );
}
const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
});
