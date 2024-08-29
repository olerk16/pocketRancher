
// src/models/Monster.js

class Monster {
    constructor(scene, x, y) {
      this.scene = scene;
      this.sprite = scene.add.image(x, y, 'monster');
    //   this.sprite.setCollideWorldBounds(true); // Prevent monster from moving out of bounds
  
      // Initialize monster properties
      this.hunger = 50;
      this.happiness = 50;
      this.energy = 50;
      this.lifeSpan = 100;
      this.hygiene = 50;

      // Store the current movement direction and speed
    this.movementSpeed = 50; // Pixels per second
    this.direction = { x: 1, y: 1 }; // Start moving diagonally
  
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
      this.favoriteFood = 'apple'; // Example favorite food
      this.statusEffects = []; // List of status effects like diseased, injured, sick, poison
  
      // Text objects will be initialized in GameScene and passed here
      this.hungerText = null;
      this.happinessText = null;
      this.energyText = null;
      this.lifeSpanText = null;
      this.hygieneText = null;
  
      // Start the life span timer
      this.setupTimers();
    //   this.startLifeSpanTimer();
  
      // Timer to decay needs
    //   this.scene.time.addEvent({
    //     delay: 5000, // Every 5 seconds
    //     callback: this.decayNeeds,
    //     callbackScope: this,
    //     loop: true
    //   });

      // Set up initial movement timer
    // this.scene.time.addEvent({
    //     delay: 2000, // Every 2 seconds
    //     callback: this.moveRandomly,
    //     callbackScope: this,
    //     loop: true,
    //   });
  
      // Bind methods
      this.updateMood = this.updateMood.bind(this);
      this.decayNeeds = this.decayNeeds.bind(this);
      this.decreaseLifeSpan = this.decreaseLifeSpan.bind(this);

      // Bind methods
    this.moveRandomly = this.moveRandomly.bind(this);
    this.updatePosition = this.updatePosition.bind(this);

      // Start the timers
    //   this.startDecayTimer()
    }

    // Initialize decay timer
//   startDecayTimer() {
//     console.log('Initializing decay timer...');

//     // Make sure the scene is valid and active
//     if (!this.scene) {
//       console.error('Scene is not defined or not active.');
//       return;
//     }

//     // Ensure the scene's time object is accessible
//     if (!this.scene.time) {
//       console.error('Scene time is not initialized.');
//       return;
//     }

    // Register the timer event
    // this.scene.time.addEvent({
    //   delay: 5000, // Every 5 seconds
    //   callback: this.decayNeeds,
    //   callbackScope: this,
    //   loop: true
    // });

  

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
  
    // Method to decay needs over time
    decayNeeds() {
        console.log("decay needs")
      this.updateStat('hunger', -this.DECAY_RATE);
      this.updateStat('thirst', -this.DECAY_RATE);
      this.updateStat('energy', -this.DECAY_RATE);
      this.updateStat('hygiene', -this.DECAY_RATE);
  
      this.updateMood(); // Update mood based on new stats
      this.updateDisplay(); // Update the UI display
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
    setTextObjects(hungerText, happinessText, energyText, lifeSpanText, hygieneText) {
      this.hungerText = hungerText;
      this.happinessText = happinessText;
      this.energyText = energyText;
      this.lifeSpanText = lifeSpanText;
      this.hygieneText = hygieneText;
    }
  
    update() {
      this.updateLifeSpan();
      this.updateDisplay();
    }
  
    // startLifeSpanTimer() {
    //     console.log("start kife timer")
    //   // Decrease life span gradually over time
    //   this.scene.time.addEvent({
    //     delay: 1000, // Every 1 second
    //     callback: this.decreaseLifeSpan,
    //     callbackScope: this,
    //     loop: true
    //   });
    //   console.log('Decay timer initialized.');
    // }
  
    decreaseLifeSpan() {
        console.log('Decreasing life span...');
        const decayAmount = (this.hunger > 80 || this.energy < 20) ? 0.2 : 0.1;
        this.lifeSpan = Math.max(0, this.lifeSpan - decayAmount);
    
        if (this.lifeSpan <= 0) {
          this.handleDeath();
        }
    
        this.updateDisplay();
      }
  
    handleDeath() {
      alert('Your monster has died. Game Over.');
      this.scene.scene.pause(); // Pause the game or handle the game-over scenario
    }
  
    feed(food) {
      if (this.mood === 'dead') return; // Prevent actions if monster is dead
      console.log("Feeding the monster");
  
      let hungerEffect = -10;
      let happinessEffect = 5;
  
      if (food === this.favoriteFood) {
        happinessEffect += 5;
        hungerEffect -= 5;
      }
  
      this.updateStat('hunger', hungerEffect);
      this.updateStat('happiness', happinessEffect);
      this.updateMood(); // Update mood after feeding
      this.updateDisplay();
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
        console.log("Monster moving randomly...");
        this.direction.x = Phaser.Math.Between(-1, 1) || 1; // Ensure it's never zero
        this.direction.y = Phaser.Math.Between(-1, 1) || 1; // Ensure it's never zero
      }

    // Method to update position
  updatePosition(delta) {
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
