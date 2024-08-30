// src/scenes/MapScene.js

class MapScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MapScene' });
    }
  
    preload() {
      // Load assets for the map
      this.load.image('mapBackground', 'assets/images/backGrounds/map.webp');
      // Load other assets needed for the map
    }
  
    create() {
      // Add the map background
      this.add.image(400, 300, 'mapBackground');
  
      // Add a button to return to the GameScene
      const returnButton = this.add.text(700, 550, 'Return to Game', {
        fontSize: '20px',
        fill: '#FFF'
      }).setInteractive();
  
      returnButton.on('pointerdown', () => {
        this.scene.start('GameScene', {
          // You can pass data back to GameScene if needed
        });
      });
  
      // Additional map interactions can be added here
    }
  
    update() {
      // Logic for the map scene if needed
    }
  }
  
  export default MapScene;
  