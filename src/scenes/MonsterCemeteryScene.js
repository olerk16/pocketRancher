// src/scenes/MonsterCemeteryScene.js

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
      this.load.image('cemetery', 'assets/images/backGrounds/cemetery.webp');
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
    
        // Add a button to go back to the Game Scene
        const backButton = this.add.text(400, 550, "Back to Ranch", {
          fontSize: "20px",
          fill: "#FFF",
          backgroundColor: "#000",
          padding: { x: 10, y: 5 },
        }).setOrigin(0.5).setInteractive();
    
        backButton.on("pointerdown", () => {
          this.scene.start("GameScene", { 
            playerName: this.playerName,
            ranchName: this.ranchName,
            selectedMonster: this.monster,
            monsterType: this.monsterType,
            playerCoins: this.playerCoins,
            inventory: this.inventory,
            ranchLocation: this.ranchLocation 
          });
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