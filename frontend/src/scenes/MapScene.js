import BaseScene from './BaseScene';
import { createImageButton } from "../utils/uiUtils.js";
import Monster from "../models/Monster.js";
import DropdownMenu from '../components/DropDownMenu.js';

export default class MapScene extends BaseScene {
    constructor() {
        super('MapScene');
        this.enemyMonster = null;
    }

    getBackgroundKey() {
        return 'map';
    }

    loadSceneAssets() {
        this.load.image('battleButton', '/assets/images/icons/battleButton.png');
    }

    setupSceneContent() {
        this.createDropdownMenu();
    }

    createDropdownMenu() {
        const menuItems = [
            { text: "Start Battle", onClick: () => this.startBattleScene("level-1") },
            { text: "Back to Ranch", onClick: () => this.handleSceneTransition('GameScene') }
        ];

        this.dropdownMenu = new DropdownMenu(this, menuItems);
    }

    startBattleScene(level) {
        if (level === "level-1") {
            const battleData = this.prepareBattleData();
            this.handleSceneTransition("BattleScene", battleData);
        }
    }

    prepareBattleData() {
        const background = "desertFight";
        const monsterTypes = Object.keys(Monsters);
        const selectedMonsterType = Phaser.Utils.Array.GetRandom(monsterTypes);
        const enemyMonster = new Monster(this, 400, 300, selectedMonsterType, 'random monster');

        return {
            background,
            enemyMonster
        };
    }

    cleanup() {
        if (this.enemyMonster) {
            this.enemyMonster.destroy();
            this.enemyMonster = null;
        }
    }
}
