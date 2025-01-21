import BaseScene from './BaseScene';
import { createButton } from '../utils/uiUtils.js';
import Monster from '../models/Monster.js';
import Player from '../models/Player.js';
import { OfferingSelection } from '../components/OfferingSelection.js';
import { MonsterSummoner } from '../services/MonsterSummoner.js';

export default class MonsterPortalScene extends BaseScene {
  constructor() {
    super('MonsterPortalScene');
    this.offeringSelection = null;
    this.monsterSummoner = null;
  }

  getBackgroundKey() {
    return 'portalBackground';
  }

  init(data) {
    if (!data || !data.player) {
      console.error('No player data provided to MonsterPortalScene');
      return;
    }
    this.player = Player.fromData(this, data.player);
    console.log('MonsterPortalScene initialized with player:', this.player);
  }

  setupSceneContent() {
    this.createTitle();
    this.setupOfferingSelection();
    this.createSummonButton();
    this.monsterSummoner = new MonsterSummoner(this);
  }

  createTitle() {
    this.add.text(400, 100, 'Monster Portal', { 
        fontSize: '32px', 
        fill: '#FFF' 
    }).setOrigin(0.5);
  }

  setupOfferingSelection() {
    if (this.player && this.player.hasOfferings()) {
        const offerings = this.player.getOfferings();
        if (offerings.length > 0) {
            this.offeringSelection = new OfferingSelection(
                this, 
                offerings,
                this.handleOfferingSelected.bind(this)
            );
        }
    }
  }

  handleOfferingSelected(offering) {
    console.log('Selected offering:', offering); // Debug log
    if (offering) {
        this.player.removeOffering(offering);
        this.summonMonster(offering);
    }
  }

  createSummonButton() {
    createButton(this, 400, 300, 'Summon Monster', () => this.summonMonster());
  }

  async summonMonster(offering = null) {
    const loadingText = this.add.text(400, 300, 'Summoning...', { 
        fontSize: '24px', 
        fill: '#FFF' 
    }).setOrigin(0.5);
  
    try {
        // Create request body with proper offering data
        const requestBody = {
            playerName: this.player.name,
            offering: offering ? offering.name : null,
            offeringDetails: offering ? {
                prompt: offering.prompt,
                rarity: offering.rarity,
                monsterTypes: offering.monsterTypes
            } : null
        };

        console.log('Sending request with body:', requestBody);

        const response = await fetch('http://localhost:5000/api/monsters/generate-monster', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const monsterData = await response.json();
        console.log('Received monster data:', monsterData);

        // Remove loading text
        loadingText.destroy();

        // Generate a unique texture key for this monster
        const textureKey = `monster_${monsterData.uniqueKey}`;

        // Clear any existing texture with this key
        if (this.textures.exists(textureKey)) {
            this.textures.remove(textureKey);
        }

        // Load the monster image with full URL
        const imageUrl = `http://localhost:5000/${monsterData.imageUrl}`;
        this.load.image(textureKey, imageUrl);
        
        // Wait for the image to load
        this.load.once('complete', () => {
            // Display the monster image
            const monsterImage = this.add.image(400, 300, textureKey)
                .setOrigin(0.5)
                .setScale(0.4);

            // Create the monster object with proper structure
            const newMonster = {
                name: monsterData.name,
                type: monsterData.type,
                favoriteFood: monsterData.favoriteFood,
                imageURL: monsterData.imageUrl, // Store the relative path
                initialStats: monsterData.stats,
                currentStats: monsterData.stats,
                _id: monsterData.uniqueKey,
                sprite: null,  // Will be created in GameScene
                types: monsterData.types // Include monster types
            };

            // Add "Keep Monster" button
            createButton(this, 400, 450, 'Keep Monster', () => {
                if (this.player) {
                    // Create a proper Monster instance
                    const monster = Monster.fromData(this, newMonster);
                    
                    // Add to player's monsters array
                    this.player.monsters.push(monster);
                    
                    // Set as active monster if none exists
                    if (!this.player.activeMonster) {
                        this.player.activeMonster = monster;
                    }

                    console.log('Added new monster to player:', monster);
                    
                    // Transition to GameScene with updated player data
                    this.scene.start('GameScene', { 
                        player: this.player.toJSON()
                    });
                } else {
                    console.error('No player data available');
                }
            });
        });

        this.load.start();

    } catch (error) {
        console.error('Error summoning monster:', error);
        loadingText.setText('Failed to summon monster. Try again?');
        
        createButton(this, 400, 350, 'Retry', () => {
            loadingText.destroy();
            this.summonMonster();
        });
    }
  }

  update(time, delta) {
    // Update logic if needed
  }
}
