import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const CategoryFilter = ({ categories, activeCategory, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          onPress={() => onSelect(cat)}
          style={[styles.chip, activeCategory === cat && styles.chipActive]}
          activeOpacity={0.75}
        >
          <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chipActive: {
    backgroundColor: '#e50914',
    borderColor: '#e50914',
  },
  chipText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

export default CategoryFilter;
