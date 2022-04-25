/* eslint-disable no-undef */
import { calcTileType, calcHealthLevel, getAllowedFields } from '../utils';

test('Test calcTileType', () => {
  const item = [0, 3, 7, 8, 13, 15, 56, 58, 63];
  const expected = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'];
  for (let i = 0; i < item.length; i += 1) {
    expect(calcTileType(item[i], 8)).toBe(expected[i]);
  }
});

test('Test calcHealthLevel', () => {
  const item = [12, 45, 70];
  const expected = ['critical', 'normal', 'high'];
  for (let i = 0; i < item.length; i += 1) {
    expect(calcHealthLevel(item[i])).toBe(expected[i]);
  }
});

test.each([
  ['Test getAllowedFields for swordsman attack', { index: 0, type: 'swordsman', flag: 'attack' }, [1, 8, 9]],
  ['Test getAllowedFields for undead attack', { index: 7, type: 'undead', flag: 'attack' }, [6, 14, 15]],
  ['Test getAllowedFields for swordsman move', { index: 0, type: 'swordsman', flag: 'move' }, [1, 2, 3, 4, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36]],
  ['Test getAllowedFields for undead move', { index: 7, type: 'undead', flag: 'move' }, [3, 4, 5, 6, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 27, 28, 29, 30, 31, 35, 36, 37, 38, 39]],
  ['Test getAllowedFields for bowman attack', { index: 0, type: 'bowman', flag: 'attack' }, [1, 2, 8, 9, 10, 16, 17, 18]],
  ['Test getAllowedFields for vampire attack', { index: 7, type: 'vampire', flag: 'attack' }, [5, 6, 13, 14, 15, 21, 22, 23]],
  ['Test getAllowedFields for bowman move', { index: 0, type: 'bowman', flag: 'move' }, [1, 2, 8, 9, 10, 16, 17, 18]],
  ['Test getAllowedFields for vampire move', { index: 7, type: 'vampire', flag: 'move' }, [5, 6, 13, 14, 15, 21, 22, 23]],
  ['Test getAllowedFields for magician attack', { index: 0, type: 'magician', flag: 'attack' }, [1, 2, 3, 4, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36]],
  ['Test getAllowedFields for daemon attack', { index: 7, type: 'daemon', flag: 'attack' }, [3, 4, 5, 6, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 27, 28, 29, 30, 31, 35, 36, 37, 38, 39]],
  ['Test getAllowedFields for daemon move', { index: 7, type: 'daemon', flag: 'move' }, [6, 14, 15]],
  ['Test getAllowedFields for magician move', { index: 0, type: 'magician', flag: 'move' }, [1, 8, 9]],
  ['Test getAllowedFields for  default', { index: 0, type: '', flag: 'move' }, []],
])(('It should be %s'), (_, input, expected) => {
  const { index, type, flag } = input;
  expect(getAllowedFields(index, type, flag)).toEqual(expected);
});
