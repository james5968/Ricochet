import React from 'react';
import {
  Rect,
  SkiaClockValue,
  SkiaValue,
  useCanvas,
  useValueEffect,
} from '@shopify/react-native-skia';
import {PADDLE_WIDTH} from '../../Breakout.constants';

type PropsType = {
  clock: SkiaClockValue;
  ballX: SkiaValue;
  ballY: SkiaValue;
  yDirection: SkiaValue;
  xDirection: SkiaValue;
  cx: SkiaValue;
  bottom: number;
};

const Paddle = ({
  clock,
  ballX,
  ballY,
  yDirection,
  xDirection,
  cx,
  bottom,
}: PropsType) => {
  const {size} = useCanvas();
  useValueEffect(clock, () => {
    const ballInXRange =
      ballX.current >= cx.current && ballX.current <= cx.current + PADDLE_WIDTH;
    const ballInYRange =
      ballY.current >= size.current.height - bottom - 40 &&
      ballY.current <= size.current.height - bottom - 20;
    if (ballInXRange && ballInYRange) {
      yDirection.current = 1;
      xDirection.current = Math.round(Math.random());
    }
  });
  return (
    <Rect
      x={cx}
      y={size.current.height - bottom - 32}
      width={PADDLE_WIDTH}
      height={20}
      color="white"
    />
  );
};

export default Paddle;
