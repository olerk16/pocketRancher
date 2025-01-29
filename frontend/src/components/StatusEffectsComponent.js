export default class StatusEffectsComponent {
    constructor(scene, monster, x = 10, y = 10) {
        this.scene = scene;
        this.monster = monster;
        this.x = x;
        this.y = y;

        // Create container for effects
        this.container = this.scene.add.container(this.x, this.y);
        
        // Create background
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x1a1a1a, 0.8);
        bg.lineStyle(2, 0x3498db, 1);
        bg.fillRoundedRect(0, 0, 440, 30, 10);  // Wider and shorter for horizontal layout
        bg.strokeRoundedRect(0, 0, 440, 30, 10);
        this.container.add(bg);

        // Add title
        const title = this.scene.add.text(10, 5, 'STATUS:', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ECF0F1',
            fontStyle: 'bold'
        });
        this.container.add(title);

        // Create text for effects
        this.effectsText = this.scene.add.text(80, 5, '', {
            fontSize: '14px',
            fontFamily: 'monospace',
            fill: '#ECF0F1',
            wordWrap: { width: 410 }
        });
        this.container.add(this.effectsText);

        this.updateEffects();
    }

    updateEffects() {
        if (!this.monster) return;

        const effects = [];
        
        // Status effects
        if (this.monster.hunger < 30) effects.push('🍖 Hungry');
        if (this.monster.happiness < 30) effects.push('😢 Unhappy');
        if (this.monster.energy < 30) effects.push('😴 Tired');
        if (this.monster.hygiene < 30) effects.push('🧼 Dirty');

        // Monster effects (if any)
        if (this.monster.statusEffects?.length > 0) {
            this.monster.statusEffects.forEach(effect => {
                effects.push(`⚡ ${effect}`);
            });
        }

        this.effectsText.setText(effects.join(' '));  // Horizontal separator
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
} 