// src/scenes/StartMenuScene.js

import { createButton } from "../utils/uiUtils.js"; // Import the utility function

class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartMenuScene" });
  }

  preload() {
    // Load any assets needed for the start menu here
    // this.load.image('startButtonBg', 'assets/images/startButton.png'); // Optional: background image for the button
    this.setImages();

    this.setRegistry();
  }

  create() {
    // Add title text
    this.add
      .text(400, 150, "Pocket Rancher", { fontSize: "32px", fill: "#FFF" })
      .setOrigin(0.5);

    // Create button for starting the game using the utility function
    createButton(this, 400, 300, "Start Game", () => {
      this.scene.start("PlayerSetupScene"); // start new player setup scene
    });
  }
  setRegistry() {
    this.registry.set("gold", 100);
    this.registry.set("inventory", []);
  }
  setImages() {
    this.load.image("potato", "assets/images/items/potato.webp"); // Example item
    this.load.image("steak", "assets/images/items/steak.webp"); // Example item
    this.load.image("bazaar", "assets/images/backGrounds/bazaar.webp");
  }
}

export default StartMenuScene;
