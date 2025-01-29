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
    
    // Ensure currentStats are properly initialized
    this.currentStats = data.currentStats || { ...this.initialStats };
    
    // Set individual stat properties from currentStats
    this.hunger = this.currentStats.hunger;
    this.happiness = this.currentStats.happiness;
    this.energy = this.currentStats.energy;
    this.hygiene = this.currentStats.hygiene;
    this.lifeSpan = this.currentStats.lifeSpan;

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
   * Gets the lifespan as a percentage string
   */
  getLifeSpanPercentage() {
    return `${Math.round(this.lifeSpan)}%`;
  }

  /**
   * Initializes the monster's sprite and sets initial stats.
   */
  initializeMonster() {
    // Only initialize stats if they haven't been set
    if (!this.hunger && !this.happiness && !this.energy && !this.hygiene && !this.lifeSpan) {
      this.hunger = this.currentStats.hunger;
      this.happiness = this.currentStats.happiness;
      this.energy = this.currentStats.energy;
      this.hygiene = this.currentStats.hygiene;
      this.lifeSpan = this.currentStats.lifeSpan;
    }
    
    this.spriteKey = this.imageURL;
    this.sprite = this.scene.add.image(400, 300, this.spriteKey);

    console.log(`Monster ${this.name} initialized with stats:`, {
      hunger: this.hunger,
      happiness: this.happiness,
      energy: this.energy,
      hygiene: this.hygiene,
      lifeSpan: this.lifeSpan
    });
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
    
    // Store current stats before freezing
    this.currentStats = {
      hunger: this.hunger,
      happiness: this.happiness,
      energy: this.energy,
      hygiene: this.hygiene,
      lifeSpan: this.lifeSpan
    };
    
    console.log(`${this.name} is now frozen with stats:`, this.currentStats);
    this.clearTimers(); // Stop timers when frozen
  }

  /**
   * Unfreezes the monster, restarting timers and showing the sprite.
   */
  unfreeze() {
    this.isFrozen = false;
    
    // Restore stats from frozen state
    if (this.currentStats) {
      this.hunger = this.currentStats.hunger;
      this.happiness = this.currentStats.happiness;
      this.energy = this.currentStats.energy;
      this.hygiene = this.currentStats.hygiene;
      this.lifeSpan = this.currentStats.lifeSpan;
    }
    
    // Make sure we have a valid scene before creating sprite
    if (this.scene && this.scene.add) {
      // Create new sprite if it doesn't exist
      if (!this.sprite) {
        this.sprite = this.scene.add.image(400, 300, this.imageURL);
      }
      this.sprite.setVisible(true);
    }
    
    console.log(`${this.name} is now unfrozen with stats:`, this.currentStats);
    
    // Only setup timers after sprite is created
    this.setupTimers();
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
    if (this.isFrozen || this.lifeSpan <= 0) return;

    this.lifeSpan = Math.max(0, this.lifeSpan - 0.1);
    
    try {
        if (this.displayStatsComponent) {
            this.updateDisplay();
        }

        if (this.lifeSpan <= 0) {
            this.handleDeath();
        }
    } catch (error) {
        console.warn('Error in decreaseLifeSpan:', error);
    }
  }

  /**
   * Handles the monster's death.
   */
  handleDeath() {
    console.log(`${this.name} has died.`);

    // Add monster to deceased list if we have a player reference
    if (this.scene.player) {
        this.scene.player.addDeceasedMonster(this);
    }

    // Remove the monster's sprite
    if (this.sprite) {
        this.sprite.destroy();
        this.sprite = null;
    }

    // Clear timers
    this.clearTimers();

    // Remove from player's active monsters if applicable
    if (this.scene.player) {
        const index = this.scene.player.monsters.indexOf(this);
        if (index > -1) {
            this.scene.player.monsters.splice(index, 1);
        }
        if (this.scene.player.activeMonster === this) {
            this.scene.player.activeMonster = null;
        }
    }

    // Transition to cemetery scene
    this.scene.scene.start('CemeteryScene', { 
        player: this.scene.player.toJSON(),
        deceasedMonster: this.toJSON()
    });
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
    if (!this.displayStatsComponent || !this.scene) return;
    
    try {
        this.displayStatsComponent.updateDisplay();
    } catch (error) {
        console.warn('Error updating monster display:', error);
    }
  }

  /**
   * Associates a DisplayStatsComponent with the monster.
   * @param {DisplayStatsComponent} component - The component to associate.
   */
  setDisplayStatsComponent(component) {
    if (!component) return;
    this.displayStatsComponent = component;
    this.updateDisplay(); // Initial update
  }

  /**
   * Feeds the monster with a given item.
   * @param {Object} item - The food item.
   * @param {Array} inventory - The player's inventory.
   * @param {Phaser.Scene} gameScene - The game scene.
   */
  feed(item, inventory, gameScene) {
    if (this.mood === "dead" || !Array.isArray(inventory)) return;

    console.log("Feeding the monster with:", item);

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
    if (!data) return null;

    // Create initial data object with default values
    const monsterData = {
        _id: data._id || `temp_${Date.now()}`,
        name: data.name || 'Unknown Monster',
        type: data.type || 'normal',
        favoriteFood: data.favoriteFood || 'Magic Berries',
        imageURL: data.imageURL,
        initialStats: data.initialStats || {
            hunger: 80,
            happiness: 70,
            energy: 90,
            hygiene: 60,
            lifeSpan: 100
        },
        currentStats: data.currentStats || data.initialStats || {
            hunger: 80,
            happiness: 70,
            energy: 90,
            hygiene: 60,
            lifeSpan: 100
        },
        isFrozen: data.isFrozen || false
    };

    // Create monster instance with the prepared data
    const monster = new Monster(scene, monsterData);

    // Handle image URL - ensure it has full server path
    if (monster.imageURL && !monster.imageURL.startsWith('http')) {
        monster.imageURL = `http://localhost:5000/${monster.imageURL}`;
    }

    // Create sprite if scene is available
    if (scene && monster.imageURL) {
        const textureKey = `monster_${monster._id}`;
        
        // Only load the texture if it doesn't exist or if we're forcing a reload
        if (!scene.textures.exists(textureKey)) {
            // Load the texture
            scene.load.image(textureKey, monster.imageURL);
            scene.load.once('complete', () => {
                monster.createSprite(textureKey);
            });
            scene.load.start();
        } else {
            // If texture already exists, just create the sprite
            monster.createSprite(textureKey);
        }
    }

    return monster;
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
      currentStats: {
        hunger: this.hunger,
        happiness: this.happiness,
        energy: this.energy,
        hygiene: this.hygiene,
        lifeSpan: this.lifeSpan
      },
      isFrozen: this.isFrozen
    };
  }

  cleanup() {
    // Clear all timers
    this.clearTimers();
    
    // Save current stats
    this.currentStats = {
      hunger: this.hunger,
      happiness: this.happiness,
      energy: this.energy,
      hygiene: this.hygiene,
      lifeSpan: this.lifeSpan
    };
    
    // Cleanup sprite if it exists
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
    
    // Clear display component
    this.displayStatsComponent = null;
  }

  // Update createSprite method to handle sprite creation more robustly
  createSprite(textureKey) {
    // Destroy existing sprite if it exists
    if (this.sprite) {
        this.sprite.destroy();
    }

    // Only create sprite if the texture exists
    if (this.scene.textures.exists(textureKey)) {
        this.sprite = this.scene.add.image(400, 300, textureKey);
        this.sprite.setScale(0.4);
    } else {
        console.warn(`Texture ${textureKey} not found for monster ${this.name}`);
    }

    return this.sprite;
  }
}

export default Monster;
