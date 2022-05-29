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
  useDerivedValue,
} from '@shopify/react-native-skia';
import React from 'react';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GridBlock from './components/GridBlock/GridBlock';
import {styles} from './Breakout.styles';
import {windowHeight, windowWidth} from 'src/shared/constants/dimensions';
import Paddle from './components/Paddle/Paddle';
import {
  BALL_SPEED_Y,
  BALL_SPEED_X,
  PADDLE_WIDTH,
  GRIDE_COUNT,
  X_COUNT,
} from './Breakout.constants';

const Game = () => {
  const font = useFont(require('./assets/fonts/AlmaMono-Thin.otf'), 32);
  const cx = useValue(windowWidth / 2 - PADDLE_WIDTH / 2);
  const insets = useSafeAreaInsets();
  const clock = useClockValue();
  const ballY = useValue(windowHeight - insets.bottom - 42);
  const ballX = useValue(windowWidth / 2);
  const yDirection = useValue(1);
  const xDirection = useValue(1);
  const gameStarted = useValue(0);
  const score = useValue(0);
  const scoreDisplay = useDerivedValue(() => {
    return `${score.current < 10 ? '0' : ''}${score.current}`;
  }, [score]);
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
      if (ballY.current >= windowHeight + 10) {
        onGameOver();
        ballY.current = windowHeight - insets.bottom - 50;
        ballX.current = windowWidth / 2;
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
      if (ballX.current >= windowWidth - 8) {
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

      if (score.current === GRIDE_COUNT) {
        onWin();
        ballY.current = windowHeight - insets.bottom - 50;
        ballX.current = windowWidth / 2;
        gameStarted.current = 0;
      }
    }
  });

  const touchHandler = useTouchHandler({
    onStart: () => {
      if (gameStarted.current !== 1) {
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
      } else if (x > windowWidth - PADDLE_WIDTH / 2) {
        cx.current = windowWidth - PADDLE_WIDTH;
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
      <Rect
        x={0}
        y={0}
        width={windowWidth}
        height={windowHeight + 50}
        color="black"
      />
      <Text
        x={windowWidth / 2 - 22}
        y={insets.top + 50}
        text={scoreDisplay}
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
          gameStarted={gameStarted}
        />
      ))}

      <Paddle
        clock={clock}
        ballX={ballX}
        ballY={ballY}
        yDirection={yDirection}
        xDirection={xDirection}
        cx={cx}
        bottom={insets.bottom}
      />

      <Circle cx={ballX} cy={ballY} r={8} color="white" />

      <Text
        x={windowWidth / 2 - 100}
        y={windowHeight / 2 + 100}
        text="GAME OVER"
        font={font}
        color="white"
        opacity={gameOverOpacity}
      />
      <Text
        x={windowWidth / 2 - 82}
        y={windowHeight / 2 + 100}
        text={`YOU WIN`}
        font={font}
        color="white"
        opacity={onWinOpacity}
      />
    </Canvas>
  );
};

export default Game;
