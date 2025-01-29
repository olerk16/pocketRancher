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
import StatusEffectsComponent from '../components/StatusEffectsComponent.js';
import PlayerInfoComponent from '../components/PlayerInfoComponent.js';
import Offerings from '../models/Offerings.js';

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
    this.statusEffectsComponent = null;
    this.playerInfoComponent = null;
  }

  getBackgroundKey() {
    console.log('Getting background for location:', this.player?.ranchLocation);
    const location = this.player?.ranchLocation || 'grassLand';
    return `${location}Ranch`;
  }

  init(data) {
    console.log('GameScene init with data:', data);
    if (data && data.player) {
        this.player = Player.fromData(this, data.player);
        console.log('Player initialized with location:', this.player.ranchLocation);
    } else {
        console.error('No player data provided to GameScene');
    }
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
    this.createPlayerInfo();
    this.setupMonster();
    this.createDropdownMenu();
    this.createInventoryWindow();
    this.setupAutoSave();
    this.adjustMonsterHappiness();
    
    // Show welcome dialog only for new players who haven't seen it
    if (!this.player.activeMonster && 
        this.player.inventory.length === 0 && 
        !this.player.hasSeenWelcome) {
        this.showWelcomeDialog();
    }
  }

  createPlayerInfo() {
    this.playerInfoComponent = new PlayerInfoComponent(this, this.player);
  }

  setupMonster() {
    if (!this.activeMonster) return;

    this.addMonsterToScene();
    
    if (!this.activeMonster.isFrozen) {
      this.setupMovement();
      this.setupMonsterStats();
      this.setupStatusEffects();
    }
  }

  preload() {
    super.preload();

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
    super.create();
    this.setBackground();
    this.setupSceneContent();
  }

  update(time, delta) {
    if (this.activeMonster && !this.activeMonster.isFrozen) {
      // Update monster's position
      this.activeMonster.updatePosition(delta);
      if (this.statusEffectsComponent) {
        this.statusEffectsComponent.updateEffects();
      }
    }
  }

  // Helper Methods
  setBackground() {
    const bgKey = this.getBackgroundKey();
    console.log('Setting background with key:', bgKey);
    
    if (this.textures.exists(bgKey)) {
        if (this.background) {
            this.background.destroy();
        }
        this.background = this.add.image(400, 300, bgKey)
            .setOrigin(0.5)
            .setDisplaySize(800, 600);
    } else {
        console.error(`Background image not found for key: ${bgKey}`);
        // Fallback to a default color if image not found
        this.cameras.main.setBackgroundColor('#2d572c');
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
      { text: "Inventory", onClick: () => this.toggleInventory() },
      { text: "Health Status", onClick: () => this.toggleStats() },
      { text: "Play", onClick: () => this.activeMonster && !this.activeMonster.isFrozen && this.activeMonster.play() },
      { text: "Sleep", onClick: () => this.activeMonster && !this.activeMonster.isFrozen && this.activeMonster.sleep() },
      { text: "Go to Market", onClick: () => this.goToMarket() },
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
    this.inventoryComponent = new GameInventoryComponent(
        this,
        0,
        0,
        600,
        80,
        this.player.inventory,
        60,
        10,
        0x2c3e50,
        0x3498db,
        this.useItem.bind(this),
        this.showItemInfo.bind(this),
        this.hideItemInfo.bind(this)
    );
  }

  toggleInventory() {
    if (this.inventoryComponent) {
        this.inventoryComponent.toggle();
        this.hideItemInfo();
    }
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

    this.dialog = new DialogComponent(this, 400, 300, 400, 150, message, 'trainerDave');
    this.dialog.showDialog(message);
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
    if (this.statusEffectsComponent) {
      this.statusEffectsComponent.destroy();
    }
    if (this.playerInfoComponent) {
      this.playerInfoComponent.destroy();
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
    // Center horizontally and place under status effects
    const centerX = this.scale.width / 2 - 160;  // Half of component width (320)
    const topY = 60;  // Below status effects (20 + 30 + 10 padding)

    this.monsterStatsComponent = new DisplayStatsComponent(
        this, 
        this.activeMonster, 
        this.player.coins, 
        centerX,
        topY,
        false  // Start hidden
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

  toggleStats() {
    if (this.monsterStatsComponent) {
        this.monsterStatsComponent.toggle();
    }
  }

  setupStatusEffects() {
    // Center horizontally and place at top
    const centerX = this.scale.width / 2 - 200;  // Half of component width (400)
    const topY = 20;  // Small gap from top

    this.statusEffectsComponent = new StatusEffectsComponent(
        this,
        this.activeMonster,
        centerX,
        topY
    );
  }

  showWelcomeDialog() {
    const welcomeMessage = "Welcome to Monster Ranch! 🎉\n\nTo help you get started, here's a Starter Egg. Use it to summon your first monster companion!\n\nClick 'OK' to receive your gift.";
    
    this.dialog = new DialogComponent(
        this,
        400,
        300,
        400,
        200,
        welcomeMessage,
        'trainerDave'
    );

    // Add custom OK button
    const okButton = this.add.text(400, 380, 'OK', {
        fontSize: '20px',
        fill: '#ffffff',
        backgroundColor: '#2ecc71',
        padding: { x: 20, y: 10 },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
        this.giveStarterOffering();
        this.dialog.hideDialog();
        okButton.destroy();
        // Mark welcome as seen
        this.player.hasSeenWelcome = true;
    });

    this.dialog.showDialog();
  }

  async giveStarterOffering() {
    try {
        // Get the starter offering from Offerings model
        const starterOffering = Offerings.STARTER_EGG;

        // Add to player's inventory
        this.player.addItemToInventory(starterOffering);
        
        // Update inventory display
        if (this.inventoryComponent) {
            this.inventoryComponent.updateInventory(this.player.inventory);
        }

        // Show tutorial message about using the offering
        const tutorialMessage = "Great! You received a Starter Egg!\n\n1. Click 'Monster Portal' in the dropdown menu\n2. Open your inventory\n3. Use the Starter Egg to summon your companion!";
        
        this.dialog = new DialogComponent(
            this,
            400,
            300,
            400,
            200,
            tutorialMessage,
            'trainerDave'
        );
        this.dialog.showDialog();

        // Auto-hide tutorial after 8 seconds
        this.time.delayedCall(8000, () => {
            if (this.dialog) {
                this.dialog.hideDialog();
            }
        });

    } catch (error) {
        console.error('Error giving starter offering:', error);
        this.showErrorDialog('There was an error giving your starter offering. Please try reloading the game.');
    }
  }
}