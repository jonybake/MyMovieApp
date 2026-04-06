import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { PopularMovie } from '../api';
import { getPosterUrl } from '../utils/image';

type MoviePosterCardProps = {
  movie: PopularMovie;
  meta: string;
  onPress?: () => void;
  layout?: 'compact' | 'grid';
};

export default function MoviePosterCard({
  movie,
  meta,
  onPress,
  layout = 'compact',
}: MoviePosterCardProps) {
  const isGrid = layout === 'grid';
  const isHot = (movie.popularity ?? 0) >= 300;

  return (
    <Pressable
      style={[styles.card, isGrid ? styles.cardGrid : styles.cardCompact]}
      onPress={onPress}
    >
      <View style={styles.posterWrap}>
        <Image
          source={{ uri: getPosterUrl(movie.poster_path) }}
          style={[styles.poster, isGrid ? styles.posterGrid : styles.posterCompact]}
        />
        {isHot ? (
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>热门</Text>
          </View>
        ) : null}
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>★ {movie.vote_average.toFixed(1)}</Text>
        </View>
      </View>
      <Text
        style={[styles.title, isGrid ? styles.titleGrid : styles.titleCompact]}
        numberOfLines={1}
      >
        {movie.title}
      </Text>
      <Text
        style={[styles.meta, isGrid ? styles.metaGrid : styles.metaCompact]}
        numberOfLines={1}
      >
        {meta}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  cardCompact: {
    width: 138,
    marginRight: 14,
  },
  cardGrid: {
    width: '31%',
    marginBottom: 22,
  },
  posterWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  poster: {
    backgroundColor: '#1b2235',
  },
  posterCompact: {
    width: 138,
    height: 194,
    borderRadius: 18,
  },
  posterGrid: {
    width: '100%',
    aspectRatio: 0.68,
    borderRadius: 20,
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
  title: {
    color: '#ffffff',
    fontWeight: '800',
    marginBottom: 4,
  },
  titleCompact: {
    fontSize: 15,
  },
  titleGrid: {
    fontSize: 14,
  },
  meta: {
    color: '#8f99b2',
    fontWeight: '600',
  },
  metaCompact: {
    fontSize: 12,
  },
  metaGrid: {
    fontSize: 11,
  },
});
