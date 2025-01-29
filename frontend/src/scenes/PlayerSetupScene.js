import BaseScene from './BaseScene';
import { createButton } from "../utils/uiUtils.js"; // Import the utility function
import Player from "../models/Player.js";
import InputComponent from "../components/InputComponent.js";
import RanchLocationDropdown from "../components/RanchLocationDropdown.js"; // Import the new RanchLocationDropdown component
import DialogComponent from "../components/DialogComponent.js"; // Import the new DialogComponent

export default class PlayerSetupScene extends BaseScene {
  constructor() {
    super('PlayerSetupScene');
    this.inputComponent = null;
    this.dialog = null;
  }

  setupUI() {
    // Don't call super.setupUI() as we don't want the back button
  }

  setupSceneContent() {
    this.initializePlayer();
    this.createInputFields();
    this.createLocationDropdown();
    this.createStartButton();
    this.showWelcomeDialog();
  }

  initializePlayer() {
    this.player = new Player(this, {
      name: "",
      ranchName: "",
      coins: 100,
      inventory: [],
      monsters: [],
      deceasedMonsters: [],
      ranchLocation: null  // Set default ranch location
    });
  }

  createInputFields() {
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

  createLocationDropdown() {
    new RanchLocationDropdown(this, this.player);
  }

  createStartButton() {
    createButton(this, 400, 400, "Start Game", () => this.handleStartGame())
      .setOrigin(0.5);
  }

  showWelcomeDialog() {
    this.dialog = new DialogComponent(
      this,
      400,
      300,
      400,
      150,
      "Welcome to the game! Use the inputs to set up your character and ranch. Click 'Start Game' to begin.",
      'trainerDave'  // Use the new trainer Dave image
    );
    this.dialog.showDialog();

    // Hide the dialog after 5 seconds
    this.time.delayedCall(5000, () => {
      if (this.dialog) {
        this.dialog.hideDialog();
      }
    });
  }

  async handleStartGame() {
    try {
      // Create player data with ranch location
      const playerData = {
        name: this.player.name,
        ranchName: this.player.ranchName,
        ranchLocation: this.player.ranchLocation || 'grassLand' // Set default if not selected
      };

      // Send request to create player
      const response = await fetch('http://localhost:5000/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if we have a valid player object
      if (!data || !data._id) {
        console.error('Invalid player data received:', data);
        throw new Error('Invalid player data received from server');
      }

      // Initialize player in the game with ranch location
      this.player = Player.fromData(this, data);

      // Save player ID to local storage
      localStorage.setItem('playerId', this.player._id);

      // Transition to game scene with player data
      this.handleSceneTransition('GameScene', { player: this.player });

    } catch (error) {
      console.error('Error creating player:', error);
      // Show error message to user
      if (this.errorText) {
        this.errorText.destroy();
      }
      this.errorText = this.add.text(400, 500, 'Error creating player. Please try again.', {
        fontSize: '16px',
        fill: '#ff0000'
      }).setOrigin(0.5);
    }
  }

  cleanup() {
    if (this.dialog) {
      this.dialog.destroy();
      this.dialog = null;
    }
    if (this.inputComponent) {
      this.inputComponent.destroy();
      this.inputComponent = null;
    }
  }
}
