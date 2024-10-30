export class InventoryComponent {
  constructor(
    scene,
    x,
    y,
    width,
    height,
    items,
    slotSize = 100,
    padding = 10,
    backgroundColor = 0xace5ee,
    slotColor = 0xffffff,
    onItemClick = null, // Callback for when an item is clicked
    onItemHover = null, // Callback for when an item is hovered over
    onItemOut = null // Callback for when the hover ends
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.items = items;
    this.slotSize = slotSize;
    this.padding = padding;
    this.backgroundColor = backgroundColor;
    this.slotColor = slotColor;
    this.onItemClick = onItemClick;
    this.onItemHover = onItemHover;
    this.onItemOut = onItemOut;

    this.container = this.scene.add.container(this.x, this.y);
    this.selectedSlots = []; // To keep track of selected slots
    this.slotGraphics = []; // To store slot graphics for easy reference
    this.createBackground();
    this.createSlots();
  }

  createBackground() {
    const graphics = this.scene.add.graphics();
    const cornerRadius = 20;

    graphics.fillStyle(this.backgroundColor, 1);
    graphics.fillRoundedRect(0, 0, this.width, this.height, cornerRadius);
    graphics.lineStyle(2, 0x000000, 1);
    graphics.strokeRoundedRect(0, 0, this.width, this.height, cornerRadius);

    this.container.add(graphics);
  }

  createSlots() {
    const cols = Math.floor(this.width / (this.slotSize + this.padding));
    const rows = Math.floor(this.height / (this.slotSize + this.padding));

    let itemIndex = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const slotX = this.padding + col * (this.slotSize + this.padding);
        const slotY = this.padding + row * (this.slotSize + this.padding);

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(this.slotColor, 1);
        graphics.fillRoundedRect(
          slotX,
          slotY,
          this.slotSize,
          this.slotSize,
          10
        );

        this.container.add(graphics);
        this.slotGraphics.push(graphics); // Store the reference to the slot graphics

        if (itemIndex < this.items.length) {
          const item = this.items[itemIndex];
          const itemImage = this.scene.add
            .image(
              slotX + this.slotSize / 2,
              slotY + this.slotSize / 2,
              item.spriteKey
            )
            .setDisplaySize(this.slotSize - 10, this.slotSize - 10)
            .setInteractive({ useHandCursor: true });

          // Use the provided callbacks for interactions
          if (this.onItemClick) {
            itemImage.on("pointerdown", () => this.onItemClick(item));
          }
          if (this.onItemHover) {
            itemImage.on("pointerover", () => this.onItemHover(item));
          }
          if (this.onItemOut) {
            itemImage.on("pointerout", () => this.onItemOut(item));
          }

          this.container.add(itemImage);

          itemIndex++;
        }
      }
    }
  }

  updateInventory(items) {
    this.items = items;
    this.container.removeAll(true);
    this.selectedSlots = [];
    this.slotGraphics = []; // Clear the slot graphics array
    this.createBackground();
    this.createSlots();
  }

  highlightSlot(slotIndex) {
    // Reset previously selected slots
    this.selectedSlots.forEach((index) => {
      this.slotGraphics[index].clear();
      this.slotGraphics[index].fillStyle(this.slotColor, 1);
      this.slotGraphics[index].fillRoundedRect(
        this.padding + (index % Math.floor(this.width / (this.slotSize + this.padding))) * (this.slotSize + this.padding),
        this.padding + Math.floor(index / Math.floor(this.width / (this.slotSize + this.padding))) * (this.slotSize + this.padding),
        this.slotSize,
        this.slotSize,
        10
      );
    });

    // Add the new slot to the selected slots
    this.selectedSlots.push(slotIndex);

    // If more than two slots are selected, reset the first one
    if (this.selectedSlots.length > 2) {
      this.selectedSlots.shift();
    }

    // Highlight the selected slots
    if (this.selectedSlots.length >= 1) {
      const firstSelectedIndex = this.selectedSlots[0];
      this.slotGraphics[firstSelectedIndex].clear();
      this.slotGraphics[firstSelectedIndex].fillStyle(0x00ff00, 1); // Green color for first selected
      this.slotGraphics[firstSelectedIndex].fillRoundedRect(
        this.padding + (firstSelectedIndex % Math.floor(this.width / (this.slotSize + this.padding))) * (this.slotSize + this.padding),
        this.padding + Math.floor(firstSelectedIndex / Math.floor(this.width / (this.slotSize + this.padding))) * (this.slotSize + this.padding),
        this.slotSize,
        this.slotSize,
        10
      );
    }

    if (this.selectedSlots.length === 2) {
      const secondSelectedIndex = this.selectedSlots[1];
      this.slotGraphics[secondSelectedIndex].clear();
      this.slotGraphics[secondSelectedIndex].fillStyle(0xff0000, 1); // Red color for second selected
      this.slotGraphics[secondSelectedIndex].fillRoundedRect(
        this.padding + (secondSelectedIndex % Math.floor(this.width / (this.slotSize + this.padding))) * (this.slotSize + this.padding),
        this.padding + Math.floor(secondSelectedIndex / Math.floor(this.width / (this.slotSize + this.padding))) * (this.slotSize + this.padding),
        this.slotSize,
        this.slotSize,
        10
      );
    }
  }
}
