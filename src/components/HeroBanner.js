import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

const HeroBanner = ({ movie, onPress, onPlay }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const bannerHeight = isMobile ? height * 0.55 : height * 0.7;
  const favorited = isFavorite(movie.id);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [movie.id]);

  return (
    <View style={[styles.bannerContainer, { height: bannerHeight }]}>
      <ImageBackground
        source={{ uri: movie.backdrop }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient overlay layers */}
        <View style={styles.overlayTop} />
        <View style={styles.overlayBottom} />
        <View style={[styles.overlayColor, { backgroundColor: `${movie.color}22` }]} />

        <Animated.View
          style={[
            styles.bannerContent,
            isMobile && styles.bannerContentMobile,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Featured Badge */}
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ EM DESTAQUE</Text>
          </View>

          {/* Genre Tags */}
          <View style={styles.genreTags}>
            {movie.genre.slice(0, 3).map((g) => (
              <View key={g} style={styles.genreTag}>
                <Text style={styles.genreTagText}>{g}</Text>
              </View>
            ))}
          </View>

          {/* Title */}
          <Text style={[styles.bannerTitle, isMobile && styles.bannerTitleMobile]}>
            {movie.title}
          </Text>

          {/* Meta info */}
          <View style={styles.metaRow}>
            <Text style={styles.metaRating}>⭐ {movie.rating}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{movie.year}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{movie.duration}</Text>
          </View>

          {/* Synopsis */}
          <Text
            style={[styles.bannerSynopsis, isMobile && styles.bannerSynopsisMobile]}
            numberOfLines={isMobile ? 2 : 3}
          >
            {movie.synopsis}
          </Text>

          {/* Buttons */}
          <View style={styles.bannerActions}>
            <TouchableOpacity
              style={styles.watchBtn}
              onPress={() => onPlay ? onPlay(movie) : onPress(movie)}
              activeOpacity={0.85}
            >
              <Text style={styles.watchBtnText}>▶  Assistir Agora</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.favoriteBtn, favorited && styles.favoriteBtnActive]}
              onPress={() => toggleFavorite(movie)}
              activeOpacity={0.8}
            >
              <Text style={styles.favoriteBtnText}>{favorited ? '❤️' : '🤍'}</Text>
              <Text style={[styles.favoriteBtnLabel, favorited && styles.favoriteBtnLabelActive]}>
                {favorited ? 'Favoritado' : 'Favoritar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoBtn}
              onPress={() => onPress(movie)}
              activeOpacity={0.8}
            >
              <Text style={styles.infoBtnText}>ℹ  Detalhes</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: 'rgba(10, 10, 15, 0.9)',
  },
  overlayColor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerContent: {
    padding: 40,
    paddingBottom: 44,
    maxWidth: 680,
  },
  bannerContentMobile: {
    padding: 20,
    paddingBottom: 28,
  },
  featuredBadge: {
    backgroundColor: '#e50914',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  featuredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  genreTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  genreTag: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  genreTagText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  bannerTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 54,
    letterSpacing: -1,
  },
  bannerTitleMobile: {
    fontSize: 28,
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  metaRating: {
    color: '#f5c518',
    fontSize: 14,
    fontWeight: '700',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  metaText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '500',
  },
  bannerSynopsis: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  bannerSynopsisMobile: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },
  bannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  watchBtn: {
    backgroundColor: '#e50914',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  favoriteBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  favoriteBtnActive: {
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    borderColor: 'rgba(229, 9, 20, 0.5)',
  },
  favoriteBtnText: {
    fontSize: 16,
  },
  favoriteBtnLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    fontSize: 14,
  },
  favoriteBtnLabelActive: {
    color: '#ff6b7a',
  },
  infoBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoBtnText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HeroBanner;
