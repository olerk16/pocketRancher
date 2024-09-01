// src/scenes/MarketBazaarScene.js

import { createButton, createImageButton } from "../utils/uiUtils.js";
import Items from "../models/Items.js";

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
    this.createInventoryWindow();
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
  createInventoryWindow() {
    // Create the inventory container
    const inventoryContainer = this.add.container(100, 100);

    // Define the grid dimensions
    const columns = 5; // Number of columns in the grid
    const rows = 1; // Number of rows in the grid (can be adjusted)
    const slotSize = 100; // Size of each inventory slot (width and height)
    const padding = 10; // Space between slots

    // Create the inventory slots
    const items = [
      Items.Potato,
      Items.Steak,
      Items.ToyShaker,
      Items.Flowers,
      Items.MedicBag,
    ];
    let itemIndex = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = col * (slotSize + padding);
        const y = row * (slotSize + padding);

        // Create a slot (rectangle)
        const slot = this.add
          .rectangle(x, y, slotSize, slotSize, 0xCAA01E, 0.5)
          .setStrokeStyle(2, 0x8B4513)
          .setOrigin(0);

        // Add the slot to the container
        inventoryContainer.add(slot);

        // Check if there is an item for this slot
        if (itemIndex < items.length) {
          const item = items[itemIndex];
          // Create the item image and center it in the slot
          const itemImage = this.add
            .image(x + slotSize / 2, y + slotSize / 2, item.name)
            .setDisplaySize(75, 75) // Scale the item to fit the slot
            .setInteractive({ useHandCursor: true }) // Make it interactive
            .on("pointerdown", () => this.buyItem(item))
            .on("pointerover", () => this.showDescription(item))
            .on("pointerout", () => this.hideDescription());

          // Add the item to the container
          inventoryContainer.add(itemImage);

          itemIndex++;
        }
      }
    }
  }
  showDescription(item) {
    this.descriptionText.setText(item.description);

    // Calculate the position for bottom-right alignment
    const { width, height } = this.scale;
    const textWidth = this.descriptionText.width;
    const textHeight = this.descriptionText.height;

    this.descriptionText.setPosition(
      width - textWidth - 20,
      height - textHeight - 20
    );
    this.descriptionText.setVisible(true);
  }

  hideDescription() {
    this.descriptionText.setVisible(false);
  }
  buyItem(item) {
    // Clear previous text notification if it exists
    if (this.notificationText) {
      this.notificationText.destroy();
    }

    if (this.player.coins >= item.price) {
      this.player.coins -= item.price; // Deduct coins directly from the player object
      this.player.addItemToInventory(item); // Use player's method to add the item to inventory

      this.coinsText.setText("Coins: " + this.player.coins);// Update the display

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
