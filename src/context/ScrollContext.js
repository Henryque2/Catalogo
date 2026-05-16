import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import { Animated } from 'react-native';

const ScrollContext = createContext(null);

export const NAVBAR_CONTENT_HEIGHT = 60;
export const FOOTER_HEIGHT = 44;

export const ScrollProvider = ({ children }) => {
  const lastScrollY = useRef(0);
  const isVisible = useRef(true);
  const isAnimating = useRef(false); // trava para evitar chamadas sobrepostas
  const [navbarHeight, setNavbarHeight] = useState(NAVBAR_CONTENT_HEIGHT);

  const navbarTranslate = useRef(new Animated.Value(0)).current;
  const footerTranslate = useRef(new Animated.Value(0)).current;
  const contentPaddingTop = useRef(new Animated.Value(NAVBAR_CONTENT_HEIGHT)).current;
  const contentPaddingBottom = useRef(new Animated.Value(FOOTER_HEIGHT)).current;

  const animationRef = useRef(null);

  const setNavbarTotalHeight = useCallback((h) => {
    setNavbarHeight(h);
    contentPaddingTop.setValue(h);
  }, []);

  const showBars = useCallback((h) => {
    if (isVisible.current) return;
    if (isAnimating.current) return; // ignora se já está animando
    isVisible.current = true;
    isAnimating.current = true;

    if (animationRef.current) animationRef.current.stop();

    animationRef.current = Animated.parallel([
      Animated.timing(navbarTranslate, { toValue: 0, duration: 200, useNativeDriver: false }),
      Animated.timing(footerTranslate, { toValue: 0, duration: 200, useNativeDriver: false }),
      Animated.timing(contentPaddingTop, { toValue: h ?? navbarHeight, duration: 200, useNativeDriver: false }),
      Animated.timing(contentPaddingBottom, { toValue: FOOTER_HEIGHT, duration: 200, useNativeDriver: false }),
    ]);

    animationRef.current.start(({ finished }) => {
      if (finished) isAnimating.current = false;
    });
  }, [navbarHeight]);

  const hideBars = useCallback(() => {
    if (!isVisible.current) return;
    if (isAnimating.current) return; // ignora se já está animando
    isVisible.current = false;
    isAnimating.current = true;

    if (animationRef.current) animationRef.current.stop();

    animationRef.current = Animated.parallel([
      Animated.timing(navbarTranslate, { toValue: -navbarHeight, duration: 200, useNativeDriver: false }),
      Animated.timing(footerTranslate, { toValue: FOOTER_HEIGHT, duration: 200, useNativeDriver: false }),
      Animated.timing(contentPaddingTop, { toValue: 0, duration: 200, useNativeDriver: false }),
      Animated.timing(contentPaddingBottom, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]);

    animationRef.current.start(({ finished }) => {
      if (finished) isAnimating.current = false;
    });
  }, [navbarHeight]);

  const handleScroll = useCallback((offsetY) => {
    const diff = offsetY - lastScrollY.current;
    const nearTop = offsetY < 40;

    // Ignora micro-movimentos — threshold maior evita tremedeira no bouncing
    const THRESHOLD = 8;

    if (nearTop) {
      showBars(navbarHeight);
    } else if (diff > THRESHOLD) {
      hideBars();
    } else if (diff < -THRESHOLD) {
      showBars(navbarHeight);
    }

    lastScrollY.current = offsetY;
  }, [showBars, hideBars, navbarHeight]);

  return (
    <ScrollContext.Provider value={{
      navbarTranslate,
      footerTranslate,
      contentPaddingTop,
      contentPaddingBottom,
      handleScroll,
      setNavbarTotalHeight,
    }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useScrollContext must be used within ScrollProvider');
  return ctx;
};
