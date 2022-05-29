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

  preparingSave() {
    const saved = {
      level: this.level,
      points: this.points,
      teamHum: this.teamHum,
      teamMon: this.teamMon,
      fighters: this.fighters,
      occupied: this.occupied,
    };
    return saved;
  }
}
