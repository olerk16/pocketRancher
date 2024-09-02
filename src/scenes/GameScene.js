// src/scenes/GameScene.js

import { createButton, createImageButton } from "../utils/uiUtils.js"; // Import the utility functions
import { startJourney } from "../utils/startJourney.js"; // Import the startJourney function
import DropdownMenu from "../components/DropDownMenu.js"; // Import the DropdownMenu component
import DisplayStatsComponent from "../components/DisplayStatsComponent.js"; // Import the new component
import Monster from "../models/Monster.js";
import Monsters from "../models/Monsters.js"; // Import the Monsters object

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    this.player = data.player;
    this.playerName = this.player.name;
    this.ranchName = this.player.ranchName;
    this.playerCoins = this.player.coins;
    this.inventory = this.player.inventory;
    this.ranchLocation = this.player.ranchLocation;
    
    // Get the active monster from the player
    this.activeMonster = this.player.getActiveMonster();
    
    if (this.activeMonster) {
      this.activeMonster.scene = this; // Assign scene to monster if not already set
      if (!this.activeMonster.isFrozen) {
        this.activeMonster.setupTimers(); // Start timers again if the monster is unfrozen
      }
    }
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
    // Only add monster to the scene if it is not frozen
      if (this.activeMonster && !this.activeMonster.isFrozen) {
        this.addMonsterToScene();
        this.setupMovement();
    
    // Initialize MonsterStatsComponent for displaying stats
          this.monsterStatsComponent = new DisplayStatsComponent(this, this.activeMonster, this.player.coins, 16, 56);
        } else {
          console.log("No active monster to display or monster is frozen.");
        }
    
    
    this.createDropdownMenu();
    this.createInventoryWindow();

    // Adjust monster's happiness based on the selected location
    if (this.activeMonster && !this.activeMonster.isFrozen) {
      this.activeMonster.adjustHappinessByLocation(this.ranchLocation);
    }

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
    // Check if monsterInstance exists before accessing its properties
    if (this.activeMonster && !this.activeMonster.isFrozen) {
      this.activeMonster.sprite = this.add.image(400, 300, `${this.activeMonster.type}Sprite`);
      this.activeMonster.sprite.setScale(0.5);
    }
  }

  createDropdownMenu() {
    // Create dropdown menu with game actions
    this.dropdownMenu = new DropdownMenu(this, [
      { text: "Feed", onClick: () => this.toggleInventory() },
      { text: "Play", onClick: () => this.activeMonster && !this.activeMonster.isFrozen && this.activeMonster.play() },
      { text: "Sleep", onClick: () => this.activeMonster && !this.activeMonster.isFrozen && this.activeMonster.sleep() },
      { text: "Go to Market", onClick: () => this.goToMarket() },
      { text: "Use Item", onClick: () => this.useItem() },
      { text: "Journey", onClick: () => startJourney(this, this.activeMonster, this.dropdownMenu, this.monsterStatsComponent, this.player) }, // Updated call to startJourney
      { text: "View Map", onClick: () => this.viewMap() },
      { text: "Cemetery", onClick: () => this.viewCemetery() },
      { text: "Monster Portal", onClick: () => this.goToMonsterPortal() },
      { text: "Monster Freezer", onClick: () => this.goToFreezer() },
    ]);
  }

  goToFreezer() {
    this.scene.start('FreezerScene', { player: this.player });
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
    if (this.activeMonster && !this.activeMonster.isFrozen) {
      // Timer to change direction every 2 seconds
      this.time.addEvent({
        delay: 2000,
        callback: this.activeMonster.moveRandomly,
        callbackScope: this.activeMonster,
        loop: true,
      });
    }
  }

  update(time, delta) {
    if (this.activeMonster && !this.activeMonster.isFrozen) {
      // Call updatePosition to move the monster each frame
      this.activeMonster.updatePosition(delta);
      this.activeMonster.updateDisplay(); // Refresh the display of monster properties
    }
  }

  goToMarket() {
    // Switch to the market scene
    this.scene.start("MarketBazaarScene", {
      player: this.player,  // Pass the player object directly
    });
  }

  // Phaser method that is called when the scene is stopped
  shutdown() {
    this.dropdownMenu.removeMenu(); // Clean up when the scene shuts down
  }

  // Method to use an item from inventory
  useItem() {
    if (this.inventory.length > 0 && this.activeMonster && !this.activeMonster.isFrozen) {
      const item = this.inventory.pop(); // Remove the last item from inventory
      // Apply item effects to monster stats
      if (item === "apple") {
        this.activeMonster.updateStat("hunger", -20);
      } else if (item === "toy") {
        this.activeMonster.updateStat("happiness", 30);
      }
      this.activeMonster.updateDisplay(); // Update display after using item
    } else {
      alert("Inventory is empty or no active monster available!");
    }
  }
}

export default GameScene;