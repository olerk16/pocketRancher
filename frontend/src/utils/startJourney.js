import Diseases from '../models/Diseases.js'; 

/**
 * Starts a journey for the active monster.
 * 
 * @param {Phaser.Scene} scene - The current Phaser scene.
 * @param {Object} activeMonster - The active monster object.
 * @param {Object} dropdownMenu - The dropdown menu object to disable/enable.
 * @param {Object} coinsText - The text object displaying the player's coins.
 * @param {number} playerCoins - The current number of player's coins.
 */
export function startJourney(scene, activeMonster, dropdownMenu, statsComponent, player) {
  console.log('Diseases:', Diseases); 

  if (activeMonster && !activeMonster.isFrozen) {
    console.log("Journey started!");
    const journeyDuration = Phaser.Math.Between(1000, 5000); 

    const journeyDurationText = scene.add.text(
      16,
      220,
      `Journey Time: ${journeyDuration / 1000} seconds`,
      {
        fontSize: "16px",
        fill: "#FFF",
      }
    );

    activeMonster.sprite.setVisible(false);

    dropdownMenu.disableMenu();

    // Set a timer to bring the monster back and reward coins
    scene.time.delayedCall(journeyDuration, () => {
      activeMonster.sprite.setVisible(true); 
      const earnedCoins = Phaser.Math.Between(10, 50); 

      player.updateCoins(earnedCoins);

      statsComponent.setCoins(player.coins);

      console.log(`Journey complete! You earned ${earnedCoins} coins.`);

      dropdownMenu.enableMenu();

      journeyDurationText.destroy();

      activeMonster.applyRandomDisease(); 
    });
  } else {
    console.log("No active monster to send on a journey.");
  }
}
