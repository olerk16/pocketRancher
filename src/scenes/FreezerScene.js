import { createButton, createImageButton } from "../utils/uiUtils.js";
class FreezerScene extends Phaser.Scene {
  constructor() {
    super({ key: "FreezerScene" });
  }
  init(data) {}
  preload() {}
  create() {
    this.add.image(400, 300, "freezer");
    this.createInventoryWindow();
    this.addButtons();
  }
  freezeMonster() {
    //player.activeMonster
  }
  unfreezeMonster() {}
  combineMonster() {}
  addButtons() {
    this.add
      .text(400, 100, "Monster Freezer", { fontSize: "32px", fill: "#000" })
      .setOrigin(0.5);
    const backButton = createButton(this, 700, 50, "Back", () => {
      this.scene.start("GameScene");
    });
    const freezeMonsterButton = createButton(this, 700, 150, "Freeze", () => {
      this.freezeMonster();
    });
    const unfreezeMonsterButton = createButton(this, 700, 250, "UnFreeze", () => {
      this.unfreezeMonster();
    });
    const combineMonsterButton = createButton(this, 700, 350, "Combine", () => {
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
      inventoryY,
      inventoryWidth,
      inventoryHeight,
      cornerRadius
    );

    // Draw the inventory slots
    const cols = 5;
    const rows = 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const slotX = inventoryX + slotPadding + col * (slotSize + slotPadding);
        const slotY = inventoryY + slotPadding + row * (slotSize + slotPadding);

        // Draw each slot as a smaller rounded rectangle
        graphics.fillStyle(0xffffff, 1); // White slots
        graphics.fillRoundedRect(slotX, slotY, slotSize, slotSize, 10);
      }
    }
  }
  update() {}
}
export default FreezerScene;
