import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';

const TransitionContext = createContext(null);

export const TransitionProvider = ({ children }) => {
  const { width: SW, height: SH } = Dimensions.get('window');

  // Origem da animação (posição e tamanho do card tocado)
  const origin = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Valores animados
  const animX      = useRef(new Animated.Value(0)).current;
  const animY      = useRef(new Animated.Value(0)).current;
  const animW      = useRef(new Animated.Value(0)).current;
  const animH      = useRef(new Animated.Value(0)).current;
  const animRadius = useRef(new Animated.Value(12)).current;
  const animOpacity= useRef(new Animated.Value(0)).current;
  const contentOp  = useRef(new Animated.Value(0)).current;

  const [visible, setVisible] = useState(false);
  const [movie, setMovie]     = useState(null);
  const [phase, setPhase]     = useState('idle'); // idle | expanding | open | collapsing

  const expand = useCallback((cardLayout, selectedMovie, onDone) => {
    const { x, y, width, height } = cardLayout;
    origin.current = { x, y, w: width, h: height };

    // Reseta para o tamanho/posição do card
    animX.setValue(x);
    animY.setValue(y);
    animW.setValue(width);
    animH.setValue(height);
    animRadius.setValue(12);
    animOpacity.setValue(1);
    contentOp.setValue(0);

    setMovie(selectedMovie);
    setVisible(true);
    setPhase('expanding');

    const DURATION = 420;
    const EASE = Easing.out(Easing.cubic);

    Animated.parallel([
      Animated.timing(animX,      { toValue: 0,  duration: DURATION, easing: EASE, useNativeDriver: false }),
      Animated.timing(animY,      { toValue: 0,  duration: DURATION, easing: EASE, useNativeDriver: false }),
      Animated.timing(animW,      { toValue: SW, duration: DURATION, easing: EASE, useNativeDriver: false }),
      Animated.timing(animH,      { toValue: SH, duration: DURATION, easing: EASE, useNativeDriver: false }),
      Animated.timing(animRadius, { toValue: 0,  duration: DURATION, easing: EASE, useNativeDriver: false }),
    ]).start(() => {
      setPhase('open');
      Animated.timing(contentOp, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      onDone?.();
    });
  }, [SW, SH]);

  const collapse = useCallback((onDone) => {
    setPhase('collapsing');
    const { x, y, w, h } = origin.current;
    const DURATION = 360;
    const EASE = Easing.in(Easing.cubic);

    Animated.sequence([
      Animated.timing(contentOp, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(animX,      { toValue: x,  duration: DURATION, easing: EASE, useNativeDriver: false }),
        Animated.timing(animY,      { toValue: y,  duration: DURATION, easing: EASE, useNativeDriver: false }),
        Animated.timing(animW,      { toValue: w,  duration: DURATION, easing: EASE, useNativeDriver: false }),
        Animated.timing(animH,      { toValue: h,  duration: DURATION, easing: EASE, useNativeDriver: false }),
        Animated.timing(animRadius, { toValue: 12, duration: DURATION, easing: EASE, useNativeDriver: false }),
        Animated.timing(animOpacity,{ toValue: 0,  duration: DURATION, easing: EASE, useNativeDriver: false }),
      ]),
    ]).start(() => {
      setVisible(false);
      setPhase('idle');
      setMovie(null);
      onDone?.();
    });
  }, []);

  return (
    <TransitionContext.Provider value={{
      expand, collapse,
      animX, animY, animW, animH, animRadius, animOpacity, contentOp,
      visible, movie, phase,
    }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition must be used within TransitionProvider');
  return ctx;
};
