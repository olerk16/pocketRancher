// src/scenes/StartMenuScene.js

import Monsters from "../models/Monsters.js";
import { createButton } from "../utils/uiUtils.js"; // Import the utility function

class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartMenuScene" });
  }

  preload() {
    // Load any assets needed for the start menu here
    this.setImages();
  }

  create() {
    // Add title text
    this.add
      .text(400, 150, "Pocket Rancher", { fontSize: "32px", fill: "#FFF" })
      .setOrigin(0.5);

    // Create button for starting the game using the utility function
    createButton(this, 400, 300, "Start Game", () => {
      this.scene.start("PlayerSetupScene"); // start new player setup scene
    }).setOrigin(0.5);
  }

  setImages() {
    Object.values(Monsters).forEach((monster) => {
      this.load.image(
        monster.spriteKey,
        `assets/images/${monster.spriteKey}.png`
      );
    });
    this.load.image("character", `assets/images/trainer_0.png`);
    this.load.image("potato", "assets/images/items/potato.webp"); // Example item
    this.load.image("steak", "assets/images/items/steak.webp");
    this.load.image("toyShaker", "assets/images/items/toyShaker.webp");
    this.load.image("flowers", "assets/images/items/flowers.webp");
    this.load.image("medicBag", "assets/images/items/medicBag.webp");
    this.load.image("bazaar", "assets/images/backGrounds/bazaar.webp");
    this.load.image("freezer", "assets/images/backGrounds/freezer.webp");
    this.load.image(
      "portalBackground",
      "assets/images/backGrounds/portalBackground.webp"
    );
    this.load.image("cemetery", "assets/images/backGrounds/cemetery.webp");
    this.load.image("mapBackground", "assets/images/backGrounds/map.webp");
    this.load.image("battleButton", "assets/images/icons/battleButton.png");
    this.load.image("exitButton", "assets/images/icons/exitButton.webp");
    this.load.image(
      "grassLandRanch",
      "assets/images/backGrounds/grassLandRanch.webp"
    );
    this.load.image(
      "desertRanch",
      "assets/images/backGrounds/desertRanch.webp"
    );
    this.load.image(
      "mountainRanch",
      "assets/images/backGrounds/mountainRanch.webp"
    );
    this.load.image(
      "desertFight",
      "assets/images/backGrounds/desertFight.webp"
    );
  }
}

export default StartMenuScene;
