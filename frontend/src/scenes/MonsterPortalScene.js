import BaseScene from './BaseScene';
import { createButton } from '../utils/uiUtils.js';
import Monster from '../models/Monster.js';
import Player from '../models/Player.js';
import { MonsterSummoner } from '../services/MonsterSummoner.js';
import { GameInventoryComponent } from '../components/GameInventoryComponent.js';
import DropdownMenu from '../components/DropDownMenu.js';
import DialogComponent from '../components/DialogComponent.js';
import { StarterMonsterService } from '../services/StarterMonsterService.js';

export default class MonsterPortalScene extends BaseScene {
  constructor() {
    super('MonsterPortalScene');
    this.monsterSummoner = null;
    this.descriptionText = null;
    this.inventoryComponent = null;
    this.dropdownMenu = null;
    this.dialog = null;
    this.starterMonsterService = null;
  }

  getBackgroundKey() {
    return 'portalBackground';
  }

  init(data) {
    if (!data || !data.player) {
      console.error('No player data provided to MonsterPortalScene');
      return;
    }
    this.player = Player.fromData(this, data.player);
    console.log('MonsterPortalScene initialized with player:', this.player);
  }

  setupSceneContent() {
    this.createTitle();
    this.monsterSummoner = new MonsterSummoner(this);
    this.starterMonsterService = new StarterMonsterService(this);
    this.createInventoryWindow();
    this.createDropdownMenu();
    this.showInstructions();
  }

  createTitle() {
    this.add.text(400, 100, 'Monster Portal', { 
        fontSize: '32px', 
        fill: '#FFF' 
    }).setOrigin(0.5);
  }

  createDropdownMenu() {
    const menuItems = [
      { text: "Basic Summon", onClick: () => this.summonMonster() },
      { text: "Inventory", onClick: () => this.toggleInventory() },
      { text: "Back to Ranch", onClick: () => this.handleSceneTransition('GameScene') }
    ];

    this.dropdownMenu = new DropdownMenu(this, menuItems);
  }

  createInventoryWindow() {
    this.inventoryComponent = new GameInventoryComponent(
        this,
        0,
        0,
        600,    // width for 8 slots
        80,     // height for single row
        this.player.inventory,
        60,     // slot size
        10,     // padding
        0x2c3e50,  // background color
        0x3498db,  // border color
        this.useOffering.bind(this),
        this.showItemInfo.bind(this),
        this.hideItemInfo.bind(this)
    );
    this.inventoryComponent.setVisible(false);
  }

  async useOffering(offering) {
    try {
      if (offering.name === "Starter Egg") {
        await this.starterMonsterService.summonStarterMonster();
      } else {
        await this.monsterSummoner.summonMonster(offering);
      }
    } catch (error) {
      console.error('Error using offering:', error);
    }
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

  toggleInventory() {
    if (this.inventoryComponent) {
      this.inventoryComponent.toggle();
      this.hideItemInfo();
    }
  }

  async summonMonster(offering = null) {
    try {
      await this.monsterSummoner.summonMonster(offering);
    } catch (error) {
      console.error('Error during monster summoning:', error);
    }
  }

  showInstructions() {
    if (this.dialog) {
      this.dialog.destroy();
    }

    this.dialog = new DialogComponent(
      this,
      400,
      300,
      400,
      150,
      'Use offerings from your inventory to summon monsters',
      'trainerDave'
    );
    this.dialog.showDialog();

    // Hide dialog after 5 seconds
    this.time.delayedCall(5000, () => {
      if (this.dialog) {
        this.dialog.hideDialog();
      }
    });
  }

  cleanup() {
    if (this.inventoryComponent) {
      this.inventoryComponent.destroy();
    }
    if (this.descriptionText) {
      this.descriptionText.destroy();
    }
    if (this.dropdownMenu) {
      this.dropdownMenu.removeMenu();
    }
    if (this.dialog) {
      this.dialog.destroy();
    }
    super.cleanup();
  }

  update(time, delta) {
    // Update logic if needed
  }
}
