import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

const FavoritesContext = createContext(null);

// AsyncStorage helper — funciona em mobile e web
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
const WATCHED_KEY = '@cineverse_watched';
const RATINGS_KEY = '@cineverse_ratings';
const PROFILE_KEY = '@cineverse_profile';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]);
  const [ratings, setRatings] = useState({}); // { movieId: 1-5 }
  const [profile, setProfile] = useState({ name: 'Usuário', avatar: '🎬' });
  const [theme, setTheme] = useState('dark');
  const [loaded, setLoaded] = useState(false);

  // Carrega tudo do storage ao iniciar
  useEffect(() => {
    const load = async () => {
      const [favs, wat, rats, prof] = await Promise.all([
        storage.get(FAVORITES_KEY),
        storage.get(WATCHED_KEY),
        storage.get(RATINGS_KEY),
        storage.get(PROFILE_KEY),
      ]);
      if (favs) setFavorites(favs);
      if (wat) setWatched(wat);
      if (rats) setRatings(rats);
      if (prof) setProfile(prof);
      setLoaded(true);
    };
    load();
  }, []);

  // Persiste favoritos
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

  // Persiste assistidos
  const toggleWatched = useCallback((movie) => {
    setWatched((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      const next = exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
      storage.set(WATCHED_KEY, next);
      return next;
    });
  }, []);

  const isWatched = useCallback(
    (movieId) => watched.some((m) => m.id === movieId),
    [watched]
  );

  // Persiste avaliações
  const rateMovie = useCallback((movieId, stars) => {
    setRatings((prev) => {
      const next = { ...prev, [movieId]: stars };
      storage.set(RATINGS_KEY, next);
      return next;
    });
  }, []);

  const getRating = useCallback((movieId) => ratings[movieId] || 0, [ratings]);

  // Persiste perfil
  const updateProfile = useCallback((updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      storage.set(PROFILE_KEY, next);
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <FavoritesContext.Provider value={{
      favorites, toggleFavorite, isFavorite,
      watched, toggleWatched, isWatched,
      ratings, rateMovie, getRating,
      profile, updateProfile,
      theme, toggleTheme,
      loaded,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
