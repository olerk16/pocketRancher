// src/models/Player.js

import Monster from './Monster.js'; // Import Monster class
import Monsters from './Monsters.js'; // Import Monsters object for reference
class Player {
  constructor(name, ranchName, coins = 1000, inventory = [], monsters = [], ranchLocation = "grassLand") {
    this.name = name;
    this.ranchName = ranchName;
    this.coins = coins;
    this.inventory = inventory;
    this.ranchLocation = ranchLocation;
    this.monsters = []; // Array to hold player's monsters
    this.activeMonster = null; // Reference to the current active monster
    this.scene = null; // Initialize scene context as null
  }

  // Method to set the scene context
  setScene(scene) {
    this.scene = scene;
  }

  addMonster(monsterType, monsterName) {
    // Ensure scene context is available
    if (!this.scene) {
      console.error('Scene is not set in Player.');
      return;
    }
    // Get monster template from Monsters object
    const monsterData = Monsters[monsterType];
    if (!monsterData) {
      console.error(`Monster type "${monsterType}" is not defined in Monsters.`);
      return;
    }

    // Create a new Monster instance
    const newMonster = new Monster(this.scene, 400, 300, monsterType, monsterName);

    // Add the monster to the player's monsters array
    this.monsters.push(newMonster);

    // Set the new monster as active if no other active monster is set
    if (!this.activeMonster) {
      this.activeMonster = newMonster;
    }
  }

  freezeMonster(monster) {
    if (monster) {
      monster.freeze(); // Call the freeze method on the monster
      if (this.activeMonster === monster) {
        this.activeMonster = null; // Clear active monster if the active monster is being frozen
      }
    }
  }

  unfreezeMonster(monster) {
    if (monster) {
      monster.unfreeze(); // Call the unfreeze method on the monster
      if (!this.activeMonster) {
        this.activeMonster = monster; // Set active monster if none is active
      }
    }
  }

  getFrozenMonsters() {
    // Return an array of frozen monsters
    return this.monsters.filter(monster => monster.isFrozen);
  }

  setActiveMonster(monster) {
    // Set the specified monster as the active monster
    if (monster && !monster.isFrozen) {
      this.activeMonster = monster;
    }
  }

  getActiveMonster() {
    return this.activeMonster;
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

  updateCoins(amount) {
    // Update the player's coins by a certain amount
    this.coins += amount;
  }

  // Add more methods as needed to handle player actions, inventory management, etc.
}

export default Player;
