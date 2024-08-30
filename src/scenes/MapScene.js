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
      createButton(this, 700, 50, "Back", () => {
        this.scene.start("GameScene"); // Switch back to the game scene
      });
      // Additional map interactions can be added here
    }
  
    update() {
      // Logic for the map scene if needed
    }
  }
  
  export default MapScene;
  