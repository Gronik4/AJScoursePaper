import Character from './Character';
import GameState from './GameState';

export default class PositionedCharacter {
  constructor(character) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    this.character = character;
    this.size = GameState.boardSize;
  }

  creatPositions() {
    const allowedHum = [];
    for (let i = 0; i < this.size; i += 1) {
      const memb = i * this.size;
      allowedHum.push(memb);
      allowedHum.push(memb + 1);
    }
    const allowedMons = [];
    for (let i = 1; i < this.size + 1; i += 1) {
      const memb = i * this.size - 2;
      allowedMons.push(memb);
      allowedMons.push(memb + 1);
    }
    const { human } = GameState;
    const positions = {};
    let newPos = 0;
    positions.character = this.character;
    if (human.includes(this.character.type)) {
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
