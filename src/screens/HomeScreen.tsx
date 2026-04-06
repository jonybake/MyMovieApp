import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type NavigationLike = {
  navigate: (screen: string) => void;
};

type HomeScreenProps = {
  navigation: NavigationLike;
};

type HeroMovie = {
  title: string;
  subtitle: string;
  backdrop: string;
};

type MovieCard = {
  id: string;
  title: string;
  poster: string;
  tag: string;
  score: string;
  meta: string;
};

const heroMovie: HeroMovie = {
  title: '沙丘: 第二部',
  subtitle: '史诗回归  |  沙漠宿命全面展开',
  backdrop: 'https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
};

const featuredMovies: MovieCard[] = [
  {
    id: '1',
    title: '你来到我身边',
    poster: 'https://image.tmdb.org/t/p/w500/o7QoQMa3LnJr3M6vB7f4XwV4j1S.jpg',
    tag: '热映',
    score: '7.3',
    meta: '爱情 / 都市',
  },
  {
    id: '2',
    title: '夜魔侠：重生',
    poster: 'https://image.tmdb.org/t/p/w500/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg',
    tag: '热门',
    score: '7.9',
    meta: '动作 / 犯罪',
  },
  {
    id: '3',
    title: '冬去春来',
    poster: 'https://image.tmdb.org/t/p/w500/kf5QJo0N5FO9uPjE7YQDdyCjTiM.jpg',
    tag: '精选',
    score: '6.8',
    meta: '剧情 / 治愈',
  },
];

const latestMovies: MovieCard[] = [
  {
    id: '4',
    title: '阿凡达3',
    poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    tag: '高清',
    score: '8.3',
    meta: '科幻 / 冒险',
  },
  {
    id: '5',
    title: '浴血黑帮',
    poster: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
    tag: '高分',
    score: '7.4',
    meta: '剧情 / 犯罪',
  },
  {
    id: '6',
    title: '飞天家族',
    poster: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
    tag: '新片',
    score: '7.2',
    meta: '喜剧 / 家庭',
  },
];

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
        <Text style={styles.sectionAction}>{actionLabel} ›</Text>
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
  movies: MovieCard[];
  navigation: NavigationLike;
}) {
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
              <Image source={{ uri: movie.poster }} style={styles.poster} />
              <View style={styles.tagPill}>
                <Text style={styles.tagPillText}>{movie.tag}</Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scoreText}>★ {movie.score}</Text>
              </View>
            </View>
            <Text style={styles.movieTitle} numberOfLines={1}>
              {movie.title}
            </Text>
            <Text style={styles.movieMeta}>{movie.meta}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
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
              <Text style={styles.iconButtonText}>↻</Text>
            </Pressable>
          </View>

          <View style={styles.tabRow}>
            {['推荐', '院线', '电影', '剧集', '经典', '动漫'].map((tab, index) => (
              <Text
                key={tab}
                style={[styles.tabText, index === 0 && styles.tabTextActive]}
              >
                {tab}
              </Text>
            ))}
          </View>

          <Pressable onPress={() => navigation.navigate('Details')}>
            <ImageBackground
              source={{ uri: heroMovie.backdrop }}
              style={styles.heroBanner}
              imageStyle={styles.heroImage}
            >
              <View style={styles.heroOverlay} />
              <View style={styles.heroContent}>
                <Text style={styles.heroBadge}>本周焦点</Text>
                <Text style={styles.heroTitle}>{heroMovie.title}</Text>
                <Text style={styles.heroSubtitle}>{heroMovie.subtitle}</Text>
                <View style={styles.heroActions}>
                  <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>立即观看</Text>
                  </View>
                  <View style={styles.heroDots}>
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </Pressable>

          <View style={styles.promoCard}>
            <View>
              <Text style={styles.promoTitle}>限时会员活动</Text>
              <Text style={styles.promoDesc}>开通影迷季卡，解锁 4K 片库与无广告播放</Text>
            </View>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>立省 30%</Text>
            </View>
          </View>

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
  heroBanner: {
    marginHorizontal: 16,
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
    justifyContent: 'space-between',
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
  heroDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  promoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#121a2c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  promoDesc: {
    color: '#94a0bc',
    fontSize: 12,
    maxWidth: 220,
    lineHeight: 18,
  },
  promoBadge: {
    borderRadius: 16,
    backgroundColor: '#ff5f57',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  promoBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
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
