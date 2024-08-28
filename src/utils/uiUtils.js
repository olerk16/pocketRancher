// src/utils/uiUtils.js

/**
 * Creates a Bootstrap-styled button and appends it to the DOM.
 *
 * @param {Phaser.Scene} scene - The Phaser scene where the button is used.
 * @param {number} x - The x position in the Phaser canvas coordinate system.
 * @param {number} y - The y position in the Phaser canvas coordinate system.
 * @param {string} text - The text to display on the button.
 * @param {Function} callback - The function to call when the button is clicked.
 */
// src/utils/uiUtils.js

export function createButton(scene, x, y, label, onClick) {
    const button = scene.add.text(x, y, label, { 
        fontSize: '18px', 
        color: '#ffffff', 
        backgroundColor: '#2e8b57',
        padding: { x: 10, y: 5 },
        borderRadius: '5px' 
    })
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => onClick());

    button.setStyle({
        backgroundColor: '#2e8b57',
        border: 'none',
        borderRadius: '5px',
        color: '#ffffff'
    });

    return button;
}
