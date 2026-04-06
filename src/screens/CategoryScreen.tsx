import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
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

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const data = await loadMoviesByGenre(genreId, 1);
        if (mounted) {
          setMovies(data.slice(0, 12));
        }
      } catch (error) {
        console.error('Failed to load category movies', error);
        if (mounted) {
          setMovies([]);
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
  }, [genreId]);

  const sections = useMemo(() => movies.slice(0, 12), [movies]);

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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.grid}>
              {sections.map((movie) => (
                <MoviePosterCard
                  key={movie.id}
                  movie={movie}
                  meta={getMeta(movie, genreName)}
                  layout="grid"
                  onPress={() => navigation.navigate('Details')}
                />
              ))}
            </View>
          </ScrollView>
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
    paddingBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
