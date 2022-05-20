import GameState from './GameState';

export function calcTileType(index, boardSize) {
  // TODO: write logic here
  if (index === 0) { return 'top-left'; }
  if (index > 0 && index < (boardSize - 1)) { return 'top'; }
  if (index === (boardSize - 1)) { return 'top-right'; }
  if (index === boardSize * (boardSize - 1)) { return 'bottom-left'; }
  if (index === (boardSize ** 2 - 1)) { return 'bottom-right'; }
  if (index % boardSize === 0) { return 'left'; }
  if ((index + 1) % boardSize === 0) { return 'right'; }
  if (index > boardSize * (boardSize - 1) && index < (boardSize ** 2 - 1)) { return 'bottom'; }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

function calcFieldsAttack(index, size, distance) {
  const resalt = [];
  const X = index % size;
  const Y = (index - X) / size;
  for (let i = -distance; i <= distance; i += 1) {
    const newY = Y + i;
    if (newY >= 0 && newY < size) {
      for (let j = -distance; j <= distance; j += 1) {
        const newX = X + j;
        if (newX >= 0 && newX < size) {
          resalt.push(newY * size + newX);
        }
      }
    }
  }
  resalt.splice((resalt.indexOf(index)), 1);
  return resalt;
}

function calkFieldsMove(index, size, distance) {
  const resalt = [];
  const X = index % size;
  const Y = (index - X) / size;
  for (let i = -distance; i <= distance; i += 1) {
    const newY = Y + i;
    if (newY >= 0 && newY < size) {
      let newX = 0;
      if (i !== 0) {
        for (let j = 1; j > -2; j -= 1) {
          newX = X + i * j;
          if (newX >= 0 && newX < size) {
            resalt.push(newY * size + newX);
          }
        }
      } else {
        for (let y = -distance; y <= distance; y += 1) {
          newX = X + y;
          if (newX >= 0 && newX < size) {
            resalt.push(newY * size + newX);
          }
        }
      }
    }
  }
  resalt.splice((resalt.indexOf(index)), 1);
  return resalt;
}
export function getAllowedFields(index, type, flag) {
  let positions = [];
  let distance = '';
  const size = 8;
  switch (type) {
    case 'swordsman':
    case 'undead':
      if (flag === 'attack') {
        distance = 1;
        positions = calcFieldsAttack(index, size, distance);
      }
      if (flag === 'move') {
        distance = 4;
        positions = calkFieldsMove(index, size, distance);
      }
      break;
    case 'bowman':
    case 'vampire':
      distance = 2;
      if (flag === 'move') { positions = calkFieldsMove(index, size, distance); }
      if (flag === 'attack') { positions = calcFieldsAttack(index, size, distance); }
      break;
    case 'magician':
    case 'daemon':
      if (flag === 'attack') {
        distance = 4;
        positions = calcFieldsAttack(index, size, distance);
      }
      if (flag === 'move') {
        distance = 1;
        positions = calkFieldsMove(index, size, distance);
      }
      break;
    default:
      break;
  }
  return positions;
}

export function getAttacker(object) {
  let resalt = {};
  const { batter, victim } = object;
  const { type } = batter.character.type;
  const indexBatter = batter.position;
  const index = victim.position;
  GameState.zeroP = { typeAt: type, pos: indexBatter };// Атакующий
  resalt = { type: 'mon', pos: index };// Жертва
  return resalt;
}

export function getMover(object) {
  const posToAttack = { pos: [], attacker: 0 };// Позиции с которых можно атаковать.
  let resalt = {};
  for (let el = 0; el < object.length;) {
    const index = object[el].batter.position;// Индекс(позиция) атакующего.
    const place = object[el].victim.position;// Индекс(позиция) атакуемого(жертвы)
    const { type } = object[el].batter.character.type;
    const fieldsMove = getAllowedFields(index, type, 'move');
    for (const it of fieldsMove) {
      const fieldsAttack = getAllowedFields(it, type, 'attack');
      if (fieldsAttack.includes(place)) {
        posToAttack.pos.push(it);
        posToAttack.attacker = index;
      }
    }
    if (posToAttack.pos.length === 0) { el += 1; } else { break; }
  }
  if (posToAttack.attacker === 0) {
    const index = object[0].batter.position;// Индекс(позиция) атакующего.
    const type1 = object[0].batter.character.type;
    const fieldsMove = getAllowedFields(index, type1, 'move');
    resalt = { old: index, next: fieldsMove[0] };
  } else {
    resalt = { old: posToAttack.attacker, next: posToAttack.pos[0] };
  }
  return resalt;
}
