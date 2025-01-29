import Phaser from 'phaser';
import { createButton } from "../utils/uiUtils.js";
import Items from "../models/Items.js";
import { InventoryComponent } from "../components/InventoryComponent.js";
import Offerings from "../models/Offerings.js";
import { ItemInventoryComponent } from '../components/ItemInventoryComponent.js';
import DropdownMenu from '../components/DropDownMenu.js';
import { GameInventoryComponent } from '../components/GameInventoryComponent.js';

export default class MarketBazaarScene extends Phaser.Scene {
  constructor() {
    super({ key: "MarketBazaarScene" });
  }

  init(data) {
    // Receive the player object from the previous scene
    this.player = data.player;

    // Use player data to initialize the scene
    this.playerCoins = this.player.coins;
    this.inventory = this.player.inventory;
  }

  create() {
    // Add the background image to the game
    this.add.image(400, 300, "bazaar");

    // Create description text
    this.descriptionText = this.add
      .text(10, 10, "", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#8B4513",
        padding: { x: 10, y: 5 },
        wordWrap: { width: 300, useAdvancedWrap: true },
      })
      .setVisible(false);

    this.createSceneTitle();

    // Create shop inventory
    const marketItems = [
      ...Object.values(Items),
    ];

    // Create shop inventory component
    this.shopInventory = new ItemInventoryComponent(
      this,
      100,
      100,
      600,
      400,
      marketItems,
      80,
      20,
      0x8b4513,
      0x334321,
      this.buyItem.bind(this),
      this.showInfo.bind(this),
      this.hideInfo.bind(this)
    );

    // Create player's inventory component
    this.playerInventory = new GameInventoryComponent(
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
      this.sellItem.bind(this),
      this.showInfo.bind(this),
      this.hideInfo.bind(this)
    );
    this.playerInventory.setVisible(false); // Start hidden

    // Display player's coins
    this.coinsText = this.add.text(16, 16, "Coins: " + this.playerCoins, {
      fontSize: "16px",
      fill: "#FFF",
    });

    // Create dropdown menu
    this.createDropdownMenu();
  }

  createSceneTitle() {
    this.add.text(400, 50, 'Market Bazaar', {
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
  }

  createDropdownMenu() {
    const menuItems = [
        { text: "Toggle Inventory", onClick: () => this.toggleInventory() },
        { text: "Back to Ranch", onClick: () => this.handleSceneTransition('GameScene') }
    ];

    this.dropdownMenu = new DropdownMenu(this, menuItems);
  }

  toggleInventory() {
    if (this.playerInventory) {
        this.playerInventory.toggle();
        this.hideInfo();
    }
  }

  buyItem(item) {
    if (item.price <= this.player.coins) {
        this.player.coins -= item.price;
        this.inventory.push(item);
        
        // Update displays
        this.coinsText.setText("Coins: " + this.player.coins);
        // Update the player's inventory component
        if (this.playerInventory) {
            this.playerInventory.updateInventory(this.player.inventory);
        }
        
        this.showNotification(`You have bought ${item.name}`);
    } else {
        this.showNotification("Not enough coins");
    }
  }

  sellItem(item) {
    // Add sell logic here
    const sellPrice = Math.floor(item.price * 0.5); // Sell for half the buy price
    this.player.coins += sellPrice;
    
    // Remove item from inventory
    const index = this.player.inventory.indexOf(item);
    if (index > -1) {
      this.player.inventory.splice(index, 1);
    }
    
    // Update displays
    this.coinsText.setText("Coins: " + this.player.coins);
    this.playerInventory.updateInventory(this.player.inventory);
    this.showNotification(`Sold ${item.name} for ${sellPrice} coins`);
  }

  showNotification(message) {
    // Calculate the position for the bottom-center of the screen
    const x = this.scale.width / 2;
    const y = this.scale.height - 75; // 75 pixels above the bottom of the screen

    // Create the text object for the notification
    const notification = this.add.text(x, y, message, {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5, 1); // Center the text horizontally and align it to the bottom

    // Fade out and destroy the notification after 3 seconds
    this.tweens.add({
      targets: notification,
      alpha: 0, // Fade out to transparency
      duration: 2000, // Fade out over 2 seconds
      delay: 1000, // Wait 1 second before starting the fade
      onComplete: () => {
        notification.destroy(); // Remove the notification from the scene
      },
    });
  }

  showInfo(item) {
    // Update the text content
    this.descriptionText.setText(item.description);

    // Get the width and height of the game canvas
    const { width, height } = this.scale;

    // Calculate the position for the bottom-right corner
    const textWidth = this.descriptionText.width;
    const textHeight = this.descriptionText.height;

    const posX = width - textWidth - 20; // 20px padding from the right
    const posY = height - textHeight - 20; // 20px padding from the bottom

    // Set the position of the text
    this.descriptionText.setPosition(posX, posY);

    // Make the text visible
    this.descriptionText.setVisible(true);
  }

  hideInfo() {
    // Hide the description text
    this.descriptionText.setVisible(false);
  }

  goBackToGame() {
    // Save current monster stats before transitioning
    if (this.player.activeMonster) {
      // Update the monster's currentStats
      this.player.activeMonster.currentStats = {
        hunger: this.player.activeMonster.hunger,
        happiness: this.player.activeMonster.happiness,
        energy: this.player.activeMonster.energy,
        hygiene: this.player.activeMonster.hygiene,
        lifeSpan: this.player.activeMonster.lifeSpan
      };

      // Clear timers before transition
      this.player.activeMonster.clearTimers();
    }

    // Make sure to pass complete player data
    const playerData = this.player.toJSON();
    console.log('Transitioning to GameScene with player data:', playerData);
    
    this.scene.start('GameScene', { player: playerData });
  }

  handleSceneTransition(targetScene, extraData = {}) {
    const sceneData = {
      ...(this.player && { player: this.player.toJSON() }),
      ...extraData
    };
    this.scene.start(targetScene, sceneData);
  }

  cleanup() {
    if (this.shopInventory) {
      this.shopInventory.destroy();
    }
    if (this.playerInventory) {
      this.playerInventory.destroy();
    }
    if (this.descriptionText) {
      this.descriptionText.destroy();
    }
    if (this.dropdownMenu) {
      this.dropdownMenu.removeMenu();
    }
  }
}
