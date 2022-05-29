import {
  Canvas,
  Circle,
  Rect,
  useClockValue,
  useTouchHandler,
  useValue,
  useValueEffect,
  runTiming,
  Text,
  useFont,
} from '@shopify/react-native-skia';
import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GridBlock from './components/GridBlock/GridBlock';
import {styles} from './Game.styles';

type GridType = {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  color: string;
}[];

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PADDLE_WIDTH = 85;
const BALL_SPEED_Y = 9;
const BALL_SPEED_X = 8;
const X_COUNT = 5;
const Y_COUNT = 6;
const GRIDE_COUNT = X_COUNT * Y_COUNT;

const Game = () => {
  const font = useFont(require('./assets/fonts/AlmaMono-Thin.otf'), 32);

  const cx = useValue(width / 2 - PADDLE_WIDTH / 2);
  const insets = useSafeAreaInsets();
  const clock = useClockValue();
  const ballY = useValue(height - insets.bottom - 42);
  const ballX = useValue(width / 2);
  const yDirection = useValue(1);
  const xDirection = useValue(1);
  const gameStarted = useValue(0);
  const score = useValue(0);
  const gameOverOpacity = useValue(0);
  const onWinOpacity = useValue(0);
  const onGameOver = () => {
    runTiming(gameOverOpacity, 1);
  };
  const onWin = () => {
    runTiming(onWinOpacity, 1);
  };

  useValueEffect(clock, () => {
    if (gameStarted.current === 1) {
      //Y Handlers
      if (ballY.current >= height + 10) {
        onGameOver();
        gameStarted.current = 0;
      } else if (ballY.current <= 0 + insets.top) {
        yDirection.current = 0;
      }

      if (yDirection.current === 1) {
        ballY.current -= BALL_SPEED_Y;
      } else {
        ballY.current += BALL_SPEED_Y;
      }

      //X Handlers
      if (ballX.current >= width - 8) {
        xDirection.current = 1;
      } else if (ballX.current <= 8) {
        xDirection.current = 0;
      }

      if (xDirection.current === 1) {
        ballX.current -= BALL_SPEED_X;
      } else {
        ballX.current += BALL_SPEED_X;
      }

      //Paddle Handlers
      const ballInXRange =
        ballX.current >= cx.current &&
        ballX.current <= cx.current + PADDLE_WIDTH;
      const ballInYRange =
        ballY.current >= height - insets.bottom - 40 &&
        ballY.current <= height - insets.bottom - 20;
      if (ballInXRange && ballInYRange) {
        yDirection.current = 1;
        xDirection.current = Math.round(Math.random());
      }
    }
  });

  const touchHandler = useTouchHandler({
    onStart: () => {
      if (gameStarted.current !== 1) {
        ballY.current = height - insets.bottom - 42;
        ballX.current = width / 2;
        gameOverOpacity.current = 0;
        onWinOpacity.current = 0;
        score.current = 0;
        yDirection.current = 1;
        gameStarted.current = 1;
      }
    },
    onActive: ({x}) => {
      if (x < PADDLE_WIDTH / 2) {
        cx.current = 0;
      } else if (x > width - PADDLE_WIDTH / 2) {
        cx.current = width - PADDLE_WIDTH;
      } else {
        cx.current = x - PADDLE_WIDTH / 2;
      }
    },
  });
  if (font === null) {
    return null;
  }
  return (
    <Canvas style={styles.canvas} onTouch={touchHandler}>
      <Rect x={0} y={0} width={width} height={height + 50} color="black" />
      <Text
        x={width / 2 - 22}
        y={insets.top + 50}
        text={`${score.current < 10 ? '0' : ''}${score.current}`}
        font={font}
        color="white"
      />

      {Array.from(Array(GRIDE_COUNT), (_, i) => (
        <GridBlock
          index={i}
          key={i}
          clock={clock}
          ballX={ballX}
          ballY={ballY}
          yDirection={yDirection}
          xCount={X_COUNT}
          score={score}
        />
      ))}

      <Rect
        x={cx}
        y={height - insets.bottom - 32}
        width={PADDLE_WIDTH}
        height={20}
        color="white"
      />

      <Circle cx={ballX} cy={ballY} r={8} color="white" />

      <Text
        x={width / 2 - 100}
        y={height / 2}
        text="GAME OVER"
        font={font}
        color="white"
        opacity={gameOverOpacity}
      />
      <Text
        x={width / 2 - 82}
        y={height / 2}
        text={`YOU WIN`}
        font={font}
        color="white"
        opacity={onWinOpacity}
      />
    </Canvas>
  );
};

export default Game;
