// src/scenes/GameScene.js

import { createButton } from "../utils/uiUtils.js"; // Import the utility functions
// import Monster from '../models/Monster.js';  // Import the Monster class

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    // Receive data passed from the PlayerSetupScene
    this.playerName = data.playerName;
    this.ranchName = data.ranchName;
    this.monster = data.selectedMonster; // Use the passed monster instance
    this.monsterType = data.monsterType; // Use the passed monster type
    console.log(
      `Player Name: ${this.playerName}, Ranch Name: ${this.ranchName}, Selected Monster: `
    );
    this.playerCoins = data.playerCoins;
    this.inventory = data.inventory;
  }

  preload() {
    console.log(this.monsterType);
    // Load assets for the game scene
    // Load monster sprite based on selected monster type
    this.load.image("monsterSprite", `assets/images/${this.monsterType}.png`);
    // this.load.image('background', 'assets/images/background.png');
    // this.load.image('marketButton', 'assets/images/marketButton.png'); // Button to go to market
  }

  create() {
    // Add the background image to the game
    this.add.image(400, 300, "background");

    // Display player and ranch name
    this.add.text(16, 16, `Player: ${this.playerName}`, {
      fontSize: "16px",
      fill: "#FFF",
    });
    this.add.text(16, 36, `Ranch: ${this.ranchName}`, {
      fontSize: "16px",
      fill: "#FFF",
    });

    // Display the selected monster in the game scene
    this.monster.sprite = this.add.sprite(400, 300, "monsterSprite");

    //CAUSING ERROR !!!!!!!!!!!!
    //this.monster.sprite.setCollideWorldBounds(true); // Prevent monster from moving out of bounds

    // Player currency
    this.coinsText = this.add.text(16, 200, "Coins: " + this.playerCoins, {
      fontSize: "16px",
      fill: "#FFF",
    });

    // Display monster stats on the screen
    this.hungerText = this.add.text(16, 16, "Hunger: " + this.monster.hunger, {
      fontSize: "16px",
      fill: "#FFF",
    });
    this.happinessText = this.add.text(
      16,
      36,
      "Happiness: " + this.monster.happiness,
      { fontSize: "16px", fill: "#FFF" }
    );
    this.energyText = this.add.text(16, 56, "Energy: " + this.monster.energy, {
      fontSize: "16px",
      fill: "#FFF",
    });
    this.trainingText = this.add.text(
      16,
      76,
      "Training: " + this.monster.training,
      { fontSize: "16px", fill: "#FFF" }
    );
    this.lifeSpanText = this.add.text(
      16,
      96,
      "Life Span: " + this.monster.lifeSpan,
      { fontSize: "16px", fill: "#FFF" }
    );

    // Add buttons for actions (feed, play, train, sleep)
    createButton(this, 16, 120, "Feed", () => this.feedMonster());
    createButton(this, 16, 160, "Play", () => this.playWithMonster());
    createButton(this, 16, 200, "Train", () => this.trainMonster());
    createButton(this, 16, 240, "Sleep", () => this.putMonsterToSleep());

    // Button to go to the market bazaar
    createButton(this, 700, 50, "Go to Market", () => {
      this.scene.start("MarketBazaarScene", {
        playerCoins: this.playerCoins,
        inventory: this.inventory,
      }); // Switch to the market scene
    });

    // Button to use inventory items
    createButton(this, 16, 280, "Use Item", () => this.useItem());

    // Set up random movement timer
    this.time.addEvent({
      delay: 2000, // Every 2 seconds
      callback: () => this.monster.moveRandomly(),
      callbackScope: this,
      loop: true,
    });

    // Set up keyboard input for movement
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update() {
    // Update the game state periodically
    this.monster.update;
  }

  earnCoins(amount) {
    this.playerCoins += amount;
    this.coinsText.setText("Coins: " + this.playerCoins);
  }

  // Method to use an item from inventory
  useItem() {
    if (this.inventory.length > 0) {
      const item = this.inventory.pop(); // Remove the last item from inventory
      // Apply item effects to monster stats
      if (item === "apple") {
        this.monster.updateStat("hunger", -20);
      } else if (item === "toy") {
        this.monster.updateStat("happiness", 30);
      }
      this.monster.updateDisplay(); // Update display after using item
    } else {
      alert("Inventory is empty!");
    }
  }
}

export default GameScene;
