import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { ScrollProvider, useScrollContext, NAVBAR_CONTENT_HEIGHT, FOOTER_HEIGHT } from './src/context/ScrollContext';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import Navbar from './src/components/Navbar';
import Footer from './src/components/Footer';
import VideoPlayer from './src/components/VideoPlayer';

function AppInner() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [playerVisible, setPlayerVisible] = useState(false);
  const [playerMovie, setPlayerMovie] = useState(null);

  const insets = useSafeAreaInsets();
  const { navbarTranslate, footerTranslate, contentPaddingTop, contentPaddingBottom, setNavbarTotalHeight } = useScrollContext();

  useEffect(() => {
    const totalHeight = NAVBAR_CONTENT_HEIGHT + insets.top;
    setNavbarTotalHeight(totalHeight);
  }, [insets.top]);

  const navigateTo = (screen, movie = null) => {
    setCurrentScreen(screen);
    if (movie) setSelectedMovie(movie);
  };

  const goHome = () => {
    setCurrentScreen('home');
    setActiveTab('home');
    setSelectedMovie(null);
    setSearchQuery('');
  };

  const openPlayer = (movie) => {
    setPlayerMovie(movie);
    setPlayerVisible(true);
  };

  const closePlayer = () => {
    setPlayerVisible(false);
    setPlayerMovie(null);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" backgroundColor="#0a0a0f" />

      <Animated.View style={styles.container}>
        <Animated.View style={[styles.navbarWrapper, { transform: [{ translateY: navbarTranslate }] }]}>
          <View style={{ height: insets.top, backgroundColor: 'rgba(10,10,15,0.98)' }} />
          <Navbar
            onLogoPress={goHome}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navigateTo={navigateTo}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Animated.View>

        <Animated.View style={[styles.content, { paddingTop: contentPaddingTop, paddingBottom: contentPaddingBottom }]}>
          {currentScreen === 'home' && (
            <HomeScreen
              navigateTo={navigateTo}
              activeTab={activeTab}
              searchQuery={searchQuery}
              onPlayMovie={openPlayer}
            />
          )}
          {currentScreen === 'detail' && selectedMovie && (
            <DetailScreen
              movie={selectedMovie}
              onBack={goHome}
              onPlayMovie={openPlayer}
            />
          )}
        </Animated.View>

        <Animated.View style={[styles.footerWrapper, { transform: [{ translateY: footerTranslate }] }]}>
          <Footer />
          <View style={{ height: insets.bottom, backgroundColor: 'rgba(5,5,10,0.98)' }} />
        </Animated.View>
      </Animated.View>

      {playerMovie && (
        <VideoPlayer
          visible={playerVisible}
          onClose={closePlayer}
          videoUrl={playerMovie.videoUrl}
          title={playerMovie.title}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <ScrollProvider>
          <AppInner />
        </ScrollProvider>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  navbarWrapper: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    ...Platform.select({ web: { position: 'fixed' } }),
  },
  content: { flex: 1 },
  footerWrapper: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    zIndex: 100,
    ...Platform.select({ web: { position: 'fixed' } }),
  },
});
