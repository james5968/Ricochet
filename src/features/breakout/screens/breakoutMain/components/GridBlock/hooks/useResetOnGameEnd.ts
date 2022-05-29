import {runTiming, SkiaValue, useValueEffect} from '@shopify/react-native-skia';

export const useResetOnGameEnd = (
  gameStarted: SkiaValue,
  active: SkiaValue,
) => {
  useValueEffect(gameStarted, () => {
    if (gameStarted.current === 0) {
      runTiming(active, 1, {duration: 1000});
    }
  });
};
