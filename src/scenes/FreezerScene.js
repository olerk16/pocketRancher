// import { createButton, createImageButton } from "../utils/uiUtils.js";
// class FreezerScene extends Phaser.Scene {
//   constructor() {
//     super({ key: "FreezerScene" });
//     this.selectedMonsterIndex = null; // Track the currently selected monster index
//   }
//   init(data) {
//     this.player = data.player; // Get the player data passed from GameScene

//   }
//   preload() {}
//   create() {
//     this.add.image(400, 300, "freezer");
//     this.createInventoryWindow();
//     this.addButtons();
//   }
//   freezeMonster() {
//     const activeMonster = this.player.getActiveMonster();
//     if (activeMonster) {
//       this.player.freezeMonster(activeMonster); // Freeze the active monster
//       activeMonster.sprite.setVisible(false); // Hide the monster sprite in the freezer
//       console.log(`${activeMonster.name} has been frozen.`);
//       this.updateInventoryWindow(); // Update inventory display after freezing
//     } else {
//       alert("No active monster to freeze.");
//     }
//   }
//   unfreezeMonster() {
//     if (this.selectedMonsterIndex !== null) {
//       const frozenMonsters = this.player.getFrozenMonsters();
//       if (this.selectedMonsterIndex < frozenMonsters.length) {
//         const selectedMonster = frozenMonsters[this.selectedMonsterIndex];
//         this.player.unfreezeMonster(selectedMonster);
//         if (selectedMonster.sprite) {
//           selectedMonster.sprite.setVisible(true); // Show the monster sprite again
//         }
//         console.log(`${selectedMonster.name} has been unfrozen.`);
//         this.updateInventoryWindow(); // Update inventory display after unfreezing
//       } else {
//         alert("Invalid monster selection.");
//       }
//     } else {
//       alert("No frozen monster selected.");
//     }
//   }
//   combineMonster() {

//   }

//   addButtons() {
//     this.add
//       .text(400, 100, "Monster Freezer", { fontSize: "32px", fill: "#000" })
//       .setOrigin(0.5);

//     createButton(this, 700, 50, "Back", () => {
//       this.scene.start("GameScene", { player: this.player }); // Pass player data back to GameScene
//     });

//     createButton(this, 700, 150, "Freeze", () => {
//       this.freezeMonster();
//     });

//     createButton(this, 700, 250, "UnFreeze", () => {
//       this.unfreezeMonster();
//     });

//     createButton(this, 700, 350, "Combine", () => {
//       this.combineMonster();
//     });
    
//   }
//   createInventoryWindow() {
//     // Inventory window dimensions
//     const inventoryWidth = 460;
//     const inventoryHeight = 190;
//     const slotSize = 80;
//     const slotPadding = 10;
//     const cornerRadius = 20;

//     // Create the inventory container at the center of the screen
//     const inventoryX = (this.scale.width - inventoryWidth) / 2;
//     const inventoryY = (this.scale.height - inventoryHeight) / 2;

//     // Create the Graphics object for drawing
//     const graphics = this.add.graphics();

//     // Ice blue color for the background
//     const iceBlueColor = 0xace5ee;

//     // Draw the rounded rectangle for the inventory background
//     graphics.fillStyle(iceBlueColor, 1);
//     graphics.fillRoundedRect(
//       inventoryX,
//       inventoryY,
//       inventoryWidth,
//       inventoryHeight,
//       cornerRadius
//     );

//     // Draw the inventory slots and display frozen monsters
//     this.updateInventoryWindow();
//   }

//   updateInventoryWindow() {
//     // Clear previous inventory display
//     this.clearInventorySlots();

//     const cols = 5;
//     const rows = 2;
//     const slotSize = 80;
//     const slotPadding = 10;
//     const inventoryX = (this.scale.width - 460) / 2;
//     const inventoryY = (this.scale.height - 190) / 2;

//     let monsterIndex = 0;
//     const frozenMonsters = this.player.getFrozenMonsters();

//     for (let row = 0; row < rows; row++) {
//       for (let col = 0; col < cols; col++) {
//         const slotX = inventoryX + slotPadding + col * (slotSize + slotPadding);
//         const slotY = inventoryY + slotPadding + row * (slotSize + slotPadding);

//         // Draw each slot as a smaller rounded rectangle
//         const graphics = this.add.graphics();
//         graphics.fillStyle(0xffffff, 1); // White slots

//         // Highlight the selected slot with a different color
//         if (monsterIndex === this.selectedMonsterIndex) {
//           graphics.lineStyle(4, 0xff0000); // Red border for selected slot
//         } else {
//           graphics.lineStyle(2, 0x000000); // Default border
//         }

//         graphics.strokeRoundedRect(slotX, slotY, slotSize, slotSize, 10);
//         graphics.fillRoundedRect(slotX, slotY, slotSize, slotSize, 10);

//         if (monsterIndex < frozenMonsters.length) {
//           const monster = frozenMonsters[monsterIndex];
//           const monsterImage = this.add
//             .image(slotX + slotSize / 2, slotY + slotSize / 2, `${monster.type}Sprite`)
//             .setDisplaySize(75, 75)
//             .setInteractive({ useHandCursor: true })
//             .on("pointerdown", () => this.selectFrozenMonster(monsterIndex));
//         }

//         monsterIndex++;
        
//       }
//     }
//   }

//   clearInventorySlots() {
//     // Clear previous graphics and images for frozen monsters
//     this.children.each((child) => {
//       if (child.type === "Image" || child.type === "Graphics") {
//         child.destroy();
//       }
//     });
//   }

