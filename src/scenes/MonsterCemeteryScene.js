// src/scenes/MonsterCemeteryScene.js
import { createButton} from "../utils/uiUtils.js";
class MonsterCemeteryScene extends Phaser.Scene {
    constructor() {
      super({ key: "MonsterCemeteryScene" });
    }
  
    init(data) {
      // Receive data from other scenes
      this.deceasedMonsters = data.deceasedMonsters || []; // Deceased monsters list
    }
  
    preload() {
      // Load any assets for the cemetery scene if needed
      
    }
  
    create() {
        this.add.image(400, 300, 'cemetery');
        // Add a title for the cemetery scene
        this.add.text(400, 50, "Monster Cemetery", {
          fontSize: "32px",
          fill: "#FFF",
        }).setOrigin(0.5);
    
        // Display the list of deceased monsters
        this.displayDeceasedMonsters();
    
        createButton(this, 700, 50, "Back", () => {
          this.scene.start("GameScene"); // Switch back to the game scene
        });
      }
    
      displayDeceasedMonsters() {
        if (this.deceasedMonsters.length === 0) {
          this.add.text(400, 300, "No monsters have died yet.", {
            fontSize: "24px",
            fill: "#FFF",
          }).setOrigin(0.5);
        } else {
          // Display each deceased monster name
          this.deceasedMonsters.forEach((monsterName, index) => {
            this.add.text(400, 100 + (index * 30), `Here Lies ${monsterName}`, {
              fontSize: "20px",
              fill: "#FFF",
            }).setOrigin(0.5);
          });
        }
      }
    }
    
    export default MonsterCemeteryScene;