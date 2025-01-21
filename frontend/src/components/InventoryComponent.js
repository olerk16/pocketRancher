export class InventoryComponent {
    constructor(
        scene,
        x,
        y,
        width,
        height,
        items,
        slotSize = 80,
        padding = 10,
        backgroundColor = 0x222222,
        borderColor = 0x444444,
        onSlotClick = null,
        onSlotHover = null,
        onSlotHoverEnd = null
    ) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.items = items || [];
        this.slotSize = slotSize;
        this.padding = padding;
        this.backgroundColor = backgroundColor;
        this.borderColor = borderColor;
        this.onSlotClick = onSlotClick;
        this.onSlotHover = onSlotHover;
        this.onSlotHoverEnd = onSlotHoverEnd;
        this.container = null;
        this.slots = [];
        this.visible = true;

        // Calculate number of slots that can fit
        this.slotsPerRow = Math.floor((width - padding * 2) / (slotSize + padding));
        this.rows = Math.floor((height - padding * 2) / (slotSize + padding));
        this.maxSlots = this.slotsPerRow * this.rows;

        this.createInventoryWindow();
    }

    createInventoryWindow() {
        // Create background
        const bg = this.scene.add.rectangle(0, 0, this.width, this.height, this.backgroundColor, 0.8);
        bg.setOrigin(0);
        this.container = this.scene.add.container(this.x, this.y);
        this.container.add(bg);

        // Create border
        const border = this.scene.add.rectangle(0, 0, this.width, this.height, this.borderColor);
        border.setOrigin(0);
        border.setStrokeStyle(2, this.borderColor);
        this.container.add(border);

        // Create inventory slots
        this.createSlots();
    }

    createSlots() {
        for (let i = 0; i < this.maxSlots; i++) {
            const row = Math.floor(i / this.slotsPerRow);
            const col = i % this.slotsPerRow;

            const x = this.padding + col * (this.slotSize + this.padding);
            const y = this.padding + row * (this.slotSize + this.padding);

            const slot = this.createSlot(x, y, i);
            this.slots.push(slot);
            this.container.add(slot);
        }
    }

    createSlot(x, y, index) {
        // This is meant to be overridden by child classes
        const slot = this.scene.add.container(x, y);
        const background = this.scene.add.rectangle(0, 0, this.slotSize, this.slotSize, this.backgroundColor);
        background.setStrokeStyle(1, this.borderColor);
        slot.add(background);
        return slot;
    }

    updateInventory(newItems) {
        this.items = newItems;
        this.resetSlots();
    }

    resetSlots() {
        // Clear existing slots
        this.slots.forEach(slot => {
            if (slot && slot.destroy) {
                slot.destroy();
            }
        });
        this.slots = [];
        
        // Remove existing background and border
        this.container.removeAll(true);
        
        // Recreate the window
        this.createInventoryWindow();
    }

    highlightSlot(slotIndex) {
        // Reset previously selected slots
        this.slots.forEach((slot) => {
            slot.removeAll(true);
            slot.add(this.createSlot(this.x, this.y, slotIndex));
        });

        // Add the new slot to the selected slots
        this.slots.push(this.slots[slotIndex]);

        // If more than two slots are selected, reset the first one
        if (this.slots.length > 2) {
            this.slots.shift();
        }

        // Highlight the selected slots
        if (this.slots.length >= 1) {
            const firstSelectedIndex = this.slots.indexOf(this.slots[0]);
            this.slots[firstSelectedIndex].removeAll(true);
            this.slots[firstSelectedIndex].add(this.createSlot(this.x, this.y, firstSelectedIndex));
        }

        if (this.slots.length === 2) {
            const secondSelectedIndex = this.slots.indexOf(this.slots[1]);
            this.slots[secondSelectedIndex].removeAll(true);
            this.slots[secondSelectedIndex].add(this.createSlot(this.x, this.y, secondSelectedIndex));
        }
    }

    setVisible(visible) {
        this.visible = visible;
        if (this.container) {
            this.container.setVisible(visible);
        }
    }

    toggle() {
        this.setVisible(!this.visible);
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
        this.slots = [];
    }
} 