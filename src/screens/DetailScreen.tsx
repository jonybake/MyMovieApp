import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';

type NavigationLike = {
  goBack: () => void;
};

type DetailScreenProps = {
  navigation: NavigationLike;
};

type SourceItem = {
  id: string;
  label: string;
  active?: boolean;
};

type EpisodeItem = {
  id: string;
  label: string;
  active?: boolean;
};

type RecommendItem = {
  id: string;
  title: string;
  tag: string;
  poster: string;
};

const videoUrl = 'https://vjs.zencdn.net/v/oceans.mp4';

const sources: SourceItem[] = [
  { id: '1', label: '高清线路1', active: true },
  { id: '2', label: '极速蓝光' },
  { id: '3', label: '高速蓝光' },
  { id: '4', label: '常规线路' },
];

const episodes: EpisodeItem[] = [
  { id: '1', label: '第01集', active: true },
  { id: '2', label: '第02集' },
  { id: '3', label: '第03集' },
  { id: '4', label: '第04集' },
];

const recommends: RecommendItem[] = [
  {
    id: '1',
    title: '夜魔侠：重生',
    tag: '热门',
    poster: 'https://image.tmdb.org/t/p/w500/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg',
  },
  {
    id: '2',
    title: '奥本海默',
    tag: '高分',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv2mYmUpepXSuvaH0jhw19oXl.jpg',
  },
  {
    id: '3',
    title: '沙丘: 第二部',
    tag: '推荐',
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
  },
];

function Chip({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function DetailScreen({ navigation }: DetailScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090909" />
      <View style={styles.container}>
        <View style={styles.playerSection}>
          <VideoPlayer url={videoUrl} />
          <View style={styles.playerOverlay} pointerEvents="box-none">
            <View style={styles.playerTop} pointerEvents="box-none">
              <Pressable
                style={styles.circleButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.circleButtonText}>‹</Text>
              </Pressable>
              <View style={styles.playerActions} pointerEvents="box-none">
                <Pressable style={styles.circleButton}>
                  <Text style={styles.circleButtonText}>⇪</Text>
                </Pressable>
                <Pressable style={styles.circleButton}>
                  <Text style={styles.circleButtonText}>☰</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.progressWrap} pointerEvents="none">
              <Text style={styles.timeText}>01:58</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressCurrent} />
              </View>
              <Text style={styles.timeText}>47:44</Text>
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.tabRow}>
            <Text style={[styles.tabText, styles.tabActive]}>视频</Text>
            <Text style={styles.tabText}>评论 (36)</Text>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.title}>你是迟来的欢喜</Text>
            <Pressable>
              <Text style={styles.infoAction}>简介 ›</Text>
            </Pressable>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreLabel}>豆瓣评分: 7.3</Text>
            </View>
            <Text style={styles.genreText}>爱情</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>片源</Text>
              <Text style={styles.sectionHint}>›</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {sources.map((source) => (
                <Chip
                  key={source.id}
                  label={source.label}
                  active={source.active}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>选集</Text>
              <Text style={styles.sectionHint}>已更新到第22集 ›</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {episodes.map((episode) => (
                <Chip
                  key={episode.id}
                  label={episode.label}
                  active={episode.active}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>猜你喜欢</Text>
              <Text style={styles.sectionHint}>›</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendRow}
            >
              {recommends.map((item) => (
                <Pressable key={item.id} style={styles.recommendCard}>
                  <View style={styles.recommendPosterWrap}>
                    <Image
                      source={{ uri: item.poster }}
                      style={styles.recommendPoster}
                    />
                    <View style={styles.recommendTag}>
                      <Text style={styles.recommendTagText}>{item.tag}</Text>
                    </View>
                  </View>
                  <Text style={styles.recommendTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <Pressable style={styles.commentButton}>
            <Text style={styles.commentText}>点评一下</Text>
          </Pressable>
          <View style={styles.bottomActions}>
            <Text style={styles.bottomIcon}>☆</Text>
            <Text style={styles.bottomIcon}>↓</Text>
            <Text style={styles.bottomIcon}>↗</Text>
            <Text style={styles.bottomIcon}>i</Text>
          </View>
        </View>
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
  circleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#f2f2f2',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.24)',
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressCurrent: {
    width: '34%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  content: {
    paddingBottom: 96,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    gap: 24,
  },
  tabText: {
    color: '#6f6f6f',
    fontSize: 15,
    fontWeight: '600',
    paddingBottom: 10,
  },
  tabActive: {
    color: '#ffffff',
    borderBottomWidth: 3,
    borderBottomColor: '#e63737',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 18,
  },
  title: {
    flex: 1,
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginRight: 12,
  },
  infoAction: {
    color: '#bababa',
    fontSize: 14,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 14,
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
  genreText: {
    color: '#bdbdbd',
    fontSize: 14,
    marginLeft: 10,
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
  horizontalList: {
    paddingHorizontal: 18,
    paddingRight: 4,
  },
  chip: {
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#2e2e2e',
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: '#7e1f1f',
    borderWidth: 1,
    borderColor: '#ac3939',
  },
  chipText: {
    color: '#d8d8d8',
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  recommendRow: {
    paddingHorizontal: 18,
    paddingRight: 6,
  },
  recommendCard: {
    width: 108,
    marginRight: 12,
  },
  recommendPosterWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  recommendPoster: {
    width: 108,
    height: 150,
    borderRadius: 14,
    backgroundColor: '#262626',
  },
  recommendTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recommendTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  recommendTitle: {
    color: '#ebebeb',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#141414',
    borderTopWidth: 1,
    borderTopColor: '#202020',
  },
  commentButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#333333',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  commentText: {
    color: '#9f9f9f',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    gap: 18,
  },
  bottomIcon: {
    color: '#dcdcdc',
    fontSize: 22,
  },
});
