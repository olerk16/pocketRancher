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
    this.inventoryComponent = new InventoryComponent(
      this,
      100,
      100,
      620,
      150,
      items,
      100,
      20,
      0x8b4513,
      0x334321
    );
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
  createSceneTitle() {
    // Text properties
    const textContent = "Market Bazaar";
    const textStyle = { fontSize: "32px", fill: "#FFF" };

    // Create the text object
    const text = this.add.text(400, 50, textContent, textStyle).setOrigin(0.5); // Center the text origin

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
    graphics.fillStyle(0x8b4513, 1); // Brown color
    graphics.lineStyle(4, 0x000000, 1); // Optional: black border

    // Draw the rounded rectangle
    graphics.fillRoundedRect(x, y, textWidth, textHeight, cornerRadius);
    graphics.strokeRoundedRect(x, y, textWidth, textHeight, cornerRadius);

    // Bring the text to the top so it appears above the rectangle
    text.setDepth(1);
  }
  buyItem(item) {
    if (item.price <= this.player.coins) {
      this.player.coins -= item.price;
      this.inventory.push(item);
      this.coinsText.text = this.player.coins;
      this.showNotification(`You have bought ${item.name}`);
    }
    else{
    this.showNotification("Not enough coins");
    }
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
}

export default MarketBazaarScene;
