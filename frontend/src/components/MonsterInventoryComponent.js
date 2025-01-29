import { InventoryComponent } from './InventoryComponent.js';

export class MonsterInventoryComponent extends InventoryComponent {
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
        this.setVisible(true); // Start visible for portal scene
    }

    createInventoryWindow() {
        const inventoryHeight = this.slotSize + (this.padding * 2);
        
        // Create container
        this.container = this.scene.add.container(this.x, this.y);

        // Create main background with frosted glass effect
        const background = this.scene.add.graphics();
        background.fillStyle(this.backgroundColor, 0.7); // More transparent
        background.lineStyle(2, this.borderColor, 1);
        background.fillRoundedRect(0, 0, this.width, inventoryHeight, 8);
        background.strokeRoundedRect(0, 0, this.width, inventoryHeight, 8);
        
        // Add glow effect
        const glow = this.scene.add.graphics();
        glow.lineStyle(4, this.borderColor, 0.3);
        glow.strokeRoundedRect(-2, -2, this.width + 4, inventoryHeight + 4, 8);
        
        this.container.add(glow);
        this.container.add(background);
        this.createSlots();
    }

    createSlots() {
        this.slots = [];
        const startX = this.padding;
        const startY = this.padding;

        // Create 5 slots instead of 8
        const totalSlots = 5;
        for (let i = 0; i < totalSlots; i++) {
            const x = startX + i * (this.slotSize + this.padding);
            const y = startY;

            const slot = this.createSlot(i);
            this.slots.push(slot);
            this.container.add(slot);
        }
    }

    createSlot(index) {
        const slot = this.scene.add.container(
            this.padding + (index % this.itemsPerRow) * (this.slotSize + this.padding),
            this.padding + Math.floor(index / this.itemsPerRow) * (this.slotSize + this.padding)
        );

        const item = this.items[index];

        // Create slot background with cyberpunk style
        const background = this.scene.add.graphics();
        background.fillStyle(0x000000, 0.8);
        background.lineStyle(2, 0x00ffff, 1);
        background.fillRoundedRect(0, 0, this.slotSize, this.slotSize, 4);
        background.strokeRoundedRect(0, 0, this.slotSize, this.slotSize, 4);

        // Add inner glow
        const innerGlow = this.scene.add.graphics();
        innerGlow.lineStyle(1, 0x00ffff, 0.3);
        innerGlow.strokeRoundedRect(2, 2, this.slotSize - 4, this.slotSize - 4, 4);

        slot.add(background);
        slot.add(innerGlow);

        if (item) {
            // Add monster image with proper key
            const monsterKey = `monster_${item._id}`;
            if (this.scene.textures.exists(monsterKey)) {
                const image = this.scene.add.image(
                    this.slotSize / 2,
                    this.slotSize / 2,
                    monsterKey
                );
                
                // Scale image to fit slot
                const scale = Math.min(
                    (this.slotSize * 0.8) / image.width,
                    (this.slotSize * 0.8) / image.height
                );
                image.setScale(scale);

                // Make slot interactive
                image.setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => this.onItemClick && this.onItemClick(item))
                    .on('pointerover', () => {
                        background.clear();
                        background.fillStyle(0x00ffff, 0.3);
                        background.lineStyle(2, 0x00ffff, 1);
                        background.fillRoundedRect(0, 0, this.slotSize, this.slotSize, 4);
                        background.strokeRoundedRect(0, 0, this.slotSize, this.slotSize, 4);
                        this.onItemHover && this.onItemHover(item);
                    })
                    .on('pointerout', () => {
                        background.clear();
                        background.fillStyle(0x000000, 0.8);
                        background.lineStyle(2, 0x00ffff, 1);
                        background.fillRoundedRect(0, 0, this.slotSize, this.slotSize, 4);
                        background.strokeRoundedRect(0, 0, this.slotSize, this.slotSize, 4);
                        this.onItemHoverOut && this.onItemHoverOut(item);
                    });

                slot.add(image);
            } else {
                console.warn(`Monster image not found for key: ${monsterKey}`);
            }
        }

        return slot;
    }
} 