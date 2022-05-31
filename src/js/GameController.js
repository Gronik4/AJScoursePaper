import { getAllowedFields, getAttacker, getMover } from './utils';
import GameState from './GameState';
import Team from './Team';
import PositionedCharacter from './PositionedCharacter';
import cursors from './cursors';
import GamePlay from './GamePlay';
import themes from './themes';

export default class GameController {
  constructor(gamePlay, stateService, GaSte) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.GS = GaSte;
    this.pc = [];
  }

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

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(GameController.getThem(this.GS.level));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  async onCellClick(index) {
    // TODO: react to click
    if (this.pc[index].firstChild) {
      const specified = this.GS.fighters.find((item) => item.position === index);
      const { type } = specified.character;
      if (this.GS.human.includes(type)) {
        for (const item of this.GS.fighters) {
          this.gamePlay.deselectCell(item.position);
        }
        this.gamePlay.selectCell(index, 'yellow');
        GameState.zeroP = { typeAt: type, pos: index };
      } else {
        const { pos, typeAt } = GameState.zeroP;
        const fieldsAttack = getAllowedFields(pos, typeAt, 'attack');
        if (!fieldsAttack.includes(index)) {
          GamePlay.showError('Вы не можете атаковать этого противника.\nОн не входит в зону атаки ни одного из Ваших игроков.');
        } else { // Ответ компа на удар игрока.
          await this.attackResult(index, 'hum');
          const answer = this.compResponce();
          if (answer) { await this.attackResult(answer.pos, answer.type); }
        }
      }
    } else {
      const { pos, typeAt } = GameState.zeroP;
      const fieldsMove = getAllowedFields(pos, typeAt, 'move');
      if (!fieldsMove.includes(index)) {
        GamePlay.showError('Это не допустимое действие');
      } else { // Ответ компа на перемещение игрока.
        const specified = this.GS.fighters.find((item) => item.position === pos);
        this.gamePlay.deselectCell(specified.position);
        specified.position = index;
        this.gamePlay.redrawPositions(this.GS.fighters);
        this.gamePlay.deselectCell(index);
        GameState.zeroP = {};
        const answer = this.compResponce();
        if (answer) { this.attackResult(answer.pos, answer.type); }
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.pc = this.gamePlay.cells;
    if (typeof (GameState.zeroP.pos) === 'number') {
      const { pos, typeAt } = GameState.zeroP;
      const fieldsMove = getAllowedFields(pos, typeAt, 'move');
      const fieldsAttack = getAllowedFields(pos, typeAt, 'attack');
      if (fieldsMove.includes(index) && (!this.pc[index].firstChild)) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      if (this.pc[index].firstChild) {
        if (fieldsAttack.includes(index)
          && this.GS.monster.includes(this.pc[index].firstChild.classList[1])) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(cursors.crosshair);
        }
      }
    }
    if (this.pc[index].firstChild) {
      if (this.GS.human.includes(this.pc[index].firstChild.classList[1])) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      const specified = this.GS.fighters.find((item) => item.position === index);
      const {
        level, attack, defence, health, type,
      } = specified.character;
      const message = `\u{1F396} ${level} \u{2694} ${attack} \u{1F6E1} ${defence} \u{2764} ${health} ${type}`;
      this.gamePlay.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.setCursor(cursors.auto);
    if (this.pc[index].firstChild) { this.gamePlay.hideCellTooltip(index); }
    if (this.pc[index]) {
      if (!this.pc[index].classList.contains('selected-yellow')) { this.gamePlay.deselectCell(index); }
    }
  }

  onNewGameClick() {
    this.GS.level = 1;
    this.GS.points = 0;
    GamePlay.showMessage(`Новая игра.\nУровень: ${this.GS.level}\nНабрано баллов: ${this.GS.points}`);
    this.GS.teamHum.length = 0;
    this.GS.teamMon.length = 0;
    this.gamePlay.container.innerHTML = '';
    this.gamePlay.drawUi(GameController.getThem(this.GS.level));
    if (this.GS.fighters.length) {
      for (const item of this.GS.fighters) {
        this.gamePlay.deselectCell(item.position);
      }
      this.GS.fighters.length = 0;
    }
    this.creatTeams(this.GS.level);
  }

  async attackResult(index, kicker) {
    let teamStriker;
    let teamInjured;
    if (kicker === 'hum') {
      teamStriker = this.GS.teamHum;
      teamInjured = this.GS.teamMon;
    } else {
      teamStriker = this.GS.teamMon;
      teamInjured = this.GS.teamHum;
    }
    const striker = teamStriker.find((item) => item.position === GameState.zeroP.pos);
    const injured = teamInjured.find((item) => item.position === index);
    const damage = Math.max(
      (striker.character.attack - injured.character.defence).toFixed(1),
      (striker.character.attack * 0.1).toFixed(1),
    );
    injured.character.health -= damage;
    await this.gamePlay.showDamage(index, damage);
    GameState.zeroP = {};

    if (injured.character.health <= 0) {
      teamInjured.splice(teamInjured.indexOf(injured), 1);
      this.GS.fighters = teamStriker.concat(teamInjured);
      this.gamePlay.redrawPositions(this.GS.fighters);
      GameState.zeroP = {};
    }
    if (this.GS.teamHum.length === 0) {
      GamePlay.showMessage(`Конец игры.\n Увы!!! Вы проиграли!\nНабрано баллов - ${GameState.points}\n
        Чтобы начать заново, нажмите "New Game".`);
      return;
    }

    if (this.GS.teamMon.length === 0) {
      this.GS.level += 1;
      GameState.occupied = [];
      for (const item of this.GS.teamHum) {
        GameState.occupied.push(item.position);
      }
      if (this.GS.level === 5) {
        GamePlay.showMessage(`Вы победили!!! Конец игры.\nНабрано баллов - ${this.GS.points}`);
        return;
      }
      this.gamePlay.container.innerHTML = '';
      this.gamePlay.drawUi(GameController.getThem(this.GS.level));
      this.creatTeams(this.GS.level, this.GS.teamHum);
      GamePlay.showMessage(`Следующий раунд.\nУровень - ${this.GS.level}\nНабрано баллов - ${this.GS.points}`);
    }

    for (const item of this.GS.fighters) {
      this.gamePlay.deselectCell(item.position);
    }
    this.gamePlay.redrawPositions(this.GS.fighters);
  }

  creatTeams(level, survivors) {
    let numberSur = 0;
    if (survivors) {
      numberSur = survivors.length;
      for (const item of survivors) {
        this.GS.points += item.character.health;
        item.character.level += 1;
        item.character.attack = Math.round(
          item.character.attack * (1 + item.character.health / 100),
        );
        item.character.defence = Math.round(
          item.character.defence * (1 + item.character.health / 100),
        );
        item.character.health = item.character.health + 80 >= 100
          ? 100 : item.character.health + 80;
      }
    }
    const team1 = new Team('human', level, numberSur).addTeam();
    for (const item of team1) {
      this.GS.teamHum.push(new PositionedCharacter(item).creatPositions());
    }
    const team2 = new Team('monster', level, numberSur).addTeam();
    for (const item of team2) {
      const player = new PositionedCharacter(item).creatPositions();
      if (player.character.level > 1) {
        player.character.attack = Math.round(
          player.character.attack * (player.character.level - 0.4),
        );
        player.character.defence = Math.round(
          player.character.defence * (player.character.level - 0.4),
        );
      }
      this.GS.teamMon.push(player);
    }
    this.GS.fighters = this.GS.teamMon.concat(this.GS.teamHum);
    this.gamePlay.redrawPositions(this.GS.fighters);
    GameState.zeroP = {};
  }

  compResponce() {
    let output;
    if (this.GS.teamMon.length === 0) { return false; }
    const duels = [];
    for (const el of this.GS.teamMon) {
      const elFieldsAttack = getAllowedFields(el.position, el.character.type, 'attack');
      for (const mem of this.GS.teamHum) {
        if (elFieldsAttack.includes(mem.position)) {
          const duelists = { batter: el, victim: mem };
          duels.push(duelists);
        }
      }
    }
    if (duels.length === 0) {
      const possibleDuels = [];
      for (const el of this.GS.teamMon) {
        for (const it of this.GS.teamHum) {
          const demage = Math.max(
            (el.character.attack - it.character.defence).toFixed(1),
            (el.character.attack * 0.1).toFixed(1),
          );
          const possibleD = { batter: el, victim: it, demage };
          possibleDuels.push(possibleD);
        }
      }
      possibleDuels.sort((a, b) => b.demage - a.demage);
      const moveMon = getMover(possibleDuels);
      const specified = this.GS.fighters.find((item) => item.position === moveMon.old);
      specified.position = moveMon.next;
      this.gamePlay.redrawPositions(this.GS.fighters);
      for (const item of this.GS.fighters) {
        this.gamePlay.deselectCell(item.position);
      }
      output = false;
    } else if (duels.length === 1) {
      output = getAttacker(duels[0]);
    } else {
      for (const item of duels) {
        const demage = Math.max((item.batter.character.attack - item.victim.character.defence)
          .toFixed(1), (item.batter.character.attack * 0.1.toFixed(1)));
        item.demage = demage;
      }
      duels.sort((a, b) => b.demage - a.demage);
      output = getAttacker(duels[0]);
    }
    return output;
  }

  onSaveGameClick() {
    if (this.GS.fighters.length === 0) { GamePlay.showMessage('Не чего сохранять!! Начните играть!'); return; }
    this.stateService.save();
  }

  onLoadGameClick() {
    const unloaded = this.stateService.load();
    if (!unloaded) { GamePlay.showMessage('Выгружать нечего... Вы ни чего не сохраняли....'); return; }
    const {
      level, points, teamHum, teamMon, occupied,
    } = unloaded;
    this.GS.level = level;
    this.GS.points = points;
    this.GS.teamMon = teamMon;
    this.GS.teamHum = teamHum;
    this.GS.fighters = this.GS.teamHum.concat(this.GS.teamMon);
    GameState.occupied = occupied;
    this.gamePlay.container.innerHTML = '';
    this.gamePlay.drawUi(GameController.getThem(level));
    this.gamePlay.redrawPositions(this.GS.fighters);
  }
}
