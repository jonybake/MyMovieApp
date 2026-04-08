import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import MoviePosterCard from '../components/MoviePosterCard';
import {
  loadMovieGenres,
  loadMoviesByGenre,
  loadPopularMovies,
  MovieGenre,
  PopularMovie,
} from '../api';
import { getBackdropUrl } from '../utils/image';

type NavigationLike = {
  navigate: (screen: string, params?: Record<string, unknown>) => void;
};

type HomeScreenProps = {
  navigation: NavigationLike;
};

type HomeTab = {
  id: number;
  name: string;
};

function getMovieMeta(movie: PopularMovie, fallbackLabel = '热门电影') {
  const year = movie.release_date?.slice(0, 4) || '待定';
  return `${year} · ${fallbackLabel}`;
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
          <MoviePosterCard
            key={movie.id}
            movie={movie}
            meta={getMovieMeta(movie)}
            onPress={() => navigation.navigate('Details', { movieId: movie.id })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [popularMovies, setPopularMovies] = useState<PopularMovie[]>([]);
  const [movieGenres, setMovieGenres] = useState<MovieGenre[]>([]);
  const [categoryMovies, setCategoryMovies] = useState<Record<number, PopularMovie[]>>({});
  const [categoryPages, setCategoryPages] = useState<Record<number, number>>({});
  const [categoryHasMore, setCategoryHasMore] = useState<Record<number, boolean>>({});
  const [selectedTabId, setSelectedTabId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryLoadingMore, setCategoryLoadingMore] = useState<Record<number, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);
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

  useEffect(() => {
    let mounted = true;

    if (selectedTabId === 0 || categoryMovies[selectedTabId]) {
      return () => {
        mounted = false;
      };
    }

    const loadCategoryData = async () => {
      setCategoryLoading(true);

      try {
        const movies = await loadMoviesByGenre(selectedTabId, 1);
        if (mounted) {
          setCategoryMovies((current) => ({
            ...current,
            [selectedTabId]: movies.slice(0, 12),
          }));
          setCategoryPages((current) => ({
            ...current,
            [selectedTabId]: 1,
          }));
          setCategoryHasMore((current) => ({
            ...current,
            [selectedTabId]: movies.length > 0,
          }));
        }
      } catch (error) {
        console.error('Failed to load category movies', error);
        if (mounted) {
          setCategoryMovies((current) => ({
            ...current,
            [selectedTabId]: [],
          }));
          setCategoryHasMore((current) => ({
            ...current,
            [selectedTabId]: false,
          }));
        }
      } finally {
        if (mounted) {
          setCategoryLoading(false);
        }
      }
    };

    loadCategoryData();

    return () => {
      mounted = false;
    };
  }, [categoryMovies, selectedTabId]);

  const heroMovies = useMemo(() => popularMovies.slice(0, 3), [popularMovies]);
  const featuredMovies = useMemo(() => popularMovies.slice(0, 6), [popularMovies]);
  const latestMovies = useMemo(() => popularMovies.slice(6, 12), [popularMovies]);
  const topTabs = useMemo<HomeTab[]>(
    () => [{ id: 0, name: '推荐' }, ...movieGenres.slice(0, 5)],
    [movieGenres],
  );
  const selectedGenre = useMemo(
    () => topTabs.find((tab) => tab.id === selectedTabId),
    [selectedTabId, topTabs],
  );
  const selectedCategoryMovies = categoryMovies[selectedTabId] ?? [];
  const selectedCategoryHasMore = categoryHasMore[selectedTabId] ?? true;
  const selectedCategoryLoadingMore = categoryLoadingMore[selectedTabId] ?? false;

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

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const [movies, genres] = await Promise.all([
        loadPopularMovies(1),
        loadMovieGenres(),
      ]);

      setPopularMovies(movies);
      setMovieGenres(genres);
      setCategoryMovies({});
      setCategoryPages({});
      setCategoryHasMore({});
      setCategoryLoadingMore({});
      setActiveHeroIndex(0);
    } catch (error) {
      console.error('Failed to refresh home data', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMoreCategory = async () => {
    if (
      selectedTabId === 0 ||
      selectedCategoryLoadingMore ||
      !selectedCategoryHasMore
    ) {
      return;
    }

    setCategoryLoadingMore((current) => ({
      ...current,
      [selectedTabId]: true,
    }));

    const nextPage = (categoryPages[selectedTabId] ?? 1) + 1;

    try {
      const nextMovies = await loadMoviesByGenre(selectedTabId, nextPage);

      if (!nextMovies.length) {
        setCategoryHasMore((current) => ({
          ...current,
          [selectedTabId]: false,
        }));
        return;
      }

      setCategoryMovies((current) => {
        const currentMovies = current[selectedTabId] ?? [];
        const movieMap = new Map(currentMovies.map((item) => [item.id, item]));
        nextMovies.forEach((item) => {
          movieMap.set(item.id, item);
        });

        return {
          ...current,
          [selectedTabId]: Array.from(movieMap.values()),
        };
      });

      setCategoryPages((current) => ({
        ...current,
        [selectedTabId]: nextPage,
      }));
    } catch (error) {
      console.error('Failed to load more category movies', error);
    } finally {
      setCategoryLoadingMore((current) => ({
        ...current,
        [selectedTabId]: false,
      }));
    }
  };

  const renderTopBar = () => (
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
  );

  const renderTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabRow}
    >
      {topTabs.map((tab) => {
        const isActive = tab.id === selectedTabId;
        return (
          <Pressable
            key={`${tab.id}-${tab.name}`}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
            onPress={() => setSelectedTabId(tab.id)}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  const renderRecommendHeader = () => (
    <View>
      {renderTopBar()}
      {renderTabs()}
      {heroMovies.length ? (
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
                <Pressable
                  onPress={() => navigation.navigate('Details', { movieId: item.id })}
                >
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
    </View>
  );

  const renderCategoryHeader = () => (
    <View>
      {renderTopBar()}
      {renderTabs()}
      <View style={styles.categoryHeader}>
        <Text style={styles.sectionTitle}>{selectedGenre?.name ?? '分类'}</Text>
        <Text style={styles.categoryHint}>热门片单</Text>
      </View>
    </View>
  );

  const renderCategoryItem: ListRenderItem<PopularMovie> = ({ item }) => (
    <MoviePosterCard
      movie={item}
      meta={getMovieMeta(item, selectedGenre?.name ?? '分类')}
      layout="grid"
      onPress={() => navigation.navigate('Details', { movieId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#05070d" />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingHero}>
            <ActivityIndicator size="large" color="#ff5b55" />
          </View>
        ) : selectedTabId === 0 ? (
          <FlatList
            key="home-recommend-list"
            data={[]}
            keyExtractor={(_, index) => index.toString()}
            renderItem={null}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderRecommendHeader}
            contentContainerStyle={styles.flatContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#ff5b55"
                colors={['#ff5b55']}
                progressBackgroundColor="#101626"
                progressViewOffset={8}
              />
            }
          />
        ) : categoryLoading ? (
          <View style={styles.loadingCategory}>
            <ActivityIndicator size="large" color="#ff5b55" />
          </View>
        ) : (
          <FlatList
            key={`home-category-list-${selectedTabId}`}
            data={selectedCategoryMovies}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            renderItem={renderCategoryItem}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderCategoryHeader}
            ListHeaderComponentStyle={styles.categoryHeaderWrap}
            columnWrapperStyle={styles.categoryGridRow}
            contentContainerStyle={styles.categoryListContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#ff5b55"
                colors={['#ff5b55']}
                progressBackgroundColor="#101626"
                progressViewOffset={8}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>暂无内容</Text>
                <Text style={styles.emptyDesc}>这个分类暂时还没有可展示的电影。</Text>
              </View>
            }
            ListFooterComponent={
              <View style={styles.categoryFooter}>
                {selectedCategoryLoadingMore ? (
                  <View style={styles.categoryFooterLoading}>
                    <ActivityIndicator size="small" color="#ff5b55" />
                    <Text style={styles.categoryFooterText}>加载更多中...</Text>
                  </View>
                ) : selectedCategoryHasMore && selectedCategoryMovies.length ? (
                  <Pressable
                    style={styles.categoryLoadMoreButton}
                    onPress={handleLoadMoreCategory}
                  >
                    <Text style={styles.categoryLoadMoreText}>加载更多</Text>
                  </Pressable>
                ) : selectedCategoryMovies.length ? (
                  <Text style={styles.categoryFooterText}>没有更多了</Text>
                ) : null}
              </View>
            }
          />
        )}
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
  flatContent: {
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
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 14,
    gap: 10,
  },
  tabButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#101626',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabButtonActive: {
    backgroundColor: '#1c2740',
  },
  tabText: {
    color: '#7c8395',
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  loadingHero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCategory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  categoryHeaderWrap: {
    paddingBottom: 8,
  },
  categoryHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
  },
  categoryHint: {
    color: '#8f99b2',
    fontSize: 12,
    marginTop: 4,
  },
  categoryListContent: {
    paddingHorizontal: 12,
    paddingBottom: 110,
  },
  categoryGridRow: {
    justifyContent: 'space-between',
  },
  categoryFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  categoryFooterLoading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryFooterText: {
    color: '#8f99b2',
    fontSize: 12,
    marginTop: 8,
  },
  categoryLoadMoreButton: {
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#1c2740',
  },
  categoryLoadMoreText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 24,
    borderRadius: 22,
    backgroundColor: '#101626',
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyDesc: {
    color: '#8f99b2',
    fontSize: 13,
    textAlign: 'center',
  },
});
