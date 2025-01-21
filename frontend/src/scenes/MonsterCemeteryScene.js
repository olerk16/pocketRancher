import Phaser from 'phaser';
import { createButton } from "../utils/uiUtils.js";

export default class MonsterCemeteryScene extends Phaser.Scene {
    constructor() {
      super({ key: "MonsterCemeteryScene" });
    }
  
    init(data) {
      this.player = data.player;
      this.deceasedMonsters = this.player?.deceasedMonsters || [];
    }
  
    preload() {
      // Load cemetery background
      this.load.image('cemetery', '/assets/images/backGrounds/cemetery.webp');
      
      // Load deceased monster images
      if (this.deceasedMonsters) {
        this.deceasedMonsters.forEach(monster => {
          if (monster.imageURL) {
            this.load.image(`deceased_${monster.name}`, monster.imageURL);
          }
        });
      }
    }
  
    create() {
        // Add the background image
        this.add.image(400, 300, 'cemetery')
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    
        // Add a title for the cemetery scene
        this.add.text(400, 50, "Monster Cemetery", {
          fontSize: "32px",
          fill: "#FFF",
          backgroundColor: "#000000",
          padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    
        // Display the list of deceased monsters
        this.displayDeceasedMonsters();
    
        createButton(this, 700, 50, "Back", () => {
          this.scene.start("GameScene", { player: this.player });
        });
      }
    
      displayDeceasedMonsters() {
        if (!this.deceasedMonsters || this.deceasedMonsters.length === 0) {
          this.add.text(400, 300, "No monsters have passed away yet.", {
            fontSize: "24px",
            fill: "#FFF",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 }
          }).setOrigin(0.5);
        } else {
          const startY = 120;
          const spacing = 100;

          this.deceasedMonsters.forEach((monster, index) => {
            const tombstone = this.add.container(400, startY + (index * spacing));

            // Add tombstone background
            const bg = this.add.rectangle(0, 0, 350, 90, 0x666666)
              .setStrokeStyle(2, 0x000000);
            tombstone.add(bg);

            // Add monster image if available
            if (monster.imageURL) {
              const monsterImage = this.add.image(-140, 0, `deceased_${monster.name}`)
                .setScale(0.4);
              tombstone.add(monsterImage);
            }

            // Add monster information
            const text = [
              `Here Lies ${monster.name}`,
              `Type: ${monster.type}`,
              `Died: ${monster.deathDate}`,
              `Cause: ${monster.causeOfDeath}`
            ].join('\n');

            const tombstoneText = this.add.text(20, 0, text, {
              fontSize: "16px",
              fill: "#FFFFFF",
              align: 'left'
            }).setOrigin(0, 0.5);

            tombstone.add(tombstoneText);
          });
        }
      }
    }