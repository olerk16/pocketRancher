// src/scenes/GameScene.js

import { createButton, createImageButton } from "../utils/uiUtils.js"; // Import the utility functions
import DropdownMenu from "../components/dropDownMenu.js"; // Import the DropdownMenu component
import Monster from "../models/Monster.js";
import Monsters from "../models/Monsters.js"; // Import the Monsters object

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    console.log("monster type gamescene", data.monsterType)
    // Receive data passed from the PlayerSetupScene
    this.playerName = data.playerName;
    this.ranchName = data.ranchName;
    this.playerCoins = data.playerCoins;
    this.inventory = data.inventory;
    this.ranchLocation = data.ranchLocation;
    this.monsterName = data.monsterName;

    // Select a random monster type
    const monsterTypes = Object.keys(Monsters);
    this.monsterType = Phaser.Utils.Array.GetRandom(monsterTypes); // Get a random monster type from the Monsters object



        // Initialize Monster in GameScene
        this.monster = new Monster(this, 400, 300, this.monsterType, this.monsterName);

  }

  preload() {
    //  Load monster sprite based on selected monster type
    Object.values(Monsters).forEach(monster => {
      this.load.image(monster.spriteKey, `assets/images/${monster.spriteKey}.png`);
    });
    this.load.image("exitButton", "assets/images/icons/exitButton.webp");

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
    this.load.image("desertFight", "assets/images/backGrounds/desertFight.webp");
  }

  create() {
    this.setBackgroundImage();
    this.addPlayerInfo();
    this.addMonsterToScene();
    this.setupTextObjects();
    this.createDropdownMenu();
    this.setupMovement();
    this.createInventoryWindow();

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
      this.hygieneText,
      this.diseaseText // Add disease text object
    );
    this.inventoryWindow.setVisible(false);
  }
  createInventoryWindow() {
    // Calculate the bottom-left position
    const windowHeight = this.scale.height;
    const windowWidth = this.scale.width;

    // Define the size of the inventory window
    const inventoryWidth = windowWidth - 100;

    // Set the inventory window to be bottom-left
    this.inventoryWindow = this.add.container(50, windowHeight - 100); // Adjust the x, y position as needed
    const background = this.add
      .rectangle(
        0,
        0, // Position at the top-left of the container
        windowWidth - 100,
        100, // Width and height of the background (adjust as needed)
        0x000000, // Black color in hexadecimal
        0.5 // Alpha value (0 is fully transparent, 1 is fully opaque)
      )
      .setOrigin(0);

    // Add the background to the inventory window container
    this.inventoryWindow.add(background);
    this.populateInventorySlots();

    const exitButton = this.add
      .image(inventoryWidth - 20, 20, "exitButton")
      .setScale(0.04)
      .setAlpha(0.7)
      .setInteractive({ useHandCursor: true });

    exitButton.on("pointerdown", () => {
      this.inventoryWindow.setVisible(false);
    });

    this.inventoryWindow.add(exitButton);
  }
  resetInventorySlots() {
    // Remove all existing slots
    for (let i = 0; i < this.inventorySlot.length; i++) {
      this.inventorySlot[i].destroy();
    }

    // Clear the array
    this.inventorySlot = [];

    // Repopulate the slots with the updated inventory
    this.populateInventorySlots();
  }

  populateInventorySlots() {
    this.inventorySlot = []; // Clear the slots array

    for (let i = 0; i < this.inventory.length; i++) {
      const slot = createImageButton(
        this,
        30 + i * 55,
        50,
        this.inventory[i].name,
        () => this.monster.feed(i, slot, this.inventory, this),
        50,
        50
      );

      this.inventorySlot.push(slot); // Track the slot for future removal
      this.inventoryWindow.add(slot);
    }
  }
  toggleInventory() {
    const isVisible = this.inventoryWindow.visible;
    this.inventoryWindow.setVisible(!isVisible);
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
    this.monster.sprite = this.add.image(400, 300, `${this.monster.type}Sprite`);
    this.monster.sprite.setScale(0.5);
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
    this.diseaseText = this.add.text(16, 176, "Diseases: None", {
      // Add a new text object for diseases
      fontSize: "16px",
      fill: "#FFF",
    });

    // Associate the text objects with the monster instance
    this.monster.setTextObjects(
      this.hungerText,
      this.happinessText,
      this.energyText,
      this.lifeSpanText,
      this.hygieneText,
      this.diseaseText
    );
  }

  createDropdownMenu() {
    // Create dropdown menu with game actions
    this.dropdownMenu = new DropdownMenu(this, [
      { text: "Feed", onClick: () => this.toggleInventory() },
      { text: "Play", onClick: () => this.monster.play() },
      { text: "Sleep", onClick: () => this.monster.sleep() },
      { text: "Go to Market", onClick: () => this.goToMarket() },
      { text: "Use Item", onClick: () => this.useItem() },
      { text: "Journey", onClick: () => this.startJourney() },
      { text: "View Map", onClick: () => this.viewMap() },
      { text: "Cemetery", onClick: () => this.viewCemetery() },
      { text: "Monster Portal", onClick: () => this.goToMonsterPortal() }, 
    ]);
  }

  startJourney() {
    console.log("Journey started!");
    const journeyDuration = Phaser.Math.Between(5000, 15000); // Random duration between 5 and 15 seconds

    // Display journey duration to the player
    const journeyDurationText = this.add.text(
      16,
      220,
      `Journey Time: ${journeyDuration / 1000} seconds`,
      {
        fontSize: "16px",
        fill: "#FFF",
      }
    );

    // Hide the monster sprite
    this.monster.sprite.setVisible(false);

    // Disable dropdown menu during the journey
    this.dropdownMenu.disableMenu();

    // Set a timer to bring the monster back and reward coins
    this.time.delayedCall(journeyDuration, () => {
      this.monster.sprite.setVisible(true); // Show monster again
      const earnedCoins = Phaser.Math.Between(10, 50); // Random coin reward
      this.playerCoins += earnedCoins;
      this.coinsText.setText("Coins: " + this.playerCoins);
      console.log(`Journey complete! You earned ${earnedCoins} coins.`);

      // Re-enable dropdown menu after journey
      this.dropdownMenu.enableMenu();

      // Remove journey duration text
      journeyDurationText.destroy();

      // Apply a random disease
      this.monster.applyRandomDisease(); // Apply random disease to the monster
    });
  }

  goToMonsterPortal() {
    this.scene.start('MonsterPortalScene'); // Start the Monster Portal Scene
  }

  viewCemetery() {
    this.scene.start("MonsterCemeteryScene", {
      deceasedMonsters: this.deceasedMonsters,
    });
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
      inventory: this.inventory,
      playerCoins: this.playerCoins,
      playerName: this.playerName,
      ranchName: this.ranchName,
      selectedMonster: this.monster, // Pass the monster if needed
      monsterType: this.monsterType,
      ranchLocation: this.ranchLocation,
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
