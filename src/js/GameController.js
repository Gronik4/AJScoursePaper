/* eslint-disable no-restricted-globals */
import { getAllowedFields, getAttacker, getMover } from './utils';
import GameState from './GameState';
import Team from './Team';
import PositionedCharacter from './PositionedCharacter';
import cursors from './cursors';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(GameState.getThem(GameState.level));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  async onCellClick(index) {
    // TODO: react to click
    if (event.target.firstChild) {
      const specified = GameState.fighters.find((item) => item.position === index);
      const type = specified.character.type;// eslint-disable-line
      if (GameState.human.includes(type)) {
        for (const item of GameState.fighters) {
          this.gamePlay.deselectCell(item.position);
        }
        this.gamePlay.selectCell(index, 'yellow');
        GameState.zeroP = { type: type, pos: index };// eslint-disable-line
      } else {
        const { pos, type } = GameState.zeroP;// eslint-disable-line
        const fieldsAttack = getAllowedFields(pos, type, 'attack');
        if (!fieldsAttack.includes(index)) {
          GamePlay.showError('Вы не можете управлять игроками компьютера');
        } else { // Ответ компа на удар игрока.
          await this.attackResult(index, 'hum');
          const answer = this.compResponce();
          if (answer) { await this.attackResult(answer.pos, answer.type); }
        }
      }
    } else {
      const { pos, type } = GameState.zeroP;
      const fieldsMove = getAllowedFields(pos, type, 'move');
      if (!fieldsMove.includes(index)) {
        GamePlay.showError('Это не допустимое действие');
      } else { // Ответ компа на перемещение игрока.
        const specified = GameState.fighters.find((item) => item.position === pos);
        this.gamePlay.deselectCell(specified.position);
        specified.position = index;
        this.gamePlay.redrawPositions(GameState.fighters);
        this.gamePlay.deselectCell(index);
        GameState.zeroP = {};
        const answer = this.compResponce();
        if (answer) { this.attackResult(answer.pos, answer.type); }
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (typeof (GameState.zeroP.pos) === 'number') {
      const { pos, type } = GameState.zeroP;
      const fieldsMove = getAllowedFields(pos, type, 'move');
      const fieldsAttack = getAllowedFields(pos, type, 'attack');
      if (fieldsMove.includes(index) && (!event.target.firstChild)) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      if (event.target.firstChild) {
        if (fieldsAttack.includes(index)
          && GameState.monster.includes(event.target.firstChild.classList[1])) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(cursors.crosshair);
        }
      }
    }
    if (event.target.firstChild) {
      if (GameState.human.includes(event.target.firstChild.classList[1])) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      const specified = GameState.fighters.find((item) => item.position === index);
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
    if (event.target.firstChild) { this.gamePlay.hideCellTooltip(index); }
    if (!event.target.classList.contains('selected-yellow')) { this.gamePlay.deselectCell(index); }
  }

  onNewGameClick() {
    GameState.level = 1;
    GameState.points = 0;
    GamePlay.showMessage(`Новая игра.\nУровень: ${GameState.level}\nНабрано баллов: ${GameState.points}`);
    GameState.teamHum.length = 0;
    GameState.teamMon.length = 0;
    this.gamePlay.container.innerHTML = '';
    this.gamePlay.drawUi(GameState.getThem(GameState.level));
    if (GameState.fighters.length) {
      for (const item of GameState.fighters) {
        this.gamePlay.deselectCell(item.position);
      }
      GameState.fighters.length = 0;
    }
    this.creatTeams(GameState.level);
  }

  async attackResult(index, kicker) {
    let teamStriker;
    let teamInjured;
    if (kicker === 'hum') {
      teamStriker = GameState.teamHum;
      teamInjured = GameState.teamMon;
    } else {
      teamStriker = GameState.teamMon;
      teamInjured = GameState.teamHum;
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
      GameState.fighters = teamStriker.concat(teamInjured);
      this.gamePlay.redrawPositions(GameState.fighters);
      GameState.zeroP = {};
    }
    if (GameState.teamHum.length === 0) {
      GamePlay.showMessage(`Конец игры.\n Увы!!! Вы проиграли!\nНабрано баллов - ${GameState.points}\n
        Чтобы начать заново, нажмите "New Game".`);
      return;
    }

    if (GameState.teamMon.length === 0) {
      GameState.level += 1;
      GameState.occupied = [];
      for (const item of GameState.teamHum) {
        GameState.occupied.push(item.position);
      }
      if (GameState.level === 5) {
        GamePlay.showMessage(`Вы победили!!! Конец игры.\nНабрано баллов - ${GameState.points}`);
        return;
      }
      this.gamePlay.container.innerHTML = '';
      this.gamePlay.drawUi(GameState.getThem(GameState.level));
      this.creatTeams(GameState.level, GameState.teamHum);
      GamePlay.showMessage(`Следующий раунд.\nУровень - ${GameState.level}\nНабрано баллов - ${GameState.points}`);
    }

    for (const item of GameState.fighters) {
      this.gamePlay.deselectCell(item.position);
    }
    this.gamePlay.redrawPositions(GameState.fighters);
  }

  creatTeams(level, survivors) {
    let numberSur = 0;
    if (survivors) {
      numberSur = survivors.length;
      for (const item of survivors) {
        GameState.points += item.character.health;
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
      GameState.teamHum.push(new PositionedCharacter(item).creatPositions());
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
      GameState.teamMon.push(player);
    }
    GameState.fighters = GameState.teamMon.concat(GameState.teamHum);
    this.gamePlay.redrawPositions(GameState.fighters);
    GameState.zeroP = {};
  }

  compResponce() {
    if (GameState.teamMon.length === 0) { return; }
    const duels = [];
    for (const el of GameState.teamMon) {
      const elFieldsAttack = getAllowedFields(el.position, el.character.type, 'attack');
      for (const mem of GameState.teamHum) {
        if (elFieldsAttack.includes(mem.position)) {
          const duelists = { batter: el, victim: mem };
          duels.push(duelists);
        }
      }
    }
    if (duels.length === 0) {
      const possibleDuels = [];
      for (const el of GameState.teamMon) {
        for (const it of GameState.teamHum) {
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
      const specified = GameState.fighters.find((item) => item.position === moveMon.old);
      specified.position = moveMon.next;
      this.gamePlay.redrawPositions(GameState.fighters);
      for (const item of GameState.fighters) {
        this.gamePlay.deselectCell(item.position);
      }
    } else if (duels.length === 1) {
      return getAttacker(duels[0]);// eslint-disable-line
    } else {
      for (const item of duels) {
        // eslint-disable-next-line max-len
        const demage = Math.max((item.batter.character.attack - item.victim.character.defence).toFixed(1), (item.batter.character.attack * 0.1.toFixed(1)));
        item.demage = demage;
      }
      duels.sort((a, b) => b.demage - a.demage);
      return getAttacker(duels[0]);// eslint-disable-line
    }
  }

  onSaveGameClick() {
    if (GameState.fighters.length === 0) { GamePlay.showMessage('Не чего сохранять!! Начните играть!'); return; }
    const saved = {
      level: GameState.level,
      points: GameState.points,
      teamHum: GameState.teamHum,
      teamMon: GameState.teamMon,
      fighters: GameState.fighters,
      occupied: GameState.occupied,
    };
    this.stateService.save(saved);
  }

  onLoadGameClick() {
    const unloaded = this.stateService.load();
    if (!unloaded) { GamePlay.showMessage('Выгружать нечего... Вы ни чего не сохраняли....'); return; }
    const {
      level, points, teamHum, teamMon, occupied,
    } = unloaded;
    GameState.level = level;
    GameState.points = points;
    GameState.teamMon = teamMon;
    GameState.teamHum = teamHum;
    GameState.fighters = GameState.teamHum.concat(GameState.teamMon);
    GameState.occupied = occupied;
    this.gamePlay.container.innerHTML = '';
    this.gamePlay.drawUi(GameState.getThem(level));
    this.gamePlay.redrawPositions(GameState.fighters);
  }
}
