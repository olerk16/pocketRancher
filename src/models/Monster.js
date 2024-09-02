import Diseases from './Diseases.js';
import Monsters from './Monsters.js'; // Import the new Monsters object

// src/models/Monster.js

class Monster {
    constructor(scene, x, y, type, name = 'unnamed monster') {
      if (!scene || !scene.add) {
        console.error('Invalid scene context passed to Monster constructor.');
        return;
      }

      if (!Monsters[type]) {
        console.error(`Monster type "${type}" is not defined in Monsters.`);
        return;
      }

      const monsterConfig = Monsters[type]; // Get the specific monster configuration

      this.scene = scene;
      this.sprite = scene.add.image(x, y, monsterConfig.spriteKey); // Use the sprite key from Monsters object
      this.name = name
      this.type = type
  
      // Initialize monster properties
      const { hunger, happiness, energy, hygiene, lifeSpan } = monsterConfig.initialStats;

      this.hunger = hunger;
      this.happiness = happiness;
      this.energy = energy;
      this.hygiene = hygiene;
      this.lifeSpan = lifeSpan;

      // New property to track if the monster is frozen
      this.isFrozen = false;

      // Store the current movement direction and speed
      this.movementSpeed = 50; // Pixels per second
      this.direction = { x: 1, y: 1 }; // Start moving diagonally

      // Initialize the DisplayStatsComponent reference to null
      this.displayStatsComponent = null;
  
      // Define thresholds and decay rates
      this.DECAY_RATE = 5; // Rate at which needs decay
      this.THRESHOLDS = {
        hunger: 20,
        happiness: 30,
        energy: 30,
        hygiene: 30,
      };
  
      // New properties
      this.mood = 'neutral'; // Possible moods: happy, sad, angry, tired, dirty
      this.favoriteFood = monsterConfig.favoriteFood; // Example favorite food
      this.statusEffects = []; // List of status effects like diseased, injured, sick, poison
      this.diseases = []; // Ensure diseases is initialized as an empty array

        //   // Initialize DisplayStatsComponent for displaying stats
        // this.displayStatsComponent = new DisplayStatsComponent(scene, this, 0, 16, 56);


  
      // Text objects will be initialized in GameScene and passed here
      this.hungerText = null;
      this.happinessText = null;
      this.energyText = null;
      this.lifeSpanText = null;
      this.hygieneText = null;
      this.diseaseText = null; // Initialize disease text object reference


      
      // Bind methods
      this.updateMood = this.updateMood.bind(this);
      this.decayNeeds = this.decayNeeds.bind(this);
      this.decreaseLifeSpan = this.decreaseLifeSpan.bind(this);
      this.moveRandomly = this.moveRandomly.bind(this);
      this.updatePosition = this.updatePosition.bind(this);
      this.applyRandomDisease = this.applyRandomDisease.bind(this);
      this.applyDisease = this.applyDisease.bind(this);
      this.cureDisease = this.cureDisease.bind(this);
      
      // Start the timers
      this.setupTimers();
      
    }

  setupTimers() {
    // Decay needs over time
    this.scene.time.addEvent({
      delay: 5000, // Every 5 seconds
      callback: () => this.decayNeeds(),
      loop: true,
    });

    // Change movement randomly
    this.scene.time.addEvent({
      delay: 2000, // Every 2 seconds
      callback: () => this.moveRandomly(),
      loop: true,
    });

    // Decrease lifespan
    this.scene.time.addEvent({
      delay: 1000, // Every 1 second
      callback: () => this.decreaseLifeSpan(),
      loop: true,
    });
    
}
  // New method to freeze the monster
  freeze() {
    this.isFrozen = true;
    this.sprite.setVisible(false); // Hide sprite when frozen
    console.log(`${this.name} is now frozen.`);
  }

