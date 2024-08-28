// src/models/Monster.js

class Monster {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'monster');
        this.sprite.setCollideWorldBounds(true); // Prevent monster from moving out of bounds

        // Initialize monster properties
        this.hunger = 50;
        this.happiness = 50;
        this.energy = 50;
        this.training = 0;
        this.lifeSpan = 100;

        // New properties
        this.favoriteFood = 'apple'; // Example favorite food
        this.statusEffects = []; // List of status effects like tired, happy, sick

        // Text objects will be initialized in GameScene and passed here
        this.hungerText = null;
        this.happinessText = null;
        this.energyText = null;
        this.trainingText = null;
        this.lifeSpanText = null;

        // Start the life span timer
        this.startLifeSpanTimer();
    }

    // Method to set text objects
  setTextObjects(hungerText, happinessText, energyText, trainingText, lifeSpanText) {
    this.hungerText = hungerText;
    this.happinessText = happinessText;
    this.energyText = energyText;
    this.trainingText = trainingText;
    this.lifeSpanText = lifeSpanText;
  }

    update() {
        // Update monster properties over time or based on game events
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
    
        // Check for monster's death
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
        // if (this.isActionOnCooldown('feed')) return;
        console.log("feeeed");
        let hungerEffect = -10;
        let happinessEffect = 5;
    
        // Apply favorite food bonus
        if (food === this.favoriteFood) {
          happinessEffect += 5;
          hungerEffect -= 5;
        }

        this.updateStat('hunger', hungerEffect);
        this.updateStat('happiness', happinessEffect);
    }

    play() {
        this.updateStat('happiness', 15);
        this.updateStat('energy', -10);
      }

    train() {
        this.updateStat('training', 1);
        this.updateStat('energy', -15);
        this.updateStat('happiness', -5);
        this.update()
    }

    sleep() {
        this.updateStat('energy', 100 - this.energy); // Fully restore energy
        this.updateStat('happiness', 10);

      }

    updateStat(stat, value) {
        this[stat] = Math.min(100, Math.max(0, this[stat] + value)); // Clamp between 0 and 100
    }

    updateDisplay() {
        // Ensure the text objects are defined before attempting to update
        if (this.hungerText) this.hungerText.setText('Hunger: ' + this.hunger);
        if (this.happinessText) this.happinessText.setText('Happiness: ' + this.happiness);
        if (this.energyText) this.energyText.setText('Energy: ' + this.energy);
        if (this.trainingText) this.trainingText.setText('Training: ' + this.training);
        if (this.lifeSpanText) this.lifeSpanText.setText('Life Span: ' + this.lifeSpan.toFixed(1));
    }
// toDO make function effect more states then just happiness
    adjustHappinessByLocation(ranchLocation) {
        console.log("happpyyyyyyyyyyyyyyyyy")
        let happinessEffect = 0; // Default effect
    
        // Define effects based on ranch location
        if (ranchLocation === "grassland") {
          happinessEffect = 10;  // Increase happiness in forest
        } else if (ranchLocation === "desert") {
          happinessEffect = -5;  // Decrease happiness in desert
        } else if (ranchLocation === "mountain") {
          happinessEffect = 5;   // Slight increase in mountain
        }
    
        this.updateStat('happiness', happinessEffect);
        this.updateDisplay();
      }

    moveRandomly() {
        const randomVelocityX = Phaser.Math.Between(-100, 100); // Random X velocity
        const randomVelocityY = Phaser.Math.Between(-100, 100); // Random Y velocity
        // Error HERE!!!!!!!!!!!!!!!!!!!!!!!!
        //this.sprite.setVelocity(randomVelocityX, randomVelocityY);
    }
}

export default Monster;
