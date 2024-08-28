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

        // Text objects will be initialized in GameScene and passed here
        this.hungerText = null;
        this.happinessText = null;
        this.energyText = null;
        this.trainingText = null;
        this.lifeSpanText = null;
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

    feed() {
        console.log("feeeed")
        this.updateStat('hunger', -10);
        this.updateStat('energy', 5);
        this.update()
    }

    play() {
        this.updateStat('happiness', 15);
        this.updateStat('energy', -10);
        this.update()
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
        this.update()
    }

    updateStat(stat, value) {
        this[stat] = Math.min(100, Math.max(0, this[stat] + value)); // Clamp between 0 and 100
    }

    updateLifeSpan() {
        // Decrease the life span based on current stats
        if (this.hunger > 80 || this.energy < 20) {
            this.lifeSpan -= 0.1; // Decreases faster if the monster is in poor condition
        } else {
            this.lifeSpan -= 0.05; // Normal decrease over time
        }

        if (this.lifeSpan <= 0) {
            alert('Your monster has died. Game Over.');
            this.scene.scene.pause();
        }
    }

    updateDisplay() {
        // Ensure the text objects are defined before attempting to update
        if (this.hungerText) this.hungerText.setText('Hunger: ' + this.hunger);
        if (this.happinessText) this.happinessText.setText('Happiness: ' + this.happiness);
        if (this.energyText) this.energyText.setText('Energy: ' + this.energy);
        if (this.trainingText) this.trainingText.setText('Training: ' + this.training);
        if (this.lifeSpanText) this.lifeSpanText.setText('Life Span: ' + this.lifeSpan.toFixed(1));
    }

    moveRandomly() {
        const randomVelocityX = Phaser.Math.Between(-100, 100); // Random X velocity
        const randomVelocityY = Phaser.Math.Between(-100, 100); // Random Y velocity
        // Error HERE!!!!!!!!!!!!!!!!!!!!!!!!
        //this.sprite.setVelocity(randomVelocityX, randomVelocityY);
    }
}

export default Monster;
