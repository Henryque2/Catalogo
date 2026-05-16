import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import { Animated } from 'react-native';

const ScrollContext = createContext(null);

export const NAVBAR_CONTENT_HEIGHT = 60;
export const FOOTER_HEIGHT = 44;

export const ScrollProvider = ({ children }) => {
  const lastScrollY = useRef(0);
  const isVisible = useRef(true);
  // navbarHeight começa com o valor base; será atualizado pelo App com o inset real
  const [navbarHeight, setNavbarHeight] = useState(NAVBAR_CONTENT_HEIGHT);

  const navbarTranslate = useRef(new Animated.Value(0)).current;
  const footerTranslate = useRef(new Animated.Value(0)).current;
  const contentPaddingTop = useRef(new Animated.Value(NAVBAR_CONTENT_HEIGHT)).current;
  const contentPaddingBottom = useRef(new Animated.Value(FOOTER_HEIGHT)).current;

  // Chamado pelo App quando o inset real está disponível
  const setNavbarTotalHeight = useCallback((h) => {
    setNavbarHeight(h);
    contentPaddingTop.setValue(h);
  }, []);

  const showBars = useCallback((h) => {
    if (isVisible.current) return;
    isVisible.current = true;
    Animated.parallel([
      Animated.spring(navbarTranslate, { toValue: 0, useNativeDriver: false, tension: 80, friction: 14 }),
      Animated.spring(footerTranslate, { toValue: 0, useNativeDriver: false, tension: 80, friction: 14 }),
      Animated.spring(contentPaddingTop, { toValue: h ?? navbarHeight, useNativeDriver: false, tension: 80, friction: 14 }),
      Animated.spring(contentPaddingBottom, { toValue: FOOTER_HEIGHT, useNativeDriver: false, tension: 80, friction: 14 }),
    ]).start();
  }, [navbarHeight]);

  const hideBars = useCallback(() => {
    if (!isVisible.current) return;
    isVisible.current = false;
    Animated.parallel([
      Animated.spring(navbarTranslate, { toValue: -navbarHeight, useNativeDriver: false, tension: 80, friction: 14 }),
      Animated.spring(footerTranslate, { toValue: FOOTER_HEIGHT, useNativeDriver: false, tension: 80, friction: 14 }),
      Animated.spring(contentPaddingTop, { toValue: 0, useNativeDriver: false, tension: 80, friction: 14 }),
      Animated.spring(contentPaddingBottom, { toValue: 0, useNativeDriver: false, tension: 80, friction: 14 }),
    ]).start();
  }, [navbarHeight]);

  const handleScroll = useCallback((offsetY) => {
    const diff = offsetY - lastScrollY.current;
    const nearTop = offsetY < 40;
    if (nearTop) showBars(navbarHeight);
    else if (diff > 3) hideBars();
    else if (diff < -3) showBars(navbarHeight);
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
