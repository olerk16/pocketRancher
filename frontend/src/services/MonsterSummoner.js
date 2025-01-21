import { createButton } from '../utils/uiUtils.js';
import Monster from '../models/Monster.js';

export class MonsterSummoner {
    constructor(scene) {
        this.scene = scene;
        this.loadingText = null;
    }

    async summonMonster(offering = null) {
        this.showLoadingText();

        try {
            const monsterData = await this.fetchMonsterData(offering);
            this.hideLoadingText();
            await this.displayMonster(monsterData);
        } catch (error) {
            console.error('Error summoning monster:', error);
            this.handleError();
        }
    }

    showLoadingText() {
        this.loadingText = this.scene.add.text(400, 300, 'Summoning...', { 
            fontSize: '24px', 
            fill: '#FFF' 
        }).setOrigin(0.5);
    }

    hideLoadingText() {
        if (this.loadingText) {
            this.loadingText.destroy();
            this.loadingText = null;
        }
    }

    async fetchMonsterData(offering) {
        const response = await fetch('http://localhost:5000/api/monsters/generate-monster', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                offering: offering ? offering.type : null
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async displayMonster(monsterData) {
        const textureKey = `monster_${monsterData.uniqueKey}`;
        
        // Clear existing texture
        if (this.scene.textures.exists(textureKey)) {
            this.scene.textures.remove(textureKey);
        }

        // Load monster image
        this.scene.load.image(textureKey, `http://localhost:5000/${monsterData.imageUrl}`);
        
        // Wait for image to load
        return new Promise((resolve) => {
            this.scene.load.once('complete', () => {
                const monsterImage = this.scene.add.image(400, 300, textureKey)
                    .setOrigin(0.5)
                    .setScale(0.4);

                this.createKeepButton(monsterData);
                resolve();
            });
            this.scene.load.start();
        });
    }

    createKeepButton(monsterData) {
        createButton(this.scene, 400, 450, 'Keep Monster', () => {
            if (this.scene.player) {
                const monster = Monster.fromData(this.scene, {
                    name: monsterData.name,
                    type: monsterData.type,
                    favoriteFood: monsterData.favoriteFood,
                    imageURL: monsterData.imageUrl,
                    initialStats: monsterData.stats,
                    currentStats: monsterData.stats,
                    _id: monsterData.uniqueKey,
                    sprite: null
                });
                
                this.scene.player.monsters.push(monster);
                
                if (!this.scene.player.activeMonster) {
                    this.scene.player.activeMonster = monster;
                }

                this.scene.handleSceneTransition('GameScene');
            }
        });
    }

    handleError() {
        this.loadingText.setText('Failed to summon monster. Try again?');
        createButton(this.scene, 400, 350, 'Retry', () => {
            this.loadingText.destroy();
            this.summonMonster();
        });
    }
} 