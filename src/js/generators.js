/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const RandType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  const randLev = Math.floor(Math.random() * maxLevel + 1);
  yield new RandType(randLev);
}

export default function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    const newType = characterGenerator(allowedTypes, maxLevel);
    team.push(newType.next().value);
  }
  return team;
}