//   selectFrozenMonster(index) {
//     this.selectedMonsterIndex = index; // Update selected monster index
//     this.updateInventoryWindow(); // Refresh the inventory window to show selection
//   }

//   getSelectedFrozenMonster() {
//     return this.selectedMonsterIndex !== null
//       ? this.player.getFrozenMonsters()[this.selectedMonsterIndex]
//       : null;
//   }

//   update() {}
// }

// export default FreezerScene;

import { createButton } from "../utils/uiUtils.js";

class FreezerScene extends Phaser.Scene {
  constructor() {
    super({ key: "FreezerScene" });
    this.selectedMonsterIndex = null; // Initialize with no selection
  }

  init(data) {
    this.player = data.player; // Retrieve player data from GameScene
  }

  preload() {
    this.load.image('freezer', 'assets/images/backGrounds/freezer.webp');
  }

  create() {
    this.add.image(400, 300, "freezer");
    this.createInventoryWindow();
    this.addButtons();
  }

  freezeMonster() {
    const activeMonster = this.player.getActiveMonster();
    if (activeMonster) {
      this.player.freezeMonster(activeMonster); // Freeze the active monster
      this.updateInventoryWindow(); // Update inventory display after freezing
    } else {
      alert("No active monster to freeze.");
    }
  }

  unfreezeMonster() {
    const frozenMonsters = this.player.getFrozenMonsters();
    if (this.selectedMonsterIndex !== null && this.selectedMonsterIndex >= 0 && this.selectedMonsterIndex < frozenMonsters.length) {
      const selectedMonster = frozenMonsters[this.selectedMonsterIndex];
      if (selectedMonster) {
        this.player.unfreezeMonster(selectedMonster);
        console.log(`${selectedMonster.name} has been unfrozen.`);
        this.selectedMonsterIndex = null; // Reset selection after unfreezing
        this.updateInventoryWindow(); // Update inventory display after unfreezing
      } else {
        alert("Invalid monster selection.");
      }
    } else {
      alert("No frozen monster selected.");
    }
  }

  combineMonster() {
    // Implement logic for combining monsters (if needed)
  }

  addButtons() {
    this.add
      .text(400, 100, "Monster Freezer", { fontSize: "32px", fill: "#000" })
      .setOrigin(0.5);

    createButton(this, 700, 50, "Back", () => {
      this.scene.start("GameScene", { player: this.player }); // Pass player data back to GameScene
    });

    createButton(this, 700, 150, "Freeze", () => {
      this.freezeMonster();
    });

    createButton(this, 700, 250, "UnFreeze", () => {
      this.unfreezeMonster();
    });

    createButton(this, 700, 350, "Combine", () => {
      this.combineMonster();
    });
  }

  createInventoryWindow() {
    // Inventory window dimensions
    const inventoryWidth = 460;
    const inventoryHeight = 190;
    const slotSize = 80;
    const slotPadding = 10;
    const cornerRadius = 20;

    // Create the inventory container at the center of the screen
    const inventoryX = (this.scale.width - inventoryWidth) / 2;
    const inventoryY = (this.scale.height - inventoryHeight) / 2;

    // Create the Graphics object for drawing
    const graphics = this.add.graphics();

    // Ice blue color for the background
    const iceBlueColor = 0xace5ee;

    // Draw the rounded rectangle for the inventory background
    graphics.fillStyle(iceBlueColor, 1);
    graphics.fillRoundedRect(
      inventoryX,
      inventoryWidth,
      inventoryWidth,
      inventoryHeight,
      cornerRadius
    );

    // Draw the inventory slots and display frozen monsters
    this.updateInventoryWindow();
  }

  updateInventoryWindow() {
    // Clear previous inventory display
    this.clearInventorySlots();

    const cols = 5;
    const rows = 2;
    const slotSize = 80;
    const slotPadding = 10;
    const inventoryX = (this.scale.width - 460) / 2;
    const inventoryY = (this.scale.height - 190) / 2;

    let monsterIndex = 0;
    const frozenMonsters = this.player.getFrozenMonsters();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const slotX = inventoryX + slotPadding + col * (slotSize + slotPadding);
        const slotY = inventoryY + slotPadding + row * (slotSize + slotPadding);

        // Draw each slot as a smaller rounded rectangle
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1); // White slots

        // Highlight the selected slot with a different color
        if (monsterIndex === this.selectedMonsterIndex) {
          graphics.lineStyle(4, 0xff0000); // Red border for selected slot
        } else {
          graphics.lineStyle(2, 0x000000); // Default border
        }

        graphics.strokeRoundedRect(slotX, slotY, slotSize, slotSize, 10);
        graphics.fillRoundedRect(slotX, slotY, slotSize, slotSize, 10);

        if (monsterIndex < frozenMonsters.length) {
          const monster = frozenMonsters[monsterIndex];
          this.add
            .image(slotX + slotSize / 2, slotY + slotSize / 2, `${monster.type}Sprite`)
            .setDisplaySize(75, 75)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.selectFrozenMonster(monsterIndex));
        }

        monsterIndex++;
      }
    }
  }

  clearInventorySlots() {
    // Clear previous graphics and images for frozen monsters
    this.children.each((child) => {
      if (child.type === "Image" || child.type === "Graphics") {
        child.destroy();
      }
    });
  }

  selectFrozenMonster(index) {
    this.selectedMonsterIndex = index; // Update selected monster index
    this.updateInventoryWindow(); // Refresh the inventory window to show selection
  }

  getSelectedFrozenMonster() {
    return this.selectedMonsterIndex !== null
      ? this.player.getFrozenMonsters()[this.selectedMonsterIndex]
      : null;
  }

  update() {}
}

export default FreezerScene;
