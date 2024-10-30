import Phaser from 'phaser';
import { createButton } from "../utils/uiUtils.js"; // Import the utility function
import Player from "../models/Player.js";
import InputComponent from "../components/InputComponent.js";
import RanchLocationDropdown from "../components/RanchLocationDropdown.js"; // Import the new RanchLocationDropdown component
import DialogComponent from "../components/DialogComponent.js"; // Import the new DialogComponent

export default class PlayerSetupScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayerSetupScene" });
  }

  preload() {
    // Load assets for the player setup scene dynamically based on Monsters object
  }

  create() {
    // Initialize player instance
    this.player = new Player("", ""); // Initialize with empty names, will be set by input fields
    
    new RanchLocationDropdown(this, this.player);
    this.setupInputFields();

    // Create a button to confirm the setup and start the game
    createButton(this, 400, 400, "Start Game", () => this.startGame()).setOrigin(0.5);

    // Create a dialog component and display instructions
    this.dialog = new DialogComponent(
      this,
      400,
      300,
      300,
      150,
      "Welcome to the game! Use the inputs to set up your character and ranch. Click 'Start Game' to begin.",
      "character"
    );
    this.dialog.showDialog(); // Show the dialog with the initial message

    // Hide the dialog after 5 seconds if needed
    this.time.delayedCall(5000, () => {
      if (this.dialog) {
        this.dialog.hideDialog();
      }
    });
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
    ]);
  }

  startGame() {
    if (this.player.name && this.player.ranchName) {
      // Prepare player data to send to the server
      const playerData = {
        name: this.player.name,
        ranchName: this.player.ranchName,
        coins: this.player.coins,
        inventory: this.player.inventory,
        ranchLocation: this.player.ranchLocation,
        monsters: this.player.monsters,
        frozenMonsters: this.player.frozenMonsters,
        activeMonster: this.player.activeMonster,
      };

      // Save player to MongoDB
      this.createPlayer(playerData);

      console.log(
        `Player Name: ${this.player.name}, Ranch Name: ${this.player.ranchName}, Location: ${this.player.ranchLocation}`
      );
    } else {
      alert("Please enter your name and ranch name.");
    }
  }

  async createPlayer(playerData) {
    try {
      const response = await fetch("http://localhost:5000/api/players/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
      });

      if (!response.ok) {
        throw new Error("Failed to save player");
      }

      const data = await response.json();
      console.log("Player saved successfully:", data);

      // Update the client-side player object with the data returned from the server
      this.player = data.data;

      // Store the player ID in localStorage
      localStorage.setItem('playerId', this.player._id);


      // Start the GameScene with the updated player data
      this.scene.start("GameScene", { player: this.player });
    } catch (error) {
      console.error("Error creating player:", error);
      alert("Failed to create player.");
    }
  }
}
