// src/scenes/StartMenuScene.js

import { createButton } from '../utils/uiUtils.js'; // Import the utility function

class StartMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartMenuScene' });
    }

    preload() {
        // Load any assets needed for the start menu here
        // this.load.image('startButtonBg', 'assets/images/startButton.png'); // Optional: background image for the button
    }

    create() {
        // Add title text
        this.add.text(400, 150, 'Monster Ranch Game', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);

        // Create RexUI button for starting the game using the utility function
        createButton(this, 400, 300, 'Start Game', () => {
            this.scene.start('GameScene'); // Switch to the game scene
        });
    }
}

export default StartMenuScene;
