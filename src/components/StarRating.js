import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const StarRating = ({ movieId, size = 24, onRate }) => {
  const { getRating, rateMovie } = require('../context/FavoritesContext').useFavorites();
  const current = getRating(movieId);

  const handle = (star) => {
    // Toca de novo na mesma estrela = remove avaliação
    const next = current === star ? 0 : star;
    rateMovie(movieId, next);
    onRate?.(next);
  };

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => handle(star)} activeOpacity={0.7} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
          <Text style={[styles.star, { fontSize: size }, star <= current && styles.starFilled]}>
            {star <= current ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
      {current > 0 && (
        <Text style={styles.label}>Sua nota: {current}/5</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  star: { color: 'rgba(255,255,255,0.25)' },
  starFilled: { color: '#f5c518' },
  label: { color: 'rgba(255,255,255,0.45)', fontSize: 12, marginLeft: 8, fontWeight: '500' },
});

export default StarRating;
