import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ArrowLeft } from '@tamagui/lucide-icons';
import VideoPlayer from '../components/VideoPlayer';

type PlayerRouteParams = {
  videoUrl?: string;
};

type PlayerScreenProps = {
  route: {
    params?: PlayerRouteParams;
  };
  navigation: {
    goBack: () => void;
  };
};

export default function PlayerScreen({
  route,
  navigation,
}: PlayerScreenProps) {
  const videoUrl =
    route.params?.videoUrl ?? 'https://vjs.zencdn.net/v/oceans.mp4';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="#ffffff" size={20} />
        </Pressable>
        <Text style={styles.headerText}>正在播放</Text>
      </View>

      <View style={styles.videoContainer}>
        <VideoPlayer url={videoUrl} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerText: {
    marginLeft: 12,
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
