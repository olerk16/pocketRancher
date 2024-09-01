class Player {
  constructor(name, ranchName) {
    this.name = name;
    this.ranchName = ranchName;
    this.currentMonster = null;
    this.inventory = [];
    this.frozenMonsters = [];
    this.monstersOwned = [];
    this.strongestMonster = null;
    this.longestLivedMonster = null;
    this.combinesMade = 0;
    this.battlesWon = 0;
    this.battlesLost = 0;
    this.monsterDiseases = 0;
  }
  addMonster(monster) {
    this.currentMonster = monster;
  }
  removeMonster() {
    this.currentMonster = null;
  }
  freezeMonster(monster) {
    this.frozenMonsters.push(monster);
  }
}
export default Player