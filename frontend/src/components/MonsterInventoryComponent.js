import { InventoryComponent } from './InventoryComponent.js';

export class MonsterInventoryComponent extends InventoryComponent {
    constructor(scene, x, y, width, height, monsters, slotSize = 100, ...args) {
        super(scene, x, y, width, height, monsters, slotSize, ...args);
    }

    createSlot(x, y, index) {
        const slot = this.scene.add.container(x, y);

        const background = this.scene.add.rectangle(0, 0, this.slotSize, this.slotSize, this.backgroundColor);
        background.setStrokeStyle(1, this.borderColor);
        slot.add(background);

        if (this.items[index]) {
            const monster = this.items[index];
            const imageKey = `monster_${monster._id}`;
            
            if (this.scene.textures.exists(imageKey)) {
                const image = this.scene.add.image(0, 0, imageKey);
                image.setDisplaySize(this.slotSize - 10, this.slotSize - 10);
                slot.add(image);

                // Add monster name
                const nameText = this.scene.add.text(0, -this.slotSize/2 + 10, monster.name, {
                    fontSize: '12px',
                    fill: '#fff'
                }).setOrigin(0.5);
                slot.add(nameText);

                this.setupInteraction(image, background, monster);
            }
        }

        return slot;
    }

    setupInteraction(image, background, monster) {
        image.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.onSlotClick && this.onSlotClick(monster))
            .on('pointerover', () => {
                background.setFillStyle(0x444444);
                this.onSlotHover && this.onSlotHover(monster);
            })
            .on('pointerout', () => {
                background.setFillStyle(this.backgroundColor);
                this.onSlotHoverEnd && this.onSlotHoverEnd(monster);
            });
    }
} 