// src/main.js

import StartMenuScene from './scenes/StartMenuScene.js';
import GameScene from './scenes/GameScene.js';
import MarketBazaarScene from './scenes/MarketBazaarScene.js';

// Define the Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [StartMenuScene, GameScene, MarketBazaarScene] // Include all scenes
};

// Create a new Phaser game with the configuration
const game = new Phaser.Game(config);
