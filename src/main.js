// src/main.js

import StartMenuScene from "./scenes/StartMenuScene.js";
import GameScene from "./scenes/GameScene.js";
import MarketBazaarScene from "./scenes/MarketBazaarScene.js";
import PlayerSetupScene from "./scenes/PlayerSetupScene.js";
import MapScene from "./scenes/MapScene.js";
import MonsterCemeteryScene from "./scenes/MonsterCemeteryScene.js";
import BattleScene from "./scenes/BattleScene.js";
import MonsterPortalScene from "./scenes/MonsterPortalScene.js";
import FreezerScene from "./scenes/FreezerScene.js";


// Define the Phaser game configuration
const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  parent: "game-container",
  scene: [
    StartMenuScene,
    GameScene,
    MarketBazaarScene,
    PlayerSetupScene,
    MapScene,
    MonsterCemeteryScene,
    BattleScene,
    MonsterPortalScene,
    FreezerScene
  ], // Include all scenes
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
};

// Create a new Phaser game with the configuration
const game = new Phaser.Game(config);
