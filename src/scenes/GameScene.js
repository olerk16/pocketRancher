// src/scenes/GameScene.js

import { createButton } from "../utils/uiUtils.js"; // Import the utility functions
import DropdownMenu from "../components/dropDownMenu.js"; // Import the DropdownMenu component
import Monster from "../models/Monster.js";

// import Monster from '../models/Monster.js';  // Import the Monster class

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    // Receive data passed from the PlayerSetupScene
    this.playerName = data.playerName;
    this.ranchName = data.ranchName;
    this.monsterType = data.monsterType; // Use the passed monster type
    this.playerCoins = data.playerCoins;
    this.inventory = data.inventory;
    this.ranchLocation = data.ranchLocation;
    console.log(
      `Player Name: ${this.playerName}, Ranch Name: ${this.ranchName}, Selected Monster: `
    );

    // Initialize Monster in GameScene
    this.monster = new Monster(this, 400, 300, this.monsterType);
  }

  preload() {
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
    this.addPlayerInfo();
    this.addMonsterToScene();
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
      this.lifeSpanText,
      this.hygieneText
    );
  }

  setBackgroundImage() {
    // Create a mapping object that associates each location with its corresponding background image key
    const backgroundImages = {
      grassLand: "grassLandRanch",
      desert: "desertRanch",
      mountain: "mountainRanch",
    };
    // Get the background image key based on the selected ranch location
    const backgroundImageKey = backgroundImages[this.ranchLocation];
    // Only add the image if a valid background image key is found
    if (backgroundImageKey) {
      this.currentBackground = this.add.image(400, 300, backgroundImageKey);
    }
  }

  addPlayerInfo() {
    this.add.text(16, 16, `Player: ${this.playerName}`, {
      fontSize: "16px",
      fill: "#FFF",
    });
    this.add.text(16, 36, `Ranch: ${this.ranchName}`, {
      fontSize: "16px",
      fill: "#FFF",
    });
  }

  addMonsterToScene() {
    this.monster.sprite = this.add.image(400, 300, this.monsterType);
    this.monster.sprite.setScale(0.5); // Adjust scale if necessary

    // Start decay timer in the GameScene
    // this.monster.startDecayTimer();
  }

  setupTextObjects() {
    // Initialize text objects for monster stats
    this.hungerText = this.add.text(16, 56, "Hunger: " + this.monster.hunger, {
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
    this.hygieneTextText = this.add.text(
      16,
      116,
      "Hygiene: " + this.monster.hygiene,
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
      this.lifeSpanText,
      this.hygieneText
    );
  }

  createDropdownMenu() {
    // Create dropdown menu with game actions
    this.dropdownMenu = new DropdownMenu(this, [
      { text: "Feed", onClick: () => this.monster.feed() },
      { text: "Play", onClick: () => this.monster.play() },
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
    // Timer to change direction every 2 seconds
    this.time.addEvent({
      delay: 2000,
      callback: this.monster.moveRandomly,
      callbackScope: this.monster,
      loop: true,
    });
  }

  update(time, delta) {
    // Call updatePosition to move the monster each frame
    this.monster.updatePosition(delta);
    this.monster.updateDisplay(); // Refresh the display of monster properties
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
