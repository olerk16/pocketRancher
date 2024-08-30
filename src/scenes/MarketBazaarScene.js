// src/scenes/MarketBazaarScene.js

import { createButton, createImageButton } from "../utils/uiUtils.js";
import Item from "../models/Item.js";

class MarketBazaarScene extends Phaser.Scene {
  constructor() {
    super({ key: "MarketBazaarScene" });
  }
  init(data) {
    this.playerName = data.playerName;
    this.ranchName = data.ranchName;
    this.monster = data.selectedMonster; // Use the passed monster instance
    this.monsterType = data.monsterType; // Use the passed monster type
    this.playerCoins = data.playerCoins;
    this.inventory = data.inventory;
    this.ranchLocation = data.ranchLocation;
  }
  preload() {
    // // Load images for the market items
     // background
    
  }

  create() {
    // Add the background image to the game
    this.add.image(400, 300, "bazaar");
    // creating items here
    this.addFoodButtons();
    // Display title text
    this.add
      .text(400, 50, "Market Bazaar", { fontSize: "32px", fill: "#FFF" })
      .setOrigin(0.5);

    // Display player's current coins
    this.coinsText = this.add.text(16, 16, "Coins: " + this.playerCoins, {
      fontSize: "16px",
      fill: "#FFF",
    });
    // Use createButton utility function to create a back button
    createButton(this, 700, 50, "Back", () => {
      this.scene.start("GameScene", {
        inventory: this.inventory,
        playerCoins: this.playerCoins,
        playerName: this.playerName,
        ranchName: this.ranchName,
        selectedMonster: this.monster, // Pass the monster if needed
        monsterType: this.monsterType,
        ranchLocation: this.ranchLocation,
      }); // Switch back to the game scene
    });
  }
  addFoodButtons(){
    const potato = new Item(
      "potato",
      5,
      "It is free for a reason",
      "assets/images/items/potato",
      40,
      -10,
      0,
      0
    );
    const steak = new Item(
      "steak",
      100,
      "Can not beat a good steak",
      "assets/images/items/steak",
      100,
      40,
      0,
      0
    );

    const items = [potato, steak];
    let hGap = 100;
    let vGap = 100;
    for (let i = 0; i < items.length; i++) {
      createButton(
        this,
        hGap,
        vGap,
        `Buy ${items[i].name} for ${items[i].price} gold`,
        () => this.buyItem(items[i])
      );
      hGap += 250;
    }
  }
  buyItem(item) {
    // Clear previous text notification if it exists
    if (this.notificationText) {
      this.notificationText.destroy();
    }

    if (this.playerCoins >= item.price) {
      this.playerCoins -= item.price;
      this.coinsText.setText("Coins: " + this.playerCoins);

      // Add the item to the player's inventory
      this.inventory.push(item);

      // Notify the player of the purchase
      this.notificationText = this.add
        .text(400, 300, `Bought ${item.name}!`, {
          fontSize: "16px",
          fill: "#FFF",
        })
        .setOrigin(0.5);
    } else {
      // Show message if player cannot afford the item
      this.notificationText = this.add
        .text(400, 300, "Not enough coins!", {
          fontSize: "16px",
          fill: "#FF0000",
        })
        .setOrigin(0.5);
    }
  }
}

export default MarketBazaarScene;
