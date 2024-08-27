// src/scenes/MarketBazaarScene.js

import { createButton } from '../utils/uiUtils.js';

class MarketBazaarScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MarketBazaarScene' });
    }

    preload() {
        // // Load images for the market items
        // this.load.image('apple', 'assets/images/apple.png'); // Example item
        // this.load.image('toy', 'assets/images/toy.png');     // Example item
    }

    create() {
        // Display title text
        this.add.text(400, 50, 'Market Bazaar', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);

        // Display player's current coins
        this.coinsText = this.add.text(16, 16, 'Coins: ' + this.game.scene.keys['GameScene'].playerCoins, { fontSize: '16px', fill: '#FFF' });

        // Use createButton utility function to create market item buttons
        createButton(this, 200, 200, 'Buy Apple (10 coins)', () => this.buyItem('apple', 10));
        createButton(this, 400, 200, 'Buy Toy (20 coins)', () => this.buyItem('toy', 20));

        // Use createButton utility function to create a back button
        createButton(this, 700, 50, 'Back', () => {
            this.scene.start('GameScene'); // Switch back to the game scene
        });
    }

    buyItem(item, price) {
        const gameScene = this.game.scene.keys['GameScene']; // Reference to GameScene
        
        if (gameScene.playerCoins >= price) {
            gameScene.playerCoins -= price;
            this.coinsText.setText('Coins: ' + gameScene.playerCoins);
            
            // Add the item to the player's inventory
            gameScene.inventory.push(item);

            // Notify the player of the purchase
            this.add.text(400, 300, `Bought ${item}!`, { fontSize: '16px', fill: '#FFF' }).setOrigin(0.5);
        } else {
            // Show message if player cannot afford the item
            this.add.text(400, 300, 'Not enough coins!', { fontSize: '16px', fill: '#FF0000' }).setOrigin(0.5);
        }
    }
}

export default MarketBazaarScene;
