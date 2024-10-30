import Phaser from 'phaser';
import { createButton, createImageButton } from "../utils/uiUtils.js";
import { startJourney } from "../utils/startJourney.js";
import DropdownMenu from "../components/DropDownMenu.js";
import DisplayStatsComponent from "../components/DisplayStatsComponent.js";
import DialogComponent from '../components/DialogComponent.js';
import Monster from "../models/Monster.js";
import Player from '../models/Player.js';
import AutoSave from '../utils/autoSave.js';
import grassLandRanchImage from '../assets/images/backGrounds/grassLandRanch.webp';

console.log('grassLandRanchImage:', grassLandRanchImage);


export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  // Lifecycle Methods
  init(data) {
    this.player = Player.fromData(this, data.player);

    console.log('Received player data in GameScene:', this.player);

    if (this.player.activeMonster) {
      console.log('Active Monster Data:', this.player.activeMonster);
      this.activeMonster = Monster.fromData(this, this.player.activeMonster);
  
      // Update the player's activeMonster to the monster's _id
      this.player.activeMonster = this.activeMonster._id;
      console.log('Set player.activeMonster to:', this.player.activeMonster);
    } else {
      console.warn('No active monster found in player data.');
      this.activeMonster = null;
    }

    this.playerName = this.player.name;
    this.ranchName = this.player.ranchName;
    this.playerCoins = this.player.coins;
    this.inventory = this.player.inventory;
    this.ranchLocation = this.player.ranchLocation;

    this.dialog = null;

    console.log('Player object in GameScene:', this.player);

    if (this.activeMonster) {
      this.activeMonster.scene = this;
      if (!this.activeMonster.isFrozen) {
        this.activeMonster.setupTimers();
      }
    }
  }

  preload() {
    this.load.image('grassLandRanch', grassLandRanchImage);

    // this.load.image('grassLandRanch', '/assets/images/backGrounds/grassLandRanch.webp');
    // this.load.image('desertRanch', '/assets/images/backGrounds/desertRanch.webp');
    // this.load.image('mountainRanch', '/assets/images/backGrounds/mountainRanch.webp');
  
    if (this.activeMonster && this.activeMonster.imageURL) {
      console.log('Loading monster image:', this.activeMonster.imageURL);
      this.load.image(`${this.activeMonster.type}Sprite`, this.activeMonster.imageURL);
    }
  }

  create() {
    this.setBackgroundImage();
    this.addPlayerInfo();

    if (this.activeMonster) {
      this.addMonsterToScene();
      this.setupMovement();

      // Initialize MonsterStatsComponent for displaying stats
      this.monsterStatsComponent = new DisplayStatsComponent(this, this.activeMonster, this.player.coins, 16, 56);
    } else {
      console.log("No active monster to display or monster is frozen.");
    }

    this.createDropdownMenu();
    this.createInventoryWindow();

    // Initialize and start the autosave feature
    this.autoSave = new AutoSave(this, this.player);
    this.autoSave.startAutosave();

    // Adjust monster's happiness based on the selected location
    if (this.activeMonster && !this.activeMonster.isFrozen) {
      this.activeMonster.adjustHappinessByLocation(this.ranchLocation);
    }

    this.inventoryWindow.setVisible(false);
  }

  update(time, delta) {
    if (this.activeMonster && !this.activeMonster.isFrozen) {
      // Update monster's position
      this.activeMonster.updatePosition(delta);
      // Optionally update the display if necessary
      // this.activeMonster.updateDisplay();
    }
  }

  // Helper Methods
  setBackgroundImage() {
    console.log(this.ranchLocation, "ranch location")
    const backgroundImages = {
      grassLand: "grassLandRanch",
      desert: "desertRanch",
      mountain: "mountainRanch",
    };
    const backgroundImageKey = backgroundImages[this.ranchLocation];
    console.log(backgroundImageKey, "background key")
    if (backgroundImageKey) {
      this.currentBackground = this.add
        .image(400, 300, backgroundImageKey)
        .setOrigin(0.5);
      this.currentBackground.displayWidth = this.sys.game.config.width;
      this.currentBackground.displayHeight = this.sys.game.config.height;
    } else {
      console.warn('No background image key found for ranch location:', this.ranchLocation);
    }
  }

  addPlayerInfo() {
    this.add.text(16, 16, `Player: ${this.playerName}`, { fontSize: "16px", fill: "#FFF" });
    this.add.text(16, 36, `Ranch: ${this.ranchName}`, { fontSize: "16px", fill: "#FFF" });
  }

  addMonsterToScene() {
    if (this.activeMonster && !this.activeMonster.isFrozen) {
      this.activeMonster.sprite = this.add.image(400, 300, `${this.activeMonster.type}Sprite`);
      this.activeMonster.sprite.setScale(0.5);
    }
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

  createDropdownMenu() {
    const canAccessPortal = !this.activeMonster || this.activeMonster.isFrozen;

    const menuItems = [
      { text: "Feed", onClick: () => this.toggleInventory() },
      { text: "Play", onClick: () => this.activeMonster && !this.activeMonster.isFrozen && this.activeMonster.play() },
      { text: "Sleep", onClick: () => this.activeMonster && !this.activeMonster.isFrozen && this.activeMonster.sleep() },
      { text: "Go to Market", onClick: () => this.goToMarket() },
      { text: "Use Item", onClick: () => this.useItem() },
      { text: "Journey", onClick: () => startJourney(this, this.activeMonster, this.dropdownMenu, this.monsterStatsComponent, this.player) },
      { text: "View Map", onClick: () => this.viewMap() },
      { text: "Cemetery", onClick: () => this.viewCemetery() },
      { text: "Monster Freezer", onClick: () => this.goToFreezer() },
      {
        text: "Monster Portal",
        onClick: () => {
          if (canAccessPortal) {
            this.goToMonsterPortal();
          } else {
            console.log("All monsters must be frozen before accessing the portal.");
            this.showErrorDialog("Freeze all monsters before accessing the portal.");
          }
        },
      },
    ];

    this.dropdownMenu = new DropdownMenu(this, menuItems);
  }

  createInventoryWindow() {
    const windowHeight = this.scale.height;
    const windowWidth = this.scale.width;
    const inventoryWidth = windowWidth - 100;

    this.inventoryWindow = this.add.container(50, windowHeight - 100);

    const background = this.add
      .rectangle(0, 0, windowWidth - 100, 100, 0x000000, 0.5)
      .setOrigin(0);

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

  populateInventorySlots() {
    this.inventorySlot = [];

    for (let i = 0; i < this.inventory.length; i++) {
      const item = this.inventory[i];
      const slot = createImageButton(
        this,
        30 + i * 55,
        50,
        item.name,
        () => this.activeMonster.feed(i, slot, this.inventory, this),
        50,
        50
      );

      this.inventorySlot.push(slot);
      this.inventoryWindow.add(slot);
    }
  }

  resetInventorySlots() {
    if (this.inventorySlot) {
      this.inventorySlot.forEach(slot => slot.destroy());
    }

    this.inventorySlot = [];
    this.populateInventorySlots();
  }

  toggleInventory() {
    const isVisible = this.inventoryWindow.visible;
    this.inventoryWindow.setVisible(!isVisible);
  }

  goToMarket() {
    this.scene.start("MarketBazaarScene", {
      player: this.player,
    });
  }

  goToFreezer() {
    this.scene.start('FreezerScene', { player: this.player });
  }

  goToMonsterPortal() {
    this.scene.start('MonsterPortalScene');
  }

  viewCemetery() {
    this.scene.start("MonsterCemeteryScene", {
      deceasedMonsters: this.deceasedMonsters,
    });
  }

  viewMap() {
    this.scene.start("MapScene");
  }

  showErrorDialog(message) {
    if (this.dialog) {
      this.dialog.destroy();
    }

    this.dialog = new DialogComponent(this, 400, 300, 400, 150, message, 'character');
    this.dialog.showDialog(message);

    this.time.delayedCall(3000, () => {
      if (this.dialog) {
        this.dialog.hideDialog();
      }
    });
  }

  shutdown() {
    if (this.dropdownMenu) {
      this.dropdownMenu.removeMenu();
    }
  }

  useItem() {
    if (this.inventory.length > 0 && this.activeMonster && !this.activeMonster.isFrozen) {
      const item = this.inventory.pop();
      // Apply item effects to monster stats
      if (item.name === "apple") {
        this.activeMonster.updateStat("hunger", -20);
      } else if (item.name === "toy") {
        this.activeMonster.updateStat("happiness", 30);
      }
      this.activeMonster.updateDisplay();
    } else {
      alert("Inventory is empty or no active monster available!");
    }
  }
}