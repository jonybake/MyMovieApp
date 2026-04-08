import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MoviePosterCard from '../components/MoviePosterCard';
import { GenreMovie, loadMoviesByGenre } from '../api';

function getMeta(movie: GenreMovie, genreName: string) {
  const year = movie.release_date?.slice(0, 4) || '待定';
  return `${year} · ${genreName}`;
}

export default function CategoryScreen({ navigation, route }: any) {
  const genreId = route.params?.genreId ?? 28;
  const genreName = route.params?.genreName ?? '分类';
  const [movies, setMovies] = useState<GenreMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        const data = await loadMoviesByGenre(genreId, 1);
        if (!mounted) {
          return;
        }

        setMovies(data);
        setHasMore(data.length > 0);
        pageRef.current = 1;
        hasMoreRef.current = data.length > 0;
      } catch (error) {
        console.error('Failed to load category movies', error);
        if (mounted) {
          setMovies([]);
          setHasMore(false);
          hasMoreRef.current = false;
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setLoadingMore(false);
          loadingMoreRef.current = false;
        }
      }
    };

    setMovies([]);
    setHasMore(true);
    pageRef.current = 1;
    hasMoreRef.current = true;
    setLoading(true);
    setLoadingMore(false);
    loadingMoreRef.current = false;
    loadInitialData();

    return () => {
      mounted = false;
    };
  }, [genreId]);

  const handleLoadMore = useCallback(async () => {
    if (loading || loadingMoreRef.current || !hasMoreRef.current) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;

    try {
      const nextMovies = await loadMoviesByGenre(genreId, nextPage);

      if (!nextMovies.length) {
        setHasMore(false);
        hasMoreRef.current = false;
        return;
      }

      setMovies((current) => {
        const movieMap = new Map(current.map((item) => [item.id, item]));
        nextMovies.forEach((item) => {
          movieMap.set(item.id, item);
        });
        return Array.from(movieMap.values());
      });
      pageRef.current = nextPage;
    } catch (error) {
      console.error('Failed to load more category movies', error);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [genreId, loading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#05070d" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'<'}</Text>
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{genreName}</Text>
            <Text style={styles.subtitle}>热门片单</Text>
          </View>
          <Pressable
            style={styles.moreButton}
            onPress={() => navigation.navigate('Discover')}
          >
            <Text style={styles.moreText}>发现</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#ff5b55" />
          </View>
        ) : (
          <View style={styles.listWrap}>
            <FlatList
              data={movies}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
              columnWrapperStyle={styles.gridRow}
              renderItem={({ item }) => (
                <MoviePosterCard
                  movie={item}
                  meta={getMeta(item, genreName)}
                  layout="grid"
                  onPress={() => navigation.navigate('Details', { movieId: item.id })}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>暂无内容</Text>
                  <Text style={styles.emptyDesc}>这个分类暂时还没有可展示的电影。</Text>
                </View>
              }
            />

            <View style={styles.footerDock}>
              {loadingMore ? (
                <View style={styles.footerLoading}>
                  <ActivityIndicator size="small" color="#ff5b55" />
                  <Text style={styles.footerText}>加载更多中...</Text>
                </View>
              ) : hasMore && movies.length ? (
                <Pressable style={styles.loadMoreButton} onPress={handleLoadMore}>
                  <Text style={styles.loadMoreText}>加载更多</Text>
                </Pressable>
              ) : movies.length ? (
                <View style={styles.footerLoading}>
                  <Text style={styles.footerText}>没有更多了</Text>
                </View>
              ) : null}
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121827',
  },
  backText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#8e97af',
    fontSize: 12,
    marginTop: 4,
  },
  moreButton: {
    minWidth: 52,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#121827',
    alignItems: 'center',
  },
  moreText: {
    color: '#d7deef',
    fontSize: 12,
    fontWeight: '700',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  listWrap: {
    flex: 1,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  footerDock: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: '#05070d',
  },
  footerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#8f99b2',
    fontSize: 12,
    marginTop: 8,
  },
  loadMoreButton: {
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#1c2740',
  },
  loadMoreText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
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
