import Diseases from './Diseases.js';
import Phaser from 'phaser';

class Monster {
  constructor(scene, data) {
    if (!scene || !scene.add) {
      console.error('Invalid scene context passed to Monster constructor.');
      return;
    }
    this.scene = scene;

    // Initialize properties from data
    this._id = data._id || null;
    this.name = data.name;
    this.type = data.type;
    this.favoriteFood = data.favoriteFood;
    this.imageURL = data.imageURL;
    this.initialStats = data.initialStats || {};
    this.currentStats = data.currentStats || { ...this.initialStats };
    this.isFrozen = data.isFrozen || false;

    // Movement properties
    this.movementSpeed = 50; // Pixels per second
    this.direction = { x: 1, y: 1 }; // Start moving diagonally

    // Needs decay and thresholds
    this.DECAY_RATE = 5; // Rate at which needs decay
    this.THRESHOLDS = {
      hunger: 20,
      happiness: 30,
      energy: 30,
      hygiene: 30,
    };

    // Status properties
    this.mood = 'neutral';
    this.statusEffects = [];
    this.diseases = [];

    // Display properties
    this.sprite = null;
    this.displayStatsComponent = null;

    // Initialize the monster (e.g., create the sprite)
    this.initializeMonster();

    // Start timers if not frozen
    if (!this.isFrozen) {
      this.setupTimers();
    }
  }

  /**
   * Initializes the monster's sprite and sets initial stats.
   */
  initializeMonster() {
    // Set initial stats
    this.hunger = this.currentStats.hunger;
    this.happiness = this.currentStats.happiness;
    this.energy = this.currentStats.energy;
    this.hygiene = this.currentStats.hygiene;
    this.lifeSpan = this.currentStats.lifeSpan;
    this.spriteKey = this.imageURL; // Use the image URL as the sprite key

    // Add the sprite to the scene
    this.sprite = this.scene.add.image(400, 300, this.spriteKey);

    console.log(`Monster ${this.name} initialized with existing data.`);
  }

  /**
   * Sets up timers for needs decay, movement, and lifespan decrease.
   */
  setupTimers() {
    // Decay needs over time
    this.decayNeedsEvent = this.scene.time.addEvent({
      delay: 5000, // Every 5 seconds
      callback: this.decayNeeds,
      callbackScope: this,
      loop: true,
    });

    // Change movement randomly
    this.moveRandomlyEvent = this.scene.time.addEvent({
      delay: 2000, // Every 2 seconds
      callback: this.moveRandomly,
      callbackScope: this,
      loop: true,
    });

    // Decrease lifespan
    this.decreaseLifeSpanEvent = this.scene.time.addEvent({
      delay: 1000, // Every 1 second
      callback: this.decreaseLifeSpan,
      callbackScope: this,
      loop: true,
    });
  }

  /**
   * Clears all timers to stop scheduled events.
   */
  clearTimers() {
    if (this.decayNeedsEvent) this.decayNeedsEvent.remove(false);
    if (this.moveRandomlyEvent) this.moveRandomlyEvent.remove(false);
    if (this.decreaseLifeSpanEvent) this.decreaseLifeSpanEvent.remove(false);
  }

  /**
   * Freezes the monster, stopping timers and hiding the sprite.
   */
  freeze() {
    this.isFrozen = true;
    if (this.sprite) this.sprite.setVisible(false); // Hide sprite when frozen
    console.log(`${this.name} is now frozen.`);
    this.clearTimers(); // Stop timers when frozen
  }

  /**
   * Unfreezes the monster, restarting timers and showing the sprite.
   */
  unfreeze() {
    this.isFrozen = false;
    if (this.sprite) this.sprite.setVisible(true); // Show sprite when unfrozen
    console.log(`${this.name} is now unfrozen.`);
    this.setupTimers(); // Restart timers
  }

