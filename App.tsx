import React from 'react';
import {StatusBar} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import Game from 'src/features/breakout/screens/breakoutMain/Breakout';

const App = () => {
  return (
    <SafeAreaProvider style={{backgroundColor: 'black'}}>
      <StatusBar translucent barStyle="light-content" />
      <Game />
    </SafeAreaProvider>
  );
};

export default App;
