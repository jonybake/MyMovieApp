import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const menuItems = [
  { id: '1', label: '观看历史', value: '128 部影片' },
  { id: '2', label: '我的收藏', value: '42 个片单' },
  { id: '3', label: '离线缓存', value: '8 个视频' },
  { id: '4', label: '账号设置', value: '安全 / 通知 / 隐私' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.pageTitle}>我的</Text>

        <View style={styles.profileCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Moon 用户</Text>
            <Text style={styles.memberTag}>年度会员 · 剩余 216 天</Text>
            <Text style={styles.profileDesc}>
              热爱科幻、悬疑与人物传记电影，最近正在补经典片单。
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>246h</Text>
            <Text style={styles.statLabel}>本月观影时长</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>89</Text>
            <Text style={styles.statLabel}>已看影片</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>17</Text>
            <Text style={styles.statLabel}>追更剧集</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuValue}>{item.value}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05070d',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 18,
  },
  profileCard: {
    flexDirection: 'row',
    borderRadius: 28,
    backgroundColor: '#101626',
    borderWidth: 1,
    borderColor: '#1a2236',
    padding: 16,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#1f2940',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  memberTag: {
    alignSelf: 'flex-start',
    color: '#fff0e3',
    backgroundColor: '#ff8f4a',
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  profileDesc: {
    color: '#95a1ba',
    fontSize: 13,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#101626',
    borderWidth: 1,
    borderColor: '#1a2236',
    paddingVertical: 18,
    marginRight: 10,
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  statLabel: {
    color: '#7f8aa5',
    fontSize: 12,
    fontWeight: '600',
  },
  menuSection: {
    marginTop: 20,
    borderRadius: 28,
    backgroundColor: '#101626',
    borderWidth: 1,
    borderColor: '#1a2236',
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#1b2234',
  },
  menuLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  menuValue: {
    color: '#7f8aa5',
    fontSize: 12,
  },
  chevron: {
    color: '#7f8aa5',
    fontSize: 22,
  },
});
