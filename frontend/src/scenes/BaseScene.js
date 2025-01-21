import Phaser from 'phaser';
import { createButton } from '../utils/uiUtils.js';

export default class BaseScene extends Phaser.Scene {
    constructor(key) {
        super({ key });
        this.sceneKey = key;
    }

    // Common preload logic
    preload() {
        this.loadBackgroundImage();
        this.loadSceneAssets();
    }

    // Override in child scenes to load specific background
    loadBackgroundImage() {
        if (this.getBackgroundKey()) {
            this.load.image(
                this.getBackgroundKey(), 
                `/assets/images/backGrounds/${this.getBackgroundKey()}.webp`
            );
        }
    }

    // Override in child scenes to load scene-specific assets
    loadSceneAssets() {}

    // Override in child scenes to specify background key
    getBackgroundKey() {
        return null;
    }

    // Common create logic
    create(data) {
        this.setupBackground();
        this.setupUI();
        this.setupSceneContent(data);
    }

    // Set up background with proper scaling
    setupBackground() {
        const bgKey = this.getBackgroundKey();
        if (bgKey && this.textures.exists(bgKey)) {
            this.background = this.add.image(400, 300, bgKey)
                .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        }
    }

    // Override in child scenes to set up scene-specific UI
    setupUI() {
        this.createBackButton();
    }

    // Override in child scenes to set up scene-specific content
    setupSceneContent(data) {}

    // Common back button creation
    createBackButton(targetScene = 'GameScene') {
        createButton(this, 700, 50, "Back", () => {
            this.handleSceneTransition(targetScene);
        });
    }

    // Handle scene transitions with player data
    handleSceneTransition(targetScene, extraData = {}) {
        const sceneData = {
            ...(this.player && { player: this.player.toJSON() }),
            ...extraData
        };
        this.scene.start(targetScene, sceneData);
    }

    // Clean up resources
    shutdown() {
        this.cleanup();
        super.shutdown();
    }

    // Override in child scenes for specific cleanup
    cleanup() {}
} 