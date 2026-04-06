import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import { loadMovieDetail, loadMovieVideos, MovieCast, MovieDetail, MovieVideo } from '../api';
import { getPosterUrl } from '../utils/image';

type NavigationLike = {
  goBack: () => void;
};

type DetailScreenProps = {
  navigation: NavigationLike;
  route?: {
    params?: {
      movieId?: number;
    };
  };
};

const fallbackVideoUrl = 'https://vjs.zencdn.net/v/oceans.mp4';

function getMovieYear(movie?: MovieDetail) {
  return movie?.release_date?.slice(0, 4) || '待定';
}

function getTrailerUrl(video?: MovieVideo) {
  if (!video) {
    return '';
  }

  if (video.site === 'YouTube') {
    return `https://www.youtube.com/watch?v=${video.key}`;
  }

  if (video.site === 'Vimeo') {
    return `https://vimeo.com/${video.key}`;
  }

  return '';
}

export default function DetailScreen({ navigation, route }: DetailScreenProps) {
  const movieId = route?.params?.movieId;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!movieId) {
        setLoading(false);
        return;
      }

      try {
        const [detail, movieVideos] = await Promise.all([
          loadMovieDetail(movieId),
          loadMovieVideos(movieId),
        ]);

        if (mounted) {
          setMovie(detail);
          setVideos(movieVideos);
        }
      } catch (error) {
        console.error('Failed to load movie detail', error);
        if (mounted) {
          setMovie(null);
          setVideos([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [movieId]);

  const trailer = useMemo(
    () =>
      videos.find((item) => item.site === 'YouTube' && item.type === 'Trailer') ||
      videos.find((item) => item.site === 'YouTube') ||
      videos[0],
    [videos],
  );
  const trailerUrl = getTrailerUrl(trailer);
  const castList = movie?.credits?.cast?.slice(0, 8) ?? [];
  const genreLabel = movie?.genres?.map((item) => item.name).join(' / ') || '电影';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090909" />
      <View style={styles.container}>
        <View style={styles.playerSection}>
          <VideoPlayer url={fallbackVideoUrl} />
          <View style={styles.playerOverlay} pointerEvents="box-none">
            <View style={styles.playerTop} pointerEvents="box-none">
              <Pressable
                style={[styles.circleButton, styles.circleButtonFirst]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.circleButtonText}>{'<'}</Text>
              </Pressable>
              <View style={styles.playerActions} pointerEvents="box-none">
                {trailerUrl ? (
                  <Pressable
                    style={styles.trailerButton}
                    onPress={() => Linking.openURL(trailerUrl)}
                  >
                    <Text style={styles.trailerButtonText}>打开预告片</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            <View style={styles.progressWrap} pointerEvents="none">
              <Text style={styles.playerTip}>TMDB 仅提供预告片链接，不提供正片流</Text>
            </View>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#ff5b55" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.titleRow}>
              <Text style={styles.title}>{movie?.title || '影片详情'}</Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreLabel}>
                  评分 {movie ? movie.vote_average.toFixed(1) : '0.0'}
                </Text>
              </View>
              <Text style={styles.metaText}>{getMovieYear(movie || undefined)}</Text>
              <Text style={styles.metaDivider}>·</Text>
              <Text style={styles.metaText}>{genreLabel}</Text>
            </View>

            <Text style={styles.overview}>
              {movie?.overview || '暂无详情介绍。'}
            </Text>

            {trailerUrl ? (
              <Pressable
                style={styles.trailerLinkCard}
                onPress={() => Linking.openURL(trailerUrl)}
              >
                <Text style={styles.trailerLabel}>预告片链接</Text>
                <Text style={styles.trailerValue} numberOfLines={1}>
                  {trailerUrl}
                </Text>
              </Pressable>
            ) : null}

            {castList.length ? (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>演员表</Text>
                  <Text style={styles.sectionHint}>{castList.length} 位</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.castRow}
                >
                  {castList.map((item: MovieCast) => (
                    <View key={item.id} style={styles.castCard}>
                      <Image
                        source={{ uri: getPosterUrl(item.profile_path) }}
                        style={styles.castAvatar}
                      />
                      <Text style={styles.castName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.castRole} numberOfLines={1}>
                        {item.character || '演员'}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090909',
  },
  container: {
    flex: 1,
    backgroundColor: '#090909',
  },
  playerSection: {
    position: 'relative',
    height: 250,
    backgroundColor: '#000000',
  },
  playerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
  },
  playerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.34)',
    marginLeft: 8,
  },
  circleButtonFirst: {
    marginLeft: 0,
  },
  circleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  trailerButton: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,91,85,0.92)',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  trailerButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  progressWrap: {
    alignItems: 'flex-start',
  },
  playerTip: {
    color: '#f2f2f2',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: 96,
  },
  titleRow: {
    paddingHorizontal: 18,
    marginTop: 18,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  scoreBadge: {
    backgroundColor: '#ff9d48',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  scoreLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  metaText: {
    color: '#bdbdbd',
    fontSize: 14,
    marginLeft: 10,
  },
  metaDivider: {
    color: '#7d7d7d',
    fontSize: 14,
    marginLeft: 10,
  },
  overview: {
    color: '#b8bfd1',
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 18,
    marginTop: 14,
  },
  trailerLinkCard: {
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: '#111827',
    padding: 14,
  },
  trailerLabel: {
    color: '#f3f4f6',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  trailerValue: {
    color: '#9ca3af',
    fontSize: 12,
  },
  section: {
    marginTop: 26,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionHint: {
    color: '#7f7f7f',
    fontSize: 12,
    fontWeight: '600',
  },
  castRow: {
    paddingHorizontal: 18,
    paddingRight: 6,
  },
  castCard: {
    width: 92,
    marginRight: 12,
  },
  castAvatar: {
    width: 92,
    height: 120,
    borderRadius: 14,
    backgroundColor: '#262626',
    marginBottom: 8,
  },
  castName: {
    color: '#ebebeb',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  castRole: {
    color: '#9ca3af',
    fontSize: 11,
  },
});
