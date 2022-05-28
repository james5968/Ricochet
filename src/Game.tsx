import {
  Blur,
  Canvas,
  Circle,
  Paint,
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
import {useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const createGrid = (x: number, y: number, width: number, height: number) => {
  const grid = [];
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      grid.push({
        x: i * (width / x) + 7.5,
        y: j * (height + 15) + 150,
        width: (width - 50) / x - 2.5,
        height,
        active: true,
        color: 'white',
      });
    }
  }
  return grid;
};

const PADDLE_WIDTH = 85;
const BALL_SPEED_Y = 10;
const BALL_SPEED_X = 9;

const Game = () => {
  const font = useFont(require('./assets/fonts/AlmaMono-Thin.otf'), 32);

  const {height, width} = useWindowDimensions();
  const cx = useValue(width / 2 - PADDLE_WIDTH / 2);
  const insets = useSafeAreaInsets();
  const [targetGrid, setTargetGrid] = useState(createGrid(4, 4, width, 25));
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
    setTargetGrid(createGrid(4, 4, width, 25));
  };
  const onWin = () => {
    runTiming(onWinOpacity, 1);
    setTargetGrid(createGrid(4, 4, width, 25));
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

      //Grid Handlers
      const hasWon = targetGrid.some(gridItem => gridItem.active === true);
      if (!hasWon) {
        onWin();

        gameStarted.current = 0;
      } else {
        targetGrid.forEach((gridItem, index) => {
          if (gridItem.active) {
            if (
              ballY.current <= gridItem.y + gridItem.height &&
              ballY.current >= gridItem.y
            ) {
              if (
                ballX.current >= gridItem.x &&
                ballX.current <= gridItem.x + gridItem.width
              ) {
                if (yDirection.current === 1) {
                  yDirection.current = 0;
                } else {
                  yDirection.current = 1;
                }
                score.current += 1;
                const mutatedGrid = [...targetGrid];
                mutatedGrid[index].active = false;
                setTargetGrid(mutatedGrid);
              }
            }
          }
        });
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
    <Canvas
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}
      onTouch={touchHandler}>
      <Rect x={0} y={0} width={width} height={height + 50} color="black" />
      <Text
        x={width / 2 - 22}
        y={insets.top + 50}
        text={`${score.current < 10 ? '0' : ''}${score.current}`}
        font={font}
        color="white">
        <Paint color="white" opacity={0.8}>
          <Blur blur={4} />
        </Paint>
      </Text>
      {targetGrid.map((gridItem, index) =>
        gridItem.active ? (
          <Rect
            key={index}
            x={gridItem.x}
            y={gridItem.y}
            width={gridItem.width}
            height={gridItem.height}>
            <Paint color={gridItem.color} style="stroke" strokeWidth={2} />
            <Paint color={gridItem.color} style="stroke" strokeWidth={2}>
              <Blur blur={4} mode="clamp" />
            </Paint>
          </Rect>
        ) : null,
      )}

      <Rect
        x={cx}
        y={height - insets.bottom - 32}
        width={PADDLE_WIDTH}
        height={20}>
        <Paint color="white" style="stroke" strokeWidth={2} />
        <Paint color="white" style="stroke" strokeWidth={2}>
          <Blur blur={4} mode="clamp" />
        </Paint>
      </Rect>
      <Circle cx={ballX} cy={ballY} r={8}>
        <Paint color="white" style="stroke" strokeWidth={2} />
        <Paint color="white" style="stroke" strokeWidth={2}>
          <Blur blur={3} />
        </Paint>
      </Circle>
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
