import {
  SkiaClockValue,
  SkiaValue,
  useValueEffect,
} from '@shopify/react-native-skia';

export const useHandleBlockCollision = (
  clock: SkiaClockValue,
  active: SkiaValue,
  ballX: SkiaValue,
  ballY: SkiaValue,
  score: SkiaValue,
  yDirection: SkiaValue,
  x: number,
  width: number,
  height: number,
  y: number,
) => {
  useValueEffect(clock, () => {
    if (active.current !== 0) {
      if (ballY.current <= y + height && ballY.current >= y) {
        if (ballX.current >= x && ballX.current <= x + width) {
          if (yDirection.current === 1) {
            yDirection.current = 0;
          } else {
            yDirection.current = 1;
          }
          score.current += 1;
          active.current = 0;
        }
      }
    }
  });
};
