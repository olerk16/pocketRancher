import Diseases from '../models/Diseases.js';
import Items from '../models/Items.js';
import Offerings from '../models/Offerings.js';
import DiseaseManager from './DiseaseManager.js';

/**
 * Gets a random item or offering based on rarity chance
 */
function getRandomReward() {
    const roll = Math.random() * 100;

    // 5% chance for rare offerings
    if (roll < 5) {
        const rareOfferings = [
            Offerings.STORM_EGG,
            Offerings.DRAGON_SCALE,
            Offerings.MYSTIC_GEM,
            Offerings.ANCIENT_RELIC
        ];
        const reward = rareOfferings[Math.floor(Math.random() * rareOfferings.length)];
        console.log('Got rare offering reward:', reward);
        return reward;
    }
    
    // 20% chance for common items
    if (roll < 20) {
        const commonItems = [
            Items.POTATO,
            Items.TOY,
            Items.FLOWERS,
            Items.MAGIC_BERRIES
        ];
        const reward = commonItems[Math.floor(Math.random() * commonItems.length)];
        console.log('Got common item reward:', reward);
        return reward;
    }

    console.log('No reward this time');
    return null;
}

/**
 * Starts a journey for the active monster.
 * 
 * @param {Phaser.Scene} scene - The current Phaser scene.
 * @param {Object} activeMonster - The active monster object.
 * @param {Object} dropdownMenu - The dropdown menu object to disable/enable.
 * @param {Object} playerInfoComponent - The player info component.
 * @param {Object} player - The player object.
 */
export function startJourney(scene, activeMonster, dropdownMenu, playerInfoComponent, player) {
    if (!activeMonster || activeMonster.isFrozen) {
        console.log("No active monster to send on a journey.");
        return;
    }

    console.log("Journey started!");
    const journeyDuration = Phaser.Math.Between(1000, 5000);

    const journeyDurationText = scene.add.text(
        16, 220,
        `Journey Time: ${journeyDuration / 1000} seconds`,
        { fontSize: "16px", fill: "#FFF" }
    );

    activeMonster.sprite.setVisible(false);
    dropdownMenu.disableMenu();

    scene.time.delayedCall(journeyDuration, () => {
        activeMonster.sprite.setVisible(true);
        
        // Handle rewards
        const earnedCoins = Phaser.Math.Between(10, 50);
        const reward = getRandomReward();
        let journeyMessage = `Journey complete!\nEarned ${earnedCoins} coins`;

        // Add rewards
        player.updateCoins(earnedCoins);
        if (reward) {
            console.log('Adding reward to inventory:', reward);
            // Make sure the item has all required properties
            const itemToAdd = {
                name: reward.name,
                type: reward.type || 'item',
                spriteKey: reward.spriteKey,
                description: reward.description,
                price: reward.price || 0
            };
            
            player.inventory.push(itemToAdd);
            journeyMessage += `\nFound: ${reward.name}!`;
            
            // Update inventory display if it exists
            if (scene.inventoryComponent) {
                scene.inventoryComponent.updateInventory(player.inventory);
            }
        }

        // Check for disease
        const disease = DiseaseManager.getRandomDisease(activeMonster, scene);
        if (disease) {
            disease.apply();
        }

        // Show journey results
        const messageText = scene.add.text(400, 300, journeyMessage, {
            fontSize: "20px",
            fill: "#FFF",
            align: 'center',
            wordWrap: { width: 400 }
        }).setOrigin(0.5);

        // Update displays
        if (scene.playerInfoComponent) {
            scene.playerInfoComponent.updateInfo();
        }

        // Cleanup after 3 seconds
        scene.time.delayedCall(3000, () => {
            messageText.destroy();
        });

        dropdownMenu.enableMenu();
        journeyDurationText.destroy();
    });
}
