import Phaser from 'phaser';
import { createButton, createImageButton } from "../utils/uiUtils.js";
import Monster from "../models/Monster.js";

export default class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: "MapScene" });
    this.background = null;
    this.enemyMonster = null;
    
  }

  create() {
    // Add the map background
    this.add.image(400, 300, "mapBackground");

    // Add a button to return to the GameScene
    createButton(this, 700, 50, "Back", () => {
      this.scene.start("GameScene"); // Switch back to the game scene
    });
    // Additional map interactions can be added here
    createImageButton(
      this,
      100,
      100,
      "battleButton",
      () => this.startBattleScene("level-1"),
      50,
      50
    );
  }
  startBattleScene(level) {
    if (level === "level-1") {
      // go to the arena with random monster from the arena and background
      this.background = "desertFight";
      const monsterTypes = Object.keys(Monsters);
      const selectedMonsterType = Phaser.Utils.Array.GetRandom(monsterTypes);
      this.enemyMonster = new Monster(this, 400, 300, selectedMonsterType, 'random monster');
      
      this.scene.start("BattleScene", {
        background: this.background,
        enemyMonster: this.enemyMonster,
      });
    }
  }
  update() {
    // Logic for the map scene if needed
  }
}
