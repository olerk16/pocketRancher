// src/scenes/MonsterPortalScene.js
import { createButton } from '../utils/uiUtils.js'; // Adjust the path as needed

class MonsterPortalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MonsterPortalScene' });
  }

  preload() {
    // Load any assets you need for the scene here
    this.load.image('portalBackground', 'assets/images/backGrounds/portalBackground.webp');
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

  async summonMonster() {
    // Display loading image or text
    const loadingText = this.add.text(400, 300, 'Summoning...', { fontSize: '24px', fill: '#FFF' }).setOrigin(0.5);

    try {
      const response = await fetch('http://localhost:5000/generate-monster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch from server');

      // The response is an image, so we create an object URL for it
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob); // Create a local URL for the Blob

      console.log('Monster Image URL:', imageUrl);

      // Remove loading text
      loadingText.destroy();

       // Load the monster image dynamically
       this.load.image('monsterImage', imageUrl); 
       this.load.once('complete', () => {
         // Display the monster image
         this.add.image(400, 300, 'monsterImage').setOrigin(0.5).setScale(0.4);
       });
       this.load.start();

    } catch (error) {
      console.error('Error fetching monster image:', error);
      loadingText.setText('Failed to summon monster');
    }
  }

  update(time, delta) {
    // Update logic if needed
  }
}

export default MonsterPortalScene;
