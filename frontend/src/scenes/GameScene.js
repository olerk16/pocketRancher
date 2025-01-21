import BaseScene from './BaseScene';
import { createButton, createImageButton } from "../utils/uiUtils.js";
import { startJourney } from "../utils/startJourney.js";
import DropdownMenu from "../components/DropDownMenu.js";
import DisplayStatsComponent from "../components/DisplayStatsComponent.js";
import DialogComponent from '../components/DialogComponent.js';
import Monster from "../models/Monster.js";
import Player from '../models/Player.js';
import AutoSave from '../utils/autoSave.js';
import { GameInventoryComponent } from '../components/GameInventoryComponent.js';

export default class GameScene extends BaseScene {
  constructor() {
    super('GameScene');
    this.activeMonster = null;
    this.monsterStatsComponent = null;
    this.inventoryComponent = null;
    this.dropdownMenu = null;
    this.dialog = null;
    this.autoSave = null;
    this.descriptionText = null;
  }

  getBackgroundKey() {
    return this.ranchLocation ? `${this.ranchLocation}Ranch` : 'grassLandRanch';
  }

  init(data) {
    this.initializePlayer(data);
    this.initializeMonster();
  }

  initializePlayer(data) {
    console.log('GameScene init with data:', data);
    this.player = Player.fromData(this, data.player);
    
    // Initialize scene properties from player data
    this.playerName = this.player.name;
    this.ranchName = this.player.ranchName;
    this.playerCoins = this.player.coins;
    this.inventory = this.player.inventory;
    this.ranchLocation = this.player.ranchLocation;
    
    console.log('Player object in GameScene:', this.player);
  }

  initializeMonster() {
    if (this.player.activeMonster) {
      console.log('Active Monster Data:', this.player.activeMonster);
      
      this.activeMonster = Monster.fromData(this, {
        ...this.player.activeMonster,
        currentStats: this.player.activeMonster.currentStats
      });
      
      this.activeMonster.scene = this;
      this.scene.player = this.player;
      this.player.activeMonster = this.activeMonster;
      
      if (!this.activeMonster.isFrozen) {
        this.activeMonster.setupTimers();
      }
      
      console.log('Initialized monster with stats:', this.activeMonster.currentStats);
    } else {
      console.warn('No active monster found in player data.');
      this.activeMonster = null;
    }
  }

  setupSceneContent() {
    this.addPlayerInfo();
    this.setupMonster();
    this.createDropdownMenu();
    this.createInventoryWindow();
    this.setupAutoSave();
    this.adjustMonsterHappiness();
  }

  addPlayerInfo() {
    this.add.text(16, 16, `Player: ${this.playerName}`, { fontSize: "16px", fill: "#FFF" });
    this.add.text(16, 36, `Ranch: ${this.ranchName}`, { fontSize: "16px", fill: "#FFF" });
  }

  setupMonster() {
    if (!this.activeMonster) return;

    this.addMonsterToScene();
    
    if (!this.activeMonster.isFrozen) {
      this.setupMovement();
      this.setupMonsterStats();
    }
  }

  preload() {
    console.log('🎮 GameScene preload starting...');
    
    // Load ranch backgrounds
    this.load.image('grassLandRanch', '/assets/images/backGrounds/grassLandRanch.webp');
    this.load.image('desertRanch', '/assets/images/backGrounds/desertRanch.webp');
    this.load.image('mountainRanch', '/assets/images/backGrounds/mountainRanch.webp');

    // Load monster image if we have an active monster
    if (this.player?.activeMonster) {
        const monsterKey = `monster_${this.player.activeMonster._id}`;
        if (!this.textures.exists(monsterKey)) {
            console.log('Loading monster image:', this.player.activeMonster.imageURL);
            this.load.image(monsterKey, this.player.activeMonster.imageURL);
        }
    }
  }

  create() {
    this.setBackgroundImage();
    this.setupSceneContent();

    if (this.inventoryComponent) {
        this.inventoryComponent.toggle();
    }
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
    console.log('Setting background for location:', this.ranchLocation);
    
    const backgroundImages = {
        grassLand: 'grassLandRanch',
        desert: 'desertRanch',
        mountain: 'mountainRanch'
    };

    const backgroundImageKey = backgroundImages[this.ranchLocation];
    console.log('Using background key:', backgroundImageKey);

    if (backgroundImageKey && this.textures.exists(backgroundImageKey)) {
        this.currentBackground = this.add
            .image(400, 300, backgroundImageKey)
            .setOrigin(0.5)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        console.log('✅ Background set successfully');
    } else {
        console.warn('❌ Background not found:', backgroundImageKey);
        console.log('Available textures:', Object.keys(this.textures.list));
    }
  }

