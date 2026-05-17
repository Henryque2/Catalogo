import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

const FavoritesContext = createContext(null);

const storage = {
  get: async (key) => {
    try {
      if (Platform.OS === 'web') {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : null;
      }
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const val = await AsyncStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  set: async (key, value) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, JSON.stringify(value));
        return;
      }
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

const FAVORITES_KEY = '@cineverse_favorites';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storage.get(FAVORITES_KEY).then((favs) => {
      if (favs) setFavorites(favs);
      setLoaded(true);
    });
  }, []);

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      const next = exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
      storage.set(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (movieId) => favorites.some((m) => m.id === movieId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loaded }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
