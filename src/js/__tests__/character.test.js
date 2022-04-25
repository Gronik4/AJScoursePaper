/* eslint-disable no-undef */
import Character from '../Character';
import Bowman from '../characters/bowman';

test('Throwing an error when using class Character', () => {
  expect(() => new Character()).toThrow();
});

test('Test inherited class', () => {
  expect(new Bowman().type).toBe('bowman');
});
