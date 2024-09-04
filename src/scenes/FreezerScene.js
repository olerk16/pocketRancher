import { InventoryComponent } from "../components/InventoryComponent.js";
import { createButton } from "../utils/uiUtils.js";

class FreezerScene extends Phaser.Scene {
  constructor() {
    super({ key: "FreezerScene" });
    this.selectedMonsters = []; // Initialize with no selection
    this.freezeCombineButton = null;
    this.currentModeText = null;
    this.modes = Object.freeze({
      UNFREEZE: "UNFREEZE",
      COMBINE: "COMBINE",
    });
    this.currentMode = this.modes.UNFREEZE;
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
      this.OnMonsterSlotClicked.bind(this), // Callback for item click
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
  addButtons() {
    this.add
      .text(400, 50, "Monster Freezer", { fontSize: "32px", fill: "#000" })
      .setOrigin(0.5);

    this.currentModeText = this.add
      .text(400, 500, `${this.currentMode}`, { fontSize: "32px", fill: "#000" })
      .setOrigin(0.5);
    createButton(this, 400, 450, "Back", () => {
      this.scene.start("GameScene", { player: this.player }); // Pass player data back to GameScene
    }).setOrigin(.5);

    createButton(this, 400, 400, "Freeze", () => {
      this.freezeMonster();
    }).setOrigin(.5);

    this.freezeCombineButton = createButton(
      this,
      400,
      350,
      "Change to unfreeze mode",
      () => {
        this.changeMode();
      }
    ).setOrigin(.5);
  }
  changeMode() {
    if (this.currentMode === this.modes.UNFREEZE) {
      this.currentMode = this.modes.COMBINE;
      this.freezeCombineButton.setText("Change to combine mode");
    } else {
      this.currentMode = this.modes.UNFREEZE;
      this.freezeCombineButton.setText("Change to unfreeze mode");
    }
    this.selectedMonsters = [];
    this.updateInventory()
    this.currentModeText.text = this.currentMode;
  }

  freezeMonster() {
    const activeMonster = this.player.getActiveMonster();
    if (activeMonster) {
      this.player.freezeMonster(activeMonster); // Freeze the active monster
      
      this.updateInventory() // Update inventory display after freezing
    } else {
      alert("No active monster to freeze.");
    }
  }

  OnMonsterSlotClicked(selectedMonster) {
    if (selectedMonster === null || this.player.activeMonster !== null) {
      return;
    }

    const frozenMonsters = this.player.getFrozenMonsters();
    const selectedIndex = frozenMonsters.indexOf(selectedMonster);

    if (this.currentMode === this.modes.UNFREEZE) {
      this.unfreezeMonster(selectedMonster);
    } else {
      this.handleMonsterSelection(
        selectedMonster,
        selectedIndex,
        frozenMonsters
      );
    }
  }

  unfreezeMonster(selectedMonster) {
    this.player.activeMonster = selectedMonster;
    console.log(`Unfroze ${selectedMonster}`);
    this.player.unfreezeMonster(selectedMonster);
    this.updateInventory();
  }

  handleMonsterSelection(selectedMonster, selectedIndex, frozenMonsters) {
    if (this.isSameMonsterSelectedTwice(selectedMonster)) {
      this.resetSelection(frozenMonsters);
    } else {
      this.addMonsterToSelection(selectedMonster, selectedIndex);

      if (this.selectedMonsters.length === 2) {
        console.log(
          "Selected two different monsters. Now you can combine them."
        );
        this.resetSelection(frozenMonsters); // Reset the selection after combining or performing any action
      }
    }
  }

  isSameMonsterSelectedTwice(selectedMonster) {
    return (
      this.selectedMonsters.length > 0 &&
      this.selectedMonsters[this.selectedMonsters.length - 1] ===
        selectedMonster
    );
  }

  resetSelection(frozenMonsters) {
    console.log("Same monster selected twice. Resetting selection.");
    this.selectedMonsters = [];
    this.updateInventory();
  }

  addMonsterToSelection(selectedMonster, selectedIndex) {
    this.selectedMonsters.push(selectedMonster);

    if (selectedIndex !== -1) {
      this.inventoryComponent.highlightSlot(selectedIndex);
    } else {
      console.log("Monster not found in the current inventory");
    }
  }

  updateInventory() {
    const updatedFrozenMonsters = this.player.getFrozenMonsters();
    this.inventoryComponent.updateInventory(updatedFrozenMonsters);
  }

  combineMonster() {
    // Implement logic for combining monsters (if needed)
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

  update() {}
}

export default FreezerScene;
