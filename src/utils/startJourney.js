// src/utils/journeyUtils.js

// import Phaser from 'phaser';
import Diseases from '../models/Diseases.js'; // Ensure you have the correct path to Diseases

/**
 * Starts a journey for the active monster.
 * 
 * @param {Phaser.Scene} scene - The current Phaser scene.
 * @param {Object} activeMonster - The active monster object.
 * @param {Object} dropdownMenu - The dropdown menu object to disable/enable.
 * @param {Object} coinsText - The text object displaying the player's coins.
 * @param {number} playerCoins - The current number of player's coins.
 */
export function startJourney(scene, activeMonster, dropdownMenu, coinsText, playerCoins) {
  console.log('Diseases:', Diseases); // Debug log to check content

  if (activeMonster && !activeMonster.isFrozen) {
    console.log("Journey started!");
    const journeyDuration = Phaser.Math.Between(5000, 15000); // Random duration between 5 and 15 seconds

    // Display journey duration to the player
    const journeyDurationText = scene.add.text(
      16,
      220,
      `Journey Time: ${journeyDuration / 1000} seconds`,
      {
        fontSize: "16px",
        fill: "#FFF",
      }
    );

    // Hide the monster sprite
    activeMonster.sprite.setVisible(false);

    // Disable dropdown menu during the journey
    dropdownMenu.disableMenu();

    // Set a timer to bring the monster back and reward coins
    scene.time.delayedCall(journeyDuration, () => {
      activeMonster.sprite.setVisible(true); // Show monster again
      const earnedCoins = Phaser.Math.Between(10, 50); // Random coin reward
      playerCoins += earnedCoins;
      coinsText.setText("Coins: " + playerCoins);
      console.log(`Journey complete! You earned ${earnedCoins} coins.`);

      // Re-enable dropdown menu after journey
      dropdownMenu.enableMenu();

      // Remove journey duration text
      journeyDurationText.destroy();

      // Apply a random disease
      activeMonster.applyRandomDisease(); // Apply random disease to the monster
    });
  } else {
    console.log("No active monster to send on a journey.");
  }
}
