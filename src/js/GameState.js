/**
 * @param GameState.level - Уровень игры, игроков и т.д.
 * @param GameState.points - Каличество баллов игрока.
 * @param GameState.zeroP - Объект.
 * Точка отсчета для рассчетов разрешенных полей для перемещения или атаки.
 * Причем, typeAt: - тип от type of attacker, pos: - позиция активного игрока.
 * @param GameState.teamMon - Массив объектов. Команда компьютера (монстры).
 * @param GameState.teamHum - Массив объектов. Команда игрока (люди).
 * @param GameState.fighters - Массив объектов. Все игроки.
 * @param GameState.occupied - Занятые игроками поля.
 */
import themes from './themes';

export default class GameState {
  constructor() {
    this.level = 1;
    this.points = 0;
    this.monster = ['undead', 'vampire', 'daemon'];
    this.human = ['magician', 'bowman', 'swordsman'];
    this.teamMon = [];
    this.teamHum = [];
    this.fighters = [];
  }

  static zeroP = {};

  static occupied = [];

  static getThem(level) {
    switch (level) {
      case 1:
        return themes.prairie;
      case 2:
        return themes.desert;
      case 3:
        return themes.arctic;
      case 4:
        return themes.mountain;
      default:
        return themes.prairie;
    }
  }
}
