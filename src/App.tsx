import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

// 模拟电影数据（实际开发时调用 TMDB API）
const MOCK_MOVIES = [
  {
    id: '1',
    title: '星际穿越',
    poster:
      'https://img.17sucai.com/upload/534358/2016-06-13/ca269bfed13507fa8928f57bbff720c7.jpg?x-oss-process=style/ready',
  },
  {
    id: '2',
    title: '盗梦空间',
    poster:
      'https://img.17sucai.com/upload/534358/2016-06-14/38e425a4f52abdc7ef42da6ce0d3b6c7.jpg?x-oss-process=style/lessen',
  },
  {
    id: '3',
    title: '奥本海默',
    poster:
      'https://img.17sucai.com/upload/534358/2016-06-12/e272b1d94f864f266bccee512c33a847.jpg?x-oss-process=style/lessen',
  },
];

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>热门推荐</Text>

      <FlatList
        data={MOCK_MOVIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.movieCard}>
            <Image source={{ uri: item.poster }} style={styles.poster} />
            <Text style={styles.movieTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.header}>即将上映</Text>
      {/* 更多分类... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 50,
  },
  header: {
    marginLeft: 15,
    marginVertical: 15,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  movieCard: {
    marginLeft: 15,
    width: 140,
  },
  poster: {
    width: 140,
    height: 210,
    borderRadius: 12,
    backgroundColor: '#1e293b',
  },
  movieTitle: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#cbd5e1',
  },
});
