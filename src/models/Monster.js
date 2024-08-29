
// src/models/Monster.js

class Monster {
    constructor(scene, x, y) {
      this.scene = scene;
      this.sprite = scene.physics.add.sprite(x, y, 'monster');
      this.sprite.setCollideWorldBounds(true); // Prevent monster from moving out of bounds
  
      // Initialize monster properties
      this.hunger = 50;
      this.thirst = 50;
      this.happiness = 50;
      this.energy = 50;
      this.lifeSpan = 100;
      this.hygiene = 50;
  
      // Define thresholds and decay rates
      this.DECAY_RATE = 5; // Rate at which needs decay
      this.HUNGER_THRESHOLD = 20;
      this.HAPPINESS_THRESHOLD = 30;
      this.ENERGY_THRESHOLD = 30;
      this.HYGIENE_THRESHOLD = 30;
  
      // New properties
      this.mood = 'neutral'; // Possible moods: happy, sad, angry, tired, dirty
      this.favoriteFood = 'apple'; // Example favorite food
      this.statusEffects = []; // List of status effects like diseased, injured, sick, poison
  
      // Text objects will be initialized in GameScene and passed here
      this.hungerText = null;
      this.happinessText = null;
      this.energyText = null;
      this.trainingText = null;
      this.lifeSpanText = null;
      this.hygieneText = null;
  
      // Start the life span timer
      this.startLifeSpanTimer();
  
      // Timer to decay needs
      this.scene.time.addEvent({
        delay: 5000, // Every 5 seconds
        callback: this.decayNeeds,
        callbackScope: this,
        loop: true
      });
  
      // Bind methods
      this.updateMood = this.updateMood.bind(this);
      this.decayNeeds = this.decayNeeds.bind(this);
      this.decreaseLifeSpan = this.decreaseLifeSpan.bind(this);
    }
  
    // Method to decay needs over time
    decayNeeds() {
      this.updateStat('hunger', -this.DECAY_RATE);
      this.updateStat('thirst', -this.DECAY_RATE);
      this.updateStat('energy', -this.DECAY_RATE);
      this.updateStat('hygiene', -this.DECAY_RATE);
  
      this.updateMood(); // Update mood based on new stats
      this.updateDisplay(); // Update the UI display
    }
  
    // Method to update mood based on current needs
    updateMood() {
      if (this.hunger < this.HUNGER_THRESHOLD || this.thirst < this.HUNGER_THRESHOLD) {
        this.mood = 'hungry';
      } else if (this.happiness < this.HAPPINESS_THRESHOLD) {
        this.mood = 'sad';
      } else if (this.energy < this.ENERGY_THRESHOLD) {
        this.mood = 'tired';
      } else if (this.hygiene < this.HYGIENE_THRESHOLD) {
        this.mood = 'dirty';
      } else {
        this.mood = 'happy';
      }
  
      console.log(`Monster mood: ${this.mood}`);
    }
  
    // Method to set text objects
    setTextObjects(hungerText, happinessText, energyText, trainingText, lifeSpanText, hygieneText) {
      this.hungerText = hungerText;
      this.happinessText = happinessText;
      this.energyText = energyText;
      this.trainingText = trainingText;
      this.lifeSpanText = lifeSpanText;
      this.hygieneText = hygieneText;
    }
  
    update() {
      this.updateLifeSpan();
      this.updateDisplay();
    }
  
    startLifeSpanTimer() {
      // Decrease life span gradually over time
      this.scene.time.addEvent({
        delay: 1000, // Every 1 second
        callback: this.decreaseLifeSpan,
        callbackScope: this,
        loop: true
      });
    }
  
    decreaseLifeSpan() {
      if (this.hunger > 80 || this.energy < 20) {
        this.lifeSpan -= 0.2; // Decreases faster if the monster is in poor condition
      } else {
        this.lifeSpan -= 0.1; // Normal decrease over time
      }
  
      if (this.lifeSpan <= 0) {
        this.lifeSpan = 0; // Prevent negative life span
        this.handleDeath();
      }
  
      this.updateDisplay(); // Update the display with the new life span
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
  
    train() {
      if (this.mood === 'tired' || this.mood === 'dead') return; // Prevent actions if monster is tired or dead
      this.updateStat('training', 1);
      this.updateStat('energy', -15);
      this.updateStat('happiness', -5);
      this.updateMood(); // Update mood after training
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
      let happinessEffect = 0;
  
      switch (ranchLocation) {
        case "grassland":
          happinessEffect = 10; // Increase happiness in grassland
          break;
        case "desert":
          happinessEffect = -5; // Decrease happiness in desert
          break;
        case "mountain":
          happinessEffect = 5; // Slight increase in mountain
          break;
        default:
          happinessEffect = 0; // No change for undefined locations
      }
  
      this.updateStat('happiness', happinessEffect);
      this.updateDisplay();
    }
    
    moveRandomly() {
        const randomVelocityX = Phaser.Math.Between(-100, 100); // Random X velocity
        const randomVelocityY = Phaser.Math.Between(-100, 100); // Random Y velocity
        // this.sprite.setVelocity(randomVelocityX, randomVelocityY);
      }
    }
    
    export default Monster;
