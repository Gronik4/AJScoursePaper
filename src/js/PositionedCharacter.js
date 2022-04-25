import Character from './Character';
import GameState from './GameState';

export default class PositionedCharacter {
  constructor(character) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    this.character = character;
  }

  creatPositions() {
    const allowedHum = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    const allowedMons = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    const positions = {};
    let newPos = 0;
    positions.character = this.character;
    if (GameState.human.includes(this.character.type)) {
      do {
        const rand = Math.floor(Math.random() * 16);
        newPos = allowedHum[rand];
      } while (GameState.occupied.includes(newPos));
      GameState.occupied.push(newPos);
      positions.position = newPos;
    } else {
      do {
        const rand = Math.floor(Math.random() * 16);
        newPos = allowedMons[rand];
      } while (GameState.occupied.includes(newPos));
      GameState.occupied.push(newPos);
      positions.position = newPos;
    }
    return positions;
  }
}