  // New method to unfreeze the monster
  unfreeze() {
    this.isFrozen = false;
    this.sprite.setVisible(true); // Show sprite when unfrozen
    console.log(`${this.name} is now unfrozen.`);
  }
    // Method to decay needs over time
    decayNeeds() {
      if (this.isFrozen) return; // Do nothing if frozen

      this.updateStat('hunger', -this.DECAY_RATE);
      this.updateStat('thirst', -this.DECAY_RATE);
      this.updateStat('energy', -this.DECAY_RATE);
      this.updateStat('hygiene', -this.DECAY_RATE);
      this.updateStat('happiness', -this.DECAY_RATE);
  
      this.updateMood(); // Update mood based on new stats
      this.updateDisplay(); // Update the UI display
      this.scene.monsterStatsComponent.updateDisplay();
    }
    // Method to add a disease to the monster
    
    applyRandomDisease() {
      if (this.isFrozen) return; // Do not apply diseases if frozen

        const diseaseNames = Object.keys(Diseases);
        const randomDisease = Phaser.Utils.Array.GetRandom(diseaseNames);
        this.applyDisease(randomDisease);
    }

    // Method to apply a specific disease by name
    applyDisease(diseaseName) {
      const disease = Diseases[diseaseName]; // Get disease details from the Diseases object
      if (disease) {
        this.diseases.push(disease); // Add the disease to the monster's list of diseases
        console.log(`${this.name} has contracted ${disease.name}!`);
    
        // Apply the disease effects to the monster's stats
        Object.keys(disease.effects).forEach((stat) => {
          this.updateStat(stat, disease.effects[stat]);
        });
    
        // Call the method to update the display immediately
        if (this.scene && this.scene.monsterStatsComponent) {
          this.scene.monsterStatsComponent.updateDisplay();
      }
    
        // Schedule curing the disease after its duration
        this.scene.time.delayedCall(disease.duration, () => this.cureDisease(diseaseName), [], this);
      } else {
        console.error(`Disease "${diseaseName}" not found.`);
      }
    }
    
    cureDisease(diseaseName) {
        this.diseases = this.diseases.filter(disease => disease.name !== diseaseName);
        console.log(`${this.name} has been cured of ${diseaseName}!`);
        // Additional logic for restoring stats or handling cured state
        // Update the display to reflect the cured disease
        this.updateDisplay();
      }
  
    // Method to update mood based on current needs
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
  
    // Method to set text objects
    setTextObjects(hungerText, happinessText, energyText, lifeSpanText, hygieneText, diseaseText) {
      this.hungerText = hungerText;
      this.happinessText = happinessText;
      this.energyText = energyText;
      this.lifeSpanText = lifeSpanText;
      this.hygieneText = hygieneText;
      this.diseaseText = diseaseText; // Assign disease text object
      // Immediately update the disease display text
    this.updateDiseaseDisplay();
    }

    // Method to associate a DisplayStatsComponent with the monster
    setDisplayStatsComponent(displayStatsComponent) {
    this.displayStatsComponent = displayStatsComponent;
  }

    // Method to update disease display text
    updateDiseaseDisplay() {
      if (this.diseaseText) {
        const diseasesList = this.diseases.length > 0 
          ? this.diseases.map(disease => disease.name).join(', ') 
          : '';
        this.diseaseText.setText('Diseases: ' + diseasesList);
      }
  }
  
    update() {
      this.updateLifeSpan();
      this.scene.monsterStatsComponent.updateDisplay();
      this.updateDisplay();
    }
  
    decreaseLifeSpan() {
      if (this.isFrozen) return; // Do nothing if frozen

        const decayAmount = (this.hunger > 80 || this.energy < 20) ? 0.2 : 0.1;
        this.lifeSpan = Math.max(0, this.lifeSpan - decayAmount);
    
        if (this.lifeSpan <= 0) {
          this.handleDeath();
        }
    
        this.updateDisplay();
      }
  
