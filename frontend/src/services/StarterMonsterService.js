import { createButton } from '../utils/uiUtils.js';
import Monster from '../models/Monster.js';

export class StarterMonsterService {
    constructor(scene) {
        this.scene = scene;
        this.loadingText = null;
    }

    async summonStarterMonster() {
        this.showLoadingText();

        try {
            const monsterData = await this.fetchStarterMonster();
            this.hideLoadingText();
            await this.displayStarterMonster(monsterData);
        } catch (error) {
            console.error('Error summoning starter monster:', error);
            this.handleError();
        }
    }

    showLoadingText() {
        this.loadingText = this.scene.add.text(400, 300, 'Summoning your first monster...', { 
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

    async fetchStarterMonster() {
        const response = await fetch('http://localhost:5000/api/monsters/starter-monster', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                offering: 'starter',
                offeringDetails: {
                    type: 'basic',
                    rarity: 'common',
                    monsterTypes: ['normal']
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async displayStarterMonster(monsterData) {
        const textureKey = `monster_${monsterData.uniqueKey}`;
        
        // Clear existing texture if it exists
        if (this.scene.textures.exists(textureKey)) {
            this.scene.textures.remove(textureKey);
        }

        // Load monster image
        this.scene.load.image(textureKey, `http://localhost:5000/${monsterData.imageURL}`);
        
        // Wait for image to load
        return new Promise((resolve) => {
            this.scene.load.once('complete', () => {
                const monsterImage = this.scene.add.image(400, 300, textureKey)
                    .setOrigin(0.5)
                    .setScale(0.4);

                this.createAcceptButton(monsterData);
                resolve();
            });
            this.scene.load.start();
        });
    }

    createAcceptButton(monsterData) {
        createButton(this.scene, 400, 450, 'Accept Your First Monster', () => {
            if (this.scene.player) {
                const monster = Monster.fromData(this.scene, {
                    name: monsterData.name,
                    type: monsterData.type,
                    favoriteFood: monsterData.favoriteFood,
                    imageURL: monsterData.imageURL,
                    initialStats: monsterData.initialStats,
                    currentStats: monsterData.currentStats,
                    _id: monsterData.uniqueKey,
                    sprite: null
                });
                
                this.scene.player.monsters.push(monster);
                this.scene.player.activeMonster = monster;
                this.scene.player.hasSeenWelcome = true;

                // Remove starter egg from inventory
                const starterEggIndex = this.scene.player.inventory.findIndex(
                    item => item.name === "Starter Egg"
                );
                if (starterEggIndex > -1) {
                    this.scene.player.inventory.splice(starterEggIndex, 1);
                }

                this.scene.handleSceneTransition('GameScene');
            }
        });
    }

    handleError() {
        this.loadingText.setText('Failed to summon your starter monster. Try again?');
        createButton(this.scene, 400, 350, 'Retry', () => {
            this.loadingText.destroy();
            this.summonStarterMonster();
        });
    }
} 