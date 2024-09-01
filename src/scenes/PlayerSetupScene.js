// src/scenes/PlayerSetupScene.js
import { createButton } from "../utils/uiUtils.js"; // Import the utility function
import Monster from "../models/Monster.js";
import Monsters from "../models/Monsters.js"; // Import the Monsters object
import Player from "../models/Player.js";
import InputComponent from "../components/InputComponent.js";
import RanchLocationDropdown from "../components/RanchLocationDropdown.js"; // Import the new RanchLocationDropdown component


class PlayerSetupScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayerSetupScene" });
  }

  preload() {
     // Load assets for the player setup scene dynamically based on Monsters object
     Object.values(Monsters).forEach(monster => {
      this.load.image(monster.spriteKey, `assets/images/${monster.spriteKey}.png`);
    });
  }

  create() {
    // Initialize player instance
    this.player = new Player("", ""); // Initialize with empty names, will be set by input fields

    // Add instructions text
    this.add
      .text(400, 100, "Set up your player and ranch", {
        fontSize: "24px",
        fill: "#FFF",
      })
      .setOrigin(0.5);

    // Create input fields using the new InputComponent
    this.setupInputFields();

    // Create dropdown for ranch location using the new RanchLocationDropdown component
    new RanchLocationDropdown(this, this.player);

    // Automatically assign a random monster
    this.assignRandomMonster();

    // Create a button to confirm the setup and start the game
    createButton(this, 400, 400, "Start Game", () => this.startGame());
  }

  setupInputFields() {
    // Use InputComponent to create player and ranch name input fields
    this.inputComponent = new InputComponent(this, [
      {
        placeholder: "Enter your name",
        top: "150px",
        left: "400px",
        onChange: (value) => this.player.updatePlayerName(value), // Update player name
      },
      {
        placeholder: "Enter your ranch name",
        top: "200px",
        left: "400px",
        onChange: (value) => this.player.updateRanchName(value), // Update ranch name
      },
      {
        placeholder: "Enter your monster's name",
        top: "400px",
        left: "400px",
        onChange: (value) => (this.monsterName = value), // Update monster name
      },
    ]);
  }

  assignRandomMonster() {
    // Get a random monster from the Monsters object
    const monsterTypes = Object.keys(Monsters);
    this.selectedMonsterType = Phaser.Utils.Array.GetRandom(monsterTypes);
    console.log(`Assigned Random Monster: ${this.selectedMonsterType}`);
  }

  startGame() {
    if (this.player.name && this.player.ranchName && this.selectedMonsterType && this.monsterName) {
      this.player.addMonster(this.selectedMonsterType, this.monsterName); // Add the monster to the player

      console.log(
        `Player Name: ${this.player.name}, Ranch Name: ${this.player.ranchName}, Monster: ${this.selectedMonsterType}, Location: ${this.player.ranchLocation}`
      );

     // Pass only the player object to the next scene
    this.scene.start("GameScene", { player: this.player });
  } else {
    alert("Please enter your name, ranch name, and select a monster.");
  }
  }
}

export default PlayerSetupScene;