import {useValue} from '@shopify/react-native-skia';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const useGetGridPosition = (
  index: number,
  xCount: number,
  itemHeight: number,
) => {
  const row = index / xCount;
  const col = index % xCount;
  const x = col * (windowWidth / xCount) + 4;
  const y = Math.floor(row) * (itemHeight + 8) + 150;
  const width = (windowWidth - 20) / xCount - 3.5;
  const height = itemHeight;
  const active = useValue(1);
  const color = 'white';

  return {x, y, width, height, active, color};
};
