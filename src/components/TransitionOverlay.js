import React from 'react';
import { Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { useTransition } from '../context/TransitionContext';
import DetailScreen from '../screens/DetailScreen';

/**
 * Overlay que fica sempre no topo do app.
 * Durante a transição mostra a imagem do card se expandindo.
 * Quando abre, mostra o DetailScreen com fade.
 * No collapse, faz o caminho inverso.
 */
const TransitionOverlay = ({ onPlayMovie }) => {
  const {
    visible, movie, phase,
    animX, animY, animW, animH, animRadius, animOpacity, contentOp,
    collapse,
  } = useTransition();

  if (!visible || !movie) return null;

  const handleBack = () => {
    collapse();
  };

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          left: animX,
          top: animY,
          width: animW,
          height: animH,
          borderRadius: animRadius,
          opacity: animOpacity,
        },
      ]}
      pointerEvents={phase === 'idle' ? 'none' : 'auto'}
    >
      {/* Imagem de fundo do card — visível durante a expansão */}
      <Animated.Image
        source={{ uri: movie.backdrop || movie.image }}
        style={[StyleSheet.absoluteFill, { opacity: contentOp.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}
        resizeMode="cover"
      />

      {/* DetailScreen aparece com fade após expansão completa */}
      {phase === 'open' || phase === 'collapsing' ? (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: contentOp }]}>
          <DetailScreen
            movie={movie}
            onBack={handleBack}
            onPlayMovie={onPlayMovie}
            insideOverlay
          />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 999,
    overflow: 'hidden',
    backgroundColor: '#0a0a0f',
  },
});

export default TransitionOverlay;
