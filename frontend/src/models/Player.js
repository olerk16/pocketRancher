import Monster from './Monster.js'; 

export default class Player {
  constructor(scene, data = {}) {
    this.scene = scene;

    // Ensure data exists and has required properties
    if (!data) {
      console.error('No player data provided to constructor');
      data = {};
    }

    this._id = data._id || null;
    this.name = data.name || 'Default Player';
    this.ranchName = data.ranchName || 'Default Ranch';
    this.coins = data.coins || 1000;
    this.inventory = data.inventory || [];
    this.ranchLocation = data.ranchLocation || 'grassLand';
    this.deceasedMonsters = data.deceasedMonsters || [];

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
    if (!data) {
      console.error('No data provided to Player.fromData');
      return new Player(scene);
    }

    console.log('Creating player from data:', data);
    const player = new Player(scene, data);
    
    // Load monsters
    if (data.monsters) {
      player.monsters = data.monsters.map(monsterData => 
        Monster.fromData(scene, monsterData)
      ).filter(monster => monster !== null);
    }

    // Load deceased monsters
    if (data.deceasedMonsters) {
      player.deceasedMonsters = data.deceasedMonsters;
    }

    // Set active monster if it exists
    if (data.activeMonster) {
      player.activeMonster = Monster.fromData(scene, data.activeMonster);
    }

    return player;
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
      deceasedMonsters: this.deceasedMonsters
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

  handleMonsterDeath(monster) {
    this.monsters = this.monsters.filter(m => m._id !== monster._id);
    
    if (this.activeMonster && this.activeMonster._id === monster._id) {
      this.activeMonster = null;
    }

    this.deceasedMonsters.push({
      name: monster.name,
      type: monster.type,
      deathDate: new Date().toLocaleDateString(),
      causeOfDeath: monster.lifeSpan <= 0 ? "Old Age" : "Unknown",
      imageURL: monster.imageURL
    });
  }

  hasOfferings() {
    return this.inventory.some(item => item.type === 'offering');
  }

  getOfferings() {
    return this.inventory.filter(item => item.type === 'offering');
  }

  // Helper method to check if an item is an offering
  isOffering(item) {
    return item.type === 'offering';
  }

  // When removing an offering from inventory
  removeOffering(offering) {
    const index = this.inventory.findIndex(item => 
      item.type === 'offering' && item.name === offering.name
    );
    if (index !== -1) {
      this.inventory.splice(index, 1);
    }
  }

  // Add monster to deceased list
  addDeceasedMonster(monster) {
    const deceasedMonster = {
      name: monster.name,
      type: monster.type,
      imageURL: monster.imageURL,
      deathDate: new Date().toISOString(),
      stats: monster.currentStats
    };
    this.deceasedMonsters.push(deceasedMonster);
  }
}
