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
    slotColor = 0xffffff
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

    this.container = this.scene.add.container(this.x, this.y);
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

        if (itemIndex < this.items.length) {
          const item = this.items[itemIndex];
          const itemImage = this.scene.add
            .image(
              slotX + this.slotSize / 2,
              slotY + this.slotSize / 2,
              item.name
            )
            .setDisplaySize(this.slotSize - 10, this.slotSize - 10)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.scene.buyItem(item))
            .on("pointerover", () => this.scene.showInfo(item))
            .on("pointerout", () => this.scene.hideInfo());

          this.container.add(itemImage);
          itemIndex++;
        }
      }
    }
  }

  updateInventory(items) {
    this.items = items;
    this.container.removeAll(true);
    this.createBackground();
    this.createSlots();
  }
}
