import { InventoryComponent } from './InventoryComponent.js';

export class GameInventoryComponent extends InventoryComponent {
    constructor(
        scene,
        x,
        y,
        width,
        height,
        items,
        slotSize = 60,  // Smaller slots for horizontal bar
        padding = 10,
        backgroundColor = 0x2c3e50,
        borderColor = 0x3498db,
        onItemClick = null,
        onItemHover = null,
        onItemHoverOut = null
    ) {
        super(scene, x, y, width, height, items, slotSize, padding, backgroundColor, borderColor);
        this.onItemClick = onItemClick;
        this.onItemHover = onItemHover;
        this.onItemHoverOut = onItemHoverOut;
        this.itemsPerRow = Math.floor((width - padding * 2) / (slotSize + padding));
        this.createInventoryWindow();
        this.setVisible(false); // Start hidden
    }

    createInventoryWindow() {
        // Calculate position for bottom of screen
        const gameHeight = this.scene.scale.height;
        const gameWidth = this.scene.scale.width;
        const inventoryHeight = this.slotSize + (this.padding * 2);
        
        // Position at bottom center
        this.container = this.scene.add.container(
            (gameWidth - this.width) / 2,  // Center horizontally
            gameHeight - inventoryHeight - 50  // 50px from bottom
        );

        // Create main background with semi-transparency
        const background = this.scene.add.graphics();
        background.fillStyle(this.backgroundColor, 0.9);  // Slightly transparent
        background.lineStyle(4, this.borderColor, 1);
        background.fillRoundedRect(0, 0, this.width, inventoryHeight, 12);
        background.strokeRoundedRect(0, 0, this.width, inventoryHeight, 12);
        this.container.add(background);

        // Create grid of slots
        this.createSlots();

        // Set initial visibility
        this.container.setVisible(this.visible);
    }

    createSlots() {
        this.slots = [];
        const startX = this.padding;
        const startY = this.padding;

        // Create fixed number of slots in a single row
        const totalSlots = 8;
        for (let i = 0; i < totalSlots; i++) {
            const x = startX + i * (this.slotSize + this.padding);
            const y = startY;

            const slot = this.createSlot(x, y, i);
            this.slots.push(slot);
            this.container.add(slot);
        }
    }

    createSlot(x, y, index) {
        const slot = this.scene.add.container(x, y);
        const item = this.items[index];

        // Create slot background
        const background = this.scene.add.graphics();
        background.fillStyle(0x34495e, 1);
        background.lineStyle(2, 0x3498db, 1);
        background.fillRoundedRect(0, 0, this.slotSize, this.slotSize, 8);
        background.strokeRoundedRect(0, 0, this.slotSize, this.slotSize, 8);
        slot.add(background);

        if (item) {
            // Add item image
            const image = this.scene.add.image(
                this.slotSize / 2,
                this.slotSize / 2,
                item.spriteKey
            );
            image.setDisplaySize(this.slotSize * 0.7, this.slotSize * 0.7);

            // Setup interactivity
            image.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.onItemClick && this.onItemClick(item))
                .on('pointerover', () => {
                    background.clear();
                    background.fillStyle(0x3498db, 0.3);
                    background.lineStyle(2, 0x3498db, 1);
                    background.fillRoundedRect(0, 0, this.slotSize, this.slotSize, 8);
                    background.strokeRoundedRect(0, 0, this.slotSize, this.slotSize, 8);
                    this.onItemHover && this.onItemHover(item);
                })
                .on('pointerout', () => {
                    background.clear();
                    background.fillStyle(0x34495e, 1);
                    background.lineStyle(2, 0x3498db, 1);
                    background.fillRoundedRect(0, 0, this.slotSize, this.slotSize, 8);
                    background.strokeRoundedRect(0, 0, this.slotSize, this.slotSize, 8);
                    this.onItemHoverOut && this.onItemHoverOut(item);
                });

            slot.add(image);
        }

        return slot;
    }

    updateBackground(graphics) {
        graphics.clear();
        graphics.fillStyle(this.backgroundColor, 0.95);
        graphics.lineStyle(4, this.borderColor, 1);
        graphics.fillRoundedRect(0, 0, this.width, this.height, 16);
        graphics.strokeRoundedRect(0, 0, this.width, this.height, 16);
    }

    resetSlots() {
        // Clear existing slots
        this.slots.forEach(slot => slot.destroy());
        this.slots = [];
        
        // Recreate slots with updated items
        this.createSlots();
    }
} 