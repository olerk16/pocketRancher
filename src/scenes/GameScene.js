// src/scenes/GameScene.js

import { createButton } from '../utils/uiUtils.js'; // Import the utility functions
import Monster from '../models/Monster.js';  // Import the Monster class


class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // // Load assets for the game scene
        // this.load.image('monster', 'assets/images/monster.png');
        // this.load.image('background', 'assets/images/background.png');
        // this.load.image('marketButton', 'assets/images/marketButton.png'); // Button to go to market
    }

    create() {
        // Add the background image to the game
        this.add.image(400, 300, 'background');

        // Player currency
        this.playerCoins = 100; // Start with 100 coins
        this.coinsText = this.add.text(16, 200, 'Coins: ' + this.playerCoins, { fontSize: '16px', fill: '#FFF' });

        // Player inventory
        this.inventory = [];

        // Create monster object
        this.monster = new Monster(this, 400, 300); // Pass scene, x, y coordinates

        // Display monster stats on the screen
        this.hungerText = this.add.text(16, 16, 'Hunger: ' + this.monster.hunger, { fontSize: '16px', fill: '#FFF' });
        this.happinessText = this.add.text(16, 36, 'Happiness: ' + this.monster.happiness, { fontSize: '16px', fill: '#FFF' });
        this.energyText = this.add.text(16, 56, 'Energy: ' + this.monster.energy, { fontSize: '16px', fill: '#FFF' });
        this.trainingText = this.add.text(16, 76, 'Training: ' + this.monster.training, { fontSize: '16px', fill: '#FFF' });
        this.lifeSpanText = this.add.text(16, 96, 'Life Span: ' + this.monster.lifeSpan, { fontSize: '16px', fill: '#FFF' });

        // Add buttons for actions (feed, play, train, sleep)
        createButton(this, 16, 120, 'Feed', () => this.feedMonster());
        createButton(this, 16, 160, 'Play', () => this.playWithMonster());
        createButton(this, 16, 200, 'Train', () => this.trainMonster());
        createButton(this, 16, 240, 'Sleep', () => this.putMonsterToSleep());

        // Button to go to the market bazaar
        createButton(this, 700, 50, 'Go to Market', () => {
            this.scene.start('MarketBazaarScene'); // Switch to the market scene
        });

        // Button to use inventory items
        createButton(this, 16, 280, 'Use Item', () => this.useItem());

        // Set up random movement timer
        this.time.addEvent({
            delay: 2000, // Every 2 seconds
            callback: () => this.monster.moveRandomly(),
            callbackScope: this,
            loop: true
        });

        // Set up keyboard input for movement
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
        // Update the game state periodically
        this.monster.update
    }

    earnCoins(amount) {
        this.playerCoins += amount;
        this.coinsText.setText('Coins: ' + this.playerCoins);
    }

    // Method to use an item from inventory
    useItem() {
        if (this.inventory.length > 0) {
            const item = this.inventory.pop(); // Remove the last item from inventory
            // Apply item effects to monster stats
            if (item === 'apple') {
                this.monster.updateStat('hunger', -20);
            } else if (item === 'toy') {
                this.monster.updateStat('happiness', 30);
            }
            this.monster.updateDisplay(); // Update display after using item
        } else {
            alert('Inventory is empty!');
        }
    }
}

export default GameScene;