    handleDeath() {
        alert(`${this.name} has died. Game Over.`);
    
        // Save the monster's name to the deceased list
        if (!this.scene.deceasedMonsters) {
          this.scene.deceasedMonsters = [];
        }
        this.scene.deceasedMonsters.push(this.name);
    
        // Pause the game or handle the game-over scenario
        this.scene.scene.pause();
        this.scene.scene.start("MonsterCemeteryScene", {
          deceasedMonsters: this.scene.deceasedMonsters
        });
    }
  
    feed(i, button, inventory, gameScene) {
      if (this.mood === "dead") return; // Prevent actions if monster is dead
      console.log("Feeding the monster");
  
      const food = inventory[i];
  
      let hungerEffect = food.hungerAmount;
      let happinessEffect = food.happinessAmount;
  
      if (food.name === this.favoriteFood) {
          happinessEffect += 5;
          hungerEffect += 5;
      }
  
      this.updateStat("hunger", hungerEffect);
      this.updateStat("happiness", happinessEffect);
      this.updateMood(); // Update mood after feeding
      this.updateDisplay();
  
      // Remove the item from the inventory array
      inventory.splice(i, 1);
  
      // Destroy the button from the screen
      if (button) {
          button.destroy();
      }
  
      // Reset the inventory slots to reflect the current state of the inventory
      gameScene.resetInventorySlots();
  }
  
    play() {
      if (this.mood === 'tired' || this.mood === 'dead') return; // Prevent actions if monster is tired or dead
      this.updateStat('happiness', 15);
      this.updateStat('energy', -10);
      this.updateMood(); // Update mood after playing
      this.updateDisplay();
    }
  
    sleep() {
      if (this.mood === 'dead') return; // Prevent actions if monster is dead
      this.updateStat('energy', 100 - this.energy); // Fully restore energy
      this.updateStat('happiness', 10);
      this.updateMood(); // Update mood after sleeping
      this.updateDisplay();
    }
  
    updateStat(stat, value) {
      this[stat] = Math.min(100, Math.max(0, this[stat] + value)); // Clamp between 0 and 100
    }
  
    updateDisplay() {
      if (this.hungerText) this.hungerText.setText('Hunger: ' + this.hunger);
      if (this.happinessText) this.happinessText.setText('Happiness: ' + this.happiness);
      if (this.energyText) this.energyText.setText('Energy: ' + this.energy);
      if (this.trainingText) this.trainingText.setText('Training: ' + this.training);
      if (this.lifeSpanText) this.lifeSpanText.setText('Life Span: ' + this.lifeSpan.toFixed(1));
      if (this.hygieneText) this.hygieneText.setText('Hygiene: ' + this.hygiene);
      if (this.moodText) this.moodText.setText('Mood: ' + this.mood);
      // Update the display for diseases
      // Call updateDiseaseDisplay to update diseases text
      this.updateDiseaseDisplay();
}

updateDisplay() {
  if (this.displayStatsComponent) {
    this.displayStatsComponent.updateDisplay(); // Ensure the component reflects the current state
  }
}
  
    adjustHappinessByLocation(ranchLocation) {
        console.log("Adjusting happiness based on location");
        const locationEffects = {
          grassland: 10,
          desert: -5,
          mountain: 5,
        };
    
        const happinessEffect = locationEffects[ranchLocation] || 0;
        this.updateStat('happiness', happinessEffect);
        this.updateDisplay();
      }
    

    // Method to move randomly
    moveRandomly() {
        this.direction.x = Phaser.Math.Between(-1, 1) || 1; // Ensure it's never zero
        this.direction.y = Phaser.Math.Between(-1, 1) || 1; // Ensure it's never zero
      }

    // Method to update position
  updatePosition(delta) {
    if (this.isFrozen || !this.sprite) return; // Do nothing if frozen
    if (!this.sprite) return;

    // Calculate new position based on speed and direction
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
}
    
    export default Monster;
