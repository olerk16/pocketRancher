// src/scenes/GameScene.js

import { createButton } from "../utils/uiUtils.js"; // Import the utility functions
import DropdownMenu from "../components/dropDownMenu.js"; // Import the DropdownMenu component

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
    this.playerCoins = data.playerCoins;
    this.inventory = data.inventory;
    this.ranchLocation = data.ranchLocation;
    console.log(
      `Player Name: ${this.playerName}, Ranch Name: ${this.ranchName}, Selected Monster: `
    );
  }

  preload() {
    console.log(this.monsterType);
    // Load assets for the game scene
    // Load monster sprite based on selected monster type
    this.load.image("monsterSprite", `assets/images/${this.monsterType}.png`);
    // this.load.image('background', 'assets/images/backGrounds/grasslandRanch.webp');

    // Load background images for each location
    this.load.image(
      "grassLandRanch",
      "assets/images/backGrounds/grassLandRanch.webp"
    );
    this.load.image(
      "desertRanch",
      "assets/images/backGrounds/desertRanch.webp"
    );
    this.load.image(
      "mountainRanch",
      "assets/images/backGrounds/mountainRanch.webp"
    );
  }

  create() {
    this.setBackgroundImage();
    console.log("locationssssss", this.ranchLocation);
    this.addPlayerInfo();
    this.addMonster();
    this.setupTextObjects();
    this.createDropdownMenu();
    this.setupMovement();

    // Adjust monster's happiness based on the selected location
    // toDo make function effect other stats besides just happiness
    this.monster.adjustHappinessByLocation(this.ranchLocation);

    // Player currency
    this.coinsText = this.add.text(16, 200, "Coins: " + this.playerCoins, {
      fontSize: "16px",
      fill: "#FFF",
    });

    // Associate the text objects with the monster instance
    this.monster.setTextObjects(
      this.hungerText,
      this.happinessText,
      this.energyText,
      this.trainingText,
      this.lifeSpanText,
      this.hygeneText
    );
  }

  setBackgroundImage() {
    // Set background image based on selected location
    // Determine which background image to show based on the selected location
    switch (this.ranchLocation) {
      case "grassLand":
        this.currentBackground = this.add.image(400, 300, "grassLandRanch");
        break;
      case "desert":
        this.currentBackground = this.add.image(400, 300, "desertRanch");
        break;
      case "mountain":
        this.currentBackground = this.add.image(400, 300, "mountainRanch");
        break;
      default:
        break;
    }
  }

  addPlayerInfo() {
    // Display player and ranch information
    this.add.text(16, 16, `Player: ${this.playerName}`, {
      fontSize: "16px",
      fill: "#FFF",
    });
    this.add.text(16, 36, `Ranch: ${this.ranchName}`, {
      fontSize: "16px",
      fill: "#FFF",
    });
  }

  addMonster() {
    // Display the selected monster in the game scene
    this.monster.sprite = this.add.sprite(500, 450, "monsterSprite");
    this.monster.sprite.setScale(0.6); // Scale down the monster sprite
  }

  setupTextObjects() {
    // Initialize text objects for monster stats
    this.hungerText = this.add.text(16, 56, "Hunger: " + this.monster.hunger, {
      fontSize: "16px",
      fill: "#FFF",
    });
    this.hygeneText = this.add.text(16, 56, "Hygene: " + this.monster.hygene, {
        fontSize: "16px",
        fill: "#FFF",
      });
    this.happinessText = this.add.text(
      16,
      76,
      "Happiness: " + this.monster.happiness,
      { fontSize: "16px", fill: "#FFF" }
    );
    this.energyText = this.add.text(16, 96, "Energy: " + this.monster.energy, {
      fontSize: "16px",
      fill: "#FFF",
    });
    this.trainingText = this.add.text(
      16,
      116,
      "Training: " + this.monster.training,
      { fontSize: "16px", fill: "#FFF" }
    );
    this.lifeSpanText = this.add.text(
      16,
      136,
      "Life Span: " + this.monster.lifeSpan,
      { fontSize: "16px", fill: "#FFF" }
    );

    // Associate the text objects with the monster instance
    this.monster.setTextObjects(
      this.hungerText,
      this.happinessText,
      this.energyText,
      this.trainingText,
      this.lifeSpanText,
      this.hygeneText
    );
  }

  createDropdownMenu() {
    // Create dropdown menu with game actions
    this.dropdownMenu = new DropdownMenu(this, [
      { text: "Feed", onClick: () => this.monster.feed() },
      { text: "Play", onClick: () => this.monster.play() },
      { text: "Train", onClick: () => this.monster.train() },
      { text: "Sleep", onClick: () => this.monster.sleep() },
      { text: "Go to Market", onClick: () => this.goToMarket() },
      { text: "Use Item", onClick: () => this.useItem() },
      { text: "View Map", onClick: () => this.viewMap() },
    ]);
  }

  viewMap() {
    this.scene.start("MapScene", {
      // Pass any data needed by the MapScene
    });
  }

  setupMovement() {
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

  goToMarket() {
     // Switch to the market scene
    this.scene.start("MarketBazaarScene", {
      inventory:this.inventory,
      playerCoins:this.playerCoins,
      playerName: this.playerName,
      ranchName: this.ranchName,
      selectedMonster: this.monster, // Pass the monster if needed
      monsterType: this.monsterType,
      ranchLocation: this.ranchLocation
    }); // Switch to the market scene
  }

  // Phaser method that is called when the scene is stopped
  shutdown() {
    this.dropdownMenu.removeMenu(); // Clean up when the scene shuts down
  }
  update() {
    // Update the game state and refresh the display of monster properties
    this.monster.updateDisplay();
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
