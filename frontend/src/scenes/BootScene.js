import { AssetConfig } from '../config/assetConfig.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Loading bar container
        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();
        
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width/4, height/2 - 30, width/2, 50);
        
        // Loading text
        const loadingText = this.add.text(width/2, height/2 - 50, 'Loading...', {
            font: '20px monospace',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
        
        // Percentage text
        const percentText = this.add.text(width/2, height/2 + 70, '0%', {
            font: '18px monospace',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        // Loading progress events
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ff00, 1);
            progressBar.fillRect(width/4 + 10, height/2 - 20, (width/2 - 20) * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });

        // Load complete event
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // Load all assets
        Object.entries(AssetConfig).forEach(([category, assets]) => {
            console.log(`📁 Loading ${category} assets...`);
            Object.entries(assets).forEach(([key, path]) => {
                console.log(`🔄 Loading ${key} from ${path}`);
                this.load.image(key, path);
            });
        });
    }

    create() {
        // Add some visual feedback
        const text = this.add.text(400, 300, 'Starting Game...', {
            font: '24px monospace',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        // Transition to StartMenuScene with a small delay
        this.time.delayedCall(1000, () => {
            this.scene.start('StartMenuScene');
        });
    }
} 