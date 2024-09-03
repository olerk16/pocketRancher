import { InventoryComponent } from "../components/InventoryComponent.js";
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
    this.load.image("freezer", "assets/images/backGrounds/freezer.webp");
  }
  create() {
    this.add.image(400, 300, "freezer");
    const frozenMonsters = this.player.getFrozenMonsters();
    this.inventoryComponent = new InventoryComponent(
      this,
      100,
      100,
      620,
      150,
      frozenMonsters,
      100,
      20,
      0xbfe0ff,
      0x3fa1fc,
      this.unfreezeMonster.bind(this), // Callback for item click
      this.showInfo.bind(this), // Callback for item hover
      this.hideInfo.bind(this) // Callback for item out
    );
    // Create a text object to display the item description
    this.descriptionText = this.add
      .text(10, 10, "", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#8B4513",
        padding: { x: 10, y: 5 },
        wordWrap: { width: 300, useAdvancedWrap: true },
      })
      .setVisible(false); // Initially hidden
    this.addButtons();
  }

  freezeMonster() {
    const activeMonster = this.player.getActiveMonster();
    if (activeMonster) {
      this.player.freezeMonster(activeMonster); // Freeze the active monster
      const updatedFrozenMonsters = this.player.getFrozenMonsters();
      this.inventoryComponent.updateInventory(updatedFrozenMonsters); // Update inventory display after freezing
    } else {
      alert("No active monster to freeze.");
    }
  }

  unfreezeMonster(selectedMonster) {
   if(selectedMonster!== null && this.player.activeMonster === null){
      this.player.activeMonster = selectedMonster;
      console.log(`Unfroze ${selectedMonster}`);
      this.player.unfreezeMonster(selectedMonster);
      const updatedFrozenMonsters = this.player.getFrozenMonsters();
      this.inventoryComponent.updateInventory(updatedFrozenMonsters);
   }
  }

  combineMonster() {
    // Implement logic for combining monsters (if needed)
  }

  addButtons() {
    this.add
      .text(400, 50, "Monster Freezer", { fontSize: "32px", fill: "#000" })
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
 
  showInfo(monster) {
    // Update the text content
    this.descriptionText.setText(monster.type);

    // Get the width and height of the game canvas
    const { width, height } = this.scale;

    // Calculate the position for the bottom-right corner
    const textWidth = this.descriptionText.width;
    const textHeight = this.descriptionText.height;

    const posX = width - textWidth - 20; // 20px padding from the right
    const posY = height - textHeight - 20; // 20px padding from the bottom

    // Set the position of the text
    this.descriptionText.setPosition(posX - 200, posY);

    // Make the text visible
    this.descriptionText.setVisible(true);
  }

  hideInfo() {
    // Hide the description text
    this.descriptionText.setVisible(false);
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
