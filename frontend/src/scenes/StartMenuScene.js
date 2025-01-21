import BaseScene from './BaseScene';
import { createButton } from '../utils/uiUtils.js';

export default class StartMenuScene extends BaseScene {
  constructor() {
    super('StartMenuScene');
  }

  setupUI() {
    // Don't call super.setupUI() as we don't want the back button
  }

  setupSceneContent() {
    this.createTitle();
    this.createMenuButtons();
  }

  createTitle() {
    this.add.text(400, 200, 'Pocket Rancher', {
      fontSize: '48px',
      fill: '#fff'
    }).setOrigin(0.5);
  }

  createMenuButtons() {
    createButton(this, 400, 300, 'New Game', () => {
      this.handleSceneTransition('PlayerSetupScene');
    });

    createButton(this, 400, 350, 'Load Game', () => {
      this.handleLoadGame();
    });
  }

  async handleLoadGame() {
    const playerId = localStorage.getItem('playerId');
    if (!playerId) {
      alert('No saved game found!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/players/${playerId}`);
      if (!response.ok) throw new Error('Failed to load game');
      
      const data = await response.json();
      this.handleSceneTransition('GameScene', { player: data });
    } catch (error) {
      console.error('Error loading game:', error);
      alert('Failed to load game');
    }
  }
}