  /**
   * Decays the monster's needs over time.
   */
  decayNeeds() {
    if (this.isFrozen) return;

    this.updateStat('hunger', -this.DECAY_RATE);
    this.updateStat('energy', -this.DECAY_RATE);
    this.updateStat('hygiene', -this.DECAY_RATE);
    this.updateStat('happiness', -this.DECAY_RATE);

    this.updateMood();
    this.updateDisplay();
  }

  /**
   * Decreases the monster's lifespan over time.
   */
  decreaseLifeSpan() {
    if (this.isFrozen) return;

    const decayAmount = (this.hunger > 80 || this.energy < 20) ? 0.2 : 0.1;
    this.lifeSpan = Math.max(0, this.lifeSpan - decayAmount);

    if (this.lifeSpan <= 0) {
      this.handleDeath();
    } else {
      this.updateDisplay();
    }
  }

  /**
   * Handles the monster's death.
   */
  handleDeath() {
    console.log(`${this.name} has died.`);

    // Save the monster's name to the deceased list
    if (!this.scene.deceasedMonsters) {
      this.scene.deceasedMonsters = [];
    }
    this.scene.deceasedMonsters.push(this.name);

    // Remove the monster's sprite
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }

    // Clear timers
    this.clearTimers();

    // Notify the scene to handle game over or death
    if (this.scene.onMonsterDeath) {
      this.scene.onMonsterDeath(this);
    }
  }

  /**
   * Applies a random disease to the monster.
   */
  applyRandomDisease() {
    if (this.isFrozen) return;

    const diseaseNames = Object.keys(Diseases);
    const randomDiseaseName = Phaser.Utils.Array.GetRandom(diseaseNames);
    this.applyDisease(randomDiseaseName);
  }

  /**
   * Applies a specific disease to the monster.
   * @param {string} diseaseName - The name of the disease.
   */
  applyDisease(diseaseName) {
    const disease = Diseases[diseaseName];
    if (disease) {
      this.diseases.push(disease);
      console.log(`${this.name} has contracted ${disease.name}!`);

      // Apply disease effects
      Object.keys(disease.effects).forEach((stat) => {
        this.updateStat(stat, disease.effects[stat]);
      });

      this.updateDisplay();

      // Schedule curing the disease after its duration
      this.scene.time.delayedCall(disease.duration, () => this.cureDisease(diseaseName), [], this);
    } else {
      console.error(`Disease "${diseaseName}" not found.`);
    }
  }

  /**
   * Cures the monster of a specific disease.
   * @param {string} diseaseName - The name of the disease to cure.
   */
  cureDisease(diseaseName) {
    this.diseases = this.diseases.filter(disease => disease.name !== diseaseName);
    console.log(`${this.name} has been cured of ${diseaseName}!`);
    this.updateDisplay();
  }

  /**
   * Updates the monster's mood based on current stats.
   */
  updateMood() {
    if (this.hunger < this.THRESHOLDS.hunger || this.energy < this.THRESHOLDS.energy) {
      this.mood = 'hungry';
    } else if (this.happiness < this.THRESHOLDS.happiness) {
      this.mood = 'sad';
    } else if (this.energy < this.THRESHOLDS.energy) {
      this.mood = 'tired';
    } else if (this.hygiene < this.THRESHOLDS.hygiene) {
      this.mood = 'dirty';
    } else {
      this.mood = 'happy';
    }

    console.log(`Monster mood: ${this.mood}`);
  }

  /**
   * Updates a specific stat of the monster.
   * @param {string} stat - The stat to update.
   * @param {number} value - The amount to adjust the stat by.
   */
  updateStat(stat, value) {
    this[stat] = Math.min(100, Math.max(0, (this[stat] || 0) + value)); // Clamp between 0 and 100
  }

  /**
   * Updates the display components associated with the monster.
   */
  updateDisplay() {
    if (this.displayStatsComponent) {
      this.displayStatsComponent.updateDisplay(); // Ensure the component reflects the current state
    }
  }

  /**
   * Associates a DisplayStatsComponent with the monster.
   * @param {DisplayStatsComponent} displayStatsComponent - The component to associate.
   */
  setDisplayStatsComponent(displayStatsComponent) {
    this.displayStatsComponent = displayStatsComponent;
    this.updateDisplay();
  }

  /**
   * Feeds the monster with a given item.
   * @param {Object} item - The food item.
   * @param {Array} inventory - The player's inventory.
   * @param {Phaser.Scene} gameScene - The game scene.
   */
  feed(item, inventory, gameScene) {
    if (this.mood === "dead") return;

    console.log("Feeding the monster");

    let hungerEffect = item.hungerAmount;
    let happinessEffect = item.happinessAmount;

    if (item.name === this.favoriteFood) {
      happinessEffect += 5;
      hungerEffect += 5;
    }

    this.updateStat("hunger", hungerEffect);
    this.updateStat("happiness", happinessEffect);
    this.updateMood();
    this.updateDisplay();

    // Remove the item from the inventory
    const index = inventory.indexOf(item);
    if (index > -1) {
      inventory.splice(index, 1);
    }

    // Update the inventory display
    if (gameScene && gameScene.resetInventorySlots) {
      gameScene.resetInventorySlots();
    }
  }

  /**
   * Plays with the monster, increasing happiness.
   */
  play() {
    if (this.mood === 'tired' || this.mood === 'dead') return;
    this.updateStat('happiness', 15);
    this.updateStat('energy', -10);
    this.updateMood();
    this.updateDisplay();
  }

  /**
   * Puts the monster to sleep, restoring energy.
   */
  sleep() {
    if (this.mood === 'dead') return;
    this.updateStat('energy', 100 - this.energy); // Fully restore energy
    this.updateStat('happiness', 10);
    this.updateMood();
    this.updateDisplay();
  }

  /**
   * Adjusts happiness based on the ranch location.
   * @param {string} ranchLocation - The location of the ranch.
   */
  adjustHappinessByLocation(ranchLocation) {
    console.log("Adjusting happiness based on location");
    const locationEffects = {
      grassLand: 10,
      desert: -5,
      mountain: 5,
    };

    const happinessEffect = locationEffects[ranchLocation] || 0;
    this.updateStat('happiness', happinessEffect);
    this.updateDisplay();
  }

  /**
   * Changes the monster's movement direction randomly.
   */
  moveRandomly() {
    this.direction.x = Phaser.Math.Between(-1, 1) || 1;
    this.direction.y = Phaser.Math.Between(-1, 1) || 1;
  }

  /**
   * Updates the monster's position based on movement direction and speed.
   * @param {number} delta - The time since the last update.
   */
  updatePosition(delta) {
    if (this.isFrozen || !this.sprite) return;

    // Move sprite based on direction and speed
    this.sprite.x += this.direction.x * this.movementSpeed * (delta / 1000);
    this.sprite.y += this.direction.y * this.movementSpeed * (delta / 1000);

    // Check bounds and reverse direction if needed
    if (this.sprite.x <= 0 || this.sprite.x >= this.scene.sys.canvas.width) {
      this.direction.x *= -1;
    }

    if (this.sprite.y <= 0 || this.sprite.y >= this.scene.sys.canvas.height) {
      this.direction.y *= -1;
    }
  }

  /**
   * Creates a Monster instance from plain data.
   * @param {Phaser.Scene} scene - The scene context.
   * @param {Object} data - The monster data.
   * @returns {Monster} - A new Monster instance.
   */
  static fromData(scene, data) {
    return new Monster(scene, data);
  }

  /**
   * Converts the Monster instance into a JSON-serializable object.
   * @returns {Object} - JSON representation of the Monster.
   */
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      type: this.type,
      favoriteFood: this.favoriteFood,
      imageURL: this.imageURL,
      initialStats: this.initialStats,
      currentStats: this.currentStats,
      isFrozen: this.isFrozen,
      // Add other properties as needed
    };
  }
}

export default Monster;
