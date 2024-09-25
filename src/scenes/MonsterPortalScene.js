// src/scenes/MonsterPortalScene.js
import { createButton } from '../utils/uiUtils.js'; // Adjust the path as needed

class MonsterPortalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MonsterPortalScene' });
  }

  preload() {
    // Load any assets you need for the scene here
  }

  create() {
    console.log("creatingggg");
    // Add background
    this.add.image(400, 300, 'portalBackground');

    // Add title text
    this.add.text(400, 100, 'Monster Portal', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);

    // Add a summon button
    this.createSummonButton();

    // Add a back button to return to the main game scene
    this.createBackButton();
  }

  createSummonButton() {
    createButton(this, 400, 300, 'Summon Monster', () => this.summonMonster());
  }

  createBackButton() {
    createButton(this, 700, 50, 'Back', () => this.scene.start('GameScene'));
  }

  // async summonMonster() {
  //   // Display loading text
  //   const loadingText = this.add.text(400, 300, 'Summoning...', { fontSize: '24px', fill: '#FFF' }).setOrigin(0.5);
  
  //   try {
  //     const response = await fetch('http://localhost:5000/monsters/generate-monster', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  
  //     if (!response.ok) throw new Error('Failed to fetch from server');
  
  //     // The response is an image, so handle it as a Blob
  //   const blob = await response.blob();
  //   const imageUrl = URL.createObjectURL(blob); // Create a local URL for the Blob

  //   console.log('Monster Image URL:', imageUrl);
  
  //     // Remove loading text
  //     loadingText.destroy();
  
  //     // Load the monster image dynamically
  //     this.load.image('monsterImage', imageUrl);
  //     this.load.once('complete', () => {
  //       // Display the monster image
  //       this.add.image(400, 300, 'monsterImage').setOrigin(0.5).setScale(0.4);
  
  //       // Display monster stats on screen
  //       this.displayMonsterStats(stats);
  //     });
  //     this.load.start();
  
  //     // Save monster data to the player's monsters (assuming player exists in the scene)
  //     if (this.player) {
  //       this.player.addMonster({
  //         name: 'Random Monster', // Can use a dynamic name here if desired
  //         imageUrl: imageUrl,     // URL of the monster's image
  //         stats: stats            // Stats object
  //       });
  //       console.log('New monster added to player:', this.player.monsters);
  //     }
  
  //   } catch (error) {
  //     console.error('Error summoning monster:', error);
  //     loadingText.setText('Failed to summon monster');
  //   }
  // }

  async summonMonster() {
    // Display loading text
    const loadingText = this.add.text(400, 300, 'Summoning...', { fontSize: '24px', fill: '#FFF' }).setOrigin(0.5);
  
    try {
      const response = await fetch('http://localhost:5000/monsters/generate-monster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch from server');

      const monsterData = await response.json(); // Get JSON data, which contains image URL and stats
      console.log('Monster Data:', monsterData);

      const { imageUrl, stats, uniqueKey } = monsterData;

      // Remove loading text
      loadingText.destroy();

      // Clear the previous image cache using the unique key
      if (this.textures.exists(uniqueKey)) {
        this.textures.remove(uniqueKey);
    }

      // Load the new monster image dynamically with the unique key from backend
      this.load.image(uniqueKey, imageUrl);
      this.load.once('complete', () => {
          // Display the monster image
          this.add.image(400, 300, uniqueKey).setOrigin(0.5).setScale(0.4);

        // Display monster stats using the new method
        // this.displayMonsterStats(stats);
      });
      this.load.start();

      // Display the monster image
      this.add.image(400, 300, imageUrl).setOrigin(0.5).setScale(0.4);

      // Save monster data to the player (assuming player object exists)
      if (this.player) {
        this.player.addMonster({
          name: monsterData.name,
          imageUrl: imageUrl, // URL of the monster's image
          stats: stats, // Stats object
          uniqueKey: uniqueKey // Store unique key
        });
        console.log('New monster added to player:', this.player.monsters);
      }

    } catch (error) {
      console.error('Error summoning monster:', error);
      loadingText.setText('Failed to summon monster');
    }
}

  update(time, delta) {
    // Update logic if needed
  }
}

export default MonsterPortalScene;
