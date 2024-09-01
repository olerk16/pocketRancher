// src/scenes/MarketBazaarScene.js

import { createButton, createImageButton } from "../utils/uiUtils.js";
import Items from "../models/Items.js";
import { InventoryComponent } from "../components/InventoryComponent.js";

class MarketBazaarScene extends Phaser.Scene {
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
  preload() {
    // // Load images for the market items
    // background

  }

  create() {
    // Add the background image to the game
    this.add.image(400, 300, "bazaar");

    // Create a text object to display the item description
    this.descriptionText = this.add
      .text(10, 10, "", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#8B4513",
        padding: { x: 10, y: 5 },
        wordWrap: { width: 300, useAdvancedWrap: true },
      })
      .setVisible(false); // Initially hidden

    this.createSceneTitle();
    // creating items here
    const items = [
      Items.Potato,
      Items.Steak,
      Items.ToyShaker,
      Items.Flowers,
      Items.MedicBag,
    ];
    this.inventoryComponent = new InventoryComponent(this, 100, 100, 600, 150, items);;
    // Display player's current coins
    this.coinsText = this.add.text(16, 16, "Coins: " + this.playerCoins, {
      fontSize: "16px",
      fill: "#FFF",
    });
    // Use createButton utility function to create a back button
    createButton(this, 700, 50, "Back", () => {
      this.scene.start("GameScene", {
        player: this.player, // Pass the player object back to the GameScene
      }); 
    });
  }
  createSceneTitle(){
    // Text properties
    const textContent = "Market Bazaar";
    const textStyle = { fontSize: "32px", fill: "#FFF" };
    
    // Create the text object
    const text = this.add.text(400, 50, textContent, textStyle)
      .setOrigin(0.5); // Center the text origin

    // Calculate the size of the background based on the text size
    const padding = 20;
    const textWidth = text.width + padding;
    const textHeight = text.height + padding;

    // Create a graphics object to draw the rounded rectangle
    const graphics = this.add.graphics();

    // Define the rounded rectangle properties
    const x = text.x - textWidth / 2;
    const y = text.y - textHeight / 2;
    const cornerRadius = 20;

    // Set the fill color (brown) and line style if desired
    graphics.fillStyle(0x8B4513, 1); // Brown color
    graphics.lineStyle(4, 0x000000, 1); // Optional: black border

    // Draw the rounded rectangle
    graphics.fillRoundedRect(x, y, textWidth, textHeight, cornerRadius);
    graphics.strokeRoundedRect(x, y, textWidth, textHeight, cornerRadius);

    // Bring the text to the top so it appears above the rectangle
    text.setDepth(1);
  }
  buyItem(item){

    if(item.price <= this.player.coins){
      this.player.coins -= item.price;
      this.inventory.push(item);
    }
  }
}

export default MarketBazaarScene;
