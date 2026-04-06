import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  loadMovieGenres,
  loadPopularMovies,
  MovieGenre,
  PopularMovie,
} from '../api';
import { getBackdropUrl, getPosterUrl } from '../utils/image';

type NavigationLike = {
  navigate: (screen: string) => void;
};

type HomeScreenProps = {
  navigation: NavigationLike;
};

function getMovieMeta(movie: PopularMovie) {
  const year = movie.release_date?.slice(0, 4) || '待定';
  return `${year} · 热门电影`;
}

function SectionHeader({
  title,
  actionLabel,
  onPress,
}: {
  title: string;
  actionLabel: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onPress}>
        <Text style={styles.sectionAction}>
          {actionLabel} {'>'}
        </Text>
      </Pressable>
    </View>
  );
}

function MovieSection({
  title,
  actionLabel,
  movies,
  navigation,
}: {
  title: string;
  actionLabel: string;
  movies: PopularMovie[];
  navigation: NavigationLike;
}) {
  if (!movies.length) {
    return null;
  }

  return (
    <View style={styles.sectionBlock}>
      <SectionHeader
        title={title}
        actionLabel={actionLabel}
        onPress={() => navigation.navigate('Discover')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.movieRow}
      >
        {movies.map((movie) => (
          <Pressable
            key={movie.id}
            style={styles.movieCard}
            onPress={() => navigation.navigate('Details')}
          >
            <View style={styles.posterWrap}>
              <Image
                source={{ uri: getPosterUrl(movie.poster_path) }}
                style={styles.poster}
              />
              <View style={styles.tagPill}>
                <Text style={styles.tagPillText}>热门</Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scoreText}>★ {movie.vote_average.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={styles.movieTitle} numberOfLines={1}>
              {movie.title}
            </Text>
            <Text style={styles.movieMeta}>{getMovieMeta(movie)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [popularMovies, setPopularMovies] = useState<PopularMovie[]>([]);
  const [movieGenres, setMovieGenres] = useState<MovieGenre[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const { width } = useWindowDimensions();
  const heroCardWidth = width - 32;

  useEffect(() => {
    let mounted = true;

    const loadHomeData = async () => {
      try {
        const [movies, genres] = await Promise.all([
          loadPopularMovies(1),
          loadMovieGenres(),
        ]);

        if (mounted) {
          setPopularMovies(movies);
          setMovieGenres(genres);
        }
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  const heroMovies = useMemo(() => popularMovies.slice(0, 3), [popularMovies]);
  const featuredMovies = useMemo(() => popularMovies.slice(0, 6), [popularMovies]);
  const latestMovies = useMemo(() => popularMovies.slice(6, 12), [popularMovies]);
  const topTabs = useMemo(
    () => ['推荐', ...movieGenres.slice(0, 5).map((genre) => genre.name)],
    [movieGenres],
  );

  const handleHeroScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageWidth = event.nativeEvent.layoutMeasurement.width;
    if (!pageWidth) {
      return;
    }

    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    if (nextIndex !== activeHeroIndex) {
      setActiveHeroIndex(nextIndex);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#05070d" />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topBar}>
            <Pressable
              style={styles.logoChip}
              onPress={() => navigation.navigate('Home')}
            >
              <View style={styles.logoDot} />
              <Text style={styles.logoText}>Moon</Text>
            </Pressable>
            <Pressable
              style={styles.searchBox}
              onPress={() => navigation.navigate('Discover')}
            >
              <Text style={styles.searchIcon}>⌕</Text>
              <Text style={styles.searchText}>搜索你想看的电影</Text>
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Text style={styles.iconButtonText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.tabRow}>
            {topTabs.map((tab, index) => (
              <Text
                key={tab}
                style={[styles.tabText, index === 0 && styles.tabTextActive]}
              >
                {tab}
              </Text>
            ))}
          </View>

          {loading ? (
            <View style={styles.loadingHero}>
              <ActivityIndicator size="large" color="#ff5b55" />
            </View>
          ) : heroMovies.length ? (
            <View>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleHeroScroll}
                onMomentumScrollEnd={handleHeroScroll}
                scrollEventThrottle={16}
              >
                {heroMovies.map((item) => (
                  <View key={item.id} style={[styles.heroPage, { width }]}>
                    <Pressable onPress={() => navigation.navigate('Details')}>
                      <ImageBackground
                        source={{ uri: getBackdropUrl(item.backdrop_path) }}
                        style={[styles.heroBanner, { width: heroCardWidth }]}
                        imageStyle={styles.heroImage}
                      >
                        <View style={styles.heroOverlay} />
                        <View style={styles.heroContent}>
                          <Text style={styles.heroBadge}>热门推荐</Text>
                          <Text style={styles.heroTitle}>{item.title}</Text>
                          <Text style={styles.heroSubtitle} numberOfLines={2}>
                            {item.overview || '当前最受关注的电影，正在热播中。'}
                          </Text>
                          <View style={styles.heroActions}>
                            <View style={styles.playButton}>
                              <Text style={styles.playButtonText}>立即观看</Text>
                            </View>
                          </View>
                        </View>
                      </ImageBackground>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.heroDotsStandalone}>
                {heroMovies.map((movie, index) => (
                  <View
                    key={movie.id}
                    style={[
                      styles.dot,
                      index === activeHeroIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          ) : null}

          <MovieSection
            title="每日推荐"
            actionLabel="更多"
            movies={featuredMovies}
            navigation={navigation}
          />

          <MovieSection
            title="近期热播电影"
            actionLabel="片库"
            movies={latestMovies}
            navigation={navigation}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05070d',
  },
  container: {
    flex: 1,
    backgroundColor: '#05070d',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  logoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131826',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff4d5a',
    marginRight: 6,
  },
  logoText: {
    color: '#f2f5ff',
    fontWeight: '700',
    fontSize: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131826',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: {
    color: '#7f8799',
    fontSize: 14,
    marginRight: 8,
  },
  searchText: {
    color: '#7f8799',
    fontSize: 13,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131826',
  },
  iconButtonText: {
    color: '#e8ebf6',
    fontSize: 16,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    gap: 18,
  },
  tabText: {
    color: '#7c8395',
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  loadingHero: {
    height: 210,
    marginHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171b28',
  },
  heroPage: {
    alignItems: 'center',
  },
  heroBanner: {
    height: 210,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#171b28',
  },
  heroImage: {
    borderRadius: 24,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 8, 18, 0.28)',
  },
  heroContent: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 93, 80, 0.92)',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
    marginBottom: 10,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#c6cbe0',
    fontSize: 13,
    marginBottom: 16,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  playButton: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  playButtonText: {
    color: '#0d1020',
    fontWeight: '800',
    fontSize: 13,
  },
  heroDotsStandalone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#ffffff',
  },
  sectionBlock: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  sectionAction: {
    color: '#9ba3bb',
    fontSize: 14,
    fontWeight: '600',
  },
  movieRow: {
    paddingHorizontal: 16,
    paddingRight: 6,
  },
  movieCard: {
    width: 138,
    marginRight: 14,
  },
  posterWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  poster: {
    width: 138,
    height: 194,
    borderRadius: 18,
    backgroundColor: '#1b2030',
  },
  tagPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  scorePill: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.68)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scoreText: {
    color: '#f8dd78',
    fontSize: 11,
    fontWeight: '700',
  },
  movieTitle: {
    color: '#eef2ff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  movieMeta: {
    color: '#838ca5',
    fontSize: 12,
  },
});
