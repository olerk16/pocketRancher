// src/models/Player.js
class Player {
  constructor(name, ranchName, coins = 1000, inventory = [], monsters = [], ranchLocation = "grassLand") {
    this.name = name;
    this.ranchName = ranchName;
    this.coins = coins;
    this.inventory = inventory;
    this.ranchLocation = ranchLocation;
    this.monsters = []; // Initialize an empty array for monsters
  }

  addMonster(monsterType, monsterName) {
    const monster = {
      type: monsterType,
      name: monsterName,
    };
    this.monsters.push(monster);
  }

  addItemToInventory(item) {
    this.inventory.push(item);
  }

  updatePlayerName(name) {
    this.name = name;
  }

  updateRanchName(ranchName) {
    this.ranchName = ranchName;
  }

  updateRanchLocation(location) {
    this.ranchLocation = location;
  }

  // Add more methods as needed to handle player actions, inventory management, etc.
}

export default Player;
