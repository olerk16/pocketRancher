// src/scenes/PlayerSetupScene.js

import { createButton } from "../utils/uiUtils.js"; // Import the utility function
// import Peacocktopus from '../models/Species/Peacocktopus.js'; // Import your specific monster classes
import Monster from "../models/Monster.js";

class PlayerSetupScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayerSetupScene" });

    // Store player inputs
    this.playerName = "";
    this.ranchName = "";
    this.playerCoins = 100;
    this.inventory = [];
    this.selectedMonsterType = null;
    this.selectedMonsterInstance = null; // Store the created monster instance
    this.ranchLocation = null // default location
    this.monsterName = "";
  }

  preload() {
    // Load assets for the player setup scene
    this.load.image("monster1", "assets/images/monster1.png"); // Example monster sprites
    this.load.image("monster2", "assets/images/monster2.png");
    this.load.image("monster3", "assets/images/monster3.png");

//       // Load background images for each location
//   this.load.image("grassLandRanch", "assets/images/backGrounds/grassLandRanch.webp");
//   this.load.image("desertRanch", "assets/images/backGrounds/desertRanch.webp");
//   this.load.image("mountainRanch", "assets/images/backGrounds/mountainRanch.webp");
  }

  create() {
    // Add instructions text
    this.add
      .text(400, 100, "Set up your player and ranch", {
        fontSize: "24px",
        fill: "#FFF",
      })
      .setOrigin(0.5);

    // Create input fields and buttons using DOM elements
    this.createInputFields();
    this.createMonsterSelection();
    this.createDropdownMenu();
    this.createQuickStart(); // for testing 
  }
  createQuickStart(){

    this.playerName = "testPlayerName";
    this.ranchName = "TestDesertRanch";
    this.playerCoins = 100;
    this.inventory = [];
    this.selectedMonsterType = 'monster1';
    this.selectedMonsterInstance = null; // Store the created monster instance
    this.ranchLocation ='desert' // default location
    this.monsterName = "testMonsterName";
    createButton(this, 350, 200, "Quick Start Game", () => this.startGame());
  }

  createInputFields() {
    // Create input field for player name
    const playerNameInput = document.createElement("input");
    playerNameInput.type = "text";
    playerNameInput.placeholder = "Enter your name";
    playerNameInput.style.position = "absolute";
    playerNameInput.style.top = "150px";
    playerNameInput.style.left = "400px";
    playerNameInput.style.transform = "translate(-50%, -50%)";
    playerNameInput.style.fontSize = "16px";
    document.body.appendChild(playerNameInput);

    // Create input field for ranch name
    const ranchNameInput = document.createElement("input");
    ranchNameInput.type = "text";
    ranchNameInput.placeholder = "Enter your ranch name";
    ranchNameInput.style.position = "absolute";
    ranchNameInput.style.top = "200px";
    ranchNameInput.style.left = "400px";
    ranchNameInput.style.transform = "translate(-50%, -50%)";
    ranchNameInput.style.fontSize = "16px";
    document.body.appendChild(ranchNameInput);

    // Update player and ranch names on input change
    playerNameInput.addEventListener("input", (event) => {
      this.playerName = event.target.value;
    });

    ranchNameInput.addEventListener("input", (event) => {
      this.ranchName = event.target.value;
    });

    // Remove input fields when the scene shuts down
    this.events.on("shutdown", () => {
      playerNameInput.remove();
      ranchNameInput.remove();
    });
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

  createMonsterSelection() {
    // Instructions for selecting a monster
    this.add
      .text(400, 250, "Select your starting monster:", {
        fontSize: "20px",
        fill: "#FFF",
      })
      .setOrigin(0.5);

    // Display monster options on screen
    const monster1 = this.add.image(300, 350, "monster1").setInteractive();
    const monster2 = this.add.image(400, 350, "monster2").setInteractive();
    const monster3 = this.add.image(500, 350, "monster3").setInteractive();

    // Example monster selection buttons
    createButton(this, 300, 300, "Monster 1", () =>
      this.selectMonster("monster1", monster1)
    );
    createButton(this, 400, 300, "Monster 2", () =>
      this.selectMonster("monster2", monster2)
    );
    createButton(this, 500, 300, "Monster 3", () =>
      this.selectMonster("monster3", monster3)
    );

    // Create a button to confirm the selection and start the game
    createButton(this, 400, 400, "Start Game", () => this.startGame());
  }

  selectMonster(monsterType, monsterImage) {
    this.selectedMonsterType = monsterType;
    console.log(`Selected Monster: ${this.selectedMonsterType}`);

    this.clearMonsterSelection(); // Clear previous selections
    monsterImage.setTint(0x00ff00); // Highlight the selected monster

    // Create input field for monster name after selecting a monster
    this.createMonsterNameInput();
  }

  createMonsterNameInput() {
    // Remove any existing monster name input field
    if (this.monsterNameInput) {
      this.monsterNameInput.remove();
    }

    // Create input field for monster name
    this.monsterNameInput = document.createElement("input");
    this.monsterNameInput.type = "text";
    this.monsterNameInput.placeholder = "Enter your monster's name";
    this.monsterNameInput.style.position = "absolute";
    this.monsterNameInput.style.top = "400px";
    this.monsterNameInput.style.left = "400px";
    this.monsterNameInput.style.transform = "translate(-50%, -50%)";
    this.monsterNameInput.style.fontSize = "16px";
    document.body.appendChild(this.monsterNameInput);

    // Update monster name on input change
    this.monsterNameInput.addEventListener("input", (event) => {
      this.monsterName = event.target.value;
    });

    // Remove input field when the scene shuts down
    this.events.on("shutdown", () => {
      this.monsterNameInput.remove();
    });
  }

  clearMonsterSelection() {
    // Reset all monster images to their original state
    this.children.each((child) => {
      if (child.type === "Image") {
        child.clearTint(); // Remove tint to clear selection
      }
    });
  }

  startGame() {
    if (this.playerName && this.ranchName && this.selectedMonsterType && this.monsterName) {
      console.log(
        `Player Name: ${this.playerName}, Ranch Name: ${this.ranchName}, Monster: ${this.selectedMonsterType}, Location: ${this.ranchLocation}`
      );
      // Store these details in a global game object or pass them to the next scene
      this.scene.start("GameScene", {
        playerName: this.playerName,
        ranchName: this.ranchName,
        selectedMonster: this.selectedMonsterInstance, // Pass the monster instance
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
