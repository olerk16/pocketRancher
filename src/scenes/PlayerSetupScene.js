// src/scenes/PlayerSetupScene.js

import { createButton } from "../utils/uiUtils.js"; // Import the utility function
import Monster from "../models/Monster.js";
import Monsters from "../models/Monsters.js"; // Import the Monsters object
import Player from "../models/Player.js";
import InputComponent from "../components/InputComponent.js";

class PlayerSetupScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayerSetupScene" });

    // // Collect player data
    // const playerName = "Player1"; // Example player name, replace with actual input
    // const ranchName = "Sunny Ranch"; // Example ranch name
    // const playerCoins = 1000; // Initial coins
    // const inventory = []; // Initial empty inventory
    // const ranchLocation = "grassLand"; // Default ranch location

    // Store player inputs
    this.player = null;
    this.playerName = "";
    this.ranchName = "";
    this.playerCoins = 100;
    this.inventory = [];
    this.selectedMonsterType = null;
    this.ranchLocation = null // default location
    this.monsterName = "";
  }

  preload() {
     // Load assets for the player setup scene dynamically based on Monsters object
     Object.values(Monsters).forEach(monster => {
      this.load.image(monster.spriteKey, `assets/images/${monster.spriteKey}.png`);
    });
  }

  create() {

    // Create a Player instance
    // this.player = new Player(playerName, ranchName, playerCoins, inventory, ranchLocation);
    // Add instructions text
    this.add
      .text(400, 100, "Set up your player and ranch", {
        fontSize: "24px",
        fill: "#FFF",
      })
      .setOrigin(0.5);

    // Create input fields using the new InputComponent
    this.setupInputFields();
    // this.createMonsterSelection();
    this.createDropdownMenu()

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
        onChange: (value) => (this.playerName = value), // Update player name
      },
      {
        placeholder: "Enter your ranch name",
        top: "200px",
        left: "400px",
        onChange: (value) => (this.ranchName = value), // Update ranch name
      },
      {
        placeholder: "Enter your monster's name",
        top: "400px",
        left: "400px",
        onChange: (value) => (this.monsterName = value), // Update monster name
      },
    ]);
  }

  createDropdownMenu() {
    // Create a dropdown (select element) for ranch location selection
    const locationDropdown = document.createElement('select');
    locationDropdown.style.position = 'absolute';
    locationDropdown.style.top = '250px';
    locationDropdown.style.left = '400px';
    locationDropdown.style.transform = 'translate(-50%, -50%)';
    locationDropdown.style.fontSize = '16px';

     // Define ranch location options
    const locations = [
    { value: "grassLand", text: "Grassland" },
    { value: "desert", text: "Desert" },
    { value: "mountain", text: "Mountain" },
  ];

    // Populate the dropdown with options
    locations.forEach((location) => {
      const option = document.createElement('option');
      option.value = location.value;
      option.text = location.text;
      locationDropdown.appendChild(option);
    });

    // Handle selection change
    locationDropdown.addEventListener('change', (event) => {
      this.ranchLocation = event.target.value;
    //   this.updateBackgroundImage(); // Update the background image based on the selection
      console.log(`Selected Ranch Location: ${this.ranchLocation}`);
    });

    // Append the dropdown to the body
    document.body.appendChild(locationDropdown);

    // Remove dropdown when the scene shuts down
    this.events.on('shutdown', () => {
      locationDropdown.remove();
    });
  }

  assignRandomMonster() {
    // Get a random monster from the Monsters object
    const monsterTypes = Object.keys(Monsters);
    this.selectedMonsterType = Phaser.Utils.Array.GetRandom(monsterTypes);

    console.log(`Assigned Random Monster: ${this.selectedMonsterType}`);

  }

  

  startGame() {
    // init the player 
    this.player = new Player(this.playerName, this.ranchName);
    this.player.addMonster(this.selectedMonsterType);
    if (this.playerName && this.ranchName && this.selectedMonsterType && this.monsterName) {
      console.log(
        `Player Name: ${this.playerName}, Ranch Name: ${this.ranchName}, Monster: ${this.selectedMonsterType}, Location: ${this.ranchLocation}`
      );
      // Store these details in a global game object or pass them to the next scene
      this.scene.start("GameScene", {
        player: this.player,
        playerName: this.playerName,
        ranchName: this.ranchName,
        monsterType: this.selectedMonsterType, // Pass the monster type
        monsterName: this.monsterName,
        playerCoins: this.playerCoins,
        inventory: this.inventory,
        ranchLocation: this.ranchLocation // pass ranch location
      });
    } else {
      alert("Please enter your name, ranch name, and select a monster.");
    }
  }
}

export default PlayerSetupScene;
