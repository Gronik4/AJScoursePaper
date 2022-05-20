import { calcTileType, calcHealthLevel, getAllowedFields } from '../utils';

test.each([
  ['Test calcTileType on top-left', { item: 0 }, 'top-left'],
  ['Test calcTileType on top', { item: 3 }, 'top'],
  ['Test calcTileType on top-left', { item: 7 }, 'top-right'],
  ['Test calcTileType on left', { item: 8 }, 'left'],
  ['Test calcTileType on center', { item: 13 }, 'center'],
  ['Test calcTileType on right', { item: 15 }, 'right'],
  ['Test calcTileType on bottom-left', { item: 56 }, 'bottom-left'],
  ['Test calcTileType on bottom', { item: 58 }, 'bottom'],
  ['Test calcTileType on bottom-right', { item: 63 }, 'bottom-right'],
])(('It should be %s'), (_, input, expected) => {
  const { item } = input;
  expect(calcTileType(item, 8)).toBe(expected);
});

test.each([
  ['Test calcHealthLevel critical', { item: 12 }, 'critical'],
  ['Test calcHealthLevel normal', { item: 45 }, 'normal'],
  ['Test calcHealthLevel high', { item: 70 }, 'high'],
])(('It should be %s'), (_, input, expected) => {
  const { item } = input;
  expect(calcHealthLevel(item)).toBe(expected);
});

test.each([
  ['Test getAllowedFields for swordsman attack', { index: 0, type: 'swordsman', flag: 'attack' }, [1, 8, 9]],
  ['Test getAllowedFields for swordsman move', { index: 0, type: 'swordsman', flag: 'move' }, [1, 2, 3, 4, 9, 8, 18, 16, 27, 24, 36, 32]],
  ['Test getAllowedFields for undead attack', { index: 7, type: 'undead', flag: 'attack' }, [6, 14, 15]],
  ['Test getAllowedFields for undead move', { index: 7, type: 'undead', flag: 'move' }, [3, 4, 5, 6, 15, 14, 23, 21, 31, 28, 39, 35]],
  ['Test getAllowedFields for bowman attack', { index: 0, type: 'bowman', flag: 'attack' }, [1, 2, 8, 9, 10, 16, 17, 18]],
  ['Test getAllowedFields for bowman move', { index: 0, type: 'bowman', flag: 'move' }, [1, 2, 9, 8, 18, 16]],
  ['Test getAllowedFields for vampire attack', { index: 7, type: 'vampire', flag: 'attack' }, [5, 6, 13, 14, 15, 21, 22, 23]],
  ['Test getAllowedFields for vampire move', { index: 7, type: 'vampire', flag: 'move' }, [5, 6, 15, 14, 23, 21]],
  ['Test getAllowedFields for magician attack', { index: 0, type: 'magician', flag: 'attack' }, [1, 2, 3, 4, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36]],
  ['Test getAllowedFields for magician move', { index: 0, type: 'magician', flag: 'move' }, [1, 9, 8]],
  ['Test getAllowedFields for daemon attack', { index: 7, type: 'daemon', flag: 'attack' }, [3, 4, 5, 6, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 27, 28, 29, 30, 31, 35, 36, 37, 38, 39]],
  ['Test getAllowedFields for daemon move', { index: 7, type: 'daemon', flag: 'move' }, [6,15,14]],
  ['Test getAllowedFields for  default', { index: 0, type: '', flag: 'move' }, []],
])(('It should be %s'), (_, input, expected) => {
  const { index, type, flag } = input;
  expect(getAllowedFields(index, type, flag)).toEqual(expected);
});
