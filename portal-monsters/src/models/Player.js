import Monster from './Monster.js'; 

class Player {
  constructor(scene, data) {
    this.scene = scene;

    this._id = data._id || null;
    this.name = data.name;
    this.ranchName = data.ranchName;
    this.coins = data.coins || 1000;
    this.inventory = data.inventory || [];
    this.ranchLocation = data.ranchLocation || 'grassLand';

    // Initialize monsters from data, passing the scene
    this.monsters = (data.monsters || []).map(monsterData => Monster.fromData(scene, monsterData));
    this.frozenMonsters = (data.frozenMonsters || []).map(monsterData => Monster.fromData(scene, monsterData));
    this.activeMonster = data.activeMonster ? Monster.fromData(scene, data.activeMonster) : null;
  }

  /**
   * Creates a new Player instance from plain data.
   * @param {Object} data - The plain data object.
   * @returns {Player} - A new Player instance.
   */
  static fromData(scene, data) {
    return new Player(scene, data);
  }

  /**
   * Converts the Player instance into a JSON-serializable object.
   * @returns {Object} - JSON representation of the Player.
   */
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      ranchName: this.ranchName,
      coins: this.coins,
      inventory: this.inventory,
      ranchLocation: this.ranchLocation,
      monsters: this.monsters.map(monster => monster.toJSON()),
      frozenMonsters: this.frozenMonsters.map(monster => monster.toJSON()),
      activeMonster: this.activeMonster ? this.activeMonster.toJSON() : null,
    };
  }

  /**
   * Updates the player's coin balance.
   * @param {number} amount - The amount to add or subtract from the player's coins.
   */
  updateCoins(amount) {
    this.coins += amount;
    if (this.coins < 0) {
      this.coins = 0;
    }
    console.log(`Player coins updated. New balance: ${this.coins}`);
  }

  /**
   * Adds an item to the player's inventory.
   * @param {Object} item - The item to add.
   */
  addItemToInventory(item) {
    this.inventory.push(item);
  }

  /**
   * Updates the player's name.
   * @param {string} name - The new name.
   */
  updatePlayerName(name) {
    this.name = name;
  }

  /**
   * Updates the ranch's name.
   * @param {string} ranchName - The new ranch name.
   */
  updateRanchName(ranchName) {
    this.ranchName = ranchName;
  }

  /**
   * Updates the ranch's location.
   * @param {string} location - The new location.
   */
  updateRanchLocation(location) {
    this.ranchLocation = location;
  }

  /**
   * Adds a monster to the player's active monsters.
   * @param {Monster} monster - The Monster instance to add.
   */
  addMonster(monsterData) {
    const newMonster = Monster.fromData(this.scene, monsterData);
    this.monsters.push(newMonster);
    if (!this.activeMonster) {
      this.activeMonster = newMonster;
    }
  }

  /**
   * Freezes a monster, moving it to the frozen monsters list.
   * @param {Monster} monster - The Monster instance to freeze.
   */
  freezeMonster(monster) {
    if (monster) {
      monster.freeze();
      this.monsters = this.monsters.filter(m => m !== monster);
      this.frozenMonsters.push(monster);
      if (this.activeMonster === monster) {
        this.activeMonster = null;
      }
    }
  }

  /**
   * Unfreezes a monster, moving it back to the active monsters list.
   * @param {Monster} monster - The Monster instance to unfreeze.
   */
  unfreezeMonster(monster) {
    if (monster) {
      monster.unfreeze();
      this.frozenMonsters = this.frozenMonsters.filter(m => m !== monster);
      this.monsters.push(monster);
      if (!this.activeMonster) {
        this.activeMonster = monster;
      }
    }
  }

  /**
   * Sets the active monster.
   * @param {Monster} monster - The Monster instance to set as active.
   */
  setActiveMonster(monster) {
    if (monster && !monster.isFrozen && this.monsters.includes(monster)) {
      this.activeMonster = monster;
    }
  }

  /**
   * Retrieves the active monster.
   * @returns {Monster|null} - The active Monster instance or null.
   */
  getActiveMonster() {
    return this.activeMonster;
  }

  /**
   * Retrieves the list of frozen monsters.
   * @returns {Monster[]} - Array of frozen Monster instances.
   */
  getFrozenMonsters() {
    return this.frozenMonsters;
  }

  /**
   * Retrieves the list of active monsters.
   * @returns {Monster[]} - Array of active Monster instances.
   */
  getMonsters() {
    return this.monsters;
  }
}

export default Player;
