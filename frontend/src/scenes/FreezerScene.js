import BaseScene from './BaseScene';
import { createButton } from "../utils/uiUtils.js";
import { MonsterInventoryComponent } from '../components/MonsterInventoryComponent.js';
import DropdownMenu from '../components/DropDownMenu.js';

export default class FreezerScene extends BaseScene {
    constructor() {
        super('FreezerScene');
        this.selectedMonsters = [];
        this.currentModeText = null;
        this.modes = Object.freeze({
            UNFREEZE: "UNFREEZE",
            COMBINE: "COMBINE",
        });
        this.currentMode = this.modes.UNFREEZE;
    }

    getBackgroundKey() {
        return 'freezer';
    }

    init(data) {
        this.player = data.player;
    }

    setupSceneContent() {
        this.createTitle();
        this.createInventoryComponent();
        this.createDescriptionText();
        this.createDropdownMenu();
    }

    createTitle() {
        this.add
            .text(400, 50, "Monster Freezer", { 
                fontSize: "32px", 
                fill: "#00ffff",
                fontFamily: "monospace",
                backgroundColor: "#000000aa"
            })
            .setOrigin(0.5);
    }

    createInventoryComponent() {
        // Center the inventory horizontally
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height - 150;

        this.inventoryComponent = new MonsterInventoryComponent(
            this,
            centerX - 200,
            centerY,
            420,
            100,
            this.player.getFrozenMonsters(),
            70,
            10,
            0x000000,
            0x00ffff,
            this.OnMonsterSlotClicked.bind(this),
            this.showInfo.bind(this),
            this.hideInfo.bind(this)
        );
    }

    createDescriptionText() {
        this.descriptionText = this.add
            .text(10, 10, "", {
                fontSize: "16px",
                fill: "#ffffff",
                backgroundColor: "#8B4513",
                padding: { x: 10, y: 5 },
                wordWrap: { width: 300, useAdvancedWrap: true },
            })
            .setVisible(false);
    }

    createDropdownMenu() {
        const menuItems = [
            { text: "Toggle Stats", onClick: () => this.toggleStats() },
            { text: "Freeze Monster", onClick: () => this.freezeMonster() },
            { text: "Change Mode", onClick: () => this.changeMode() },
            { text: "Back to Ranch", onClick: () => this.handleSceneTransition('GameScene') }
        ];

        this.dropdownMenu = new DropdownMenu(this, menuItems);
    }

    toggleStats() {
        if (this.monsterStatsComponent) {
            this.monsterStatsComponent.toggle();
        }
    }

    changeMode() {
        if (this.currentMode === this.modes.UNFREEZE) {
            this.currentMode = this.modes.COMBINE;
        } else {
            this.currentMode = this.modes.UNFREEZE;
        }
        this.selectedMonsters = [];
        this.updateInventory();
        this.currentModeText.text = this.currentMode;
    }

    freezeMonster() {
        const activeMonster = this.player.getActiveMonster();
        if (activeMonster) {
            this.player.freezeMonster(activeMonster);
            this.updateInventory();
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
            this.handleMonsterSelection(selectedMonster, selectedIndex, frozenMonsters);
        }
    }

    unfreezeMonster(selectedMonster) {
        console.log(`Unfreezing ${selectedMonster.name} with stats:`, selectedMonster.currentStats);
        this.player.unfreezeMonster(selectedMonster);
        this.updateInventory();
    }

    handleMonsterSelection(selectedMonster, selectedIndex, frozenMonsters) {
        if (this.isSameMonsterSelectedTwice(selectedMonster)) {
            this.resetSelection(frozenMonsters);
        } else {
            this.addMonsterToSelection(selectedMonster, selectedIndex);

            if (this.selectedMonsters.length === 2) {
                this.combineMonsters();
                this.resetSelection(frozenMonsters);
            }
        }
    }

    isSameMonsterSelectedTwice(selectedMonster) {
        return (
            this.selectedMonsters.length > 0 &&
            this.selectedMonsters[this.selectedMonsters.length - 1] === selectedMonster
        );
    }

    resetSelection() {
        this.selectedMonsters = [];
        this.updateInventory();
    }

    addMonsterToSelection(selectedMonster, selectedIndex) {
        this.selectedMonsters.push(selectedMonster);
        if (selectedIndex !== -1) {
            this.inventoryComponent.highlightSlot(selectedIndex);
        }
    }

    updateInventory() {
        const updatedFrozenMonsters = this.player.getFrozenMonsters();
        this.inventoryComponent.updateInventory(updatedFrozenMonsters);
    }

    showInfo(monster) {
        if (!monster) return;

        const infoText = [
            `Name: ${monster.name}`,
            `Type: ${monster.type}`,
            `Life: ${monster.getLifeSpanPercentage()}`,
            `Hunger: ${monster.currentStats.hunger}`,
            `Happiness: ${monster.currentStats.happiness}`,
            `Energy: ${monster.currentStats.energy}`,
            `Hygiene: ${monster.currentStats.hygiene}`
        ].join('\n');

        this.descriptionText.setText(infoText);
        this.positionDescriptionText();
        this.descriptionText.setVisible(true);
    }

    positionDescriptionText() {
        const { width, height } = this.scale;
        const textWidth = this.descriptionText.width;
        const textHeight = this.descriptionText.height;
        const posX = width - textWidth - 220;
        const posY = height - textHeight - 20;
        this.descriptionText.setPosition(posX, posY);
    }

    hideInfo() {
        this.descriptionText.setVisible(false);
    }

    cleanup() {
        if (this.inventoryComponent) {
            this.inventoryComponent.destroy();
        }
        if (this.descriptionText) {
            this.descriptionText.destroy();
        }
    }

    preload() {
        super.preload();
        
        // Load monster images for frozen monsters
        const frozenMonsters = this.player?.getFrozenMonsters() || [];
        frozenMonsters.forEach(monster => {
            const monsterKey = `monster_${monster._id}`;
            if (!this.textures.exists(monsterKey)) {
                console.log('Loading frozen monster image:', monster.imageURL);
                this.load.image(monsterKey, monster.imageURL);
            }
        });
    }
}
