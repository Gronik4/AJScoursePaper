/**
 * @param GameState.level - Уровень игры, игроков и т.д.
 * @param GameState.points - Каличество баллов игрока.
 * @param GameState.zeroP - Объект. Точка отсчета для рассчетов разрешенных
 * полей для перемещения или атаки. Причем, type: - тип  pos: - позиция активного игрока.
 * @param GameState.teamMon - Массив объектов. Команда компьютера (монстры).
 * @param GameState.teamHum - Массив объектов. Команда игрока (люди).
 * @param GameState.fighters - Массив объектов. Все игроки.
 * @param GameState.occupied - Занятые игроками поля.
 */
import themes from './themes';

export default class GameState {
  static level = 1;

  static points = 0;

  static monster = ['undead', 'vampire', 'daemon'];

  static human = ['magician', 'bowman', 'swordsman'];

  static zeroP = {};

  static teamMon = [];

  static teamHum = [];

  static fighters = [];

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
