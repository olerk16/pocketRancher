// src/scenes/MarketBazaarScene.js

import { createButton } from "../utils/uiUtils.js";
import Item from "../models/Item.js";

class MarketBazaarScene extends Phaser.Scene {
  constructor() {
    super({ key: "MarketBazaarScene" });
  }
 init(data){
    this.playerCoins = data.playerCoins;
    this.inventory = data.inventory;
 }
  preload() {
    // // Load images for the market items
    this.load.image("potato", "assets/images/items/potato.webp"); // Example item
    this.load.image("steak", "assets/images/items/steak.webp"); // Example item
  }

  create() {
    // creating items here
    const potato = new Item(
      "Potato",
      5,
      "It is free for a reason",
      "assets/images/items/potato",
      40,
      -10,
      0,
      0
    );
    const meat = new Item(
      "Meat",
      100,
      "Can not beat a good steak",
      "assets/images/items/steak",
      100,
      40,
      0,
      0
    );

    const items = [potato, meat];

    // Display title text
    this.add
      .text(400, 50, "Market Bazaar", { fontSize: "32px", fill: "#FFF" })
      .setOrigin(0.5);

    // Display player's current coins
    this.coinsText = this.add.text(
      16,
      16,
      "Coins: " + this.playerCoins,
      { fontSize: "16px", fill: "#FFF" }
    );

    let hGap = 400;
    let vGap = 400;
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
    // Use createButton utility function to create a back button
    createButton(this, 700, 50, "Back", () => {
      this.scene.start("GameScene"); // Switch back to the game scene
    });
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
