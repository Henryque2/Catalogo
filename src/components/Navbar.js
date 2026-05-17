import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, useWindowDimensions,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

const Navbar = ({ onLogoPress, activeTab, setActiveTab, navigateTo, searchQuery, setSearchQuery }) => {
  const { favorites } = useFavorites();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [searchOpen, setSearchOpen] = useState(false);
  const searchWidth = useRef(new Animated.Value(0)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;

  const navItems = [
    { id: 'home',      label: 'Início',    icon: '🏠' },
    { id: 'favorites', label: 'Favoritos', icon: '❤️', count: favorites.length },
    { id: 'trending',  label: 'Em Alta',   icon: '🔥' },
  ];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    navigateTo('home');
    if (tabId === 'home') onLogoPress();
  };

  const openSearch = () => {
    setSearchOpen(true);
    setActiveTab('home');
    navigateTo('home');
    Animated.parallel([
      Animated.spring(searchWidth, { toValue: isMobile ? width - 100 : 260, useNativeDriver: false, tension: 80, friction: 12 }),
      Animated.timing(searchOpacity, { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const closeSearch = () => {
    setSearchQuery('');
    Animated.parallel([
      Animated.spring(searchWidth, { toValue: 0, useNativeDriver: false, tension: 80, friction: 12 }),
      Animated.timing(searchOpacity, { toValue: 0, duration: 150, useNativeDriver: false }),
    ]).start(() => setSearchOpen(false));
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onLogoPress} style={styles.logoContainer} activeOpacity={0.8}>
        <Text style={styles.logoIcon}>🎬</Text>
        {!isMobile && (
          <Text style={styles.logoText}>
            MOACIR<Text style={styles.logoAccent}>FILMS</Text>
          </Text>
        )}
      </TouchableOpacity>

      {!searchOpen && (
        <View style={[styles.navItems, isMobile && styles.navItemsMobile]}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleTabPress(item.id)}
              style={[styles.navItem, activeTab === item.id && styles.navItemActive]}
              activeOpacity={0.7}
            >
              {isMobile ? (
                <View style={styles.mobileTabInner}>
                  <Text style={[styles.mobileTabIcon, activeTab === item.id && styles.mobileTabIconActive]}>
                    {item.icon}
                  </Text>
                  {item.count > 0 && (
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>{item.count}</Text>
                    </View>
                  )}
                  {activeTab === item.id && <View style={styles.mobileIndicator} />}
                </View>
              ) : (
                <>
                  <Text style={[styles.navItemText, activeTab === item.id && styles.navItemTextActive]}>
                    {item.label}{item.count > 0 ? ` (${item.count})` : ''}
                  </Text>
                  {activeTab === item.id && <View style={styles.navIndicator} />}
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.navRight}>
        {searchOpen && (
          <Animated.View style={[styles.searchInputWrapper, { width: searchWidth, opacity: searchOpacity }]}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar filme..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}
        <TouchableOpacity
          style={[styles.searchBtn, searchOpen && styles.searchBtnActive]}
          activeOpacity={0.8}
          onPress={searchOpen ? closeSearch : openSearch}
        >
          <Text style={styles.searchIcon}>{searchOpen ? '✕' : '🔍'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: 'rgba(10,10,15,0.98)',
    paddingHorizontal: 16, height: 60,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 36 },
  logoIcon: { fontSize: 20 },
  logoText: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  logoAccent: { color: '#e50914' },
  navItems: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' },
  navItemsMobile: { gap: 0 },
  navItem: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, alignItems: 'center', position: 'relative' },
  navItemActive: { backgroundColor: 'rgba(229,9,20,0.12)' },
  navItemText: { color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: '500' },
  navItemTextActive: { color: '#fff', fontWeight: '700' },
  navIndicator: { position: 'absolute', bottom: 2, width: 20, height: 2, backgroundColor: '#e50914', borderRadius: 2 },
  mobileTabInner: { alignItems: 'center', justifyContent: 'center', position: 'relative', paddingHorizontal: 2, paddingBottom: 2 },
  mobileTabIcon: { fontSize: 20, opacity: 0.6 },
  mobileTabIconActive: { opacity: 1 },
  mobileIndicator: { position: 'absolute', bottom: -2, width: 16, height: 2, backgroundColor: '#e50914', borderRadius: 2 },
  countBadge: { position: 'absolute', top: -4, right: -6, backgroundColor: '#e50914', borderRadius: 8, minWidth: 15, height: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  countBadgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 12, height: 36, overflow: 'hidden' },
  searchInput: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '500', height: 36 },
  clearBtn: { padding: 4, marginLeft: 4 },
  clearBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '700' },
  searchBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  searchBtnActive: { backgroundColor: 'rgba(229,9,20,0.2)', borderColor: 'rgba(229,9,20,0.3)', borderWidth: 1 },
  searchIcon: { fontSize: 15 },
});

export default Navbar;
