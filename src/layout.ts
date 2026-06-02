import type { Photo } from './photoData';

export type CardLayout = {
  x: number;
  y: number;
  width: number;
  rotation: number;
  zIndex: number;
  delay: number;
  tapeRotation: number;
  ratio: string;
};

const basePositions = [
  [10, 38], [23, 34], [36, 39], [50, 35], [66, 39], [82, 36],
  [14, 57], [28, 52], [42, 59], [58, 52], [73, 58], [88, 54],
  [10, 73], [24, 69], [38, 77], [53, 70], [69, 77], [84, 72],
  [6, 49], [21, 46], [34, 64], [49, 47], [64, 65], [80, 48],
  [14, 84], [30, 82], [45, 86], [60, 82], [75, 85], [91, 67],
  [20, 62], [33, 30], [49, 82], [64, 31], [80, 42], [93, 80],
  [7, 64], [55, 61],
] as const;

const rotations = [-11, 7, -5, 9, -8, 12, -6, 5, 10, -12, 7, -9, 4, -13, 8, -4, 11, -7];
const widths = [138, 132, 158, 142, 134, 156, 136, 148, 130, 152, 138, 144];

export function getRatioValue(ratio: Photo['ratio']) {
  if (ratio === 'portrait') return '3 / 4';
  if (ratio === 'landscape') return '4 / 3';
  return '1 / 1';
}

export function getCardLayout(photo: Photo, index: number): CardLayout {
  const [x, y] = basePositions[index];

  return {
    x,
    y,
    width: widths[index % widths.length],
    rotation: rotations[index % rotations.length],
    zIndex: Math.max(6, 28 - Math.floor(index / 2)),
    delay: 0.24 + index * 0.035,
    tapeRotation: rotations[(index + 5) % rotations.length] * 0.55,
    ratio: getRatioValue(photo.ratio),
  };
}
