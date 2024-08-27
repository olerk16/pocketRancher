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
export function createButton(scene, x, y, text, callback) {
    // Create a button element
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'btn btn-primary'; // Apply Bootstrap button classes
    button.style.position = 'absolute';
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.style.transform = 'translate(-50%, -50%)'; // Center the button based on the position
    button.style.fontSize = '20px';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';

    // Append the button to the body
    document.body.appendChild(button);

    // Add click event listener
    button.addEventListener('click', callback);

    // Remove the button when the scene shuts down to avoid memory leaks
    scene.events.on('shutdown', () => {
        button.remove();
    });

    return button;
}
