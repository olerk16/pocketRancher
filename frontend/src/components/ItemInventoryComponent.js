import { InventoryComponent } from './InventoryComponent.js';

export class ItemInventoryComponent extends InventoryComponent {
    constructor(
        scene,
        x,
        y,
        width,
        height,
        items,
        slotSize = 80,
        padding = 20,
        backgroundColor = 0x2c3e50,  // Darker blue-gray background
        borderColor = 0x3498db,      // Light blue border
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
    }

    createInventoryWindow() {
        this.container = this.scene.add.container(this.x, this.y);

        // Create main background with rounded corners
        const background = this.scene.add.graphics();
        this.updateBackground(background);
        this.container.add(background);

        // Add title
        const title = this.scene.add.text(this.width / 2, 20, 'Market Items', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ecf0f1',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(title);

        // Create grid of slots
        this.createSlots();
    }

    createSlots() {
        this.slots = [];
        const startX = this.padding;
        const startY = this.padding + 40; // Add space for title

        this.items.forEach((item, index) => {
            const row = Math.floor(index / this.itemsPerRow);
            const col = index % this.itemsPerRow;
            const x = startX + col * (this.slotSize + this.padding);
            const y = startY + row * (this.slotSize + this.padding);

            const slot = this.createSlot(x, y, index);
            this.slots.push(slot);
            this.container.add(slot);
        });

        // Adjust container height based on number of rows
        const rows = Math.ceil(this.items.length / this.itemsPerRow);
        const newHeight = (rows * (this.slotSize + this.padding)) + this.padding + 40; // Add title height
        this.height = Math.max(this.height, newHeight);
        
        // Update background
        const bg = this.container.list[0];
        if (bg) {
            this.updateBackground(bg);
        }
    }

    createSlot(x, y, index) {
        const slot = this.scene.add.container(x, y);
        const item = this.items[index];

        // Create slot background with gradient effect
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

            // Add item name with better styling
            const nameText = this.scene.add.text(
                this.slotSize / 2,
                -5,
                item.name,
                {
                    fontSize: '14px',
                    fontFamily: 'Arial',
                    color: '#ecf0f1',
                    backgroundColor: '#2c3e50dd',
                    padding: { x: 6, y: 3 },
                    align: 'center'
                }
            ).setOrigin(0.5, 0);

            // Add price text with gold color
            const priceText = this.scene.add.text(
                this.slotSize / 2,
                this.slotSize + 5,
                `${item.price} 🪙`,
                {
                    fontSize: '14px',
                    fontFamily: 'Arial',
                    color: '#f1c40f',
                    backgroundColor: '#2c3e50dd',
                    padding: { x: 6, y: 3 },
                }
            ).setOrigin(0.5, 0);

            // Enhanced hover effects
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

            slot.add([image, nameText, priceText]);
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
}