import Phaser from 'phaser';

// import toyShakerImage from '../assets/images/Items/toyShaker.webp';
// import steakImage from '../assets/images/Items/Steak.webp';
// import potatoImage from '../assets/images/Items/Potato.webp';
// import flowersImage from '../assets/images/Items/Flowers.webp';
// import medicBagImage from '../assets/images/Items/MedicBag.webp';
// import grassLandRanchImage from '../assets/images/backGrounds/grassLandRanch.webp';


import { createButton } from '../utils/uiUtils.js';

export default class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartMenuScene' });
  }

  preload() {
    // this.load.image('toyShaker', toyShakerImage);
    // this.load.image('steak', steakImage);
    // this.load.image('potato', potatoImage);
    // this.load.image('flowers', flowersImage);
    // this.load.image('medicBag', medicBagImage);
    // this.load.image('grassLandRanch', grassLandRanchImage);
    this.setImages();
  }

  create() {
    // Title
    this.add
      .text(400, 100, 'Pocket Rancher', { fontSize: '32px', fill: '#FFF' })
      .setOrigin(0.5);

    // New Game button
    createButton(this, 400, 200, 'New Game', () => this.startNewGame()).setOrigin(0.5);

    // Load Game button
    createButton(this, 400, 300, 'Load Game', () => this.loadGame()).setOrigin(0.5);
  }

  startNewGame() {
    // Start the player setup scene for a new game
    this.scene.start('PlayerSetupScene');
  }

  async loadGame() {
    const playerId = localStorage.getItem('playerId');

    if (!playerId) {
      console.error('No player ID found in localStorage.');
      alert('No saved game found.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/players/${playerId}`);

      if (!response.ok) {
        throw new Error('Failed to load player data');
      }

      const data = await response.json();

      // Assuming data.data contains the player object
      this.player = data.data;

      // Start the GameScene with the loaded player data
      this.scene.start('GameScene', { player: this.player });
    } catch (error) {
      console.error('Error loading game:', error);
      alert('Failed to load game.');
    }
  }

  setImages() {
    this.load.image('character', '/assets/images/trainer_0.png');
    // this.load.image('potato', '/assets/images/items/potato.webp');
    // this.load.image('steak', '/assets/images/items/steak.webp');
    // this.load.image('toyShaker', '/assets/images/items/toyShaker.webp');
    // this.load.image('flowers', '/assets/images/items/flowers.webp');
    // this.load.image('medicBag', '/assets/images/items/medicBag.webp');
    this.load.image('bazaar', '/assets/images/backGrounds/bazaar.webp');
    this.load.image('freezer', '/assets/images/backGrounds/freezer.webp');
    this.load.image('portalBackground', '/assets/images/backGrounds/portalBackground.webp');
    this.load.image('cemetery', '/assets/images/backGrounds/cemetery.webp');
    this.load.image('mapBackground', '/assets/images/backGrounds/map.webp');
    this.load.image('battleButton', '/assets/images/icons/battleButton.png');
    this.load.image('exitButton', '/assets/images/icons/exitButton.webp');
    // this.load.image('grassLandRanch', '/assets/images/backGrounds/grassLandRanch.webp');

    // this.load.image('desertFight', '/assets/images/backGrounds/desertFight.webp');
  }
}
