// src/scenes/MapScene.js

import { createButton, createImageButton } from "../utils/uiUtils.js";

class MapScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MapScene' });
      this.background = null;
    }
  
    preload() {
      // Load assets for the map
      this.load.image('mapBackground', 'assets/images/backGrounds/map.webp');
      this.load.image('battleButton', 'assets/images/icons/battleButton.png');
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
      createImageButton(this, 100, 100, 'battleButton', () => this.startBattleScene('level-1'), 50, 50);
    }
    startBattleScene(level){
      if(level === 'level-1'){
        // go to the arena with random monster from the arena and background
        this.background = 'desertFight' 
        this.scene.start('BattleScene', {
          background:this.background
        })
      }
    }
    update() {
      // Logic for the map scene if needed
    }
  }
  
  export default MapScene;
  