  addMonsterToScene() {
    if (!this.activeMonster) return;

    // Clear any existing sprite
    if (this.activeMonster.sprite) {
        this.activeMonster.sprite.destroy();
        this.activeMonster.sprite = null;
    }

    // Create new sprite
    const monsterKey = `monster_${this.activeMonster._id}`;
    this.activeMonster.sprite = this.add.image(400, 300, monsterKey);
    this.activeMonster.sprite.setScale(0.5);
    
    if (!this.activeMonster.isFrozen) {
        this.activeMonster.sprite.setVisible(true);
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
    
    this.inventoryComponent = new GameInventoryComponent(
        this,
        550,    // x position
        50,     // y position
        220,    // width
        400,    // height
        this.player.inventory,
        70,     // slot size
        15,     // padding
        0x2c3e50,  // background color
        0x3498db,  // border color
        this.useItem.bind(this),
        this.showItemInfo.bind(this),
        this.hideItemInfo.bind(this)
    );

    // Set initial visibility to false
    if (this.inventoryComponent) {
        this.inventoryComponent.setVisible(false);
    }
  }

  toggleInventory() {
    this.inventoryComponent.toggle();
  }

  goToMarket() {
    this.handleSceneTransition("MarketBazaarScene");
  }

  goToFreezer() {
    this.handleSceneTransition("FreezerScene");
  }

  goToMonsterPortal() {
    this.handleSceneTransition("MonsterPortalScene");
  }

  viewCemetery() {
    this.handleSceneTransition("MonsterCemeteryScene");
  }

  viewMap() {
    this.handleSceneTransition("MapScene");
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
    this.cleanup();
    if (this.dropdownMenu) {
      this.dropdownMenu.removeMenu();
    }
    super.shutdown();
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

  cleanup() {
    this.cleanupMonster();
    this.cleanupComponents();
  }

  cleanupMonster() {
    if (this.activeMonster?.sprite) {
      this.activeMonster.sprite.destroy();
    }
    
    if (this.activeMonster?._id) {
      const monsterKey = `monster_${this.activeMonster._id}`;
      if (this.textures.exists(monsterKey)) {
        this.textures.remove(monsterKey);
      }
    }
  }

  cleanupComponents() {
    if (this.monsterStatsComponent) {
      this.monsterStatsComponent.destroy();
    }
    if (this.dropdownMenu) {
      this.dropdownMenu.removeMenu();
    }
    if (this.dialog) {
      this.dialog.destroy();
    }
    if (this.inventoryComponent) {
      this.inventoryComponent.destroy();
    }
  }

  onMonsterDeath(monster) {
    if (this.activeMonster === monster) {
      this.activeMonster = null;
    }

    if (this.monsterStatsComponent) {
      this.monsterStatsComponent.destroy();
      this.monsterStatsComponent = null;
    }

    this.showErrorDialog(`${monster.name} has passed away.`);

    if (this.autoSave) {
      this.autoSave.saveGameState();
    }
  }

  setupMonsterStats() {
    this.monsterStatsComponent = new DisplayStatsComponent(
      this, 
      this.activeMonster, 
      this.player.coins, 
      16, 
      56
    );
    
    this.activeMonster.setDisplayStatsComponent(this.monsterStatsComponent);
  }

  setupAutoSave() {
    this.autoSave = new AutoSave(this, this.player);
    this.autoSave.startAutosave();
  }

  adjustMonsterHappiness() {
    if (this.activeMonster && !this.activeMonster.isFrozen) {
      this.activeMonster.adjustHappinessByLocation(this.ranchLocation);
    }
  }

  handleSceneTransition(targetScene, extraData = {}) {
    const sceneData = {
      player: this.player,
      ...extraData
    };
    this.scene.start(targetScene, sceneData);
  }

  showItemInfo(item) {
    if (this.descriptionText) {
        this.descriptionText.destroy();
    }

    this.descriptionText = this.add.text(10, 10, item.description, {
        fontSize: '16px',
        fill: '#ffffff',
        backgroundColor: '#2c3e50',
        padding: { x: 10, y: 5 },
        wordWrap: { width: 300, useAdvancedWrap: true }
    });
  }

  hideItemInfo() {
    if (this.descriptionText) {
        this.descriptionText.destroy();
        this.descriptionText = null;
    }
  }
}