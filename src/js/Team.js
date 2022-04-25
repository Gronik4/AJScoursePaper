/**
 * @param survivors  - команда выживших персонажей
 *@param motion - чей ход.
 */

import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';
import generateTeam from './generators';

export default class Team {
  constructor(motion, level, number) {
    // eslint-disable-next-line no-unused-expressions
    this.candidates;
    this.level = level;
    this.motion = motion;
    this.number = number;
    if (motion === 'human') {
      this.candidates = [Bowman, Swordsman, Magician];
    }
    if (motion === 'monster') {
      this.candidates = [Vampire, Undead, Daemon];
    }
  }

  addCharacter() {
    let recruits;
    switch (this.level) {
      case 1:
        this.candidates = [Bowman, Swordsman];
        recruits = generateTeam(this.candidates, this.level, 2);
        break;
      case 2:
        recruits = generateTeam(this.candidates, (this.level - 1), 1);
        break;
      case 3:
      case 4:
        recruits = generateTeam(this.candidates, (this.level - 1), 2);
        break;
      default: break;
    }
    return recruits;
  }

  addMonster() {
    let recruits;
    switch (this.level) {
      case 1:
        recruits = generateTeam(this.candidates, this.level, 2);
        break;
      case 2:
        recruits = generateTeam(this.candidates, this.level, (this.number + 1));
        break;
      case 3:
      case 4:
        recruits = generateTeam(this.candidates, this.level, (this.number + 2));
        break;
      default: break;
    }
    return recruits;
  }

  addTeam() {
    const newTeam = [];
    if (this.motion === 'human') {
      const newChars = this.addCharacter();
      for (const i of newChars) { newTeam.push(i); }
    }
    if (this.motion === 'monster') {
      const newChara = this.addMonster();
      for (const i of newChara) { newTeam.push(i); }
    }
    return newTeam;
  }
}
