import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { loadPopularMovies, movieApi, PopularMovie } from '../api';

type MovieSearchResult = {
  id: number;
  title: string;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
};

type SearchResponse = {
  results: MovieSearchResult[];
};

function getPosterUrl(path?: string | null) {
  if (!path) {
    return 'https://via.placeholder.com/300x450/1b2235/8f9bb3?text=No+Poster';
  }

  return `https://image.tmdb.org/t/p/w500${path}`;
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hotKeywords, setHotKeywords] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadHotKeywords = async () => {
      try {
        const movies: PopularMovie[] = await loadPopularMovies(1);
        if (!mounted) {
          return;
        }

        setHotKeywords(
          movies
            .map((movie) => movie.title)
            .filter(Boolean)
            .slice(0, 6),
        );
      } catch (error) {
        console.error('Failed to load hot keywords', error);
        if (mounted) {
          setHotKeywords([]);
        }
      }
    };

    loadHotKeywords();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = async (text: string) => {
    setQuery(text);

    if (text.trim().length <= 1) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await movieApi.get<SearchResponse>(
        `/search/movie?query=${encodeURIComponent(text.trim())}`,
      );
      setResults(res.data.results ?? []);
    } catch (error) {
      console.error('Search failed', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.pageTitle}>搜索电影</Text>
          <Text style={styles.pageSubtitle}>
            找到你想看的电影、演员或正在热播的内容
          </Text>

          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={query}
              onChangeText={handleSearch}
              placeholder="搜索电影、演员、导演"
              placeholderTextColor="#6f7892"
              style={styles.searchInput}
            />
          </View>

          {!query.trim() && hotKeywords.length ? (
            <View style={styles.quickSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>热门搜索</Text>
              </View>
              <View style={styles.keywordWrap}>
                {hotKeywords.map((keyword) => (
                  <Pressable
                    key={keyword}
                    style={styles.keywordChip}
                    onPress={() => handleSearch(keyword)}
                  >
                    <Text style={styles.keywordText}>{keyword}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>
              {query.trim() ? '搜索结果' : '推荐片单'}
            </Text>
            {loading ? (
              <ActivityIndicator size="small" color="#ff5b55" />
            ) : (
              <Text style={styles.resultCount}>
                {results.length > 0 ? `${results.length} 条结果` : '试试输入片名'}
              </Text>
            )}
          </View>

          <View style={styles.resultList}>
            {results.map((movie) => (
              <Pressable key={movie.id} style={styles.resultCard}>
                <Image
                  source={{ uri: getPosterUrl(movie.poster_path) }}
                  style={styles.poster}
                />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle} numberOfLines={2}>
                    {movie.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>
                        ★ {(movie.vote_average ?? 0).toFixed(1)}
                      </Text>
                    </View>
                    <Text style={styles.releaseText}>
                      {movie.release_date || '上映日期待定'}
                    </Text>
                  </View>
                  <Text style={styles.resultHint}>
                    点击查看详情、演员信息和相关推荐
                  </Text>
                </View>
              </Pressable>
            ))}

            {!loading && results.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>先搜索一部电影试试</Text>
                <Text style={styles.emptyDesc}>
                  可以输入片名、演员名，或者直接搜索你最近想看的电影
                </Text>
              </View>
            ) : null}
          </View>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  pageSubtitle: {
    color: '#8f99b2',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121827',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1c2335',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  searchIcon: {
    color: '#7f8799',
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    paddingVertical: 12,
  },
  quickSection: {
    marginTop: 22,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  keywordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  keywordChip: {
    borderRadius: 16,
    backgroundColor: '#131b2d',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#202944',
  },
  keywordText: {
    color: '#d6ddf0',
    fontSize: 13,
    fontWeight: '700',
  },
  resultsHeader: {
    marginTop: 22,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultCount: {
    color: '#7f8799',
    fontSize: 12,
    fontWeight: '600',
  },
  resultList: {
    gap: 14,
  },
  resultCard: {
    flexDirection: 'row',
    borderRadius: 22,
    backgroundColor: '#101626',
    borderWidth: 1,
    borderColor: '#1a2236',
    padding: 12,
  },
  poster: {
    width: 92,
    height: 128,
    borderRadius: 16,
    backgroundColor: '#1b2235',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  scoreBadge: {
    borderRadius: 12,
    backgroundColor: '#ff9d48',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  releaseText: {
    color: '#94a0bc',
    fontSize: 12,
    fontWeight: '600',
  },
  resultHint: {
    color: '#7f8aa5',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  emptyState: {
    borderRadius: 22,
    backgroundColor: '#101626',
    borderWidth: 1,
    borderColor: '#1a2236',
    padding: 20,
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
    lineHeight: 20,
    textAlign: 'center',
  },
});
