import React from 'react';
import {Rect, SkiaValue} from '@shopify/react-native-skia';
import {useGetGridPosition} from './hooks/useGetBlockPosition';
import {useHandleBlockCollision} from './hooks/useHandleBlockCollision';

type PropsType = {
  index: number;
  xCount: number;
  ballX: SkiaValue;
  ballY: SkiaValue;
  clock: SkiaValue;
  yDirection: SkiaValue;
  score: SkiaValue;
};

const GridBlock = ({
  index,
  xCount,
  ballX,
  ballY,
  clock,
  yDirection,
  score,
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
