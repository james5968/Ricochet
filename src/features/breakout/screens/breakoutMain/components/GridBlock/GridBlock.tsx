import React from 'react';
import {Rect, SkiaClockValue, SkiaValue} from '@shopify/react-native-skia';
import {useGetGridPosition} from './hooks/useGetBlockPosition';
import {useHandleBlockCollision} from './hooks/useHandleBlockCollision';
import {useResetOnGameEnd} from './hooks/useResetOnGameEnd';

type PropsType = {
  index: number;
  xCount: number;
  ballX: SkiaValue;
  ballY: SkiaValue;
  clock: SkiaClockValue;
  yDirection: SkiaValue;
  score: SkiaValue;
  gameStarted: SkiaValue;
};

const GridBlock = ({
  index,
  xCount,
  ballX,
  ballY,
  clock,
  yDirection,
  score,
  gameStarted,
}: PropsType) => {
  const {x, y, width, height, color, active} = useGetGridPosition(
    index,
    xCount,
    25,
  );
  useHandleBlockCollision(
    clock,
    active,
    ballX,
    ballY,
    score,
    yDirection,
    x,
    width,
    height,
    y,
  );
  useResetOnGameEnd(gameStarted, active);
  return (
    <Rect
      key={index}
      x={x}
      y={y}
      width={width}
      height={height}
      color={color}
      opacity={active}
    />
  );
};

export default GridBlock;
