import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

const MovieCard = ({ movie, onPress }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const cardWidth = isMobile ? (width - 48) / 2 : 180;
  const cardHeight = cardWidth * 1.5;
  const favorited = isFavorite(movie.id);

  return (
    <TouchableOpacity
      onPress={() => onPress(movie)}
      activeOpacity={0.88}
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
    >
      <ImageBackground
        source={{ uri: movie.image }}
        style={styles.cardImage}
        resizeMode="cover"
        borderRadius={12}
      >
        {/* Gradient overlay */}
        <View style={styles.cardOverlay} />

        {/* Favorite button */}
        <TouchableOpacity
          style={styles.favBtn}
          onPress={(e) => {
            e.stopPropagation?.();
            toggleFavorite(movie);
          }}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.favIcon}>{favorited ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {movie.rating}</Text>
        </View>

        {/* Card footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {movie.title}
          </Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardYear}>{movie.year}</Text>
            <Text style={styles.cardGenre}>{movie.genre[0]}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 0,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(5, 5, 15, 0.82)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {
    fontSize: 14,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: '#f5c518',
    fontSize: 10,
    fontWeight: '700',
  },
  cardFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  cardYear: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '500',
  },
  cardGenre: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '500',
  },
});

export default MovieCard;
